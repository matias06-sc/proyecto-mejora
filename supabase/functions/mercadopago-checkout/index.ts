import { createClient } from 'npm:@supabase/supabase-js@2';

type CheckoutItem = { productId?: unknown; quantity?: unknown };
type CheckoutBody = { items?: CheckoutItem[] };
type ProductRow = {
  id: string;
  name: string;
  sku: string;
  sale_price: number | string;
  stock: number;
  status: string;
};

const MP_PREFERENCES_URL = 'https://api.mercadopago.com/checkout/preferences';
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function siteUrl() {
  return (Deno.env.get('SITE_URL') ?? 'https://dlustore.com').replace(/\/+$/, '');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'Método no permitido.' }, 405);

  const origin = req.headers.get('origin');
  const configuredSiteUrl = Deno.env.get('SITE_URL');
  let configuredOrigin = '';
  if (configuredSiteUrl) {
    try {
      configuredOrigin = new URL(configuredSiteUrl).origin;
    } catch {
      console.error('mercadopago-checkout: invalid SITE_URL secret');
      return json({ error: 'La dirección del sitio no está configurada correctamente.' }, 500);
    }
  }
  if (origin && configuredOrigin) {
    const allowed = [configuredOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:4173', 'http://127.0.0.1:4173'];
    if (!allowed.includes(origin)) return json({ error: 'Origen no permitido.' }, 403);
  }

  const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!mpAccessToken || !supabaseUrl || !serviceRoleKey) {
    console.error('mercadopago-checkout: missing environment secrets');
    return json({ error: 'La pasarela de pago no está configurada.' }, 500);
  }

  const baseUrl = siteUrl();
  if (!baseUrl.startsWith('https://')) {
    console.error('mercadopago-checkout: SITE_URL must be a public HTTPS URL');
    return json({ error: 'Mercado Pago requiere una URL pública HTTPS. Configura SITE_URL con tu dominio o un túnel HTTPS.' }, 500);
  }

  let body: CheckoutBody | null = null;
  try {
    body = await req.json() as CheckoutBody;
  } catch {
    return json({ error: 'Solicitud inválida.' }, 400);
  }

  const checkoutItems = body?.items;
  if (!Array.isArray(checkoutItems) || checkoutItems.length === 0 || checkoutItems.length > 50) {
    return json({ error: 'El carrito está vacío o no es válido.' }, 400);
  }

  const requested = new Map<string, number>();
  for (const item of checkoutItems) {
    const productId = typeof item?.productId === 'string' ? item.productId : '';
    const quantity = Number(item?.quantity);
    if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
      return json({ error: 'Hay un producto o una cantidad inválida en el carrito.' }, 400);
    }
    requested.set(productId, (requested.get(productId) ?? 0) + quantity);
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('id, name, sku, sale_price, stock, status')
    .in('id', [...requested.keys()])
    .eq('status', 'published');

  if (productsError) {
    console.error('mercadopago-checkout: product query failed', productsError.message);
    return json({ error: 'No se pudo validar el catálogo. Inténtalo nuevamente.' }, 500);
  }

  const rows = (products ?? []) as ProductRow[];
  if (rows.length !== requested.size) {
    return json({ error: 'Uno de los productos ya no está disponible.' }, 409);
  }

  const items: Array<{ product: ProductRow; quantity: number; unitPriceCents: number; subtotalCents: number }> = [];
  for (const product of rows) {
    const quantity = requested.get(product.id) ?? 0;
    const unitPriceCents = Math.round(Number(product.sale_price ?? 0) * 100);
    if (unitPriceCents <= 0) {
      console.error('mercadopago-checkout: invalid price', product.id);
      return json({ error: 'Uno de los productos no tiene un precio válido.' }, 409);
    }
    if (product.stock < quantity) {
      return json({ error: `Solo quedan ${product.stock} unidades de ${product.name}.` }, 409);
    }
    items.push({ product, quantity, unitPriceCents, subtotalCents: unitPriceCents * quantity });
  }

  const totalCents = items.reduce((sum, item) => sum + item.subtotalCents, 0);
  const externalReference = `DLS-${crypto.randomUUID()}`;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      external_reference: externalReference,
      status: 'pending',
      total: totalCents / 100,
      currency: 'PEN',
    })
    .select('id, external_reference')
    .single();

  if (orderError || !order) {
    console.error('mercadopago-checkout: order insert failed', orderError?.message);
    return json({ error: 'No se pudo registrar el pedido. Inténtalo nuevamente.' }, 500);
  }

  const { error: itemsError } = await supabase.from('order_items').insert(items.map((item) => ({
    order_id: order.id,
    product_id: item.product.id,
    product_name: item.product.name,
    sku: item.product.sku,
    unit_price: item.unitPriceCents / 100,
    quantity: item.quantity,
    subtotal: item.subtotalCents / 100,
  })));

  if (itemsError) {
    console.error('mercadopago-checkout: order items insert failed', itemsError.message);
    await supabase.from('orders').update({ status: 'failed' }).eq('id', order.id);
    return json({ error: 'No se pudo registrar el detalle del pedido.' }, 500);
  }

  const preference = {
    items: items.map((item) => ({
      id: item.product.id,
      title: `${item.product.name} (${item.product.sku})`,
      quantity: item.quantity,
      currency_id: 'PEN',
      unit_price: item.unitPriceCents / 100,
    })),
    external_reference: externalReference,
    statement_descriptor: 'DLU STORE',
    notification_url: `${supabaseUrl}/functions/v1/mercadopago-webhook`,
    back_urls: {
      success: `${baseUrl}/#/pago/resultado`,
      pending: `${baseUrl}/#/pago/resultado`,
      failure: `${baseUrl}/#/pago/resultado`,
    },
    auto_return: 'approved',
    metadata: { order_id: order.id },
  };

  const mpResponse = await fetch(MP_PREFERENCES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${mpAccessToken}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': externalReference,
    },
    body: JSON.stringify(preference),
  });

  if (!mpResponse.ok) {
    const detail = await mpResponse.text();
    console.error('mercadopago-checkout: preference failed', mpResponse.status, detail.slice(0, 500));
    await supabase.from('orders').update({ status: 'failed' }).eq('id', order.id);
    if (detail.includes('invalid_back_urls') || detail.includes('invalid_auto_return')) {
      return json({ error: 'Mercado Pago requiere una URL pública HTTPS. Configura SITE_URL con tu dominio o un túnel HTTPS.' }, 502);
    }
    return json({ error: 'Mercado Pago rechazó la solicitud de pago.' }, 502);
  }

  const mpData = await mpResponse.json() as { id?: string | number; init_point?: string; sandbox_init_point?: string };
  const initPoint = mpAccessToken.startsWith('TEST-')
    ? mpData.sandbox_init_point ?? mpData.init_point
    : mpData.init_point;

  if (!initPoint) {
    await supabase.from('orders').update({ status: 'failed' }).eq('id', order.id);
    return json({ error: 'Mercado Pago no devolvió un enlace de pago.' }, 502);
  }

  if (mpData.id) {
    await supabase.from('orders').update({ mp_preference_id: String(mpData.id) }).eq('id', order.id);
  }

  return json({ init_point: initPoint, external_reference: externalReference });
});
