export const sortPartiturasByTitle = (partituras) => (
  [...partituras].sort((a, b) => a.titulo?.localeCompare(b.titulo, 'pt-BR'))
);

export const formatPartiturasResult = (total, search = '') => {
  const label = total === 1 ? 'partitura encontrada' : 'partituras encontradas';
  return `${total} ${label}${search ? ` para “${search}”` : ''}`;
};
