import FormField from './FormField';
import type { FoodFormData } from '@/types/food';
import { formatHFSScore } from '@/utils/form-helpers';

interface NutritionFactsSectionProps {
  formData: FoodFormData;
  dict: any;
  isDirty: boolean;
  onChange: (field: keyof FoodFormData, value: string) => void;
}

const NUTRITION_FIELDS = [
  { labelKey: 'portion', field: 'portion_size_value', type: 'number' as const },
  { labelKey: 'unit', field: 'portion_unit', type: 'text' as const },
  { labelKey: 'calories', field: 'energy_kcal', type: 'number' as const },
  { labelKey: 'protein', field: 'protein_g', type: 'number' as const },
  { labelKey: 'carbs', field: 'carbs_total_g', type: 'number' as const },
  { labelKey: 'fat', field: 'fat_total_g', type: 'number' as const },
  { labelKey: 'sodium', field: 'sodium_mg', type: 'number' as const },
  { labelKey: 'fiber', field: 'fiber_g', type: 'number' as const },
  { labelKey: 'saturatedFat', field: 'saturated_fat_g', type: 'number' as const }
];

export default function NutritionFactsSection({
  formData,
  dict,
  isDirty,
  onChange
}: NutritionFactsSectionProps) {
  return (
    <section>
      <h3 className="text-lg font-bold mb-4 text-primary">2. {dict.nutrition.factsTitle}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {NUTRITION_FIELDS.map(({ labelKey, field, type }) => (
          <FormField
            key={field}
            label={dict.home[labelKey] || dict.nutrition[labelKey] || field}
            name={field as keyof FoodFormData}
            value={formData[field as keyof FoodFormData] as string | number}
            onChange={(value) => onChange(field as keyof FoodFormData, value)}
            type={type}
          />
        ))}
        {/* HFS Score - Read-only, calculated field */}
        <div>
          <label className="block text-xs font-bold text-text-main/70 mb-1 flex items-center gap-1.5">
            <span>HFS Score</span>
            <svg className="w-3.5 h-3.5 text-text-main/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <title>Calculated automatically</title>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </label>
          <div className="w-full bg-background/50 border-2 border-dashed border-text-main/30 text-text-main/60 p-2 rounded-theme flex items-center justify-between cursor-not-allowed select-none h-[42px]">
            <span className="font-medium text-base min-w-[2ch] text-center">
              {formatHFSScore(formData.hfs, isDirty)}
            </span>
            <span className="text-[10px] text-text-main/40 italic ml-2 whitespace-nowrap">
              {isDirty ? 'Recalc on save' : 'Auto'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

