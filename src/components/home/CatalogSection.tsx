import { useMemo } from 'react';
import { ChevronDown, Filter, Package, Search } from 'lucide-react';
import { ProductCard } from '@/components/products/ProductCard';
import type { Category, Product } from '@/lib/types';

type CatalogSectionProps = {
  products: Product[];
  categories: Category[];
  search: string;
  categoryFilter: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onClearFilters: () => void;
  onSelectProduct: (product: Product) => void;
};

export function CatalogSection({ products, categories, search, categoryFilter, onSearchChange, onCategoryChange, onClearFilters, onSelectProduct }: CatalogSectionProps) {
  const filteredProducts = useMemo(() => products.filter((product) => {
    const query = search.toLowerCase();
    const matchesSearch = !query || product.name.toLowerCase().includes(query) || product.sku.toLowerCase().includes(query) || (product.brand?.name ?? '').toLowerCase().includes(query);
    const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
    return matchesSearch && matchesCategory;
  }), [products, search, categoryFilter]);

  return (
    <section className="catalog-section" id="catalogo"><div className="section-heading"><div><div className="section-kicker">Portafolio seleccionado</div><h2>Conoce nuestro catálogo</h2><p>Productos tecnológicos listos para impulsar tus proyectos.</p></div><div className="catalog-count"><strong>{filteredProducts.length}</strong><span>resultados</span></div></div><div className="catalog-toolbar"><div className="search-box"><Search size={18} /><input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Buscar por nombre, SKU o marca" /></div><div className="filter-box"><Filter size={16} /><select value={categoryFilter} onChange={(event) => onCategoryChange(event.target.value)}><option value="all">Todas las categorías</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select><ChevronDown size={15} /></div></div>{filteredProducts.length ? <div className="product-grid">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} onClick={() => onSelectProduct(product)} />)}</div> : <div className="empty-state"><Package size={29} /><h3>No encontramos productos</h3><p>Prueba con otra búsqueda o categoría para continuar.</p><button className="outline-button" onClick={onClearFilters}>Limpiar filtros</button></div>}</section>
  );
}
