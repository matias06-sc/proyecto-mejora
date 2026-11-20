import { useEffect, useMemo, useRef, useState } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Package,
  Search,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { StoreProductCard } from '@/components/store/StoreProductCard';
import { brandImageSrc } from '@/lib/brands';
import type { Brand, Category, Product } from '@/lib/types';

type StorePageProps = {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  onSelectProduct: (product: Product) => void;
};

export function StorePage({ products, categories, brands, onSelectProduct }: StorePageProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const brandRowRef = useRef<HTMLDivElement>(null);
  const brandDragRef = useRef<{ x: number; scrollLeft: number; pointerId: number; moved: boolean } | null>(
    null,
  );
  const suppressBrandClickRef = useRef(false);
  const [brandScroll, setBrandScroll] = useState({ left: false, right: false });
  const [brandDragging, setBrandDragging] = useState(false);

  const filteredProducts = useMemo(
    () =>
      products.filter((product) => {
        const query = search.toLowerCase();
        const matchesSearch =
          !query ||
          product.name.toLowerCase().includes(query) ||
          product.sku.toLowerCase().includes(query) ||
          (product.brand?.name ?? '').toLowerCase().includes(query);
        const matchesCategory = categoryFilter === 'all' || product.category_id === categoryFilter;
        const matchesBrand =
          brandFilter === 'all' ||
          product.brand_id === brandFilter ||
          product.brand?.id === brandFilter;
        return matchesSearch && matchesCategory && matchesBrand;
      }),
    [products, search, categoryFilter, brandFilter],
  );

  useEffect(() => {
    const row = brandRowRef.current;
    if (!row) return;

    function updateScrollState() {
      if (!row) return;
      setBrandScroll({
        left: row.scrollLeft > 0,
        right: row.scrollLeft + row.clientWidth < row.scrollWidth - 1,
      });
    }

    updateScrollState();
    row.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      row.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [brands.length]);

  function scrollBrands(direction: -1 | 1) {
    const row = brandRowRef.current;
    if (!row) return;
    row.scrollBy({ left: direction * row.clientWidth, behavior: 'smooth' });
  }

  function startBrandDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return;
    brandDragRef.current = {
      x: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
      pointerId: event.pointerId,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveBrandDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = brandDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    const distance = event.clientX - drag.x;
    if (!drag.moved && Math.abs(distance) < 4) return;
    if (!drag.moved) {
      drag.moved = true;
      setBrandDragging(true);
    }
    event.currentTarget.scrollLeft = drag.scrollLeft - distance;
  }

  function endBrandDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = brandDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (drag.moved) {
      suppressBrandClickRef.current = true;
      window.setTimeout(() => {
        suppressBrandClickRef.current = false;
      }, 0);
    }
    brandDragRef.current = null;
    setBrandDragging(false);
  }

  function clearFilters() {
    setSearch('');
    setCategoryFilter('all');
    setBrandFilter('all');
  }

  return (
    <main className="store-page">
      <section className="store-hero">
        <div className="store-hero-copy">
          <div className="eyebrow">
            <span className="pulse-dot" /> Tienda D’Lu Store
          </div>
          <h1>
            Productos<em>.</em>
          </h1>
          <p>
            Todo nuestro catálogo en un solo lugar: tecnología original, con garantía real y envío a
            todo el Perú.
          </p>
          <div className="store-hero-badges">
            <span>
              <ShieldCheck size={15} /> Productos originales
            </span>
            <span>
              <Truck size={15} /> Envío a Perú
            </span>
          </div>
        </div>
        <div className="store-hero-panel">
          <div className="store-hero-panel-inner">
            <span className="store-hero-icon">
              <Package size={26} />
            </span>
            <strong>{products.length}</strong>
            <span>productos disponibles</span>
            <small>Original · Garantía · Envío a Perú</small>
          </div>
        </div>
      </section>

      <section className="store-content">
        <div className="store-toolbar">
          <div className="search-box">
            <Search size={18} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar por nombre, SKU o marca"
            />
          </div>
          <div className="filter-box">
            <Filter size={16} />
            <select
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value)}
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
        </div>

        <div className="store-divider" />

        <div className="store-brands">
          <div className="store-brands-head">
            <div>
              <div className="section-kicker">Marcas destacadas</div>
              <span>Filtra por tu marca favorita</span>
            </div>
            <div className="store-brand-nav">
              <button
                type="button"
                aria-label="Ver marcas anteriores"
                disabled={!brandScroll.left}
                onClick={() => scrollBrands(-1)}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Ver más marcas"
                disabled={!brandScroll.right}
                onClick={() => scrollBrands(1)}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div
            className={`store-brand-row ${brandDragging ? 'dragging' : ''}`}
            ref={brandRowRef}
            onPointerDown={startBrandDrag}
            onPointerMove={moveBrandDrag}
            onPointerUp={endBrandDrag}
            onPointerCancel={endBrandDrag}
            onClickCapture={(event) => {
              if (suppressBrandClickRef.current) {
                event.preventDefault();
                event.stopPropagation();
                suppressBrandClickRef.current = false;
              }
            }}
          >
            <button
              className={`store-brand-chip ${brandFilter === 'all' ? 'active' : ''}`}
              onClick={() => setBrandFilter('all')}
            >
              <span className="store-brand-all">Todas</span>
              <small>Todas las marcas</small>
            </button>
            {brands.map((brand) => (
              <button
                key={brand.id}
                className={`store-brand-chip ${brandFilter === brand.id ? 'active' : ''}`}
                onClick={() => setBrandFilter(brandFilter === brand.id ? 'all' : brand.id)}
              >
                <img src={brandImageSrc(brand)} alt={`Logo de ${brand.name}`} loading="lazy" />
                <small>{brand.name}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="store-products-head">
          <div>
            <div className="section-kicker">Catálogo completo</div>
            <h2>Todos los productos</h2>
          </div>
          <div className="catalog-count">
            <strong>{filteredProducts.length}</strong>
            <span>resultados</span>
          </div>
        </div>

        {filteredProducts.length ? (
          <div className="store-product-grid">
            {filteredProducts.map((product) => (
              <StoreProductCard
                key={product.id}
                product={product}
                onClick={() => onSelectProduct(product)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Package size={29} />
            <h3>No encontramos productos</h3>
            <p>Prueba con otra búsqueda, categoría o marca para continuar.</p>
            <button className="outline-button" onClick={clearFilters}>
              Limpiar filtros
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
