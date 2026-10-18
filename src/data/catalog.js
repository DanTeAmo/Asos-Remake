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
  { id: 'nike-dunk', title: 'Nike Dunk Low Retro trainers in off white and grey', priceInCents: 11999, brand: 'Nike', image: asset('products/shoes/photos/nike-dunk-low.webp') },
  { id: 'fred-perry', title: 'Fred Perry B721 logo leather trainers in white', priceInCents: 12399, brand: 'Fred Perry', image: asset('products/shoes/photos/fred-perry-b721.webp') },
  { id: 'nike-jordan', title: 'Nike Air Jordan 1 Low trainers in grey, black and white', priceInCents: 12999, brand: 'Nike', image: asset('products/shoes/photos/nike-air-jordan-low.webp') },
  { id: 'studio-sage-runner', title: 'Studio Edit retro running trainers in silver and sage', priceInCents: 8999, brand: 'Studio Edit', generated: true, description: 'A retro running silhouette with silver mesh, sage detailing and an ivory sole.', image: asset('products/shoes/photos/studio-sage-runner.webp') },
  { id: 'studio-navy-court', title: 'Studio Edit suede court trainers in navy and ivory', priceInCents: 7999, brand: 'Studio Edit', generated: true, description: 'A low-profile court silhouette in navy and ivory, finished with a honey-gum sole.', image: asset('products/shoes/photos/studio-navy-court.webp') },
];

export const brands = [
  { name: 'Pull&Bear', file: 'pull n bear.svg', url: 'https://www.asos.com/search/?q=pull%20and%20bear' },
  { name: 'Jack & Jones', file: 'jake s jones.svg', url: 'https://www.asos.com/search/?q=jack%20and%20jones' },
  { name: 'Nike', file: 'nike.svg', url: 'https://www.asos.com/search/?q=nike' },
  { name: 'Vans', file: 'vans.svg', url: 'https://www.asos.com/search/?q=vans' },
].map((brand) => ({ ...brand, image: asset(`brands-logo/${brand.file}`) }));
