import test from 'node:test';
import assert from 'node:assert/strict';
import { addToBag, bagSubtotal, formatPrice, MAX_QUANTITY, normalizeBag, normalizeSaved, searchProducts } from '../src/data/shopping.js';
import { carouselWindow, indicatorWindow, shortestLoopDistance, wrapIndex } from '../src/data/carousel.js';
import { departmentNavigation } from '../src/data/navigation.js';

const products = [
  { id: 'nike-dunk', title: 'Nike Dunk Low trainers in off white and grey', brand: 'Nike', priceInCents: 11999 },
  { id: 'fred-perry', title: 'Fred Perry B721 leather trainers in white', brand: 'Fred Perry', priceInCents: 12399 },
  { id: 'nike-jordan', title: 'Nike Air Jordan trainers in black and white', brand: 'Nike', priceInCents: 12999 },
];
const ids = products.map((product) => product.id);

test('old saved Fred Perry cards merge without losing favourites', () => {
  assert.deepEqual(normalizeSaved(['fred-perry-featured', 'fred-perry', 'nike-dunk', 'unknown', null], ids), ['fred-perry', 'nike-dunk']);
});

test('legacy bags migrate to quantities without doubling the duplicate product', () => {
  assert.deepEqual(normalizeBag(['fred-perry-featured', 'fred-perry', 'nike-dunk'], ids), [{ productId: 'fred-perry', quantity: 1 }, { productId: 'nike-dunk', quantity: 1 }]);
});

test('untrusted stored shapes and invalid quantities cannot enter the bag', () => {
  assert.deepEqual(normalizeBag({}, ids), []);
  assert.deepEqual(normalizeSaved(null, ids), []);
  assert.deepEqual(normalizeBag([null, { productId: 'unknown', quantity: 1 }, { productId: 'nike-dunk', quantity: -1 }, { productId: 'nike-jordan', quantity: 1.5 }, { productId: 'fred-perry', quantity: 999 }], ids), [{ productId: 'fred-perry', quantity: MAX_QUANTITY }]);
});

test('adding again increments one line and respects the maximum', () => {
  const one = addToBag([], 'nike-dunk');
  assert.deepEqual(addToBag(one, 'nike-dunk'), [{ productId: 'nike-dunk', quantity: 2 }]);
  assert.deepEqual(one, [{ productId: 'nike-dunk', quantity: 1 }]);
  assert.equal(addToBag([{ productId: 'nike-dunk', quantity: MAX_QUANTITY }], 'nike-dunk')[0].quantity, MAX_QUANTITY);
});

test('totals use integer cents and quantities', () => {
  const total = bagSubtotal([{ productId: 'nike-dunk', quantity: 2 }, { productId: 'fred-perry', quantity: 1 }], products);
  assert.equal(total, 36397);
  assert.equal(formatPrice(total), '€363.97');
  assert.equal(bagSubtotal([], products), 0);
});

test('a chosen purchase quantity adds in one action and respects remaining capacity', () => {
  assert.deepEqual(addToBag([], 'nike-dunk', 3), [{ productId: 'nike-dunk', quantity: 3 }]);
  const existing = [{ productId: 'nike-dunk', quantity: 8 }];
  assert.deepEqual(addToBag(existing, 'nike-dunk', 5), [{ productId: 'nike-dunk', quantity: MAX_QUANTITY }]);
  for (const invalid of [0, -1, 1.5, NaN, '3']) assert.deepEqual(addToBag(existing, 'nike-dunk', invalid), existing);
});

test('search matches all words irrespective of case, whitespace or order', () => {
  assert.deepEqual(searchProducts(products, '  WHITE   nIkE ').map((product) => product.id), ['nike-dunk', 'nike-jordan']);
  assert.equal(searchProducts(products, 'jeans').length, 0);
  assert.equal(searchProducts(products, 'sneakers').length, 3);
});

test('both carousel directions wrap one position with matching visible neighbours', () => {
  assert.equal(wrapIndex(-1, 5), 4);
  assert.equal(wrapIndex(5, 5), 0);
  assert.equal(wrapIndex(16, 5), 1);
  for (const visible of [1, 2, 3]) {
    for (let first = 0; first < 5; first += 1) {
      const window = carouselWindow(first, visible, 5);
      assert.equal(new Set(window).size, window.length);
      assert.deepEqual(window.slice(1, visible + 1), Array.from({ length: visible }, (_, offset) => (first + offset) % 5));
      assert.deepEqual(carouselWindow(wrapIndex(first + 1, 5), visible, 5).slice(1, visible + 1), Array.from({ length: visible }, (_, offset) => (first + 1 + offset) % 5));
    }
  }
});

test('three indicator circles stay centred on the current style through either wrap', () => {
  for (let first = 0; first < 5; first += 1) {
    const circles = indicatorWindow(first, 5).slice(1, 4);
    assert.deepEqual(circles, [wrapIndex(first - 1, 5), first, wrapIndex(first + 1, 5)]);
    assert.equal(new Set(circles).size, 3);
    assert.equal(indicatorWindow(wrapIndex(first + 1, 5), 5)[2], wrapIndex(first + 1, 5));
  }
});

test('dots take the shortest circular path', () => {
  assert.equal(shortestLoopDistance(0, 4, 5), -1);
  assert.equal(shortestLoopDistance(4, 0, 5), 1);
  assert.equal(shortestLoopDistance(0, 2, 5), 2);
});

test('every category stays in the selected department', () => {
  for (const department of ['women', 'men']) {
    const links = departmentNavigation(department);
    assert.equal(links.length, 6);
    assert.deepEqual(links.map((link) => link.label), ['New in', 'Clothing', 'Shoes', 'Accessories', 'Brands', 'Sale']);
    assert.ok(links.every((link) => new URL(link.href).pathname.startsWith('/' + department + '/')));
    assert.ok(links.every((link) => new URL(link.href).hostname === 'www.asos.com'));
  }
  assert.deepEqual(departmentNavigation('unknown'), departmentNavigation('women'));
});
