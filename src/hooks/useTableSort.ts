import { useState, useMemo } from 'react';

export interface SortConfig<T> {
  key: keyof T;
  order: 'asc' | 'desc';
}

export function useTableSort<T>(
  data: T[],
  defaultSortKey: keyof T = 'name' as keyof T,
  defaultOrder: 'asc' | 'desc' = 'asc'
) {
  const [sortConfig, setSortConfig] = useState<SortConfig<T>>({
    key: defaultSortKey,
    order: defaultOrder,
  });

  const handleSort = (key: keyof T) => {
    setSortConfig(prev => ({
      key,
      order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc',
    }));
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.order === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.order === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [data, sortConfig]);

  return {
    sortConfig,
    handleSort,
    sortedData,
  };
}

