import { useState } from 'react';
import { BenefitsStrip } from '@/components/home/BenefitsStrip';
import { CatalogSection } from '@/components/home/CatalogSection';
import { CategoryStrip } from '@/components/home/CategoryStrip';
import { CompanySection } from '@/components/home/CompanySection';
import { FeaturedBrands } from '@/components/home/FeaturedBrands';
import { HeroSection } from '@/components/home/HeroSection';
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

export function HomePage({ products, categories, brands, onNavigateBrands, onSelectBrand, onGoSection, onSelectProduct }: HomePageProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  function selectCategory(categoryId: string) {
    setCategoryFilter(categoryId);
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <main id="inicio">
      <HeroSection productCount={products.length} brandCount={brands.length} onBuy={() => onGoSection('catalogo')} onViewBrands={onNavigateBrands} />
      <CategoryStrip categories={categories} onSelectCategory={selectCategory} />
      <FeaturedBrands brands={brands} onViewAll={onNavigateBrands} onSelectBrand={onSelectBrand} />
      <CatalogSection products={products} categories={categories} search={search} categoryFilter={categoryFilter} onSearchChange={setSearch} onCategoryChange={setCategoryFilter} onClearFilters={() => { setSearch(''); setCategoryFilter('all'); }} onSelectProduct={onSelectProduct} />
      <BenefitsStrip />
      <CompanySection />
    </main>
  );
}
