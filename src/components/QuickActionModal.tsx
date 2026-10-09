'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AssignmentPriority, EventCategory, ItemCategory, ItemType } from '@/types';

export function QuickActionModal() {
  const {
    isQuickActionOpen,
    setQuickActionOpen,
    addAssignment,
    subjects,
    recordAttendance,
    proposeEvent,
    reportItem,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'assignment' | 'attendance' | 'event' | 'lost_found'>('assignment');

  // Form states: Assignment
  const [asgTitle, setAsgTitle] = useState('');
  const [asgCourse, setAsgCourse] = useState('CS-302');
  const [asgDate, setAsgDate] = useState('2025-10-16');
  const [asgTime, setAsgTime] = useState('11:59 PM');
  const [asgPriority, setAsgPriority] = useState<AssignmentPriority>('medium');
  const [asgDesc, setAsgDesc] = useState('');

  // Form states: Attendance
  const [attSubjectId, setAttSubjectId] = useState(subjects[0]?.id || '');
  const [attAction, setAttAction] = useState<'attended' | 'missed'>('attended');

  // Form states: Event
  const [evtTitle, setEvtTitle] = useState('');
  const [evtCategory, setEvtCategory] = useState<EventCategory>('Technical');
  const [evtDate, setEvtDate] = useState('2025-10-24');
  const [evtTime, setEvtTime] = useState('03:00 PM');
  const [evtVenue, setEvtVenue] = useState('');
  const [evtDesc, setEvtDesc] = useState('');

  // Form states: Lost & Found
  const [lfType, setLfType] = useState<ItemType>('lost');
  const [lfTitle, setLfTitle] = useState('');
  const [lfCategory, setLfCategory] = useState<ItemCategory>('Electronics');
  const [lfLocation, setLfLocation] = useState('');
  const [lfZone, setLfZone] = useState('library');
  const [lfDesc, setLfDesc] = useState('');

  if (!isQuickActionOpen) return null;

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asgTitle.trim()) return;
    const selectedCourseObj = subjects.find((s) => s.code === asgCourse);
    addAssignment({
      title: asgTitle,
      courseCode: asgCourse,
      courseName: selectedCourseObj?.name || asgCourse,
      dueDate: asgDate,
      dueTime: asgTime,
      priority: asgPriority,
      status: 'pending',
      progress: 0,
      description: asgDesc,
      checklist: [{ id: `c-${Date.now()}`, text: 'Initial research & outline', completed: false }],
      reminders: { days3: true, days1: true, dayOf: true },
      attachments: [],
    });
    setQuickActionOpen(false);
  };

  const handleLogAttendance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attSubjectId) return;
    recordAttendance(attSubjectId, attAction);
    setQuickActionOpen(false);
  };

  const handleProposeEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!evtTitle.trim() || !evtVenue.trim()) return;
    proposeEvent({
      title: evtTitle,
      category: evtCategory,
      date: evtDate,
      time: evtTime,
      venue: evtVenue,
      organizer: 'Campus Student Representative',
      organizerRole: 'Student Club Organizer',
      organizerEmail: 'organizer@stateuniv.edu',
      description: evtDesc || 'Detailed agenda and RSVP details to follow.',
      eligibility: 'All registered campus students.',
      registrationDeadline: `${evtDate} at 12:00 PM`,
      tags: [evtCategory, 'Student Activity'],
      scheduleTimeline: [{ time: evtTime, activity: 'Event Kickoff & Welcome' }],
      imageUrl:
        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800',
    });
    setQuickActionOpen(false);
  };

  const handleReportItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lfTitle.trim() || !lfLocation.trim()) return;
    reportItem({
      type: lfType,
      title: lfTitle,
      category: lfCategory,
      location: lfLocation,
      zoneId: lfZone,
      dateReported: new Date().toISOString().split('T')[0],
      timeReported: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: lfDesc,
      reporterName: 'Alex Morgan',
      reporterIsAnonymous: false,
      safeHandoverLocation: 'Campus Security Office / Help Desk',
    });
    setQuickActionOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
      onClick={() => setQuickActionOpen(false)}
    >
      <div
        className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">add_circle</span>
            <h2 className="font-headline-md text-base font-bold text-on-surface">
              Quick Action Center
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setQuickActionOpen(false)}
            className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Action Tabs */}
        <div className="flex border-b border-outline-variant/30 bg-surface-container-low px-4 pt-2 gap-2 overflow-x-auto">
          {[
            { id: 'assignment', label: 'New Assignment', icon: 'assignment' },
            { id: 'attendance', label: 'Log Class', icon: 'calculate' },
            { id: 'event', label: 'Propose Event', icon: 'event' },
            { id: 'lost_found', label: 'Lost / Found', icon: 'location_searching' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-t-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-surface-container-lowest text-primary shadow-xs border-t-2 border-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab 1: Assignment Form */}
        {activeTab === 'assignment' && (
          <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Assignment Title *
              </label>
              <input
                type="text"
                required
                value={asgTitle}
                onChange={(e) => setAsgTitle(e.target.value)}
                placeholder="e.g. Distributed Systems Paxos Simulation"
                className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Course *</label>
                <select
                  value={asgCourse}
                  onChange={(e) => setAsgCourse(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.code}>
                      {sub.code} — {sub.name}
                    </option>
                  ))}
                  <option value="GEN-101">Other Academic Course</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Priority</label>
                <select
                  value={asgPriority}
                  onChange={(e) => setAsgPriority(e.target.value as AssignmentPriority)}
                  className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="high">High Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="low">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Due Date *</label>
                <input
                  type="date"
                  required
                  value={asgDate}
                  onChange={(e) => setAsgDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Due Time</label>
                <input
                  type="text"
                  value={asgTime}
                  onChange={(e) => setAsgTime(e.target.value)}
                  placeholder="e.g. 11:59 PM"
                  className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Description & Notes
              </label>
              <textarea
                rows={2}
                value={asgDesc}
                onChange={(e) => setAsgDesc(e.target.value)}
                placeholder="Include key rubric instructions or submission guidelines..."
                className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setQuickActionOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-primary text-on-primary hover:bg-primary-container rounded-lg shadow-sm"
              >
                Create Assignment
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Attendance Quick Log */}
        {activeTab === 'attendance' && (
          <form onSubmit={handleLogAttendance} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Select Subject *</label>
              <select
                value={attSubjectId}
                onChange={(e) => setAttSubjectId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
              >
                {subjects.map((sub) => {
                  const pct = ((sub.attendedClasses / sub.totalClasses) * 100).toFixed(1);
                  return (
                    <option key={sub.id} value={sub.id}>
                      {sub.name} ({sub.code}) — Current: {pct}%
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Action *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setAttAction('attended')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                    attAction === 'attended'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20'
                      : 'border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-emerald-600">check_circle</span>
                  <span>Attended Class</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAttAction('missed')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                    attAction === 'missed'
                      ? 'bg-red-50 border-error text-error ring-2 ring-error/20'
                      : 'border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-error">cancel</span>
                  <span>Missed Class</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant bg-surface-container-low p-3 rounded-xl leading-relaxed">
              💡 Logging a class will immediately recalculate your aggregate attendance and update your
              attendance snapshot on My Day.
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setQuickActionOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-primary text-on-primary hover:bg-primary-container rounded-lg shadow-sm"
              >
                Log Attendance
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Propose Event */}
        {activeTab === 'event' && (
          <form onSubmit={handleProposeEvent} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={evtTitle}
                onChange={(e) => setEvtTitle(e.target.value)}
                placeholder="e.g. Autonomous Drones Exhibition 2025"
                className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Category *</label>
                <select
                  value={evtCategory}
                  onChange={(e) => setEvtCategory(e.target.value as EventCategory)}
                  className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
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
                <label className="block text-xs font-bold text-on-surface mb-1">Venue *</label>
                <input
                  type="text"
                  required
                  value={evtVenue}
                  onChange={(e) => setEvtVenue(e.target.value)}
                  placeholder="e.g. Auditorium Hall 1"
                  className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Event Date *</label>
                <input
                  type="date"
                  required
                  value={evtDate}
                  onChange={(e) => setEvtDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Start Time *</label>
                <input
                  type="text"
                  required
                  value={evtTime}
                  onChange={(e) => setEvtTime(e.target.value)}
                  placeholder="e.g. 02:00 PM"
                  className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Description</label>
              <textarea
                rows={2}
                value={evtDesc}
                onChange={(e) => setEvtDesc(e.target.value)}
                placeholder="Provide event overview, guest speakers, and eligibility..."
                className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setQuickActionOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold bg-primary text-on-primary hover:bg-primary-container rounded-lg shadow-sm"
              >
                Publish Event
              </button>
            </div>
          </form>
        )}

        {/* Tab 4: Lost & Found Report */}
        {activeTab === 'lost_found' && (
          <form onSubmit={handleReportItem} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Report Type *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setLfType('lost')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    lfType === 'lost'
                      ? 'bg-red-50 border-error text-error'
                      : 'border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">search</span>
                  <span>I Lost an Item</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLfType('found')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                    lfType === 'found'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'border-outline-variant/40 text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
                  <span>I Found an Item</span>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Item Title *</label>
              <input
                type="text"
                required
                value={lfTitle}
                onChange={(e) => setLfTitle(e.target.value)}
                placeholder={lfType === 'lost' ? 'e.g. Black AirPods Pro Case' : 'e.g. TI-84 Plus Graphing Calculator'}
                className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Category *</label>
                <select
                  value={lfCategory}
                  onChange={(e) => setLfCategory(e.target.value as ItemCategory)}
                  className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="Electronics">Electronics</option>
                  <option value="ID Cards">ID Cards</option>
                  <option value="Bags">Bags & Backpacks</option>
                  <option value="Books & Stationery">Books & Stationery</option>
                  <option value="Keys">Keys</option>
                  <option value="Wallets">Wallets</option>
                  <option value="Clothing & Accessories">Clothing</option>
                  <option value="Other">Other Belongings</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Campus Zone *</label>
                <select
                  value={lfZone}
                  onChange={(e) => setLfZone(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="library">Main Library</option>
                  <option value="cs_block">Computer Science Building</option>
                  <option value="student_union">Student Union & Cafeteria</option>
                  <option value="science_quad">Science Quad</option>
                  <option value="sports_pavilion">Sports Pavilion</option>
                  <option value="auditorium">University Auditorium</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Specific Location Details *
              </label>
              <input
                type="text"
                required
                value={lfLocation}
                onChange={(e) => setLfLocation(e.target.value)}
                placeholder="e.g. 2nd Floor Study Desks, near window #4"
                className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">
                Description & Verification Clues
              </label>
              <textarea
                rows={2}
                value={lfDesc}
                onChange={(e) => setLfDesc(e.target.value)}
                placeholder="Describe identifying marks (keep secret details for claim verification)..."
                className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={() => setQuickActionOpen(false)}
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
        )}
      </div>
    </div>
  );
}
