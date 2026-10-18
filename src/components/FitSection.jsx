import { fits } from '../data/catalog.js';

export default function FitSection() {
  return <section className="fit-section" id="fits" aria-labelledby="fit-title">
    <h2 id="fit-title">Shop by fit</h2>
    <div className="fit-grid">{fits.map((fit) => <a className="fit-card" href={`https://www.asos.com/search/?q=${encodeURIComponent(`${fit.name} jeans`)}`} key={fit.name}>
      <img src={fit.image} alt="" width="242" height="308" loading="lazy" decoding="async" />
      <span>{fit.name}</span>
    </a>)}</div>
  </section>;
}
