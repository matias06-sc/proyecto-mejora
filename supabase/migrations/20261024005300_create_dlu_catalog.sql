/*
# Create D'Lu Store catalog tables

1. New tables
- `categories`: public catalog categories with display order.
- `brands`: public product brands.
- `products`: independently managed catalog products, prices, stock, media and publication status.
- `audit_logs`: authenticated admin activity history.
2. Security
- RLS is enabled on every table.
- Public visitors may read active catalog data and categories/brands.
- Authenticated users may manage products and audit logs.
- Anonymous users cannot write catalog data.
3. Important notes
- This catalog is independent from Shopify and does not claim external synchronization.
- Product SKU is unique to prevent accidental duplicates.
*/

CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  display_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sku text NOT NULL UNIQUE,
  name text NOT NULL,
  brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  description text,
  technical_specs jsonb NOT NULL DEFAULT '{}'::jsonb,
  cost_price numeric(12,2),
  sale_price numeric(12,2),
  markup_percent numeric(6,2),
  tax_included boolean NOT NULL DEFAULT true,
  stock integer NOT NULL DEFAULT 0,
  supplier text,
  image_url text,
  additional_images text[] NOT NULL DEFAULT '{}',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','review','published','archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  action text NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_status_idx ON public.products(status);
CREATE INDEX IF NOT EXISTS products_category_idx ON public.products(category_id);
CREATE INDEX IF NOT EXISTS products_brand_idx ON public.products(brand_id);
CREATE INDEX IF NOT EXISTS products_updated_idx ON public.products(updated_at DESC);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.categories, public.brands TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.products TO authenticated;
GRANT SELECT, INSERT ON public.audit_logs TO authenticated;

DROP POLICY IF EXISTS "public_read_categories" ON public.categories;
CREATE POLICY "public_read_categories" ON public.categories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_read_brands" ON public.brands;
CREATE POLICY "public_read_brands" ON public.brands FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public_read_published_products" ON public.products;
CREATE POLICY "public_read_published_products" ON public.products FOR SELECT TO anon, authenticated USING (status = 'published' OR auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "authenticated_insert_products" ON public.products;
CREATE POLICY "authenticated_insert_products" ON public.products FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "authenticated_update_products" ON public.products;
CREATE POLICY "authenticated_update_products" ON public.products FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "authenticated_delete_products" ON public.products;
CREATE POLICY "authenticated_delete_products" ON public.products FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "authenticated_read_audit_logs" ON public.audit_logs;
CREATE POLICY "authenticated_read_audit_logs" ON public.audit_logs FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "authenticated_insert_audit_logs" ON public.audit_logs;
CREATE POLICY "authenticated_insert_audit_logs" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
