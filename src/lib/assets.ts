export function assetUrl(path: string | null | undefined) {
  if (!path) return null;
  if (
    /^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(path) ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  )
    return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return path.startsWith('/') ? `${base}${path}` : `${base}/${path}`;
}
