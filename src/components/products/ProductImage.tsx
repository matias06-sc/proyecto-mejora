import { assetUrl } from '@/lib/assets';
import type { Product } from '@/lib/types';

type ProductImageProps = {
  product: Product;
};

export function ProductImage({ product }: ProductImageProps) {
  const imageSrc = assetUrl(product.image_url);
  if (imageSrc)
    return <img className="product-image" src={imageSrc} alt={product.name} loading="lazy" />;
  return (
    <span className="product-image-placeholder">
      <strong>{product.name.slice(0, 1)}</strong>
      <small>D’LU STORE</small>
    </span>
  );
}
