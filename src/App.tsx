import { useEffect, useState } from 'react';
import { PageContent } from '@/components/layout/PageContent';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { CartDrawer } from '@/components/store/CartDrawer';
import { clearCart, readCart, saveCart } from '@/lib/cart';
import { fetchCatalog } from '@/lib/catalog';
import { readRecentlyViewed, saveRecentlyViewed } from '@/lib/recentProducts';
import { pageFromHash, pageToHash } from '@/lib/router';
import { supabase } from '@/lib/supabase';
import type { Brand, CartItem, Category, Page, Product } from '@/lib/types';

function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [page, setPage] = useState<Page>(() => pageFromHash());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<string[]>(() => readRecentlyViewed());

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      if (
        hash === '#inicio' ||
        hash === '#/tienda' ||
        hash === '#/marcas' ||
        hash.startsWith('#/marca/') ||
        hash.startsWith('#/producto/') ||
        hash.startsWith('#/pago/resultado')
      )
        setPage(pageFromHash());
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
      saveRecentlyViewed(next);
      return next;
    });
  }, [page]);

  useEffect(() => {
    if (page.name === 'payment' && page.status === 'approved' && page.externalReference)
      emptyCart();
  }, [page]);

  async function loadCatalog() {
    const data = await fetchCatalog();
    if (!data) return;
    if (data.products) {
      setProducts(data.products);
      setCart((prev) => {
        if (prev.length) return prev;
        return readCart().flatMap(({ productId, quantity }): CartItem[] => {
          const product = data.products?.find((item) => item.id === productId);
          if (!product || product.stock <= 0) return [];
          return [{ product, quantity: Math.min(quantity, product.stock) }];
        });
      });
    }
    if (data.categories?.length) setCategories(data.categories);
    if (data.brands?.length) setBrands(data.brands);
  }

  function commitCart(next: CartItem[]) {
    setCart(next);
    saveCart(next);
  }

  function emptyCart() {
    setCart([]);
    clearCart();
  }

  function navigate(next: Page) {
    const hash = pageToHash(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (window.location.hash === hash) setPage(next);
    else window.location.hash = hash;
  }

  function goSection(id: string) {
    if (page.name !== 'home') navigate({ name: 'home' });
    window.setTimeout(
      () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }),
      page.name === 'home' ? 0 : 90,
    );
  }

  function selectProduct(product: Product) {
    navigate({ name: 'product', productId: product.id });
  }

  function addToCart(product: Product, quantity: number) {
    if (product.stock <= 0) return;
    const existing = cart.find((item) => item.product.id === product.id);
    if (existing) {
      commitCart(
        cart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, Math.max(1, product.stock)) }
            : item,
        ),
      );
      return;
    }
    commitCart([...cart, { product, quantity: Math.min(quantity, Math.max(1, product.stock)) }]);
  }

  function updateCartQuantity(productId: string, quantity: number) {
    commitCart(
      cart.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.max(1, Math.min(quantity, Math.max(1, item.product.stock))) }
          : item,
      ),
    );
  }

  function removeFromCart(productId: string) {
    commitCart(cart.filter((item) => item.product.id !== productId));
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
      const { data, error } = await supabase.functions.invoke<{
        init_point?: string;
        error?: string;
      }>('mercadopago-checkout', {
        body: {
          items: cart.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
        },
      });
      if (error) {
        let message = 'No se pudo iniciar el pago con Mercado Pago.';
        const context = (error as { context?: Response }).context;
        if (context && typeof context.json === 'function') {
          try {
            const payload = (await context.json()) as { error?: string };
            if (payload.error) message = payload.error;
          } catch {
            /* response without JSON body */
          }
        }
        throw new Error(message);
      }
      if (!data?.init_point)
        throw new Error(data?.error ?? 'Mercado Pago no devolvió el enlace de pago.');
      window.location.href = data.init_point;
    } catch (error) {
      setCheckoutError(error instanceof Error ? error.message : 'No se pudo iniciar el pago.');
    } finally {
      setCheckoutLoading(false);
    }
  }

  const activeBrand =
    page.name === 'brand' ? (brands.find((brand) => brand.id === page.brandId) ?? null) : null;
  const activeProduct =
    page.name === 'product'
      ? (products.find((product) => product.id === page.productId) ?? null)
      : null;
  const relatedProducts = activeProduct
    ? products
        .filter(
          (product) =>
            product.id !== activeProduct.id &&
            ((product.brand_id && product.brand_id === activeProduct.brand_id) ||
              (product.brand?.id && product.brand.id === activeProduct.brand?.id)),
        )
        .slice(0, 3)
    : [];
  const recentlyViewed = recentlyViewedIds
    .map((id) => products.find((product) => product.id === id))
    .filter(
      (product): product is Product => product !== undefined && product.id !== activeProduct?.id,
    )
    .slice(0, 3);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-shell">
      <SiteHeader
        page={page}
        cartCount={cartCount}
        onNavigate={navigate}
        onGoSection={goSection}
        onOpenCart={() => {
          setCheckoutError('');
          setCartOpen(true);
        }}
      />

      <PageContent
        page={page}
        products={products}
        categories={categories}
        brands={brands}
        activeBrand={activeBrand}
        activeProduct={activeProduct}
        relatedProducts={relatedProducts}
        recentlyViewed={recentlyViewed}
        onNavigate={navigate}
        onGoSection={goSection}
        onSelectProduct={selectProduct}
        onAddToCart={addToCart}
        onBuyNow={buyNow}
      />
      <SiteFooter onGoBrands={() => navigate({ name: 'brands' })} />

      <CartDrawer
        open={cartOpen}
        items={cart}
        checkoutLoading={checkoutLoading}
        checkoutError={checkoutError}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={updateCartQuantity}
        onRemove={removeFromCart}
        onClear={emptyCart}
        onCheckout={startCheckout}
      />
    </div>
  );
}

export default App;
