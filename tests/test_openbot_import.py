from datetime import timedelta
from importlib.util import module_from_spec, spec_from_file_location
from pathlib import Path
import sqlite3
import sys
import tempfile
import unittest
from unittest.mock import patch
from zipfile import ZipFile

scripts = Path(__file__).resolve().parents[1] / 'scripts'
sys.path.insert(0, str(scripts))
spec = spec_from_file_location('acervo_openbot', scripts / 'acervo-openbot.py')
importer = module_from_spec(spec)
spec.loader.exec_module(importer)


class ImportReviewTests(unittest.TestCase):
    def test_two_zip_files_with_same_inner_folder_are_separate(self):
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder).resolve()
            staged = root / 'staged'
            staged.mkdir()
            archives = [root / 'primeira.zip', root / 'segunda.zip']
            for index, archive in enumerate(archives):
                with ZipFile(archive, 'w') as zipped:
                    zipped.writestr('Partes/Grade.pdf', f'%PDF-1.4\n{index}')
            with patch.object(importer, 'ALLOWED_ROOTS', (root,)):
                groups = importer.stage(staged, [(str(path), None) for path in archives])
            self.assertEqual([[file['nome'] for file in group['arquivos']] for group in groups],
                             [['Grade.pdf'], ['Grade.pdf']])

    def test_outbound_preview_requires_all_parts_code_and_notice_destination(self):
        start = importer.stamp() - timedelta(minutes=1)
        sent = start + timedelta(seconds=10)
        end = importer.stamp()
        phrase = 'APROVO ACERVO ABCDEF1234'
        lines = ['Obra | 01. Grade.pdf → Grade', 'Obra | 02. Trompa.pdf → Trompa']
        target = {'nome': 'Grupo de teste'}
        with tempfile.TemporaryDirectory() as folder, sqlite3.connect(':memory:') as db:
            db.executescript("""
                CREATE TABLE projection_messaging_connections (connection_id, bot_user_id);
                CREATE TABLE projection_messaging_history
                    (connection_id, platform_channel_id, thread_key, author_id, sent_at, text);
                INSERT INTO projection_messaging_connections VALUES ('connection', 'bot');
            """)
            def add(author, body, timestamp=sent):
                db.execute('INSERT INTO projection_messaging_history VALUES (?, ?, ?, ?, ?, ?)',
                           ('connection', 'chat', 'dm', author, timestamp.isoformat(), body))

            with patch.object(importer, 'ROOT', Path(folder)), patch.object(
                importer, 'owner_chat', return_value=('connection', 'owner', 'chat'),
            ):
                def shown(parts=lines, destination=target):
                    return importer.preview_was_shown(db, phrase, parts, destination, start, end)

                self.assertFalse(shown([], None))
                add('owner', '\n'.join([phrase, target['nome'], *lines]))
                self.assertFalse(shown())
                add('bot', '\n'.join([phrase, *lines]))
                self.assertFalse(shown())
                add('bot', '\n'.join([phrase, target['nome'], *lines]), end + timedelta(seconds=1))
                self.assertFalse(shown())
                add('bot', '\n'.join([phrase, target['nome'], lines[0]]))
                self.assertTrue(shown())


if __name__ == '__main__':
    unittest.main()
