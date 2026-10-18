import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { products } from '../data/catalog.js';
import { carouselWindow, indicatorWindow, shortestLoopDistance, wrapIndex } from '../data/carousel.js';
import ProductCard from './ProductCard.jsx';

const TRANSITION_MS = 360;

export default function ProductCarousel({ onSelect }) {
  const viewport = useRef(null);
  const carousel = useRef(null);
  const [arrowPosition, setArrowPosition] = useState(null);
  const [first, setFirst] = useState(0);
  const [visibleCount, setVisibleCount] = useState(() => matchMedia('(max-width:480px)').matches ? 1 : matchMedia('(max-width:1023px)').matches ? 2 : 3);
  const [direction, setDirection] = useState(0);
  const [animating, setAnimating] = useState(false);
  const current = useRef(0);
  const pendingDirection = useRef(0);
  const busy = useRef(false);
  const queue = useRef([]);
  const timer = useRef(null);
  const frame = useRef(null);
  const gesture = useRef(null);
  const suppressClick = useRef(false);
  const wheelTime = useRef(0);
  const startRef = useRef(null);

  const finish = () => {
    if (!busy.current || pendingDirection.current === 0) return;
    clearTimeout(timer.current);
    const next = wrapIndex(current.current + pendingDirection.current, products.length);
    current.current = next;
    pendingDirection.current = 0;
    if (viewport.current?.contains(document.activeElement) && document.activeElement !== viewport.current) viewport.current.focus({ preventScroll: true });
    setFirst(next);
    setDirection(0);
    setAnimating(false);
    // Let the equivalent edge card rebase without a transition before the next step.
    frame.current = requestAnimationFrame(() => {
      frame.current = requestAnimationFrame(() => {
        busy.current = false;
        if (queue.current.length) startRef.current(queue.current.shift());
      });
    });
  };

  const start = (step) => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      current.current = wrapIndex(current.current + step, products.length);
      setFirst(current.current);
      busy.current = false;
      if (queue.current.length) frame.current = requestAnimationFrame(() => startRef.current(queue.current.shift()));
      return;
    }
    busy.current = true;
    pendingDirection.current = step;
    setAnimating(true);
    setDirection(step);
    timer.current = setTimeout(finish, TRANSITION_MS + 100);
  };
  startRef.current = start;

  const move = (step) => {
    if (busy.current) queue.current.push(step);
    else start(step);
  };
  const goTo = (target) => {
    const projected = wrapIndex(current.current + pendingDirection.current + queue.current.reduce((sum, step) => sum + step, 0), products.length);
    const distance = shortestLoopDistance(projected, target, products.length);
    for (let step = 0; step < Math.abs(distance); step += 1) move(Math.sign(distance));
  };

  useEffect(() => {
    const media = matchMedia('(max-width:1023px)');
    const narrow = matchMedia('(max-width:480px)');
    const update = () => setVisibleCount(narrow.matches ? 1 : media.matches ? 2 : 3);
    media.addEventListener('change', update);
    narrow.addEventListener('change', update);
    const element = viewport.current;
    const wheel = (event) => {
      if (Math.abs(event.deltaX) <= Math.abs(event.deltaY) || Math.abs(event.deltaX) < 8) return;
      event.preventDefault();
      if (Date.now() - wheelTime.current > TRANSITION_MS) {
        wheelTime.current = Date.now();
        if (busy.current) queue.current.push(Math.sign(event.deltaX));
        else startRef.current(Math.sign(event.deltaX));
      }
    };
    element.addEventListener('wheel', wheel, { passive: false });
    return () => {
      media.removeEventListener('change', update);
      narrow.removeEventListener('change', update);
      element.removeEventListener('wheel', wheel);
      clearTimeout(timer.current);
      cancelAnimationFrame(frame.current);
    };
  }, []);

  useLayoutEffect(() => {
    const measure = () => {
      const content = viewport.current.getBoundingClientRect();
      const outer = carousel.current.getBoundingClientRect();
      const width = document.documentElement.clientWidth;
      const photo = viewport.current.querySelector('.product-card__photo');
      const next = {
        left: content.left / 2 - outer.left,
        right: (content.right + width) / 2 - outer.left,
        top: photo.getBoundingClientRect().height / 2,
      };
      setArrowPosition((previous) => previous && Object.keys(next).every((key) => Math.abs(previous[key] - next[key]) < .5) ? previous : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewport.current);
    window.addEventListener('resize', measure);
    return () => { observer.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  const windowIndices = carouselWindow(first, visibleCount, products.length);
  return <section className="hyped-section" id="hyped" aria-labelledby="hyped-title">
    <div className="section-heading"><h2 id="hyped-title" tabIndex={-1}>Your most hyped</h2><p>The trainer edit · {products.length} styles</p></div>
    <div className="carousel" ref={carousel} role="region" aria-roledescription="carousel" aria-label="Most hyped trainers" style={{ '--columns': visibleCount, ...(arrowPosition ? { '--arrow-left': `${arrowPosition.left}px`, '--arrow-right': `${arrowPosition.right}px`, '--arrow-top': `${arrowPosition.top}px` } : {}) }}>
      <div className="carousel__viewport" ref={viewport} id="trainer-track" tabIndex={0} aria-label="Trainer carousel. Use left and right arrow keys to move one style."
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); }
          else if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); goTo(event.key === 'Home' ? 0 : products.length - 1); }
        }}
        onDragStart={(event) => event.preventDefault()}
        onPointerDown={(event) => { if (event.button === 0) { gesture.current = { x: event.clientX, y: event.clientY }; suppressClick.current = false; } }}
        onPointerMove={(event) => {
          if (!gesture.current) return;
          const dx = event.clientX - gesture.current.x;
          const dy = event.clientY - gesture.current.y;
          if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.3) { event.currentTarget.setPointerCapture(event.pointerId); suppressClick.current = true; }
        }}
        onPointerCancel={() => { gesture.current = null; }}
        onPointerUp={(event) => {
          if (!gesture.current) return;
          const dx = event.clientX - gesture.current.x;
          const dy = event.clientY - gesture.current.y;
          gesture.current = null;
          if (Math.abs(dx) >= 40 && Math.abs(dx) > Math.abs(dy) * 1.3) { suppressClick.current = true; move(dx < 0 ? 1 : -1); }
        }}
        onClickCapture={(event) => { if (suppressClick.current || busy.current) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}>
        <div className={`carousel__track${animating ? ' carousel__track--animating' : ''}`} style={{ '--offset': 1 + direction }} onTransitionEnd={(event) => { if (event.target === event.currentTarget && event.propertyName === 'transform') finish(); }}>
          {windowIndices.map((index, slot) => {
            const visible = slot > 0 && slot <= visibleCount;
            return <div className="carousel__slide" key={products[index].id} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${products.length}`} aria-hidden={!visible} inert={!visible ? true : undefined}><ProductCard product={products[index]} onSelect={onSelect} /></div>;
          })}
        </div>
      </div>
      <button className="carousel__arrow carousel__arrow--previous" aria-label="Previous product" aria-controls="trainer-track" onClick={() => move(-1)}><span /></button>
      <button className="carousel__arrow carousel__arrow--next" aria-label="Next product" aria-controls="trainer-track" onClick={() => move(1)}><span /></button>
    </div>
    <div className="carousel__controls">
      <div className="carousel__dots" aria-label="Previous, current and next style">
        <div className={`carousel__dots-track${animating ? ' carousel__dots-track--animating' : ''}`} style={{ '--offset': 1 + direction }}>
          {indicatorWindow(first, products.length).map((index, slot) => {
            const visible = slot > 0 && slot < 4;
            const active = index === wrapIndex(first + direction, products.length);
            return <button key={products[index].id} className={active ? 'active' : ''} aria-hidden={!visible} inert={!visible ? true : undefined} aria-label={`Start with ${products[index].title}`} aria-current={active ? 'true' : undefined} onClick={() => { if (!busy.current) goTo(index); }}><span /></button>;
          })}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">Showing {products[first].title}</p>
    </div>
  </section>;
}
