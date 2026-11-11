import { ArrowRight } from 'lucide-react';
import type { Product } from '@/lib/types';

type ProductCardProps = {
  product: Product;
  onClick: () => void;
};

export function ProductCard({ product, onClick }: ProductCardProps) {
  return <article className="product-card" onClick={onClick}><div className="product-accent"><span>{product.name.slice(0, 1)}</span><small>D’LU STORE</small></div><div className="product-info"><div className="product-meta"><span>{product.category?.name ?? 'Tecnología'}</span><span className="stock-dot">{product.stock > 0 ? 'Disponible' : 'Agotado'}</span></div><h3>{product.name}</h3><p>{product.brand?.name ?? 'D’Lu Store'} · SKU {product.sku}</p><div className="product-bottom"><strong>S/ {Number(product.sale_price ?? 0).toFixed(2)}</strong><span className="view-link">Ver detalle <ArrowRight size={15} /></span></div></div></article>;
}
