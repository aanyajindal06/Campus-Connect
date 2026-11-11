/**
 * Validation utilities for CampusConnect
 */

export const validateEventPayload = (formData) => {
  const errors = {};

  if (!formData.title || !formData.title.trim()) {
    errors.title = 'Event title is required.';
  } else if (formData.title.trim().length < 5) {
    errors.title = 'Event title must be at least 5 characters.';
  }

  if (!formData.category || formData.category === 'All') {
    errors.category = 'Please select a valid category.';
  }

  if (!formData.date) {
    errors.date = 'Event date is required.';
  }

  if (!formData.venue || !formData.venue.trim()) {
    errors.venue = 'Event venue or location is required.';
  }

  if (!formData.organizer || !formData.organizer.trim()) {
    errors.organizer = 'Organizer or club name is required.';
  }

  const capacityNum = Number(formData.capacity);
  if (!formData.capacity || isNaN(capacityNum) || capacityNum <= 0) {
    errors.capacity = 'Capacity must be a positive integer greater than 0.';
  } else if (capacityNum > 10000) {
    errors.capacity = 'Capacity cannot exceed 10,000 for a single venue.';
  }

  if (!formData.description || !formData.description.trim()) {
    errors.description = 'Event description is required.';
  } else if (formData.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters to inform attendees.';
  }

  if (formData.bannerUrl && formData.bannerUrl.trim()) {
    try {
      new URL(formData.bannerUrl.trim());
    } catch {
      errors.bannerUrl = 'Please provide a valid URL (http/https) for the poster.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegistrationPayload = (formData) => {
  const errors = {};

  if (!formData.eventId || !formData.eventId.trim()) {
    errors.eventId = 'Please select an event to register.';
  }

  if (!formData.studentName || !formData.studentName.trim()) {
    errors.studentName = 'Full name is required.';
  } else if (formData.studentName.trim().length < 2) {
    errors.studentName = 'Name must be at least 2 characters.';
  }

  if (!formData.studentEmail || !formData.studentEmail.trim()) {
    errors.studentEmail = 'Email address is required.';
  } else {
    // Standard RFC-compliant email validation regex
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (!emailRegex.test(formData.studentEmail.trim())) {
      errors.studentEmail = 'Please provide a valid email address (e.g., student@campus.edu).';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
