'use client';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'info';
  isLoading?: boolean;
  dict?: any;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
  variant = 'info',
  isLoading = false,
  dict
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const accentColor = variant === 'danger' ? 'bg-red-600 hover:bg-red-700' : 'bg-primary hover:opacity-90';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-2xl shadow-2xl border border-text-main/10 overflow-hidden transform animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-text-main mb-2">{title}</h3>
          <p className="text-text-main/70">{message}</p>
        </div>
        
        <div className="flex justify-end gap-3 p-4 bg-text-main/5">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-theme font-medium text-text-main/70 hover:bg-text-main/10 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading} // Impede cliques duplos
            className={`px-6 py-2 rounded-theme font-bold text-white shadow-lg transition flex items-center gap-2 ${accentColor} ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>{dict?.common?.processing || 'Processing...'}</span>
              </>
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </div>
  );
}