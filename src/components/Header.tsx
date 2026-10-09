'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { NotificationsDrawer } from './NotificationsDrawer';

export function Header() {
  const pathname = usePathname();
  const {
    userProfile,
    unreadNotificationCount,
    setCommandPaletteOpen,
    setQuickActionOpen,
    isNotificationsOpen,
    setNotificationsOpen,
    getAggregateAttendance,
    isFirestoreConnected,
  } = useApp();

  const [isCollegeMenuOpen, setCollegeMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const aggregate = getAggregateAttendance();

  const navLinks = [
    { label: 'My Day', href: '/', id: 'my-day' },
    { label: 'Assignments & Deadlines', href: '/assignments', id: 'assignments' },
    { label: 'Attendance Calculator', href: '/attendance', id: 'attendance' },
    { label: 'Campus Events Hub', href: '/events', id: 'events' },
    { label: 'Lost & Found', href: '/lost-and-found', id: 'lost-and-found' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-surface-container-lowest shadow-[0_1px_8px_rgba(30,27,75,0.04)] border-b border-outline-variant/30">
        <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg flex flex-col justify-between pt-space-sm pb-1">
          {/* Top Row: Brand, Search, User Quick Controls */}
          <div className="flex items-center justify-between gap-space-md h-14">
            {/* Brand Logo & College Selector */}
            <div className="flex items-center gap-space-md">
              <Link href="/" className="flex items-center gap-space-xs group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-primary-container flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
                  <span className="material-symbols-outlined text-[22px]">school</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-headline-md text-headline-md leading-none text-primary tracking-tight font-bold">
                    CampusOS
                  </span>
                  <span className="font-label-xs text-[11px] text-on-surface-variant font-medium">
                    Student Companion
                  </span>
                </div>
              </Link>

              {/* College Selector Dropdown */}
              <div className="relative hidden xl:block">
                <button
                  type="button"
                  onClick={() => setCollegeMenuOpen((prev) => !prev)}
                  className="flex items-center gap-space-xs bg-surface-container-low px-space-sm py-1.5 rounded-lg hover:bg-surface-container transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-secondary text-[17px]">account_balance</span>
                  <span className="font-label-xs text-label-xs text-on-surface font-semibold max-w-[190px] truncate">
                    {userProfile.college}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[16px]">expand_more</span>
                </button>

                {isCollegeMenuOpen && (
                  <div className="absolute left-0 mt-1 w-64 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/40 p-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
                      Switch Campus Community
                    </div>
                    <button
                      type="button"
                      onClick={() => setCollegeMenuOpen(false)}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg bg-surface-container-low text-primary font-semibold flex items-center justify-between"
                    >
                      <span>State University — Main</span>
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        alert('Switching campus in multi-college mode (demo).');
                        setCollegeMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors"
                    >
                      Tech Institute of Technology
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        alert('Switching campus in multi-college mode (demo).');
                        setCollegeMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors"
                    >
                      Metro State Medical College
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Middle: Universal Search Bar Trigger (Cmd+K) */}
            <div className="flex-1 max-w-xl mx-space-sm hidden md:block">
              <button
                type="button"
                onClick={() => setCommandPaletteOpen(true)}
                className="w-full relative flex items-center justify-between pl-10 pr-3 py-2 bg-surface-container-low hover:bg-surface-container rounded-full text-left transition-all border border-transparent hover:border-outline-variant/40 text-on-surface-variant font-body-sm text-body-sm shadow-[0_1px_2px_rgba(30,27,75,0.02)]"
              >
                <span className="material-symbols-outlined absolute left-3 text-outline text-[19px] pointer-events-none">
                  search
                </span>
                <span className="truncate">Search tasks, subjects, events, lost items...</span>
                <kbd className="hidden sm:inline-flex items-center gap-0.5 font-label-xs text-[11px] text-on-surface-variant bg-surface-container-lowest px-2 py-0.5 rounded shadow-sm border border-outline-variant/40">
                  ⌘K
                </kbd>
              </button>
            </div>

            {/* Right: Quick Action, Notifications, User Profile */}
            <div className="flex items-center gap-space-xs sm:gap-space-sm">
              {/* Quick Action Button */}
              <button
                type="button"
                onClick={() => setQuickActionOpen(true)}
                className="inline-flex items-center gap-1.5 bg-primary-container hover:bg-primary text-on-primary font-label-md text-label-md px-3 sm:px-space-md py-1.5 rounded-lg transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span className="hidden sm:inline">New Task / Report</span>
              </button>

              {/* Notifications Toggle */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setNotificationsOpen(!isNotificationsOpen)}
                  className="relative p-2 rounded-full hover:bg-surface-container text-on-surface-variant transition-colors"
                  aria-label="Notifications"
                >
                  <span className="material-symbols-outlined text-[22px]">notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-error text-on-error font-label-xs text-[10px] font-bold">
                      {unreadNotificationCount}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && <NotificationsDrawer />}
              </div>

              {/* User Avatar */}
              <div className="flex items-center gap-space-xs pl-space-xs sm:pl-space-sm">
                <div className="relative">
                  <img
                    alt={userProfile.name}
                    src={userProfile.avatarUrl}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container-low"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary-fixed-dim ring-2 ring-surface-container-lowest"></span>
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="font-label-md text-label-md text-on-surface leading-tight font-semibold">
                    {userProfile.name}
                  </span>
                  <span className="font-label-xs text-[11px] text-on-surface-variant">CS '26</span>
                </div>
              </div>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[24px]">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>

          {/* Navigation Bar Strip (Desktop) */}
          <div className="hidden md:flex items-center justify-between gap-space-md overflow-x-auto pt-1">
            <nav className="flex items-center gap-space-xs py-1">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-all whitespace-nowrap font-medium ${
                      active
                        ? 'bg-surface-container-high text-primary font-semibold shadow-xs'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Quick Context Metric Indicators */}
            <div className="flex items-center gap-space-xs pb-1 font-label-xs text-label-xs text-on-surface-variant whitespace-nowrap">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded font-mono text-[11px] font-semibold ${
                isFirestoreConnected ? 'bg-emerald-50 text-emerald-800 border border-emerald-500/30' : 'bg-surface-container-low text-on-surface-variant'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isFirestoreConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`}></span>
                {isFirestoreConnected ? 'Firestore Live' : 'Local Cache'}
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded text-on-secondary-container">
                <span className="material-symbols-outlined text-[14px]">event_note</span>
                Fall 2025 · Week {userProfile.academicWeek}
              </span>
              <span className="inline-flex items-center gap-1 bg-surface-container-low px-2 py-0.5 rounded text-on-secondary-container">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                Midterms in 12 days
              </span>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold ${
                  aggregate.percentage >= 75
                    ? 'bg-tertiary/10 text-tertiary'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">
                  {aggregate.percentage >= 75 ? 'check_circle' : 'warning'}
                </span>
                Attendance: {aggregate.percentage}%
              </span>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden py-3 border-t border-outline-variant/30 space-y-1">
              <div className="pb-2">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setCommandPaletteOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface-variant"
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>Search CampusOS...</span>
                </button>
              </div>

              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                      active
                        ? 'bg-surface-container-high text-primary font-bold'
                        : 'text-on-surface hover:bg-surface-container-low'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Mobile Info Ribbon */}
        <div className="md:hidden w-full bg-surface-container-low py-1 px-margin text-center font-label-xs text-[11px] text-on-secondary-container truncate flex items-center justify-center gap-2">
          <span>Week {userProfile.academicWeek}</span>
          <span>•</span>
          <span>Attendance: {aggregate.percentage}%</span>
          <span>•</span>
          <span>Midterms in 12d</span>
        </div>
      </header>
    </>
  );
}
