import { STORAGE_KEYS } from './storageKeys';
import { storageAdapter } from './storageAdapter';
import { INITIAL_EVENTS, INITIAL_REGISTRATIONS, INITIAL_BOOKMARKS } from './seedData';

// Initialize default data if this is the first run
export const initializeData = () => {
  const hasSeeded = storageAdapter.get(STORAGE_KEYS.HAS_SEEDED, false);
  if (!hasSeeded) {
    storageAdapter.set(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    storageAdapter.set(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    storageAdapter.set(STORAGE_KEYS.BOOKMARKS, INITIAL_BOOKMARKS);
    storageAdapter.set(STORAGE_KEYS.HAS_SEEDED, true);
  }
};

export const eventService = {
  // Events
  getAllEvents: () => {
    initializeData();
    return storageAdapter.get(STORAGE_KEYS.EVENTS, []);
  },

  getEventById: (id) => {
    const events = eventService.getAllEvents();
    return events.find((evt) => evt.id === id) || null;
  },

  createEvent: (eventData) => {
    const events = eventService.getAllEvents();
    const newEvent = {
      ...eventData,
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      registeredCount: 0,
      createdAt: new Date().toISOString()
    };
    events.unshift(newEvent);
    storageAdapter.set(STORAGE_KEYS.EVENTS, events);
    return newEvent;
  },

  updateEvent: (id, updatedFields) => {
    const events = eventService.getAllEvents();
    const index = events.findIndex((evt) => evt.id === id);
    if (index === -1) {
      throw new Error(`Event with id "${id}" not found.`);
    }

    const updatedEvent = {
      ...events[index],
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    events[index] = updatedEvent;
    storageAdapter.set(STORAGE_KEYS.EVENTS, events);
    return updatedEvent;
  },

  deleteEvent: (id) => {
    const events = eventService.getAllEvents();
    const filtered = events.filter((evt) => evt.id !== id);
    storageAdapter.set(STORAGE_KEYS.EVENTS, filtered);

    // Also cascade remove registrations and bookmarks for this event
    const registrations = storageAdapter.get(STORAGE_KEYS.REGISTRATIONS, []);
    storageAdapter.set(
      STORAGE_KEYS.REGISTRATIONS,
      registrations.filter((r) => r.eventId !== id)
    );

    const bookmarks = storageAdapter.get(STORAGE_KEYS.BOOKMARKS, []);
    storageAdapter.set(
      STORAGE_KEYS.BOOKMARKS,
      bookmarks.filter((bId) => bId !== id)
    );

    return true;
  },

  // Registrations
  getRegistrationsByUser: (userId = 'student-default') => {
    const registrations = storageAdapter.get(STORAGE_KEYS.REGISTRATIONS, []);
    return registrations.filter((r) => r.userId === userId);
  },

  getRegistrationsForEvent: (eventId) => {
    const registrations = storageAdapter.get(STORAGE_KEYS.REGISTRATIONS, []);
    return registrations.filter((r) => r.eventId === eventId);
  },

  isRegistered: (eventId, userId = 'student-default') => {
    const registrations = eventService.getRegistrationsByUser(userId);
    return registrations.some((r) => r.eventId === eventId);
  },

  registerForEvent: (eventId, studentDetails, userId = 'student-default') => {
    const events = eventService.getAllEvents();
    const eventIndex = events.findIndex((e) => e.id === eventId);
    if (eventIndex === -1) {
      throw new Error('Event does not exist.');
    }

    const event = events[eventIndex];

    // Check capacity
    if (event.registeredCount >= event.capacity) {
      throw new Error('Sorry, this event is already at maximum capacity.');
    }

    // Check if already registered
    const registrations = storageAdapter.get(STORAGE_KEYS.REGISTRATIONS, []);
    const alreadyRegistered = registrations.some(
      (r) => r.eventId === eventId && r.userId === userId
    );

    if (alreadyRegistered) {
      throw new Error('You are already registered for this event.');
    }

    // Create registration record
    const newRegistration = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      eventId,
      userId,
      studentName: studentDetails.studentName || 'Student Attendee',
      studentEmail: studentDetails.studentEmail || 'student@campus.edu',
      studentRoll: studentDetails.studentRoll || 'N/A',
      registeredAt: new Date().toISOString()
    };

    registrations.push(newRegistration);
    storageAdapter.set(STORAGE_KEYS.REGISTRATIONS, registrations);

    // Increment count on event
    events[eventIndex] = {
      ...event,
      registeredCount: (event.registeredCount || 0) + 1
    };
    storageAdapter.set(STORAGE_KEYS.EVENTS, events);

    return newRegistration;
  },

  cancelRegistration: (eventId, userId = 'student-default') => {
    const registrations = storageAdapter.get(STORAGE_KEYS.REGISTRATIONS, []);
    const filtered = registrations.filter(
      (r) => !(r.eventId === eventId && r.userId === userId)
    );

    if (filtered.length === registrations.length) {
      throw new Error('No active registration found to cancel.');
    }

    storageAdapter.set(STORAGE_KEYS.REGISTRATIONS, filtered);

    // Decrement count on event
    const events = eventService.getAllEvents();
    const eventIndex = events.findIndex((e) => e.id === eventId);
    if (eventIndex !== -1) {
      events[eventIndex] = {
        ...events[eventIndex],
        registeredCount: Math.max(0, (events[eventIndex].registeredCount || 1) - 1)
      };
      storageAdapter.set(STORAGE_KEYS.EVENTS, events);
    }

    return true;
  },

  // Bookmarks
  getBookmarks: () => {
    initializeData();
    return storageAdapter.get(STORAGE_KEYS.BOOKMARKS, []);
  },

  isBookmarked: (eventId) => {
    const bookmarks = eventService.getBookmarks();
    return bookmarks.includes(eventId);
  },

  toggleBookmark: (eventId) => {
    const bookmarks = eventService.getBookmarks();
    let updated;
    let isNowBookmarked = false;

    if (bookmarks.includes(eventId)) {
      updated = bookmarks.filter((id) => id !== eventId);
      isNowBookmarked = false;
    } else {
      updated = [...bookmarks, eventId];
      isNowBookmarked = true;
    }

    storageAdapter.set(STORAGE_KEYS.BOOKMARKS, updated);
    return isNowBookmarked;
  },

  // Reset to initial demo state
  resetToDefaultData: () => {
    storageAdapter.set(STORAGE_KEYS.EVENTS, INITIAL_EVENTS);
    storageAdapter.set(STORAGE_KEYS.REGISTRATIONS, INITIAL_REGISTRATIONS);
    storageAdapter.set(STORAGE_KEYS.BOOKMARKS, INITIAL_BOOKMARKS);
    storageAdapter.set(STORAGE_KEYS.HAS_SEEDED, true);
    return true;
  }
};
