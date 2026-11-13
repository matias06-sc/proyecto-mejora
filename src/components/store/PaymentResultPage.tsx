import { ArrowRight, CheckCircle2, Clock3, ReceiptText, ShieldCheck, ShoppingBag, XCircle, type LucideIcon } from 'lucide-react';
import type { PaymentStatus } from '@/lib/types';

type PaymentResultPageProps = {
  status: PaymentStatus;
  paymentId?: string;
  externalReference?: string;
  onBack: () => void;
};

const content: Record<PaymentStatus, { icon: LucideIcon; kicker: string; title: string; message: string }> = {
  approved: {
    icon: CheckCircle2,
    kicker: 'Pago confirmado',
    title: '¡Gracias por tu compra!',
    message: 'Tu pago fue aprobado por Mercado Pago. Muy pronto nos pondremos en contacto para coordinar la entrega de tu pedido.',
  },
  pending: {
    icon: Clock3,
    kicker: 'Pago pendiente',
    title: 'Estamos confirmando tu pago',
    message: 'Mercado Pago todavía está procesando la operación. Te avisaremos cuando se confirme. Si pagaste con Yape, revisa la app para completar la solicitud.',
  },
  failure: {
    icon: XCircle,
    kicker: 'Pago no completado',
    title: 'No pudimos procesar el pago',
    message: 'La operación no se completó y no se realizó ningún cobro. Puedes volver a intentarlo con otro medio de pago.',
  },
  unknown: {
    icon: ReceiptText,
    kicker: 'Estado del pago',
    title: 'Revisa el estado de tu compra',
    message: 'No pudimos leer el estado de la operación. Si crees que el cobro se realizó, contáctanos con tu número de pedido.',
  },
};

export function PaymentResultPage({ status, paymentId, externalReference, onBack }: PaymentResultPageProps) {
  const { icon: Icon, kicker, title, message } = content[status];

  return (
    <main className="payment-result-page">
      <section className={`payment-result-card is-${status}`}>
        <span className="payment-result-icon"><Icon size={34} /></span>
        <div className="section-kicker">{kicker}</div>
        <h1>{title}</h1>
        <p>{message}</p>
        {(externalReference || paymentId) && (
          <div className="payment-result-meta">
            {externalReference && <span>Pedido <strong>{externalReference}</strong></span>}
            {paymentId && <span>Pago <strong>{paymentId}</strong></span>}
          </div>
        )}
        <div className="payment-result-note"><ShieldCheck size={15} /> Operación procesada por Mercado Pago</div>
        <button className="primary-button" onClick={onBack}>Seguir comprando <ArrowRight size={17} /></button>
        <span className="payment-result-secure"><ShoppingBag size={14} /> D’Lu Store · Tecnología original</span>
      </section>
    </main>
  );
}
