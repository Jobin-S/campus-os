'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function MyDayPage() {
  const router = useRouter();
  const {
    userProfile,
    classes,
    assignments,
    subjects,
    events,
    lostFoundItems,
    toggleAssignmentComplete,
    recordAttendance,
    setQuickActionOpen,
    getAggregateAttendance,
    showToast,
  } = useApp();

  const aggregate = getAggregateAttendance();

  // Metrics
  const pendingAssignments = assignments.filter((a) => a.status !== 'completed');
  const completedTodayAssignments = assignments.filter((a) => a.status === 'completed');
  const todayDueAssignments = pendingAssignments.filter((a) => a.dueDate <= '2025-10-12');
  const savedEvents = events.filter((e) => e.isSaved);
  const lowestSubject = [...subjects].sort((a, b) => {
    const pctA = (a.attendedClasses / a.totalClasses) * 100;
    const pctB = (b.attendedClasses / b.totalClasses) * 100;
    return pctA - pctB;
  })[0];

  const lowestSubjectPct = lowestSubject
    ? ((lowestSubject.attendedClasses / lowestSubject.totalClasses) * 100).toFixed(1)
    : '0';

  // SVG Radial circle calculation
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // 263.89
  const offset = circumference - (aggregate.percentage / 100) * circumference;

  return (
    <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-md">
      <div className="flex flex-col w-full gap-space-lg pb-space-xl">
        {/* 1. Greeting Banner with Organic Ambient Glow */}
        <section className="relative overflow-hidden rounded-xl bg-surface-container-low p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30">
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-container/10 blur-3xl pointer-events-none"></div>
          <div className="absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-tertiary-fixed/15 blur-2xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-space-md">
            <div className="space-y-space-xs">
              <div className="flex items-center gap-space-xs text-on-surface-variant font-label-xs text-label-xs uppercase tracking-wider">
                <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
                <span>Monday, October 12, 2025</span>
                <span className="text-outline-variant">•</span>
                <span className="font-label-xs text-primary font-bold">
                  Academic Week {userProfile.academicWeek}
                </span>
              </div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-extrabold">
                Good morning, {userProfile.name.split(' ')[0]}! ☀️
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
                You have{' '}
                <span className="font-title-sm text-primary font-bold">
                  {pendingAssignments.length} assignments pending
                </span>{' '}
                and{' '}
                <span className="font-title-sm text-primary font-bold">
                  {savedEvents.length || 1} campus event
                </span>{' '}
                scheduled today. Next lecture starts in 25 minutes.
              </p>
            </div>

            <div className="flex items-center gap-space-xs flex-wrap">
              <div className="flex items-center bg-surface-container-lowest px-space-md py-space-xs rounded-xl shadow-sm border border-outline-variant/30">
                <div className="flex flex-col">
                  <span className="font-label-xs text-label-xs text-on-surface-variant font-medium">
                    Focus Metric
                  </span>
                  <span className="font-title-sm text-title-sm text-tertiary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">trending_up</span> On Track
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setQuickActionOpen(true)}
                className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md px-space-md py-space-sm rounded-xl shadow-sm transition-all flex items-center gap-space-xs active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Quick Log</span>
              </button>
            </div>
          </div>
        </section>

        {/* 2. Daily Priority Row (3 Urgent Alert Cards) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
          {/* Priority Card 1: Urgent Deadline */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/30">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500 rounded-l-xl"></div>
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 font-label-xs text-label-xs px-2 py-0.5 rounded-full font-bold">
                  <span className="material-symbols-outlined text-[14px]">alarm</span> Due Today
                </span>
                <span className="font-label-xs text-label-xs text-on-surface-variant font-mono font-semibold">
                  {todayDueAssignments[0]?.courseCode || 'CS-302'}
                </span>
              </div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mb-1 line-clamp-1">
                {todayDueAssignments[0]?.title || 'DBMS Relational Algebra Lab'}
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant mb-space-sm line-clamp-2">
                {todayDueAssignments[0]?.description ||
                  'Complete relational calculus queries and soft copy submission via student portal.'}
              </p>
            </div>
            <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/20">
              <span className="font-label-xs text-[11px] text-amber-700 font-bold">
                15% Final Grade
              </span>
              <Link
                href="/assignments"
                className="bg-primary-container hover:bg-primary text-on-primary font-label-md text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-semibold"
              >
                <span>Submit / View</span>
                <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Priority Card 2: Attendance Warning */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/30">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-error rounded-l-xl"></div>
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 font-label-xs text-label-xs px-2 py-0.5 rounded-full font-bold">
                  <span className="material-symbols-outlined text-[14px]">warning</span> Attendance Risk
                </span>
                <span className="font-label-xs text-label-xs text-on-surface-variant font-mono font-semibold">
                  {lowestSubject?.code || 'MATH-201'}
                </span>
              </div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mb-1">
                {lowestSubject?.name || 'Calculus'}: {lowestSubjectPct}%
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant mb-space-sm">
                Target is {lowestSubject?.targetPercentage || 75}%. Currently at risk.{' '}
                <strong className="text-error font-semibold">
                  {Number(lowestSubjectPct) < 75
                    ? `Must attend next classes`
                    : `Only 1 allowable cut remaining`}
                </strong>
                .
              </p>
            </div>
            <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/20">
              <span className="font-label-xs text-[11px] text-on-surface-variant">
                Next: {lowestSubject?.schedule.split('·')[0] || 'Wed'}
              </span>
              <Link
                href="/attendance"
                className="bg-surface-container-high hover:bg-surface-container-highest text-primary font-label-md text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-semibold"
              >
                <span className="material-symbols-outlined text-[15px]">tune</span>
                <span>Open Simulator</span>
              </Link>
            </div>
          </div>

          {/* Priority Card 3: Saved Event Today */}
          <div className="relative overflow-hidden rounded-xl bg-surface-container-lowest p-space-md shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between border border-outline-variant/30">
            <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary-container rounded-l-xl"></div>
            <div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="inline-flex items-center gap-1 bg-surface-container-high text-primary font-label-xs text-label-xs px-2 py-0.5 rounded-full font-bold">
                  <span className="material-symbols-outlined text-[14px]">groups</span> Confirmed RSVP
                </span>
                <span className="font-label-xs text-label-xs text-on-surface-variant font-semibold">
                  2:00 PM - 4:30 PM
                </span>
              </div>
              <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface mb-1 line-clamp-1">
                {events[1]?.title || 'Generative AI & LLMs in Production'}
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant mb-space-sm line-clamp-2">
                Hands-on masterclass with vector databases & RAG pipelines in Seminar Hall B.
              </p>
            </div>
            <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/20">
              <span className="font-label-xs text-[11px] text-on-surface-variant">
                Seminar Hall B
              </span>
              <Link
                href="/events"
                className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-semibold"
              >
                <span className="material-symbols-outlined text-[15px]">qr_code_2</span>
                <span>View Details</span>
              </Link>
            </div>
          </div>
        </section>

        {/* 3. Main Academic Grid (2-Column Architecture) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg">
          {/* Left Column: Class Schedule & Priority Tasks (8 cols) */}
          <div className="lg:col-span-8 space-y-space-lg">
            {/* Schedule Section */}
            <section className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>
                  </div>
                  <div>
                    <h2 className="font-headline-lg text-lg sm:text-xl font-bold text-on-surface">
                      Today&apos;s Class Schedule
                    </h2>
                    <span className="font-label-xs text-label-xs text-on-surface-variant">
                      {classes.length} lectures scheduled · Total 4h 30m contact hours
                    </span>
                  </div>
                </div>
                <Link
                  href="/attendance"
                  className="font-label-md text-xs sm:text-sm text-primary hover:text-primary-container flex items-center gap-1 font-semibold"
                >
                  <span>Attendance Record</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Link>
              </div>

              {/* Schedule Timeline Cards */}
              <div className="space-y-space-sm">
                {classes.map((cls, idx) => {
                  const subjectMatch = subjects.find((s) => s.code === cls.code);
                  return (
                    <div
                      key={cls.id}
                      className={`relative rounded-xl p-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-sm transition-all border border-outline-variant/20 ${
                        idx === 1
                          ? 'bg-surface-container-low hover:bg-surface-container ring-1 ring-primary/20'
                          : 'bg-surface-container-lowest hover:bg-surface-container-low'
                      }`}
                    >
                      <div className="flex items-start gap-space-md">
                        <div className="flex flex-col items-center justify-center bg-surface-container-low px-3 py-2 rounded-xl text-center min-w-[80px] shadow-xs">
                          <span className="font-label-xs text-[10px] text-on-surface-variant uppercase font-bold">
                            {idx === 0 ? 'COMPLETED' : idx === 1 ? 'LIVE' : 'UPCOMING'}
                          </span>
                          <span className="font-title-sm text-sm text-primary font-bold">
                            {cls.time.split(' - ')[0]}
                          </span>
                          <span className="font-label-xs text-[10px] text-on-surface-variant">
                            {cls.time.split(' - ')[1]}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-space-xs flex-wrap">
                            <span className="font-headline-md text-sm sm:text-base font-bold text-on-surface">
                              {cls.subject}
                            </span>
                            {idx === 1 && (
                              <span className="bg-primary text-on-primary font-label-xs text-[10px] px-2 py-0.5 rounded-full font-bold animate-pulse">
                                In Progress
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-space-md text-on-surface-variant font-body-sm text-xs flex-wrap">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px] text-primary">
                                location_on
                              </span>{' '}
                              {cls.room}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[15px] text-secondary">
                                person
                              </span>{' '}
                              {cls.instructor}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-space-xs self-end md:self-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (subjectMatch) {
                              recordAttendance(subjectMatch.id, 'attended');
                            } else {
                              showToast('Logged Attended', `Class marked attended for ${cls.code}.`, 'success');
                            }
                          }}
                          className="bg-surface-container-lowest text-tertiary hover:bg-tertiary hover:text-on-tertiary font-label-md text-xs px-3 py-1.5 rounded-lg shadow-sm transition-colors flex items-center gap-1 border border-outline-variant/30 font-semibold"
                        >
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          <span>Mark Attended</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Academic Tasks & Milestones Section */}
            <section className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">task_alt</span>
                  </div>
                  <div>
                    <h2 className="font-headline-lg text-lg sm:text-xl font-bold text-on-surface">
                      Academic Tasks &amp; Milestones
                    </h2>
                    <span className="font-label-xs text-label-xs text-on-surface-variant">
                      {pendingAssignments.length} pending · {completedTodayAssignments.length} completed
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickActionOpen(true)}
                  className="bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-xs sm:text-sm px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 font-semibold"
                >
                  <span className="material-symbols-outlined text-[17px]">add</span>
                  <span>Add Task</span>
                </button>
              </div>

              {/* Task Checklist Group */}
              <div className="space-y-space-xs">
                {assignments.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className={`p-space-md rounded-xl flex items-center justify-between gap-space-md transition-all border border-outline-variant/20 ${
                      task.status === 'completed'
                        ? 'bg-surface-container-low/60 opacity-60'
                        : 'bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-space-md min-w-0">
                      <input
                        type="checkbox"
                        checked={task.status === 'completed'}
                        onChange={() => toggleAssignmentComplete(task.id)}
                        className="w-5 h-5 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-space-xs flex-wrap">
                          <span
                            className={`font-title-sm text-sm font-semibold text-on-surface truncate ${
                              task.status === 'completed' ? 'line-through text-on-surface-variant' : ''
                            }`}
                          >
                            {task.title}
                          </span>
                          <span
                            className={`font-label-xs text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              task.dueDate <= '2025-10-12'
                                ? 'bg-amber-100 text-amber-900'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {task.dueDate <= '2025-10-12' ? 'Due Today' : `Due ${task.dueDate}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-xs mt-0.5">
                          <span className="font-mono">{task.courseCode}</span>
                          <span>•</span>
                          <span>Progress: {task.progress}%</span>
                          <span>•</span>
                          <span>{task.checklist.length} subtasks</span>
                        </div>
                      </div>
                    </div>
                    <Link
                      href="/assignments"
                      className="material-symbols-outlined text-outline text-[20px] hover:text-primary transition-colors p-1"
                    >
                      chevron_right
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Analytics & Campus Hub Widgets (4 cols) */}
          <div className="lg:col-span-4 space-y-space-lg">
            {/* Attendance Health Snapshot Card */}
            <section className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">donut_large</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-base font-bold text-on-surface">
                      Attendance Health
                    </h3>
                    <span className="font-label-xs text-[11px] text-on-surface-variant">
                      Department Target: 75%
                    </span>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1 font-label-xs text-[11px] px-2 py-0.5 rounded-full font-bold ${
                    aggregate.percentage >= 75
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {aggregate.status}
                </span>
              </div>

              {/* Radial Gauge & Metric Breakdown */}
              <div className="flex flex-col items-center justify-center py-space-sm">
                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle
                      className="text-surface-container"
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="8"
                    />
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
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="font-stat-counter text-2xl font-extrabold text-on-surface tracking-tight leading-none">
                      {aggregate.percentage}%
                    </span>
                    <span className="font-label-xs text-[11px] text-on-surface-variant mt-1 font-medium">
                      Aggregate
                    </span>
                  </div>
                </div>
                <p className="font-body-sm text-xs text-center text-on-surface-variant mt-space-sm leading-relaxed">
                  {aggregate.missableClasses > 0 ? (
                    <>
                      You can safely miss{' '}
                      <strong className="text-on-surface font-bold">
                        {aggregate.missableClasses} more classes
                      </strong>{' '}
                      across semester courses while staying at/above 75%.
                    </>
                  ) : (
                    <>
                      You must attend{' '}
                      <strong className="text-error font-bold">
                        {aggregate.requiredClasses} consecutive classes
                      </strong>{' '}
                      to reach the 75% eligibility target.
                    </>
                  )}
                </p>
              </div>

              {/* Per-course compact pills */}
              <div className="space-y-space-xs mt-space-md pt-space-sm bg-surface-container-low p-2 rounded-xl border border-outline-variant/20">
                {subjects.slice(0, 3).map((sub) => {
                  const pct = ((sub.attendedClasses / sub.totalClasses) * 100).toFixed(1);
                  const isSafe = Number(pct) >= 75;
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-surface-container-lowest"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            isSafe ? 'bg-emerald-500' : 'bg-red-500'
                          }`}
                        ></span>
                        <span className="font-label-md text-xs font-semibold text-on-surface truncate max-w-[150px]">
                          {sub.code} ({sub.name.split(' ')[0]})
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span
                          className={`font-title-sm text-xs font-bold ${
                            isSafe ? 'text-emerald-700' : 'text-error'
                          }`}
                        >
                          {pct}%
                        </span>
                        <span
                          className={`material-symbols-outlined text-[15px] ${
                            isSafe ? 'text-emerald-600' : 'text-error'
                          }`}
                        >
                          {isSafe ? 'check_circle' : 'warning'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                href="/attendance"
                className="w-full mt-space-md bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-xs py-2 rounded-xl transition-colors flex items-center justify-center gap-1 font-semibold"
              >
                <span>Detailed Attendance Simulator</span>
                <span className="material-symbols-outlined text-[16px]">calculate</span>
              </Link>
            </section>

            {/* Campus Events Teaser Card */}
            <section className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">celebration</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-base font-bold text-on-surface">
                      Upcoming Events
                    </h3>
                    <span className="font-label-xs text-[11px] text-on-surface-variant">
                      Campus life &amp; hackathons
                    </span>
                  </div>
                </div>
                <Link href="/events" className="font-label-xs text-xs text-primary font-bold hover:underline">
                  Explore
                </Link>
              </div>

              {/* Featured Event Visual Card */}
              <div className="relative rounded-xl overflow-hidden bg-surface-container-low mb-space-sm border border-outline-variant/20">
                <div className="relative h-28 w-full bg-slate-800">
                  <img
                    src={events[0]?.imageUrl}
                    alt={events[0]?.title}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <span className="absolute top-2 right-2 bg-primary text-on-primary font-label-xs text-[10px] px-2 py-0.5 rounded-full font-bold shadow">
                    Oct 20 · 10:00 AM
                  </span>
                </div>
                <div className="p-space-sm space-y-1">
                  <h4 className="font-title-sm text-xs sm:text-sm font-bold text-on-surface line-clamp-1">
                    {events[0]?.title}
                  </h4>
                  <p className="font-body-sm text-xs text-on-surface-variant line-clamp-1">
                    {events[0]?.venue} · {events[0]?.organizer}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-label-xs text-[11px] text-tertiary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">confirmation_number</span>
                      {events[0]?.isRegistered ? 'RSVP Confirmed' : 'Registration Open'}
                    </span>
                    <Link
                      href="/events"
                      className="font-label-xs text-xs text-primary font-bold hover:underline"
                    >
                      Details &gt;
                    </Link>
                  </div>
                </div>
              </div>

              {/* Second Event Listing */}
              <div className="p-space-sm rounded-xl bg-surface-container-low flex items-center justify-between gap-space-sm border border-outline-variant/20">
                <div>
                  <span className="font-label-xs text-[10px] bg-primary-container text-on-primary px-1.5 py-0.5 rounded font-bold">
                    Oct 25
                  </span>
                  <h5 className="font-title-sm text-xs font-bold text-on-surface mt-1 line-clamp-1">
                    {events[2]?.title}
                  </h5>
                  <span className="font-body-sm text-[11px] text-on-surface-variant">
                    {events[2]?.venue}
                  </span>
                </div>
                <Link
                  href="/events"
                  className="bg-surface-container-lowest hover:bg-surface-container text-on-surface font-label-xs text-xs px-3 py-1.5 rounded-lg shadow-xs transition-colors font-semibold"
                >
                  View
                </Link>
              </div>
            </section>

            {/* Recent Lost & Found Bulletin Widget */}
            <section className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30">
              <div className="flex items-center justify-between mb-space-md">
                <div className="flex items-center gap-space-xs">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined text-[20px]">find_in_page</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-base font-bold text-on-surface">
                      Campus Bulletin
                    </h3>
                    <span className="font-label-xs text-[11px] text-on-surface-variant">
                      Recent Lost &amp; Found
                    </span>
                  </div>
                </div>
                <Link
                  href="/lost-and-found"
                  className="font-label-xs text-xs text-primary font-bold hover:underline"
                >
                  All Posts
                </Link>
              </div>

              {/* Lost & Found Item */}
              <div className="rounded-xl bg-surface-container-low p-space-md space-y-space-xs border border-outline-variant/20">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 font-label-xs text-[10px] px-2 py-0.5 rounded-full font-bold">
                    <span className="material-symbols-outlined text-[13px]">check_box</span> FOUND ITEM
                  </span>
                  <span className="font-label-xs text-[11px] text-on-surface-variant">35 mins ago</span>
                </div>
                <div className="flex gap-space-sm pt-1">
                  <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-[24px]">headphones</span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-title-sm text-xs font-bold text-on-surface truncate">
                      {lostFoundItems[0]?.title}
                    </h4>
                    <p className="font-body-sm text-[11px] text-on-surface-variant line-clamp-1">
                      {lostFoundItems[0]?.location}
                    </p>
                    <div className="font-label-xs text-[11px] text-primary pt-0.5 font-medium">
                      Safe at {lostFoundItems[0]?.safeHandoverLocation?.split('(')[0]}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-space-xs border-t border-outline-variant/20">
                  <span className="font-label-xs text-[10px] text-on-surface-variant font-mono">
                    Ticket #LF-8492
                  </span>
                  <Link
                    href="/lost-and-found"
                    className="bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs px-3 py-1 rounded-lg transition-colors font-bold"
                  >
                    Claim Item
                  </Link>
                </div>
              </div>

              {/* Quick Post Action */}
              <div className="mt-space-sm flex items-center justify-between p- space-sm p-3 bg-surface-container-low rounded-xl text-on-surface-variant font-body-sm text-xs border border-outline-variant/20">
                <span>Lost something on campus?</span>
                <button
                  type="button"
                  onClick={() => setQuickActionOpen(true)}
                  className="font-label-md text-xs text-primary font-bold hover:underline"
                >
                  Report Missing Item
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Interactive FAB for mobile */}
        <div className="fixed bottom-6 right-6 z-40 md:hidden">
          <button
            type="button"
            onClick={() => setQuickActionOpen(true)}
            className="w-14 h-14 rounded-full bg-primary-container hover:bg-primary text-on-primary shadow-xl flex items-center justify-center transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[28px]">add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
