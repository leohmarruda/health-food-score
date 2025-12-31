import FormField from './FormField';
import type { FoodFormData } from '@/types/food';

interface BasicInfoSectionProps {
  formData: FoodFormData;
  dict: any;
  onChange: (field: keyof FoodFormData, value: string) => void;
  isLocked?: (field: string) => boolean;
  onToggleLock?: (field: string) => void;
}

export default function BasicInfoSection({
  formData,
  dict,
  onChange,
  isLocked,
  onToggleLock
}: BasicInfoSectionProps) {
  return (
    <section>
      <h3 className="text-lg font-bold mb-4 text-primary">1. {dict.edit.sectionBasic}</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={dict.edit.labelName}
          name="name"
          value={formData.name || ''}
          onChange={(value) => onChange('name', value)}
          required={true}
          locked={isLocked?.('name')}
          onToggleLock={onToggleLock ? () => onToggleLock('name') : undefined}
          dict={dict}
        />
        <FormField
          label={dict.edit.labelBrand}
          name="brand"
          value={formData.brand || ''}
          onChange={(value) => onChange('brand', value)}
          locked={isLocked?.('brand')}
          onToggleLock={onToggleLock ? () => onToggleLock('brand') : undefined}
          dict={dict}
        />
        <FormField
          label={dict.edit.labelLocation || 'Location'}
          name="location"
          value={formData.location || ''}
          onChange={(value) => onChange('location', value)}
          type="text"
          locked={isLocked?.('location')}
          onToggleLock={onToggleLock ? () => onToggleLock('location') : undefined}
          dict={dict}
        />
        <FormField
          label={dict.edit.labelPrice || 'Price'}
          name="price"
          value={formData.price || ''}
          onChange={(value) => onChange('price', value)}
          type="number"
          step="0.01"
          locked={isLocked?.('price')}
          onToggleLock={onToggleLock ? () => onToggleLock('price') : undefined}
          dict={dict}
        />
      </div>
    </section>
  );
}

