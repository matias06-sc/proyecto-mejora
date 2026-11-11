import type { Brand, Category, DemoProduct } from '@/lib/types';

export const demoCategories: Category[] = [
  { id: 'cat-network', name: 'Redes y WiFi' }, { id: 'cat-security', name: 'Cámaras de seguridad' },
  { id: 'cat-computing', name: 'Computadoras y accesorios' }, { id: 'cat-energy', name: 'Sistemas de energía' },
];

export const demoBrands: Brand[] = [{ id: 'br-tp', name: 'TP-Link' }, { id: 'br-hik', name: 'Hikvision' }, { id: 'br-logi', name: 'Logitech' }];

export const demoProducts: DemoProduct[] = [
  { id: 'demo-1', sku: 'DLU-DEMO-001', name: 'Router WiFi 6 AX1800', brand_id: 'br-tp', category_id: 'cat-network', description: 'Conectividad estable para hogares y pequeñas empresas.', sale_price: 249.9, stock: 18, status: 'published', image_url: null, updated_at: new Date().toISOString(), category: demoCategories[0], brand: demoBrands[0] },
  { id: 'demo-2', sku: 'DLU-DEMO-002', name: 'Cámara IP ColorVu 4MP', brand_id: 'br-hik', category_id: 'cat-security', description: 'Monitoreo inteligente con visión nocturna a color.', sale_price: 389.0, stock: 7, status: 'published', image_url: null, updated_at: new Date().toISOString(), category: demoCategories[1], brand: demoBrands[1] },
  { id: 'demo-3', sku: 'DLU-DEMO-003', name: 'Teclado inalámbrico compacto', brand_id: 'br-logi', category_id: 'cat-computing', description: 'Diseño minimalista, silencioso y ergonómico.', sale_price: 119.9, stock: 26, status: 'published', image_url: null, updated_at: new Date().toISOString(), category: demoCategories[2], brand: demoBrands[2] },
];
