import { fits } from '../data/catalog.js';

export default function FitSection() {
  return <section className="fit-section" id="fits" aria-labelledby="fit-title">
    <div className="section-heading"><div><p className="eyebrow">01 / The denim collection</p><h2 id="fit-title">Find your silhouette.</h2></div><p>Different fits. Same freedom to be you.</p></div>
    <div className="fit-grid">{fits.map((fit, index) => <a className="fit-card" href={`https://www.asos.com/search/?q=${encodeURIComponent(`${fit.name} jeans`)}`} key={fit.name}>
      <img src={fit.image} alt="" width="960" height="1225" loading="lazy" decoding="async" />
      <span><small aria-hidden="true">0{index + 1}</small>{fit.name}<b aria-hidden="true">↗</b></span>
    </a>)}</div>
  </section>;
}
