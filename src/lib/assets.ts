import type { Product } from './types';

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

function parseImageUrls(value: Product['image_urls']): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is string => typeof item === 'string')
      : [];
  } catch {
    return [];
  }
}

export function productGallery(product: Product): string[] {
  const candidates = [
    product.image_url,
    ...parseImageUrls(product.image_urls),
    product.image_url_2,
    product.image_url_3,
    product.image_url_4,
  ];
  const seen = new Set<string>();
  const urls: string[] = [];
  for (const candidate of candidates) {
    const url = assetUrl(candidate);
    if (!url || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
    if (urls.length === 4) break;
  }
  return urls;
}
