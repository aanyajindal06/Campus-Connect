import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Sparkles, Compass } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { EventCard } from '../components/events/EventCard';

export const SavedEventsPage = () => {
  const { events, bookmarks } = useEvents();

  const savedEvents = events.filter((e) => bookmarks.includes(e.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[75vh]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cream-100 border border-gold-500/30 text-navy-900 text-xs font-semibold mb-2">
            <Bookmark className="w-3.5 h-3.5 fill-gold-600 text-gold-600" />
            <span className="uppercase tracking-wider font-bold">Saved Collection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight font-serif">
            Bookmarked Events
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Events you've saved to keep an eye on before registering.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saved Items</span>
          <p className="text-3xl font-black text-navy-900 font-serif">{savedEvents.length}</p>
        </div>
      </div>

      {/* Grid or Empty */}
      {savedEvents.length === 0 ? (
        <div className="bg-white rounded border border-slate-200 p-12 text-center max-w-md mx-auto my-16 shadow-sm">
          <div className="w-16 h-16 rounded bg-cream-100 border border-gold-500/30 text-gold-600 flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-navy-900 font-serif">No Saved Events Yet</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Whenever you see an interesting event on the feed, tap the bookmark icon to save it here for later.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded bg-navy-900 text-gold-400 text-xs font-bold uppercase tracking-wider hover:bg-navy-800 shadow-sm transition-all"
          >
            <Compass className="w-4 h-4" /> Browse Campus Events
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};
