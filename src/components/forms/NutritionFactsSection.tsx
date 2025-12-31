import FormField from './FormField';
import type { FoodFormData } from '@/types/food';
import { formatHFSScore } from '@/utils/form-helpers';

interface NutritionFactsSectionProps {
  formData: FoodFormData;
  dict: any;
  isDirty: boolean;
  onChange: (field: keyof FoodFormData, value: string) => void;
  isLocked?: (field: string) => boolean;
  onToggleLock?: (field: string) => void;
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
  onChange,
  isLocked,
  onToggleLock
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
            locked={isLocked?.(field)}
            onToggleLock={onToggleLock ? () => onToggleLock(field) : undefined}
            dict={dict}
          />
        ))}
        {/* ABV - Alcohol by Volume */}
        <FormField
          label={dict.edit.labelABV || 'ABV (%) - Alcohol by Volume'}
          name="abv_percentage"
          value={formData.abv_percentage ?? ''}
          onChange={(value) => onChange('abv_percentage', value)}
          type="number"
          step="0.1"
          locked={isLocked?.('abv_percentage')}
          onToggleLock={onToggleLock ? () => onToggleLock('abv_percentage') : undefined}
          dict={dict}
        />
        {/* HFS Score - Read-only, calculated field */}
        <div>
          <label className="block text-xs font-bold text-text-main/70 mb-1">
            <span>HFS Score</span>
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
        {/* HFS Version */}
        <div>
          <label className="block text-xs font-bold text-text-main/70 mb-1">
            {dict?.edit?.labelHfsVersion || 'HFS Version'}
          </label>
          <select
            value={formData.hfs_version || 'v2'}
            onChange={(e) => onChange('hfs_version', e.target.value)}
            className="w-full bg-background border border-text-main/20 text-text-main p-2 rounded-theme focus:outline-none focus:border-primary h-[42px]"
          >
            <option value="v1">v1</option>
            <option value="v2">v2</option>
          </select>
        </div>
      </div>
    </section>
  );
}

