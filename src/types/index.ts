export type AssignmentPriority = 'high' | 'medium' | 'low';
export type AssignmentStatus = 'pending' | 'in_progress' | 'completed';

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface AttachmentItem {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  dueDate: string; // YYYY-MM-DD
  dueTime: string; // HH:MM AM/PM
  priority: AssignmentPriority;
  status: AssignmentStatus;
  progress: number; // 0-100
  description?: string;
  notes?: string;
  checklist: ChecklistItem[];
  reminders: {
    days3: boolean;
    days1: boolean;
    dayOf: boolean;
  };
  attachments: AttachmentItem[];
  createdAt: string;
}

export interface SubjectAttendance {
  id: string;
  code: string;
  name: string;
  attendedClasses: number;
  totalClasses: number;
  targetPercentage: number;
  instructor: string;
  room: string;
  schedule: string;
}

export type EventCategory = 'Technical' | 'Cultural' | 'Sports' | 'Hackathons' | 'Career' | 'General';
export type EventStatus = 'Upcoming' | 'Happening Today' | 'Past' | 'Cancelled';

export interface EventTimelineItem {
  time: string;
  activity: string;
  speaker?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string;
  venue: string;
  organizer: string;
  organizerRole?: string;
  organizerEmail?: string;
  description: string;
  eligibility: string;
  registrationDeadline: string;
  isHero?: boolean;
  isSaved: boolean;
  isRegistered: boolean;
  status: EventStatus;
  attendeeCount: number;
  maxCapacity?: number;
  tags: string[];
  scheduleTimeline: EventTimelineItem[];
  imageUrl?: string;
}

export type ItemType = 'lost' | 'found';
export type ItemCategory =
  | 'ID Cards'
  | 'Electronics'
  | 'Bags'
  | 'Books & Stationery'
  | 'Keys'
  | 'Wallets'
  | 'Clothing & Accessories'
  | 'Other';

export type ItemStatus = 'Open' | 'Claim Pending' | 'Resolved' | 'Closed';

export interface ItemClaim {
  id: string;
  claimantName: string;
  details: string;
  date: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface LostFoundItem {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  location: string;
  zoneId: string;
  dateReported: string;
  timeReported: string;
  description: string;
  status: ItemStatus;
  reporterName: string;
  reporterIsAnonymous: boolean;
  imageUrl?: string;
  safeHandoverLocation?: string;
  claims: ItemClaim[];
}

export interface ClassScheduleItem {
  id: string;
  time: string;
  subject: string;
  code: string;
  room: string;
  instructor: string;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'assignment' | 'attendance' | 'event' | 'lost_found';
  read: boolean;
  link?: string;
  urgency?: 'urgent' | 'warning' | 'info';
}

export interface UserProfile {
  name: string;
  studentId: string;
  college: string;
  program: string;
  semester: string;
  academicWeek: number;
  avatarUrl: string;
}
