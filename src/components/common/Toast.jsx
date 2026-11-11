import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useEvents } from '../../context/EventContext';

export const Toast = () => {
  const { toast, clearToast } = useEvents();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      clearToast();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, clearToast]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/30 bg-slate-900 text-slate-100',
    error: 'border-rose-500/30 bg-slate-900 text-slate-100',
    info: 'border-sky-500/30 bg-slate-900 text-slate-100'
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div
        className={`flex items-center gap-3 p-4 rounded-xl border shadow-2xl ${
          borders[toast.type] || borders.info
        }`}
      >
        {icons[toast.type] || icons.info}
        <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
        <button
          onClick={clearToast}
          className="text-slate-400 hover:text-white transition-colors p-1"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
