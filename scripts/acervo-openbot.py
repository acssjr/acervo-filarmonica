"""Prepare, review and publish approved Acervo batches on the OpenBot VPS."""

import argparse
import hashlib
import json
import os
import re
import secrets
import shutil
import sqlite3
import stat
import subprocess
import sys
import tempfile
import zipfile
from contextlib import ExitStack
from datetime import datetime, timedelta, timezone
from pathlib import Path, PurePosixPath
from acervo_openbot_notice import preflight


ROOT = Path(__file__).resolve().parent
HOME = Path('/data')
CONFIG = HOME / '.config/OpenBot'
DEPOSITS = ROOT / 'entradas'
QUEUE = ROOT / 'lotes'
ALLOWED_ROOTS = (CONFIG / 'messaging-downloads', HOME / 'OpenBot/Shared/Transfers', DEPOSITS)
MAX_PDF = 25 * 1024**2
MAX_BATCH = 64 * 1024**2
MAX_COUNT = 100


def run_node(action, payload):
    result = subprocess.run(
        [HOME / '.local/lib/acervo-digital/node', ROOT / 'acervo-openbot.mjs', action],
        input=json.dumps(payload), text=True, encoding='utf-8',
        capture_output=True, check=False,
        env={**os.environ, 'ACERVO_IMPORT_KEY_FILE': str(ROOT / '.import-key')},
    )
    if result.returncode:
        raise ValueError(result.stderr.strip() or 'Falha de comunicação com o Acervo.')
    return json.loads(result.stdout)


def save(path, data):
    with tempfile.NamedTemporaryFile(mode='w', encoding='utf-8', dir=path.parent, delete=False) as stream:
        json.dump(data, stream, ensure_ascii=False, indent=2)
    Path(stream.name).replace(path)


def load(path):
    return json.loads(path.read_text(encoding='utf-8'))


def stamp():
    return datetime.now(timezone.utc)


def file_hash(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def conversation():
    return sqlite3.connect(f'file:{CONFIG / "openbot.db"}?mode=ro', uri=True, timeout=5)


def owner_chat():
    settings = load(ROOT / 'canal.json')
    return settings['conexao'], settings['remetente'], settings['conversa']


def attachments(message_ids=()):
    with conversation() as db:
        rows = db.execute(
            """SELECT message_id, sent_at, files_json FROM projection_messaging_history
               WHERE connection_id = ? AND author_id = ? AND platform_channel_id = ?
                 AND thread_key = 'dm' AND length(files_json) > 2
               ORDER BY seq DESC LIMIT 100""",
            owner_chat(),
        ).fetchall()
    return [
        (message_id, sent_at, file)
        for message_id, sent_at, files in rows
        if not message_ids or message_id in message_ids
        for file in json.loads(files)
        if Path(file.get('name', '')).suffix.lower() in {'.pdf', '.zip'}
    ]


def stage(batch, sources, work_name=None):
    groups = {}
    total, count = 0, 0
    for source_number, (raw, label) in enumerate(sources):
        source = Path(raw).resolve(strict=True)
        original = Path(label) if label else source
        if not any(source.is_relative_to(root) and source != root for root in ALLOWED_ROOTS):
            raise ValueError('Use um anexo que o OpenBot baixou ou um arquivo da pasta de entradas do Acervo.')
        if work_name and (original.suffix.lower() != '.pdf' or not source.is_file()):
            raise ValueError('Use a opção --obra somente para agrupar PDFs avulsos.')

        def copy_pdf(stream, relative, size):
            nonlocal total, count
            count += 1
            total += size
            if not 5 <= size <= MAX_PDF or total > MAX_BATCH or count > MAX_COUNT:
                raise ValueError('O lote excede 100 PDFs, 25 MiB por arquivo ou 64 MiB no total.')
            prefix = stream.read(5)
            if prefix != b'%PDF-':
                raise ValueError(f'PDF inválido: {relative.name}.')
            dest = batch / f'{count:03}.pdf'
            with dest.open('xb') as out:
                out.write(prefix)
                remaining = stream.read(size - 4)
                if len(remaining) != size - 5:
                    raise ValueError(f'Tamanho inesperado: {relative.name}.')
                out.write(remaining)
            key = (0 if work_name else source_number, str(relative.parent))
            group = groups.setdefault(key, [])
            group.append({'nome': relative.name, 'local': str(dest), 'sha256': file_hash(dest)})

        if source.is_dir():
            for pdf in sorted(source.rglob('*')):
                if pdf.suffix.lower() != '.pdf' or not pdf.is_file():
                    continue
                relative = pdf.relative_to(source.parent)
                if any(part.startswith('.') for part in relative.parts):
                    continue
                if pdf.resolve() != pdf or not pdf.resolve().is_relative_to(source):
                    raise ValueError('A pasta contém um atalho para outro arquivo.')
                with pdf.open('rb') as stream:
                    copy_pdf(stream, relative, pdf.stat().st_size)
        elif original.suffix.lower() == '.zip' and source.is_file():
            if source.stat().st_size > MAX_BATCH:
                raise ValueError('O ZIP excede 64 MiB.')
            with zipfile.ZipFile(source) as archive:
                for file in archive.infolist():
                    relative = PurePosixPath(file.filename.replace('\\', '/'))
                    if file.is_dir() or relative.suffix.lower() != '.pdf':
                        continue
                    if relative.is_absolute() or '..' in relative.parts or stat.S_ISLNK(file.external_attr >> 16):
                        raise ValueError('O ZIP contém um caminho de PDF inseguro.')
                    if any(part.startswith('.') or part == '__MACOSX' for part in relative.parts):
                        continue
                    if len(relative.parts) == 1:
                        relative = PurePosixPath(original.stem) / relative
                    with archive.open(file) as stream:
                        copy_pdf(stream, relative, file.file_size)
        elif original.suffix.lower() == '.pdf' and source.is_file():
            with source.open('rb') as stream:
                copy_pdf(stream, PurePosixPath(work_name or original.stem, original.name), source.stat().st_size)
        else:
            raise ValueError('Formato esperado: PDF, ZIP ou pasta com PDFs.')

    if not groups:
        raise ValueError('Nenhum PDF válido encontrado.')
    return [{'pasta': folder, 'arquivos': files} for (_, folder), files in groups.items()]


def view(data):
    """Omit private filesystem paths from output meant for the agent."""
    output = json.loads(json.dumps(data))
    for work in output.get('obras', []):
        for file in work['arquivos']:
            file.pop('local', None)
    print(json.dumps(output, ensure_ascii=False, indent=2))


def pending_previews(at):
    for path in QUEUE.glob('*/previa.json'):
        sealed = load(path)
        sealed_at = datetime.fromisoformat(sealed['data'])
        draft_path = path.with_name('rascunho.json')
        if not sealed_at <= at <= sealed_at + timedelta(days=7) or sealed['hash'] != file_hash(draft_path):
            continue
        draft = load(draft_path)
        manifest = path.with_name('publicacao.json')
        if manifest.exists() and manifest.stat().st_mtime <= at.timestamp():
            record = load(manifest)
            if len(record) == len(draft['obras']) and all(
                entry['estado'] == 'publicada' for entry in record.values()
            ):
                continue
        yield path.parent, draft, sealed


def openbot_approvals(db, phrase):
    settings_path = ROOT / 'aprovacao-openbot.json'
    if not settings_path.exists():
        return []
    settings = load(settings_path)
    return db.execute(
        """SELECT m.message_id, m.created_at, UPPER(TRIM(json_extract(m.message_json, '$.text'))),
                  'openbot', CASE WHEN json_extract(m.message_json, '$.replyToMessageId') IS NOT NULL
                       THEN COALESCE(json_extract(reply.message_json, '$.text'), '') END
           FROM projection_thread_messages m
           JOIN projection_threads t ON t.thread_id = m.thread_id
           LEFT JOIN projection_agent_threads topic ON topic.thread_id = t.thread_id
           LEFT JOIN projection_thread_messages reply ON reply.thread_id = m.thread_id
                AND reply.message_id = json_extract(m.message_json, '$.replyToMessageId')
                AND reply.author = 'assistant' AND reply.item_type = 'final_answer'
           WHERE t.agent_id = ? AND (topic.origin IS NULL OR topic.origin = 'user')
             AND m.author = 'user' AND m.status = 'completed' AND m.item_type IS NULL AND m.created_at >= ?
             AND json_extract(m.message_json, '$.source') = 'user'
             AND json_extract(m.message_json, '$.senderMember.id') = ?
             AND UPPER(TRIM(json_extract(m.message_json, '$.text'))) IN (?, 'APROVO', 'APROVO ACERVO')""",
        (settings['agente'], settings['ativo_desde'], settings['membro'], phrase),
    ).fetchall()


def preview_parts(draft):
    lines = []
    for work in draft['obras']:
        if work['tipo'] != 'partes':
            continue
        title = ' '.join(work['titulo'].split())
        for number, file in enumerate(work['arquivos'], 1):
            name = ' '.join(file['nome'].split())
            lines.append(f'{title} | {number:02d}. {name} → {file["instrumento"]}')
    return lines


def preview_was_shown(db, phrase, lines, target, after, until):
    connection, _, chat = owner_chat()
    start, end = (value.isoformat() for value in (after, until))
    rows = db.execute(
        """SELECT h.text FROM projection_messaging_history h
           JOIN projection_messaging_connections c ON c.connection_id = h.connection_id
           WHERE h.connection_id = ? AND h.platform_channel_id = ? AND h.thread_key = 'dm'
             AND h.author_id = c.bot_user_id AND julianday(h.sent_at) BETWEEN julianday(?) AND julianday(?)
             AND instr(h.text, ?) > 0""",
        (connection, chat, start, end, phrase),
    ).fetchall()
    settings = ROOT / 'aprovacao-openbot.json'
    if settings.exists():
        rows += db.execute(
            """SELECT json_extract(m.message_json, '$.text')
               FROM projection_thread_messages m JOIN projection_threads t USING(thread_id)
               WHERE t.agent_id = ? AND m.author = 'assistant' AND m.status = 'completed'
                 AND m.item_type = 'final_answer' AND julianday(m.created_at) BETWEEN julianday(?) AND julianday(?)
                 AND instr(json_extract(m.message_json, '$.text'), ?) > 0""",
            (load(settings)['agente'], start, end, phrase),
        ).fetchall()
    messages = [message for (message,) in rows]
    if not messages or (target and not any(target['nome'] in message for message in messages)):
        return False
    visible = {line.strip() for message in messages for line in message.splitlines()}
    return all(line in visible for line in lines)


def approve(batch, phrase, after, db_path):
    if stamp() > after + timedelta(days=7):
        raise ValueError('A prévia expirou.')
    with sqlite3.connect(f'file:{db_path}?mode=ro', uri=True, timeout=5) as db:
        candidates = db.execute(
            """SELECT message_id, sent_at, UPPER(TRIM(text)), 'whatsapp', NULL FROM projection_messaging_history
               WHERE connection_id = ? AND author_id = ? AND platform_channel_id = ?
                 AND thread_key = 'dm' AND UPPER(TRIM(text)) IN (?, 'APROVO ACERVO')
               ORDER BY seq DESC""",
            (*owner_chat(), phrase),
        ).fetchall()
        candidates += openbot_approvals(db, phrase)
    sealed = load(batch / 'previa.json')
    blocked_reason = None
    for message_id, sent_at, text, channel, quoted_preview in sorted(
        candidates, key=lambda row: datetime.fromisoformat(row[1]), reverse=True,
    ):
        sent = datetime.fromisoformat(sent_at)
        if not after <= sent <= after + timedelta(days=7):
            continue
        if text != phrase:
            quoted_codes = set(re.findall(r'\bAPROVO ACERVO ([A-F0-9]{10})\b', (quoted_preview or '').upper()))
            if quoted_preview is not None and quoted_codes != {phrase.split()[-1]}:
                continue
            if not quoted_codes and [folder for folder, _, _ in pending_previews(sent)] != [batch]:
                blocked_reason = 'A aprovação curta não identifica uma única prévia. Responda à prévia ou use o código.'
                continue
        with sqlite3.connect(f'file:{db_path}?mode=ro', uri=True, timeout=5) as db:
            if not preview_was_shown(db, phrase, sealed.get('partes_revisao', []),
                                     sealed.get('aviso_whatsapp'), after, sent):
                blocked_reason = 'Mostre a prévia completa com o código e o destino do aviso antes de pedir nova aprovação.'
                continue
        save(batch / 'aprovacao.json', {'message_id': message_id, 'sent_at': sent_at, 'canal': channel})
        return
    if blocked_reason:
        raise ValueError(blocked_reason)
    raise ValueError(f'Aguardando aprovação no chat do Acervo no OpenBot ou no WhatsApp privado. Código: {phrase}.')


def review(draft, edits):
    for index, updates in edits.items():
        number = int(index)
        if not 1 <= number <= len(draft['obras']):
            raise ValueError('Número de obra inválido.')
        work = draft['obras'][number - 1]
        for field, value in updates.items():
            if field in {'titulo', 'compositor', 'arranjador', 'categoria', 'ano', 'tipo'}:
                work[field] = str(value).strip()
            elif field == 'instrumentos':
                for file_index, instrument in value.items():
                    number = int(file_index)
                    if not 1 <= number <= len(work['arquivos']):
                        raise ValueError('Número de arquivo inválido.')
                    work['arquivos'][number - 1]['instrumento'] = str(instrument).strip()
            else:
                raise ValueError(f'Campo de revisão desconhecido: {field}')
    draft['obras'] = run_node('revisar', draft['obras'])


def notify_published(record, target, manifest):
    for entry in record.values():
        current = entry.get('aviso_whatsapp', {})
        if current.get('estado') in {'enviado', 'enviando', 'incerto'}:
            continue
        try:
            bridge, payload = preflight(entry['url'], target)
        except (OSError, ValueError, KeyError, TypeError):
            entry['aviso_whatsapp'] = {'estado': 'pendente', 'grupo': target['nome'],
                                       'motivo': 'Card ou WhatsApp indisponível antes do envio.'}
            save(manifest, record)
            continue

        entry['aviso_whatsapp'] = {'estado': 'enviando', 'grupo': target['nome']}
        save(manifest, record)
        try:
            response = bridge.media(payload, dry_run=False)
            message_id = response.get('id') or response.get('message_id')
            if response.get('sent') is not True and not message_id:
                raise ValueError('Envio sem confirmação do WhatsApp.')
            entry['aviso_whatsapp'] = {'estado': 'enviado', 'grupo': target['nome']}
            if message_id:
                entry['aviso_whatsapp']['mensagem'] = message_id
        except (OSError, ValueError, KeyError, TypeError):
            entry['aviso_whatsapp'] = {'estado': 'incerto', 'grupo': target['nome'],
                                       'motivo': 'Confirme pelo histórico antes de qualquer reenvio.'}
        save(manifest, record)


def publish(batch, draft):
    manifest = batch / 'publicacao.json'
    approved = load(batch / 'previa.json')
    record = load(manifest) if manifest.exists() else {}
    if any(entry.get('estado') == 'enviando' for entry in record.values()):
        raise ValueError('Uma tentativa ficou sem confirmação. Confira o cadastro no painel antes de qualquer reenvio.')
    target = approved.get('aviso_whatsapp')
    configured_target = ROOT / 'aviso.json'
    allowed = bool(target and configured_target.exists() and load(configured_target) == target)
    if len(record) == len(draft['obras']) and (
        not allowed or all(entry.get('aviso_whatsapp', {}).get('estado') in {'enviado', 'enviando', 'incerto'}
                           for entry in record.values())
    ):
        return record
    pending = [work for index, work in enumerate(draft['obras'], 1) if str(index) not in record]
    if pending and approved.get('partes_revisao') != preview_parts(draft):
        raise ValueError('Gere uma nova prévia com a relação completa dos PDFs antes de publicar.')
    phrase = 'APROVO ACERVO ' + approved['codigo']
    approve(batch, phrase, datetime.fromisoformat(approved['data']), CONFIG / 'openbot.db')
    checked = run_node('revisar', pending) if pending else []
    if any(work['pendencias'] for work in checked):
        raise ValueError('A revisão antes de publicar encontrou conflito no catálogo. Prepare nova prévia.')
    for work in pending:
        for file in work['arquivos']:
            if file_hash(Path(file['local'])) != file['sha256']:
                raise ValueError('Um PDF mudou após a revisão. Prepare nova prévia.')
    for index, work in enumerate(draft['obras'], 1):
        key = str(index)
        if key in record:
            continue
        record[key] = {'estado': 'enviando', 'titulo': work['titulo']}
        save(manifest, record)
        score_id = run_node('enviar', work)
        record[key] = {
            'estado': 'publicada', 'titulo': work['titulo'], 'id': score_id,
            'url': f"https://acervo.filarmonica25demarco.com/acervo/{work['categoria']}/{score_id}",
        }
        save(manifest, record)
    if allowed:
        notify_published(record, target, manifest)
    return record


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--obra', help='Nome da pasta virtual que agrupa PDFs avulsos.')
    parser.add_argument('acao', choices=[
        'recebidos', 'preparar-whatsapp', 'preparar', 'localizar-previa', 'ver', 'revisar', 'selar', 'publicar',
    ])
    parser.add_argument('args', nargs='*')
    options = parser.parse_args()
    if options.obra and (options.acao not in {'preparar', 'preparar-whatsapp'} or
                         options.obra in {'.', '..'} or re.search(r'[/\\]', options.obra)):
        raise ValueError('Use --obra com um nome de pasta simples ao preparar PDFs de uma mesma obra.')
    os.umask(0o077)
    for path in (DEPOSITS, QUEUE):
        path.mkdir(exist_ok=True)
    if options.acao == 'recebidos':
        print(json.dumps([{'mensagem': message_id, 'data': sent_at, 'nome': file['name'],
                           'disponivel': bool(file.get('path') and Path(file['path']).is_file())}
                          for message_id, sent_at, file in attachments()[:20]], ensure_ascii=False, indent=2))
        return
    if options.acao == 'localizar-previa':
        if not options.args:
            pending = list(pending_previews(stamp()))
            if not pending:
                raise ValueError('Nenhuma prévia vigente aguardando aprovação.')
            if len(pending) > 1:
                print(json.dumps([{'obras': [work['titulo'] for work in draft['obras']],
                                   'codigo': sealed['codigo']} for _, draft, sealed in pending],
                                 ensure_ascii=False, indent=2))
                raise ValueError('Há mais de uma prévia pendente. Peça o código da obra desejada.')
            _, draft, sealed = pending[0]
            show_approval(draft, sealed)
            view(draft)
            return
        if len(options.args) != 1 or not re.fullmatch(r'[A-F0-9]{10}', options.args[0].upper()):
            raise ValueError('Informe o código da prévia.')
        matches = []
        for preview in QUEUE.glob('*/previa.json'):
            sealed = load(preview)
            if sealed['codigo'] != options.args[0].upper():
                continue
            draft_path = preview.with_name('rascunho.json')
            if (stamp() <= datetime.fromisoformat(sealed['data']) + timedelta(days=7)
                    and sealed['hash'] == file_hash(draft_path)):
                matches.append(load(draft_path))
        if len(matches) != 1:
            raise ValueError('Código sem prévia vigente correspondente.')
        draft = matches[0]
        show_approval(draft, load(QUEUE / draft['lote'] / 'previa.json'))
        view(draft)
        return
    if options.acao in {'preparar', 'preparar-whatsapp'}:
        if not options.args:
            raise ValueError('Informe pelo menos um ID de mensagem, arquivo ou pasta.')
        sources = [(raw, None) for raw in options.args]
        if options.acao == 'preparar-whatsapp':
            files = attachments(options.args)
            if {message_id for message_id, _, _ in files} != set(options.args) or any(not file.get('path') for _, _, file in files):
                raise ValueError('O OpenBot ainda não disponibilizou todos os PDFs ou ZIPs dessas mensagens.')
            sources = [(file['path'], file['name']) for _, _, file in files]
        code = secrets.token_hex(6)
        batch = QUEUE / code
        batch.mkdir()
        try:
            draft = run_node('preparar', stage(batch, sources, options.obra))
            draft['lote'] = code
            save(batch / 'rascunho.json', draft)
        except Exception:
            shutil.rmtree(batch)
            raise
        view(draft)
        return

    if not options.args or not re.fullmatch(r'[0-9a-f]{12}', options.args[0]):
        raise ValueError('Informe o ID de lote exibido em preparar.')
    batch = QUEUE / options.args[0]
    import fcntl

    with ExitStack() as locks:
        if options.acao == 'publicar':
            queue_lock = locks.enter_context((QUEUE / '.publicacao.lock').open('a'))
            fcntl.flock(queue_lock, fcntl.LOCK_EX)
        lock = locks.enter_context((batch / '.lock').open('a'))
        fcntl.flock(lock, fcntl.LOCK_EX)
        draft_path = batch / 'rascunho.json'
        preview = batch / 'previa.json'
        draft = load(draft_path)
        if options.acao == 'ver':
            if preview.exists():
                show_approval(draft, load(preview))
            view(draft)
        elif options.acao == 'revisar':
            if preview.exists():
                raise ValueError('A prévia está selada. Para mudar o conteúdo, crie outro lote.')
            review(draft, json.load(sys.stdin))
            save(draft_path, draft)
            view(draft)
        elif options.acao == 'selar':
            old_preview = preview.exists() and 'partes_revisao' not in load(preview)
            if old_preview and (batch / 'publicacao.json').exists():
                raise ValueError('Este lote já tem publicação registrada.')
            if not preview.exists() or old_preview:
                draft['obras'] = run_node('revisar', draft['obras'])
                if any(work['pendencias'] for work in draft['obras']):
                    view(draft)
                    raise ValueError('Resolva as pendências antes de solicitar aprovação.')
                save(draft_path, draft)
                sealed = {'codigo': secrets.token_hex(5).upper(), 'data': stamp().isoformat(),
                          'hash': file_hash(draft_path), 'partes_revisao': preview_parts(draft)}
                target_path = ROOT / 'aviso.json'
                if target_path.exists():
                    sealed['aviso_whatsapp'] = load(target_path)
                save(preview, sealed)
            show_approval(draft, load(preview))
            view(draft)
        elif options.acao == 'publicar':
            if not preview.exists() or load(preview)['hash'] != file_hash(draft_path):
                raise ValueError('Gere uma prévia válida antes de publicar.')
            print(json.dumps(publish(batch, draft), ensure_ascii=False, indent=2))


def show_approval(draft, sealed):
    draft['aprovacao'] = 'APROVO ACERVO ' + sealed['codigo']
    draft['relacao_para_exibir_antes_de_aprovar'] = sealed.get('partes_revisao', [])
    draft['aprovacao_sem_codigo'] = {
        'openbot': 'APROVO no chat do Acervo, como resposta à prévia ou quando houver uma única prévia pendente.',
        'whatsapp': 'APROVO ACERVO no WhatsApp privado, quando houver uma única prévia pendente.',
    }
    if sealed.get('aviso_whatsapp'):
        draft['aviso_whatsapp'] = {
            'grupo': sealed['aviso_whatsapp']['nome'],
            'formato': 'Uma mensagem por obra com o card e o link.',
        }


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, zipfile.BadZipFile, sqlite3.Error, TypeError, IndexError) as error:
        raise SystemExit(str(error)) from error
