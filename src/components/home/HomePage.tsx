import { useState } from 'react';
import { BenefitsStrip } from '@/components/home/BenefitsStrip';
import { CatalogSection } from '@/components/home/CatalogSection';
import { CategoryStrip } from '@/components/home/CategoryStrip';
import { CompanySection } from '@/components/home/CompanySection';
import { FeaturedBrands } from '@/components/home/FeaturedBrands';
import { HeroSection } from '@/components/home/HeroSection';
import type { SortOption } from '@/lib/catalogFilters';
import type { Brand, Category, Product } from '@/lib/types';

type HomePageProps = {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  onNavigateBrands: () => void;
  onSelectBrand: (brand: Brand) => void;
  onGoSection: (id: string) => void;
  onSelectProduct: (product: Product) => void;
};

export function HomePage({
  products,
  categories,
  brands,
  onNavigateBrands,
  onSelectBrand,
  onGoSection,
  onSelectProduct,
}: HomePageProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState<SortOption>('default');

  function selectCategory(categoryId: string) {
    setCategoryFilter(categoryId);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main id="inicio">
      <HeroSection
        productCount={products.length}
        brandCount={brands.length}
        onBuy={() => onGoSection('catalogo')}
        onViewBrands={onNavigateBrands}
      />
      <CategoryStrip categories={categories} onSelectCategory={selectCategory} />
      <FeaturedBrands brands={brands} onViewAll={onNavigateBrands} onSelectBrand={onSelectBrand} />
      <CatalogSection
        products={products}
        categories={categories}
        search={search}
        categoryFilter={categoryFilter}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sort={sort}
        onSearchChange={setSearch}
        onCategoryChange={setCategoryFilter}
        onMinPriceChange={setMinPrice}
        onMaxPriceChange={setMaxPrice}
        onSortChange={setSort}
        onClearFilters={() => {
          setSearch('');
          setCategoryFilter('all');
          setMinPrice('');
          setMaxPrice('');
          setSort('default');
        }}
        onSelectProduct={onSelectProduct}
      />
      <BenefitsStrip />
      <CompanySection />
    </main>
  );
}
