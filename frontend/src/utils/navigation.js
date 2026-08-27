export const getPostLoginDestination = (from) => {
  const pathname = typeof from === 'string' ? from : from?.pathname;
  if (
    typeof pathname !== 'string'
    || !pathname.startsWith('/')
    || pathname.startsWith('//')
    || pathname === '/login'
  ) {
    return '/';
  }

  const search = typeof from === 'object' && typeof from?.search === 'string' ? from.search : '';
  const hash = typeof from === 'object' && typeof from?.hash === 'string' ? from.hash : '';
  return `${pathname}${search}${hash}`;
};
