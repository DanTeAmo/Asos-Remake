import { useEffect, useRef } from 'react';
import { products } from '../data/catalog.js';
import ProductCard from './ProductCard.jsx';

export default function ShopDialog({ panel, onClose, onSelect, saved, bag, onSave, onAdd, onRemove }) {
  const dialog = useRef(null);
  useEffect(() => { if (panel) dialog.current.showModal(); }, [panel]);
  if (!panel) return null;
  const product = panel.product;
  const items = panel.type === 'wishlist' ? products.filter((item) => saved.includes(item.id)) : panel.type === 'bag' ? products.filter((item) => bag.includes(item.id)) : products.filter((item) => item.title.toLowerCase().includes((panel.query || '').toLowerCase()));
  const titles = { account: 'My account', wishlist: 'Saved items', bag: 'Shopping bag', search: `Search results for “${panel.query}”`, product: product?.title };
  return <dialog className="shop-dialog" ref={dialog} onCancel={onClose} onClick={(event) => { if (event.target === dialog.current) onClose(); }} aria-labelledby="dialog-title">
    <div className="shop-dialog__body"><button className="shop-dialog__close" aria-label="Close dialog" onClick={onClose}>×</button><h2 id="dialog-title">{titles[panel.type]}</h2>
      {panel.type === 'account' ? <div className="account-links"><a href="https://www.asos.com/identity/login">Sign in</a><a href="https://www.asos.com/identity/register">Join ASOS</a></div> : product ? <div className="product-detail"><img src={product.image} alt={product.title} /><div><p>{product.price}</p><button className="solid-button" onClick={() => onAdd(product.id)}>{bag.includes(product.id) ? 'Added to bag' : 'Add to bag'}</button><button className="outline-button" aria-pressed={saved.includes(product.id)} onClick={() => onSave(product.id)}>{saved.includes(product.id) ? 'Remove from saved items' : 'Save item'}</button></div></div> : items.length ? <div className="dialog-products">{items.map((item) => <div key={item.id}><ProductCard product={item} onSelect={onSelect} />{panel.type === 'bag' && <button className="outline-button" onClick={() => onRemove(item.id)}>Remove from bag</button>}</div>)}</div> : <p>{panel.type === 'wishlist' ? 'You haven’t saved any items yet.' : panel.type === 'bag' ? 'Your shopping bag is empty.' : 'No matching trainers found.'}</p>}
    </div>
  </dialog>;
}
