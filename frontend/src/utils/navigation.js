export const getPostLoginDestination = (from) => {
  const stringPathname = typeof from === 'string' ? from.split(/[?#]/, 1)[0] : null;
  const pathname = stringPathname ?? from?.pathname;
  const normalizedPathname = typeof pathname === 'string' && pathname.length > 1
    ? pathname.replace(/\/+$/, '')
    : pathname;
  if (
    typeof normalizedPathname !== 'string'
    || !normalizedPathname.startsWith('/')
    || normalizedPathname.startsWith('//')
    || normalizedPathname === '/login'
  ) {
    return '/';
  }

  if (typeof from === 'string') return from;
  const search = typeof from === 'object' && typeof from?.search === 'string' ? from.search : '';
  const hash = typeof from === 'object' && typeof from?.hash === 'string' ? from.hash : '';
  return `${pathname}${search}${hash}`;
};
