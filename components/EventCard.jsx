import Link from "next/link";
import { getEventStatus, getCountdown } from "../utils/timeUtils";
import { useState } from "react";

export default function EventCard({ event }) {
  const [imageError, setImageError] = useState(false);
  const status = getEventStatus(event);
  const countdown =
    status === "upcoming"
      ? getCountdown(event.starts_at)
      : status === "ongoing"
      ? getCountdown(event.expires_at)
      : null;

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Link href={`/event/${event.id}`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative h-48">
          <img
            src={imageError ? "https://placehold.co/600x400?text=Event+Image" : event.image_url}
            alt={event.title}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
          <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{event.title}</h2>
          <div className="flex items-center text-gray-600 mb-2">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-sm">{event.location}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <span className="text-sm">{event.type}</span>
          </div>
          {countdown && (
            <div className="flex items-center text-blue-600 font-medium">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">
                {status === "upcoming" ? "Starting in" : "Ending in"} {countdown.days}d : {countdown.hours}h : {countdown.minutes}m
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
