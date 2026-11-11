import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bookmark,
  Share2,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Shield,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateUtils';
import { validateRegistrationPayload } from '../utils/validators';

export const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, bookmarks, userRegistrations, handleRegister, handleCancelRegistration, handleToggleBookmark, showToast } = useEvents();
  const { currentUser } = useAuth();

  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    studentName: currentUser.name || '',
    studentEmail: currentUser.email || '',
    studentRoll: currentUser.roll || ''
  });

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Event Not Found</h2>
        <p className="text-xs text-slate-500 mt-1">
          The event you're looking for does not exist or may have been removed.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold hover:bg-brand-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(event.id);
  const isRegistered = userRegistrations.some((r) => r.eventId === event.id);

  const capacity = Number(event.capacity) || 0;
  const registeredCount = Number(event.registeredCount) || 0;
  const spotsLeft = Math.max(0, capacity - registeredCount);
  const isFull = spotsLeft <= 0;
  const percentageFilled = Math.min(100, Math.round((registeredCount / (capacity || 1)) * 100));

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard!', 'info');
    }
  };

  const onConfirmRegistration = (e) => {
    e.preventDefault();
    const validation = validateRegistrationPayload(formData);
    if (!validation.isValid) {
      setFormErrors(validation.errors);
      return;
    }
    setFormErrors({});
    handleRegister(event.id, formData);
    setRegisterModalOpen(false);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Top Banner Navigation Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discovery</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Share event link"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToggleBookmark(event.id)}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this event'}
              className={`p-1.5 rounded-lg transition-colors ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Banner Hero */}
        <div className="relative aspect-[21/9] sm:aspect-[2.4/1] w-full rounded-3xl overflow-hidden shadow-xl bg-slate-900">
          <img
            src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80'}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1400&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Banner Badges */}
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col justify-end">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded bg-navy-900/90 text-gold-400 border border-gold-500/40">
                {event.category}
              </span>
              {event.isFeatured && (
                <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded bg-gold-500 text-navy-950">
                  <Sparkles className="w-3.5 h-3.5 fill-navy-950" /> Featured Event
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight font-serif drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Agenda */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <div className="bg-white rounded border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-bold text-navy-900 font-serif mb-3">About This Event</h2>
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {event.description}
                </p>
              </div>

              {/* Tags */}
              {Array.isArray(event.tags) && event.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Topics & Highlights
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded bg-cream-100 border border-gold-500/30 text-navy-900 text-xs font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Organizer Information */}
              <div className="pt-4 border-t border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-navy-900 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold text-base font-serif">
                  {event.organizer ? event.organizer.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Organized by</p>
                  <p className="text-sm font-bold text-navy-900 font-serif">{event.organizer || 'Campus Council'}</p>
                </div>
              </div>
            </div>

            {/* Campus Event Policy Note */}
            <div className="bg-[#faf8f5] rounded p-5 border border-slate-200 flex items-start gap-3">
              <Shield className="w-5 h-5 text-gold-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-navy-900">Campus Attendance Policy:</strong> Please bring your official college student ID card to the venue for check-in. If you can no longer attend, please cancel your registration in advance to release the seat for waitlisted peers.
              </div>
            </div>
          </div>

          {/* Right Column: Registration Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded border border-slate-200 p-6 shadow-sm sticky top-32 space-y-5">
              {/* Event Logistics Highlights */}
              <div className="space-y-3.5 pb-5 border-b border-slate-100 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-cream-100 text-gold-600 shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">{formatDate(event.date)}</p>
                    <p className="text-slate-500">
                      {event.startTime} {event.endTime ? `– ${event.endTime}` : ''}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-cream-100 text-rose-600 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">Venue</p>
                    <p className="text-slate-500">{event.venue}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-cream-100 text-navy-800 shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900">Capacity & Spots</p>
                    <p className="text-slate-500">
                      {registeredCount} registered of {capacity} maximum seats
                    </p>
                  </div>
                </div>
              </div>

              {/* Capacity Progress Bar */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-slate-600">Registration Status</span>
                  <span className={isFull ? 'text-rose-600 font-bold' : 'text-navy-900'}>
                    {isFull ? 'Full (0 spots left)' : `${spotsLeft} seats available`}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 rounded-full ${
                      isFull ? 'bg-rose-500' : percentageFilled > 80 ? 'bg-amber-500' : 'bg-gold-500'
                    }`}
                    style={{ width: `${percentageFilled}%` }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              {isRegistered ? (
                <div className="space-y-3 pt-2">
                  <div className="p-4 rounded bg-emerald-50 border border-emerald-200 text-center">
                    <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-600 text-white mb-2">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-bold text-emerald-900">You're Registered!</p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Your seat is confirmed. Check your email or Registrations tab anytime.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCancelRegistration(event.id)}
                    className="w-full py-2.5 px-4 rounded text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 transition-colors"
                  >
                    Cancel Registration
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  <button
                    type="button"
                    disabled={isFull}
                    onClick={() => setRegisterModalOpen(true)}
                    className={`w-full py-3 px-4 rounded text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                      isFull
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        : 'bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-white'
                    }`}
                  >
                    {isFull ? 'Registration Full' : 'Register for Event'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleBookmark(event.id)}
                    className="w-full py-2.5 px-4 rounded text-xs font-semibold text-navy-900 bg-cream-100 hover:bg-cream-200 border border-gold-500/30 transition-colors flex items-center justify-center gap-2"
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-gold-600 text-gold-600' : ''}`} />
                    {isBookmarked ? 'Saved in Bookmarks' : 'Save for Later'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Confirmation Modal */}
      {registerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Confirm Your Registration</h3>
                <p className="text-xs text-slate-500">{event.title}</p>
              </div>
            </div>

            <form onSubmit={onConfirmRegistration} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => {
                    setFormData({ ...formData, studentName: e.target.value });
                    if (formErrors.studentName) setFormErrors({ ...formErrors, studentName: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                    formErrors.studentName ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {formErrors.studentName && <p className="text-xs text-rose-500 mt-1">{formErrors.studentName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Campus Email *
                </label>
                <input
                  type="email"
                  value={formData.studentEmail}
                  onChange={(e) => {
                    setFormData({ ...formData, studentEmail: e.target.value });
                    if (formErrors.studentEmail) setFormErrors({ ...formErrors, studentEmail: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                    formErrors.studentEmail ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {formErrors.studentEmail && <p className="text-xs text-rose-500 mt-1">{formErrors.studentEmail}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Student Roll / ID *
                </label>
                <input
                  type="text"
                  value={formData.studentRoll}
                  onChange={(e) => {
                    setFormData({ ...formData, studentRoll: e.target.value });
                    if (formErrors.studentRoll) setFormErrors({ ...formErrors, studentRoll: null });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 ${
                    formErrors.studentRoll ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200'
                  }`}
                />
                {formErrors.studentRoll && <p className="text-xs text-rose-500 mt-1">{formErrors.studentRoll}</p>}
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormErrors({});
                    setRegisterModalOpen(false);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all"
                >
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
