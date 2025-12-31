interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  helperText?: string;
  className?: string;
}

export default function FormTextarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  helperText,
  className = ''
}: FormTextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-main mb-1">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-background border border-text-main/20 text-text-main p-3 rounded-theme text-sm ${className}`}
      />
      {helperText && (
        <p className="text-[10px] text-text-main/50 mt-1 uppercase">{helperText}</p>
      )}
    </div>
  );
}


