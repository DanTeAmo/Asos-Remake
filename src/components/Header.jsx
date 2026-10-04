import { useState } from 'react';
import { asset } from '../data/catalog.js';

export function Icon({ name, className = '' }) {
  return <img className={`icon ${className}`} src={asset(`icons/${name}.svg`)} alt="" aria-hidden="true" />;
}

export default function Header({ onSearch, onPanel, wishlistCount, bagCount }) {
  const [gender, setGender] = useState('Women');
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigation = [ ['New in', '#hyped'], ['Clothing', '#fits'], ['Shoes', '#hyped'], ['Accessories', 'https://www.asos.com/search/?q=accessories'], ['Brands', '#brands'], ['Sale', 'https://www.asos.com/search/?q=sale'] ];
  const search = (event) => { event.preventDefault(); if (query.trim()) onSearch(query.trim()); };
  return <header className="header">
    <div className="header__main">
      <button className="menu-toggle" aria-label="Open navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
      <a href="#top" className="logo" aria-label="ASOS home">Asos</a>
      <div className="gender-tabs" aria-label="Shop department">{['Women', 'Men'].map((item) => <button key={item} onClick={() => setGender(item)} aria-pressed={gender === item} className={gender === item ? 'active' : ''}>{item}</button>)}</div>
      <form className="search" onSubmit={search} role="search">
        <input aria-label="Search for clothes" placeholder="Search for clothes" value={query} onChange={(event) => setQuery(event.target.value)} />
        <button aria-label="Search" type="submit"><Icon name="search-icon" /></button>
      </form>
      <div className="header__actions">
        <button aria-label="My account" onClick={() => onPanel('account')}><Icon name="profile-icon" /></button>
        <button aria-label={`Saved items${wishlistCount ? ` (${wishlistCount})` : ''}`} onClick={() => onPanel('wishlist')}><Icon name="liked-items" className="icon--white" />{wishlistCount > 0 && <span className="badge">{wishlistCount}</span>}</button>
        <button aria-label={`Shopping bag${bagCount ? ` (${bagCount})` : ''}`} onClick={() => onPanel('bag')}><Icon name="market-bag" className="icon--white" />{bagCount > 0 && <span className="badge">{bagCount}</span>}</button>
      </div>
    </div>
    <nav className={`navigation ${menuOpen ? 'navigation--open' : ''}`} aria-label="Main navigation">{navigation.map(([label, href]) => <a key={label} href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}</nav>
  </header>;
}
