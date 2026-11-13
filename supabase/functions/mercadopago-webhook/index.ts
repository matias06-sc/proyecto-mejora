import { createClient } from 'npm:@supabase/supabase-js@2';

type MpPayment = {
  id: string | number;
  status?: string;
  status_detail?: string;
  external_reference?: string | null;
  transaction_amount?: number;
  currency_id?: string;
  payment_method_id?: string;
  payment_type_id?: string;
  payer?: {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: { area_code?: string; number?: string };
  };
};

const MP_PAYMENTS_URL = 'https://api.mercadopago.com/v1/payments';
const ALLOWED_STATUSES = new Set([
  'pending',
  'approved',
  'authorized',
  'in_process',
  'rejected',
  'cancelled',
  'refunded',
  'charged_back',
]);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function hasValidSignature(req: Request, dataId: string, secret: string) {
  if (!secret) return true;
  const signature = req.headers.get('x-signature');
  const requestId = req.headers.get('x-request-id') ?? '';
  if (!signature) return false;

  const parts: Record<string, string> = {};
  for (const part of signature.split(',')) {
    const index = part.indexOf('=');
    if (index > 0) parts[part.slice(0, index).trim()] = part.slice(index + 1).trim();
  }

  const ts = parts.ts;
  const v1 = parts.v1;
  if (!ts || !v1) return false;

  const manifest = `id:${dataId.toLowerCase()};request-id:${requestId};ts:${ts};`;
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(manifest));
  const expected = [...new Uint8Array(signatureBuffer)].map((byte) => byte.toString(16).padStart(2, '0')).join('');

  if (expected.length !== v1.length) return false;
  let difference = 0;
  for (let index = 0; index < expected.length; index += 1) {
    difference |= expected.charCodeAt(index) ^ v1.charCodeAt(index);
  }
  return difference === 0;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Método no permitido.' }, 405);

  const mpAccessToken = Deno.env.get('MP_ACCESS_TOKEN');
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const webhookSecret = Deno.env.get('MP_WEBHOOK_SECRET') ?? '';
  if (!mpAccessToken || !supabaseUrl || !serviceRoleKey) {
    console.error('mercadopago-webhook: missing environment secrets');
    return json({ error: 'Webhook no configurado.' }, 500);
  }

  const url = new URL(req.url);
  let body: { type?: string; action?: string; data?: { id?: string | number } } | null = null;
  try {
    body = await req.json() as typeof body;
  } catch {
    body = null;
  }

  const isPayment = body?.type === 'payment' || Boolean(body?.action?.startsWith('payment.'));
  if (!isPayment) return json({ ignored: true });

  const paymentId = url.searchParams.get('data.id') ?? (body?.data?.id !== undefined ? String(body.data.id) : '');
  if (!paymentId) return json({ error: 'Notificación sin identificador de pago.' }, 400);

  if (!(await hasValidSignature(req, paymentId, webhookSecret))) {
    console.error('mercadopago-webhook: invalid signature');
    return json({ error: 'Firma inválida.' }, 401);
  }

  const paymentResponse = await fetch(`${MP_PAYMENTS_URL}/${encodeURIComponent(paymentId)}`, {
    headers: { Authorization: `Bearer ${mpAccessToken}` },
  });

  if (paymentResponse.status === 404) return json({ ignored: true });
  if (!paymentResponse.ok) {
    console.error('mercadopago-webhook: payment fetch failed', paymentResponse.status);
    return json({ error: 'No se pudo consultar el pago.' }, 502);
  }

  const payment = await paymentResponse.json() as MpPayment;
  const externalReference = payment.external_reference;
  if (!externalReference) return json({ ignored: true });

  const status = payment.status ?? '';
  if (!ALLOWED_STATUSES.has(status)) {
    console.error('mercadopago-webhook: unsupported status', status);
    return json({ ignored: true });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select('total, currency')
    .eq('external_reference', externalReference)
    .maybeSingle();

  if (orderError) {
    console.error('mercadopago-webhook: order query failed', orderError.message);
    return json({ error: 'No se pudo consultar el pedido.' }, 500);
  }
  if (!order) return json({ ignored: true });

  const amount = Number(payment.transaction_amount ?? 0);
  if (payment.currency_id !== order.currency || Math.abs(amount - Number(order.total)) > 0.01) {
    console.error('mercadopago-webhook: amount or currency mismatch', externalReference, amount, payment.currency_id);
    return json({ ignored: true });
  }

  const customer: Record<string, string> = {};
  const customerEmail = payment.payer?.email?.trim();
  const customerName = [payment.payer?.first_name, payment.payer?.last_name].filter(Boolean).join(' ').trim();
  const phoneParts = [payment.payer?.phone?.area_code, payment.payer?.phone?.number].filter(Boolean);
  if (customerEmail) customer.customer_email = customerEmail;
  if (customerName) customer.customer_name = customerName;
  if (phoneParts.length) customer.customer_phone = phoneParts.join(' ');

  if (Object.keys(customer).length) {
    const { error: customerError } = await supabase
      .from('orders')
      .update(customer)
      .eq('external_reference', externalReference);
    if (customerError) console.error('mercadopago-webhook: customer update failed', customerError.message);
  }

  const { error: rpcError } = await supabase.rpc('apply_mp_payment', {
    p_external_reference: externalReference,
    p_payment_id: String(payment.id),
    p_status: status,
    p_payment_method: payment.payment_method_id ?? payment.payment_type_id ?? null,
  });

  if (rpcError) {
    console.error('mercadopago-webhook: apply_mp_payment failed', rpcError.message);
    return json({ error: 'No se pudo actualizar el pedido.' }, 500);
  }

  return json({ ok: true });
});
