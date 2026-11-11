import { supabase } from '@/lib/supabase';
import type { Brand, Category, Product, Status } from '@/lib/types';

export const categoryColors = ['cyan', 'orange', 'blue', 'lime'];

export const statusLabels: Record<Status, string> = { draft: 'Borrador', review: 'En revisión', published: 'Publicado', archived: 'Archivado' };

type CatalogData = {
  products: Product[] | null;
  categories: Category[] | null;
  brands: Brand[] | null;
};

export async function fetchCatalog(): Promise<CatalogData | null> {
  if (!supabase) return null;
  const [{ data: productData }, { data: categoryData }, { data: brandData }] = await Promise.all([
    supabase.from('products').select('*, category:categories(id,name), brand:brands(*)').eq('status', 'published').order('updated_at', { ascending: false }),
    supabase.from('categories').select('id,name').order('display_order'),
    supabase.from('brands').select('*').order('name'),
  ]);
  return {
    products: productData as Product[] | null,
    categories: categoryData as Category[] | null,
    brands: brandData as Brand[] | null,
  };
}

export function downloadCatalogCsv(products: Product[]) {
  const rows = [['SKU', 'Producto', 'Marca', 'Categoría', 'Precio', 'Stock', 'Estado'], ...products.map((p) => [p.sku, p.name, p.brand?.name ?? '', p.category?.name ?? '', String(p.sale_price ?? ''), String(p.stock), statusLabels[p.status]])];
  const blob = new Blob([rows.map((row) => row.map((value) => `"${value.replace(/"/g, '""')}"`).join(',')).join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob); const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'dlu-catalogo.csv'; anchor.click(); URL.revokeObjectURL(url);
}
