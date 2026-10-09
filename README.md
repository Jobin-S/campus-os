# CampusOS — College Student Companion Platform

> **Tagline:** Your Campus. Your Day. All in One Place.  
> Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, **Google Stitch Design System**, and **Google Cloud Firebase Firestore**.

---

## 🔥 Backend & Firestore Database Architecture

CampusOS connects to a real **Google Cloud Firebase Firestore** database (`campusos-1f58d`) powered by the **Firebase Admin SDK**.

### Firestore Collections Schema

1. **`assignments`**: Academic deliverables, progress percentage, priority (`high` \| `medium` \| `low`), status (`pending` \| `in_progress` \| `completed`), reminder cadences, subtasks checklist, and attachments.
2. **`subjects`**: Course inventory, attended/conducted counts, minimum threshold percentage, instructor, room, and schedules.
3. **`events`**: Campus events and workshops, categories, date/time, max capacity, RSVP reservations, and program itineraries.
4. **`lostFound`**: Missing and discovered belongings mapped to campus zones, safe handover points, and private ownership verification claims.
5. **`notifications`**: Real-time alerts for imminent deadlines, attendance warnings, and event reminders.
6. **`classes`**: Daily timetable and lecture blocks.
7. **`profile`**: Authenticated student profile, semester progress, and academic week.

### REST API Endpoints (`/api/...`)

| Endpoint | Method | Description |
|---|---|---|
| `/api/seed` | `GET`, `POST` | Seeds or resets Firestore collections with starter campus data (`?force=true`) |
| `/api/assignments` | `GET`, `POST` | Fetch all assignments or create a new deliverable in Firestore |
| `/api/assignments/[id]` | `GET`, `PATCH`, `DELETE` | Retrieve, update subtasks/status, or delete assignment |
| `/api/subjects` | `GET`, `POST` | Fetch all courses or add a new course |
| `/api/subjects/[id]` | `GET`, `PATCH`, `DELETE` | Retrieve, edit course details, or remove course |
| `/api/subjects/[id]/attendance` | `POST` | Record class session (`{ action: "attended" \| "missed" }`) |
| `/api/events` | `GET`, `POST` | Fetch events with category filters or propose a new campus event |
| `/api/events/[id]` | `GET`, `PATCH`, `DELETE` | Retrieve event, toggle save bookmark, or reserve RSVP spot |
| `/api/lost-found` | `GET`, `POST` | Fetch lost/found items with zone filters or report an item |
| `/api/lost-found/[id]` | `GET`, `PATCH`, `DELETE` | Retrieve item, resolve item, or update record |
| `/api/lost-found/[id]/claim` | `POST` | Submit private ownership claim with non-public proof and handover preferences |
| `/api/notifications` | `GET`, `PATCH` | Fetch alerts, mark individual notification read, or mark all read |
| `/api/classes` | `GET` | Fetch daily class schedule |
| `/api/profile` | `GET`, `PATCH` | Fetch or update student profile |

---

## 🚀 Live Modules & Screens Overview

CampusOS unifies five essential areas of everyday college life into a connected, responsive student dashboard:

| # | Screen / Module | Route | Stitch Screen Reference | Primary Features |
|---|---|---|---|---|
| 1 | **My Day — Smart Dashboard** | `/` | `64469b1dd88642bf9ca321611e8e542b` | Personalized greeting, Today's class timeline, Daily Priority row (Urgent deadline, Attendance risk, Saved event), Assignment bento, Radial attendance gauge, Campus bulletin |
| 2 | **Assignments & Deadlines** | `/assignments` | `20b0cfb46e9b439893b91820574656c0` | Metric Bento strip, Status tabs (All, Due Today, Upcoming, Overdue, Completed), Course & Priority filters, Interactive subtask checklist, Reminder cadence toggles, Confetti celebration |
| 3 | **Attendance Calculator & Simulator** | `/attendance` | `fc56f4feac754af6aaaf46fbf5688619` | Aggregate attendance gauge, Mathematically exact allowable cuts calculation, Consecutive classes needed, Real-time interactive Simulator sliders, Single-click `+ Attended` / `+ Missed` |
| 4 | **Campus Events Hub** | `/events` | `7d47b44d16dd47e0844715eecc116c5a` | Category filters (Tech, Hackathons, Cultural, Sports, Career), Featured Hero Hackathon showcase, Interactive spot reservation, Calendar sync, Organizer Event Proposal modal |
| 5 | **Lost & Found — Spatial Explorer** | `/lost-and-found` | `1edf938201ab42688969bce8bdbc6517` | Interactive vector campus map with 6 spatial zones & clickable pins, Lost vs Found subtabs, Private peer ownership claim flow (zero public PII exposure), Safe handover stations |

---

## 🎨 Design System & Visual Identity

The UI directly incorporates the **CampusOS Design System** extracted from Google Stitch:

- **Primary Iris (`#3525cd` / `#4f46e5`)**: Primary buttons, focus states, active tab pills, timeline markers.
- **Deep Slate Navy (`#1e1b4b` / `#0b1c30`)**: High-contrast typography and grounding layout chrome.
- **Attendance Safe (`#10b981`)**: Signals completed assignments and strong attendance thresholds (>75%).
- **Warning / Due Soon (`#f59e0b`)**: Highlights imminent deadlines and borderline attendance risks.
- **Critical / Overdue (`#ef4444`)**: Accents overdue deliverables and attendance debarment alerts.
- **Typography**: Google `Plus Jakarta Sans` for headers, badges, and stat counters; `Inter` for continuous body text; `Material Symbols Outlined` for campus glyphs.

---

## ⚡ Global Interactive Utilities

- **Universal Search (⌘K / Ctrl+K)**: Instant keyboard-driven command palette searching across assignments, courses, events, and lost items with quick navigation shortcuts.
- **Quick Action Center (`+ New Task / Report`)**: Universal modal to create assignments, log class attendance, propose events, or submit lost & found reports from any screen.
- **Campus Reminders Drawer**: Real-time dropdown showing urgent deadlines, attendance warnings, and event RSVP notifications with unread badge counter.
- **Cross-Module Unified State**: Changes to assignments or attendance immediately recalculate and update the My Day dashboard, aggregate gauges, and notifications.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (v9+)

### Installation & Running

```bash
# Clone / navigate to directory
cd campusOS

# Install dependencies (already installed)
npm install

# Start development server
npm run dev

# Or run the production build
npm run build
npm run start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to explore CampusOS.
