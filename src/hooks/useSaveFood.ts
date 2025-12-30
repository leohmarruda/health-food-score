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
  'portion_size_value'
];

export function useSaveFood(foodId: string, dict: any, onSuccess?: () => void) {
  // State
  const [isSaving, setIsSaving] = useState(false);

  // Functions
  const saveFood = async (formData: FoodFormData) => {
    const validation = validateFormData(formData);
    if (!validation.valid) {
      toast.error(dict?.edit?.requiredFieldsError || 'Name and Brand are required.');
      return;
    }

    const saveAction = async () => {
      setIsSaving(true);

      // Clean ingredients list
      const cleanIngredientsList = Array.isArray(formData.ingredients_list)
        ? formData.ingredients_list.map(i => i.trim()).filter(Boolean)
        : [];

      // Calculate HFS score
      let score = -1.0;
      if (checkHFSInput(formData)) {
        try {
          const hfs_response = await calculateHFS(formData);
          score = hfs_response.hfs_score;
        } catch (calcError) {
          throw new Error(
            dict?.edit?.hfsCalculationError ||
            "Error calculating Nutritional Score. Please check the entered values."
          );
        }
      }

      // Sanitize payload
      const sanitizedPayload = sanitizeNumericFields(formData, NUMERIC_FIELDS);
      const payload = {
        ...sanitizedPayload,
        hfs: score,
        ingredients_list: cleanIngredientsList,
        last_update: new Date().toISOString()
      };

      // Save to API
      const res = await fetch(`/api/foods/${foodId}/update`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(dict?.edit?.saveError || 'Error communicating with server');
      }

      setIsSaving(false);
      if (onSuccess) onSuccess();
      return score;
    };

    toast.promise(saveAction(), {
      loading: dict?.edit?.saving || 'Calculating score and saving...',
      success: (score) => {
        const scoreMsg = score >= 0 ? ` (Score: ${score})` : '';
        return `${dict?.edit?.saveSuccess || 'Updated successfully!'}${scoreMsg}`;
      },
      error: (err) => {
        setIsSaving(false);
        return err.message;
      }
    });
  };

  return { saveFood, isSaving };
}

