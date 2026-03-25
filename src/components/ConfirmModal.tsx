import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface-container-lowest rounded-3xl p-6 w-full max-w-md shadow-xl border border-outline-variant/30 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-full bg-error-container text-error flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <h3 className="text-xl font-bold text-on-surface mb-2">{title}</h3>
        <p className="text-on-surface-variant mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-medium transition-colors">
            Cancel
          </button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-5 py-2.5 rounded-full bg-error text-on-error font-medium hover:bg-error/90 transition-colors shadow-sm shadow-error/20">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
