import { BrandDetailPage, BrandNotFoundPage } from '@/components/brands/BrandDetailPage';
import { BrandsPage } from '@/components/brands/BrandsPage';
import { HomePage } from '@/components/home/HomePage';
import { PaymentResultPage } from '@/components/store/PaymentResultPage';
import { ProductDetailPage, ProductNotFoundPage } from '@/components/store/ProductDetailPage';
import { StorePage } from '@/components/store/StorePage';
import type { Brand, Category, Page, Product } from '@/lib/types';

type PageContentProps = {
  page: Page;
  products: Product[];
  categories: Category[];
  brands: Brand[];
  activeBrand: Brand | null;
  activeProduct: Product | null;
  relatedProducts: Product[];
  recentlyViewed: Product[];
  onNavigate: (page: Page) => void;
  onGoSection: (id: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
};

export function PageContent({
  page,
  products,
  categories,
  brands,
  activeBrand,
  activeProduct,
  relatedProducts,
  recentlyViewed,
  onNavigate,
  onGoSection,
  onSelectProduct,
  onAddToCart,
  onBuyNow,
}: PageContentProps) {
  if (page.name === 'home')
    return (
      <HomePage
        products={products}
        categories={categories}
        brands={brands}
        onNavigateBrands={() => onNavigate({ name: 'brands' })}
        onSelectBrand={(brand) => onNavigate({ name: 'brand', brandId: brand.id })}
        onGoSection={onGoSection}
        onSelectProduct={onSelectProduct}
      />
    );

  if (page.name === 'payment')
    return (
      <PaymentResultPage
        status={page.status}
        paymentId={page.paymentId}
        externalReference={page.externalReference}
        onBack={() => onNavigate({ name: 'store' })}
      />
    );

  if (page.name === 'store')
    return (
      <StorePage
        products={products}
        categories={categories}
        brands={brands}
        onSelectProduct={onSelectProduct}
      />
    );

  if (page.name === 'product')
    return activeProduct ? (
      <ProductDetailPage
        key={activeProduct.id}
        product={activeProduct}
        relatedProducts={relatedProducts}
        recentlyViewed={recentlyViewed}
        onBack={() => onNavigate({ name: 'store' })}
        onSelectProduct={onSelectProduct}
        onAddToCart={onAddToCart}
        onBuyNow={onBuyNow}
      />
    ) : (
      <ProductNotFoundPage onBack={() => onNavigate({ name: 'store' })} />
    );

  if (page.name === 'brands')
    return (
      <BrandsPage
        brands={brands}
        onSelectBrand={(brand) => onNavigate({ name: 'brand', brandId: brand.id })}
        onGoCatalog={() => onGoSection('catalogo')}
      />
    );

  return activeBrand ? (
    <BrandDetailPage
      brand={activeBrand}
      products={products}
      onBack={() => onNavigate({ name: 'brands' })}
      onSelectProduct={onSelectProduct}
    />
  ) : (
    <BrandNotFoundPage onBack={() => onNavigate({ name: 'brands' })} />
  );
}
