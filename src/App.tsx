import { useEffect, useState } from 'react';
import { BrandDetailPage, BrandNotFoundPage } from '@/components/brands/BrandDetailPage';
import { BrandsPage } from '@/components/brands/BrandsPage';
import { HomePage } from '@/components/home/HomePage';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { CartDrawer } from '@/components/store/CartDrawer';
import { PaymentResultPage } from '@/components/store/PaymentResultPage';
import { ProductDetailPage, ProductNotFoundPage } from '@/components/store/ProductDetailPage';
import { StorePage } from '@/components/store/StorePage';
import { fetchCatalog } from '@/lib/catalog';
import { demoBrands, demoCategories, demoProducts } from '@/lib/demoData';
import { supabase } from '@/lib/supabase';
import type { Brand, CartItem, Category, Page, Product } from '@/lib/types';

const RECENT_KEY = 'dlu-recent-products';

function pageFromHash(): Page {
  const rawHash = window.location.hash.replace(/^#/, '');
  const queryIndex = rawHash.indexOf('?');
  const hashPath = queryIndex >= 0 ? rawHash.slice(0, queryIndex) : rawHash;
  const hashParams = new URLSearchParams(queryIndex >= 0 ? rawHash.slice(queryIndex + 1) : '');
  const searchParams = new URLSearchParams(window.location.search);
  const getParam = (key: string) => hashParams.get(key) ?? searchParams.get(key);

  if (hashPath === '/pago/resultado') {
    const rawStatus = getParam('collection_status') ?? getParam('status') ?? 'unknown';
    const status = rawStatus === 'approved'
      ? 'approved'
      : rawStatus === 'pending' || rawStatus === 'in_process'
        ? 'pending'
        : rawStatus === 'rejected' || rawStatus === 'failure'
          ? 'failure'
          : 'unknown';
    return { name: 'payment', status, paymentId: getParam('payment_id') ?? undefined, externalReference: getParam('external_reference') ?? undefined };
  }
  if (hashPath === '/tienda') return { name: 'store' };
  const productMatch = hashPath.match(/^\/producto\/(.+)$/);
  if (productMatch) return { name: 'product', productId: decodeURIComponent(productMatch[1]) };
  if (hashPath === '/marcas') return { name: 'brands' };
  const match = hashPath.match(/^\/marca\/(.+)$/);
  if (match) return { name: 'brand', brandId: decodeURIComponent(match[1]) };
  return { name: 'home' };
}

function readRecentlyViewed(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string').slice(0, 8) : [];
  } catch {
    return [];
  }
}

function App() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [categories, setCategories] = useState<Category[]>(demoCategories);
  const [brands, setBrands] = useState<Brand[]>(demoBrands);
  const [page, setPage] = useState<Page>(() => pageFromHash());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => readRecentlyViewed());

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#inicio' || hash === '#/tienda' || hash === '#/marcas' || hash.startsWith('#/marca/') || hash.startsWith('#/producto/') || hash.startsWith('#/pago/resultado')) setPage(pageFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    void loadCatalog();
    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  useEffect(() => {
    if (page.name !== 'product') return;
    setRecentlyViewedIds((prev) => {
      const next = [page.productId, ...prev.filter((id) => id !== page.productId)].slice(0, 8);
      try { window.localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch { /* storage unavailable */ }
      return next;
    });
  }, [page]);

  useEffect(() => {
    if (page.name === 'payment' && page.status === 'approved' && page.externalReference) setCart([]);
  }, [page]);

  async function loadCatalog() {
    const data = await fetchCatalog();
    if (!data) return;
    if (data.products) setProducts(data.products);
    if (data.categories?.length) setCategories(data.categories);
    if (data.brands?.length) setBrands(data.brands);
  }

  function navigate(next: Page) {
    const hash = next.name === 'home' ? '#inicio'
      : next.name === 'store' ? '#/tienda'
      : next.name === 'product' ? `#/producto/${encodeURIComponent(next.productId)}`
      : next.name === 'payment' ? '#/pago/resultado'
      : next.name === 'brands' ? '#/marcas'
      : `#/marca/${next.brandId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash === hash) setPage(next);
    else window.location.hash = hash;
  }

  function goSection(id: string) {
    if (page.name !== 'home') navigate({ name: 'home' });
    window.setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), page.name === 'home' ? 0 : 90);
  }

  function selectProduct(product: Product) {
    navigate({ name: 'product', productId: product.id });
  }

  function addToCart(product: Product, quantity: number) {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) => item.product.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantity, Math.max(1, product.stock)) } : item);
      }
      return [...prev, { product, quantity: Math.min(quantity, Math.max(1, product.stock)) }];
    });
  }

  function updateCartQuantity(productId: string, quantity: number) {
    setCart((prev) => prev.map((item) => item.product.id === productId ? { ...item, quantity: Math.max(1, Math.min(quantity, Math.max(1, item.product.stock))) } : item));
  }

  function removeFromCart(productId: string) {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  }

  function buyNow(product: Product, quantity: number) {
    addToCart(product, quantity);
    setCheckoutError('');
    setCartOpen(true);
  }

  async function startCheckout() {
    if (!cart.length || checkoutLoading) return;
    setCheckoutError('');
    setCheckoutLoading(true);
    try {
      if (!supabase) throw new Error('Falta configurar Supabase en el archivo .env.');
      const { data, error } = await supabase.functions.invoke<{ init_point?: string; error?: string }>('mercadopago-checkout', {
        body: { items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity })) },
      });
      if (error) {
        let message = 'No se pudo iniciar el pago con Mercado Pago.';
        const context = (error as { context?: Response }).context;
        if (context && typeof context.json === 'function') {
          try {
            const payload = await context.json() as { error?: string };
            if (payload.error) message = payload.error;
          } catch { /* response without JSON body */ }
        }
        throw new Error(message);
      }
      if (!data?.init_point) throw new Error(data?.error ?? 'Mercado Pago no devolvió el enlace de pago.');
      window.location.href = data.init_point;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'No se pudo iniciar el pago.');
    } finally {
      setCheckoutLoading(false);
    }
  }

  const activeBrand = page.name === 'brand' ? brands.find((brand) => brand.id === page.brandId) ?? null : null;
  const activeProduct = page.name === 'product' ? products.find((product) => product.id === page.productId) ?? null : null;
  const relatedProducts = activeProduct
    ? products.filter((product) => product.id !== activeProduct.id && ((product.brand_id && product.brand_id === activeProduct.brand_id) || (product.brand?.id && product.brand.id === activeProduct.brand?.id))).slice(0, 3)
    : [];
  const recentlyViewed = recentlyViewedIds
    .map((id) => products.find((product) => product.id === id))
    .filter((product): product is Product => product !== undefined && product.id !== activeProduct?.id)
    .slice(0, 3);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-shell">
      <SiteHeader page={page} cartCount={cartCount} onNavigate={navigate} onGoSection={goSection} onOpenCart={() => { setCheckoutError(''); setCartOpen(true); }} />

      {page.name === 'home' ? (
        <HomePage products={products} categories={categories} brands={brands} onNavigateBrands={() => navigate({ name: 'brands' })} onSelectBrand={(brand) => navigate({ name: 'brand', brandId: brand.id })} onGoSection={goSection} onSelectProduct={selectProduct} />
      ) : page.name === 'payment' ? (
        <PaymentResultPage status={page.status} paymentId={page.paymentId} externalReference={page.externalReference} onBack={() => navigate({ name: 'store' })} />
      ) : page.name === 'store' ? (
        <StorePage products={products} categories={categories} brands={brands} onSelectProduct={selectProduct} />
      ) : page.name === 'product' ? (
        activeProduct ? (
          <ProductDetailPage key={activeProduct.id} product={activeProduct} relatedProducts={relatedProducts} recentlyViewed={recentlyViewed} onBack={() => navigate({ name: 'store' })} onSelectProduct={selectProduct} onAddToCart={addToCart} onBuyNow={buyNow} />
        ) : (
          <ProductNotFoundPage onBack={() => navigate({ name: 'store' })} />
        )
      ) : page.name === 'brands' ? (
        <BrandsPage brands={brands} onSelectBrand={(brand) => navigate({ name: 'brand', brandId: brand.id })} onGoCatalog={() => goSection('catalogo')} />
      ) : activeBrand ? (
        <BrandDetailPage brand={activeBrand} products={products} onBack={() => navigate({ name: 'brands' })} onSelectProduct={selectProduct} />
      ) : (
        <BrandNotFoundPage onBack={() => navigate({ name: 'brands' })} />
      )}
      <SiteFooter onGoBrands={() => navigate({ name: 'brands' })} />

      <CartDrawer open={cartOpen} items={cart} checkoutLoading={checkoutLoading} checkoutError={checkoutError} onClose={() => setCartOpen(false)} onUpdateQuantity={updateCartQuantity} onRemove={removeFromCart} onClear={() => setCart([])} onCheckout={startCheckout} />
    </div>
  );
}

export default App;
