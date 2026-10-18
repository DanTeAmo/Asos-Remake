export const departments = [
  { id: 'women', label: 'Women' },
  { id: 'men', label: 'Men' },
];

// Category destinations follow the gender-specific links in ASOS navigation.
const destinations = {
  women: [
    ['New in', '/women/new-in/cat/?cid=27108'],
    ['Clothing', '/women/new-in/new-in-clothing/cat/?cid=2623'],
    ['Shoes', '/women/shoes/cat/?cid=4172'],
    ['Accessories', '/women/accessories/cat/?cid=4174'],
    ['Brands', '/women/a-to-z-of-brands/cat/?cid=1340'],
    ['Sale', '/women/sale/cat/?cid=7046'],
  ],
  men: [
    ['New in', '/men/new-in/cat/?cid=27110'],
    ['Clothing', '/men/new-in/new-in-clothing/cat/?cid=6993'],
    ['Shoes', '/men/shoes-boots-trainers/cat/?cid=4209'],
    ['Accessories', '/men/accessories/cat/?cid=4210'],
    ['Brands', '/men/a-to-z-of-brands/cat/?cid=1361'],
    ['Sale', '/men/sale/cat/?cid=8409'],
  ],
};

export function departmentNavigation(department) {
  return (destinations[department] || destinations.women).map(([label, path]) => ({ label, href: 'https://www.asos.com' + path }));
}
