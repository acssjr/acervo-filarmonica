import { arquivosSelecionados, groupFilesByFolder, lerArquivosArrastados } from './batchParser';

const entry = name => ({
  isFile: true,
  file: resolve => queueMicrotask(() => resolve(new File(['%PDF'], name)))
});

function folder(name, ...batches) {
  return {
    name,
    isDirectory: true,
    createReader: () => {
      let index = 0;
      return { readEntries: resolve => queueMicrotask(() => resolve(batches[index++] || [])) };
    }
  };
}

test('captura cada entrada durante o drop e conserva PDFs da raiz e das subpastas em grupos distintos', async () => {
  let active = true;
  const roots = [
    folder('Acervo', [entry('Grade.pdf')], [folder('Dobrado Um', [entry('Flauta.PDF'), entry('leia-me.txt')])]),
    folder('Coleção', [folder('Dobrado Dois', [entry('Trombone.pdf')])])
  ];
  const result = lerArquivosArrastados({
    files: [],
    items: roots.map(root => ({ kind: 'file', webkitGetAsEntry: () => active ? root : null }))
  });
  active = false;
  const groups = groupFilesByFolder(await result);
  expect([...groups].map(([name, files]) => [name, files.map(item => item.file.name)])).toEqual([
    ['Acervo', ['Grade.pdf']],
    ['Acervo/Dobrado Um', ['Flauta.PDF']],
    ['Coleção/Dobrado Dois', ['Trombone.pdf']]
  ]);
});

test('aceita FileList e mostra erros de leitura em vez de travar', async () => {
  const pdf = new File(['%PDF'], 'Grade.pdf');
  Object.defineProperty(pdf, 'webkitRelativePath', { value: 'Obra/Grade.pdf' });
  expect(await lerArquivosArrastados({ files: [pdf], items: [] })).toEqual(arquivosSelecionados([pdf]));

  const unreadable = { isFile: true, file: (_resolve, reject) => reject(new Error('Sem acesso')) };
  await expect(lerArquivosArrastados({
    files: [],
    items: [{ kind: 'file', webkitGetAsEntry: () => unreadable }]
  })).rejects.toThrow('Sem acesso');
});

test('une a grade e as partes em subpastas de formato da mesma obra', async () => {
  const root = folder('Dobrado',
    [entry('Grade.pdf')],
    [folder('Partes', [entry('Flauta.pdf')]), folder('Outro Dobrado', [entry('Oboé.pdf')])]
  );
  const result = await lerArquivosArrastados({
    files: [],
    items: [{ kind: 'file', webkitGetAsEntry: () => root }]
  });
  expect([...groupFilesByFolder(result)].map(([name, files]) => [name, files.map(item => item.file.name)])).toEqual([
    ['Dobrado', ['Grade.pdf', 'Flauta.pdf']],
    ['Dobrado/Outro Dobrado', ['Oboé.pdf']]
  ]);
});
