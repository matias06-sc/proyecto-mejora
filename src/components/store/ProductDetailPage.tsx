import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, CheckCircle2, Minus, Package, Plus, ShieldCheck, ShoppingCart, Store, Truck } from 'lucide-react';
import { ProductImage } from '@/components/products/ProductImage';
import { StoreProductCard } from '@/components/store/StoreProductCard';
import { brandImageSrc } from '@/lib/brands';
import type { Product } from '@/lib/types';

type ProductDetailPageProps = {
  product: Product;
  relatedProducts: Product[];
  recentlyViewed: Product[];
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
};

export function ProductDetailPage({ product, relatedProducts, recentlyViewed, onBack, onSelectProduct, onAddToCart, onBuyNow }: ProductDetailPageProps) {
  const [quantity, setQuantity] = useState(1);
  const [feedback, setFeedback] = useState('');
  const soldOut = product.stock <= 0;
  const maxQuantity = Math.max(1, product.stock);

  useEffect(() => {
    if (!feedback) return;
    const timer = window.setTimeout(() => setFeedback(''), 2600);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  function addToCart() {
    if (soldOut) return;
    onAddToCart(product, quantity);
    setFeedback(`${quantity} ${quantity === 1 ? 'unidad agregada' : 'unidades agregadas'} al carrito.`);
  }

  return (
    <main className="product-detail-page">
      <div className="product-detail-wrap">
        <button className="back-link" onClick={onBack}><ArrowLeft size={16} /> Volver a la tienda</button>

        <section className="product-detail-grid">
          <div className="product-detail-visual">
            <div className="product-detail-media"><ProductImage product={product} /></div>
            {product.brand && <div className="product-detail-brand"><span>Marca oficial</span><img src={brandImageSrc(product.brand)} alt={`Logo de ${product.brand.name}`} loading="lazy" /></div>}
          </div>

          <div className="product-detail-info">
            <div className="section-kicker">{product.category?.name ?? 'Tecnología'}</div>
            <h1>{product.name}</h1>
            <p className="product-detail-desc">{product.description || 'Solución tecnológica seleccionada por D’Lu Store.'}</p>

            <div className="product-cert-row">
              <span className="product-cert"><ShieldCheck size={15} /> Original</span>
              <span className="product-cert"><BadgeCheck size={15} /> Garantía</span>
              <span className="product-cert"><Truck size={15} /> Envío a Perú</span>
            </div>

            <div className="product-detail-price"><span>Precio</span><strong>S/ {Number(product.sale_price ?? 0).toFixed(2)}</strong></div>

            <div className="product-detail-meta">
              <span>SKU <strong>{product.sku}</strong></span>
              <span>Marca <strong>{product.brand?.name ?? 'D’Lu Store'}</strong></span>
              <span>Stock <strong className={soldOut ? 'is-out' : ''}>{soldOut ? 'Agotado' : `${product.stock} unidades`}</strong></span>
            </div>

            <div className="product-buy-box">
              <div className="quantity-row">
                <span>Cantidad</span>
                <div className="quantity-control">
                  <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1 || soldOut} aria-label="Quitar una unidad"><Minus size={15} /></button>
                  <strong>{quantity}</strong>
                  <button onClick={() => setQuantity((value) => Math.min(maxQuantity, value + 1))} disabled={quantity >= maxQuantity || soldOut} aria-label="Agregar una unidad"><Plus size={15} /></button>
                </div>
                <small>{soldOut ? 'Sin stock por ahora' : `${product.stock} disponibles`}</small>
              </div>

              <div className="product-buy-actions">
                <button className="primary-button" onClick={() => onBuyNow(product, quantity)} disabled={soldOut}>Comprar ahora <ArrowRight size={17} /></button>
                <button className="outline-button" onClick={addToCart} disabled={soldOut}><ShoppingCart size={16} /> Agregar al carrito</button>
              </div>

              {feedback && <p className="product-feedback"><CheckCircle2 size={16} /> {feedback}</p>}
            </div>
          </div>
        </section>

        {relatedProducts.length > 0 && (
          <section className="detail-section">
            <div className="detail-section-head"><div><div className="section-kicker">También te puede interesar</div><h2>Relacionados con {product.brand?.name ?? 'la marca'}</h2></div><span>{relatedProducts.length} productos</span></div>
            <div className="store-product-grid">{relatedProducts.map((related) => <StoreProductCard key={related.id} product={related} onClick={() => onSelectProduct(related)} />)}</div>
          </section>
        )}

        {recentlyViewed.length > 0 && (
          <section className="detail-section">
            <div className="detail-section-head"><div><div className="section-kicker">Tu historial</div><h2>Vistos recientemente</h2></div></div>
            <div className="store-product-grid">{recentlyViewed.map((recent) => <StoreProductCard key={recent.id} product={recent} onClick={() => onSelectProduct(recent)} />)}</div>
          </section>
        )}
      </div>
    </main>
  );
}

type ProductNotFoundPageProps = {
  onBack: () => void;
};

export function ProductNotFoundPage({ onBack }: ProductNotFoundPageProps) {
  return (
    <main className="product-detail-page">
      <div className="product-detail-wrap">
        <button className="back-link" onClick={onBack}><ArrowLeft size={16} /> Volver a la tienda</button>
        <div className="empty-state"><Package size={29} /><h3>Producto no encontrado</h3><p>El producto que buscas ya no está disponible o cambió de dirección.</p><button className="outline-button" onClick={onBack}><Store size={16} /> Ver la tienda</button></div>
      </div>
    </main>
  );
}
