'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';

export function Toast() {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const bgBorder =
    toastMessage.type === 'success'
      ? 'bg-emerald-950 text-white border-emerald-500/50'
      : toastMessage.type === 'warning'
      ? 'bg-amber-950 text-white border-amber-500/50'
      : 'bg-slate-900 text-white border-primary/50';

  const icon =
    toastMessage.type === 'success'
      ? 'check_circle'
      : toastMessage.type === 'warning'
      ? 'warning'
      : 'info';

  const iconColor =
    toastMessage.type === 'success'
      ? 'text-emerald-400'
      : toastMessage.type === 'warning'
      ? 'text-amber-400'
      : 'text-primary-container';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-2xl max-w-md ${bgBorder}`}
      >
        <span className={`material-symbols-outlined text-[24px] ${iconColor} mt-0.5`}>
          {icon}
        </span>
        <div className="flex-1">
          <h4 className="text-sm font-bold">{toastMessage.title}</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toastMessage.desc}</p>
        </div>
      </div>
    </div>
  );
}
