import { useRef, useState } from 'react';
import Header from './components/Header.jsx';
import FitSection from './components/FitSection.jsx';
import ProductCarousel from './components/ProductCarousel.jsx';
import BrandSection from './components/BrandSection.jsx';
import Footer from './components/Footer.jsx';
import ShopDialog from './components/ShopDialog.jsx';
import useStoredShopping from './hooks/useStoredShopping.js';
import { products, fits } from './data/catalog.js';
import { addToBag, MAX_QUANTITY, normalizeBag, normalizeSaved } from './data/shopping.js';

const validIds = products.map((product) => product.id);
const readSaved = (value) => normalizeSaved(value, validIds);
const readBag = (value) => normalizeBag(value, validIds);

export default function App() {
  const [panel, setPanel] = useState(null);
  const [saved, setSaved] = useStoredShopping('asos-saved-items', readSaved);
  const [bag, setBag] = useStoredShopping('asos-shopping-bag', readBag);
  const [announcement, setAnnouncement] = useState({ text: '', sequence: 0 });
  const opener = useRef(null);
  const announce = (text) => setAnnouncement((previous) => ({ text, sequence: previous.sequence + 1 }));
  const openPanel = (next) => {
    opener.current = document.activeElement;
    announce('');
    setPanel(next);
  };
  const selectProduct = (product, context = panel) => {
    if (!panel) openPanel({ type: 'product', product });
    else { announce(''); setPanel({ type: 'product', product, previous: context, returnProductId: product.id }); }
  };
  const closePanel = () => {
    setPanel(null);
    requestAnimationFrame(() => {
      const target = opener.current;
      if (target?.isConnected && target.getClientRects().length && !target.closest('[inert]')) target.focus({ preventScroll: true });
      else document.getElementById('hyped-title')?.focus({ preventScroll: true });
    });
  };
  const itemCount = bag.reduce((count, item) => count + item.quantity, 0);
  return <div className="site" id="top">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <Header onSearch={(query) => openPanel({ type: 'search', query })} onPanel={(type) => openPanel({ type })} wishlistCount={saved.length} bagCount={itemCount} />
    <main id="main-content" tabIndex={-1}>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow">The denim issue / No. 01</p>
          <h1 id="hero-title">A fit.<br />A feeling.<br /><em>All you.</em></h1>
          <div className="hero__intro"><p>Considered shapes. Everyday expression.<br />Find the denim that feels like you.</p><a className="editorial-button" href="#fits">Explore the fits <span aria-hidden="true">↗</span></a></div>
          <a className="hero__secondary" href="#hyped">Discover the trainer edit <span aria-hidden="true">↓</span></a>
        </div>
        <div className="hero__visual" aria-hidden="true">
          <img className="hero__image hero__image--first" src={fits[1].image} alt="" width="960" height="1225" fetchPriority="high" />
          <img className="hero__image hero__image--second" src={fits[0].image} alt="" width="960" height="1225" />
          <span className="hero__caption">Denim, in your own way.</span>
        </div>
      </section>
      <div className="editorial-note"><span>Made for your everyday.</span><p>Six silhouettes. Endless possibilities.</p><a href="#fits">Find your fit <span aria-hidden="true">↗</span></a></div>
      <FitSection /><ProductCarousel onSelect={selectProduct} /><BrandSection />
    </main>
    <Footer />
    <ShopDialog panel={panel} onClose={closePanel} onBack={() => setPanel({ ...panel.previous, restoreProductId: panel.returnProductId })} onSelect={selectProduct} saved={saved} bag={bag} announcement={announcement}
      onSave={(id) => {
        const wasSaved = saved.includes(id);
        setSaved((items) => items.includes(id) ? items.filter((item) => item !== id) : [...items, id]);
        announce(wasSaved ? 'Item removed from saved items.' : 'Item saved.');
      }}
      onAdd={(id, amount = 1) => {
        if (!Number.isInteger(amount) || amount < 1) return;
        const quantity = bag.find((item) => item.productId === id)?.quantity || 0;
        const added = Math.min(amount, MAX_QUANTITY - quantity);
        setBag((items) => addToBag(items, id, amount));
        announce(added === 0 ? 'You can add up to 10 of this item.' : `${added} ${added === 1 ? 'item' : 'items'} added to your bag. ${quantity + added} of this style in your bag.`);
      }}
      onQuantity={(id, quantity) => {
        setBag((items) => items.map((item) => item.productId === id ? { ...item, quantity } : item));
        announce('Quantity updated to ' + quantity + '.');
      }}
      onRemove={(id) => {
        setBag((items) => items.filter((item) => item.productId !== id));
        announce('Item removed from your bag.');
      }} />
  </div>;
}
