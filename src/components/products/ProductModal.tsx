import { ArrowRight, X } from 'lucide-react';
import type { Product } from '@/lib/types';

type ProductModalProps = {
  product: Product;
  onClose: () => void;
};

export function ProductModal({ product, onClose }: ProductModalProps) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="product-modal"><button className="close-button" onClick={onClose}><X size={18} /></button><div className="product-modal-copy"><div className="section-kicker">{product.category?.name ?? 'Tecnología'}</div><h2>{product.name}</h2><p>{product.description || 'Solución tecnológica seleccionada por D’Lu Store.'}</p><div className="detail-row"><span>Marca</span><strong>{product.brand?.name ?? 'Por definir'}</strong></div><div className="detail-row"><span>SKU</span><strong>{product.sku}</strong></div><div className="detail-row"><span>Disponibilidad</span><strong>{product.stock > 0 ? `${product.stock} unidades` : 'Consultar'}</strong></div><div className="modal-price">S/ {Number(product.sale_price ?? 0).toFixed(2)}</div><a href={`mailto:ventas@dlustore.com?subject=${encodeURIComponent(`Quiero comprar ${product.name}`)}&body=${encodeURIComponent(`Hola D’Lu Store, me interesa comprar ${product.name} (SKU ${product.sku}).`)}`} className="primary-button full-width">Comprar ahora <ArrowRight size={17} /></a></div></div></div>;
}
