import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  PlusCircle,
  Users,
  Calendar,
  TrendingUp,
  Search,
  Eye,
  Edit2,
  Trash2,
  BarChart2,
  ExternalLink
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { formatDate } from '../utils/dateUtils';
import { EventFormModal } from '../components/admin/EventFormModal';
import { AttendeeListModal } from '../components/admin/AttendeeListModal';
import { DeleteConfirmModal } from '../components/admin/DeleteConfirmModal';
import { Link } from 'react-router-dom';

export const AdminDashboardPage = () => {
  const { events, handleCreateEvent, handleUpdateEvent, handleDeleteEvent } = useEvents();
  const { isAdmin, setRole } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedAttendeeEvent, setSelectedAttendeeEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);

  // Analytics Metrics
  const metrics = useMemo(() => {
    const totalEvents = events.length;
    const totalRegistrations = events.reduce((sum, e) => sum + (Number(e.registeredCount) || 0), 0);
    const totalCapacity = events.reduce((sum, e) => sum + (Number(e.capacity) || 0), 0);
    const avgFillRate = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

    return {
      totalEvents,
      totalRegistrations,
      totalCapacity,
      avgFillRate
    };
  }, [events]);

  // Filtered Events
  const filteredEvents = useMemo(() => {
    const q = (searchTerm || '').toLowerCase().trim();
    if (!q) return events || [];
    return (events || []).filter(
      (e) =>
        (e?.title || '').toLowerCase().includes(q) ||
        (e?.category || '').toLowerCase().includes(q) ||
        (e?.venue || '').toLowerCase().includes(q) ||
        (e?.organizer || '').toLowerCase().includes(q)
    );
  }, [events, searchTerm]);

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (evt) => {
    setEditingEvent(evt);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (payload) => {
    if (editingEvent) {
      handleUpdateEvent(editingEvent.id, payload);
    } else {
      handleCreateEvent(payload);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingEvent) {
      handleDeleteEvent(deletingEvent.id);
      setDeletingEvent(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded bg-cream-100 border border-gold-500/30 text-gold-600 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-navy-900 font-serif">Admin Mode Inactive</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
          You are currently viewing CampusConnect in Student persona. Switch to Admin mode to manage events and inspect attendees.
        </p>
        <button
          onClick={() => setRole('admin')}
          className="mt-6 px-6 py-2.5 rounded bg-gold-500 text-white text-xs font-bold uppercase tracking-wider hover:bg-gold-600 shadow-sm transition-all"
        >
          Switch to Admin Persona
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cream-100 border border-gold-500/30 text-navy-900 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
            <span className="uppercase tracking-wider font-bold">Campus Event Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight font-serif">
            Administrator Command Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, update, monitor attendee rosters, and manage the campus event lifecycle.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded bg-gold-500 hover:bg-gold-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm active:scale-95 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Event
        </button>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <div className="bg-white p-5 rounded border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-cream-100 border border-gold-500/30 text-navy-900 flex items-center justify-center shrink-0">
            <Calendar className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Events</p>
            <p className="text-2xl font-black text-navy-900 font-serif mt-0.5">{metrics.totalEvents}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-[#f4f8f4] border border-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl font-black text-navy-900 font-serif mt-0.5">{metrics.totalRegistrations}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-cream-100 border border-gold-500/30 text-gold-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Campus Capacity</p>
            <p className="text-2xl font-black text-navy-900 font-serif mt-0.5">{metrics.totalCapacity}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded bg-cream-100 border border-gold-500/30 text-navy-900 flex items-center justify-center shrink-0">
            <BarChart2 className="w-6 h-6 text-gold-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg Fill Rate</p>
            <p className="text-2xl font-black text-navy-900 font-serif mt-0.5">{metrics.avgFillRate}%</p>
          </div>
        </div>
      </div>

      {/* Events Management Table Container */}
      <div className="mt-10 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Table Search & Controls Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search events in table..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing {filteredEvents.length} of {events.length} events
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5">Event Title & Category</th>
                <th className="py-3.5 px-4">Date & Time</th>
                <th className="py-3.5 px-4">Venue</th>
                <th className="py-3.5 px-4">Attendance / Capacity</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredEvents.map((evt) => {
                const capacity = Number(evt.capacity) || 0;
                const registered = Number(evt.registeredCount) || 0;
                const fillPct = Math.min(100, Math.round((registered / (capacity || 1)) * 100));

                return (
                  <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Event Info */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={evt.bannerUrl}
                          alt={evt.title}
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 hover:text-brand-600 transition-colors">
                              {evt.title}
                            </span>
                            {evt.isFeatured && (
                              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded bg-amber-100 text-amber-800">
                                Featured
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                            <span className="font-semibold text-brand-600">{evt.category}</span>
                            <span>•</span>
                            <span>{evt.organizer}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-semibold text-slate-800">{formatDate(evt.date)}</p>
                      <p className="text-[11px] text-slate-400">{evt.startTime || 'All day'}</p>
                    </td>

                    {/* Venue */}
                    <td className="py-4 px-4 text-slate-600 max-w-[180px] truncate">
                      {evt.venue}
                    </td>

                    {/* Capacity Progress */}
                    <td className="py-4 px-4 whitespace-nowrap min-w-[150px]">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-bold text-slate-900">{registered}</span>
                        <span className="text-slate-400">/ {capacity} ({fillPct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            fillPct >= 100 ? 'bg-rose-500' : fillPct > 75 ? 'bg-amber-500' : 'bg-brand-600'
                          }`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1">
                        {/* View Attendees */}
                        <button
                          type="button"
                          onClick={() => setSelectedAttendeeEvent(evt)}
                          title="View attendee list"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                        >
                          <Users className="w-4 h-4" />
                        </button>

                        {/* Preview Public Page */}
                        <Link
                          to={`/events/${evt.id}`}
                          title="View public event page"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(evt)}
                          title="Edit event"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => setDeletingEvent(evt)}
                          title="Delete event"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <EventFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleFormSubmit}
        initialEvent={editingEvent}
      />

      <AttendeeListModal
        isOpen={Boolean(selectedAttendeeEvent)}
        onClose={() => setSelectedAttendeeEvent(null)}
        event={selectedAttendeeEvent}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deletingEvent)}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleConfirmDelete}
        eventTitle={deletingEvent?.title || ''}
      />
    </div>
  );
};
