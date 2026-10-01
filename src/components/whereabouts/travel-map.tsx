import {
  Fragment,
  type RefObject,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { currentLocation, formatMonth, type Place, visits } from './places';
import styles from './whereabouts.module.css';

const sameCity = (a: Place, b: Place) =>
  a.city === b.city && a.country === b.country;
const entries = [
  currentLocation,
  ...[...visits].sort((a, b) => b.month.localeCompare(a.month)),
];
const visitLabel = (place: Place) => {
  const visit = visits.find((entry) => entry.id === place.id);
  return visit ? formatMonth(visit.month) : 'Current location';
};
// Geometry is shared by city; selection and picker entries retain every visit.
const pins = entries.filter(
  (place, index, places) =>
    places.findIndex(
      (other) => other.city === place.city && other.country === place.country
    ) === index
);

const mapScale = 5.5;

function project(place: Place) {
  return { x: (place.longitude + 180) * 2.5, y: (90 - place.latitude) * 2.5 };
}

// Connected groups use screen-space distances, so no two 44px targets overlap.
function groupPins(scale: number) {
  const remaining = new Set(pins);
  const groups: Place[][] = [];
  for (const pin of pins) {
    if (!remaining.delete(pin)) continue;
    const group = [pin];
    for (let i = 0; i < group.length; i++) {
      const point = project(group[i]);
      for (const candidate of remaining) {
        const other = project(candidate);
        if (
          Math.abs(point.x - other.x) * scale < 48 &&
          Math.abs(point.y - other.y) * scale < 48
        ) {
          remaining.delete(candidate);
          group.push(candidate);
        }
      }
    }
    groups.push(group);
  }
  return groups;
}

export default function TravelMap({
  selected,
  onSelect,
  scrollRef,
  historyPanelRef,
  headerRef,
  countryPaths,
}: {
  selected: Place;
  onSelect: (id: string) => void;
  scrollRef: RefObject<HTMLElement | null>;
  historyPanelRef: RefObject<HTMLElement | null>;
  headerRef: RefObject<HTMLElement | null>;
  countryPaths: Record<string, string>;
}) {
  const [mapSize, setMapSize] = useState({ width: 900, height: 450 });
  const [measured, setMeasured] = useState(false);
  const [headerClearance, setHeaderClearance] = useState(0);
  const [historyBounds, setHistoryBounds] = useState<{
    left: number;
    right: number;
    top: number;
    bottom: number;
  } | null>(null);
  const pickerId = useId();
  const pickerContext = useRef('');
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [pickerPlaces, setPickerPlaces] = useState<Place[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
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
      const mapBounds = element.getBoundingClientRect();
      if (headerRef.current) {
        setHeaderClearance(
          headerRef.current.getBoundingClientRect().bottom - mapBounds.top + 8
        );
      }
      const panel = historyPanelRef.current;
      if (panel) {
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
    if (headerRef.current) observer.observe(headerRef.current);
    if (historyPanelRef.current) observer.observe(historyPanelRef.current);
    return () => observer.disconnect();
  }, [historyPanelRef, headerRef]);
  const center = project(selected);
  const pixelsPerUnit = (mapWidth * mapScale) / 900;
  const groups = useMemo(() => groupPins(pixelsPerUnit), [pixelsPerUnit]);
  // A history selection or resize invalidates the open picker's map context.
  useEffect(() => {
    if (
      pickerContext.current !==
      `${selected.id}:${mapSize.width}:${mapSize.height}`
    )
      pickerRef.current?.hidePopover();
  }, [selected.id, mapSize.width, mapSize.height]);
  const positionPicker = () => {
    if (!pickerRef.current?.matches(':popover-open') || !triggerRef.current)
      return;
    const anchor = triggerRef.current.getBoundingClientRect();
    const panel = pickerRef.current.getBoundingClientRect();
    pickerRef.current.scrollTop = 0;
    // Position the top-layer panel directly before paint, including rapid reopen.
    pickerRef.current.style.left = `${Math.max(16, Math.min(innerWidth - panel.width - 16, anchor.left))}px`;
    pickerRef.current.style.top = `${
      anchor.bottom + 8 + panel.height <= innerHeight - 16
        ? anchor.bottom + 8
        : Math.max(16, anchor.top - panel.height - 8)
    }px`;
    pickerRef.current
      .querySelector<HTMLButtonElement>('[data-place-option]')
      ?.focus({ preventScroll: true });
  };
  const closePicker = () => {
    pickerRef.current?.hidePopover();
    triggerRef.current?.focus({ preventScroll: true });
  };
  const cameraX = focalX - center.x * pixelsPerUnit;
  const cameraY = focalY - center.y * pixelsPerUnit;
  const cameraStyle = {
    width: mapWidth * mapScale,
    height: (mapWidth * mapScale) / 2,
    transform: `translate(${cameraX}px, ${cameraY}px)`,
  };
  const selectedGroup = groups.find((group) =>
    group.some((place) => sameCity(place, selected))
  );
  const selectedHasPicker =
    entries.filter((entry) =>
      selectedGroup?.some((place) => sameCity(place, entry))
    ).length > 1;
  const pickerEntries = entries.filter((entry) =>
    pickerPlaces.some((place) => sameCity(place, entry))
  );
  return (
    <>
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
              <>
                <div className={styles.mapCamera} style={cameraStyle}>
                  <svg
                    viewBox="0 0 900 450"
                    aria-hidden="true"
                    focusable="false"
                  >
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
                </div>
                <div
                  className={styles.mapMarkers}
                  style={{ clipPath: `inset(${headerClearance}px 0 0)` }}
                >
                  <div className={styles.mapCamera} style={cameraStyle}>
                    {groups.map((group) => {
                      const pin =
                        group.find((place) => sameCity(place, selected)) ??
                        group[0];
                      const active = group.some((place) =>
                        sameCity(place, selected)
                      );
                      const hasPicker =
                        entries.filter((entry) =>
                          group.some((place) => sameCity(place, entry))
                        ).length > 1;
                      const expanded = active && hasPicker;
                      const controlText =
                        group.length > 1 ? 'Nearby visits' : 'Visit history';
                      const point = project(pin);
                      const x = point.x * pixelsPerUnit;
                      const markerY = point.y * pixelsPerUnit;
                      const y = markerY - (expanded ? 44 : 0);
                      const halfWidth = expanded ? 80 : 22;
                      // The active visit's label takes priority over other map targets.
                      const behindActiveControl =
                        !active &&
                        selectedHasPicker &&
                        Math.abs(x + cameraX - focalX) < 102 &&
                        Math.abs(y + cameraY - (focalY - 44)) < 44;
                      // Keep covered pins drawn, but use their list controls for access.
                      const covered =
                        historyBounds &&
                        x + cameraX + halfWidth > historyBounds.left &&
                        x + cameraX - halfWidth < historyBounds.right &&
                        y + cameraY + 22 > historyBounds.top &&
                        y + cameraY - 22 < historyBounds.bottom;
                      const underHeader = y + cameraY - 22 < headerClearance;
                      const visible =
                        !covered &&
                        !underHeader &&
                        !behindActiveControl &&
                        x + cameraX >= halfWidth &&
                        x + cameraX <= mapSize.width - halfWidth &&
                        y + cameraY >= 22 &&
                        y + cameraY <= mapSize.height - 22;
                      const label = hasPicker
                        ? `${controlText} ${group.length > 1 ? 'to' : 'for'} ${pin.city}`
                        : `${pin.city}, ${pin.country}`;
                      return (
                        <Fragment key={group[0].id}>
                          {expanded && (
                            <span
                              className={styles.pin}
                              style={{ left: x, top: markerY }}
                              data-active="true"
                              data-selected-pin
                              aria-hidden="true"
                            >
                              <span className={styles.pinDot} />
                            </span>
                          )}
                          <button
                            type="button"
                            className={styles.pin}
                            style={{ left: x, top: y }}
                            aria-label={label}
                            aria-pressed={hasPicker ? undefined : active}
                            aria-expanded={
                              hasPicker
                                ? pickerOpen && pickerPlaces === group
                                : undefined
                            }
                            aria-haspopup={hasPicker ? 'dialog' : undefined}
                            popoverTarget={hasPicker ? pickerId : undefined}
                            data-map-cluster={hasPicker ? '' : undefined}
                            data-header-covered={underHeader || undefined}
                            data-expanded-pin={expanded || undefined}
                            data-selected-pin={
                              active && !hasPicker ? '' : undefined
                            }
                            data-pin-count={group.length}
                            data-place-ids={group
                              .map((place) => place.id)
                              .join(' ')}
                            aria-hidden={!visible}
                            tabIndex={visible ? 0 : -1}
                            disabled={!visible}
                            data-active={active}
                            data-current={sameCity(pin, currentLocation)}
                            onClick={(event) => {
                              if (hasPicker) {
                                triggerRef.current = event.currentTarget;
                                if (
                                  pickerRef.current &&
                                  !pickerRef.current.matches(':popover-open')
                                ) {
                                  pickerRef.current.style.left = '16px';
                                  pickerRef.current.style.top = '16px';
                                }
                                pickerContext.current = `${selected.id}:${mapSize.width}:${mapSize.height}`;
                                setPickerPlaces(group);
                              } else onSelect(pin.id);
                            }}
                            title={label}
                          >
                            {expanded ? (
                              controlText
                            ) : hasPicker ? (
                              <svg
                                className={styles.visitStack}
                                viewBox="0 0 30 30"
                                aria-hidden="true"
                              >
                                <circle cx="15" cy="15" r="13" />
                                <circle
                                  cx="10"
                                  cy="15"
                                  r="1.5"
                                  fill="currentColor"
                                />
                                <path d="m17 11 4 4-4 4" fill="none" />
                              </svg>
                            ) : (
                              <span className={styles.pinDot} />
                            )}
                          </button>
                        </Fragment>
                      );
                    })}
                  </div>
                </div>
              </>
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
      <div
        id={pickerId}
        ref={pickerRef}
        popover="auto"
        role="dialog"
        aria-label="Explore visits"
        className={styles.placePicker}
        onBeforeToggle={(event) => {
          if (event.newState === 'open') requestAnimationFrame(positionPicker);
        }}
        onToggle={(event) => {
          const open = event.newState === 'open';
          setPickerOpen(open);
          if (open) positionPicker();
        }}
      >
        <div className={styles.pickerHeader}>
          <div>
            <p>Explore visits</p>
            <p className={styles.pickerContext}>Across all dates</p>
          </div>
          <button type="button" onClick={closePicker}>
            Close
          </button>
        </div>
        <div className={styles.pickerOptions}>
          {pickerEntries.map((place) => (
            <button
              key={place.id}
              type="button"
              data-place-option
              aria-label={`${place.city}, ${place.country}, ${visitLabel(place)}`}
              aria-pressed={place.id === selected.id}
              onClick={() => {
                closePicker();
                onSelect(place.id);
              }}
            >
              <span className={styles.pickerPlace}>
                <span>{place.city}</span>
                {place.id === selected.id && (
                  <svg
                    className={styles.pickerCheck}
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d="m3 8 3 3 7-7" />
                  </svg>
                )}
              </span>
              <span>
                {place.country} · {visitLabel(place)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
