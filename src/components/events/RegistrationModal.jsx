import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Calendar, MapPin, AlertCircle, ArrowRight, Ticket, Shield } from 'lucide-react';
import { useEvents } from '../../context/EventContext';
import { useAuth } from '../../context/AuthContext';
import { validateRegistrationPayload } from '../../utils/validators';
import { formatDate } from '../../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

export const RegistrationModal = ({ isOpen, onClose, preselectedEvent = null }) => {
  const { events, handleRegister } = useEvents();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    eventId: '',
    studentName: '',
    studentEmail: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRegistration, setConfirmedRegistration] = useState(null);

  // Initialize form when modal opens or preselectedEvent changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        eventId: preselectedEvent?.id || (events[0]?.id || ''),
        studentName: currentUser?.name || '',
        studentEmail: currentUser?.email || ''
      });
      setErrors({});
      setConfirmedRegistration(null);
      setIsSubmitting(false);
    }
  }, [isOpen, preselectedEvent, events, currentUser]);

  if (!isOpen) return null;

  const selectedEvent = events.find((e) => e.id === formData.eventId) || preselectedEvent;
  const isFull = selectedEvent ? Number(selectedEvent.registeredCount) >= Number(selectedEvent.capacity) : false;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validation = validateRegistrationPayload(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    if (isFull) {
      setErrors({ eventId: 'This event is currently at maximum capacity.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await handleRegister(formData.eventId, {
        studentName: formData.studentName,
        studentEmail: formData.studentEmail
      });

      if (result) {
        setConfirmedRegistration({
          event: selectedEvent,
          name: formData.studentName,
          email: formData.studentEmail,
          passId: `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          date: new Date().toISOString()
        });
      }
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateToMyEvents = () => {
    onClose();
    navigate('/my-events');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded border border-slate-200 max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-cream-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-navy-900 text-gold-400 flex items-center justify-center border border-gold-500/30">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-navy-900 font-serif">
                {confirmedRegistration ? 'Registration Confirmed' : 'Event Registration'}
              </h2>
              <p className="text-xs text-slate-500">
                {confirmedRegistration ? 'Your campus pass is verified' : 'Complete details to secure your pass'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content: Form OR Success Confirmation */}
        {confirmedRegistration ? (
          <div className="p-6 sm:p-8 text-center">
            {/* Success Check Badge */}
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-in zoom-in-50 duration-200">
              <CheckCircle className="w-9 h-9" />
            </div>

            <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
              Registration Successful
            </span>

            <h3 className="text-xl font-bold text-navy-900 font-serif mt-2">
              You're Going!
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              A seat has been reserved in your name and saved to your device.
            </p>

            {/* Ticket Card Summary */}
            <div className="mt-6 bg-[#faf8f5] border border-slate-200 rounded p-5 text-left space-y-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-600">Event</span>
                <p className="text-sm font-bold text-navy-900 font-serif">{confirmedRegistration.event?.title}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Date & Time</span>
                  <span className="text-slate-800 font-medium">
                    {formatDate(confirmedRegistration.event?.date)} • {confirmedRegistration.event?.startTime}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Venue</span>
                  <span className="text-slate-800 font-medium">{confirmedRegistration.event?.venue}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Attendee</span>
                  <span className="text-slate-800 font-medium">{confirmedRegistration.name}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Email</span>
                  <span className="text-slate-800 font-medium truncate block">{confirmedRegistration.email}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[10px] uppercase font-mono tracking-wider">Pass Reference:</span>
                <span className="font-mono font-bold text-navy-900">{confirmedRegistration.passId}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={handleNavigateToMyEvents}
                className="w-full sm:w-1/2 py-2.5 px-4 bg-navy-900 hover:bg-gold-500 text-white hover:text-navy-950 font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span>My Registrations</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Global Error Notice (e.g. duplicate email or full capacity) */}
            {errors.form && (
              <div className="p-3.5 rounded bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-700 animate-in fade-in duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* 1. Event Selection */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Select Event *
              </label>
              <select
                value={formData.eventId}
                onChange={(e) => {
                  setFormData({ ...formData, eventId: e.target.value });
                  if (errors.eventId) setErrors({ ...errors, eventId: null });
                }}
                className={`w-full px-3.5 py-2.5 bg-white border rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                  errors.eventId ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({formatDate(evt.date)}) — [{evt.category}]
                  </option>
                ))}
              </select>
              {errors.eventId && <p className="text-xs text-rose-500 mt-1">{errors.eventId}</p>}
            </div>

            {/* Selected Event Preview Card */}
            {selectedEvent && (
              <div className="bg-[#faf8f5] border border-slate-200 p-3 rounded text-xs text-slate-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-900 line-clamp-1">{selectedEvent.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-navy-900 text-gold-400">
                    {selectedEvent.category}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-gold-600" />
                    {formatDate(selectedEvent.date)}
                  </span>
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-rose-600" />
                    {selectedEvent.venue}
                  </span>
                </div>
                {isFull && (
                  <p className="text-[11px] font-bold text-rose-600 pt-1">
                    ⚠️ Event is sold out (maximum capacity reached).
                  </p>
                )}
              </div>
            )}

            {/* 2. Student Full Name */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Alex Morgan"
                value={formData.studentName}
                onChange={(e) => {
                  setFormData({ ...formData, studentName: e.target.value });
                  if (errors.studentName) setErrors({ ...errors, studentName: null });
                }}
                className={`w-full px-3.5 py-2.5 bg-white border rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                  errors.studentName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.studentName && <p className="text-xs text-rose-500 mt-1">{errors.studentName}</p>}
            </div>

            {/* 3. Student Email */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                Student Email *
              </label>
              <input
                type="email"
                placeholder="e.g. alex.morgan@campus.edu"
                value={formData.studentEmail}
                onChange={(e) => {
                  setFormData({ ...formData, studentEmail: e.target.value });
                  if (errors.studentEmail) setErrors({ ...errors, studentEmail: null });
                }}
                className={`w-full px-3.5 py-2.5 bg-white border rounded text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500/50 ${
                  errors.studentEmail ? 'border-rose-400 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {errors.studentEmail && <p className="text-xs text-rose-500 mt-1">{errors.studentEmail}</p>}
              <p className="text-[11px] text-slate-400 mt-1">
                Tickets are bound to your verified email. Duplicate registrations with the same email will be rejected.
              </p>
            </div>

            {/* Submit & Cancel Buttons */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-navy-900 uppercase tracking-wider transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || isFull}
                className={`px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
                  isFull || isSubmitting
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-white'
                }`}
              >
                {isSubmitting ? 'Registering...' : isFull ? 'Event Full' : 'Confirm Registration'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
