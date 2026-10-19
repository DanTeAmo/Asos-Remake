import { useRef, useState } from 'react';
import { departments, departmentNavigation } from '../data/navigation.js';
import useDepartment from '../hooks/useDepartment.js';
import Wordmark from './Wordmark.jsx';

export function Icon({ name, className = '' }) {
  const paths = {
    'search-icon': <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></>,
    'profile-icon': <><circle cx="12" cy="8" r="3.5" /><path d="M4 21v-2a8 8 0 0 1 16 0v2" /></>,
    'liked-items': <path d="M20.5 5.5a5 5 0 0 0-7 0L12 7l-1.5-1.5a5 5 0 0 0-7 7L12 21l8.5-8.5a5 5 0 0 0 0-7Z" />,
    'market-bag': <><path d="M3 7h18v14H3z" /><path d="M8 8V6a4 4 0 0 1 8 0v2" /></>,
  };
  return <svg className={`icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" width="24" height="24">{paths[name]}</svg>;
}

function DepartmentButtons({ className, department, onSelect }) {
  return <div className={className} role="group" aria-label="Shop department">{departments.map(({ id, label }) => <button key={id} type="button" className={department === id ? 'active' : ''} aria-pressed={department === id} aria-controls="main-navigation" onClick={() => onSelect(id)}>{label}</button>)}</div>;
}

export default function Header({ onSearch, onPanel, wishlistCount, bagCount }) {
  const [department, setDepartment] = useDepartment();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const menuButton = useRef(null);
  const navigation = departmentNavigation(department);
  const departmentLabel = department === 'women' ? "Women's" : "Men's";
  const search = (event) => { event.preventDefault(); if (query.trim()) { setMenuOpen(false); onSearch(query.trim()); } };
  const closeMenu = () => { setMenuOpen(false); menuButton.current?.focus(); };
  return <header className="header" onKeyDown={(event) => { if (event.key === 'Escape' && menuOpen) closeMenu(); }}>
    <div className="header__main">
      <button ref={menuButton} className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}><span /><span /><span /></button>
      <a href="#top" className="logo" aria-label="ASOS home" onClick={() => setMenuOpen(false)}><Wordmark /></a>
      <DepartmentButtons className="gender-tabs" department={department} onSelect={setDepartment} />
      <form className="search" onSubmit={search} role="search">
        <input type="search" aria-label="Search trainers" aria-describedby="search-help" placeholder="Search trainers" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={120} />
        <span className="sr-only" id="search-help">Search our trainer edit by brand, name or colour.</span>
        <button aria-label="Search" type="submit"><Icon name="search-icon" /></button>
      </form>
      <div className="header__actions">
        <button aria-label="My account" onClick={() => onPanel('account')}><Icon name="profile-icon" /></button>
        <button aria-label={`Saved items${wishlistCount ? ` (${wishlistCount})` : ''}`} onClick={() => onPanel('wishlist')}><Icon name="liked-items" className="icon--white" />{wishlistCount > 0 && <span className="badge" aria-hidden="true">{wishlistCount}</span>}</button>
        <button aria-label={`Shopping bag${bagCount ? ` (${bagCount})` : ''}`} onClick={() => onPanel('bag')}><Icon name="market-bag" className="icon--bag" />{bagCount > 0 && <span className="badge" aria-hidden="true">{bagCount}</span>}</button>
      </div>
    </div>
    <nav id="main-navigation" data-department={department} className={`navigation ${menuOpen ? 'navigation--open' : ''}`} aria-label={`${departmentLabel} categories`}>
      <DepartmentButtons className="mobile-departments" department={department} onSelect={setDepartment} />
      {navigation.map(({ label, href }) => <a key={label} href={href} aria-label={`${departmentLabel} ${label} on ASOS`} onClick={() => setMenuOpen(false)}>{label}</a>)}
    </nav>
    <span className="sr-only" role="status">{departmentLabel} categories selected.</span>
  </header>;
}
