export type Status = 'draft' | 'review' | 'published' | 'archived';

export type Category = { id: string; name: string };

export type Brand = { id: string; name: string; image_url?: string | null };

export type PaymentStatus = 'approved' | 'pending' | 'failure' | 'unknown';

export type Page =
  | { name: 'home' }
  | { name: 'store' }
  | { name: 'product'; productId: string }
  | { name: 'payment'; status: PaymentStatus; paymentId?: string; externalReference?: string }
  | { name: 'brands' }
  | { name: 'brand'; brandId: string };

export type Product = {
  id: string; sku: string; name: string; brand_id: string | null; category_id: string | null;
  description: string | null; sale_price: number | null; stock: number; status: Status;
  image_url: string | null; updated_at: string; category?: Category; brand?: Brand;
};

export type CartItem = { product: Product; quantity: number };

export type DemoProduct = Product & { category: Category; brand: Brand };
