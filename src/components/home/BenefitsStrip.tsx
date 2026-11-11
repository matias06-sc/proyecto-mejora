import { Headphones, ShieldCheck, Truck } from 'lucide-react';

export function BenefitsStrip() {
  return (
    <section className="benefit-strip">
      <div className="benefit-card"><Truck size={22} /><div><strong>Envíos coordinados</strong><p>Recibe tus productos con seguimiento y atención personalizada.</p></div></div>
      <div className="benefit-card"><ShieldCheck size={22} /><div><strong>Productos originales</strong><p>Trabajamos con marcas oficiales y garantía respaldada.</p></div></div>
      <div className="benefit-card"><Headphones size={22} /><div><strong>Asesoría experta</strong><p>Te ayudamos a elegir la mejor solución para tu proyecto.</p></div></div>
    </section>
  );
}
