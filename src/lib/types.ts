export type Status = 'draft' | 'review' | 'published' | 'archived';

export type Category = { id: string; name: string };

export type Brand = { id: string; name: string; image_url?: string | null };

export type Page = { name: 'home' } | { name: 'brands' } | { name: 'brand'; brandId: string };

export type Product = {
  id: string; sku: string; name: string; brand_id: string | null; category_id: string | null;
  description: string | null; sale_price: number | null; stock: number; status: Status;
  image_url: string | null; updated_at: string; category?: Category; brand?: Brand;
};

export type DemoProduct = Product & { category: Category; brand: Brand };
