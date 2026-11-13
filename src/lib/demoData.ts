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
  { id: 'demo-4', sku: 'DLU-DEMO-004', name: 'Sistema Mesh Deco X50', brand_id: 'br-tp', category_id: 'cat-network', description: 'Cobertura WiFi 6 para todo el hogar sin puntos muertos.', sale_price: 449.9, stock: 12, status: 'published', image_url: null, updated_at: new Date().toISOString(), category: demoCategories[0], brand: demoBrands[0] },
  { id: 'demo-5', sku: 'DLU-DEMO-005', name: 'Switch Gigabit 8 puertos', brand_id: 'br-tp', category_id: 'cat-network', description: 'Red cableada estable y de alta velocidad para tu oficina.', sale_price: 159.9, stock: 20, status: 'published', image_url: null, updated_at: new Date().toISOString(), category: demoCategories[0], brand: demoBrands[0] },
  { id: 'demo-6', sku: 'DLU-DEMO-006', name: 'NVR 8 canales 4K', brand_id: 'br-hik', category_id: 'cat-security', description: 'Grabación y monitoreo centralizado para hasta 8 cámaras.', sale_price: 749.0, stock: 5, status: 'published', image_url: null, updated_at: new Date().toISOString(), category: demoCategories[1], brand: demoBrands[1] },
  { id: 'demo-7', sku: 'DLU-DEMO-007', name: 'DVR Turbo HD 8 canales', brand_id: 'br-hik', category_id: 'cat-security', description: 'Vigilancia confiable con video en alta definición.', sale_price: 429.0, stock: 9, status: 'published', image_url: null, updated_at: new Date().toISOString(), category: demoCategories[1], brand: demoBrands[1] },
  { id: 'demo-8', sku: 'DLU-DEMO-008', name: 'Mouse inalámbrico M185', brand_id: 'br-logi', category_id: 'cat-computing', description: 'Precisión y comodidad para tu día a día.', sale_price: 69.9, stock: 40, status: 'published', image_url: null, updated_at: new Date().toISOString(), category: demoCategories[2], brand: demoBrands[2] },
  { id: 'demo-9', sku: 'DLU-DEMO-009', name: 'Webcam Full HD C270', brand_id: 'br-logi', category_id: 'cat-computing', description: 'Videollamadas nítidas con audio integrado.', sale_price: 149.9, stock: 15, status: 'published', image_url: null, updated_at: new Date().toISOString(), category: demoCategories[2], brand: demoBrands[2] },
];
