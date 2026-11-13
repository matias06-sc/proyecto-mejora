/*
# Remove administrative access

The storefront no longer includes an administrative panel. This migration removes
the database access and objects that only existed to support it.

1. Products
- Authenticated clients can no longer insert, update or delete catalog products.
- Only published products are readable, including for authenticated clients.
2. Audit logs
- Drop the administrative audit history table.
*/

DROP POLICY IF EXISTS "authenticated_insert_products" ON public.products;
DROP POLICY IF EXISTS "authenticated_update_products" ON public.products;
DROP POLICY IF EXISTS "authenticated_delete_products" ON public.products;
DROP POLICY IF EXISTS "public_read_published_products" ON public.products;

CREATE POLICY "public_read_published_products" ON public.products
  FOR SELECT TO anon, authenticated
  USING (status = 'published');

REVOKE INSERT, UPDATE, DELETE ON public.products FROM authenticated;

DROP TABLE IF EXISTS public.audit_logs;
