import { ArrowRight, BadgeCheck, Package, Store } from 'lucide-react';
import { BrandCard } from '@/components/brands/BrandCard';
import { brandImageSrc } from '@/lib/brands';
import type { Brand } from '@/lib/types';

type BrandsPageProps = {
  brands: Brand[];
  onSelectBrand: (brand: Brand) => void;
  onGoCatalog: () => void;
};

export function BrandsPage({ brands, onSelectBrand, onGoCatalog }: BrandsPageProps) {
  const featured = brands.slice(0, 6);
  const collage = brands.length ? Array.from({ length: 32 }, (_, index) => brands[index % brands.length]) : [];

  return <main className="brands-page">
    <section className="brands-hero">
      <div className="brands-hero-copy">
        <div className="eyebrow"><span className="pulse-dot" /> Distribuidor autorizado</div>
        <h1>Marcas<br /><em>oficiales.</em></h1>
        <p>Trabajamos con fabricantes líderes para ofrecerte tecnología original, garantía real y el respaldo que tu proyecto necesita.</p>
        <div className="hero-actions"><button className="primary-button" onClick={() => document.getElementById('marcas-grid')?.scrollIntoView({ behavior: 'smooth' })}>Explorar marcas <ArrowRight size={17} /></button><button className="text-button" onClick={onGoCatalog}>Ver catálogo <Package size={16} /></button></div>
        <div className="brands-hero-stats"><span><strong>{brands.length}</strong> marcas oficiales</span><span><BadgeCheck size={15} /> Productos originales</span></div>
      </div>
      <div className="brands-hero-art" aria-hidden="true">
        <span className="brands-hero-glow" />
        {brands.slice(0, 4).map((brand, index) => <div className={`brand-orbit brand-orbit-${index}`} key={brand.id}><img src={brandImageSrc(brand)} alt="" loading="lazy" /></div>)}
      </div>
    </section>
    <section className="brands-section" id="marcas-grid">
      <div className="section-heading"><div><div className="section-kicker">Nuestro portafolio</div><h2>Nuestras marcas</h2><p>Selecciona una marca para ver todos sus productos disponibles.</p></div><div className="catalog-count"><strong>{featured.length}</strong><span>marcas</span></div></div>
      {featured.length ? <div className="brand-grid">{featured.map((brand) => <BrandCard key={brand.id} brand={brand} onClick={() => onSelectBrand(brand)} />)}</div> : <div className="empty-state"><Store size={29} /><h3>Estamos preparando nuestro portafolio</h3><p>Muy pronto encontrarás aquí todas nuestras marcas oficiales.</p></div>}
    </section>
    <section className="brand-collage-section">
      <div className="section-heading"><div><div className="section-kicker">Aliados tecnológicos</div><h2>Todo nuestro portafolio</h2><p>Las marcas que confían en D’Lu Store.</p></div></div>
      <div className="brand-collage">{collage.map((brand, index) => <div className="brand-collage-tile" key={`${brand.id}-${index}`}><img src={brandImageSrc(brand)} alt={`${brand.name} ${index + 1}`} loading="lazy" /></div>)}</div>
    </section>
  </main>;
}
