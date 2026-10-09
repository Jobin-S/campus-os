'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export function NotificationsDrawer() {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setNotificationsOpen,
  } = useApp();

  return (
    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 p-4 z-50 animate-in fade-in zoom-in-95">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
          <h3 className="font-headline-md text-sm font-bold text-on-surface">Campus Reminders</h3>
        </div>
        <button
          type="button"
          onClick={markAllNotificationsRead}
          className="text-xs text-primary font-semibold hover:underline"
        >
          Mark all read
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/20 py-2">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-3xl mb-1 text-outline">done_all</span>
            <p>You&apos;re all caught up!</p>
          </div>
        ) : (
          notifications.map((item) => {
            const urgencyBg =
              item.urgency === 'urgent'
                ? 'bg-red-50 text-red-700 border-l-4 border-error'
                : item.urgency === 'warning'
                ? 'bg-amber-50 text-amber-800 border-l-4 border-amber-500'
                : 'bg-surface-container-low text-on-surface border-l-4 border-primary';

            return (
              <div
                key={item.id}
                onClick={() => markNotificationRead(item.id)}
                className={`p-3 transition-colors hover:bg-surface-container-low cursor-pointer ${
                  !item.read ? 'bg-surface-container-lowest font-medium' : 'opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                          item.urgency === 'urgent'
                            ? 'bg-error/10 text-error'
                            : item.urgency === 'warning'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {item.type}
                      </span>
                      <span className="text-[11px] text-on-surface-variant">{item.timestamp}</span>
                      {!item.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block"></span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-on-surface">{item.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                    {item.link && (
                      <Link
                        href={item.link}
                        onClick={() => setNotificationsOpen(false)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary mt-1 hover:underline"
                      >
                        <span>View details</span>
                        <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="pt-2 border-t border-outline-variant/30 text-center">
        <Link
          href="/assignments"
          onClick={() => setNotificationsOpen(false)}
          className="text-xs text-on-surface-variant hover:text-primary font-medium"
        >
          Manage notification cadence & quiet hours
        </Link>
      </div>
    </div>
  );
}
