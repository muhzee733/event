'use client';

import { useState, useEffect } from 'react';

export default function FilterBar() {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    date: ''
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // Apply filters to all event cards
  useEffect(() => {
    const eventCards = document.querySelectorAll('[data-event-card]');
    let visibleCount = 0;
    
    eventCards.forEach(card => {
      const event = JSON.parse(card.dataset.event);
      
      // Search filter
      const matchesSearch = !search || 
        event.title?.toLowerCase().includes(search.toLowerCase());
      
      // Type filter
      const matchesType = !type || 
        event.type?.toLowerCase() === type.toLowerCase();
      
      // Location filter
      const matchesLocation = !filters.location || 
        event.location?.toLowerCase() === filters.location.toLowerCase();
      
      // Date filter
      const matchesDate = !filters.date || (() => {
        if (!event.starts_at) return false;
        
        const eventDate = new Date(event.starts_at);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        switch (filters.date) {
          case 'today': {
            const eventDateStr = eventDate.toDateString();
            const todayStr = today.toDateString();
            return eventDateStr === todayStr;
          }
          case 'tomorrow': {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return eventDate.toDateString() === tomorrow.toDateString();
          }
          case 'this-week': {
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            weekStart.setHours(0, 0, 0, 0);
            
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);
            
            return eventDate >= weekStart && eventDate <= weekEnd;
          }
          case 'this-month': {
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
            return eventDate >= startOfMonth && eventDate <= endOfMonth;
          }
          case 'next-month': {
            const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
            const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0, 23, 59, 59, 999);
            return eventDate >= startOfNextMonth && eventDate <= endOfNextMonth;
          }
          default:
            return true;
        }
      })();

      const isVisible = matchesSearch && matchesType && matchesLocation && matchesDate;
      card.style.display = isVisible ? 'block' : 'none';
      if (isVisible) visibleCount++;
    });

    // Show/hide no results message
    const noResultsMessage = document.getElementById('no-results-message');
    if (noResultsMessage) {
      noResultsMessage.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  }, [search, type, filters]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Events
          </label>
          <input
            type="text"
            id="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event name..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Event Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option value="conference">Conference</option>
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="meetup">Meetup</option>
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <select
            id="location"
            value={filters.location}
            onChange={(e) => handleFilterChange('location', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Locations</option>
            <option value="New York">New York</option>
            <option value="London">London</option>
            <option value="Tokyo">Tokyo</option>
            <option value="Paris">Paris</option>
            <option value="Berlin">Berlin</option>
          </select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <select
            id="date"
            value={filters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
            <option value="this-week">This Week</option>
            <option value="this-month">This Month</option>
            <option value="next-month">Next Month</option>
          </select>
        </div>
      </div>

      {/* No results message */}
      <div id="no-results-message" className="hidden text-center py-8 mt-4 bg-gray-50 rounded-lg">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
      </div>
    </div>
  );
}