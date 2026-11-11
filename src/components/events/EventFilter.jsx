import React from 'react';
import { CATEGORIES } from '../../services/seedData';

export const EventFilter = ({
  selectedCategory,
  onSelectCategory,
  filterAvailableOnly,
  setFilterAvailableOnly,
  categoryCounts = {}
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-2">
      {/* Responsive Category Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none" role="tablist" aria-label="Event category filters">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat];

          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 uppercase tracking-wider ${
                isSelected
                  ? 'bg-navy-900 text-gold-400 shadow-sm border border-navy-900 font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 hover:text-navy-900'
              }`}
            >
              <span>{cat}</span>
              {count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] leading-none ${
                    isSelected
                      ? 'bg-gold-500 text-navy-950 font-bold'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Available Slots Toggle */}
      {setFilterAvailableOnly && (
        <div className="flex items-center gap-2 shrink-0">
          <label className="inline-flex items-center cursor-pointer select-none text-xs font-medium text-slate-700 hover:text-navy-900">
            <input
              type="checkbox"
              checked={filterAvailableOnly}
              onChange={(e) => setFilterAvailableOnly(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-gold-500 relative"></div>
            <span className="ml-2 font-medium">Available slots only</span>
          </label>
        </div>
      )}
    </div>
  );
};
