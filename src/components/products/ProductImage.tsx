import type { Product } from '@/lib/types';

type ProductImageProps = {
  product: Product;
};

export function ProductImage({ product }: ProductImageProps) {
  if (product.image_url) return <img className="product-image" src={product.image_url} alt={product.name} loading="lazy" />;
  return <span className="product-image-placeholder"><strong>{product.name.slice(0, 1)}</strong><small>D’LU STORE</small></span>;
}
