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
      <h3 className="text-lg font-bold mb-4 text-primary">1. {dict?.pages?.edit?.sectionBasic || 'Basic Metadata'}</h3>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          label={dict?.pages?.edit?.labelName || 'Product Name*'}
          name="product_name"
          value={formData.product_name || ''}
          onChange={(value) => onChange('product_name', value)}
          required={true}
          locked={isLocked?.('product_name')}
          onToggleLock={onToggleLock ? () => onToggleLock('product_name') : undefined}
          dict={dict}
        />
        <FormField
          label={dict?.pages?.edit?.labelBrand || 'Brand*'}
          name="brand"
          value={formData.brand ?? ''}
          onChange={(value) => onChange('brand', value)}
          locked={isLocked?.('brand')}
          onToggleLock={onToggleLock ? () => onToggleLock('brand') : undefined}
          dict={dict}
        />
        <FormField
          label={dict?.pages?.edit?.labelLocation || 'Location'}
          name="location"
          value={formData.location || ''}
          onChange={(value) => onChange('location', value)}
          type="text"
          locked={isLocked?.('location')}
          onToggleLock={onToggleLock ? () => onToggleLock('location') : undefined}
          dict={dict}
        />
        <FormField
          label={dict?.pages?.edit?.labelPrice || 'Price'}
          name="price"
          value={formData.price || ''}
          onChange={(value) => onChange('price', value)}
          type="number"
          step="0.01"
          locked={isLocked?.('price')}
          onToggleLock={onToggleLock ? () => onToggleLock('price') : undefined}
          dict={dict}
        />
        <div>
          <label className="block text-xs font-bold text-text-main/70 mb-1">
            {dict?.pages?.edit?.labelCategory || 'Category'}
          </label>
          <select
            value={formData.category || ''}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full bg-background border border-text-main/20 text-text-main p-2 rounded-theme focus:outline-none focus:border-primary h-[42px]"
          >
            <option value="">{dict?.pages?.edit?.labelCategorySelect || 'Select category...'}</option>
            {dict?.categories && Object.entries(dict.categories).map(([key, value]) => (
              <option key={key} value={key}>{value as string}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}

