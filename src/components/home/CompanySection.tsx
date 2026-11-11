import { Database, ShieldCheck, Sparkles } from 'lucide-react';

export function CompanySection() {
  return (
    <section className="company-section" id="empresa"><div><div className="section-kicker">D’Lu Store / desde 2016</div><h2>Tecnología con respaldo<br />para cada desafío.</h2></div><p>Somos especialistas en soluciones de conectividad, seguridad y productividad. Encuentra productos originales, compara opciones y recibe asesoría personalizada para comprar con confianza.</p><div className="company-values"><span><Database size={17} /> Datos organizados</span><span><ShieldCheck size={17} /> Procesos seguros</span><span><Sparkles size={17} /> Atención cercana</span></div></section>
  );
}
