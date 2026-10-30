import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Archive, ArrowRight, BarChart3, Check, ChevronDown, CircleUserRound,
  ClipboardList, Clock3, Database, Download, Eye, FileSpreadsheet, Filter,
  LayoutDashboard, LockKeyhole, LogIn, Menu, Package, Pencil, Plus, Search, ShieldCheck,
  Sparkles, Upload, Users, X, Zap,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

type Status = 'draft' | 'review' | 'published' | 'archived';
type Category = { id: string; name: string };
type Brand = { id: string; name: string };
type Product = {
  id: string; sku: string; name: string; brand_id: string | null; category_id: string | null;
  description: string | null; sale_price: number | null; stock: number; status: Status;
  image_url: string | null; updated_at: string; category?: Category; brand?: Brand;
};

type DemoProduct = Product & { category: Category; brand: Brand };

const demoCategories: Category[] = [
  { id: 'cat-network', name: 'Redes y WiFi' }, { id: 'cat-security', name: 'Cámaras de seguridad' },
  { id: 'cat-computing', name: 'Computadoras y accesorios' }, { id: 'cat-energy', name: 'Sistemas de energía' },
];
const demoBrands: Brand[] = [{ id: 'br-tp', name: 'TP-Link' }, { id: 'br-hik', name: 'Hikvision' }, { id: 'br-logi', name: 'Logitech' }];
const demoProducts: DemoProduct[] = [
  { id: 'demo-1', sku: 'DLU-DEMO-001', name: 'Router WiFi 6 AX1800', brand_id: 'br-tp', category_id: 'cat-network', description: 'Conectividad estable para hogares y pequeñas empresas.', sale_price: 249.9, stock: 18, status: 'published', image_url: null, updated_at: new Date().toISOString(), category: demoCategories[0], brand: demoBrands[0] },
  { id: 'demo-2', sku: 'DLU-DEMO-002', name: 'Cámara IP ColorVu 4MP', brand_id: 'br-hik', category_id: 'cat-security', description: 'Monitoreo inteligente con visión nocturna a color.', sale_price: 389.0, stock: 7, status: 'published', image_url: null, updated_at: new Date().toISOString(), category: demoCategories[1], brand: demoBrands[1] },
  { id: 'demo-3', sku: 'DLU-DEMO-003', name: 'Teclado inalámbrico compacto', brand_id: 'br-logi', category_id: 'cat-computing', description: 'Diseño minimalista, silencioso y ergonómico.', sale_price: 119.9, stock: 26, status: 'published', image_url: null, updated_at: new Date().toISOString(), category: demoCategories[2], brand: demoBrands[2] },
];

const categoryColors = ['cyan', 'orange', 'blue', 'lime'];
const statusLabels: Record<Status, string> = { draft: 'Borrador', review: 'En revisión', published: 'Publicado', archived: 'Archivado' };

function BrandLogo() {
  return <span className="brand-logo" aria-label="D’Lu Store"><span className="brand-symbol"><LockKeyhole size={27} strokeWidth={2.6} /></span><span className="brand-copy"><strong>dlu</strong><em>store.com</em><small>TU TIENDA ONLINE</small></span></span>;
}

function App() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [categories, setCategories] = useState<Category[]>(demoCategories);
  const [brands, setBrands] = useState<Brand[]>(demoBrands);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [dashboard, setDashboard] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === '9') { event.preventDefault(); setAdminOpen(true); }
      if (event.ctrlKey && event.shiftKey && event.key === '9') { event.preventDefault(); setAdminOpen(true); }
    };
    window.addEventListener('keydown', onKeyDown);
    void loadCatalog();
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  async function loadCatalog() {
    if (!supabase) return;
    const [{ data: productData }, { data: categoryData }, { data: brandData }] = await Promise.all([
      supabase.from('products').select('*, category:categories(id,name), brand:brands(id,name)').eq('status', 'published').order('updated_at', { ascending: false }),
      supabase.from('categories').select('id,name').order('display_order'),
      supabase.from('brands').select('id,name').order('name'),
    ]);
    if (productData) setProducts(productData as Product[]);
    if (categoryData?.length) setCategories(categoryData);
    if (brandData?.length) setBrands(brandData);
  }

  const filteredProducts = useMemo(() => products.filter((product) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query) || (product.brand?.name ?? '').toLowerCase().includes(query);
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  }), [products, search, categoryFilter]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setAuthError(''); setAuthLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? ''); const password = String(form.get('password') ?? '');
    if (!supabase) { setAuthError('La conexión segura aún no está disponible.'); setAuthLoading(false); return; }
    const result = isRegistering
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (result.error) { setAuthError(isRegistering ? 'No se pudo crear la cuenta. Verifica los datos.' : 'Correo o contraseña incorrectos.'); return; }
    if (isRegistering && !result.data.session) { setAuthError('Cuenta creada. Revisa tu correo para confirmar el acceso.'); return; }
    if (!result.data.session) { setAuthError('No se pudo validar la sesión.'); return; }
    setUserEmail(result.data.user?.email ?? email); setAdminOpen(false); setDashboard(true);
  }

  async function logout() {
    await supabase?.auth.signOut(); setDashboard(false); setUserEmail(''); setNotice('Sesión cerrada correctamente.');
  }

  function exportCsv() {
    const rows = [['SKU', 'Producto', 'Marca', 'Categoría', 'Precio', 'Stock', 'Estado'], ...products.map((p) => [p.sku, p.name, p.brand?.name ?? '', p.category?.name ?? '', String(p.sale_price ?? ''), String(p.stock), statusLabels[p.status]])];
    const blob = new Blob([rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'dlu-catalogo.csv'; anchor.click(); URL.revokeObjectURL(url); setNotice('Catálogo exportado correctamente.');
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand-lockup" href="#inicio" aria-label="D’Lu Store inicio"><BrandLogo /></a>
        <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
          <a href="#catalogo" onClick={() => setMenuOpen(false)}>Catálogo</a><a href="#soluciones" onClick={() => setMenuOpen(false)}>Soluciones</a><a href="#empresa" onClick={() => setMenuOpen(false)}>Nosotros</a><a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
        </nav>
        <div className="header-actions"><button className="ghost-button desktop-only" onClick={() => setAdminOpen(true)}><ShieldCheck size={16} /> Acceso administrativo</button><button className="menu-button" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}><Menu size={22} /></button></div>
      </header>

      {dashboard ? <Dashboard products={products} categories={categories} brands={brands} activeNav={activeNav} setActiveNav={setActiveNav} onLogout={logout} onExport={exportCsv} userEmail={userEmail} notice={notice} /> : <>
        <main id="inicio">
          <section className="hero-section">
            <div className="hero-copy"><div className="hero-logo"><BrandLogo /></div><div className="eyebrow"><span className="pulse-dot" /> Tecnología que conecta lo importante</div><h1>Tu tecnología.<br /><em>Tu tienda online.</em></h1><p>Descubre soluciones para conectar, proteger y hacer crecer tus proyectos con el respaldo de D’Lu Store.</p><div className="hero-actions"><a className="primary-button" href="#catalogo">Ver catálogo <ArrowRight size={17} /></a><button className="text-button" onClick={() => setAdminOpen(true)}>Acceso administrativo <ShieldCheck size={16} /></button></div><div className="trust-row"><span><Check size={15} /> Atención especializada</span><span><Check size={15} /> Soluciones confiables</span></div></div>
            <div className="hero-brand-panel"><div className="typed-brand"><strong>dlu</strong><span>store.com</span></div><div className="typed-tagline">TU TIENDA ONLINE</div><span>TECNOLOGÍA PARA AVANZAR</span><div className="brand-line" /></div>
          </section>
          <section className="category-strip" id="soluciones"><div className="section-kicker">Explora por solución</div><div className="category-grid">{categories.slice(0, 4).map((category, index) => <button key={category.id} className="category-tile" onClick={() => { setCategoryFilter(category.id); document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' }); }}><span className={`category-icon ${categoryColors[index % categoryColors.length]}`}><Zap size={19} /></span><span>{category.name}</span><ArrowRight size={16} /></button>)}</div></section>
          <section className="catalog-section" id="catalogo"><div className="section-heading"><div><div className="section-kicker">Portafolio seleccionado</div><h2>Conoce nuestro catálogo</h2><p>Productos tecnológicos listos para impulsar tus proyectos.</p></div><div className="catalog-count"><strong>{filteredProducts.length}</strong><span>resultados</span></div></div><div className="catalog-toolbar"><div className="search-box"><Search size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar por nombre, SKU o marca" /></div><div className="filter-box"><Filter size={16} /><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)}><option value="all">Todas las categorías</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select><ChevronDown size={15} /></div></div>{filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} onClick={() => setSelectedProduct(product)} />)}</div> : <div className="empty-state"><Package size={29} /><h3>No encontramos productos</h3><p>Prueba con otra búsqueda o categoría para continuar.</p><button className="outline-button" onClick={() => { setSearch(''); setCategoryFilter('all'); }}>Limpiar filtros</button></div>}</section>
          <section className="company-section" id="empresa"><div><div className="section-kicker">D’Lu Store / desde 2016</div><h2>Tecnología con respaldo<br />para cada desafío.</h2></div><p>Somos especialistas en soluciones de conectividad, seguridad y productividad. Este catálogo ayuda a nuestro equipo a mantener la información comercial ordenada, vigente y lista para compartir.</p><div className="company-values"><span><Database size={17} /> Datos organizados</span><span><ShieldCheck size={17} /> Procesos seguros</span><span><Sparkles size={17} /> Atención cercana</span></div></section>
        </main>
        <footer id="contacto"><div className="footer-brand"><BrandLogo /><p>Tu tienda online de tecnología.</p></div><div><small>CONTACTO</small><p>ventas@dlustore.com<br />Lima, Perú</p></div><div><small>CATÁLOGO</small><p>Redes y WiFi<br />Seguridad electrónica</p></div><div className="footer-note">Catálogo independiente<br />© 2025 D’Lu Store</div></footer>
      </>}

      {adminOpen && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setAdminOpen(false); }}><div className="login-modal"><button className="close-button" onClick={() => setAdminOpen(false)}><X size={18} /></button><div className="login-mark"><BrandLogo /></div><div className="section-kicker">Área protegida</div><h2>Acceso administrativo</h2><p>Ingresa para gestionar el catálogo independiente de D’Lu Store.</p><form onSubmit={login}><label>Correo electrónico<input name="email" type="email" required placeholder="tu@empresa.com" /></label><label>Contraseña<input name="password" type="password" required placeholder="••••••••" /></label>{authError && <div className="form-error">{authError}</div>}<button className="primary-button full-width" disabled={authLoading}>{authLoading ? 'Verificando...' : <><LogIn size={17} /> {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}</>}</button></form><button className="switch-auth" onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }}>{isRegistering ? 'Ya tengo una cuenta' : 'Crear una cuenta administrativa'}</button><small className="shortcut-hint">Atajo rápido: Ctrl + 9 · alternativa Ctrl + Shift + 9</small></div></div>}
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product; index?: number; onClick: () => void }) {
  return <article className="product-card" onClick={onClick}><div className="product-accent"><span>{product.name.slice(0, 1)}</span><small>D’LU STORE</small></div><div className="product-info"><div className="product-meta"><span>{product.category?.name ?? 'Tecnología'}</span><span className="stock-dot">{product.stock > 0 ? 'Disponible' : 'Agotado'}</span></div><h3>{product.name}</h3><p>{product.brand?.name ?? 'D’Lu Store'} · SKU {product.sku}</p><div className="product-bottom"><strong>S/ {Number(product.sale_price ?? 0).toFixed(2)}</strong><span className="view-link">Ver detalle <ArrowRight size={15} /></span></div></div></article>;
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="product-modal"><button className="close-button" onClick={onClose}><X size={18} /></button><div className="product-modal-copy"><div className="section-kicker">{product.category?.name ?? 'Tecnología'}</div><h2>{product.name}</h2><p>{product.description || 'Solución tecnológica seleccionada por D’Lu Store.'}</p><div className="detail-row"><span>Marca</span><strong>{product.brand?.name ?? 'Por definir'}</strong></div><div className="detail-row"><span>SKU</span><strong>{product.sku}</strong></div><div className="detail-row"><span>Disponibilidad</span><strong>{product.stock > 0 ? `${product.stock} unidades` : 'Consultar'}</strong></div><div className="modal-price">S/ {Number(product.sale_price ?? 0).toFixed(2)}</div><a href="#contacto" onClick={onClose} className="primary-button full-width">Solicitar información <ArrowRight size={17} /></a></div></div></div>;
}

function Dashboard({ products, categories, brands, activeNav, setActiveNav, onLogout, onExport, userEmail, notice }: { products: Product[]; categories: Category[]; brands: Brand[]; activeNav: string; setActiveNav: (value: string) => void; onLogout: () => void; onExport: () => void; userEmail: string; notice: string }) {
  const published = products.filter((p) => p.status === 'published').length; const review = products.filter((p) => p.status === 'review').length; const lowStock = products.filter((p) => p.stock < 10).length;
  const navItems = [{ label: 'Dashboard', icon: LayoutDashboard }, { label: 'Productos', icon: Package }, { label: 'Importar catálogo', icon: Upload }, { label: 'Exportar catálogo', icon: Download }, { label: 'Historial', icon: Clock3 }, { label: 'Usuarios', icon: Users }];
  return <div className="dashboard-shell"><aside className="dashboard-sidebar"><div className="sidebar-brand"><BrandLogo /></div><div className="sidebar-caption">GESTIÓN DEL CATÁLOGO</div><nav>{navItems.map(({ label, icon: Icon }) => <button key={label} className={activeNav === label ? 'active' : ''} onClick={() => setActiveNav(label)}><Icon size={18} />{label}</button>)}</nav><div className="sidebar-bottom"><div className="secure-badge"><ShieldCheck size={16} /><span>Sesión segura<br /><b>Protegida</b></span></div><button className="logout-button" onClick={onLogout}>Cerrar sesión</button></div></aside><main className="dashboard-main"><header className="dashboard-header"><div><div className="section-kicker">D’LU STORE / ADMIN</div><h1>{activeNav}</h1></div><div className="admin-user"><span className="avatar"><CircleUserRound size={20} /></span><span>{userEmail || 'Administrador'}</span><ChevronDown size={15} /></div></header>{notice && <div className="success-banner"><Check size={17} /> {notice}</div>}{activeNav === 'Dashboard' ? <><section className="welcome-banner"><div><div className="eyebrow"><span className="pulse-dot" /> Panel de control</div><h2>Todo el catálogo,<br /><em>bajo control.</em></h2><p>Revisa el estado de la información y mantén cada producto listo para publicar.</p></div><div className="welcome-art"><BarChart3 size={86} strokeWidth={1} /></div></section><div className="metric-grid"><Metric icon={Package} label="Total de productos" value={products.length} detail="En el catálogo" /><Metric icon={Check} label="Publicados" value={published} detail="Visibles al público" accent="green" /><Metric icon={Clock3} label="En revisión" value={review} detail="Requieren atención" accent="orange" /><Metric icon={Archive} label="Stock bajo" value={lowStock} detail="Menos de 10 unidades" accent="red" /></div><section className="dashboard-panels"><div className="panel"><div className="panel-heading"><div><div className="section-kicker">Actividad reciente</div><h3>Últimos productos actualizados</h3></div><button className="small-button" onClick={() => setActiveNav('Productos')}>Ver todos <ArrowRight size={14} /></button></div>{products.slice(0, 4).map((product) => <div className="activity-row" key={product.id}><span className="activity-icon"><Package size={16} /></span><div><strong>{product.name}</strong><small>{product.sku} · {statusLabels[product.status]}</small></div><span className="activity-time">Hoy</span></div>)}</div><div className="panel category-panel"><div className="panel-heading"><div><div className="section-kicker">Distribución</div><h3>Por categoría</h3></div><ClipboardList size={18} /></div>{categories.slice(0, 4).map((category) => { const count = products.filter((product) => product.category_id === category.id).length; return <div className="bar-row" key={category.id}><div><span>{category.name}</span><b>{count}</b></div><div className="bar-track"><i style={{ width: `${Math.max(10, products.length ? count / products.length * 100 : 10)}%` }} /></div></div>; })}</div></section></> : <AdminPlaceholder activeNav={activeNav} products={products} brands={brands} onExport={onExport} />}</main></div>;
}

function Metric({ icon: Icon, label, value, detail, accent = 'blue' }: { icon: typeof Package; label: string; value: number; detail: string; accent?: string }) { return <div className="metric-card"><span className={`metric-icon ${accent}`}><Icon size={18} /></span><div><span>{label}</span><strong>{value}</strong><small>{detail}</small></div></div>; }
function AdminPlaceholder({ activeNav, products, brands, onExport }: { activeNav: string; products: Product[]; brands: Brand[]; onExport: () => void }) { const isProducts = activeNav === 'Productos'; return <section className="admin-content-panel"><div className="panel-heading"><div><div className="section-kicker">Módulo administrativo</div><h3>{activeNav}</h3></div>{activeNav === 'Exportar catálogo' ? <button className="primary-button" onClick={onExport}><Download size={16} /> Descargar CSV</button> : <button className="outline-button"><Plus size={16} /> {activeNav === 'Productos' ? 'Agregar producto' : 'Nueva acción'}</button>}</div>{isProducts ? <div className="admin-table"><div className="table-head"><span>Producto</span><span>SKU</span><span>Marca</span><span>Estado</span><span>Stock</span><span /></div>{products.map((product) => <div className="table-row" key={product.id}><strong>{product.name}</strong><span>{product.sku}</span><span>{product.brand?.name ?? brands[0]?.name ?? '—'}</span><span className={`status-badge ${product.status}`}>{statusLabels[product.status]}</span><span>{product.stock}</span><button aria-label="Editar"><Pencil size={15} /></button></div>)}</div> : <div className="module-empty"><div className="module-empty-icon"><FileSpreadsheet size={25} /></div><h3>{activeNav === 'Importar catálogo' ? 'Importa tu información de proveedor' : 'Este módulo está listo para crecer contigo'}</h3><p>{activeNav === 'Importar catálogo' ? 'Carga un archivo Excel o CSV para validar columnas, detectar duplicados y revisar los cambios antes de guardarlos.' : 'La estructura está preparada. Desde aquí podrás consultar y gestionar esta sección.'}</p><button className="outline-button">{activeNav === 'Importar catálogo' ? <><Upload size={16} /> Seleccionar archivo</> : <><Eye size={16} /> Ver información</>}</button></div>}</section>; }

export default App;
