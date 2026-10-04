import { useState } from 'react';
import Header from './components/Header.jsx';
import FitSection from './components/FitSection.jsx';
import ProductCarousel from './components/ProductCarousel.jsx';
import BrandSection from './components/BrandSection.jsx';
import Footer from './components/Footer.jsx';
import ShopDialog from './components/ShopDialog.jsx';

function useStoredItems(key) {
  const [items, setItems] = useState(() => { try { const value = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(value) ? value.filter((id) => typeof id === 'string') : []; } catch { return []; } });
  const update = (next) => { setItems(next); try { localStorage.setItem(key, JSON.stringify(next)); } catch { /* Shopping remains available when storage is disabled. */ } };
  return [items, update];
}
export default function App() {
  const [panel, setPanel] = useState(null);
  const [saved, setSaved] = useStoredItems('asos-saved-items');
  const [bag, setBag] = useStoredItems('asos-shopping-bag');
  const selectProduct = (product) => setPanel({ type: 'product', product });
  return <div className="site" id="top">
    <Header onSearch={(query) => setPanel({ type: 'search', query })} onPanel={(type) => setPanel({ type })} wishlistCount={saved.length} bagCount={bag.length} />
    <main><section className="hero" aria-labelledby="hero-title"><h1 id="hero-title">Choose your style</h1></section><FitSection /><ProductCarousel onSelect={selectProduct} /><BrandSection /></main>
    <Footer />
    <ShopDialog panel={panel} onClose={() => setPanel(null)} onSelect={selectProduct} saved={saved} bag={bag} onSave={(id) => setSaved(saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id])} onAdd={(id) => { if (!bag.includes(id)) setBag([...bag, id]); }} onRemove={(id) => setBag(bag.filter((item) => item !== id))} />
  </div>;
}
