import { useEffect, useState } from 'react';
import { Dashboard } from '@/components/admin/Dashboard';
import { AdminLoginModal } from '@/components/auth/AdminLoginModal';
import { BrandDetailPage, BrandNotFoundPage } from '@/components/brands/BrandDetailPage';
import { BrandsPage } from '@/components/brands/BrandsPage';
import { HomePage } from '@/components/home/HomePage';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { ProductModal } from '@/components/products/ProductModal';
import { downloadCatalogCsv, fetchCatalog } from '@/lib/catalog';
import { demoBrands, demoCategories, demoProducts } from '@/lib/demoData';
import { supabase } from '@/lib/supabase';
import type { Brand, Category, Page, Product } from '@/lib/types';

function pageFromHash(): Page {
  const hash = window.location.hash.replace(/^#/, '');
  if (hash === '/marcas') return { name: 'brands' };
  const match = hash.match(/^\/marca\/(.+)$/);
  if (match) return { name: 'brand', brandId: decodeURIComponent(match[1]) };
  return { name: 'home' };
}

function App() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [categories, setCategories] = useState<Category[]>(demoCategories);
  const [brands, setBrands] = useState<Brand[]>(demoBrands);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [dashboard, setDashboard] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [notice, setNotice] = useState('');
  const [page, setPage] = useState<Page>(() => pageFromHash());

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === '9') { event.preventDefault(); setAdminOpen(true); }
      if (event.ctrlKey && event.shiftKey && event.key === '9') { event.preventDefault(); setAdminOpen(true); }
    };
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#inicio' || hash === '#/marcas' || hash.startsWith('#/marca/')) setPage(pageFromHash());
    };
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('hashchange', onHashChange);
    void loadCatalog();
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  async function loadCatalog() {
    const data = await fetchCatalog();
    if (!data) return;
    if (data.products) setProducts(data.products);
    if (data.categories?.length) setCategories(data.categories);
    if (data.brands?.length) setBrands(data.brands);
  }

  function navigate(next: Page) {
    const hash = next.name === 'home' ? '#inicio' : next.name === 'brands' ? '#/marcas' : `#/marca/${next.brandId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash === hash) setPage(next);
    else window.location.hash = hash;
  }

  function goSection(id: string) {
    if (page.name !== 'home') navigate({ name: 'home' });
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), page.name === 'home' ? 0 : 90);
  }

  async function logout() {
    await supabase?.auth.signOut();
    setDashboard(false);
    setUserEmail('');
    setNotice('Sesión cerrada correctamente.');
  }

  function exportCsv() {
    downloadCatalogCsv(products);
    setNotice('Catálogo exportado correctamente.');
  }

  function handleAdminSuccess(email: string) {
    setUserEmail(email);
    setAdminOpen(false);
    setDashboard(true);
  }

  const activeBrand = page.name === 'brand' ? brands.find((brand) => brand.id === page.brandId) ?? null : null;

  return (
    <div className="app-shell">
      {!dashboard && <SiteHeader page={page} onNavigate={navigate} onGoSection={goSection} onOpenAdmin={() => setAdminOpen(true)} />}

      {dashboard ? (
        <Dashboard products={products} categories={categories} brands={brands} onLogout={logout} onExport={exportCsv} userEmail={userEmail} notice={notice} />
      ) : (
        <>
          {page.name === 'home' ? (
            <HomePage products={products} categories={categories} brands={brands} onNavigateBrands={() => navigate({ name: 'brands' })} onSelectBrand={(brand) => navigate({ name: 'brand', brandId: brand.id })} onGoSection={goSection} onSelectProduct={setSelectedProduct} />
          ) : page.name === 'brands' ? (
            <BrandsPage brands={brands} onSelectBrand={(brand) => navigate({ name: 'brand', brandId: brand.id })} onGoCatalog={() => goSection('catalogo')} />
          ) : activeBrand ? (
            <BrandDetailPage brand={activeBrand} products={products} onBack={() => navigate({ name: 'brands' })} onSelectProduct={setSelectedProduct} />
          ) : (
            <BrandNotFoundPage onBack={() => navigate({ name: 'brands' })} />
          )}
          <SiteFooter onGoBrands={() => navigate({ name: 'brands' })} />
        </>
      )}

      <AdminLoginModal open={adminOpen} onClose={() => setAdminOpen(false)} onSuccess={handleAdminSuccess} />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}

export default App;
