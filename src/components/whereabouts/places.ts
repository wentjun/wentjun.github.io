import travel from '../../../content/travel.json';

export interface Place {
  id: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface Visit extends Place {
  /** Month precision: YYYY-MM. Use a new id for each return visit. */
  month: string;
  note?: string;
}

// Edit content/travel.json to update places; map geometry is selected at build time.
export const currentLocation: Place = travel.currentLocation;
export const visits: Visit[] = travel.visits;

const monthFormatter = new Intl.DateTimeFormat('en', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

export function formatMonth(month: string) {
  return monthFormatter.format(new Date(`${month}-01T00:00:00Z`));
}

export function getVisitState(visit: Visit | undefined, currentMonth: string) {
  if (!visit) return 'current';
  return visit.month > currentMonth ? 'future' : 'past';
}
