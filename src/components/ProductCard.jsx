import { formatPrice } from '../data/shopping.js';

export default function ProductCard({ product, onSelect }) {
  return <article className="product-card" data-product-id={product.id}>
    <button className="product-card__photo" onClick={() => onSelect(product)} aria-label={`View ${product.title}`}>
      <img src={product.image} alt="" width="360" height="459" loading="lazy" decoding="async" />
    </button>
    <div className="product-card__content">
      <h3><button onClick={() => onSelect(product)}>{product.title}</button></h3>
      <p className="product-card__price">{formatPrice(product.priceInCents)}</p>
    </div>
  </article>;
}
