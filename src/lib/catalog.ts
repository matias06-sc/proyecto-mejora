import { supabase } from '@/lib/supabase';
import type { Brand, Category, Product } from '@/lib/types';

export const categoryColors = ['cyan', 'orange', 'blue', 'lime'];

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
