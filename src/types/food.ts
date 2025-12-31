/**
 * Core Food interface matching the database schema
 */
export interface Food {
  id: string;
  name: string;
  brand?: string;
  category?: string;
  hfs: number; // Health Food Score (0-10)
  
  // Image URLs
  front_photo_url?: string;
  back_photo_url?: string;
  nutrition_label_url?: string;
  ingredients_photo_url?: string;
  
  // Nutrition values (per 100g)
  energy_kcal: number;
  protein_g: number;
  carbs_total_g?: number;
  fat_total_g?: number;
  sodium_mg?: number;
  fiber_g?: number;
  saturated_fat_g?: number;
  trans_fat_g?: number;
  
  // Portion information
  portion_size_value?: number;
  portion_unit?: string;
  density?: number;
  
  // Raw data fields
  ingredients_raw?: string;
  ingredients_list?: string[]; // Array of parsed ingredients
  nutrition_raw?: string;
  nutrition_parsed?: Record<string, any>; // JSONB parsed nutrition data
  declared_percentages?: number[]; // Array of declared percentages
  
  // Processing and special information
  declared_special_nutrients?: string;
  declared_processes?: string;
  fermentation_type?: string;
  abv_percentage?: number; // Alcohol by volume percentage
  
  // Additional metadata
  website?: string;
  price?: number;
  location?: string;
  certifications?: string;
  data_source?: string; // Default: 'label'
  
  // Timestamps
  created_at?: string;
  last_update?: string;
}

/**
 * Food form data for editing
 */
export interface FoodFormData extends Omit<Food, 'id' | 'created_at'> {
  [key: string]: any; // Allow additional fields
}

/**
 * Image tab configuration
 */
export interface ImageTab {
  id: 'front' | 'nutrition' | 'ingredients' | 'back';
  label: string;
  dbKey: keyof Food;
}






