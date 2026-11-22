import { useEffect, useMemo, useState } from 'react';
import { Package } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductPagination } from '@/components/products/ProductPagination';
import { ProductToolbar } from '@/components/products/ProductToolbar';
import { filterProducts } from '@/lib/catalogFilters';
import type { SortOption } from '@/lib/catalogFilters';
import { usePageSize } from '@/lib/usePageSize';
import type { Category, Product } from '@/lib/types';

type CatalogSectionProps = {
  products: Product[];
  categories: Category[];
  search: string;
  categoryFilter: string;
  minPrice: string;
  maxPrice: string;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onClearFilters: () => void;
  onSelectProduct: (product: Product) => void;
};

export function CatalogSection({
  products,
  categories,
  search,
  categoryFilter,
  minPrice,
  maxPrice,
  sort,
  onSearchChange,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  onClearFilters,
  onSelectProduct,
}: CatalogSectionProps) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [search, categoryFilter, minPrice, maxPrice, sort]);

  const filteredProducts = useMemo(
    () =>
      filterProducts(products, {
        search,
        categoryFilter,
        minPrice,
        maxPrice,
        sort,
      }),
    [products, search, categoryFilter, minPrice, maxPrice, sort],
  );

  const hasActiveFilters =
    search !== '' ||
    categoryFilter !== 'all' ||
    minPrice !== '' ||
    maxPrice !== '' ||
    sort !== 'default';

  const pageSize = usePageSize(3);
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <section className="catalog-section" id="catalogo">
      <div className="section-heading">
        <div>
          <div className="section-kicker">Portafolio seleccionado</div>
          <h2>Conoce nuestro catálogo</h2>
          <p>Productos tecnológicos listos para impulsar tus proyectos.</p>
        </div>
        <div className="catalog-count">
          <strong>{filteredProducts.length}</strong>
          <span>resultados</span>
        </div>
      </div>
      <ProductToolbar
        search={search}
        categoryFilter={categoryFilter}
        categories={categories}
        minPrice={minPrice}
        maxPrice={maxPrice}
        sort={sort}
        onSearchChange={onSearchChange}
        onCategoryChange={onCategoryChange}
        onMinPriceChange={onMinPriceChange}
        onMaxPriceChange={onMaxPriceChange}
        onSortChange={onSortChange}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={onClearFilters}
      />
      {filteredProducts.length ? (
        <>
          <ProductPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            pageSize={pageSize}
            onPageChange={setPage}
          />
          <div className="product-grid">
            {paginatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => onSelectProduct(product)}
              />
            ))}
          </div>
          <ProductPagination
            page={currentPage}
            totalPages={totalPages}
            totalItems={filteredProducts.length}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </>
      ) : (
        <div className="empty-state">
          <Package size={29} />
          <h3>No encontramos productos</h3>
          <p>Prueba con otra búsqueda, categoría o rango de precios.</p>
          <button className="outline-button" onClick={onClearFilters}>
            Limpiar filtros
          </button>
        </div>
      )}
    </section>
  );
}
