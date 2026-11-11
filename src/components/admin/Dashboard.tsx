import { useState } from 'react';
import {
  Archive, ArrowRight, BarChart3, Check, ChevronDown, CircleUserRound,
  ClipboardList, Clock3, Download, LayoutDashboard, Package, ShieldCheck, Upload, Users,
} from 'lucide-react';
import { AdminPlaceholder } from '@/components/admin/AdminPlaceholder';
import { Metric } from '@/components/admin/Metric';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { statusLabels } from '@/lib/catalog';
import type { Brand, Category, Product } from '@/lib/types';

type DashboardProps = {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  onLogout: () => void;
  onExport: () => void;
  userEmail: string;
  notice: string;
};

export function Dashboard({ products, categories, brands, onLogout, onExport, userEmail, notice }: DashboardProps) {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const published = products.filter((p) => p.status === 'published').length; const review = products.filter((p) => p.status === 'review').length; const lowStock = products.filter((p) => p.stock < 10).length;
  const navItems = [{ label: 'Dashboard', icon: LayoutDashboard }, { label: 'Productos', icon: Package }, { label: 'Importar catálogo', icon: Upload }, { label: 'Exportar catálogo', icon: Download }, { label: 'Historial', icon: Clock3 }, { label: 'Usuarios', icon: Users }];
  return <div className="dashboard-shell"><aside className="dashboard-sidebar"><div className="sidebar-brand"><BrandLogo /></div><div className="sidebar-caption">GESTIÓN DEL CATÁLOGO</div><nav>{navItems.map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? 'active' : ''} onClick={() => setActiveNav(label)}><Icon size={18} />{label}</button>)}</nav><div className="sidebar-bottom"><div className="secure-badge"><ShieldCheck size={16} /><span>Sesión segura<br /><b>Protegida</b></span></div><button className="logout-button" onClick={onLogout}>Cerrar sesión</button></div></aside><main className="dashboard-main"><header className="dashboard-header"><div><div className="section-kicker">D’LU STORE / ADMIN</div><h1>{activeNav}</h1></div><div className="admin-user"><span className="avatar"><CircleUserRound size={20} /></span><span>{userEmail || 'Administrador'}</span><ChevronDown size={15} /></div></header>{notice && <div className="success-banner"><Check size={17} /> {notice}</div>}{activeNav === 'Dashboard' ? <><section className="welcome-banner"><div><div className="eyebrow"><span className="pulse-dot" /> Panel de control</div><h2>Todo el catálogo,<br /><em>bajo control.</em></h2><p>Revisa el estado de la información y mantén cada producto listo para publicar.</p></div><div className="welcome-art"><BarChart3 size={86} strokeWidth={1} /></div></section><div className="metric-grid"><Metric icon={Package} label="Total de productos" value={products.length} detail="En el catálogo" /><Metric icon={Check} label="Publicados" value={published} detail="Visibles al público" accent="green" /><Metric icon={Clock3} label="En revisión" value={review} detail="Requieren atención" accent="orange" /><Metric icon={Archive} label="Stock bajo" value={lowStock} detail="Menos de 10 unidades" accent="red" /></div><section className="dashboard-panels"><div className="panel"><div className="panel-heading"><div><div className="section-kicker">Actividad reciente</div><h3>Últimos productos actualizados</h3></div><button className="small-button" onClick={() => setActiveNav('Productos')}>Ver todos <ArrowRight size={14} /></button></div>{products.slice(0, 4).map((product) => <div className="activity-row" key={product.id}><span className="activity-icon"><Package size={16} /></span><div><strong>{product.name}</strong><small>{product.sku} · {statusLabels[product.status]}</small></div><span className="activity-time">Hoy</span></div>)}</div><div className="panel category-panel"><div className="panel-heading"><div><div className="section-kicker">Distribución</div><h3>Por categoría</h3></div><ClipboardList size={18} /></div>{categories.slice(0, 4).map((category) => { const count = products.filter((product) => product.category_id === category.id).length; return <div className="bar-row" key={category.id}><div><span>{category.name}</span><b>{count}</b></div><div className="bar-track"><i style={{ width: `${Math.max(10, products.length ? count / products.length * 100 : 10)}%` }} /></div></div>; })}</div></section></> : <AdminPlaceholder activeNav={activeNav} products={products} brands={brands} onExport={onExport} />}</main></div>;
}
