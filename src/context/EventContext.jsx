import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';
import { useAuth } from './AuthContext';

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [registrationModalEvent, setRegistrationModalEvent] = useState(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  const openRegistrationModal = useCallback((event = null) => {
    setRegistrationModalEvent(event);
    setIsRegistrationModalOpen(true);
  }, []);

  const closeRegistrationModal = useCallback(() => {
    setIsRegistrationModalOpen(false);
    setRegistrationModalEvent(null);
  }, []);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ id: Date.now(), message, type });
  }, []);

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

  const refreshData = useCallback(() => {
    try {
      const allEvents = eventService.getAllEvents();
      const allBookmarks = eventService.getBookmarks();
      const myRegs = eventService.getRegistrationsByUser(currentUser.id, currentUser.email);

      setEvents(allEvents);
      setBookmarks(allBookmarks);
      setUserRegistrations(myRegs);
    } catch (err) {
      console.error('Failed to refresh events state:', err);
      showToast('Error syncing event data', 'error');
    } finally {
      setLoading(false);
    }
  }, [currentUser.id, currentUser.email, showToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Actions
  const handleRegister = async (eventId, customDetails = {}) => {
    try {
      const details = {
        studentName: customDetails.studentName || currentUser.name,
        studentEmail: customDetails.studentEmail || currentUser.email,
        studentRoll: customDetails.studentRoll || currentUser.roll
      };
      eventService.registerForEvent(eventId, details, currentUser.id);
      refreshData();
      showToast('Registration successful! See you at the event.', 'success');
      return true;
    } catch (error) {
      showToast(error.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const handleCancelRegistration = async (eventId) => {
    try {
      eventService.cancelRegistration(eventId, currentUser.id);
      refreshData();
      showToast('Registration cancelled.', 'info');
      return true;
    } catch (error) {
      showToast(error.message || 'Failed to cancel registration', 'error');
      return false;
    }
  };

  const handleToggleBookmark = (eventId) => {
    try {
      const isNowBookmarked = eventService.toggleBookmark(eventId);
      refreshData();
      showToast(
        isNowBookmarked ? 'Added to Saved Events' : 'Removed from Saved Events',
        'info'
      );
      return isNowBookmarked;
    } catch (error) {
      showToast('Failed to update bookmarks', 'error');
      return false;
    }
  };

  const handleCreateEvent = (eventData) => {
    try {
      const created = eventService.createEvent(eventData);
      refreshData();
      showToast(`Event "${created.title}" published successfully!`, 'success');
      return created;
    } catch (error) {
      showToast(error.message || 'Could not create event', 'error');
      return null;
    }
  };

  const handleUpdateEvent = (id, fields) => {
    try {
      const updated = eventService.updateEvent(id, fields);
      refreshData();
      showToast(`Event updated successfully.`, 'success');
      return updated;
    } catch (error) {
      showToast(error.message || 'Could not update event', 'error');
      return null;
    }
  };

  const handleDeleteEvent = (id) => {
    try {
      eventService.deleteEvent(id);
      refreshData();
      showToast('Event has been deleted.', 'info');
      return true;
    } catch (error) {
      showToast(error.message || 'Could not delete event', 'error');
      return false;
    }
  };

  const handleResetData = () => {
    eventService.resetToDefaultData();
    refreshData();
    showToast('CampusConnect restored to demo defaults.', 'info');
  };

  return (
    <EventContext.Provider
      value={{
        events,
        bookmarks,
        userRegistrations,
        loading,
        toast,
        isRegistrationModalOpen,
        registrationModalEvent,
        openRegistrationModal,
        closeRegistrationModal,
        showToast,
        clearToast,
        refreshData,
        handleRegister,
        handleCancelRegistration,
        handleToggleBookmark,
        handleCreateEvent,
        handleUpdateEvent,
        handleDeleteEvent,
        handleResetData
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
