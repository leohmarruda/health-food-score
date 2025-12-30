import FormField from './FormField';
import type { FoodFormData } from '@/types/food';

interface BasicInfoSectionProps {
  formData: FoodFormData;
  dict: any;
  onChange: (field: keyof FoodFormData, value: string) => void;
}

export default function BasicInfoSection({
  formData,
  dict,
  onChange
}: BasicInfoSectionProps) {
  return (
    <section>
      <h3 className="text-lg font-bold mb-4 text-primary">1. {dict.edit.sectionBasic}</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={dict.edit.labelName}
          name="name"
          value={formData.name}
          onChange={(value) => onChange('name', value)}
          required={true}
        />
        <FormField
          label={dict.edit.labelBrand}
          name="brand"
          value={formData.brand}
          onChange={(value) => onChange('brand', value)}
        />
      </div>
    </section>
  );
}

