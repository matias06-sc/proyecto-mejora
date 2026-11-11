import { Package } from 'lucide-react';

export function Metric({ icon: Icon, label, value, detail, accent = 'blue' }: { icon: typeof Package; label: string; value: number; detail: string; accent?: string }) { return <div className="metric-card"><span className={`metric-icon ${accent}`}><Icon size={18} /></span><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>; }
