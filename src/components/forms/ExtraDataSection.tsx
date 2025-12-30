import FormTextarea from './FormTextarea';
import FormField from './FormField';
import type { FoodFormData } from '@/types/food';

interface ExtraDataSectionProps {
  formData: FoodFormData;
  dict: any;
  onChange: (field: keyof FoodFormData, value: string | string[]) => void;
}

export default function ExtraDataSection({
  formData,
  dict,
  onChange
}: ExtraDataSectionProps) {
  const handleIngredientsListChange = (value: string) => {
    const array = value
      .split(',')
      .map(item => item.trim())
      .filter(item => item !== '');
    onChange('ingredients_list', array);
  };

  return (
    <section className="pt-4">
      <h3 className="text-lg font-bold mb-4 text-primary">
        3. {dict.edit.sectionExtra || 'Extracted Data & Processing'}
      </h3>
      <div className="space-y-4">
        <FormTextarea
          label={dict.edit.labelIngredientsRaw || 'Raw Ingredient List'}
          value={formData.ingredients_raw || ''}
          onChange={(value) => onChange('ingredients_raw', value)}
          rows={3}
          placeholder="..."
        />

        <FormTextarea
          label={dict.edit.labelIngredientsList || 'Processed Ingredient List'}
          value={Array.isArray(formData.ingredients_list) ? formData.ingredients_list.join(', ') : ''}
          onChange={handleIngredientsListChange}
          rows={4}
          placeholder={dict.edit.placeholderIngredientList || "Ingredient 1, Ingredient 2, Ingredient 3..."}
          helperText={dict.edit.warningIngredientsCommas || 'Separate ingredients with commas'}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormTextarea
            label={dict.edit.labelNutritionRaw || 'Raw Nutritional Information'}
            value={formData.nutrition_raw || ''}
            onChange={(value) => onChange('nutrition_raw', value)}
            rows={3}
          />

          <FormTextarea
            label={dict.edit.labelSpecialNutrients || 'Declared Special Nutrients'}
            value={formData.declared_special_nutrients || ''}
            onChange={(value) => onChange('declared_special_nutrients', value)}
            rows={3}
            placeholder={dict.edit.placeholderSpecialNutrients || "E.g. Vitamins, minerals..."}
          />
        </div>

        <FormField
          label={dict.edit.labelProcesses || 'Declared Processes (e.g., Pasteurized, Smoked)'}
          name="declared_processes"
          value={formData.declared_processes || ''}
          onChange={(value) => onChange('declared_processes', value)}
          type="text"
        />
      </div>
    </section>
  );
}

