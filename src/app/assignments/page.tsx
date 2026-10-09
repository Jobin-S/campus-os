'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { Assignment, AssignmentPriority } from '@/types';

export default function AssignmentsPage() {
  const {
    assignments,
    subjects,
    toggleAssignmentComplete,
    toggleChecklistItem,
    deleteAssignment,
    updateAssignment,
    setQuickActionOpen,
    showToast,
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<'all' | 'due-today' | 'upcoming' | 'overdue' | 'completed'>('all');
  const [courseFilter, setCourseFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'high' | 'medium' | 'low'>('ALL');
  const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('detailed');
  const [selectedTaskId, setSelectedTaskId] = useState<string>(assignments[0]?.id || '');
  const [newSubtaskText, setNewSubtaskText] = useState('');

  // Selected task object
  const selectedTask = assignments.find((a) => a.id === selectedTaskId) || assignments[0];

  // Counts
  const counts = useMemo(() => {
    const today = '2025-10-12';
    const pending = assignments.filter((a) => a.status !== 'completed');
    const dueToday = assignments.filter((a) => a.status !== 'completed' && a.dueDate === today);
    const overdue = assignments.filter((a) => a.status !== 'completed' && a.dueDate < today);
    const completed = assignments.filter((a) => a.status === 'completed');
    return {
      all: assignments.length,
      pending: pending.length,
      dueToday: dueToday.length,
      upcoming: pending.filter((a) => a.dueDate > today).length,
      overdue: overdue.length,
      completed: completed.length,
    };
  }, [assignments]);

  // Filtered assignments
  const filteredAssignments = useMemo(() => {
    const today = '2025-10-12';
    return assignments.filter((item) => {
      // Status filter
      if (statusFilter === 'due-today' && (item.status === 'completed' || item.dueDate !== today)) return false;
      if (statusFilter === 'upcoming' && (item.status === 'completed' || item.dueDate <= today)) return false;
      if (statusFilter === 'overdue' && (item.status === 'completed' || item.dueDate >= today)) return false;
      if (statusFilter === 'completed' && item.status !== 'completed') return false;

      // Course filter
      if (courseFilter !== 'ALL' && item.courseCode !== courseFilter) return false;

      // Priority filter
      if (priorityFilter !== 'ALL' && item.priority !== priorityFilter) return false;

      return true;
    });
  }, [assignments, statusFilter, courseFilter, priorityFilter]);

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskText.trim() || !selectedTask) return;
    const newChecklist = [
      ...selectedTask.checklist,
      { id: `c-${Date.now()}`, text: newSubtaskText.trim(), completed: false },
    ];
    updateAssignment(selectedTask.id, { checklist: newChecklist });
    setNewSubtaskText('');
    showToast('Subtask Added', 'Checklist updated.', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-margin md:px-margin-md lg:px-margin-lg py-space-md">
      <div className="flex flex-col w-full gap-space-lg pb-space-xl">
        {/* Interactive Top Action & Breadcrumb Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium">
              <Link href="/" className="hover:text-primary">
                Dashboard
              </Link>
              <span>/</span>
              <span className="text-on-surface font-semibold">Academic Tasks</span>
            </div>
            <h1 className="font-headline-xl text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
              Assignments &amp; Deadlines
            </h1>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={() => setQuickActionOpen(true)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-primary hover:bg-primary-container text-on-primary font-label-md text-xs sm:text-sm px-4 py-2 rounded-xl transition-all shadow-sm font-semibold active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Create Assignment</span>
            </button>
          </div>
        </div>

        {/* Summary Metric Bento Strip */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-space-md">
          {/* Card 1: Pending Tasks */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex items-center justify-between group hover:shadow-md transition-shadow">
            <div>
              <span className="font-stat-counter text-3xl font-extrabold text-on-surface">
                {counts.pending}
              </span>
              <div className="font-label-md text-xs sm:text-sm text-on-surface-variant font-semibold">
                Pending Tasks
              </div>
              <span className="text-[11px] text-primary font-bold mt-1 inline-block">
                {counts.upcoming} upcoming this week
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">assignment</span>
            </div>
          </div>

          {/* Card 2: Due Today Urgent Countdown */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex items-center justify-between group hover:shadow-md transition-shadow">
            <div>
              <span className="font-stat-counter text-3xl font-extrabold text-amber-600">
                {counts.dueToday}
              </span>
              <div className="font-label-md text-xs sm:text-sm text-on-surface-variant font-semibold">
                Due Today
              </div>
              <span className="text-[11px] text-amber-700 font-bold mt-1 inline-block">
                DBMS Lab at 5:00 PM
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">alarm</span>
            </div>
          </div>

          {/* Card 3: Overdue Alert */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex items-center justify-between group hover:shadow-md transition-shadow">
            <div>
              <span className="font-stat-counter text-3xl font-extrabold text-error">
                {counts.overdue}
              </span>
              <div className="font-label-md text-xs sm:text-sm text-on-surface-variant font-semibold">
                Overdue Alert
              </div>
              <span className="text-[11px] text-error font-bold mt-1 inline-block">
                PHYS-102 (Submit ASAP)
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center text-error group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">error</span>
            </div>
          </div>

          {/* Card 4: Completed */}
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-outline-variant/30 flex items-center justify-between group hover:shadow-md transition-shadow">
            <div>
              <span className="font-stat-counter text-3xl font-extrabold text-tertiary">
                {counts.completed}
              </span>
              <div className="font-label-md text-xs sm:text-sm text-on-surface-variant font-semibold">
                Completed
              </div>
              <span className="text-[11px] text-tertiary font-bold mt-1 inline-block">
                100% on CS-308 Socket Lab
              </span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-tertiary group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
          </div>
        </section>

        {/* Interactive Controls: Filter Tabs, Course Dropdown & Priority Pills */}
        <section className="bg-surface-container-lowest rounded-xl p-space-sm md:p-space-md shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          {/* Filter Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
            {[
              { id: 'all', label: 'All Assignments', count: counts.all },
              { id: 'due-today', label: 'Due Today', count: counts.dueToday },
              { id: 'upcoming', label: 'Upcoming', count: counts.upcoming },
              { id: 'overdue', label: 'Overdue', count: counts.overdue },
              { id: 'completed', label: 'Completed', count: counts.completed },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? 'bg-surface-container-high text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold ${
                    statusFilter === tab.id
                      ? 'bg-surface-container-lowest text-primary'
                      : 'bg-surface-container text-on-surface-variant'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Secondary Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Course Selector */}
            <div className="relative">
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                className="appearance-none bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-xs sm:text-sm pl-3 pr-8 py-1.5 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
              >
                <option value="ALL">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.code}: {s.name.split(' ')[0]}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
                arrow_drop_down
              </span>
            </div>

            {/* Priority Pills Filter */}
            <div className="flex items-center bg-surface-container-low p-1 rounded-lg gap-1">
              <span className="text-[11px] font-bold text-on-surface-variant px-1.5 hidden sm:inline">
                Priority:
              </span>
              {(['ALL', 'high', 'medium', 'low'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriorityFilter(p)}
                  className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                    priorityFilter === p
                      ? 'bg-surface-container-lowest text-on-surface shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-lowest'
                  }`}
                >
                  {p === 'ALL' ? 'Any' : p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-surface-container-low p-1 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode('detailed')}
                className={`p-1 rounded ${
                  viewMode === 'detailed'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Detailed Cards"
              >
                <span className="material-symbols-outlined text-[18px]">view_agenda</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`p-1 rounded ${
                  viewMode === 'compact'
                    ? 'bg-surface-container-lowest text-primary shadow-xs'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
                title="Table Dense"
              >
                <span className="material-symbols-outlined text-[18px]">table_rows</span>
              </button>
            </div>
          </div>
        </section>

        {/* Main Grid: Task Workspace + Contextual Side Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
          {/* LEFT: Task Cards Area (8 cols on lg) */}
          <div className="lg:col-span-8 flex flex-col gap-space-sm">
            {filteredAssignments.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-xl p-12 text-center border border-outline-variant/30">
                <span className="material-symbols-outlined text-4xl text-outline mb-2">
                  fact_check
                </span>
                <h3 className="font-headline-md text-base font-bold text-on-surface">
                  No assignments match this filter
                </h3>
                <p className="text-xs text-on-surface-variant mt-1 mb-4">
                  Try changing your status, subject, or priority filter.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter('all');
                    setCourseFilter('ALL');
                    setPriorityFilter('ALL');
                  }}
                  className="px-4 py-2 bg-surface-container text-primary font-bold text-xs rounded-lg"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredAssignments.map((task) => {
                const isSelected = selectedTask?.id === task.id;
                const isOverdue = task.status !== 'completed' && task.dueDate < '2025-10-12';
                const isDueToday = task.status !== 'completed' && task.dueDate === '2025-10-12';

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTaskId(task.id)}
                    className={`relative rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md cursor-pointer border ${
                      isSelected
                        ? 'border-primary ring-2 ring-primary/20 bg-surface-container-lowest'
                        : 'border-outline-variant/30 bg-surface-container-lowest'
                    }`}
                  >
                    {/* Priority Indicator Strip */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${
                        isOverdue
                          ? 'bg-error'
                          : isDueToday
                          ? 'bg-amber-500'
                          : task.priority === 'high'
                          ? 'bg-red-500'
                          : task.priority === 'medium'
                          ? 'bg-primary'
                          : 'bg-slate-400'
                      }`}
                    ></div>

                    <div className="flex items-start gap-space-md pl-2 flex-1 min-w-0">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleAssignmentComplete(task.id);
                        }}
                        className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                          task.status === 'completed'
                            ? 'bg-tertiary text-white'
                            : 'bg-surface-container hover:bg-primary/20 text-on-surface-variant hover:text-primary border border-outline-variant/40'
                        }`}
                      >
                        {task.status === 'completed' && (
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-space-xs flex-wrap mb-1">
                          <span className="font-label-xs text-[11px] font-bold px-2 py-0.5 rounded bg-surface-container-high text-primary font-mono">
                            {task.courseCode}
                          </span>
                          <span
                            className={`font-label-xs text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              task.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : task.priority === 'medium'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {task.priority} Priority
                          </span>
                          <span
                            className={`font-label-xs text-[10px] px-2 py-0.5 rounded font-semibold ${
                              task.status === 'completed'
                                ? 'bg-emerald-100 text-emerald-800'
                                : task.status === 'in_progress'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-surface-container text-on-surface-variant'
                            }`}
                          >
                            {task.status === 'in_progress'
                              ? 'In Progress'
                              : task.status === 'completed'
                              ? 'Completed'
                              : 'Pending'}
                          </span>
                        </div>

                        <h3
                          className={`font-headline-md text-sm sm:text-base font-bold text-on-surface truncate group-hover:text-primary transition-colors ${
                            task.status === 'completed' ? 'line-through text-on-surface-variant' : ''
                          }`}
                        >
                          {task.title}
                        </h3>

                        {viewMode === 'detailed' && task.description && (
                          <p className="font-body-sm text-xs text-on-surface-variant mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        {/* Progress Meter */}
                        <div className="mt-2.5 flex items-center gap-3">
                          <div className="flex-1 bg-surface-container h-2 rounded-full overflow-hidden max-w-xs">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                task.status === 'completed'
                                  ? 'bg-tertiary'
                                  : isOverdue
                                  ? 'bg-error'
                                  : 'bg-primary'
                              }`}
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                          <span className="font-label-xs text-[11px] font-bold text-on-surface-variant font-mono">
                            {task.progress}%
                          </span>
                          <span className="text-[11px] text-on-surface-variant">
                            ({task.checklist.filter((c) => c.completed).length}/{task.checklist.length}{' '}
                            subtasks)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Deadline & Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1 border-t sm:border-t-0 pt-2 sm:pt-0 border-outline-variant/20 shrink-0">
                      <div className="text-left sm:text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-label-xs text-xs font-bold px-2 py-0.5 rounded-full ${
                            isOverdue
                              ? 'bg-red-100 text-error'
                              : isDueToday
                              ? 'bg-amber-100 text-amber-900'
                              : 'bg-surface-container text-on-surface-variant'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {isOverdue ? 'error' : isDueToday ? 'alarm' : 'event'}
                          </span>
                          {isOverdue
                            ? 'Overdue'
                            : isDueToday
                            ? `Due Today ${task.dueTime}`
                            : `Due ${task.dueDate}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 mt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedTaskId(task.id);
                          }}
                          className="p-1 rounded text-on-surface-variant hover:text-primary hover:bg-surface-container text-xs flex items-center gap-0.5"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span className="hidden sm:inline">Inspect</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* RIGHT: Contextual Detail Panel & Submission Checklist (4 cols on lg) */}
          <div className="lg:col-span-4 sticky top-36 space-y-space-md">
            {selectedTask ? (
              <div className="bg-surface-container-lowest rounded-xl p-space-md sm:p-space-lg shadow-sm border border-outline-variant/30 space-y-space-md">
                {/* Panel Header */}
                <div className="flex items-center justify-between pb-space-sm border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-surface-container px-2 py-0.5 rounded text-primary">
                      {selectedTask.courseCode}
                    </span>
                    <span className="text-xs text-on-surface-variant">Task Inspector</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete assignment "${selectedTask.title}"?`)) {
                          deleteAssignment(selectedTask.id);
                        }
                      }}
                      className="p-1 text-on-surface-variant hover:text-error rounded hover:bg-surface-container"
                      title="Delete assignment"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>

                {/* Selected Task Title & Alert */}
                <div>
                  <h2 className="font-headline-md text-base sm:text-lg font-bold text-on-surface leading-snug">
                    {selectedTask.title}
                  </h2>
                  <p className="font-body-sm text-xs text-on-surface-variant mt-1">
                    {selectedTask.courseName}
                  </p>

                  <div className="mt-3 p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold">
                        Target Deadline
                      </span>
                      <div className="text-xs font-bold text-on-surface mt-0.5">
                        {selectedTask.dueDate} at {selectedTask.dueTime}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        selectedTask.dueDate < '2025-10-12' && selectedTask.status !== 'completed'
                          ? 'bg-red-100 text-error'
                          : selectedTask.dueDate === '2025-10-12' && selectedTask.status !== 'completed'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {selectedTask.status === 'completed'
                        ? 'Submitted'
                        : selectedTask.dueDate === '2025-10-12'
                        ? 'Due Today'
                        : 'On Schedule'}
                    </span>
                  </div>
                </div>

                {/* Description & Reference Notes */}
                {selectedTask.description && (
                  <div>
                    <h4 className="text-xs font-bold text-on-surface mb-1">Objective &amp; Scope</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed bg-surface-container-lowest p-2.5 rounded-lg border border-outline-variant/30">
                      {selectedTask.description}
                    </p>
                  </div>
                )}

                {/* Submission Checklist */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-on-surface">Submission Checklist</h4>
                    <span className="text-[11px] font-bold text-primary font-mono">
                      {selectedTask.checklist.filter((c) => c.completed).length}/
                      {selectedTask.checklist.length} Completed
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {selectedTask.checklist.map((sub) => (
                      <label
                        key={sub.id}
                        className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer transition-colors text-xs border ${
                          sub.completed
                            ? 'bg-surface-container-low border-transparent opacity-75'
                            : 'bg-surface-container-lowest border-outline-variant/30 hover:bg-surface-container-low'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={sub.completed}
                          onChange={() => toggleChecklistItem(selectedTask.id, sub.id)}
                          className="mt-0.5 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                        />
                        <span
                          className={`flex-1 ${
                            sub.completed ? 'line-through text-on-surface-variant' : 'text-on-surface'
                          }`}
                        >
                          {sub.text}
                        </span>
                      </label>
                    ))}
                  </div>

                  {/* Add subtask mini form */}
                  <form onSubmit={handleAddSubtask} className="flex gap-1.5 mt-2">
                    <input
                      type="text"
                      value={newSubtaskText}
                      onChange={(e) => setNewSubtaskText(e.target.value)}
                      placeholder="+ Add checklist step..."
                      className="flex-1 px-2.5 py-1 text-xs bg-surface-container-low rounded-lg border border-outline-variant/30 outline-none focus:bg-surface-container-lowest focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-surface-container text-primary font-bold text-xs rounded-lg hover:bg-surface-container-high"
                    >
                      Add
                    </button>
                  </form>
                </div>

                {/* Reminder Notification Cadence */}
                <div>
                  <h4 className="text-xs font-bold text-on-surface mb-2">Reminder Cadence</h4>
                  <div className="space-y-1.5 bg-surface-container-low p-2.5 rounded-xl border border-outline-variant/20">
                    {[
                      { key: 'days3', label: '3 days before deadline' },
                      { key: 'days1', label: '1 day before (final alert)' },
                      { key: 'dayOf', label: 'Morning of due date (9:00 AM)' },
                    ].map((rem) => {
                      const enabled = selectedTask.reminders[rem.key as keyof typeof selectedTask.reminders];
                      return (
                        <div key={rem.key} className="flex items-center justify-between text-xs">
                          <span className="text-on-surface-variant">{rem.label}</span>
                          <button
                            type="button"
                            onClick={() => {
                              updateAssignment(selectedTask.id, {
                                reminders: {
                                  ...selectedTask.reminders,
                                  [rem.key]: !enabled,
                                },
                              });
                            }}
                            className={`w-8 h-4 rounded-full transition-colors relative ${
                              enabled ? 'bg-primary' : 'bg-outline-variant'
                            }`}
                          >
                            <span
                              className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${
                                enabled ? 'right-0.5' : 'left-0.5'
                              }`}
                            ></span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Reference Attachments */}
                {selectedTask.attachments.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-on-surface mb-1.5">Attached Rubrics</h4>
                    <div className="space-y-1">
                      {selectedTask.attachments.map((att) => (
                        <div
                          key={att.id}
                          className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low text-xs border border-outline-variant/20"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="material-symbols-outlined text-primary text-[18px]">
                              description
                            </span>
                            <span className="text-on-surface truncate font-medium">{att.name}</span>
                          </div>
                          <span className="text-[10px] text-on-surface-variant shrink-0 font-mono">
                            {att.size}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="pt-2 border-t border-outline-variant/30">
                  <button
                    type="button"
                    onClick={() => toggleAssignmentComplete(selectedTask.id)}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                      selectedTask.status === 'completed'
                        ? 'bg-surface-container text-on-surface hover:bg-surface-container-high'
                        : 'bg-primary hover:bg-primary-container text-on-primary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {selectedTask.status === 'completed' ? 'replay' : 'check_circle'}
                    </span>
                    <span>
                      {selectedTask.status === 'completed'
                        ? 'Reopen Assignment'
                        : 'Mark Assignment Completed'}
                    </span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-xl p-8 text-center border border-outline-variant/30">
                <span className="material-symbols-outlined text-3xl text-outline mb-1">
                  touch_app
                </span>
                <p className="text-xs text-on-surface-variant">Select an assignment to inspect</p>
              </div>
            )}

            {/* Quick Tips Card */}
            <div className="bg-gradient-to-br from-primary-fixed/30 to-surface-container-low p-4 rounded-xl border border-outline-variant/30 space-y-1">
              <div className="flex items-center gap-1.5 text-primary text-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">lightbulb</span>
                <span>CampusOS Pro-Tip</span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Checking off subtasks updates your assignment progress meter in real time and adjusts
                your aggregate focus metric on My Day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
