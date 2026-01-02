import { useState, useCallback } from 'react';

/**
 * Custom hook for managing locked/unlocked form fields.
 * Allows users to lock fields to prevent accidental edits.
 * 
 * @returns Locked fields set, toggle function, and check function
 */
export function useLockedFields() {
  const [lockedFields, setLockedFields] = useState<Set<string>>(new Set());

  const toggleLock = useCallback((field: string) => {
    setLockedFields(prev => {
      const newSet = new Set(prev);
      if (newSet.has(field)) {
        newSet.delete(field);
      } else {
        newSet.add(field);
      }
      return newSet;
    });
  }, []);

  const isLocked = useCallback((field: string) => {
    return lockedFields.has(field);
  }, [lockedFields]);

  return { lockedFields, toggleLock, isLocked };
}



