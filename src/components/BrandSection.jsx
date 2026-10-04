import { brands } from '../data/catalog.js';

export default function BrandSection() {
  return <section className="brand-section" id="brands" aria-labelledby="brand-title">
    <h2 id="brand-title">Shop by brand</h2>
    <div className="brand-grid">{brands.map((brand) => <a href={brand.url} key={brand.name} aria-label={`Shop ${brand.name}`}><img src={brand.image} alt={brand.name} loading="lazy" /></a>)}</div>
  </section>;
}
