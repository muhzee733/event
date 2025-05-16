export function getEventStatus(event) {
  const now = new Date().getTime();
  const start = new Date(event.starts_at).getTime();
  const end = new Date(event.expires_at).getTime();

  if (now < start) return 'upcoming';
  if (now >= start && now <= end) return 'ongoing';
  return 'expired';
}

export function getCountdown(targetTime) {
  const now = new Date().getTime();
  const target = new Date(targetTime).getTime();
  const diff = target - now;
  if (diff <= 0) return null;

  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes };
}
