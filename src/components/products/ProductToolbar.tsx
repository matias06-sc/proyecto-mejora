import { ArrowUpDown, ChevronDown, Filter, Search, X } from 'lucide-react';
import type { SortOption } from '@/lib/catalogFilters';
import type { Category } from '@/lib/types';

type ProductToolbarProps = {
  className?: string;
  search: string;
  categoryFilter: string;
  categories: Category[];
  minPrice: string;
  maxPrice: string;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

export function ProductToolbar({
  className = 'catalog-toolbar',
  search,
  categoryFilter,
  categories,
  minPrice,
  maxPrice,
  sort,
  onSearchChange,
  onCategoryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
}: ProductToolbarProps) {
  return (
    <div className={className}>
      <div className="search-box">
        <Search size={18} />
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar por nombre, SKU o marca"
          aria-label="Buscar productos"
        />
      </div>
      <div className="filter-box">
        <Filter size={16} />
        <select
          value={categoryFilter}
          onChange={(event) => onCategoryChange(event.target.value)}
          aria-label="Filtrar por categoría"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((category) => (
            <option value={category.id} key={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <ChevronDown size={15} />
      </div>
      <div className="price-range">
        <span>S/</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={minPrice}
          onChange={(event) => onMinPriceChange(event.target.value)}
          placeholder="Mín"
          aria-label="Precio mínimo"
        />
        <span className="price-range-dash">-</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={maxPrice}
          onChange={(event) => onMaxPriceChange(event.target.value)}
          placeholder="Máx"
          aria-label="Precio máximo"
        />
      </div>
      <div className="filter-box sort-box">
        <ArrowUpDown size={16} />
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value as SortOption)}
          aria-label="Ordenar productos"
        >
          <option value="default">Orden por defecto</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
        <ChevronDown size={15} />
      </div>
      {hasActiveFilters && (
        <button type="button" className="clear-filters-button" onClick={onClearFilters}>
          <X size={15} /> Limpiar filtros
        </button>
      )}
    </div>
  );
}
