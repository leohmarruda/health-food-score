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
  locked?: boolean;
  onToggleLock?: () => void;
  dict?: any;
}

export default function FormField({
  label,
  name,
  value,
  onChange,
  type = 'text',
  step = '0.1',
  className = '',
  required = false,
  locked = false,
  onToggleLock,
  dict
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // For number inputs, prevent negative values
    if (type === 'number') {
      // Allow empty string, single minus (being typed), or non-negative numbers
      if (inputValue === '' || inputValue === '-') {
        onChange(inputValue);
      } else {
        const numValue = parseFloat(inputValue);
        // Only update if the value is valid and non-negative
        if (!isNaN(numValue) && numValue >= 0) {
          onChange(inputValue);
        }
        // If negative, ignore the change
      }
    } else {
      onChange(inputValue);
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold text-text-main/70 mb-1 flex items-center gap-1.5">
        <span>{label.replace(/\*$/, '')}</span>
        {required && <span className="text-red-600 font-black text-sm ml-0.5">*</span>}
        {onToggleLock && (
          <button
            type="button"
            onClick={onToggleLock}
            className="ml-auto flex-shrink-0"
            title={locked 
              ? (dict?.edit?.unlockFieldTooltip || 'Unlock field (allow auto-update)')
              : (dict?.edit?.lockFieldTooltip || 'Lock field (prevent auto-update)')}
          >
            <svg
              className={`w-3.5 h-3.5 transition-colors ${
                locked ? 'text-primary' : 'text-text-main/30 hover:text-text-main/50'
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {locked ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              )}
            </svg>
          </button>
        )}
      </label>
      <input
        type={type}
        step={type === 'number' ? step : undefined}
        min={type === 'number' ? '0' : undefined}
        value={value ?? ''}
        onChange={handleChange}
        required={required}
        className={`w-full bg-background border border-text-main/20 text-text-main p-2 rounded-theme ${className}`}
      />
    </div>
  );
}

