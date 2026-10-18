import { useEffect, useState } from 'react';

export default function useStoredShopping(key, normalize) {
  const [items, setItems] = useState(() => {
    try { return normalize(JSON.parse(localStorage.getItem(key) || '[]')); }
    catch { return []; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(items)); }
    catch { /* Shopping still works when storage is unavailable. */ }
  }, [key, items]);
  return [items, setItems];
}
