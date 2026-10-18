export const MAX_QUANTITY = 10;
export const formatPrice = (cents) => new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(cents / 100);

// Keep saved items from the previous catalogue when merging the duplicate card.
const canonicalId = (id) => id === 'fred-perry-featured' ? 'fred-perry' : id;

export function normalizeSaved(value, validIds) {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id) => typeof id === 'string').map(canonicalId))].filter((id) => validIds.includes(id));
}

export function normalizeBag(value, validIds) {
  if (!Array.isArray(value)) return [];
  const items = new Map();
  for (const entry of value) {
    const legacy = typeof entry === 'string';
    const id = canonicalId(legacy ? entry : entry?.productId);
    const quantity = legacy ? 1 : entry?.quantity;
    if (!validIds.includes(id) || !Number.isInteger(quantity) || quantity < 1) continue;
    // The old string list was a set; both Fred Perry IDs mean one item.
    const previous = items.get(id) || 0;
    items.set(id, Math.min(MAX_QUANTITY, legacy ? Math.max(previous, 1) : previous + quantity));
  }
  return [...items].map(([productId, quantity]) => ({ productId, quantity }));
}

export function addToBag(items, productId, quantity = 1) {
  if (!Number.isInteger(quantity) || quantity < 1) return items;
  if (!items.some((item) => item.productId === productId)) return [...items, { productId, quantity: Math.min(MAX_QUANTITY, quantity) }];
  return items.map((item) => item.productId === productId ? { ...item, quantity: Math.min(MAX_QUANTITY, item.quantity + quantity) } : item);
}

export function bagSubtotal(items, products) {
  return items.reduce((total, item) => total + (products.find((product) => product.id === item.productId)?.priceInCents || 0) * item.quantity, 0);
}

export function searchProducts(products, query) {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return products.filter((product) => {
    const text = `${product.title} ${product.brand || ''} sneakers shoes trainers`.toLowerCase();
    return terms.every((term) => text.includes(term));
  });
}
