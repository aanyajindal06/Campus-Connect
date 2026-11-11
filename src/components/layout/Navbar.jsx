import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Compass,
  CalendarCheck,
  Bookmark,
  ShieldCheck,
  User,
  Menu,
  X,
  Shield,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';

export const Navbar = () => {
  const { role, toggleRole, isAdmin, currentUser } = useAuth();
  const { bookmarks, userRegistrations, handleResetData } = useEvents();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-navy-900 border-b border-navy-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo with Collegiate Crest */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-lg bg-navy-800 border border-gold-500/40 flex items-center justify-center text-gold-400 shadow-sm group-hover:border-gold-400 transition-colors">
              <Shield className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-serif leading-none">
                Campus<span className="text-gold-400">Connect</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-300 uppercase font-sans mt-1">
                College Event Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            <Link
              to="/"
              className={`transition-colors py-1 ${
                isActive('/')
                  ? 'text-gold-400 border-b-2 border-gold-400 font-semibold'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              Discover Events
            </Link>

            <Link
              to="/my-events"
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                isActive('/my-events')
                  ? 'text-gold-400 border-b-2 border-gold-400 font-semibold'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              <span>My Registrations</span>
              {userRegistrations.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-gold-500 text-navy-950">
                  {userRegistrations.length}
                </span>
              )}
            </Link>

            <Link
              to="/bookmarks"
              className={`flex items-center gap-1.5 transition-colors py-1 ${
                isActive('/bookmarks')
                  ? 'text-gold-400 border-b-2 border-gold-400 font-semibold'
                  : 'text-slate-200 hover:text-white'
              }`}
            >
              <span>Saved Events</span>
              {bookmarks.length > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-gold-500/30 text-gold-300 border border-gold-500/40">
                  {bookmarks.length}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`transition-colors py-1 flex items-center gap-1.5 ${
                  isActive('/admin')
                    ? 'text-gold-400 border-b-2 border-gold-400 font-semibold'
                    : 'text-gold-300 hover:text-gold-200'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </nav>

          {/* Right Action: Persona Switcher & Reset Button */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={handleResetData}
              title="Reset sample events to default"
              className="p-2 text-slate-300 hover:text-white hover:bg-navy-800 rounded-md transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Persona Switcher Styled in Golden University Accent */}
            <div className="flex items-center bg-navy-800/90 border border-navy-700 p-1 rounded-md">
              <button
                type="button"
                onClick={() => role !== 'student' && toggleRole()}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                  !isAdmin
                    ? 'bg-gold-500 text-navy-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Student
              </button>
              <button
                type="button"
                onClick={() => role !== 'admin' && toggleRole()}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                  isAdmin
                    ? 'bg-gold-500 text-navy-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={toggleRole}
              className={`px-2.5 py-1 text-xs font-semibold rounded border ${
                isAdmin
                  ? 'bg-gold-500 text-navy-950 border-gold-500'
                  : 'bg-navy-800 text-slate-200 border-navy-700'
              }`}
            >
              {isAdmin ? 'Admin' : 'Student'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded text-slate-200 hover:text-white hover:bg-navy-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-navy-800 bg-navy-950 px-4 pt-3 pb-5 space-y-2 text-sm">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2 rounded ${
              isActive('/') ? 'bg-navy-800 text-gold-400 font-semibold' : 'text-slate-200'
            }`}
          >
            <span>Discover Events</span>
          </Link>
          <Link
            to="/my-events"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2 rounded ${
              isActive('/my-events') ? 'bg-navy-800 text-gold-400 font-semibold' : 'text-slate-200'
            }`}
          >
            <span>My Registrations</span>
            {userRegistrations.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-gold-500 text-navy-950">
                {userRegistrations.length}
              </span>
            )}
          </Link>
          <Link
            to="/bookmarks"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center justify-between px-3 py-2 rounded ${
              isActive('/bookmarks') ? 'bg-navy-800 text-gold-400 font-semibold' : 'text-slate-200'
            }`}
          >
            <span>Saved Events</span>
            {bookmarks.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-gold-500/20 text-gold-300">
                {bookmarks.length}
              </span>
            )}
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded bg-navy-800/80 text-gold-400 font-semibold"
            >
              <span>Admin Panel</span>
            </Link>
          )}

          <div className="pt-3 border-t border-navy-800 flex items-center justify-between text-xs text-slate-400">
            <span>Signed in as: <strong className="text-white">{currentUser.name}</strong></span>
            <button
              onClick={() => {
                handleResetData();
                setMobileMenuOpen(false);
              }}
              className="text-gold-400 hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
