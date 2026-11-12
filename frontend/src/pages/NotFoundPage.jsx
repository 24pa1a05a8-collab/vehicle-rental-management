import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ArrowLeft, Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-sm">
          <Car className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <span className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight font-mono">
            404
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Page Not Found</h1>
          <p className="text-xs text-slate-500">
            The road you are looking for doesn't exist or has been relocated.
          </p>
        </div>

        <div className="flex justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/vehicles"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all"
          >
            <span>Browse Cars</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
