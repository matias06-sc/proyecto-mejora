import { ArrowRight } from 'lucide-react';
import { brandImageSrc } from '@/lib/brands';
import type { Brand } from '@/lib/types';

type BrandCardProps = {
  brand: Brand;
  onClick: () => void;
};

export function BrandCard({ brand, onClick }: BrandCardProps) {
  return <button className="brand-card" onClick={onClick}><span className="brand-card-media"><img src={brandImageSrc(brand)} alt={`Logo de ${brand.name}`} loading="lazy" /></span><span className="brand-card-body"><span><strong>{brand.name}</strong><small>Ver productos</small></span><ArrowRight size={17} /></span></button>;
}
