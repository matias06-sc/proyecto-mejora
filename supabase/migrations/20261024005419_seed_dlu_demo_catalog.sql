/*
# Seed clearly labeled D'Lu Store demo catalog

1. Demo data
- Adds four sample categories, three sample brands and three sample products.
- Every sample product is prefixed with `DEMO` in its SKU so it can be identified and replaced.
2. Safety
- Uses conflict-safe inserts and never deletes or overwrites existing catalog data.
- No permissions or policies are changed.
*/

INSERT INTO public.categories (name, description, display_order) VALUES
  ('Redes y WiFi', 'Conectividad para hogares y negocios', 1),
  ('Cámaras de seguridad', 'Videovigilancia y monitoreo', 2),
  ('Computadoras y accesorios', 'Productividad y periféricos', 3),
  ('Sistemas de energía', 'Continuidad y protección eléctrica', 4)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.brands (name) VALUES ('TP-Link'), ('Hikvision'), ('Logitech')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.products (sku, name, brand_id, category_id, description, sale_price, stock, status)
SELECT 'DEMO-001', 'DEMO · Router WiFi 6 AX1800', b.id, c.id, 'Registro de demostración para reemplazar con información real.', 249.90, 18, 'published'
FROM public.brands b, public.categories c WHERE b.name = 'TP-Link' AND c.name = 'Redes y WiFi'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (sku, name, brand_id, category_id, description, sale_price, stock, status)
SELECT 'DEMO-002', 'DEMO · Cámara IP ColorVu 4MP', b.id, c.id, 'Registro de demostración para reemplazar con información real.', 389.00, 7, 'published'
FROM public.brands b, public.categories c WHERE b.name = 'Hikvision' AND c.name = 'Cámaras de seguridad'
ON CONFLICT (sku) DO NOTHING;

INSERT INTO public.products (sku, name, brand_id, category_id, description, sale_price, stock, status)
SELECT 'DEMO-003', 'DEMO · Teclado inalámbrico compacto', b.id, c.id, 'Registro de demostración para reemplazar con información real.', 119.90, 26, 'published'
FROM public.brands b, public.categories c WHERE b.name = 'Logitech' AND c.name = 'Computadoras y accesorios'
ON CONFLICT (sku) DO NOTHING;
