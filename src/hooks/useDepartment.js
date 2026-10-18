import { useEffect, useState } from 'react';

const storageKey = 'asos-department';

function readDepartment() {
  try { return localStorage.getItem(storageKey) === 'men' ? 'men' : 'women'; }
  catch { return 'women'; }
}

export default function useDepartment() {
  const [department, setDepartment] = useState(readDepartment);

  useEffect(() => {
    const sync = (event) => {
      if (event.type === 'pageshow' || event.key === storageKey || event.key === null) {
        setDepartment(readDepartment());
      }
    };
    window.addEventListener('storage', sync);
    window.addEventListener('pageshow', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('pageshow', sync);
    };
  }, []);

  const selectDepartment = (value) => {
    if (value !== 'women' && value !== 'men') return;
    setDepartment(value);
    try { localStorage.setItem(storageKey, value); }
    catch { /* The selector still works when browser storage is unavailable. */ }
  };

  return [department, selectDepartment];
}
