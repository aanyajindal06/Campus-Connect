import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarCheck, Calendar, Clock, MapPin, ArrowRight, XCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { formatDate } from '../utils/dateUtils';

export const MyRegistrationsPage = () => {
  const { events, userRegistrations, handleCancelRegistration } = useEvents();
  const [cancellingId, setCancellingId] = useState(null);

  // Match registration records with event details
  const registeredEvents = userRegistrations
    .map((reg) => {
      const event = events.find((e) => e.id === reg.eventId);
      return {
        ...reg,
        event
      };
    })
    .filter((item) => item.event !== undefined);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[75vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cream-100 border border-gold-500/30 text-navy-900 text-xs font-semibold mb-2">
            <CalendarCheck className="w-3.5 h-3.5 text-gold-600" />
            <span className="uppercase tracking-wider font-bold">Student Ticket Wallet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight font-serif">
            My Event Registrations
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your confirmed event passes and upcoming campus schedules.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Passes</span>
          <p className="text-3xl font-black text-navy-900 font-serif">{registeredEvents.length}</p>
        </div>
      </div>

      {/* Content */}
      {registeredEvents.length === 0 ? (
        <div className="bg-white rounded border border-slate-200 p-12 text-center max-w-md mx-auto my-16 shadow-sm">
          <div className="w-16 h-16 rounded bg-cream-100 border border-gold-500/30 text-gold-600 flex items-center justify-center mx-auto mb-4">
            <CalendarCheck className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-navy-900 font-serif">No Registrations Yet</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            You haven't reserved tickets for any college events yet. Browse our upcoming calendar to discover hackathons, concerts, and workshops!
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded bg-gold-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-gold-600 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" /> Explore Events
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {registeredEvents.map(({ id: regId, registeredAt, studentName, studentEmail, studentRoll, event }) => (
            <div
              key={regId}
              className="bg-white rounded border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col md:flex-row items-stretch"
            >
              {/* Event Image */}
              <div className="md:w-56 aspect-[16/9] md:aspect-auto relative shrink-0 bg-slate-100">
                <img
                  src={event.bannerUrl}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-navy-900/90 text-gold-400 border border-gold-500/30">
                  {event.category}
                </span>
              </div>

              {/* Event Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-[#f4f8f4] px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                      Confirmed Pass
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Booked on {formatDate(registeredAt)}
                    </span>
                  </div>

                  <Link to={`/events/${event.id}`}>
                    <h3 className="text-base sm:text-lg font-bold text-navy-900 hover:text-gold-600 transition-colors font-serif">
                      {event.title}
                    </h3>
                  </Link>

                  <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold-600" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    {event.startTime && (
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{event.startTime}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-600" />
                      <span>{event.venue}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                    <span>Attendee: <strong className="text-navy-900">{studentName}</strong></span>
                    {studentEmail && <span>Email: <strong className="text-navy-900">{studentEmail}</strong></span>}
                    {studentRoll && studentRoll !== 'N/A' && <span>Roll No: <strong className="text-navy-900">{studentRoll}</strong></span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleCancelRegistration(event.id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" /> Cancel Registration
                  </button>

                  <Link
                    to={`/events/${event.id}`}
                    className="text-xs font-bold text-navy-900 hover:text-gold-600 flex items-center gap-1 uppercase tracking-wider"
                  >
                    View Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
