const assets = import.meta.glob(['../../assets/icons/*.svg', '../../assets/brands-logo/*.svg', '../../assets/products/*/photos/*.webp'], { eager: true, query: '?url', import: 'default' });
export const asset = (path) => assets[`../../assets/${path}`];

export const fits = [
  { name: 'Loose straight', file: 'loose-straight-jeans' },
  { name: 'Baggy fit', file: 'Baggy-fit-jeans' },
  { name: 'Straight', file: 'straight-jeans' },
  { name: 'Tapered', file: 'tapered-jeans' },
  { name: 'Slim', file: 'slim-jeans' },
  { name: 'Barrel', file: 'barrel-jeans' },
].map((fit) => ({ ...fit, image: asset(`products/jeans/photos/${fit.file}.webp`) }));

export const products = [
  { id: 'nike-dunk', title: 'Nike Dunk Low Retro trainers in off white and grey', price: '€119.99', image: asset('products/shoes/photos/nike-dunk-low.webp') },
  { id: 'fred-perry-featured', title: 'Fred Perry B721 logo leather trainers in white', price: '€123.99', image: asset('products/shoes/photos/fred-perry-b721-shadow.webp'), featured: true },
  { id: 'fred-perry', title: 'Fred Perry B721 logo leather trainers in white', price: '€123.99', image: asset('products/shoes/photos/fred-perry-b721.webp') },
  { id: 'nike-jordan', title: 'Nike Air Jordan 1 Low trainers in grey, black and white', price: '€129.99', image: asset('products/shoes/photos/nike-air-jordan-low.webp') },
];

export const brands = [
  { name: 'Pull&Bear', file: 'pull n bear.svg', url: 'https://www.asos.com/search/?q=pull%20and%20bear' },
  { name: 'Jack & Jones', file: 'jake s jones.svg', url: 'https://www.asos.com/search/?q=jack%20and%20jones' },
  { name: 'Nike', file: 'nike.svg', url: 'https://www.asos.com/search/?q=nike' },
  { name: 'Vans', file: 'vans.svg', url: 'https://www.asos.com/search/?q=vans' },
].map((brand) => ({ ...brand, image: asset(`brands-logo/${brand.file}`) }));
