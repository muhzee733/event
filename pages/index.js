import React, { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';
import FilterBar from '../components/FilterBar';

export async function getStaticProps() {
  const res = await fetch('https://68148b33225ff1af16292eee.mockapi.io/api/v1/events');
  const events = await res.json();

  return {
    props: { events },
    revalidate: 60,
  };
}

export default function Home({ events }) {
  const [filtered, setFiltered] = useState(events);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const filterEvents = async () => {
      setIsSearching(true);
      setIsLoading(true);
      try {
        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
        let temp = events;
        if (search) {
          temp = temp.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
        }
        if (type) {
          temp = temp.filter(e => e.type === type);
        }
        setFiltered(temp);
      } finally {
        setIsLoading(false);
        // Keep the searching state for a bit longer to show the loading UI
        setTimeout(() => setIsSearching(false), 300);
      }
    };

    const timeoutId = setTimeout(filterEvents, 300);
    return () => clearTimeout(timeoutId);
  }, [search, type, events]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Events Listing</h1>
          <p className="text-gray-600">Discover and explore upcoming events</p>
        </div>
        
        <FilterBar 
          search={search} 
          setSearch={setSearch} 
          type={type} 
          setType={setType} 
          isLoading={isLoading}
        />

        {isSearching ? (
          <div className="flex justify-center items-center py-12">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Searching events...</p>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {search || type
                ? "Try adjusting your search or filter to find what you're looking for."
                : "There are no events available at the moment."}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
