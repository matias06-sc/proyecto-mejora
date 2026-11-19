import type { Page } from '@/lib/types';

export function pageFromHash(): Page {
  const rawHash = window.location.hash.replace(/^#/, '');
  const queryIndex = rawHash.indexOf('?');
  const hashPath = queryIndex >= 0 ? rawHash.slice(0, queryIndex) : rawHash;
  const hashParams = new URLSearchParams(queryIndex >= 0 ? rawHash.slice(queryIndex + 1) : '');
  const searchParams = new URLSearchParams(window.location.search);
  const getParam = (key: string) => hashParams.get(key) ?? searchParams.get(key);

  if (hashPath === '/pago/resultado') {
    const rawStatus = getParam('collection_status') ?? getParam('status') ?? 'unknown';
    const status =
      rawStatus === 'approved'
        ? 'approved'
        : rawStatus === 'pending' || rawStatus === 'in_process'
          ? 'pending'
          : rawStatus === 'rejected' || rawStatus === 'failure'
            ? 'failure'
            : 'unknown';
    return {
      name: 'payment',
      status,
      paymentId: getParam('payment_id') ?? undefined,
      externalReference: getParam('external_reference') ?? undefined,
    };
  }
  if (hashPath === '/tienda') return { name: 'store' };
  const productMatch = hashPath.match(/^\/producto\/(.+)$/);
  if (productMatch) return { name: 'product', productId: decodeURIComponent(productMatch[1]) };
  if (hashPath === '/marcas') return { name: 'brands' };
  const match = hashPath.match(/^\/marca\/(.+)$/);
  if (match) return { name: 'brand', brandId: decodeURIComponent(match[1]) };
  return { name: 'home' };
}

export function pageToHash(next: Page): string {
  if (next.name === 'home') return '#inicio';
  if (next.name === 'store') return '#/tienda';
  if (next.name === 'product') return `#/producto/${encodeURIComponent(next.productId)}`;
  if (next.name === 'payment') return '#/pago/resultado';
  if (next.name === 'brands') return '#/marcas';
  return `#/marca/${next.brandId}`;
}
