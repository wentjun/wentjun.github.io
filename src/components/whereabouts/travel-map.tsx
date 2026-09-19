import { type RefObject, useLayoutEffect, useRef, useState } from 'react';
import { currentLocation, type Place, visits } from './places';
import styles from './whereabouts.module.css';

// Repeated visits share a pin; the history still contains every visit.
const pins = [
  currentLocation,
  ...[...visits].sort((a, b) => b.month.localeCompare(a.month)),
].filter(
  (place, index, places) =>
    places.findIndex(
      (other) => other.city === place.city && other.country === place.country
    ) === index
);

const mapScale = 5.5;

function project(place: Place) {
  return { x: (place.longitude + 180) * 2.5, y: (90 - place.latitude) * 2.5 };
}

export default function TravelMap({
  selected,
  onSelect,
  scrollRef,
  historyPanelRef,
  countryPaths,
}: {
  selected: Place;
  onSelect: (id: string) => void;
  scrollRef: RefObject<HTMLElement | null>;
  historyPanelRef: RefObject<HTMLElement | null>;
  countryPaths: Record<string, string>;
}) {
  const [mapSize, setMapSize] = useState({ width: 900, height: 450 });
  const [measured, setMeasured] = useState(false);
  const [historyBounds, setHistoryBounds] = useState<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  } | null>(null);
  const mapWidth = Math.max(mapSize.width, mapSize.height * 2);
  const compact = mapSize.width <= 800;
  const panelEnd = Math.min(420, mapSize.width * 0.37);
  const focalX = compact ? mapSize.width / 2 : (panelEnd + mapSize.width) / 2;
  const focalY = mapSize.height * (compact ? 0.33 : 0.46);
  const mapRef = useRef<HTMLFieldSetElement>(null);
  useLayoutEffect(() => {
    const element = mapRef.current;
    if (!element) return;
    const measure = () => {
      setMapSize({ width: element.clientWidth, height: element.clientHeight });
      const panel = historyPanelRef.current;
      if (panel) {
        const mapBounds = element.getBoundingClientRect();
        const bounds = panel.getBoundingClientRect();
        setHistoryBounds({
          left: bounds.left - mapBounds.left,
          right: bounds.right - mapBounds.left,
          top: bounds.top - mapBounds.top,
          bottom: bounds.bottom - mapBounds.top,
        });
      }
      setMeasured(true);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (historyPanelRef.current) observer.observe(historyPanelRef.current);
    return () => observer.disconnect();
  }, [historyPanelRef]);
  const center = project(selected);
  const pixelsPerUnit = (mapWidth * mapScale) / 900;
  const cameraX = focalX - center.x * pixelsPerUnit;
  const cameraY = focalY - center.y * pixelsPerUnit;
  const sameCity = (a: Place, b: Place) =>
    a.city === b.city && a.country === b.country;
  return (
    <section
      ref={scrollRef}
      aria-label="Travel map"
      className={styles.mapSection}
    >
      <div className={styles.mapStage}>
        <fieldset
          ref={mapRef}
          className={styles.map}
          aria-label="Map of places"
        >
          {measured && (
            <div
              className={styles.mapCamera}
              style={{
                width: mapWidth * mapScale,
                height: (mapWidth * mapScale) / 2,
                transform: `translate(${cameraX}px, ${cameraY}px)`,
              }}
            >
              <svg viewBox="0 0 900 450" aria-hidden="true" focusable="false">
                <image href="/world-map.svg" width="900" height="450" />
                {Object.entries(countryPaths).map(([country, path]) => (
                  <path
                    key={country}
                    d={path}
                    className={styles.countryHighlight}
                    data-country={country}
                    data-active={country === selected.country}
                    fillRule="evenodd"
                    vectorEffect="non-scaling-stroke"
                  />
                ))}
              </svg>
              {pins.map((pin) => {
                const point = project(pin);
                const x = point.x * pixelsPerUnit;
                const y = point.y * pixelsPerUnit;
                // Keep covered pins drawn, but use their list controls for access.
                const covered =
                  historyBounds &&
                  x + cameraX + 14 > historyBounds.left &&
                  x + cameraX - 14 < historyBounds.right &&
                  y + cameraY + 14 > historyBounds.top &&
                  y + cameraY - 14 < historyBounds.bottom;
                const visible =
                  !covered &&
                  x + cameraX >= 14 &&
                  x + cameraX <= mapSize.width - 14 &&
                  y + cameraY >= 14 &&
                  y + cameraY <= mapSize.height - 14;
                const active = sameCity(pin, selected);
                const label = `${pin.city}, ${pin.country}`;
                return (
                  <button
                    key={pin.id}
                    type="button"
                    className={styles.pin}
                    style={{ left: x, top: y }}
                    aria-label={label}
                    aria-pressed={active}
                    aria-hidden={!visible}
                    tabIndex={visible ? 0 : -1}
                    data-active={active}
                    data-current={sameCity(pin, currentLocation)}
                    onClick={() => onSelect(pin.id)}
                    title={label}
                  >
                    <span className={styles.pinDot} />
                  </button>
                );
              })}
            </div>
          )}
          <noscript>
            <svg
              viewBox="0 0 900 450"
              preserveAspectRatio="xMidYMid slice"
              aria-hidden="true"
              focusable="false"
            >
              <image href="/world-map.svg" width="900" height="450" />
            </svg>
          </noscript>
        </fieldset>
      </div>
    </section>
  );
}
