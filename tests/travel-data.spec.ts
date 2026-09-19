import { expect, test } from '@playwright/test';
import travel from '../content/travel.json';
import { getCountryHighlights } from '../src/app/whereabouts/country-highlights';
import {
  formatMonth,
  getVisitState,
  type Visit,
} from '../src/components/whereabouts/places';

const visit: Visit = {
  id: 'tokyo-2026-05',
  city: 'Tokyo',
  country: 'Japan',
  latitude: 35.68,
  longitude: 139.69,
  month: '2026-05',
};
const fixture = () => ({
  currentLocation: {
    id: 'singapore',
    city: 'Singapore',
    country: 'Singapore',
    latitude: 1.29,
    longitude: 103.85,
  },
  visits: [{ ...visit }],
});

test('classifies visits at month precision, including year boundaries', () => {
  expect(getVisitState(undefined, '2026-05')).toBe('current');
  expect(getVisitState(visit, '2026-04')).toBe('future');
  expect(getVisitState(visit, '2026-05')).toBe('past');
  expect(getVisitState(visit, '2026-06')).toBe('past');
  expect(getVisitState({ ...visit, month: '2027-01' }, '2026-12')).toBe(
    'future'
  );
  expect(getVisitState({ ...visit, month: '2025-12' }, '2026-01')).toBe('past');
});

test('formats dates consistently across repeated calls and year boundaries', () => {
  expect(formatMonth('2025-12')).toBe('December 2025');
  expect(formatMonth('2026-01')).toBe('January 2026');
  expect(formatMonth('2026-05')).toBe('May 2026');
  expect(formatMonth('2025-12')).toBe('December 2025');
});

test('validates the maintained record and includes only its country highlights', () => {
  const highlights = getCountryHighlights();
  const expected = [
    ...new Set([
      travel.currentLocation.country,
      ...travel.visits.map((v) => v.country),
    ]),
  ].sort();
  expect(Object.keys(highlights).sort()).toEqual(expected);
  for (const path of Object.values(highlights)) expect(path).toMatch(/^M.+Z$/);
});

test('adds countries automatically and preserves the current location on repeat visits', () => {
  const record = fixture();
  record.visits.push({ ...visit, id: 'tokyo-2027-05', month: '2027-05' });
  const snapshot = structuredClone(record);
  const highlights = getCountryHighlights(record);
  expect(Object.keys(highlights).sort()).toEqual(['Japan', 'Singapore']);
  expect(highlights.Japan.length).toBeGreaterThan(100);
  expect(record).toEqual(snapshot);
});

test('resolves country aliases to matching geometry', () => {
  const record = fixture();
  record.visits = [{ ...visit, country: 'Türkiye' }];
  const aliased = getCountryHighlights(record).Türkiye;
  record.visits = [{ ...visit, country: 'Turkey' }];
  expect(getCountryHighlights(record).Turkey).toBe(aliased);
});

test('accepts an empty travel history', () => {
  expect(
    Object.keys(getCountryHighlights({ ...fixture(), visits: [] }))
  ).toEqual(['Singapore']);
});

for (const [field, value, error] of [
  ['id', '', 'visits[0].id must be a non-empty string'],
  ['id', 'Tokyo 2026', 'visits[0].id must use lowercase'],
  ['id', 'singapore', 'visits[0].id duplicates'],
  ['city', '  ', 'visits[0].city must be a non-empty string'],
  ['country', 'Atlantis', 'is not recognized'],
  ['month', '2026-13', 'visits[0].month must be YYYY-MM'],
  ['month', '2026-00', 'visits[0].month must be YYYY-MM'],
  ['month', '2026-5', 'visits[0].month must be YYYY-MM'],
  ['month', '2026-05-01', 'visits[0].month must be YYYY-MM'],
  ['latitude', 91, 'visits[0].latitude must be a number'],
  ['latitude', Number.NaN, 'visits[0].latitude must be a number'],
  ['longitude', -181, 'visits[0].longitude must be a number'],
  ['longitude', '139.69', 'visits[0].longitude must be a number'],
  ['note', 42, 'visits[0].note must be text'],
] as const) {
  test(`rejects invalid ${field}: ${String(value)}`, () => {
    const record = fixture();
    const invalid = {
      ...record,
      visits: [{ ...record.visits[0], [field]: value }],
    };
    expect(() => getCountryHighlights(invalid)).toThrow(error);
  });
}

test('rejects duplicate visit IDs and malformed record containers', () => {
  const record = fixture();
  record.visits.push({ ...visit });
  expect(() => getCountryHighlights(record)).toThrow('visits[1].id duplicates');
  expect(() => getCountryHighlights(null)).toThrow(
    'content/travel.json: expected'
  );
  expect(() => getCountryHighlights({ ...fixture(), visits: {} })).toThrow(
    'expected currentLocation'
  );
  expect(() =>
    getCountryHighlights({ ...fixture(), currentLocation: null })
  ).toThrow('currentLocation must be an object');
});
