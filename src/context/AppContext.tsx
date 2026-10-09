'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import {
  Assignment,
  AssignmentStatus,
  SubjectAttendance,
  CampusEvent,
  LostFoundItem,
  ClassScheduleItem,
  NotificationItem,
  UserProfile,
} from '@/types';
import {
  initialUserProfile,
  initialClasses,
  initialAssignments,
  initialSubjects,
  initialEvents,
  initialLostFound,
  initialNotifications,
} from '@/data/mockData';

interface AppContextType {
  userProfile: UserProfile;
  classes: ClassScheduleItem[];
  assignments: Assignment[];
  subjects: SubjectAttendance[];
  events: CampusEvent[];
  lostFoundItems: LostFoundItem[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  searchQuery: string;
  isCommandPaletteOpen: boolean;
  isQuickActionOpen: boolean;
  isNotificationsOpen: boolean;
  toastMessage: { title: string; desc: string; type?: 'success' | 'info' | 'warning' } | null;
  isLoadingBackend: boolean;
  isFirestoreConnected: boolean;

  // Actions
  setSearchQuery: (q: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setQuickActionOpen: (open: boolean) => void;
  setNotificationsOpen: (open: boolean) => void;
  showToast: (title: string, desc: string, type?: 'success' | 'info' | 'warning') => void;
  triggerConfetti: () => void;
  refreshFromBackend: () => Promise<void>;

  // Assignment Operations
  addAssignment: (item: Omit<Assignment, 'id' | 'createdAt'>) => Promise<void>;
  updateAssignment: (id: string, updates: Partial<Assignment>) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;
  toggleAssignmentComplete: (id: string) => Promise<void>;
  toggleChecklistItem: (assignmentId: string, checklistId: string) => Promise<void>;

  // Attendance Operations
  addSubject: (item: Omit<SubjectAttendance, 'id'>) => Promise<void>;
  updateSubject: (id: string, updates: Partial<SubjectAttendance>) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;
  recordAttendance: (id: string, action: 'attended' | 'missed') => Promise<void>;

  // Event Operations
  toggleSaveEvent: (id: string) => Promise<void>;
  registerForEvent: (id: string) => Promise<void>;
  proposeEvent: (item: Omit<CampusEvent, 'id' | 'isSaved' | 'isRegistered' | 'attendeeCount' | 'status'>) => Promise<void>;

  // Lost & Found Operations
  reportItem: (item: Omit<LostFoundItem, 'id' | 'status' | 'claims'>) => Promise<void>;
  submitClaim: (itemId: string, claimantName: string, details: string) => Promise<void>;
  resolveItem: (itemId: string) => Promise<void>;

  // Notifications Operations
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Calculation Helpers
  calculateMissableClasses: (attended: number, conducted: number, targetPercent: number) => number;
  calculateRequiredClasses: (attended: number, conducted: number, targetPercent: number) => number;
  getAggregateAttendance: () => {
    attended: number;
    conducted: number;
    percentage: number;
    missableClasses: number;
    requiredClasses: number;
    status: 'Safe' | 'Near Target' | 'Below Target';
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(initialUserProfile);
  const [classes, setClasses] = useState<ClassScheduleItem[]>(initialClasses);
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [subjects, setSubjects] = useState<SubjectAttendance[]>(initialSubjects);
  const [events, setEvents] = useState<CampusEvent[]>(initialEvents);
  const [lostFoundItems, setLostFoundItems] = useState<LostFoundItem[]>(initialLostFound);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);

  const [isLoadingBackend, setIsLoadingBackend] = useState(true);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCommandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isQuickActionOpen, setQuickActionOpen] = useState(false);
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    title: string;
    desc: string;
    type?: 'success' | 'info' | 'warning';
  } | null>(null);

  const showToast = useCallback((title: string, desc: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToastMessage({ title, desc, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.title === title ? null : prev));
    }, 4000);
  }, []);

  const triggerConfetti = useCallback(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3525cd', '#4f46e5', '#10b981', '#f59e0b'],
      });
    } catch (e) {
      // ignore
    }
  }, []);

  // Fetch initial data from Firestore Backend API
  const refreshFromBackend = useCallback(async () => {
    setIsLoadingBackend(true);
    try {
      const [asgRes, subRes, evtRes, lfRes, notifRes, clsRes, profRes] = await Promise.allSettled([
        fetch('/api/assignments').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/subjects').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/events').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/lost-found').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/notifications').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/classes').then((r) => (r.ok ? r.json() : null)),
        fetch('/api/profile').then((r) => (r.ok ? r.json() : null)),
      ]);

      let backendAvailable = false;

      if (asgRes.status === 'fulfilled' && asgRes.value && Array.isArray(asgRes.value)) {
        setAssignments(asgRes.value);
        backendAvailable = true;
      }
      if (subRes.status === 'fulfilled' && subRes.value && Array.isArray(subRes.value)) {
        setSubjects(subRes.value);
        backendAvailable = true;
      }
      if (evtRes.status === 'fulfilled' && evtRes.value && Array.isArray(evtRes.value)) {
        setEvents(evtRes.value);
        backendAvailable = true;
      }
      if (lfRes.status === 'fulfilled' && lfRes.value && Array.isArray(lfRes.value)) {
        setLostFoundItems(lfRes.value);
        backendAvailable = true;
      }
      if (notifRes.status === 'fulfilled' && notifRes.value && Array.isArray(notifRes.value)) {
        setNotifications(notifRes.value);
        backendAvailable = true;
      }
      if (clsRes.status === 'fulfilled' && clsRes.value && Array.isArray(clsRes.value)) {
        setClasses(clsRes.value);
      }
      if (profRes.status === 'fulfilled' && profRes.value && profRes.value.name) {
        setUserProfile(profRes.value);
      }

      setIsFirestoreConnected(backendAvailable);
    } catch (err) {
      console.warn('Backend fetch error, falling back to local state:', err);
      setIsFirestoreConnected(false);
    } finally {
      setIsLoadingBackend(false);
    }
  }, []);

  useEffect(() => {
    refreshFromBackend();
  }, [refreshFromBackend]);

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Calculation helpers
  const calculateMissableClasses = (
    attended: number,
    conducted: number,
    targetPercent: number
  ): number => {
    if (conducted === 0) return 0;
    const currentPercent = (attended / conducted) * 100;
    if (currentPercent < targetPercent) return 0;
    const targetRatio = targetPercent / 100;
    const maxMissable = Math.floor(attended / targetRatio - conducted);
    return Math.max(0, maxMissable);
  };

  const calculateRequiredClasses = (
    attended: number,
    conducted: number,
    targetPercent: number
  ): number => {
    if (conducted === 0) return 0;
    const currentPercent = (attended / conducted) * 100;
    if (currentPercent >= targetPercent) return 0;
    const targetRatio = targetPercent / 100;
    const required = Math.ceil((targetRatio * conducted - attended) / (1 - targetRatio));
    return Math.max(0, required);
  };

  const getAggregateAttendance = () => {
    const conducted = subjects.reduce((sum, s) => sum + s.totalClasses, 0);
    const attended = subjects.reduce((sum, s) => sum + s.attendedClasses, 0);
    const target = 75;
    const percentage = conducted > 0 ? (attended / conducted) * 100 : 0;
    const missableClasses = calculateMissableClasses(attended, conducted, target);
    const requiredClasses = calculateRequiredClasses(attended, conducted, target);

    let status: 'Safe' | 'Near Target' | 'Below Target' = 'Safe';
    if (percentage < target) {
      status = 'Below Target';
    } else if (percentage - target <= 3) {
      status = 'Near Target';
    }

    return {
      attended,
      conducted,
      percentage: Number(percentage.toFixed(1)),
      missableClasses,
      requiredClasses,
      status,
    };
  };

  // Assignment Actions
  const addAssignment = async (item: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...item,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    // Optimistic UI update
    setAssignments((prev) => [newAssignment, ...prev]);
    showToast('Assignment Created', `"${item.title}" added to your tracker.`, 'success');

    // Firestore sync
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAssignment),
      });
      if (res.ok) {
        const created = await res.json();
        setAssignments((prev) => prev.map((a) => (a.id === newAssignment.id ? created : a)));
      }
    } catch (e) {
      console.error('Failed to sync new assignment to Firestore', e);
    }
  };

  const updateAssignment = async (id: string, updates: Partial<Assignment>) => {
    setAssignments((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    showToast('Assignment Updated', 'Changes saved successfully.', 'info');

    try {
      await fetch(`/api/assignments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.error('Failed to sync assignment update to Firestore', e);
    }
  };

  const deleteAssignment = async (id: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    showToast('Assignment Deleted', 'Assignment removed from tracker.', 'info');

    try {
      await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to delete assignment from Firestore', e);
    }
  };

  const toggleAssignmentComplete = async (id: string) => {
    let nextStatus: AssignmentStatus = 'in_progress';
    let nextProgress = 50;
    let nextChecklist: Assignment['checklist'] = [];

    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const isDone = a.status === 'completed';
          nextStatus = isDone ? 'in_progress' : 'completed';
          nextProgress = isDone ? 50 : 100;
          nextChecklist = a.checklist.map((c) => ({ ...c, completed: !isDone }));
          if (!isDone) {
            triggerConfetti();
            showToast('Assignment Completed! 🎉', `"${a.title}" marked completed.`, 'success');
          } else {
            showToast('Assignment Reopened', `"${a.title}" moved back to pending list.`, 'info');
          }
          return {
            ...a,
            status: nextStatus,
            progress: nextProgress,
            checklist: nextChecklist,
          };
        }
        return a;
      })
    );

    try {
      await fetch(`/api/assignments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: nextStatus,
          progress: nextProgress,
          checklist: nextChecklist,
        }),
      });
    } catch (e) {
      console.error('Failed to sync complete status to Firestore', e);
    }
  };

  const toggleChecklistItem = async (assignmentId: string, checklistId: string) => {
    let updatedPayload: { checklist: Assignment['checklist']; progress: number; status: AssignmentStatus } | null = null;

    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id === assignmentId) {
          const updatedChecklist = a.checklist.map((c) =>
            c.id === checklistId ? { ...c, completed: !c.completed } : c
          );
          const total = updatedChecklist.length;
          const completedCount = updatedChecklist.filter((c) => c.completed).length;
          const calculatedProgress = total > 0 ? Math.round((completedCount / total) * 100) : a.progress;
          const isNowComplete = completedCount === total && total > 0;
          const newStatus: AssignmentStatus = isNowComplete
            ? 'completed'
            : calculatedProgress > 0
            ? 'in_progress'
            : 'pending';

          updatedPayload = {
            checklist: updatedChecklist,
            progress: calculatedProgress,
            status: newStatus,
          };

          return {
            ...a,
            ...updatedPayload,
          };
        }
        return a;
      })
    );

    if (updatedPayload) {
      try {
        await fetch(`/api/assignments/${assignmentId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedPayload),
        });
      } catch (e) {
        console.error('Failed to sync checklist to Firestore', e);
      }
    }
  };

  // Attendance Actions
  const addSubject = async (item: Omit<SubjectAttendance, 'id'>) => {
    const newSubject: SubjectAttendance = {
      ...item,
      id: `sub-${Date.now()}`,
    };
    setSubjects((prev) => [...prev, newSubject]);
    showToast('Subject Added', `${item.name} (${item.code}) added to calculator.`, 'success');

    try {
      const res = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject),
      });
      if (res.ok) {
        const created = await res.json();
        setSubjects((prev) => prev.map((s) => (s.id === newSubject.id ? created : s)));
      }
    } catch (e) {
      console.error('Failed to sync new subject to Firestore', e);
    }
  };

  const updateSubject = async (id: string, updates: Partial<SubjectAttendance>) => {
    setSubjects((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    showToast('Subject Updated', 'Attendance details modified.', 'info');

    try {
      await fetch(`/api/subjects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (e) {
      console.error('Failed to update subject in Firestore', e);
    }
  };

  const deleteSubject = async (id: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== id));
    showToast('Subject Removed', 'Subject removed from attendance tracker.', 'info');

    try {
      await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.error('Failed to delete subject from Firestore', e);
    }
  };

  const recordAttendance = async (id: string, action: 'attended' | 'missed') => {
    setSubjects((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextConducted = s.totalClasses + 1;
          const nextAttended = action === 'attended' ? s.attendedClasses + 1 : s.attendedClasses;
          return {
            ...s,
            totalClasses: nextConducted,
            attendedClasses: nextAttended,
          };
        }
        return s;
      })
    );

    const targetSub = subjects.find((s) => s.id === id);
    const newAtt = action === 'attended' ? (targetSub?.attendedClasses || 0) + 1 : targetSub?.attendedClasses || 0;
    const newTot = (targetSub?.totalClasses || 0) + 1;
    const newPct = newTot > 0 ? ((newAtt / newTot) * 100).toFixed(1) : '0';

    showToast(
      action === 'attended' ? 'Class Attended Logged' : 'Class Absence Logged',
      `${targetSub?.code || 'Course'} now at ${newPct}%. Dashboard snapshot updated.`,
      action === 'attended' ? 'success' : 'warning'
    );

    try {
      await fetch(`/api/subjects/${id}/attendance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
    } catch (e) {
      console.error('Failed to record attendance in Firestore', e);
    }
  };

  // Event Actions
  const toggleSaveEvent = async (id: string) => {
    let willSave = false;
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          willSave = !e.isSaved;
          if (willSave) {
            showToast('Event Saved ⭐', `"${e.title}" added to Saved Events & My Day.`, 'success');
          } else {
            showToast('Event Unsaved', `"${e.title}" removed from Saved Events.`, 'info');
          }
          return { ...e, isSaved: willSave };
        }
        return e;
      })
    );

    try {
      await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSaved: willSave }),
      });
    } catch (e) {
      console.error('Failed to toggle event save in Firestore', e);
    }
  };

  const registerForEvent = async (id: string) => {
    let newCount = 0;
    setEvents((prev) =>
      prev.map((e) => {
        if (e.id === id) {
          triggerConfetti();
          showToast('Registration Confirmed! 🎟️', `Spot reserved for "${e.title}". Check email for badge.`, 'success');
          newCount = e.attendeeCount + 1;
          return { ...e, isRegistered: true, attendeeCount: newCount };
        }
        return e;
      })
    );

    try {
      await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRegistered: true, attendeeCount: newCount }),
      });
    } catch (e) {
      console.error('Failed to register for event in Firestore', e);
    }
  };

  const proposeEvent = async (
    item: Omit<CampusEvent, 'id' | 'isSaved' | 'isRegistered' | 'attendeeCount' | 'status'>
  ) => {
    const newEvent: CampusEvent = {
      ...item,
      id: `evt-${Date.now()}`,
      isSaved: false,
      isRegistered: true,
      attendeeCount: 1,
      status: 'Upcoming',
    };
    setEvents((prev) => [newEvent, ...prev]);
    showToast('Event Proposal Submitted', `"${item.title}" published under campus moderation.`, 'success');

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });
      if (res.ok) {
        const created = await res.json();
        setEvents((prev) => prev.map((e) => (e.id === newEvent.id ? created : e)));
      }
    } catch (e) {
      console.error('Failed to save proposed event to Firestore', e);
    }
  };

  // Lost & Found Actions
  const reportItem = async (item: Omit<LostFoundItem, 'id' | 'status' | 'claims'>) => {
    const newItem: LostFoundItem = {
      ...item,
      id: `lf-${Date.now()}`,
      status: 'Open',
      claims: [],
    };
    setLostFoundItems((prev) => [newItem, ...prev]);
    showToast(
      item.type === 'lost' ? 'Lost Item Reported' : 'Found Item Reported',
      `"${item.title}" is now visible to campus community with spatial pinning.`,
      'success'
    );

    try {
      const res = await fetch('/api/lost-found', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (res.ok) {
        const created = await res.json();
        setLostFoundItems((prev) => prev.map((i) => (i.id === newItem.id ? created : i)));
      }
    } catch (e) {
      console.error('Failed to save reported item to Firestore', e);
    }
  };

  const submitClaim = async (itemId: string, claimantName: string, details: string) => {
    setLostFoundItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newClaim = {
            id: `cl-${Date.now()}`,
            claimantName,
            details,
            date: new Date().toISOString().split('T')[0],
            status: 'pending' as const,
          };
          showToast('Claim Submitted Privately 🔒', 'Your ownership verification details were sent to finder.', 'success');
          return {
            ...item,
            status: 'Claim Pending' as const,
            claims: [...item.claims, newClaim],
          };
        }
        return item;
      })
    );

    try {
      await fetch(`/api/lost-found/${itemId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimantName, details }),
      });
    } catch (e) {
      console.error('Failed to submit claim to Firestore', e);
    }
  };

  const resolveItem = async (itemId: string) => {
    setLostFoundItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          showToast('Item Marked Resolved! 🤝', `Handover confirmed for "${item.title}". Great campus community work!`, 'success');
          return { ...item, status: 'Resolved' as const };
        }
        return item;
      })
    );

    try {
      await fetch(`/api/lost-found/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Resolved' }),
      });
    } catch (e) {
      console.error('Failed to mark item resolved in Firestore', e);
    }
  };

  // Notification Actions
  const markNotificationRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (e) {
      console.error('Failed to update notification in Firestore', e);
    }
  };

  const markAllNotificationsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Notifications Cleared', 'All alerts marked as read.', 'info');

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
      });
    } catch (e) {
      console.error('Failed to mark all notifications read in Firestore', e);
    }
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        userProfile,
        classes,
        assignments,
        subjects,
        events,
        lostFoundItems,
        notifications,
        unreadNotificationCount,
        searchQuery,
        isCommandPaletteOpen,
        isQuickActionOpen,
        isNotificationsOpen,
        toastMessage,
        isLoadingBackend,
        isFirestoreConnected,
        setSearchQuery,
        setCommandPaletteOpen,
        setQuickActionOpen,
        setNotificationsOpen,
        showToast,
        triggerConfetti,
        refreshFromBackend,
        addAssignment,
        updateAssignment,
        deleteAssignment,
        toggleAssignmentComplete,
        toggleChecklistItem,
        addSubject,
        updateSubject,
        deleteSubject,
        recordAttendance,
        toggleSaveEvent,
        registerForEvent,
        proposeEvent,
        reportItem,
        submitClaim,
        resolveItem,
        markNotificationRead,
        markAllNotificationsRead,
        calculateMissableClasses,
        calculateRequiredClasses,
        getAggregateAttendance,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
