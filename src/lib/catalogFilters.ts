import type { Product } from '@/lib/types';

export type SortOption = 'default' | 'price-asc' | 'price-desc';

export type ProductFilterOptions = {
  search: string;
  categoryFilter: string;
  brandFilter?: string;
  minPrice: string;
  maxPrice: string;
  sort: SortOption;
};

function productPrice(product: Product): number {
  return Number(product.sale_price ?? 0);
}

function parsePrice(value: string): number | null {
  if (!value.trim()) return null;
  const price = Number(value);
  return Number.isFinite(price) ? price : null;
}

export function filterProducts(products: Product[], options: ProductFilterOptions): Product[] {
  const query = options.search.trim().toLowerCase();
  const min = parsePrice(options.minPrice);
  const max = parsePrice(options.maxPrice);

  const result = products.filter((product) => {
    const matchesSearch =
      !query ||
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      (product.brand?.name ?? '').toLowerCase().includes(query);
    const matchesCategory =
      options.categoryFilter === 'all' || product.category_id === options.categoryFilter;
    const matchesBrand =
      options.brandFilter === undefined ||
      options.brandFilter === 'all' ||
      product.brand_id === options.brandFilter ||
      product.brand?.id === options.brandFilter;
    const price = productPrice(product);
    const matchesPrice = (min === null || price >= min) && (max === null || price <= max);
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  if (options.sort === 'price-asc') {
    result.sort((a, b) => productPrice(a) - productPrice(b));
  } else if (options.sort === 'price-desc') {
    result.sort((a, b) => productPrice(b) - productPrice(a));
  }

  return result;
}
