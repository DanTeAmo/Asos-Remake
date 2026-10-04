const columns = [
  { title: 'Help & Information', links: [['Help', 'https://www.asos.com/customer-care/'], ['Track order', 'https://www.asos.com/customer-care/orders/'], ['Delivery & returns', 'https://www.asos.com/customer-care/delivery/'], ['Sitemap', 'https://www.asos.com/sitemap/']] },
  { title: 'About ASOS', links: [['About us', 'https://www.asosplc.com/'], ['Careers at ASOS', 'https://www.asoscareers.com/'], ['Corporate responsibility', 'https://www.asosplc.com/this-is-asos/our-responsibilities/'], ["Investors’ site", 'https://www.asosplc.com/investor-relations/']] },
  { title: 'More From ASOS', links: [['Mobile and ASOS apps', 'https://www.asos.com/discover/our-apps/'], ['Gift vouchers', 'https://www.asos.com/gift-vouchers/'], ['Black Friday', 'https://www.asos.com/black-friday/']] },
];
export default function Footer() {
  return <footer className="footer">
    <div className="footer__columns">{columns.map((column) => <section key={column.title}><h2>{column.title}</h2><ul>{column.links.map(([label, href]) => <li key={label}><a href={href}>{label}</a></li>)}</ul></section>)}</div>
    <div className="footer__bottom"><span>© 2026 ASOS</span><div><a href="https://www.asos.com/about/">ASOS details</a><span> | </span><a href="https://www.asos.com/privacy-policy/">Privacy & Cookies</a><span> | </span><a href="https://www.asos.com/terms-and-conditions/">Ts&Cc</a><span> | </span><a href="https://www.asos.com/accessibility/">Accessibility</a></div></div>
  </footer>;
}
