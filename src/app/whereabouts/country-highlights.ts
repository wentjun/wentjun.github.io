import travel from '../../../content/travel.json';
import atlas from '../../data/country-atlas.json';

// This module belongs to the server page. Only the selected shapes reach the browser.
const normalize = (name: string) => name.trim().toLocaleLowerCase('en');
const shapes = new Map(
  Object.entries(atlas.shapes).map(([name, path]) => [normalize(name), path])
);
for (const [alias, country] of Object.entries(atlas.aliases)) {
  const path = shapes.get(normalize(country));
  if (path) shapes.set(normalize(alias), path);
}

function invalid(message: string): never {
  throw new Error(`content/travel.json: ${message}`);
}

function object(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function getCountryHighlights(record: unknown = travel) {
  if (!object(record) || !Array.isArray(record.visits)) {
    invalid('expected currentLocation and a visits array.');
  }
  const highlights: Record<string, string> = {};
  const ids = new Set<string>();
  const entries = [record.currentLocation, ...record.visits];
  for (const [index, entry] of entries.entries()) {
    const label = index === 0 ? 'currentLocation' : `visits[${index - 1}]`;
    if (!object(entry)) invalid(`${label} must be an object.`);
    for (const field of ['id', 'city', 'country']) {
      if (typeof entry[field] !== 'string' || !entry[field].trim()) {
        invalid(`${label}.${field} must be a non-empty string.`);
      }
    }
    const id = entry.id as string;
    const country = entry.country as string;
    if (!/^[a-z0-9][a-z0-9-]*$/.test(id)) {
      invalid(`${label}.id must use lowercase letters, numbers, and hyphens.`);
    }
    if (ids.has(id))
      invalid(`${label}.id duplicates "${id}". Give each visit its own ID.`);
    ids.add(id);
    for (const [field, limit] of [
      ['latitude', 90],
      ['longitude', 180],
    ] as const) {
      const value = entry[field];
      if (
        typeof value !== 'number' ||
        !Number.isFinite(value) ||
        Math.abs(value) > limit
      ) {
        invalid(
          `${label}.${field} must be a number between -${limit} and ${limit}.`
        );
      }
    }
    if (index > 0) {
      if (
        typeof entry.month !== 'string' ||
        !/^[1-9]\d{3}-(0[1-9]|1[0-2])$/.test(entry.month)
      ) {
        invalid(`${label}.month must be YYYY-MM, for example "2026-05".`);
      }
      if (entry.note !== undefined && typeof entry.note !== 'string') {
        invalid(`${label}.note must be text.`);
      }
    }
    const path = shapes.get(normalize(country));
    if (!path)
      invalid(
        `${label}.country "${country}" is not recognized. Choose a name from content/travel.schema.json.`
      );
    highlights[country] = path;
  }
  return highlights;
}
