import { useEffect, useRef, useState } from 'react';
import { products } from '../data/catalog.js';
import { bagSubtotal, formatPrice, MAX_QUANTITY, searchProducts } from '../data/shopping.js';
import ProductCard from './ProductCard.jsx';

const listNames = { search: 'results', wishlist: 'saved items', bag: 'shopping bag' };

export default function ShopDialog({ panel, onClose, onBack, onSelect, saved, bag, onSave, onAdd, onQuantity, onRemove, announcement }) {
  const dialog = useRef(null);
  const heading = useRef(null);
  const [query, setQuery] = useState('');
  const [quantityToAdd, setQuantityToAdd] = useState(1);
  useEffect(() => {
    const element = dialog.current;
    if (!panel) { if (element.open) element.close(); return; }
    if (!element.open) element.showModal();
    const restored = panel.restoreProductId
      ? [...element.querySelectorAll('[data-product-id]')].find((card) => card.dataset.productId === panel.restoreProductId)?.querySelector('button')
      : null;
    (restored || heading.current)?.focus({ preventScroll: true });
    element.scrollTop = panel.scrollTop || 0;
    if (panel.type === 'search') setQuery(panel.query);
    if (panel.type === 'product') setQuantityToAdd(1);
  }, [panel]);

  const product = panel?.product;
  const inBag = product ? bag.find((item) => item.productId === product.id)?.quantity || 0 : 0;
  const remaining = MAX_QUANTITY - inBag;
  const selectedQuantity = Math.min(quantityToAdd, remaining);
  const items = products.filter((item) => saved.includes(item.id));
  const selectProduct = (item) => onSelect(item, { ...panel, query: panel.type === 'search' ? query : panel.query, scrollTop: dialog.current.scrollTop });
  const bagCount = bag.reduce((count, item) => count + item.quantity, 0);
  const titles = { account: 'My account', wishlist: 'Saved items', bag: 'Shopping bag', search: 'Search results', product: product?.title };
  const removeAndFocus = (id, event, remove) => {
    const row = event.currentTarget.closest('[data-product-id]');
    const next = row?.nextElementSibling?.querySelector('button') || row?.previousElementSibling?.querySelector('button');
    remove(id);
    requestAnimationFrame(() => (next?.isConnected ? next : heading.current)?.focus({ preventScroll: true }));
  };
  const browseTrainers = () => { onClose(); requestAnimationFrame(() => document.getElementById('hyped-title')?.focus()); };
  const handleKeyDown = (event) => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.current.querySelectorAll('button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), [tabindex="0"]')].filter((element) => element.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !controls.includes(active))) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && (active === last || !controls.includes(active))) { event.preventDefault(); first?.focus(); }
  };
  return <dialog className="shop-dialog" ref={dialog} onKeyDown={handleKeyDown} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => {
    if (event.target === dialog.current) {
      const rect = dialog.current.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    }
  }} aria-labelledby="dialog-title">
    {panel && <div className="shop-dialog__toolbar"><button className="shop-dialog__close" aria-label="Close dialog" onClick={onClose}>×</button></div>}
    {panel && <div className="shop-dialog__body">
      {panel.previous && <button className="dialog-back" onClick={onBack}>← Back to {listNames[panel.previous.type] || 'collection'}</button>}
      <h2 id="dialog-title" ref={heading} tabIndex={-1}>{titles[panel.type]}</h2>
      {panel.type === 'account' ? <div className="account-links">
        <p className="dialog-intro">Continue to ASOS to sign in or create an account.</p>
        <a href="https://www.asos.com/identity/login">Sign in on ASOS <span aria-hidden="true">↗</span></a>
        <a href="https://www.asos.com/identity/register">Join ASOS <span aria-hidden="true">↗</span></a>
      </div> : product ? <div className="product-detail">
        <img src={product.image} alt={product.title} width="360" height="459" />
        <div className="product-detail__info">
          <span className="product-detail__brand">{product.brand}</span>
          <p className="product-detail__price">{formatPrice(product.priceInCents)}</p>
          <p className="product-detail__note">{product.description || 'Part of the trainer edit. Save your favourites or build your bag.'}</p>
          {remaining > 0 && <div className="product-detail__purchase">
            <div><span className="quantity-label" id="add-quantity-label">Quantity</span><div className="quantity-stepper" role="group" aria-labelledby="add-quantity-label">
              <button type="button" aria-label="Decrease quantity to add" aria-controls="add-quantity" disabled={selectedQuantity <= 1} onClick={() => setQuantityToAdd(selectedQuantity - 1)}>−</button>
              <output id="add-quantity" aria-live="polite">{selectedQuantity}</output>
              <button type="button" aria-label="Increase quantity to add" aria-controls="add-quantity" disabled={selectedQuantity >= remaining} onClick={() => setQuantityToAdd(selectedQuantity + 1)}>+</button>
            </div></div>
            <p className="product-detail__total"><span>Total</span><strong>{formatPrice(product.priceInCents * selectedQuantity)}</strong></p>
          </div>}
          <button className="solid-button" onClick={() => onAdd(product.id, selectedQuantity)} disabled={remaining === 0}>{remaining === 0 ? 'Bag limit reached' : selectedQuantity === 1 ? 'Add to bag' : `Add ${selectedQuantity} to bag`}</button>
          {remaining === 0 && <p className="product-detail__limit">You can add up to {MAX_QUANTITY} of each style.</p>}
          <button className="outline-button" aria-pressed={saved.includes(product.id)} onClick={() => onSave(product.id)}>{saved.includes(product.id) ? 'Remove from saved items' : 'Save item'}</button>
          {bag.some((item) => item.productId === product.id) && <p className="product-detail__bag-count">{bag.find((item) => item.productId === product.id).quantity} in your bag</p>}
        </div>
      </div> : panel.type === 'bag' ? bag.length ? <>
        <p className="dialog-intro">{bagCount} {bagCount === 1 ? 'item' : 'items'} in your bag</p>
        <ul className="bag-list">{bag.map((entry) => {
          const item = products.find((candidate) => candidate.id === entry.productId);
          return <li className="bag-item" data-product-id={item.id} key={item.id}>
            <button className="bag-item__photo" onClick={() => selectProduct(item)} aria-label={`View ${item.title}`}><img src={item.image} alt="" width="100" height="128" loading="lazy" /></button>
            <div className="bag-item__content">
              <h3><button className="text-button" onClick={() => selectProduct(item)}>{item.title}</button></h3>
              <p className="bag-item__unit-price">{formatPrice(item.priceInCents)} each</p>
              <div className="bag-item__actions">
                <label htmlFor={`quantity-${item.id}`}>Quantity<select id={`quantity-${item.id}`} aria-label={`Quantity for ${item.title}`} value={entry.quantity} onChange={(event) => onQuantity(item.id, Number(event.target.value))}>{Array.from({ length: MAX_QUANTITY }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label>
                <button className="text-button bag-item__remove" aria-label={`Remove ${item.title} from bag`} onClick={(event) => removeAndFocus(item.id, event, onRemove)}>Remove</button>
              </div>
            </div>
            <p className="bag-item__total">{formatPrice(item.priceInCents * entry.quantity)}</p>
          </li>;
        })}</ul>
        <div className="bag-summary"><p><span>Subtotal</span><strong>{formatPrice(bagSubtotal(bag, products))}</strong></p><span>Delivery and checkout are not available in this preview.</span></div>
        <button className="outline-button" onClick={browseTrainers}>Continue exploring</button>
      </> : <div className="empty-state"><p>Your shopping bag is empty.</p><span>Start with a pair from the trainer edit.</span><button className="solid-button" onClick={browseTrainers}>Explore trainers</button></div> : <>
        {panel.type === 'search' && <form className="dialog-search" role="search" aria-label="Refine trainer search" onSubmit={(event) => { event.preventDefault(); if (query.trim()) { dialog.current.scrollTop = 0; setQuery(query.trim()); } }}>
          <label htmlFor="dialog-search">Search the trainer edit</label>
          <div><input id="dialog-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Nike or white" maxLength={120} /><button className="solid-button" type="button" onClick={() => { setQuery(''); document.getElementById('dialog-search')?.focus(); }}>Clear</button></div>
        </form>}
        {panel.type === 'search' ? <SearchResults query={query} onSelect={selectProduct} /> : items.length ? <div className="dialog-products">{items.map((item) => <div data-product-id={item.id} key={item.id}><ProductCard product={item} onSelect={selectProduct} /><button className="text-button saved-remove" onClick={(event) => removeAndFocus(item.id, event, onSave)} aria-label={`Remove ${item.title} from saved items`}>Remove from saved</button></div>)}</div> : <div className="empty-state"><p>You haven’t saved any items yet.</p><span>Open a trainer to save it for later.</span><button className="solid-button" onClick={browseTrainers}>Explore trainers</button></div>}
      </>}
      <div className="dialog-feedback" role="status" aria-live="polite" aria-atomic="true"><span key={announcement.sequence}>{announcement.text}</span></div>
    </div>}
  </dialog>;
}

function SearchResults({ query, onSelect }) {
  const matches = query.trim() ? searchProducts(products, query) : products;
  return <>
    <p className="search-summary" role="status">{matches.length} {matches.length === 1 ? 'style' : 'styles'}{query.trim() ? ` for “${query.trim()}”` : ' in the trainer edit'}</p>
    {matches.length ? <div className="dialog-products">{matches.map((item) => <ProductCard key={item.id} product={item} onSelect={onSelect} />)}</div> : <div className="empty-state"><p>No matching trainers.</p><span>This search covers our {products.length} trainer styles. Try “Nike”, “Studio Edit” or a colour.</span><a className="outline-button" href={`https://www.asos.com/search/?q=${encodeURIComponent(query.trim())}`}>Search all of ASOS <span aria-hidden="true">↗</span></a></div>}
  </>;
}
