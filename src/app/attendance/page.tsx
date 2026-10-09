'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';

export default function AttendancePage() {
  const {
    subjects,
    recordAttendance,
    addSubject,
    deleteSubject,
    calculateMissableClasses,
    calculateRequiredClasses,
    getAggregateAttendance,
    showToast,
  } = useApp();

  const [globalTarget, setGlobalTarget] = useState(75);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Add subject modal state
  const [newSubName, setNewSubName] = useState('');
  const [newSubCode, setNewSubCode] = useState('');
  const [newSubConducted, setNewSubConducted] = useState(30);
  const [newSubAttended, setNewSubAttended] = useState(25);
  const [newSubTarget, setNewSubTarget] = useState(75);
  const [newSubInstructor, setNewSubInstructor] = useState('');
  const [newSubRoom, setNewSubRoom] = useState('');

  // Simulator state
  const [simulatorSubjectId, setSimulatorSubjectId] = useState<string>(subjects[0]?.id || '');
  const [simulatedMissed, setSimulatedMissed] = useState<number>(1);
  const [simulatedAttended, setSimulatedAttended] = useState<number>(0);

  const aggregate = getAggregateAttendance();

  // Selected subject for simulator
  const activeSimSubject = subjects.find((s) => s.id === simulatorSubjectId) || subjects[0];

  // Simulator calculations
  const simCurrentAttended = activeSimSubject?.attendedClasses || 0;
  const simCurrentTotal = activeSimSubject?.totalClasses || 0;
  const simTarget = activeSimSubject?.targetPercentage || globalTarget;

  const simProjectedAttended = simCurrentAttended + simulatedAttended;
  const simProjectedTotal = simCurrentTotal + simulatedAttended + simulatedMissed;
  const simProjectedPct =
    simProjectedTotal > 0 ? (simProjectedAttended / simProjectedTotal) * 100 : 0;
  const simCurrentPct =
    simCurrentTotal > 0 ? (simCurrentAttended / simCurrentTotal) * 100 : 0;

  const simIsSafe = simProjectedPct >= simTarget;

  // SVG Radial circle calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // 263.89
  const offset = circumference - (aggregate.percentage / 100) * circumference;

  const handleAddSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName.trim() || !newSubCode.trim()) return;
    if (newSubAttended > newSubConducted) {
      alert('Classes attended cannot exceed total classes conducted.');
      return;
    }
    addSubject({
      code: newSubCode.toUpperCase(),
      name: newSubName,
      attendedClasses: Number(newSubAttended),
      totalClasses: Number(newSubConducted),
      targetPercentage: Number(newSubTarget),
      instructor: newSubInstructor || 'Department Faculty',
      room: newSubRoom || 'Academic Hall',
      schedule: 'Mon, Wed · 10:00 AM',
    });
    setIsAddModalOpen(false);
    setNewSubName('');
    setNewSubCode('');
  };

  return (
    <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-md">
      <div className="flex flex-col w-full gap-space-lg pb-space-xl">
        {/* Top Level Context / KPI Metric Banner */}
        <section className="relative w-full rounded-xl bg-surface-container-lowest p-space-md md:p-space-lg shadow-sm border border-outline-variant/30 overflow-hidden">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-tertiary-fixed/15 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-space-lg">
            {/* Main Metric Summary Left */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-lg">
              {/* Circular Progress Chart Graphic */}
              <div className="relative w-28 h-28 flex-shrink-0 flex items-center justify-center">
                <svg aria-hidden="true" className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
                  <circle
                    className="text-surface-container"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="8"
                  ></circle>
                  <circle
                    className="text-primary transition-all duration-700 ease-out"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r={radius}
                    stroke="currentColor"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    strokeWidth="8"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="font-stat-counter text-xl font-bold text-primary leading-none">
                    {aggregate.percentage}%
                  </span>
                  <span className="font-label-xs text-[10px] text-on-surface-variant uppercase tracking-wider mt-0.5 font-bold">
                    Aggregate
                  </span>
                </div>
              </div>

              {/* Metric Details & Threshold Status */}
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-space-xs">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-label-xs text-xs uppercase tracking-wide font-bold ${
                      aggregate.percentage >= globalTarget
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-red-100 text-error'
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        aggregate.percentage >= globalTarget ? 'bg-emerald-600' : 'bg-error'
                      }`}
                    ></span>
                    Standing: {aggregate.status} &amp;{' '}
                    {aggregate.percentage >= globalTarget ? 'Eligible' : 'Below Target'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-xs text-xs font-semibold">
                    <span className="material-symbols-outlined text-[14px]">school</span>
                    {subjects.length} Enrolled Courses
                  </span>
                </div>
                <h1 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
                  Academic Attendance Calculator &amp; Simulator
                </h1>
                <p className="font-body-sm text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  Aggregated tally:{' '}
                  <span className="font-bold text-on-surface">{aggregate.attended} attended</span> of{' '}
                  <span className="font-bold text-on-surface">{aggregate.conducted} sessions</span>{' '}
                  conducted. Minimum target is{' '}
                  <span className="font-bold text-primary">{globalTarget}%</span>.
                </p>
              </div>
            </div>

            {/* Target Config & Action Badge Right */}
            <div className="flex flex-wrap items-center gap-space-md lg:justify-end">
              <div className="bg-surface-container-low p-space-sm rounded-xl flex items-center gap-3 shadow-xs border border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="font-label-xs text-[11px] text-on-surface-variant font-medium">
                    Department Baseline
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                    <span className="font-headline-md text-lg font-bold text-on-surface">
                      {globalTarget}.0%
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newT = prompt('Set default college attendance target percentage (50-95):', String(globalTarget));
                    if (newT && !isNaN(Number(newT))) {
                      const val = Math.min(95, Math.max(50, Number(newT)));
                      setGlobalTarget(val);
                      showToast('Target Updated', `Minimum attendance goal set to ${val}%.`, 'info');
                    }
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">tune</span>
                  <span>Adjust</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs sm:text-sm px-4 py-2 rounded-xl transition-all shadow-sm font-semibold active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                <span>Add Subject</span>
              </button>
            </div>
          </div>
        </section>

        {/* Main Content Layout Grid: 8 cols Courses / 4 cols Simulator */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* Left Column: Course Cards Trackers */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-space-md">
            <div className="flex items-center justify-between pb-1">
              <div>
                <h2 className="font-headline-md text-lg font-bold text-on-surface">
                  Enrolled Subjects &amp; Thresholds
                </h2>
                <p className="font-body-sm text-xs text-on-surface-variant">
                  Mathematical allowable cuts, consecutive attendance, and single-click class logging.
                </p>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-on-surface-variant font-label-xs text-xs bg-surface-container-low px-3 py-1 rounded-lg border border-outline-variant/20">
                <span className="material-symbols-outlined text-[16px] text-primary">analytics</span>
                <span>Predictive Engine Active</span>
              </div>
            </div>

            {/* Course Cards List */}
            {subjects.map((sub) => {
              const attended = sub.attendedClasses;
              const total = sub.totalClasses;
              const target = sub.targetPercentage || globalTarget;
              const percentage = total > 0 ? (attended / total) * 100 : 0;
              const missable = calculateMissableClasses(attended, total, target);
              const required = calculateRequiredClasses(attended, total, target);
              const isAbove = percentage >= target;

              return (
                <div
                  key={sub.id}
                  className="relative rounded-xl bg-surface-container-lowest p-space-md md:p-space-lg shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30"
                >
                  {/* Left accent strip */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${
                      percentage < target
                        ? 'bg-error'
                        : percentage - target <= 2
                        ? 'bg-amber-500'
                        : 'bg-primary-container'
                    }`}
                  ></div>

                  <div className="flex flex-col gap-space-sm pl-1">
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-space-xs">
                      <div className="flex items-center gap-space-xs">
                        <span className="px-2 py-0.5 rounded bg-surface-container text-primary font-mono text-xs font-bold">
                          {sub.code}
                        </span>
                        <h3 className="font-title-sm text-sm sm:text-base font-bold text-on-surface">
                          {sub.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-label-xs text-xs font-bold ${
                            isAbove
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isAbove ? 'bg-emerald-600' : 'bg-red-600'
                            }`}
                          ></span>
                          {isAbove ? 'Above Target' : 'Below Target'}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove subject "${sub.name}" from tracker?`)) {
                              deleteSubject(sub.id);
                            }
                          }}
                          className="text-on-surface-variant hover:text-error p-1 rounded hover:bg-surface-container transition-colors"
                          title="Remove course"
                        >
                          <span className="material-symbols-outlined text-[17px]">delete</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-on-surface-variant flex items-center gap-3">
                      <span>{sub.instructor}</span>
                      <span>•</span>
                      <span>{sub.room}</span>
                      <span>•</span>
                      <span>{sub.schedule}</span>
                    </div>

                    {/* Progress Bar & Counts */}
                    <div className="flex flex-col gap-1.5 my-1">
                      <div className="flex justify-between items-baseline font-body-sm text-xs sm:text-sm">
                        <span className="text-on-surface font-medium">
                          <strong className="font-bold text-primary">{attended}</strong> of{' '}
                          <span className="font-bold">{total}</span> Classes Attended
                        </span>
                        <span className="font-headline-md text-base sm:text-lg font-bold text-on-surface">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-surface-container overflow-hidden flex">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percentage < target
                              ? 'bg-error'
                              : percentage - target <= 2
                              ? 'bg-amber-500'
                              : 'bg-primary-container'
                          }`}
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Cushion / Consecutive Requirement Narrative */}
                    <div
                      className={`p-3 rounded-xl flex items-start gap-2.5 text-on-surface border ${
                        isAbove
                          ? 'bg-surface-container-low border-outline-variant/30'
                          : 'bg-red-50/70 border-error/20'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[20px] shrink-0 mt-0.5 ${
                          isAbove ? 'text-tertiary' : 'text-error'
                        }`}
                      >
                        {isAbove ? 'event_available' : 'warning'}
                      </span>
                      <div className="flex flex-col text-xs leading-relaxed">
                        <span className="font-bold text-on-surface">
                          {isAbove
                            ? missable > 0
                              ? `You can safely miss ${missable} upcoming ${
                                  missable === 1 ? 'class' : 'classes'
                                } and stay ≥ ${target}.0%!`
                              : `0 missable classes remaining. Any absence drops you below ${target}%.`
                            : `Attend the next ${required} consecutive ${
                                required === 1 ? 'class' : 'classes'
                              } to reach ${target}.0%.`}
                        </span>
                        <span className="text-on-surface-variant text-[11px] mt-0.5">
                          {isAbove && missable > 0 && (
                            <>
                              Margin verification: {attended}/{total + missable} ={' '}
                              {((attended / (total + missable)) * 100).toFixed(1)}% (Safe), whereas{' '}
                              {attended}/{total + missable + 1} ={' '}
                              {((attended / (total + missable + 1)) * 100).toFixed(1)}% (Below Target).
                            </>
                          )}
                          {!isAbove && (
                            <>
                              Recovery verification: ({attended} + {required}) / ({total} + {required}) ={' '}
                              {(((attended + required) / (total + required)) * 100).toFixed(1)}%.
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Quick Action Controls */}
                    <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20">
                      <span className="font-label-xs text-xs text-on-surface-variant">
                        Log today&apos;s session:
                      </span>
                      <div className="flex items-center gap-space-xs">
                        <button
                          type="button"
                          onClick={() => recordAttendance(sub.id, 'attended')}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-emerald-600 hover:text-white text-on-surface font-label-xs text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">add_circle</span>
                          <span>+ Attended</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => recordAttendance(sub.id, 'missed')}
                          className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-error hover:text-white text-on-surface font-label-xs text-xs font-bold transition-all flex items-center gap-1 active:scale-95 shadow-xs"
                        >
                          <span className="material-symbols-outlined text-[16px]">cancel</span>
                          <span>+ Missed</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSimulatorSubjectId(sub.id);
                            window.scrollTo({ top: 300, behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-primary-container hover:text-white text-primary text-xs font-bold transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">science</span>
                          <span>Simulate</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Interactive Attendance Simulator */}
          <div className="lg:col-span-5 xl:col-span-4 sticky top-36 space-y-space-md">
            <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30 space-y-space-md">
              <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/30">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">science</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-base font-bold text-on-surface">
                      Attendance Simulator
                    </h3>
                    <span className="font-label-xs text-[11px] text-on-surface-variant">
                      Predict future outcomes
                    </span>
                  </div>
                </div>
                <span className="font-label-xs text-[11px] bg-primary-container text-white px-2 py-0.5 rounded-full font-bold">
                  Interactive
                </span>
              </div>

              {/* Subject Selector for Simulator */}
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">
                  Choose Course to Simulate
                </label>
                <select
                  value={simulatorSubjectId}
                  onChange={(e) => setSimulatorSubjectId(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-surface-container-low rounded-xl border border-outline-variant/40 focus:ring-2 focus:ring-primary outline-none cursor-pointer"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code}: {s.name} ({s.attendedClasses}/{s.totalClasses})
                    </option>
                  ))}
                </select>
              </div>

              {/* Projection Card */}
              <div
                className={`p-4 rounded-xl border transition-all ${
                  simIsSafe
                    ? 'bg-surface-container-low border-emerald-500/30'
                    : 'bg-red-50 border-error/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs text-on-surface-variant mb-1">
                  <span>Current Attendance</span>
                  <span className="font-bold text-on-surface">{simCurrentPct.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">Simulated Projection</span>
                  <span
                    className={`font-stat-counter text-2xl font-black ${
                      simIsSafe ? 'text-emerald-700' : 'text-error'
                    }`}
                  >
                    {simProjectedPct.toFixed(1)}%
                  </span>
                </div>

                <div className="mt-2 w-full h-2 rounded-full bg-surface-container overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      simIsSafe ? 'bg-emerald-600' : 'bg-error'
                    }`}
                    style={{ width: `${Math.min(100, simProjectedPct)}%` }}
                  ></div>
                </div>

                <div className="mt-2 text-[11px] font-semibold text-center">
                  {simIsSafe ? (
                    <span className="text-emerald-800 flex items-center justify-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      Above {simTarget}% threshold by +{(simProjectedPct - simTarget).toFixed(1)}%
                    </span>
                  ) : (
                    <span className="text-error flex items-center justify-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[14px]">warning</span>
                      Drops below target by {(simTarget - simProjectedPct).toFixed(1)}% (Debarment
                      Risk)
                    </span>
                  )}
                </div>
              </div>

              {/* Simulation Sliders */}
              <div className="space-y-4 pt-1">
                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-on-surface flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-error">cancel</span>
                      What if I miss the next classes?
                    </span>
                    <span className="text-error font-mono bg-red-100 px-2 py-0.5 rounded">
                      {simulatedMissed} {simulatedMissed === 1 ? 'class' : 'classes'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={simulatedMissed}
                    onChange={(e) => setSimulatedMissed(Number(e.target.value))}
                    className="w-full accent-error cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                    <span>0</span>
                    <span>5</span>
                    <span>10 classes</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center text-xs font-bold mb-1">
                    <span className="text-on-surface flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px] text-emerald-600">
                        add_circle
                      </span>
                      What if I attend additional classes?
                    </span>
                    <span className="text-emerald-700 font-mono bg-emerald-100 px-2 py-0.5 rounded">
                      +{simulatedAttended} {simulatedAttended === 1 ? 'class' : 'classes'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={simulatedAttended}
                    onChange={(e) => setSimulatedAttended(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-on-surface-variant font-mono">
                    <span>0</span>
                    <span>7</span>
                    <span>15 classes</span>
                  </div>
                </div>
              </div>

              {/* Reset simulator */}
              <button
                type="button"
                onClick={() => {
                  setSimulatedMissed(0);
                  setSimulatedAttended(0);
                }}
                className="w-full py-1.5 bg-surface-container hover:bg-surface-container-high text-xs font-bold text-on-surface rounded-lg transition-colors"
              >
                Reset Simulator Inputs
              </button>

              {/* Institutional Disclaimer */}
              <div className="p-3 bg-surface-container-low rounded-xl text-[11px] text-on-surface-variant leading-relaxed border border-outline-variant/20">
                <div className="flex items-center gap-1 text-on-surface font-bold mb-0.5">
                  <span className="material-symbols-outlined text-[14px] text-primary">policy</span>
                  <span>Planning Disclaimer</span>
                </div>
                Predictions are estimated strictly from student-entered logs. Official eligibility
                depends on university rules, lab exemptions, medical leaves, and college registrar
                criteria.
              </div>
            </div>
          </div>
        </div>

        {/* Add Subject Modal */}
        {isAddModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setIsAddModalOpen(false)}
          >
            <div
              className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/40 p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/30">
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  Add New Academic Subject
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              <form onSubmit={handleAddSubjectSubmit} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1">Subject Name *</label>
                  <input
                    type="text"
                    required
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    placeholder="e.g. Operating Systems &amp; Kernels"
                    className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Course Code *</label>
                    <input
                      type="text"
                      required
                      value={newSubCode}
                      onChange={(e) => setNewSubCode(e.target.value)}
                      placeholder="e.g. CS-304"
                      className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary uppercase font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Target %</label>
                    <input
                      type="number"
                      min="50"
                      max="100"
                      value={newSubTarget}
                      onChange={(e) => setNewSubTarget(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Total Classes Conducted *
                    </label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newSubConducted}
                      onChange={(e) => setNewSubConducted(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">
                      Classes Attended *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={newSubConducted}
                      required
                      value={newSubAttended}
                      onChange={(e) => setNewSubAttended(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Instructor</label>
                    <input
                      type="text"
                      value={newSubInstructor}
                      onChange={(e) => setNewSubInstructor(e.target.value)}
                      placeholder="e.g. Prof. Dennis Ritchie"
                      className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface mb-1">Room / Hall</label>
                    <input
                      type="text"
                      value={newSubRoom}
                      onChange={(e) => setNewSubRoom(e.target.value)}
                      placeholder="e.g. Hall 401"
                      className="w-full px-3 py-2 text-sm bg-surface-container-low rounded-lg border border-outline-variant/40 outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-bold bg-primary text-on-primary hover:bg-primary-container rounded-lg shadow-sm"
                  >
                    Add Subject
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
