/*
# Add optional brand images

1. Changes
- Adds `image_url` to `brands` so each brand can display its official logo.
2. Notes
- Existing brands keep working without an image; the app renders a monogram fallback.
- The seeded demo brands point to the local logo assets used by the storefront.
*/

ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS image_url text;

UPDATE public.brands SET image_url = '/brands/tp-link.svg' WHERE name = 'TP-Link' AND image_url IS NULL;
UPDATE public.brands SET image_url = '/brands/hikvision.svg' WHERE name = 'Hikvision' AND image_url IS NULL;
UPDATE public.brands SET image_url = '/brands/logitech.svg' WHERE name = 'Logitech' AND image_url IS NULL;
