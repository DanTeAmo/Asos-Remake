import { brands } from '../data/catalog.js';

export default function BrandSection() {
  return <section className="brand-section" id="brands" aria-labelledby="brand-title">
    <div className="section-heading"><div><p className="eyebrow">03 / In good company</p><h2 id="brand-title">Names you know.<br /><em>Style you make your own.</em></h2></div><p>Discover your favourite brands.</p></div>
    <div className="brand-grid">{brands.map((brand) => <a href={brand.url} key={brand.name} aria-label={`Shop ${brand.name}`}><img src={brand.image} alt={brand.name} loading="lazy" /></a>)}</div>
  </section>;
}
