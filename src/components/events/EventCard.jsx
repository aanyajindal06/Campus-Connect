import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bookmark,
  CheckCircle,
  ArrowRight,
  Shield
} from 'lucide-react';
import { formatDate } from '../../utils/dateUtils';
import { useEvents } from '../../context/EventContext';

export const EventCard = ({ event, onEdit, onDelete, showAdminControls = false }) => {
  const { bookmarks, handleToggleBookmark, userRegistrations, openRegistrationModal } = useEvents();

  const isBookmarked = bookmarks.includes(event.id);
  const isRegistered = userRegistrations.some((r) => r.eventId === event.id);

  const capacity = Number(event.capacity) || 0;
  const registeredCount = Number(event.registeredCount) || 0;
  const spotsLeft = Math.max(0, capacity - registeredCount);
  const isFull = spotsLeft <= 0;

  const getCapacityStatus = () => {
    if (isFull) {
      return { text: 'Full (Sold out)', color: 'bg-rose-50 text-rose-700 border-rose-200' };
    }
    if (spotsLeft <= 10) {
      return { text: `Only ${spotsLeft} spot${spotsLeft === 1 ? '' : 's'} left!`, color: 'bg-amber-50 text-amber-800 border-amber-200' };
    }
    return { text: `${spotsLeft} spots available`, color: 'bg-[#f4f8f4] text-emerald-800 border-emerald-200' };
  };

  const capacityStatus = getCapacityStatus();

  return (
    <div className="group bg-white rounded border border-slate-200 shadow-sm hover:shadow-lg hover:border-gold-400 transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Banner Image Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={event.bannerUrl || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80'}
          alt={event.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1000&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded bg-navy-900/90 text-gold-400 shadow-sm border border-gold-500/30">
            {event.category}
          </span>

          <div className="flex items-center gap-2">
            {event.isFeatured && (
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-gold-500 text-navy-950 shadow-sm">
                Featured
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleBookmark(event.id);
              }}
              title={isBookmarked ? 'Remove bookmark' : 'Bookmark this event'}
              className={`p-2 rounded backdrop-blur-md transition-all shadow-md ${
                isBookmarked
                  ? 'bg-gold-500 text-navy-950'
                  : 'bg-black/50 text-white hover:bg-gold-500 hover:text-navy-950'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-navy-950' : ''}`} />
            </button>
          </div>
        </div>

        {/* Capacity Ribbon on Banner */}
        <div className="absolute bottom-3 left-3">
          <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded border shadow-sm ${capacityStatus.color}`}>
            {capacityStatus.text}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/events/${event.id}`}>
            <h3 className="text-base font-bold text-navy-900 group-hover:text-gold-600 transition-colors line-clamp-1 font-serif">
              {event.title}
            </h3>
          </Link>

          <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-gold-600 shrink-0" />
              <span>{formatDate(event.date)}</span>
              {event.startTime && (
                <>
                  <span className="text-slate-300">•</span>
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{event.startTime}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="w-3.5 h-3.5 text-navy-700 shrink-0" />
              <span>
                <strong>{registeredCount}</strong> / {capacity} attendees
              </span>
            </div>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {showAdminControls ? (
            <div className="flex items-center justify-between w-full gap-2">
              <Link
                to={`/events/${event.id}`}
                className="text-xs font-semibold text-navy-800 hover:text-gold-600 flex items-center gap-1"
              >
                Preview <ArrowRight className="w-3 h-3" />
              </Link>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(event)}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(event)}
                  className="px-3 py-1.5 text-xs font-semibold rounded bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ) : (
            <>
              {isRegistered ? (
                <div className="w-full flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                    <CheckCircle className="w-3.5 h-3.5" /> Registered
                  </span>
                  <Link
                    to={`/events/${event.id}`}
                    className="text-xs font-bold text-navy-900 hover:text-gold-600 flex items-center gap-1 uppercase tracking-wider"
                  >
                    Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              ) : (
                <div className="w-full flex items-center justify-between gap-2">
                  <Link
                    to={`/events/${event.id}`}
                    className="text-xs font-semibold text-slate-600 hover:text-navy-900 py-1.5"
                  >
                    View Details
                  </Link>
                  <button
                    type="button"
                    disabled={isFull}
                    onClick={() => openRegistrationModal(event)}
                    className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded transition-all shadow-sm ${
                      isFull
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-gold-500 text-white hover:bg-gold-600 active:bg-gold-700'
                    }`}
                  >
                    {isFull ? 'Sold Out' : 'Register'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
