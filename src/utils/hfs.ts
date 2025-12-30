import { FoodFormData } from '@/types/food';

export function checkHFSInput(formData: FoodFormData): boolean {
    if (!formData.name?.trim() || !(formData.brand ?? '').trim()) 
        return false;
    return true;
}

interface HFSResponse {
    success: boolean;
    hfs_score: number;
    confidence: number;
    reasoning?: string;
    error?: string;
  }

export async function calculateHFS(formData: FoodFormData): Promise<HFSResponse> {
  // Bypass API call - return default score
  // TODO: Re-enable API call when ready
  return { 
    success: true,
    hfs_score: -1,
    confidence: 1 
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