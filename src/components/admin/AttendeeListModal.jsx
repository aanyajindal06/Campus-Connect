import React from 'react';
import { X, Users, Mail, Hash, Calendar } from 'lucide-react';
import { eventService } from '../../services/eventService';
import { formatDate } from '../../utils/dateUtils';

export const AttendeeListModal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  const attendees = eventService.getRegistrationsForEvent(event.id);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Registered Attendees</h2>
              <p className="text-xs text-slate-500 line-clamp-1">{event.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs text-slate-600">
            <span>
              Total Registrations: <strong className="text-slate-900">{attendees.length}</strong>
            </span>
            <span>
              Capacity: <strong className="text-slate-900">{event.capacity}</strong> (
              {Math.round((attendees.length / (event.capacity || 1)) * 100)}% filled)
            </span>
          </div>

          {attendees.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Users className="w-10 h-10 mx-auto stroke-[1.5] mb-2 opacity-60" />
              <p className="text-sm font-medium">No students registered yet.</p>
              <p className="text-xs mt-1">Registrations will populate here as students enroll.</p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
              {attendees.map((attendee, index) => (
                <div
                  key={attendee.id || index}
                  className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 bg-white transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                      {attendee.studentName ? attendee.studentName.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{attendee.studentName}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {attendee.studentEmail}
                        </span>
                        {attendee.studentRoll && (
                          <span className="flex items-center gap-1">
                            <Hash className="w-3 h-3 text-slate-400" />
                            {attendee.studentRoll}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right text-[11px] text-slate-400 flex items-center gap-1 shrink-0">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(attendee.registeredAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
