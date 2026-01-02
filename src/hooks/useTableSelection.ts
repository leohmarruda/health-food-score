import { useState, useCallback } from 'react';

export function useTableSelection<T>(
  items: T[],
  getId: (item: T) => string
) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        setSelectedIds(new Set(items.map(item => getId(item))));
      } else {
        setSelectedIds(new Set());
      }
    },
    [items, getId]
  );

  const handleSelectItem = useCallback((id: string, checked: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  }, []);

  const isAllSelected = selectedIds.size > 0 && selectedIds.size === items.length;
  const hasSelection = selectedIds.size > 0;

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  return {
    selectedIds,
    handleSelectAll,
    handleSelectItem,
    isAllSelected,
    hasSelection,
    clearSelection,
  };
}

