import { ArrowRight } from 'lucide-react';
import { brandImageSrc } from '@/lib/brands';
import type { Brand } from '@/lib/types';

type FeaturedBrandsProps = {
  brands: Brand[];
  onViewAll: () => void;
  onSelectBrand: (brand: Brand) => void;
};

export function FeaturedBrands({ brands, onViewAll, onSelectBrand }: FeaturedBrandsProps) {
  return (
    <section className="featured-brands">
      <div className="featured-brands-head"><div><div className="section-kicker">Marcas oficiales</div><h2>Confianza de las mejores marcas</h2></div><button className="outline-button" onClick={onViewAll}>Ver todas las marcas <ArrowRight size={16} /></button></div>
      <div className="featured-brands-row">{brands.slice(0, 6).map((brand) => <button className="featured-brand" key={brand.id} onClick={() => onSelectBrand(brand)}><img src={brandImageSrc(brand)} alt={`Logo de ${brand.name}`} loading="lazy" /><span>{brand.name}</span></button>)}</div>
    </section>
  );
}
