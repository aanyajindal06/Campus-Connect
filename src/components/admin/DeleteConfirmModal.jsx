import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, eventTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-slate-900">Delete Event?</h3>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          Are you sure you want to permanently remove <strong className="text-slate-800">"{eventTitle}"</strong>?
          All student registrations and bookmarks for this event will also be deleted.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors w-1/2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 transition-all w-1/2"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
