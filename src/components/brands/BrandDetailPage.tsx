import { ArrowLeft, Package, Store } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { brandImageSrc } from '@/lib/brands';
import type { Brand, Product } from '@/lib/types';

type BrandDetailPageProps = {
  brand: Brand;
  products: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
};

export function BrandDetailPage({ brand, products, onBack, onSelectProduct }: BrandDetailPageProps) {
  const brandProducts = products.filter((product) => product.brand_id === brand.id || product.brand?.id === brand.id);

  return <main className="brand-detail-page">
    <section className="brand-detail-hero">
      <button className="back-link" onClick={onBack}><ArrowLeft size={16} /> Volver a marcas</button>
      <div className="brand-detail-head">
        <div className="brand-detail-logo"><img src={brandImageSrc(brand)} alt={`Logo de ${brand.name}`} /></div>
        <div><div className="section-kicker">Marca oficial</div><h1>{brand.name}</h1><p>{brandProducts.length ? `${brandProducts.length} producto${brandProducts.length === 1 ? '' : 's'} disponible${brandProducts.length === 1 ? '' : 's'} para comprar.` : 'Aún no hay productos publicados para esta marca.'}</p></div>
      </div>
    </section>
    <section className="brand-products-section">
      <div className="section-heading"><div><div className="section-kicker">Catálogo {brand.name}</div><h2>Productos de la marca</h2><p>Explora todos los productos asignados a esta marca.</p></div><div className="catalog-count"><strong>{brandProducts.length}</strong><span>productos</span></div></div>
      {brandProducts.length ? <div className="product-grid">{brandProducts.map((product) => <ProductCard key={product.id} product={product} onClick={() => onSelectProduct(product)} />)}</div> : <div className="empty-state"><Package size={29} /><h3>Sin productos por ahora</h3><p>Estamos actualizando el catálogo de {brand.name}. Vuelve pronto.</p><button className="outline-button" onClick={onBack}>Ver otras marcas</button></div>}
    </section>
  </main>;
}

type BrandNotFoundPageProps = {
  onBack: () => void;
};

export function BrandNotFoundPage({ onBack }: BrandNotFoundPageProps) {
  return <main className="brand-detail-page"><section className="brand-detail-hero"><button className="back-link" onClick={onBack}><ArrowLeft size={16} /> Volver a marcas</button><div className="empty-state"><Store size={29} /><h3>Marca no encontrada</h3><p>La marca que buscas no está disponible en este momento.</p><button className="outline-button" onClick={onBack}>Ver marcas</button></div></section></main>;
}
