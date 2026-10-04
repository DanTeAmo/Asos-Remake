export default function ProductCard({ product, onSelect }) {
  return <article className={`product-card ${product.featured ? 'product-card--featured' : ''}`}>
    <button className="product-card__photo" onClick={() => onSelect(product)} aria-label={`View ${product.title}`}>
      <img src={product.image} alt={product.title} />
    </button>
    <div className="product-card__content">
      <h3><button onClick={() => onSelect(product)}>{product.title}</button></h3>
      <p className="product-card__price">{product.price}</p>
    </div>
  </article>;
}
