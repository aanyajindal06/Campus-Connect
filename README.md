# CampusConnect 🎓

> A centralized college event discovery, bookmarking, and registration web application designed to solve fragmented campus communication.

Built with **React**, **Vite**, **Tailwind CSS**, **React Router**, and **localStorage**.

---

## ✨ Features

### For Students
* **Discover Events:** Browse upcoming campus events with category badges, dates, venues, organizers, and real-time attendance capacity indicators.
* **Full-text Search:** Instantly find events by keyword, title, venue, or tags.
* **Category Filtering:** Filter across Technology, Cultural, Workshops, Sports, and Career & Academic events.
* **Availability Toggle:** Quickly filter for events that still have available seats.
* **Detailed Event View:** View complete event descriptions, venue, start/end schedules, tags, and organizer information.
* **One-Click Event Registration:** Register with a confirmation modal capturing name, campus email, and roll number. Validates duplicate registration and seat capacity.
* **Bookmarks / Saved Events:** Save interesting events to your personal collection with a single click.
* **Registration Management:** Review and cancel your confirmed event passes under the "My Registrations" portal.

### For Administrators
* **Role Switcher:** Toggle easily between **Student** and **Admin** mode right from the top navigation bar.
* **Operations Dashboard:** View total active events, total student bookings, campus capacity, and average fill rate.
* **Create New Events:** Publish events with custom title, category, date, time, venue, organizer, capacity, and banner poster.
* **Edit Events:** Update logistical details or expand seat capacity.
* **Attendee List:** Inspect the full roster of registered students (Name, Email, Roll No., Registration Timestamp) for any event.
* **Delete Events:** Permanently delete events with a confirmation modal and cascade cleanups of registrations/bookmarks.
* **Reset Demo Data:** Easily restore the sample campus events anytime with the reset button.

---

## 🛠️ Technology Stack

* **Frontend:** React 18
* **Build Tool:** Vite
* **Routing:** React Router v6
* **Styling:** Tailwind CSS with collegiate navy & gold palette
* **Icons:** Lucide React
* **Persistence:** `localStorage` with error-handling adapters and mock seed dataset

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The application will be live at `http://localhost:3000`.

### 3. Production Build
```bash
npm run build
```

---

## 📂 Project Architecture

```
src/
├── components/
│   ├── admin/          # EventFormModal, AttendeeListModal, DeleteConfirmModal
│   ├── common/         # Toast notifications
│   ├── events/         # EventCard, EventFilter, SearchBar
│   └── layout/         # Navbar with Role Switcher, Footer
├── context/
│   ├── AuthContext.jsx # Persona management (Student vs Admin)
│   └── EventContext.jsx# Application state, CRUD actions, sync
├── pages/
│   ├── HomePage.jsx             # Discovery feed, hero spotlight, filters
│   ├── EventDetailPage.jsx      # Logistics, registration, capacity tracker
│   ├── MyRegistrationsPage.jsx  # Student booked passes & cancellations
│   ├── SavedEventsPage.jsx      # Bookmarked events
│   ├── AdminDashboardPage.jsx   # Metrics, management table, attendee lists
│   └── NotFoundPage.jsx         # 404 handler
├── services/
│   ├── storageKeys.js    # LocalStorage key constants
│   ├── storageAdapter.js # Safe JSON parsing & storage operations
│   ├── seedData.js       # Curated realistic campus event data
│   └── eventService.js   # CRUD & booking business logic
├── utils/
│   ├── dateUtils.js      # Date formatters
│   └── validators.js     # Form validation logic
├── App.jsx
└── main.jsx
```
