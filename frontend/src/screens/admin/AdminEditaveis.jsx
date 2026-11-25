import { useCallback, useEffect, useState } from 'react';
import { API } from '@services/api';
import { useUI } from '@contexts/UIContext';
import './admin-editaveis.css';

export default function AdminEditaveis() {
  const { showToast } = useUI();
  const [obras, setObras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [destino, setDestino] = useState('');
  const load = useCallback(async () => {
    setError('');
    try {
      setObras(await API.getEditaveis());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  async function submit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (destino) data.delete('titulo');
    setBusy(true);
    try {
      const result = await API.uploadEditavel(destino, data);
      form.reset();
      setDestino(result.id);
      setQuery('');
      showToast('Versão guardada no acervo', 'success');
      await load();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function download(obra, versao) {
    try {
      const blob = await API.downloadEditavel(obra.id, versao.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = versao.arquivo_nome;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  const filter = value => value.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
  const visible = obras.filter(obra => filter(
    [obra.titulo, ...obra.versoes.flatMap(v => [v.arquivo_nome, v.metadados.compositor, v.metadados.creditos])].join(' ')
  ).includes(filter(query)));

  return (
    <section className="admin-editaveis" aria-labelledby="editaveis-title">
      <header>
        <h1 id="editaveis-title">Arquivos editáveis</h1>
        <p>Originais do Sibelius e do Finale disponíveis para administradores.</p>
      </header>
      <form className="admin-editaveis-panel admin-editaveis-form" onSubmit={submit}>
        <label>Obra
          <select value={destino} onChange={event => setDestino(event.target.value)} disabled={busy}>
            <option value="">Nova obra</option>
            {obras.map(obra => <option key={obra.id} value={obra.id}>{obra.titulo}</option>)}
          </select>
        </label>
        {!destino && <label>Título (opcional)
          <input name="titulo" maxLength={250} placeholder="Detectar pelo arquivo" disabled={busy} />
        </label>}
        <label>Arquivo original (.sib ou .musx)
          <input name="arquivo" type="file" accept=".sib,.musx" required disabled={busy} />
        </label>
        <button type="submit" disabled={busy}>{busy ? 'Enviando…' : destino ? 'Enviar nova versão' : 'Guardar original'}</button>
      </form>
      <label>Buscar nos editáveis
        <input type="search" value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      {loading && <p role="status">Carregando arquivos…</p>}
      {error && <p role="alert">{error} <button onClick={load}>Tentar novamente</button></p>}
      {!loading && !error && visible.length === 0 && <p>{query ? 'Nenhum arquivo encontrado.' : 'Nenhum original cadastrado.'}</p>}
      {visible.map(obra => {
        const atual = obra.versoes[0];
        return (
          <article className="admin-editaveis-panel" key={obra.id}>
            <h2>{obra.titulo}</h2>
            <button type="button" onClick={() => download(obra, atual)}>Baixar versão atual ({atual.formato.toUpperCase()})</button>
            <details>
              <summary>Histórico de versões ({obra.versoes.length})</summary>
              <ul>
                {obra.versoes.map((versao, index) => (
                  <li key={versao.id}>
                    <strong>Versão {obra.versoes.length - index}{index === 0 ? ' · Atual' : ''}</strong>
                    <span>{versao.arquivo_nome} · {new Date(versao.criado_em.replace(' ', 'T') + 'Z').toLocaleString('pt-BR')}</span>
                    <span>{[versao.metadados.titulo, versao.metadados.compositor || versao.metadados.creditos, versao.metadados.arranjador, versao.metadados.versao_formato && 'Formato ' + versao.metadados.versao_formato].filter(Boolean).join(' · ')}</span>
                    <small>Metadados obtidos de {versao.metadados.fonte}.</small>
                    {index > 0 && <button type="button" onClick={() => download(obra, versao)}>Baixar versão {obra.versoes.length - index}</button>}
                  </li>
                ))}
              </ul>
            </details>
          </article>
        );
      })}
    </section>
  );
}
