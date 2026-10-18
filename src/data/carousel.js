export function wrapIndex(index, length) {
  return ((index % length) + length) % length;
}

export function carouselWindow(first, visibleCount, length) {
  // One extra card at each edge lets both directions animate before rebasing.
  return Array.from({ length: visibleCount + 2 }, (_, offset) => wrapIndex(first + offset - 1, length));
}

export function shortestLoopDistance(from, to, length) {
  const forward = wrapIndex(to - from, length);
  return forward > length / 2 ? forward - length : forward;
}

export function indicatorWindow(first, length) {
  return Array.from({ length: 5 }, (_, slot) => wrapIndex(first + slot - 2, length));
}
