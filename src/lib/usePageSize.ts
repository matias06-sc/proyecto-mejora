import { useEffect, useState } from 'react';

const ROWS_PER_PAGE = 4;

function currentColumns(desktopColumns: number): number {
  if (window.matchMedia('(max-width: 640px)').matches) return 1;
  if (window.matchMedia('(max-width: 900px)').matches) return 2;
  return desktopColumns;
}

export function usePageSize(desktopColumns: number): number {
  const [columns, setColumns] = useState(() => currentColumns(desktopColumns));

  useEffect(() => {
    const mobile = window.matchMedia('(max-width: 640px)');
    const tablet = window.matchMedia('(max-width: 900px)');
    const update = () => setColumns(currentColumns(desktopColumns));

    mobile.addEventListener('change', update);
    tablet.addEventListener('change', update);
    update();

    return () => {
      mobile.removeEventListener('change', update);
      tablet.removeEventListener('change', update);
    };
  }, [desktopColumns]);

  return columns * ROWS_PER_PAGE;
}
