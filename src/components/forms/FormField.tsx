import type { FoodFormData } from '@/types/food';

interface FormFieldProps {
  label: string;
  name: keyof FoodFormData;
  value: string | number | undefined;
  onChange: (value: string) => void;
  type?: 'text' | 'number';
  step?: string;
  className?: string;
  required?: boolean;
}

export default function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  step = '0.1',
  className = '',
  required = false
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-text-main/70 mb-1">
        {label.replace(/\*$/, '')}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        step={type === 'number' ? step : undefined}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className={`w-full bg-background border border-text-main/20 text-text-main p-2 rounded-theme ${className}`}
      />
    </div>
  );
}

