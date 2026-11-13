import { ArrowRight, CreditCard, Loader2, Minus, Plus, ShoppingBag, Smartphone, Trash2, X } from 'lucide-react';
import { ProductImage } from '@/components/products/ProductImage';
import type { CartItem } from '@/lib/types';

type CartDrawerProps = {
  open: boolean;
  items: CartItem[];
  checkoutLoading: boolean;
  checkoutError: string;
  onClose: () => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
  onClear: () => void;
  onCheckout: () => void;
};

export function CartDrawer({ open, items, checkoutLoading, checkoutError, onClose, onUpdateQuantity, onRemove, onClear, onCheckout }: CartDrawerProps) {
  if (!open) return null;

  const total = items.reduce((sum, item) => sum + Number(item.product.sale_price ?? 0) * item.quantity, 0);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="cart-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <aside className="cart-drawer" aria-label="Carrito de compras">
        <div className="cart-head">
          <div><div className="section-kicker">Tu carrito</div><h2>{count} {count === 1 ? 'producto' : 'productos'}</h2></div>
          <button className="close-button cart-close" onClick={onClose} aria-label="Cerrar carrito"><X size={18} /></button>
        </div>

        {items.length ? (
          <>
            <div className="cart-items">
              {items.map((item) => {
                const max = Math.max(1, item.product.stock);
                return (
                  <div className="cart-item" key={item.product.id}>
                    <div className="cart-item-media"><ProductImage product={item.product} /></div>
                    <div className="cart-item-info">
                      <span>{item.product.brand?.name ?? 'D’Lu Store'}</span>
                      <strong>{item.product.name}</strong>
                      <small>S/ {Number(item.product.sale_price ?? 0).toFixed(2)} c/u</small>
                      <div className="cart-item-controls">
                        <div className="quantity-control is-small">
                          <button onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))} disabled={item.quantity <= 1} aria-label="Quitar una unidad"><Minus size={13} /></button>
                          <strong>{item.quantity}</strong>
                          <button onClick={() => onUpdateQuantity(item.product.id, Math.min(max, item.quantity + 1))} disabled={item.quantity >= max} aria-label="Agregar una unidad"><Plus size={13} /></button>
                        </div>
                        <button className="cart-remove" onClick={() => onRemove(item.product.id)} aria-label={`Quitar ${item.product.name}`}><Trash2 size={15} /></button>
                      </div>
                    </div>
                    <strong className="cart-item-total">S/ {(Number(item.product.sale_price ?? 0) * item.quantity).toFixed(2)}</strong>
                  </div>
                );
              })}
            </div>

            <div className="cart-footer">
              <div className="cart-total"><span>Total</span><strong>S/ {total.toFixed(2)}</strong></div>
              <div className="cart-payment-methods"><span><CreditCard size={14} /> Tarjetas</span><span><Smartphone size={14} /> Yape</span></div>
              <button className="primary-button full-width" onClick={onCheckout} disabled={checkoutLoading}>{checkoutLoading ? <><Loader2 size={17} className="cart-spinner" /> Redirigiendo a Mercado Pago...</> : <>Pagar con Mercado Pago <ArrowRight size={17} /></>}</button>
              {checkoutError && <p className="cart-error">{checkoutError}</p>}
              <button className="text-button cart-clear" onClick={onClear} disabled={checkoutLoading}>Vaciar carrito</button>
            </div>
          </>
        ) : (
          <div className="cart-empty">
            <ShoppingBag size={30} />
            <h3>Tu carrito está vacío</h3>
            <p>Agrega productos desde la tienda para iniciar tu compra.</p>
            <button className="outline-button" onClick={onClose}>Seguir comprando</button>
          </div>
        )}
      </aside>
    </div>
  );
}
