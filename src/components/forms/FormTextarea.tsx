interface FormTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
  placeholder?: string;
  helperText?: string;
  className?: string;
  locked?: boolean;
  onToggleLock?: () => void;
  dict?: any;
}

export default function FormTextarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  helperText,
  className = '',
  locked = false,
  onToggleLock,
  dict
}: FormTextareaProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-text-main mb-1 flex items-center gap-1.5">
        <span>{label}</span>
        {onToggleLock && (
          <button
            type="button"
            onClick={onToggleLock}
            className="ml-auto flex-shrink-0"
            title={locked 
              ? (dict?.components?.forms?.formTextarea?.unlockFieldTooltip || 'Unlock field (allow auto-update)')
              : (dict?.components?.forms?.formTextarea?.lockFieldTooltip || 'Lock field (prevent auto-update)')}
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


