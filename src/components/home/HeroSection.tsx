import { ArrowRight, Check, Store } from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';

type HeroSectionProps = {
  productCount: number;
  brandCount: number;
  onBuy: () => void;
  onViewBrands: () => void;
};

export function HeroSection({ productCount, brandCount, onBuy, onViewBrands }: HeroSectionProps) {
  return (
    <section className="hero-section">
      <div className="hero-copy"><div className="hero-logo"><BrandLogo /></div><div className="eyebrow"><span className="pulse-dot" /> Tecnología que conecta lo importante</div><h1>Tu tecnología.<br /><em>Tu tienda online.</em></h1><p>Descubre soluciones para conectar, proteger y hacer crecer tus proyectos con el respaldo de D’Lu Store.</p><div className="hero-actions"><a className="primary-button" href="#catalogo" onClick={(event) => { event.preventDefault(); onBuy(); }}>Comprar ahora <ArrowRight size={17} /></a><button className="text-button" onClick={onViewBrands}>Ver marcas <Store size={16} /></button></div><div className="trust-row"><span><Check size={15} /> Atención especializada</span><span><Check size={15} /> Soluciones confiables</span></div><div className="hero-stats"><div><strong>{productCount}</strong><span>Productos</span></div><div><strong>{brandCount}</strong><span>Marcas oficiales</span></div><div><strong>24/7</strong><span>Asesoría online</span></div></div></div>
      <div className="hero-brand-panel"><div className="typed-brand"><strong>dlu</strong><span>store.com</span></div><div className="typed-tagline">TU TIENDA ONLINE</div><span>TECNOLOGÍA PARA AVANZAR</span><div className="brand-line" /></div>
    </section>
  );
}
