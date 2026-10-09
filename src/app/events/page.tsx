'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { CampusEvent, EventCategory } from '@/types';

export default function EventsPage() {
  const {
    events,
    toggleSaveEvent,
    registerForEvent,
    proposeEvent,
    setQuickActionOpen,
    showToast,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'weekend' | 'month' | 'saved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || '');
  const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);

  // Form states for propose event
  const [propTitle, setPropTitle] = useState('');
  const [propCategory, setPropCategory] = useState<EventCategory>('Technical');
  const [propDate, setPropDate] = useState('2025-10-26');
  const [propTime, setPropTime] = useState('02:00 PM');
  const [propVenue, setPropVenue] = useState('');
  const [propOrg, setPropOrg] = useState('');
  const [propDesc, setPropDesc] = useState('');
  const [propEligibility, setPropEligibility] = useState('All enrolled university students');

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];
  const heroEvent = events.find((e) => e.isHero) || events[0];

  // Filtering
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // Category filter
      if (selectedCategory !== 'All' && evt.category !== selectedCategory) return false;

      // Date filter
      if (dateFilter === 'saved' && !evt.isSaved) return false;
      if (dateFilter === 'today' && evt.date !== '2025-10-12') return false;
      if (dateFilter === 'weekend' && !(evt.date >= '2025-10-18' && evt.date <= '2025-10-20')) return false;

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          evt.title.toLowerCase().includes(q) ||
          evt.venue.toLowerCase().includes(q) ||
          evt.organizer.toLowerCase().includes(q) ||
          evt.description.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [events, selectedCategory, dateFilter, searchQuery]);

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle.trim() || !propVenue.trim()) return;
    proposeEvent({
      title: propTitle,
      category: propCategory,
      date: propDate,
      time: propTime,
      venue: propVenue,
      organizer: propOrg || 'Campus Student Club',
      organizerRole: 'Student Representative',
      organizerEmail: 'organizer@stateuniv.edu',
      description: propDesc || 'Engaging campus session open to all interested peers.',
      eligibility: propEligibility,
      registrationDeadline: `${propDate} at 12:00 PM`,
      tags: [propCategory, 'Student Event'],
      scheduleTimeline: [
        { time: propTime, activity: 'Opening & Welcome' },
        { time: '03:00 PM', activity: 'Main Program & Discussions' },
      ],
      imageUrl:
        'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    });
    setIsProposeModalOpen(false);
    setPropTitle('');
    setPropVenue('');
  };

  return (
    <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-md">
      <div className="flex flex-col w-full gap-space-lg pb-space-xl">
        {/* Hub Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
              <Link href="/" className="hover:text-primary">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-on-surface font-semibold">Campus Life</span>
            </div>
            <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Campus Events Hub
            </h1>
            <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant max-w-2xl">
              Curated workshops, hackathons, seminars, and cultural festivals across State University.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title or venue..."
                className="pl-9 pr-3 py-2 text-xs sm:text-sm bg-surface-container-low rounded-xl border border-outline-variant/30 outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary w-48 sm:w-64"
              />
            </div>

            <button
              type="button"
              onClick={() => setIsProposeModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs sm:text-sm px-4 py-2 rounded-xl transition-all shadow-sm font-semibold active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>Propose Event</span>
            </button>
          </div>
        </div>

        {/* Filters Ribbon */}
        <section className="bg-surface-container-lowest rounded-xl p-space-sm md:p-space-md shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {['All', 'Technical', 'Hackathons', 'Cultural', 'Sports', 'Career', 'General'].map(
              (cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-surface-container-high text-primary shadow-xs font-bold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {cat}
                </button>
              )
            )}
          </div>

          {/* Date Segmented Control */}
          <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-xl overflow-x-auto">
            {[
              { id: 'all', label: 'All Upcoming' },
              { id: 'today', label: 'Today' },
              { id: 'weekend', label: 'This Weekend' },
              { id: 'saved', label: 'Saved Events ⭐' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setDateFilter(tab.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                  dateFilter === tab.id
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* Featured Hero Event Card */}
        {heroEvent && (
          <section className="relative rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Visual Banner */}
              <div className="lg:col-span-5 relative min-h-[220px] bg-slate-900 overflow-hidden">
                <img
                  src={heroEvent.imageUrl}
                  alt={heroEvent.title}
                  className="w-full h-full object-cover opacity-90 transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="font-label-xs text-[10px] bg-primary px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow">
                    Featured Campus Highlight
                  </span>
                  <div className="text-xs text-slate-200 mt-1 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[15px]">schedule</span>
                    <span>{heroEvent.date} · {heroEvent.time}</span>
                  </div>
                </div>
              </div>

              {/* Hero Event Details */}
              <div className="lg:col-span-7 p-space-md sm:p-space-lg flex flex-col justify-between gap-space-md">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-label-xs text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">verified</span> Verified Event
                    </span>
                    <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-0.5 rounded font-label-xs text-xs font-bold">
                      {heroEvent.category}
                    </span>
                    <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-label-xs text-xs font-bold">
                      <span className="material-symbols-outlined text-[14px]">trophy</span> $5,000 Prizes
                    </span>
                  </div>

                  <h2 className="font-headline-lg text-lg sm:text-2xl font-bold text-on-surface tracking-tight">
                    {heroEvent.title}
                  </h2>
                  <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant line-clamp-2">
                    {heroEvent.description}
                  </p>
                </div>

                {/* Metric & Schedule Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs bg-surface-container-low p-space-sm rounded-xl border border-outline-variant/20">
                  <div className="flex flex-col">
                    <span className="font-label-xs text-[10px] text-on-surface-variant uppercase font-bold">
                      Date
                    </span>
                    <span className="font-title-sm text-xs sm:text-sm font-bold text-on-surface">
                      {heroEvent.date}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-xs text-[10px] text-on-surface-variant uppercase font-bold">
                      Venue
                    </span>
                    <span className="font-title-sm text-xs sm:text-sm font-bold text-on-surface truncate">
                      {heroEvent.venue.split(',')[0]}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-xs text-[10px] text-on-surface-variant uppercase font-bold">
                      RSVPs
                    </span>
                    <span className="font-title-sm text-xs sm:text-sm font-bold text-tertiary">
                      {heroEvent.attendeeCount} / {heroEvent.maxCapacity}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-xs text-[10px] text-on-surface-variant uppercase font-bold">
                      Deadline
                    </span>
                    <span className="font-title-sm text-xs sm:text-sm font-bold text-amber-700">
                      Oct 18
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant/20">
                  <div className="flex items-center gap-space-xs">
                    <button
                      type="button"
                      onClick={() => registerForEvent(heroEvent.id)}
                      className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs sm:text-sm px-5 py-2 rounded-xl shadow-sm transition-all font-bold active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
                      <span>
                        {heroEvent.isRegistered ? 'Spot Reserved ✓' : 'Register Now (Free)'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleSaveEvent(heroEvent.id)}
                      className={`inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                        heroEvent.isSaved
                          ? 'bg-amber-50 border-amber-300 text-amber-700'
                          : 'bg-surface-container border-outline-variant/30 text-on-surface-variant hover:text-on-surface'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[17px] text-amber-500">
                        {heroEvent.isSaved ? 'star' : 'star_border'}
                      </span>
                      <span>{heroEvent.isSaved ? 'Saved ⭐' : 'Save Event'}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedEventId(heroEvent.id)}
                    className="text-primary hover:text-primary-container font-label-md text-xs font-bold inline-flex items-center gap-1"
                  >
                    <span>View Itinerary &amp; Tracks</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Main Section: Events Grid (8 cols) + Detail Panel (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Curated Event Cards Grid (8 cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-space-md">
            <div className="flex items-center justify-between pb-1">
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                Upcoming Campus Events ({filteredEvents.length})
              </h2>
              <span className="text-xs text-on-surface-variant">
                Showing all university-approved activities
              </span>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-12 text-center border border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">
                  event_busy
                </span>
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  No events found
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 mb-4">
                  No upcoming events match your selected category or date filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setDateFilter('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 bg-surface-container text-primary font-bold text-xs rounded-lg"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                {filteredEvents.map((evt) => {
                  const isSelected = selectedEvent?.id === evt.id;
                  return (
                    <div
                      key={evt.id}
                      onClick={() => setSelectedEventId(evt.id)}
                      className={`rounded-2xl bg-surface-container-lowest border shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden cursor-pointer ${
                        isSelected
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-outline-variant/30 hover:border-outline-variant'
                      }`}
                    >
                      {/* Image header */}
                      <div className="relative h-36 w-full bg-slate-800 overflow-hidden">
                        <img
                          src={evt.imageUrl}
                          alt={evt.title}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                          <span className="bg-primary text-on-primary font-label-xs text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
                            {evt.category}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveEvent(evt.id);
                          }}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors shadow"
                        >
                          <span
                            className={`material-symbols-outlined text-[18px] ${
                              evt.isSaved ? 'text-amber-400' : 'text-white'
                            }`}
                          >
                            {evt.isSaved ? 'star' : 'star_border'}
                          </span>
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-space-md flex-1 flex flex-col justify-between gap-3">
                        <div className="space-y-1.5">
                          <div className="text-[11px] text-primary font-bold flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">calendar_month</span>
                            <span>{evt.date} · {evt.time.split(' - ')[0]}</span>
                          </div>

                          <h3 className="font-headline-md text-sm sm:text-base font-bold text-on-surface line-clamp-1">
                            {evt.title}
                          </h3>

                          <p className="font-body-sm text-xs text-on-surface-variant line-clamp-2">
                            {evt.description}
                          </p>
                        </div>

                        {/* Meta points */}
                        <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-1 text-xs text-on-surface-variant">
                          <div className="flex items-center gap-1 truncate">
                            <span className="material-symbols-outlined text-[15px] text-primary shrink-0">
                              location_on
                            </span>
                            <span className="truncate">{evt.venue}</span>
                          </div>
                          <div className="flex items-center gap-1 truncate">
                            <span className="material-symbols-outlined text-[15px] text-secondary shrink-0">
                              group
                            </span>
                            <span className="truncate">{evt.organizer}</span>
                          </div>
                        </div>

                        {/* Bottom action */}
                        <div className="pt-2 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-tertiary flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">how_to_reg</span>
                            {evt.attendeeCount} Registered
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEventId(evt.id);
                            }}
                            className="text-xs font-bold text-primary hover:underline flex items-center gap-0.5"
                          >
                            <span>Inspect</span>
                            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Detail Preview Panel (4 cols) */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-36 space-y-space-md">
            {selectedEvent ? (
              <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30 space-y-space-md">
                {/* Header */}
                <div className="flex items-center justify-between pb-space-xs border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-primary/10 text-primary">
                      {selectedEvent.category}
                    </span>
                    <span className="text-xs text-on-surface-variant">Event Details</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSaveEvent(selectedEvent.id)}
                    className={`p-1 rounded-lg flex items-center gap-1 text-xs font-bold transition-colors ${
                      selectedEvent.isSaved
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px] text-amber-500">
                      {selectedEvent.isSaved ? 'star' : 'star_border'}
                    </span>
                    <span>{selectedEvent.isSaved ? 'Saved' : 'Save'}</span>
                  </button>
                </div>

                {/* Title & Timing */}
                <div>
                  <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface leading-snug">
                    {selectedEvent.title}
                  </h2>
                  <div className="mt-2 p-3 bg-surface-container-low rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center gap-2 text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        event_available
                      </span>
                      <span className="font-bold">{selectedEvent.date}</span>
                      <span>•</span>
                      <span>{selectedEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-on-surface">
                      <span className="material-symbols-outlined text-primary text-[16px]">
                        location_on
                      </span>
                      <span>{selectedEvent.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Registration Countdown */}
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-500/20 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-bold text-emerald-900 block">Registration Active</span>
                    <span className="text-emerald-700 text-[11px]">
                      Closes {selectedEvent.registrationDeadline}
                    </span>
                  </div>
                  <span className="bg-emerald-600 text-white font-mono text-xs font-bold px-2 py-0.5 rounded">
                    Open
                  </span>
                </div>

                {/* Eligibility Matrix */}
                <div>
                  <h4 className="text-xs font-bold text-on-surface mb-1">Eligibility Criteria</h4>
                  <p className="text-xs text-on-surface-variant p-2.5 rounded-lg bg-surface-container-low leading-relaxed border border-outline-variant/20">
                    {selectedEvent.eligibility}
                  </p>
                </div>

                {/* Detailed Itinerary Schedule */}
                <div>
                  <h4 className="text-xs font-bold text-on-surface mb-2">Program Itinerary</h4>
                  <div className="space-y-2 border-l-2 border-primary/30 pl-3 ml-1">
                    {selectedEvent.scheduleTimeline.map((item, idx) => (
                      <div key={idx} className="relative text-xs">
                        <div className="absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-surface-container-lowest"></div>
                        <div className="font-bold text-primary font-mono text-[11px]">
                          {item.time}
                        </div>
                        <div className="text-on-surface font-medium">{item.activity}</div>
                        {item.speaker && (
                          <div className="text-[11px] text-on-surface-variant">By {item.speaker}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organizer Contact Card */}
                <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 text-xs space-y-1">
                  <div className="text-[10px] uppercase font-bold text-on-surface-variant">
                    Host Organization
                  </div>
                  <div className="font-bold text-on-surface">{selectedEvent.organizer}</div>
                  <div className="text-on-surface-variant text-[11px]">
                    Official Campus Representative · {selectedEvent.organizerEmail}
                  </div>
                </div>

                {/* Calendar Sync & Primary Action */}
                <div className="space-y-2 pt-2 border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => registerForEvent(selectedEvent.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                      selectedEvent.isRegistered
                        ? 'bg-emerald-600 text-white'
                        : 'bg-primary hover:bg-primary-container text-on-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {selectedEvent.isRegistered ? 'check_circle' : 'how_to_reg'}
                    </span>
                    <span>
                      {selectedEvent.isRegistered ? 'Registration Confirmed 🎟️' : 'Register for Event'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      showToast(
                        'Added to Calendar 📅',
                        `"${selectedEvent.title}" synced to student Google/iCal schedule.`,
                        'success'
                      );
                    }}
                    className="w-full py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">calendar_add_on</span>
                    <span>Sync with Google / iCal</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/30">
                <span className="material-symbols-outlined text-3xl text-outline mb-1">
                  celebration
                </span>
                <p className="text-xs text-on-surface-variant">Select an event to view details</p>
              </div>
            )}
          </div>
        </div>

        {/* Propose Event Modal */}
        {isProposeModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setIsProposeModalOpen(false)}
          >
            <div
              className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  Propose Campus Event (Organizer Portal)
                </h3>
                <button
                  type="button"
                  onClick={() => setIsProposeModalOpen(false)}
                  className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleProposeSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={propTitle}
                    onChange={(e) => setPropTitle(e.target.value)}
                    placeholder="e.g. Next-Gen Autonomous Robotics Showcase"
                    className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Category *</label>
                    <select
                      value={propCategory}
                      onChange={(e) => setPropCategory(e.target.value as EventCategory)}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="Technical">Technical</option>
                      <option value="Hackathons">Hackathons</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Sports">Sports</option>
                      <option value="Career">Career & Placement</option>
                      <option value="General">General Campus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Host Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={propOrg}
                      onChange={(e) => setPropOrg(e.target.value)}
                      placeholder="e.g. IEEE Student Branch"
                      className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={propDate}
                      onChange={(e) => setPropDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Time *</label>
                    <input
                      type="text"
                      required
                      value={propTime}
                      onChange={(e) => setPropTime(e.target.value)}
                      placeholder="e.g. 02:00 PM"
                      className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Venue *</label>
                  <input
                    type="text"
                    required
                    value={propVenue}
                    onChange={(e) => setPropVenue(e.target.value)}
                    placeholder="e.g. Seminar Hall B, Engineering South"
                    className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={propDesc}
                    onChange={(e) => setPropDesc(e.target.value)}
                    placeholder="Agenda, guest speakers, expected learning outcomes..."
                    className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setIsProposeModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-primary text-on-primary hover:bg-primary-container rounded-lg shadow-sm"
                  >
                    Submit Proposal
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
