import { FoodFormData } from '@/types/food';

interface CheckHFSInputResponse {
  success: boolean;
  warnings?: string[];
}

export function checkHFSInput(formData: FoodFormData, version: string = 'v2', dict?: any): CheckHFSInputResponse {
  const t = dict?.hfs || {};
  let success = true;
  let warnings: string[] = [];
  
  // Check if ingredients_list exists and has items
  const hasIngredients = Array.isArray(formData.ingredients_list) && formData.ingredients_list.length > 0;
  const hasIngredientsRaw = formData.ingredients_raw && formData.ingredients_raw.trim().length > 0;
  
  if (!hasIngredients && !hasIngredientsRaw) {
    success = false;
    warnings.push(t.noIngredients || "No ingredients provided.");
  }
  
  if (!formData.energy_kcal) {
    success = false;
    warnings.push(t.noCalories || "Calories data not provided.");
  }
  if (!formData.NOVA) 
  {
    success = false;
    warnings.push(t.noNOVA || "NOVA data not provided.");
  }
  return { 
    success: success,
    warnings: warnings
  };
}

interface HFSResponse {
    success: boolean;
    hfs_score: number;
    hfs_version: string;
    confidence: number;
    reasoning?: string;
    error?: string;
    scores?: {
      S1?: number; // Açúcares
      S2?: number; // Fibras
      S3?: number; // Perfil de gorduras
      S4?: number; // Densidade calórica
      S5?: number; // Proteína
      S6?: number; // Sódio
      S7?: number; // Grau de processamento
      S8?: number; // Aditivos
    };
  }

export async function calculateHFS(formData: FoodFormData, version: string = 'v2', dict?: any): Promise<HFSResponse> {
  // Bypass API call - return default score
  // TODO: Re-enable API call when ready
  // Version parameter will be used when API is re-enabled
  const t = dict?.hfs || {};
  
  // Calculate conversion factor: 100g / serving_size_value (when unit is 'g')
  const servingSizeValue = formData.serving_size_value || 100;
  const servingSizeUnit = formData.serving_size_unit || 'g';
  const conversionFactor = (servingSizeUnit.toLowerCase() === 'g' && servingSizeValue > 0) 
    ? 100 / servingSizeValue 
    : 1;
  
  // Calculate mock scores for now (will be replaced by API response)
  // Extract nutrition data from nutrition_parsed if available
  const nutritionParsed = formData.nutrition_parsed || {};
  const carbs = nutritionParsed.carbohydrates || {};
  const fats = nutritionParsed.fats || {};
  const minerals = nutritionParsed.minerals_mg || {};
  
  // Values per 100g (multiply by conversionFactor)
  // Use nutrition_parsed values if available, otherwise use formData values
  const sugarsPer100g = (carbs.sugars_total_g || formData.carbs_total_g || 0) * conversionFactor;
  const fiberPer100g = (formData.fiber_g || 0) * conversionFactor;
  const fatsPer100g = (fats.total_fats_g || formData.fat_total_g || 0) * conversionFactor;
  const energyPer100g = (formData.energy_kcal || 0) * conversionFactor;
  const proteinPer100g = (formData.protein_g || 0) * conversionFactor;
  const sodiumPer100g = (minerals.sodium_mg || formData.sodium_mg || 0) * conversionFactor;
  
  // Mock scores calculation (placeholder until API is ready)
  // Return raw values per 100g without any transformation
  const scores = {
    S1: sugarsPer100g > 0 ? sugarsPer100g : undefined, // Açúcares
    S2: fiberPer100g > 0 ? fiberPer100g : undefined, // Fibras
    S3: fatsPer100g > 0 ? fatsPer100g : undefined, // Perfil de gorduras
    S4: energyPer100g > 0 ? energyPer100g : undefined, // Densidade calórica
    S5: proteinPer100g > 0 ? proteinPer100g : undefined, // Proteína
    S6: sodiumPer100g > 0 ? sodiumPer100g : undefined, // Sódio
    S7: undefined, // Grau de processamento (not calculated from NOVA)
    S8: Array.isArray(formData.ingredients_list) && formData.ingredients_list.length > 0 
      ? formData.ingredients_list.length 
      : undefined, // Número de ingredientes na lista
  };
  
  return { 
    success: true,
    hfs_score: -1,
    hfs_version: version,
    confidence: 1,
    // Don't set error field - it was causing the ingredient list to show in toast
    scores
  };

  // Original API call code (commented out):
  /*
  try {
    // Call API route that processes AI (e.g., OpenAI or Gemini)
    const response = await fetch('/api/hfs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ingredients: formData.ingredients_list,
        nutrients: {
          energy: formData.energy_kcal,
          protein: formData.protein_g,
          carbs: formData.carbs_total_g,
          fat: formData.fat_total_g,
          sodium: formData.sodium_mg,
          fiber: formData.fiber_g,
        }
      }),
    });

    if (!response.ok) throw new Error("AI response error");

    const { temp_hfs_score } = await response.json();

    // Return updated data with new HFS score
    return { 
        success: true,
        hfs_score: temp_hfs_score,
        confidence: 1 
    };
  } catch (error) {
    console.error("Failed to calculate HFS via AI, setting to -1:", error);
    // On AI error, return -1 as fallback
    return { 
        success: false,
        hfs_score: -1,
        confidence: 1 
    };
  }
  */
}