import EventCard from '@/components/EventCard';
import FilterBar from '@/components/FilterBar';

// Sample fallback data
const fallbackEvents = [
  {
    id: 1,
    title: "Tech Conference 2024",
    type: "conference",
    location: "New York",
    category: "Technology",
    starts_at: new Date().toISOString(),
    description: "Annual technology conference",
    image_url: "https://placehold.co/1200x600?text=Tech+Conference"
  },
  {
    id: 2,
    title: "Business Workshop",
    type: "workshop",
    location: "London",
    category: "Business",
    starts_at: new Date(Date.now() + 86400000).toISOString(),
    description: "Business strategy workshop",
    image_url: "https://placehold.co/1200x600?text=Business+Workshop"
  }
];

async function getEvents() {
  try {
    const response = await fetch('https://68148b33225ff1af16292eee.mockapi.io/api/v1/events', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Disable caching for development
      cache: 'no-store',
      // Add revalidation
      next: { revalidate: 3600 }
    });

    if (!response.ok) {
      console.error('API response not ok:', response.status);
      return fallbackEvents;
    }

    const data = await response.json();
    
    if (!Array.isArray(data)) {
      console.error('Invalid data format received');
      return fallbackEvents;
    }

    return data.map(event => ({
      ...event,
      title: event.title || 'Untitled Event',
      type: event.type || 'General',
      location: event.location || 'Location TBA',
      category: event.category || 'General',
      starts_at: event.starts_at || new Date().toISOString(),
      description: event.description || 'No description available',
      image_url: event.image_url || 'https://placehold.co/1200x600?text=Event+Image'
    }));
  } catch (error) {
    console.error('Error fetching events:', error);
    return fallbackEvents;
  }
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Events</h1>
        <FilterBar />
        <div className="mt-8">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
              <p className="mt-1 text-sm text-gray-500">There are no events available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 