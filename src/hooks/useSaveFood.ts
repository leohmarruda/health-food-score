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
  'portion_size_value',
  'price',
  'abv_percentage'
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
      
      // Build complete payload with all fields
      const payload = {
        name: sanitizedPayload.name || '',
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
        portion_size_value: sanitizedPayload.portion_size_value ?? 0,
        portion_unit: sanitizedPayload.portion_unit || '',
        ingredients_list: cleanIngredientsList,
        ingredients_raw: sanitizedPayload.ingredients_raw || '',
        nutrition_raw: sanitizedPayload.nutrition_raw || '',
        declared_special_nutrients: sanitizedPayload.declared_special_nutrients || '',
        declared_processes: sanitizedPayload.declared_processes || '',
        location: sanitizedPayload.location || '',
        price: sanitizedPayload.price ?? null,
        abv_percentage: sanitizedPayload.abv_percentage ?? null,
        certifications: sanitizedPayload.certifications || '',
        hfs_version: sanitizedPayload.hfs_version || 'v2',
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
      return score;
    };

    toast.promise(saveAction(), {
      loading: dict?.pages?.edit?.saving || 'Calculating score and saving...',
      success: (score) => {
        const scoreMsg = score >= 0 ? ` (Score: ${score})` : '';
        return `${dict?.pages?.edit?.saveSuccess || 'Updated successfully!'}${scoreMsg}`;
      },
      error: (err) => {
        setIsSaving(false);
        return err.message;
      }
    });
  };

  return { saveFood, isSaving };
}

