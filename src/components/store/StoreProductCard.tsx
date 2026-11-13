import { ArrowRight, ShieldCheck } from 'lucide-react';
import { ProductImage } from '@/components/products/ProductImage';
import { brandImageSrc } from '@/lib/brands';
import type { Product } from '@/lib/types';

type StoreProductCardProps = {
  product: Product;
  onClick: () => void;
};

export function StoreProductCard({ product, onClick }: StoreProductCardProps) {
  return (
    <article className="store-product-card" onClick={onClick}>
      <div className="store-product-media">
        <ProductImage product={product} />
        <span className={`store-stock ${product.stock > 0 ? '' : 'is-out'}`}>{product.stock > 0 ? 'Disponible' : 'Agotado'}</span>
      </div>
      <div className="store-product-body">
        <div className="store-product-brand">
          {product.brand ? <img src={brandImageSrc(product.brand)} alt={`Logo de ${product.brand.name}`} loading="lazy" /> : <span>D’Lu Store</span>}
        </div>
        <h3>{product.name}</h3>
        <div className="product-certificate"><ShieldCheck size={14} /><span>Original · Garantía · Envío a Perú</span></div>
        <div className="store-product-footer">
          <strong>S/ {Number(product.sale_price ?? 0).toFixed(2)}</strong>
          <span className="view-link">Ver producto <ArrowRight size={15} /></span>
        </div>
      </div>
    </article>
  );
}
