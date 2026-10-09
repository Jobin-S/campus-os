'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export function CommandPalette() {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    assignments,
    subjects,
    events,
    lostFoundItems,
    toggleAssignmentComplete,
    toggleSaveEvent,
  } = useApp();

  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return {
        assignments: assignments.slice(0, 3),
        subjects: subjects.slice(0, 3),
        events: events.slice(0, 3),
        lostFound: lostFoundItems.slice(0, 3),
      };
    }
    const q = query.toLowerCase();
    return {
      assignments: assignments.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.courseCode.toLowerCase().includes(q) ||
          a.courseName.toLowerCase().includes(q)
      ),
      subjects: subjects.filter(
        (s) => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
      ),
      events: events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q) ||
          e.venue.toLowerCase().includes(q)
      ),
      lostFound: lostFoundItems.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.location.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q)
      ),
    };
  }, [query, assignments, subjects, events, lostFoundItems]);

  if (!isCommandPaletteOpen) return null;

  const navigateTo = (path: string) => {
    setCommandPaletteOpen(false);
    router.push(path);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in"
      onClick={() => setCommandPaletteOpen(false)}
    >
      <div
        className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-outline-variant/30">
          <span className="material-symbols-outlined text-outline text-[22px] mr-3">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search assignments, courses, events, lost items, or quick actions..."
            className="w-full bg-transparent text-on-surface font-body-md text-base outline-none placeholder:text-on-surface-variant"
          />
          <kbd
            onClick={() => setCommandPaletteOpen(false)}
            className="font-label-xs text-[11px] text-on-surface-variant bg-surface-container px-2 py-1 rounded cursor-pointer hover:bg-surface-container-high"
          >
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Quick Navigation Short-cuts */}
          {!query && (
            <div>
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'My Day', path: '/', icon: 'dashboard' },
                  { label: 'Assignments', path: '/assignments', icon: 'assignment' },
                  { label: 'Attendance', path: '/attendance', icon: 'calculate' },
                  { label: 'Events Hub', path: '/events', icon: 'event' },
                ].map((nav) => (
                  <button
                    key={nav.path}
                    onClick={() => navigateTo(nav.path)}
                    className="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-semibold transition-all"
                  >
                    <span className="material-symbols-outlined text-primary text-[18px]">
                      {nav.icon}
                    </span>
                    <span>{nav.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Group */}
          {filteredResults.assignments.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1 flex items-center justify-between">
                <span>Assignments & Tasks</span>
                <span className="text-[10px] font-normal text-primary hover:underline cursor-pointer" onClick={() => navigateTo('/assignments')}>
                  View all ({assignments.length})
                </span>
              </div>
              <div className="space-y-1">
                {filteredResults.assignments.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigateTo('/assignments')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAssignmentComplete(item.id);
                        }}
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-all ${
                          item.status === 'completed'
                            ? 'bg-tertiary border-tertiary text-white'
                            : 'border-outline hover:border-primary'
                        }`}
                      >
                        {item.status === 'completed' && (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        )}
                      </button>
                      <div>
                        <div className="text-xs font-semibold text-on-surface group-hover:text-primary transition-colors">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono bg-surface-container px-1 py-0.2 rounded">
                            {item.courseCode}
                          </span>
                          <span>• Due {item.dueDate}</span>
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              item.priority === 'high'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline group-hover:text-primary text-[18px]">
                      arrow_forward
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Subjects Group */}
          {filteredResults.subjects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1 flex items-center justify-between">
                <span>Courses & Attendance</span>
                <span className="text-[10px] font-normal text-primary hover:underline cursor-pointer" onClick={() => navigateTo('/attendance')}>
                  View all ({subjects.length})
                </span>
              </div>
              <div className="space-y-1">
                {filteredResults.subjects.map((sub) => {
                  const pct = ((sub.attendedClasses / sub.totalClasses) * 100).toFixed(1);
                  return (
                    <div
                      key={sub.id}
                      onClick={() => navigateTo('/attendance')}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[20px]">
                          menu_book
                        </span>
                        <div>
                          <div className="text-xs font-semibold text-on-surface group-hover:text-primary">
                            {sub.name}
                          </div>
                          <div className="text-[11px] text-on-surface-variant">
                            {sub.code} • {sub.instructor} • {sub.attendedClasses}/{sub.totalClasses} attended
                          </div>
                        </div>
                      </div>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          Number(pct) >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {pct}%
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Events Group */}
          {filteredResults.events.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1 flex items-center justify-between">
                <span>Campus Events</span>
                <span className="text-[10px] font-normal text-primary hover:underline cursor-pointer" onClick={() => navigateTo('/events')}>
                  View all ({events.length})
                </span>
              </div>
              <div className="space-y-1">
                {filteredResults.events.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => navigateTo('/events')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        celebration
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-on-surface group-hover:text-primary">
                          {evt.title}
                        </div>
                        <div className="text-[11px] text-on-surface-variant">
                          {evt.category} • {evt.date} • {evt.venue}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveEvent(evt.id);
                      }}
                      className={`p-1 rounded-full ${
                        evt.isSaved ? 'text-amber-500' : 'text-outline hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {evt.isSaved ? 'star' : 'star_border'}
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lost & Found Group */}
          {filteredResults.lostFound.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-2 mb-1 flex items-center justify-between">
                <span>Lost & Found Listings</span>
                <span className="text-[10px] font-normal text-primary hover:underline cursor-pointer" onClick={() => navigateTo('/lost-and-found')}>
                  View all ({lostFoundItems.length})
                </span>
              </div>
              <div className="space-y-1">
                {filteredResults.lostFound.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => navigateTo('/lost-and-found')}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-container-low cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                          item.type === 'lost' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {item.type}
                      </span>
                      <div>
                        <div className="text-xs font-semibold text-on-surface group-hover:text-primary">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-on-surface-variant">
                          {item.category} • {item.location} • Status: {item.status}
                        </div>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-outline text-[18px]">
                      place
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {query &&
            filteredResults.assignments.length === 0 &&
            filteredResults.subjects.length === 0 &&
            filteredResults.events.length === 0 &&
            filteredResults.lostFound.length === 0 && (
              <div className="py-8 text-center text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-3xl mb-1 text-outline">search_off</span>
                <p>No results found matching &quot;{query}&quot;</p>
              </div>
            )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest font-mono border border-outline-variant/40">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-lowest font-mono border border-outline-variant/40">
                ↵
              </kbd>{' '}
              Select
            </span>
          </div>
          <span>CampusOS Universal Quick Search</span>
        </div>
      </div>
    </div>
  );
}
