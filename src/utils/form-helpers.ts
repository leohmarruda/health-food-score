import type { Food, FoodFormData } from '@/types/food';

/**
 * Cleans and normalizes food data from database
 */
export function cleanFoodData(data: any): FoodFormData {
  // Fields that should remain as null/undefined when null (numeric optional fields)
  const optionalNumericFields = ['price', 'abv_percentage', 'density'];
  
  return Object.keys(data).reduce((acc: any, key) => {
    if (key === 'ingredients_list') {
      acc[key] = data[key] || [];
    } else if (optionalNumericFields.includes(key)) {
      // Keep null/undefined for optional numeric fields
      acc[key] = data[key] ?? undefined;
    } else if (key === 'hfs_version') {
      // Default to 'v2' if hfs_version is null/undefined
      acc[key] = data[key] || 'v2';
    } else {
      acc[key] = data[key] === null ? "" : data[key];
    }
    return acc;
  }, {}) as FoodFormData;
}

/**
 * Extracts image URLs from food data
 */
export function extractImageUrls(data: Food): Record<string, string> {
  return {
    front: data.front_photo_url || '',
    nutrition: data.nutrition_label_url || '',
    ingredients: data.ingredients_photo_url || '',
    back: data.back_photo_url || ''
  };
}

/**
 * Validates required form fields
 */
export function validateFormData(data: FoodFormData): { valid: boolean; error?: string } {
  if (!data.name || !data.name.trim()) {
    return { valid: false, error: 'Name is required.' };
  }
  return { valid: true };
}

/**
 * Sanitizes numeric fields in form data
 * Returns all fields from data, with numeric fields sanitized
 */
export function sanitizeNumericFields(
  data: FoodFormData,
  fields: (keyof FoodFormData)[]
): Record<string, any> {
  // Start with all fields from data
  const sanitized = { ...data } as Record<string, any>;
  
  // Only sanitize the specified numeric fields
  fields.forEach(field => {
    const value = sanitized[field];
    sanitized[field] = (value === "" || value === null || value === undefined) ? 0 : Number(value);
  });
  
  return sanitized;
}

/**
 * Checks if form data has been modified
 */
export function isFormDirty(
  current: FoodFormData,
  original: FoodFormData,
  ignoredFields: string[] = ['last_update', 'created_at', 'id']
): boolean {
  return Object.keys(current).some(key => {
    if (ignoredFields.includes(key)) return false;
    
    const currentValue = JSON.stringify(current[key as keyof FoodFormData]);
    const originalValue = JSON.stringify(original[key as keyof FoodFormData]);
    
    return currentValue !== originalValue;
  });
}

/**
 * Formats HFS score for display
 */
export function formatHFSScore(hfs: number | null | undefined, isDirty: boolean): string {
  if (isDirty) return '—';
  if (hfs === null || hfs === undefined || hfs < 0) return '—';
  const numValue = typeof hfs === 'number' ? hfs : Number(hfs);
  if (isNaN(numValue) || numValue < 0) return '—';
  return numValue.toFixed(1);
}

