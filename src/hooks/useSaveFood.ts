import { useState } from 'react';
import { toast } from 'sonner';

import { validateFormData, sanitizeNumericFields } from '@/utils/form-helpers';
import { checkHFSInput, calculateHFS } from '@/utils/hfs';
import type { FoodFormData } from '@/types/food';

// Constants
const NUMERIC_FIELDS: (keyof FoodFormData)[] = [
  'energy_kcal',
  'protein_g',
  'carbs_total_g',
  'fat_total_g',
  'sodium_mg',
  'fiber_g',
  'saturated_fat_g',
  'trans_fat_g',
  'serving_size_value',
  'price',
  'abv_percentage',
  'density'
];

export function useSaveFood(foodId: string, dict: any, onSuccess?: () => void) {
  // State
  const [isSaving, setIsSaving] = useState(false);

  // Functions
  const saveFood = async (formData: FoodFormData) => {
    const validation = validateFormData(formData);
    if (!validation.valid) {
      toast.error(dict?.pages?.edit?.requiredFieldsError || 'Name and Brand are required.');
      return;
    }

    const saveAction = async () => {
      setIsSaving(true);

      // Clean ingredients list
      const cleanIngredientsList = Array.isArray(formData.ingredients_list)
        ? formData.ingredients_list.map(i => i.trim()).filter(Boolean)
        : [];

      // Calculate HFS score
      const hfsVersion = formData.hfs_version || 'v2';
      let score = -1.0;
      let hfsScores: any = null;
      
      // Check HFS input and display warnings
      const checkResult = checkHFSInput(formData, hfsVersion, dict);

      if (checkResult.warnings && checkResult.warnings.length > 0) {
        checkResult.warnings.forEach(warning => {
          toast.warning(warning);
        });
      }

      // Proceed with calculation only if check passed
      if (checkResult.success) {
        try {
          const hfs_response = await calculateHFS(formData, hfsVersion, dict);
          if (!hfs_response.success || hfs_response.error) {
            const errorMessage = hfs_response.error || 
              dict?.hfs?.calculationError ||
              dict?.pages?.edit?.hfsCalculationError ||
              "Error calculating Nutritional Score. Please check the entered values.";
            toast.error(errorMessage);
            throw new Error(errorMessage);
          }
          score = hfs_response.hfs_score;
          hfsScores = hfs_response.scores || null;
        } catch (calcError: any) {
          const errorMessage = calcError?.message || 
            dict?.hfs?.calculationError ||
            dict?.pages?.edit?.hfsCalculationError ||
            "Error calculating Nutritional Score. Please check the entered values.";
          toast.error(errorMessage);
          throw new Error(errorMessage);
        }
      }

      // Sanitize numeric fields
      const sanitizedPayload = sanitizeNumericFields(formData, NUMERIC_FIELDS);
      
      // Preserve null/undefined for optional fields (density, price, abv_percentage)
      // But preserve actual numeric values if they exist
      if (formData.density === null || formData.density === undefined) {
        sanitizedPayload.density = formData.density;
      } else if (formData.density !== 0) {
        sanitizedPayload.density = Number(formData.density);
      }
      if (formData.price === null || formData.price === undefined) {
        sanitizedPayload.price = formData.price;
      }
      if (formData.abv_percentage === null || formData.abv_percentage === undefined) {
        sanitizedPayload.abv_percentage = formData.abv_percentage;
      }
      
      // Build complete payload with all fields
      const payload = {
        product_name: sanitizedPayload.product_name || '',
        brand: sanitizedPayload.brand || '',
        category: sanitizedPayload.category || '',
        hfs: score,
        energy_kcal: sanitizedPayload.energy_kcal ?? 0,
        protein_g: sanitizedPayload.protein_g ?? 0,
        carbs_total_g: sanitizedPayload.carbs_total_g ?? 0,
        fat_total_g: sanitizedPayload.fat_total_g ?? 0,
        sodium_mg: sanitizedPayload.sodium_mg ?? 0,
        fiber_g: sanitizedPayload.fiber_g ?? 0,
        saturated_fat_g: sanitizedPayload.saturated_fat_g ?? 0,
        trans_fat_g: sanitizedPayload.trans_fat_g ?? 0,
        serving_size_value: sanitizedPayload.serving_size_value ?? 0,
        serving_size_unit: sanitizedPayload.serving_size_unit || '',
        ingredients_list: cleanIngredientsList,
        ingredients_raw: sanitizedPayload.ingredients_raw || '',
        nutrition_raw: sanitizedPayload.nutrition_raw || '',
        declared_special_nutrients: sanitizedPayload.declared_special_nutrients || '',
        declared_processes: sanitizedPayload.declared_processes || '',
        declared_warnings: sanitizedPayload.declared_warnings || '',
        location: sanitizedPayload.location || '',
        price: sanitizedPayload.price ?? null,
        abv_percentage: sanitizedPayload.abv_percentage ?? null,
        density: sanitizedPayload.density ?? null,
        certifications: sanitizedPayload.certifications || '',
        hfs_version: sanitizedPayload.hfs_version || 'v2',
        NOVA: sanitizedPayload.NOVA ?? null,
        nutrition_parsed: sanitizedPayload.nutrition_parsed || null,
        last_update: new Date().toISOString()
      };

      // Save to API
      const res = await fetch(`/api/foods/${foodId}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(dict?.pages?.edit?.saveError || 'Error communicating with server');
      }

      setIsSaving(false);
      if (onSuccess) onSuccess();
      
      // Get density from formData (before sanitization) to preserve the actual value
      // Check both sanitizedPayload and formData to ensure we get the value
      const densityValue = sanitizedPayload.density !== undefined && sanitizedPayload.density !== null && sanitizedPayload.density !== 0
        ? sanitizedPayload.density
        : (formData.density !== undefined && formData.density !== null && formData.density !== 0
          ? formData.density
          : undefined);
      
      return { 
        score, 
        scores: hfsScores,
        servingSize: sanitizedPayload.serving_size_value,
        servingUnit: sanitizedPayload.serving_size_unit,
        density: densityValue
      };
    };

    let resultPromise: Promise<{ score: number; scores: any; servingSize?: number; servingUnit?: string; density?: number }>;
    
    toast.promise(
      (resultPromise = saveAction()),
      {
        loading: dict?.pages?.edit?.saving || 'Calculating score and saving...',
        success: (result) => {
          const scoreMsg = result.score >= 0 ? ` (Score: ${result.score})` : '';
          return `${dict?.pages?.edit?.saveSuccess || 'Updated successfully!'}${scoreMsg}`;
        },
        error: (err) => {
          setIsSaving(false);
          return err.message;
        }
      }
    );
    
    return resultPromise;
  };

  return { saveFood, isSaving };
}

