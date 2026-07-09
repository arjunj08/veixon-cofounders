export interface VeixonNotification {
  id: string;
  text: string;
  time: string;
  timestamp: number;
  read: boolean;
  link?: string;
}

const DEFAULT_NOTIFICATIONS: VeixonNotification[] = [
  { id: '1', text: 'VZN Co-founder profile initialized.', time: 'Just now', timestamp: Date.now(), read: false },
  { id: '2', text: 'Day 1 task verified. 1% progress logged.', time: '2 hours ago', timestamp: Date.now() - 7200000, read: false },
  { id: '3', text: 'Scorecard analysis complete: risk vector updated.', time: '1 day ago', timestamp: Date.now() - 86400000, read: true },
];

export function getNotifications(): VeixonNotification[] {
  if (typeof window === 'undefined') return DEFAULT_NOTIFICATIONS;
  
  const stored = localStorage.getItem('veixon_notifications');
  if (!stored) {
    localStorage.setItem('veixon_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
    return DEFAULT_NOTIFICATIONS;
  }
  
  try {
    const list = JSON.parse(stored) as VeixonNotification[];
    return list.map(n => {
      // Update human-readable time dynamically
      const diffMs = Date.now() - n.timestamp;
      let timeStr = n.time;
      if (diffMs < 60000) {
        timeStr = 'Just now';
      } else if (diffMs < 3600000) {
        const mins = Math.floor(diffMs / 60000);
        timeStr = `${mins} min${mins > 1 ? 's' : ''} ago`;
      } else if (diffMs < 86400000) {
        const hours = Math.floor(diffMs / 3600000);
        timeStr = `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        const days = Math.floor(diffMs / 86400000);
        timeStr = `${days} day${days > 1 ? 's' : ''} ago`;
      }
      return { ...n, time: timeStr };
    });
  } catch (err) {
    console.error('Failed to parse notifications, resetting...', err);
    localStorage.setItem('veixon_notifications', JSON.stringify(DEFAULT_NOTIFICATIONS));
    return DEFAULT_NOTIFICATIONS;
  }
}

export function addNotification(text: string, link?: string) {
  if (typeof window === 'undefined') return;
  
  const list = getNotifications();
  
  // Avoid exact duplicates that are unread
  if (list.some(n => n.text === text && !n.read)) {
    return;
  }
  
  const newNotification: VeixonNotification = {
    id: Math.random().toString(36).substring(2, 9),
    text,
    time: 'Just now',
    timestamp: Date.now(),
    read: false,
    link
  };
  
  localStorage.setItem('veixon_notifications', JSON.stringify([newNotification, ...list]));
  window.dispatchEvent(new Event('veixon-notification-update'));
}

export function markAllNotificationsRead() {
  if (typeof window === 'undefined') return;
  const list = getNotifications();
  const updated = list.map(n => ({ ...n, read: true }));
  localStorage.setItem('veixon_notifications', JSON.stringify(updated));
  window.dispatchEvent(new Event('veixon-notification-update'));
}

export function dismissNotification(id: string) {
  if (typeof window === 'undefined') return;
  const list = getNotifications();
  const updated = list.filter(n => n.id !== id);
  localStorage.setItem('veixon_notifications', JSON.stringify(updated));
  window.dispatchEvent(new Event('veixon-notification-update'));
}

export function clearAllNotifications() {
  if (typeof window === 'undefined') return;
  localStorage.setItem('veixon_notifications', JSON.stringify([]));
  window.dispatchEvent(new Event('veixon-notification-update'));
}
