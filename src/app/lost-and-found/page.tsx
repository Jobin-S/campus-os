'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { campusZones } from '@/data/mockData';
import { ItemCategory, ItemType, LostFoundItem } from '@/types';

export default function LostAndFoundPage() {
  const {
    lostFoundItems,
    reportItem,
    submitClaim,
    resolveItem,
    showToast,
  } = useApp();

  const [viewMode, setViewMode] = useState<'map' | 'grid'>('map');
  const [activeTab, setActiveTab] = useState<'all' | 'lost' | 'found' | 'claims'>('found');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Claim Modal state
  const [claimModalItem, setClaimModalItem] = useState<LostFoundItem | null>(null);
  const [claimantName, setClaimantName] = useState('Alex Morgan');
  const [claimDetails, setClaimDetails] = useState('');
  const [claimLocationPref, setClaimLocationPref] = useState('Library Circulation Desk');

  // Report Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportType, setReportType] = useState<ItemType>('lost');
  const [repTitle, setRepTitle] = useState('');
  const [repCategory, setRepCategory] = useState<ItemCategory>('Electronics');
  const [repLocation, setRepLocation] = useState('');
  const [repZone, setRepZone] = useState('library');
  const [repDesc, setRepDesc] = useState('');
  const [repHandover, setRepHandover] = useState('Campus Security Kiosk (Gate 1)');

  // Filtered items
  const filteredItems = useMemo(() => {
    return lostFoundItems.filter((item) => {
      // Tab filter
      if (activeTab === 'lost' && item.type !== 'lost') return false;
      if (activeTab === 'found' && item.type !== 'found') return false;
      if (activeTab === 'claims' && item.claims.length === 0) return false;

      // Zone filter
      if (selectedZone !== 'all' && item.zoneId !== selectedZone) return false;

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [lostFoundItems, activeTab, selectedZone, selectedCategory, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: lostFoundItems.length,
      lost: lostFoundItems.filter((i) => i.type === 'lost').length,
      found: lostFoundItems.filter((i) => i.type === 'found').length,
      claims: lostFoundItems.filter((i) => i.claims.length > 0).length,
    };
  }, [lostFoundItems]);

  const handleClaimSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimModalItem || !claimDetails.trim()) return;
    submitClaim(
      claimModalItem.id,
      claimantName,
      `${claimDetails} (Handover preference: ${claimLocationPref})`
    );
    setClaimModalItem(null);
    setClaimDetails('');
  };

  const handleReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repTitle.trim() || !repLocation.trim()) return;
    reportItem({
      type: reportType,
      title: repTitle,
      category: repCategory,
      location: repLocation,
      zoneId: repZone,
      dateReported: new Date().toISOString().split('T')[0],
      timeReported: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: repDesc,
      reporterName: 'Alex Morgan',
      reporterIsAnonymous: false,
      safeHandoverLocation: repHandover,
    });
    setIsReportModalOpen(false);
    setRepTitle('');
    setRepLocation('');
    setRepDesc('');
  };

  const selectedItem = lostFoundItems.find((i) => i.id === selectedItemId);

  return (
    <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-md">
      <div className="flex flex-col w-full gap-space-lg pb-space-xl">
        {/* Top Spatial Discovery Utility Ribbon */}
        <div className="flex items-center justify-between py-1 text-on-surface-variant font-label-xs text-xs border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-on-surface">Campus Spatial Discovery Engine v2.4</span>
            <span className="hidden sm:inline text-outline">•</span>
            <span className="hidden sm:inline">6 Interactive Zones Mapped</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:inline text-on-surface-variant">Campus Recovery Rate:</span>
            <span className="font-bold text-tertiary">91.4% this term</span>
            <span className="bg-surface-container px-2 py-0.5 rounded-full text-on-secondary-container font-mono text-[11px] font-bold">
              {lostFoundItems.length} Active Records
            </span>
          </div>
        </div>

        {/* Header Card: Spatial Discovery Variant */}
        <div className="relative bg-surface-container-lowest rounded-2xl p-space-md lg:p-space-lg shadow-sm border border-outline-variant/30">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
            <div>
              <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
                <Link href="/" className="hover:text-primary">
                  Dashboard
                </Link>
                <span>/</span>
                <span className="text-on-surface font-semibold">Community Hub</span>
              </div>
              <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-1">
                Lost &amp; Found Campus Explorer
              </h1>
              <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant mt-1 max-w-2xl">
                Spatial map and verified campus network to reconnect misplaced belongings with their
                owners through secure, privacy-first peer claims.
              </p>
            </div>

            {/* Actions & View Switcher */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* View Toggle */}
              <div className="inline-flex p-1 bg-surface-container-low rounded-xl border border-outline-variant/30">
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'map'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">map</span>
                  <span>Map View</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    viewMode === 'grid'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[17px]">grid_view</span>
                  <span>Card View</span>
                </button>
              </div>

              {/* Report Actions */}
              <button
                type="button"
                onClick={() => {
                  setReportType('lost');
                  setIsReportModalOpen(true);
                }}
                className="inline-flex items-center gap-1 bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-xs font-bold px-3 py-2 rounded-xl transition-all active:scale-95 shadow-xs"
              >
                <span className="material-symbols-outlined text-[17px]">search</span>
                <span>+ Report Lost</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setReportType('found');
                  setIsReportModalOpen(true);
                }}
                className="inline-flex items-center gap-1 bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[17px]">volunteer_activism</span>
                <span>+ Report Found</span>
              </button>
            </div>
          </div>

          {/* Quick Zone Clusters Selector Bar */}
          <div className="mt-space-md pt-space-sm border-t border-outline-variant/30 flex items-center justify-between gap-space-sm overflow-x-auto">
            <div className="flex items-center gap-space-xs shrink-0 text-on-surface-variant font-label-xs text-xs uppercase font-bold">
              <span className="material-symbols-outlined text-primary text-[18px]">near_me</span>
              <span>Campus Zones:</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
              <button
                type="button"
                onClick={() => setSelectedZone('all')}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedZone === 'all'
                    ? 'bg-primary text-on-primary shadow-xs'
                    : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                }`}
              >
                <span>All Grounds ({counts.all})</span>
              </button>
              {campusZones.map((z) => {
                const zoneCount = lostFoundItems.filter((i) => i.zoneId === z.id).length;
                return (
                  <button
                    key={z.id}
                    type="button"
                    onClick={() => setSelectedZone(z.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                      selectedZone === z.id
                        ? 'bg-primary text-on-primary font-bold shadow-xs'
                        : 'bg-surface-container-low hover:bg-surface-container text-on-surface-variant'
                    }`}
                  >
                    <span>{z.name.split(' ')[0]} {z.name.split(' ')[1]} ({zoneCount})</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Controls Bar: Status Subtabs, Radius Filter, Categories & Keyword Search */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          {/* Subtabs: Lost vs Found vs My Claims */}
          <div className="inline-flex bg-surface-container-low p-1 rounded-xl self-start overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('found')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'found'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[17px] text-emerald-600">
                inventory_2
              </span>
              <span>Found Items</span>
              <span className="bg-primary/10 text-primary px-1.5 py-0.2 rounded-full text-[10px]">
                {counts.found}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('lost')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'lost'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[17px] text-error">search</span>
              <span>Lost Items</span>
              <span className="bg-surface-container text-on-surface-variant px-1.5 py-0.2 rounded-full text-[10px]">
                {counts.lost}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('claims')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === 'claims'
                  ? 'bg-surface-container-lowest text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[17px] text-amber-500">
                assignment_turned_in
              </span>
              <span>Claims in Review</span>
              <span className="bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full text-[10px]">
                {counts.claims}
              </span>
            </button>
          </div>

          {/* Search bar & Category Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1 sm:flex-none">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pins or keywords..."
                className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-surface-container-low rounded-lg border border-outline-variant/30 outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-surface-container-low rounded-lg border border-outline-variant/30 outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="ID Cards">ID Cards</option>
              <option value="Bags">Bags</option>
              <option value="Books & Stationery">Books &amp; Stationery</option>
              <option value="Keys">Keys</option>
              <option value="Wallets">Wallets</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Spatial Map View Layout */}
        {viewMode === 'map' && (
          <div className="relative w-full rounded-2xl bg-slate-900 p-4 sm:p-6 shadow-md border border-slate-700/50 overflow-hidden text-white">
            {/* Map Header Overlay */}
            <div className="flex items-center justify-between mb-4 z-10 relative">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary-container text-[22px]">
                  map
                </span>
                <span className="font-bold text-sm">Interactive Campus Spatial Grid</span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  • Click pins to inspect item location &amp; handover station
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono">
                  ● Found Item Pin
                </span>
                <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-mono">
                  ● Lost Item Pin
                </span>
              </div>
            </div>

            {/* SVG Interactive Campus Map Canvas */}
            <div className="relative w-full h-[360px] sm:h-[420px] rounded-xl bg-slate-950 border border-slate-800 overflow-hidden select-none">
              {/* Campus Grid Pathways SVG */}
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                {/* Background Grid */}
                <defs>
                  <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="rgba(255,255,255,0.04)"
                      strokeWidth="1"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#campus-grid)" />

                {/* Campus walkways / pathways */}
                <path
                  d="M 100 150 Q 250 180 400 200 T 700 220"
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.2)"
                  strokeWidth="6"
                  strokeDasharray="8 8"
                />
                <path
                  d="M 300 50 L 320 380"
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.15)"
                  strokeWidth="8"
                />
                <path
                  d="M 150 240 L 650 240"
                  fill="none"
                  stroke="rgba(99, 102, 241, 0.15)"
                  strokeWidth="8"
                />

                {/* Zone Outline Blocks */}
                <rect
                  x="28%"
                  y="20%"
                  width="18%"
                  height="24%"
                  rx="12"
                  fill="rgba(59, 130, 246, 0.1)"
                  stroke="rgba(59, 130, 246, 0.3)"
                  strokeWidth="1.5"
                />
                <rect
                  x="56%"
                  y="16%"
                  width="20%"
                  height="24%"
                  rx="12"
                  fill="rgba(99, 102, 241, 0.1)"
                  stroke="rgba(99, 102, 241, 0.3)"
                  strokeWidth="1.5"
                />
                <rect
                  x="40%"
                  y="50%"
                  width="22%"
                  height="22%"
                  rx="12"
                  fill="rgba(16, 185, 129, 0.1)"
                  stroke="rgba(16, 185, 129, 0.3)"
                  strokeWidth="1.5"
                />
                <rect
                  x="16%"
                  y="52%"
                  width="18%"
                  height="22%"
                  rx="12"
                  fill="rgba(245, 158, 11, 0.1)"
                  stroke="rgba(245, 158, 11, 0.3)"
                  strokeWidth="1.5"
                />
                <rect
                  x="70%"
                  y="52%"
                  width="20%"
                  height="24%"
                  rx="12"
                  fill="rgba(139, 92, 246, 0.1)"
                  stroke="rgba(139, 92, 246, 0.3)"
                  strokeWidth="1.5"
                />
                <rect
                  x="42%"
                  y="76%"
                  width="20%"
                  height="18%"
                  rx="12"
                  fill="rgba(239, 68, 68, 0.1)"
                  stroke="rgba(239, 68, 68, 0.3)"
                  strokeWidth="1.5"
                />
              </svg>

              {/* Zone Labels on Map */}
              <div className="absolute top-[22%] left-[29%] text-[10px] sm:text-xs font-bold text-blue-300 pointer-events-none">
                📚 Main Library
              </div>
              <div className="absolute top-[18%] left-[57%] text-[10px] sm:text-xs font-bold text-indigo-300 pointer-events-none">
                💻 CS &amp; AI Block
              </div>
              <div className="absolute top-[52%] left-[42%] text-[10px] sm:text-xs font-bold text-emerald-300 pointer-events-none">
                🥪 Student Union
              </div>
              <div className="absolute top-[54%] left-[17%] text-[10px] sm:text-xs font-bold text-amber-300 pointer-events-none">
                🧪 Science Quad
              </div>
              <div className="absolute top-[54%] left-[72%] text-[10px] sm:text-xs font-bold text-purple-300 pointer-events-none">
                🏸 Sports Pavilion
              </div>
              <div className="absolute top-[78%] left-[44%] text-[10px] sm:text-xs font-bold text-rose-300 pointer-events-none">
                🏛️ Auditorium
              </div>

              {/* Render Interactive Pins */}
              {filteredItems.map((item) => {
                const zone = campusZones.find((z) => z.id === item.zoneId);
                const isSelected = selectedItemId === item.id;
                // Add slight jitter for multiple pins in same zone
                const seed = item.id.charCodeAt(item.id.length - 1);
                const offsetX = (seed % 7) - 3;
                const offsetY = (seed % 5) - 2;

                const posX = (zone?.coords.x || 50) + offsetX;
                const posY = (zone?.coords.y || 50) + offsetY;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedItemId(item.id)}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer transition-transform ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-115'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 ${
                        item.type === 'found'
                          ? 'bg-emerald-600 border-white text-white'
                          : 'bg-red-600 border-white text-white'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[15px]">
                        {item.type === 'found' ? 'inventory_2' : 'search'}
                      </span>
                    </div>

                    {/* Tooltip on Hover */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-black/90 text-white text-[11px] font-bold px-2 py-1 rounded shadow-xl whitespace-nowrap pointer-events-none z-40 border border-slate-700">
                      {item.title} ({item.type.toUpperCase()})
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected Pin Inspector (Banner when a pin is clicked) */}
        {selectedItem && (
          <div className="p-4 bg-surface-container-lowest rounded-2xl border-2 border-primary shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${
                  selectedItem.type === 'found' ? 'bg-emerald-600' : 'bg-red-600'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {selectedItem.type === 'found' ? 'inventory_2' : 'search'}
                </span>
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.2 rounded-full uppercase ${
                      selectedItem.type === 'found'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {selectedItem.type}
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono">
                    {selectedItem.category}
                  </span>
                  <span className="text-xs text-on-surface-variant">• {selectedItem.location}</span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-on-surface truncate">
                  {selectedItem.title}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-1">
                  {selectedItem.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
              {selectedItem.type === 'found' && selectedItem.status !== 'Resolved' && (
                <button
                  type="button"
                  onClick={() => setClaimModalItem(selectedItem)}
                  className="px-3.5 py-1.5 bg-primary hover:bg-primary-container text-on-primary font-bold text-xs rounded-xl shadow-xs"
                >
                  Claim This Item
                </button>
              )}
              {selectedItem.status !== 'Resolved' && (
                <button
                  type="button"
                  onClick={() => resolveItem(selectedItem.id)}
                  className="px-3 py-1.5 bg-surface-container text-on-surface font-semibold text-xs rounded-xl hover:bg-surface-container-high"
                >
                  Mark Resolved
                </button>
              )}
              <button
                type="button"
                onClick={() => setSelectedItemId(null)}
                className="p-1 rounded text-on-surface-variant hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
          </div>
        )}

        {/* Card Grid View */}
        <div className="space-y-space-md">
          <div className="flex items-center justify-between pb-1">
            <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
              {activeTab === 'found'
                ? 'Found Campus Belongings'
                : activeTab === 'lost'
                ? 'Reported Missing Items'
                : 'Items with Active Claims'}{' '}
              ({filteredItems.length})
            </h2>
            <span className="text-xs text-on-surface-variant">
              Safe community handovers in public zones
            </span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-xl p-12 text-center border border-outline-variant/30">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">
                location_off
              </span>
              <h3 className="font-headline-md text-base font-bold text-on-surface">
                No items found
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 mb-4">
                No records match your selected zone or category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('all');
                  setSelectedZone('all');
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-surface-container text-primary font-bold text-xs rounded-lg"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
              {filteredItems.map((item) => {
                const isFound = item.type === 'found';
                return (
                  <div
                    key={item.id}
                    className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-outline-variant/30 hover:border-outline-variant transition-all flex flex-col justify-between gap-3"
                  >
                    <div>
                      {/* Top ribbon */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span
                          className={`inline-flex items-center gap-1 font-label-xs text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            isFound
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[13px]">
                            {isFound ? 'inventory_2' : 'search'}
                          </span>
                          {item.type}
                        </span>

                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                            item.status === 'Resolved'
                              ? 'bg-slate-100 text-slate-700'
                              : item.status === 'Claim Pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          Status: {item.status}
                        </span>
                      </div>

                      {/* Title & Category */}
                      <h3 className="font-headline-md text-sm sm:text-base font-bold text-on-surface leading-snug">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-on-surface-variant font-mono mt-0.5">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>Reported {item.dateReported}</span>
                      </div>

                      <p className="font-body-sm text-xs text-on-surface-variant mt-2 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-outline-variant/20 space-y-2">
                      <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-primary text-[15px] shrink-0">
                          place
                        </span>
                        <span className="truncate">{item.location}</span>
                      </div>

                      {item.safeHandoverLocation && (
                        <div className="flex items-center gap-1 text-[11px] text-tertiary font-semibold">
                          <span className="material-symbols-outlined text-[14px] shrink-0">
                            verified_user
                          </span>
                          <span className="truncate">Safe Station: {item.safeHandoverLocation}</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex items-center justify-between pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedItemId(item.id);
                            setViewMode('map');
                            window.scrollTo({ top: 120, behavior: 'smooth' });
                          }}
                          className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">pin_drop</span>
                          <span>Show on Map</span>
                        </button>

                        <div className="flex items-center gap-2">
                          {isFound && item.status !== 'Resolved' && (
                            <button
                              type="button"
                              onClick={() => setClaimModalItem(item)}
                              className="px-3 py-1.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg shadow-xs transition-colors"
                            >
                              Claim Item
                            </button>
                          )}
                          {item.status !== 'Resolved' && (
                            <button
                              type="button"
                              onClick={() => resolveItem(item.id)}
                              className="px-2.5 py-1.5 bg-surface-container text-on-surface text-xs font-semibold rounded-lg hover:bg-surface-container-high transition-colors"
                            >
                              Resolve
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Private Claim Modal */}
        {claimModalItem && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setClaimModalItem(null)}
          >
            <div
              className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    verified_user
                  </span>
                  <h3 className="font-headline-md text-base font-bold text-on-surface">
                    Private Ownership Verification Claim
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setClaimModalItem(null)}
                  className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl text-xs space-y-1">
                <div className="text-[11px] text-on-surface-variant uppercase font-bold">
                  Claiming Item
                </div>
                <div className="font-bold text-on-surface text-sm">{claimModalItem.title}</div>
                <div className="text-on-surface-variant">
                  Found at: {claimModalItem.location} ({claimModalItem.category})
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-[11px] text-amber-900 border border-amber-300/40 leading-relaxed">
                🔒 <strong>Privacy Assurance:</strong> Your answers are encrypted and shared only with
                the item finder or campus security moderator. No phone numbers or private documents
                are posted publicly.
              </div>

              <form onSubmit={handleClaimSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Your Full Name &amp; Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={claimantName}
                    onChange={(e) => setClaimantName(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Ownership Proof &amp; Non-Public Identifying Marks *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={claimDetails}
                    onChange={(e) => setClaimDetails(e.target.value)}
                    placeholder="Describe specific details not shown publicly: e.g. color of keychain, lockscreen wallpaper, scratch on left side, internal contents..."
                    className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Preferred Campus Handover Location *
                  </label>
                  <select
                    value={claimLocationPref}
                    onChange={(e) => setClaimLocationPref(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Library Circulation Desk">
                      Library Circulation Desk (Level 1)
                    </option>
                    <option value="Student Union Help Desk">Student Union Information Desk</option>
                    <option value="Campus Security Dispatch (Gate 1)">
                      Campus Security Dispatch (Gate 1)
                    </option>
                    <option value="Department Office">Department Administration Office</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setClaimModalItem(null)}
                    className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-primary text-on-primary hover:bg-primary-container rounded-lg shadow-sm"
                  >
                    Submit Private Claim
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Report Lost/Found Modal */}
        {isReportModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setIsReportModalOpen(false)}
          >
            <div
              className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  {reportType === 'lost' ? 'Report a Missing Item' : 'Report a Discovered Item'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleReportSubmit} className="space-y-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setReportType('lost')}
                    className={`flex-1 p-2 rounded-xl text-xs font-bold border transition-all ${
                      reportType === 'lost'
                        ? 'bg-red-50 border-error text-error'
                        : 'border-outline-variant/40 text-on-surface-variant'
                    }`}
                  >
                    Lost Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setReportType('found')}
                    className={`flex-1 p-2 rounded-xl text-xs font-bold border transition-all ${
                      reportType === 'found'
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-800'
                        : 'border-outline-variant/40 text-on-surface-variant'
                    }`}
                  >
                    Found Item
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Item Title *</label>
                  <input
                    type="text"
                    required
                    value={repTitle}
                    onChange={(e) => setRepTitle(e.target.value)}
                    placeholder={
                      reportType === 'lost'
                        ? 'e.g. Black Leather Wallet with Student ID'
                        : 'e.g. Set of 3 Dorm Keys with Blue Keychain'
                    }
                    className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Category *</label>
                    <select
                      value={repCategory}
                      onChange={(e) => setRepCategory(e.target.value as ItemCategory)}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="ID Cards">ID Cards</option>
                      <option value="Bags">Bags</option>
                      <option value="Books & Stationery">Books &amp; Stationery</option>
                      <option value="Keys">Keys</option>
                      <option value="Wallets">Wallets</option>
                      <option value="Clothing & Accessories">Clothing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Campus Zone *</label>
                    <select
                      value={repZone}
                      onChange={(e) => setRepZone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="library">Main Library</option>
                      <option value="cs_block">Computer Science Building</option>
                      <option value="student_union">Student Union &amp; Dining</option>
                      <option value="science_quad">Science Quad</option>
                      <option value="sports_pavilion">Sports Pavilion</option>
                      <option value="auditorium">Main Auditorium</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Specific Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={repLocation}
                    onChange={(e) => setRepLocation(e.target.value)}
                    placeholder="e.g. 2nd Floor Study Desks, near window #4"
                    className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Description &amp; Public Clues
                  </label>
                  <textarea
                    rows={2}
                    value={repDesc}
                    onChange={(e) => setRepDesc(e.target.value)}
                    placeholder="General description. Withhold secret details so true owner can prove ownership."
                    className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">
                    Safe Handover Station
                  </label>
                  <input
                    type="text"
                    value={repHandover}
                    onChange={(e) => setRepHandover(e.target.value)}
                    placeholder="e.g. Library Front Desk or Campus Security Dispatch"
                    className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-primary text-on-primary hover:bg-primary-container rounded-lg shadow-sm"
                  >
                    Submit Report
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
