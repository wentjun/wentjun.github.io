'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { preload } from 'react-dom';
import { currentLocation, formatMonth, getVisitState, visits } from './places';
import TravelMap from './travel-map';
import useTravelStory from './use-travel-story';
import styles from './whereabouts.module.css';

const history = [...visits].sort((a, b) => b.month.localeCompare(a.month));
const years = [...new Set(history.map((visit) => visit.month.slice(0, 4)))];

const stateLabels = {
  current: 'Currently in',
  past: 'Was in',
  future: 'Heading to',
};

export default function Whereabouts({
  initialMonth,
  countryPaths,
}: {
  initialMonth: string;
  countryPaths: Record<string, string>;
}) {
  // Include the map hint in the initial HTML, before viewport measurement.
  preload('/world-map.svg', { as: 'image' });

  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  useEffect(() => {
    const refreshMonth = () =>
      setCurrentMonth(new Date().toISOString().slice(0, 7));
    refreshMonth();
    window.addEventListener('focus', refreshMonth);
    return () => window.removeEventListener('focus', refreshMonth);
  }, []);
  const { selectedId, selectPlace, historyRef, mapScrollRef, scrollEdges } =
    useTravelStory();
  const historyPanelRef = useRef<HTMLElement>(null);
  const selectedVisit = history.find((visit) => visit.id === selectedId);
  const selectedPlace = selectedVisit ?? currentLocation;
  const stateLabel = stateLabels[getVisitState(selectedVisit, currentMonth)];

  return (
    <div className={styles.page}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <TravelMap
        countryPaths={countryPaths}
        selected={selectedPlace}
        onSelect={selectPlace}
        scrollRef={mapScrollRef}
        historyPanelRef={historyPanelRef}
      />
      <header className={styles.header}>
        <Link className={styles.brand} href="/" prefetch={false}>
          Wen Tjun<span>.</span>
        </Link>
        <Link className={styles.back} href="/" prefetch={false}>
          Back to home <span aria-hidden="true">↗&#xFE0E;</span>
        </Link>
      </header>
      <main id="main" tabIndex={-1} className={styles.main}>
        <div className={styles.explorer}>
          <div className={styles.mapColumn}>
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className={styles.detail}
            >
              <div>
                <p className={styles.eyebrow}>
                  {stateLabel}
                  {selectedVisit && ` · ${formatMonth(selectedVisit.month)}`}
                </p>
                <h1 key={selectedId} className={styles.placeTitle}>
                  {selectedPlace.city}{' '}
                  <span>
                    {selectedPlace.city !== selectedPlace.country
                      ? selectedPlace.country
                      : ''}
                  </span>
                </h1>
                {selectedVisit?.note && (
                  <p className={styles.note}>{selectedVisit.note}</p>
                )}
              </div>
            </div>
          </div>
          <section
            ref={historyPanelRef}
            className={styles.history}
            aria-label="Travel history"
          >
            <section
              ref={historyRef}
              className={styles.historyScroll}
              aria-label="Scrollable travel history"
              data-before={scrollEdges.before}
              data-after={scrollEdges.after}
            >
              {years.map((year) => (
                <section key={year} className={styles.year} aria-label={year}>
                  <h2>{year}</h2>
                  <ol aria-label={`Visits in ${year}`}>
                    {history
                      .filter((visit) => visit.month.startsWith(year))
                      .map((visit) => (
                        <li key={visit.id} data-visit={visit.id}>
                          <button
                            type="button"
                            aria-label={`${visit.city}, ${visit.country}, ${formatMonth(visit.month)}`}
                            aria-pressed={selectedId === visit.id}
                            onClick={() => selectPlace(visit.id)}
                          >
                            <span className={styles.visitPlace}>
                              <span>{visit.city}</span>
                              <span>{visit.country}</span>
                            </span>
                            <time dateTime={visit.month}>
                              {formatMonth(visit.month).slice(0, 3)}
                            </time>
                          </button>
                        </li>
                      ))}
                  </ol>
                </section>
              ))}
            </section>
          </section>
        </div>
      </main>
      <footer className={styles.footer}>
        <a href="https://www.naturalearthdata.com/about/terms-of-use/">
          Map data: Natural Earth
        </a>
      </footer>
    </div>
  );
}
