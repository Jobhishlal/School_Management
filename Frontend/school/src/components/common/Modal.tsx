import { X } from "lucide-react";
import type { ModalProps } from "../../types/Modal";
import { useTheme } from "../../components/layout/ThemeContext";
export function Modal({ title, isOpen, onClose, children }: ModalProps) {
  const { isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-4xl max-h-[90vh] rounded-lg shadow-xl border overflow-hidden
          ${isDark ? "bg-slate-900 border-slate-700" : "bg-white border-gray-200"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`flex items-center justify-between p-6 border-b ${isDark ? "border-slate-700" : "border-gray-200"}`}>
          <h3 className={`text-xl font-bold ${isDark ? "text-slate-100" : "text-gray-900"}`}>{title}</h3>
          <button
            onClick={onClose}
            className={`p-2 rounded-full transition-colors ${isDark ? "text-slate-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"}`}
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)] no-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}