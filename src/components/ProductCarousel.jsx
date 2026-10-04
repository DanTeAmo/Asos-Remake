import { useLayoutEffect, useRef, useState } from 'react';
import { products } from '../data/catalog.js';
import ProductCard from './ProductCard.jsx';

export default function ProductCarousel({ onSelect }) {
  const track = useRef(null);
  const [page, setPage] = useState(1);
  const currentPage = useRef(1);
  const pages = [3, 0, 1, 2].map((start) => [...products.slice(start), ...products.slice(0, start)]);
  useLayoutEffect(() => {
    const element = track.current;
    const resize = () => { element.scrollTo({ left: element.getBoundingClientRect().width * currentPage.current, behavior: 'instant' }); };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const goTo = (next) => {
    const element = track.current;
    currentPage.current = next;
    element.scrollTo({ left: next * element.getBoundingClientRect().width, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  return <section className="hyped-section" id="hyped" aria-labelledby="hyped-title">
    <h2 id="hyped-title">Your most hyped</h2>
    <div className="carousel" aria-roledescription="carousel" aria-label="Most hyped trainers">
      <div className="carousel__track" ref={track} onScroll={() => { const element = track.current; const width = element.getBoundingClientRect().width; const next = Math.round(element.scrollLeft / width); if (Math.abs(element.scrollLeft - next * width) < 2) { currentPage.current = next; setPage(next); } }}>
        {pages.map((items, index) => <div className="carousel__page" key={index} aria-hidden={page !== index} inert={page !== index ? true : undefined}>{items.map((product) => <ProductCard key={product.id} product={product} onSelect={onSelect} />)}</div>)}
      </div>
      <button className="carousel__arrow carousel__arrow--previous" aria-label="Previous products" onClick={() => goTo(Math.max(0, page - 1))} disabled={page === 0}><span /></button>
      <button className="carousel__arrow carousel__arrow--next" aria-label="Next products" onClick={() => goTo(Math.min(3, page + 1))} disabled={page === 3}><span /></button>
    </div>
    <div className="carousel__dots" aria-label="Product slides">{pages.map((_, index) => <button key={index} className={page === index ? 'active' : ''} aria-label={`Go to product slide ${index + 1}`} aria-current={page === index ? 'true' : undefined} onClick={() => goTo(index)} />)}</div>
  </section>;
}
