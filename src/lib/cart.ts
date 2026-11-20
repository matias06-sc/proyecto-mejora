import type { CartItem } from '@/lib/types';

const CART_KEY = 'dlu-cart';

type StoredCartItem = { productId: string; quantity: number };

export function readCart(): StoredCartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry): StoredCartItem[] => {
      if (!entry || typeof entry !== 'object') return [];
      const { productId, quantity } = entry as Record<string, unknown>;
      if (typeof productId !== 'string' || typeof quantity !== 'number' || !Number.isInteger(quantity))
        return [];
      return [{ productId, quantity: Math.max(1, quantity as number) }];
    });
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    const stored: StoredCartItem[] = items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));
    window.localStorage.setItem(CART_KEY, JSON.stringify(stored));
  } catch {
    /* storage unavailable */
  }
}

export function clearCart(): void {
  try {
    window.localStorage.removeItem(CART_KEY);
  } catch {
    /* storage unavailable */
  }
}
