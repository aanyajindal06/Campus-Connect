import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">404</h1>
      <p className="text-sm font-semibold text-slate-700 mt-1">Page Not Found</p>
      <p className="text-xs text-slate-500 mt-2">
        The page you are looking for doesn't exist or has moved.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>
    </div>
  );
};
