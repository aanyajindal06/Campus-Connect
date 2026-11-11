import React, { useState } from 'react';
import { Shield, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';

export const Footer = () => {
  const [email, setEmail] = useState('');
  const { showToast } = useEvents();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    showToast('Thank you for subscribing to campus event updates!', 'success');
    setEmail('');
  };

  return (
    <footer className="mt-auto">
      {/* "STAY CONNECTED" Banner matching reference image */}
      <div className="bg-[#f4ede3] border-t border-b border-[#e7decb] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 tracking-wider uppercase font-serif">
                Stay Connected
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Get weekly campus event schedules, ticket drops, and festival announcements.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md w-full">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-500 shadow-inner"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors whitespace-nowrap shadow-sm"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Deep Navy Footer */}
      <div className="bg-navy-900 text-slate-300 pt-12 pb-8 border-t border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-10 border-b border-navy-800">
            {/* Column 1: Brand & Address */}
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-navy-800 border border-gold-500/50 flex items-center justify-center text-gold-400">
                  <Shield className="w-5 h-5 stroke-[1.75]" />
                </div>
                <div>
                  <span className="text-lg font-bold text-white font-serif tracking-tight block">
                    Campus<span className="text-gold-400">Connect</span>
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block">
                    Collegiate Event Management
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400 max-w-sm leading-relaxed pt-1">
                2537 Southfield River Road, University Central Park
                <br />
                Student Activity Hub &bull; Helpdesk +1 (555) 019-2834
              </p>
            </div>

            {/* Column 2: Resources */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-3 font-sans">
                Resources
              </h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/" className="hover:text-gold-400 transition-colors">Event Calendar</Link></li>
                <li><Link to="/my-events" className="hover:text-gold-400 transition-colors">Ticket Wallet</Link></li>
                <li><Link to="/bookmarks" className="hover:text-gold-400 transition-colors">Saved Events</Link></li>
                <li><a href="#programs" className="hover:text-gold-400 transition-colors">Campus Venues</a></li>
              </ul>
            </div>

            {/* Column 3: Departments & Clubs */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-3 font-sans">
                Departments
              </h4>
              <ul className="space-y-2 text-xs">
                <li><span className="text-slate-400">Computer Science & ACM</span></li>
                <li><span className="text-slate-400">Cultural & Arts Council</span></li>
                <li><span className="text-slate-400">Physical Education Board</span></li>
                <li><span className="text-slate-400">Career Placement Cell</span></li>
              </ul>
            </div>

            {/* Column 4: Legal & Policies */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-3 font-sans">
                Legal & Policies
              </h4>
              <ul className="space-y-2 text-xs">
                <li><span className="text-slate-400">Attendance Policy</span></li>
                <li><span className="text-slate-400">Student Code of Conduct</span></li>
                <li><span className="text-slate-400">Privacy & Terms</span></li>
                <li><span className="text-slate-400">Campus Accessibility</span></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Socials */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>&copy; {new Date().getFullYear()} CampusConnect. All rights reserved.</p>

            {/* Circular Social Icons */}
            <div className="flex items-center gap-3">
              <a href="#" className="w-8 h-8 rounded-full bg-navy-800 hover:bg-gold-500 hover:text-navy-950 flex items-center justify-center transition-colors text-slate-300">
                <span className="font-bold text-[11px]">f</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-navy-800 hover:bg-gold-500 hover:text-navy-950 flex items-center justify-center transition-colors text-slate-300">
                <span className="font-bold text-[11px]">&copy;</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-navy-800 hover:bg-gold-500 hover:text-navy-950 flex items-center justify-center transition-colors text-slate-300">
                <span className="font-bold text-[11px]">&times;</span>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-navy-800 hover:bg-gold-500 hover:text-navy-950 flex items-center justify-center transition-colors text-slate-300">
                <span className="font-bold text-[11px]">&#9654;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
