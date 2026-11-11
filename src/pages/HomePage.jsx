import React, { useState, useMemo, useRef } from 'react';
import { SearchBar } from '../components/events/SearchBar';
import { EventFilter } from '../components/events/EventFilter';
import { EventCard } from '../components/events/EventCard';
import { useEvents } from '../context/EventContext';
import {
  Calendar,
  SearchX,
  PlusCircle,
  Award,
  Users2,
  Globe2,
  Briefcase,
  Landmark,
  ArrowRight,
  Microscope,
  Palette,
  Stethoscope,
  Cpu,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { formatDate } from '../utils/dateUtils';

export const HomePage = () => {
  const { events, loading } = useEvents();
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);

  const eventsSectionRef = useRef(null);

  const scrollToEvents = (cat = 'All') => {
    setSelectedCategory(cat);
    if (eventsSectionRef.current) {
      eventsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts = { All: events.length, Technical: 0, Cultural: 0, Sports: 0, Workshop: 0 };
    events.forEach((evt) => {
      const cat = (evt.category || '').toLowerCase();
      if (cat === 'technical' || cat === 'technology') {
        counts.Technical = (counts.Technical || 0) + 1;
      } else if (cat === 'cultural') {
        counts.Cultural = (counts.Cultural || 0) + 1;
      } else if (cat === 'sports') {
        counts.Sports = (counts.Sports || 0) + 1;
      } else if (cat === 'workshop' || cat === 'workshops') {
        counts.Workshop = (counts.Workshop || 0) + 1;
      }
    });
    return counts;
  }, [events]);

  // Combined Search by Title & Category Filtering
  const filteredEvents = useMemo(() => {
    return events.filter((evt) => {
      // 1. Category Filter: Technical, Cultural, Sports, Workshop (or All)
      if (selectedCategory !== 'All') {
        const target = selectedCategory.toLowerCase();
        const cat = (evt.category || '').toLowerCase();
        const matchesCategory =
          cat === target ||
          (target === 'technical' && cat === 'technology') ||
          (target === 'workshop' && cat === 'workshops');

        if (!matchesCategory) return false;
      }

      // 2. Search by event title
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesTitle = evt.title?.toLowerCase().includes(query);
        if (!matchesTitle) return false;
      }

      // 3. Optional available slots filter
      if (filterAvailableOnly) {
        const capacity = Number(evt.capacity) || 0;
        const registered = Number(evt.registeredCount) || 0;
        if (registered >= capacity) return false;
      }

      return true;
    });
  }, [events, selectedCategory, filterAvailableOnly, searchTerm]);

  // Program Category Cards matching the required categories
  const programCards = [
    {
      title: 'Technical',
      category: 'Technical',
      icon: <Cpu className="w-10 h-10 text-navy-800" />,
      description: 'Hackathons, algorithmic coding competitions, and AI robotics demonstrations.'
    },
    {
      title: 'Cultural',
      category: 'Cultural',
      icon: <Palette className="w-10 h-10 text-navy-800" />,
      description: 'Inter-college indie music concerts, theatrical plays, and creative exhibitions.'
    },
    {
      title: 'Sports',
      category: 'Sports',
      icon: <Stethoscope className="w-10 h-10 text-navy-800" />,
      description: 'Inter-departmental football cups, campus tournaments, and fitness marathons.'
    },
    {
      title: 'Workshop',
      category: 'Workshop',
      icon: <Microscope className="w-10 h-10 text-navy-800" />,
      description: 'Hands-on AI bootcamps, design sprints, and practical technical seminars.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. HERO SECTION: Matching reference image (Ivy-league campus with students on lawn) */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center bg-navy-950 overflow-hidden">
        {/* Background Image of Collegiate Hall & Students */}
        <img
          src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=2000&q=80"
          alt="Southfield / Campus Students"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-85"
        />
        {/* Subtle gradient vignette to ensure high legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 via-navy-950/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-black/20" />

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            <p className="text-white text-xs sm:text-sm font-bold tracking-widest uppercase mb-3 drop-shadow">
              Welcome to CampusConnect
            </p>

            <h1 className="text-4xl sm:text-6xl font-black text-white uppercase tracking-tight font-serif drop-shadow-md leading-[1.1]">
              Discover Your <br />
              Future.
            </h1>

            <p className="mt-4 text-sm sm:text-base text-slate-100 max-w-lg leading-relaxed drop-shadow">
              The premier collegiate hub to discover competitions, register for conferences, and connect with vibrant student societies.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={() => scrollToEvents('All')}
                className="px-6 py-3 bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-white font-bold text-xs uppercase tracking-wider rounded transition-all shadow-md"
              >
                Learn More
              </button>
              <button
                onClick={() => scrollToEvents('All')}
                className="px-6 py-3 bg-transparent hover:bg-white/10 text-white border border-white font-bold text-xs uppercase tracking-wider rounded transition-all flex items-center gap-2"
              >
                <span>Explore Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "WHY CHOOSE CAMPUSCONNECT?" Section: 5 illustrated columns */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 uppercase tracking-wider font-serif">
            Why Choose CampusConnect?
          </h2>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-center">
            {/* 1. Academic Excellence */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-cream-100 border border-gold-500/30 flex items-center justify-center text-navy-900 mb-4 shadow-sm">
                <Award className="w-8 h-8 text-gold-600 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-bold text-navy-900 font-serif">Academic Excellence</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-[200px]">
                Research symposiums, hackathons, and guest faculty keynotes.
              </p>
            </div>

            {/* 2. Vibrant Community */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-cream-100 border border-gold-500/30 flex items-center justify-center text-navy-900 mb-4 shadow-sm">
                <Users2 className="w-8 h-8 text-gold-600 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-bold text-navy-900 font-serif">Vibrant Community</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-[200px]">
                Active student clubs, campus fraternities, and cultural groups.
              </p>
            </div>

            {/* 3. Global Opportunities */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-cream-100 border border-gold-500/30 flex items-center justify-center text-navy-900 mb-4 shadow-sm">
                <Globe2 className="w-8 h-8 text-gold-600 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-bold text-navy-900 font-serif">Global Opportunities</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-[200px]">
                Inter-college championships, summit delegations, and networking.
              </p>
            </div>

            {/* 4. Career Ready */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-cream-100 border border-gold-500/30 flex items-center justify-center text-navy-900 mb-4 shadow-sm">
                <Briefcase className="w-8 h-8 text-gold-600 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-bold text-navy-900 font-serif">Career Ready</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-[200px]">
                Direct recruiter pipelines, resume clinics, and career fairs.
              </p>
            </div>

            {/* 5. Beautiful Campus */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-lg bg-cream-100 border border-gold-500/30 flex items-center justify-center text-navy-900 mb-4 shadow-sm">
                <Landmark className="w-8 h-8 text-gold-600 stroke-[1.75]" />
              </div>
              <h3 className="text-sm font-bold text-navy-900 font-serif">Beautiful Campus</h3>
              <p className="mt-2 text-xs text-slate-500 leading-relaxed max-w-[200px]">
                Historic amphitheatres, sports arenas, and modern halls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "EXPLORE OUR PROGRAMS" Section: 5 Category Box Cards */}
      <section id="programs" className="py-16 bg-[#faf8f5] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-navy-900 uppercase tracking-wider font-serif">
            Explore Our Programs
          </h2>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {programCards.map((prog, index) => (
              <div
                key={index}
                className="bg-[#f5eee2] border border-[#e8ddcb] rounded p-6 flex flex-col justify-between items-center text-center hover:shadow-md hover:border-gold-500 transition-all group"
              >
                <div>
                  <div className="w-20 h-20 rounded-lg bg-white/80 border border-[#e0d3be] flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
                    {prog.icon}
                  </div>
                  <h3 className="text-sm font-bold text-navy-900 font-serif">{prog.title}</h3>
                  <p className="mt-2 text-[11px] text-slate-600 leading-relaxed">
                    {prog.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => scrollToEvents(prog.category)}
                  className="mt-6 px-4 py-2 bg-gold-500 hover:bg-gold-600 active:bg-gold-700 text-white font-bold text-[11px] uppercase tracking-wider rounded transition-colors w-full"
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. STATS BAR: Deep Navy Blue matching reference image */}
      <section className="bg-navy-900 text-white py-12 border-t border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-navy-700/80 text-center">
            <div className="py-4 md:py-0 px-4">
              <p className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
                12,500+
              </p>
              <p className="text-xs uppercase tracking-widest text-gold-400 mt-1 font-semibold">
                Students
              </p>
            </div>

            <div className="py-4 md:py-0 px-4">
              <p className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
                120+
              </p>
              <p className="text-xs uppercase tracking-widest text-gold-400 mt-1 font-semibold">
                Events Hosted
              </p>
            </div>

            <div className="py-4 md:py-0 px-4">
              <p className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
                50+
              </p>
              <p className="text-xs uppercase tracking-widest text-gold-400 mt-1 font-semibold">
                Clubs & Groups
              </p>
            </div>

            <div className="py-4 md:py-0 px-4">
              <p className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
                98%
              </p>
              <p className="text-xs uppercase tracking-widest text-gold-400 mt-1 font-semibold">
                Attendance Rate
              </p>
            </div>

            <div className="py-4 md:py-0 px-4 col-span-2 md:col-span-1">
              <p className="text-3xl sm:text-4xl font-black font-serif text-white tracking-tight">
                150+
              </p>
              <p className="text-xs uppercase tracking-widest text-gold-400 mt-1 font-semibold">
                Years of Excellence
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DUAL-COLUMN SECTION: "LATEST NEWS" & "UPCOMING EVENTS" */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Latest News */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-navy-900 uppercase tracking-wider font-serif pb-3 border-b-2 border-navy-900">
                Latest News
              </h2>

              <div className="divide-y divide-slate-100">
                <article className="py-4">
                  <h3 className="text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors cursor-pointer">
                    CampusConnect: Annual Technology & Innovation Summit Scheduled
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">October 17, 2026</p>
                </article>

                <article className="py-4">
                  <h3 className="text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors cursor-pointer">
                    Student Activity Center Announces Extended Night Study Hours
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">October 17, 2026</p>
                </article>

                <article className="py-4">
                  <h3 className="text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors cursor-pointer">
                    University Cultural Council Opens Auditions for Autumn Fest
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">October 17, 2026</p>
                </article>
              </div>
            </div>

            {/* Right Column: Upcoming Events List */}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-navy-900 uppercase tracking-wider font-serif pb-3 border-b-2 border-navy-900">
                Upcoming Events
              </h2>

              <div className="divide-y divide-slate-100">
                {events.slice(0, 3).map((evt) => (
                  <div key={evt.id} className="py-4 flex items-center justify-between gap-4">
                    <div>
                      <Link to={`/events/${evt.id}`}>
                        <h3 className="text-sm font-bold text-navy-900 hover:text-gold-600 transition-colors line-clamp-1">
                          {evt.title}
                        </h3>
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatDate(evt.date)} • {evt.startTime}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{evt.venue}</p>
                    </div>

                    <Link
                      to={`/events/${evt.id}`}
                      className="px-3 py-1.5 bg-navy-900 hover:bg-gold-500 text-white hover:text-navy-950 font-bold text-xs uppercase tracking-wider rounded transition-colors whitespace-nowrap shrink-0"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE EVENTS DIRECTORY & FILTERS */}
      <section ref={eventsSectionRef} className="py-16 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-gold-600 uppercase tracking-widest block mb-1">
                Collegiate Calendar
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-navy-900 uppercase tracking-wider font-serif">
                Discover All Events
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'}
                {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
                {searchTerm ? ` matching "${searchTerm}"` : ''}
              </p>
            </div>

            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded bg-gold-500 hover:bg-gold-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-sm self-start md:self-auto"
              >
                <PlusCircle className="w-4 h-4" />
                Add Event as Admin
              </Link>
            )}
          </div>

          {/* Search Bar */}
          <div className="mb-4">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search hackathons, workshops, cultural fests, sports..."
            />
          </div>

          {/* Category Filter Pills & Availability Toggle */}
          <div className="bg-white rounded border border-slate-200 p-4 mb-8 shadow-sm">
            <EventFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              filterAvailableOnly={filterAvailableOnly}
              setFilterAvailableOnly={setFilterAvailableOnly}
              categoryCounts={categoryCounts}
            />
          </div>

          {/* Grid or Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="bg-white rounded h-80 border border-slate-200 p-4" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="bg-white rounded border border-slate-200 p-10 sm:p-14 text-center max-w-lg mx-auto my-10 shadow-sm animate-in fade-in duration-200">
              <div className="w-16 h-16 rounded bg-cream-100 text-slate-400 flex items-center justify-center mx-auto mb-4 border border-gold-500/20">
                <SearchX className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-lg font-bold text-navy-900 font-serif">No Events Found</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                {searchTerm && selectedCategory !== 'All' ? (
                  <>
                    No events found with title matching <strong className="text-navy-900">"{searchTerm}"</strong> under the{' '}
                    <strong className="text-navy-900">{selectedCategory}</strong> category.
                  </>
                ) : searchTerm ? (
                  <>
                    No events found with title matching <strong className="text-navy-900">"{searchTerm}"</strong>.
                  </>
                ) : selectedCategory !== 'All' ? (
                  <>
                    There are currently no events listed under the <strong className="text-navy-900">{selectedCategory}</strong> category.
                  </>
                ) : (
                  'No events currently match your selected filters.'
                )}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-navy-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded transition-colors"
                  >
                    Clear Search Title
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                    setFilterAvailableOnly(false);
                  }}
                  className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-white bg-gold-500 hover:bg-gold-600 rounded transition-colors shadow-sm"
                >
                  Reset All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
