import type { Brand } from '@/lib/types';

const brandAssets: Record<string, string> = {
  tplink: '/brands/tp-link.svg',
  hikvision: '/brands/hikvision.svg',
  logitech: '/brands/logitech.svg',
};

function normalizeBrandName(name: string) {
  return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
}

export function brandImageSrc(brand: Brand) {
  if (brand.image_url) return brand.image_url;
  const asset = brandAssets[normalizeBrandName(brand.name)];
  if (asset) return asset;
  const initials = brand.name.split(/\s+/).filter(Boolean).map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'DL';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" rx="22" fill="#101522"/><rect x="1" y="1" width="318" height="178" rx="21" fill="none" stroke="#2a3346"/><text x="160" y="104" font-family="Space Grotesk, Arial, sans-serif" font-size="56" font-weight="700" fill="#53d3dd" text-anchor="middle">${initials}</text><text x="160" y="134" font-family="DM Sans, Arial, sans-serif" font-size="14" letter-spacing="3" fill="#7e8a9e" text-anchor="middle">MARCA OFICIAL</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
