import {
  Fragment,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { currentLocation, formatMonth, type Place, visits } from './places';
import { useTravelCamera } from './travel-camera';
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
  detailRef,
  countryPaths,
}: {
  selected: Place;
  onSelect: (id: string) => void;
  scrollRef: RefObject<HTMLElement | null>;
  historyPanelRef: RefObject<HTMLElement | null>;
  headerRef: RefObject<HTMLElement | null>;
  detailRef: RefObject<HTMLElement | null>;
  countryPaths: Record<string, string>;
}) {
  const [mapSize, setMapSize] = useState({ width: 900, height: 450 });
  const [measured, setMeasured] = useState(false);
  const [headerClearance, setHeaderClearance] = useState(0);
  const [readingBounds, setReadingBounds] = useState<
    {
      left: number;
      right: number;
      top: number;
      bottom: number;
    }[]
  >([]);
  const pickerId = useId();
  const pickerContext = useRef('');
  const pickerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [pickerPlaces, setPickerPlaces] = useState<Place[]>([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [expandedSize, setExpandedSize] = useState({ width: 160, height: 44 });
  const observeExpanded = useCallback((element: HTMLButtonElement | null) => {
    if (!element) return;
    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      setExpandedSize((previous) =>
        previous.width === width && previous.height === height
          ? previous
          : { width, height }
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const mapWidth = Math.max(mapSize.width, mapSize.height * 2);
  const compact = mapSize.width <= 800;
  const panelEnd = Math.min(420, mapSize.width * 0.37);
  const focalX = compact ? mapSize.width / 2 : (panelEnd + mapSize.width) / 2;
  const focalY = mapSize.height * (compact ? 0.33 : 0.46);
  const mapRef = useRef<HTMLFieldSetElement>(null);
  const measure = useCallback(() => {
    const element = mapRef.current;
    if (!element) return;
    setMapSize({ width: element.clientWidth, height: element.clientHeight });
    const mapBounds = element.getBoundingClientRect();
    if (headerRef.current) {
      setHeaderClearance(
        headerRef.current.getBoundingClientRect().bottom - mapBounds.top + 8
      );
    }
    setReadingBounds(
      [historyPanelRef.current, detailRef.current].flatMap((panel) => {
        if (!panel) return [];
        const bounds = panel.getBoundingClientRect();
        return [
          {
            left: bounds.left - mapBounds.left,
            right: bounds.right - mapBounds.left,
            top: bounds.top - mapBounds.top,
            bottom: bounds.bottom - mapBounds.top,
          },
        ];
      })
    );
    setMeasured(true);
  }, [historyPanelRef, headerRef, detailRef]);
  useLayoutEffect(measure, [measure]);
  // The header and reading surfaces are later siblings. Subscribe after all
  // sibling refs attach; their title/notes can resize independently of the map.
  useEffect(() => {
    const element = mapRef.current;
    if (!element) return;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    if (headerRef.current) observer.observe(headerRef.current);
    if (historyPanelRef.current) observer.observe(historyPanelRef.current);
    if (detailRef.current) observer.observe(detailRef.current);
    measure();
    return () => observer.disconnect();
  }, [measure, historyPanelRef, headerRef, detailRef]);
  const center = project(
    pins.find((pin) => sameCity(pin, selected)) ?? selected
  );
  const camera = useTravelCamera(
    { ...center, scale: (mapWidth * mapScale) / 900 },
    mapSize.width,
    mapSize.height
  );
  const pixelsPerUnit = camera.scale;
  const groups = useMemo(() => groupPins(pixelsPerUnit), [pixelsPerUnit]);
  // A history selection or resize invalidates the open picker's map context.
  useEffect(() => {
    if (
      pickerContext.current !==
      `${selected.id}:${mapSize.width}:${mapSize.height}`
    )
      pickerRef.current?.hidePopover();
  }, [selected.id, mapSize.width, mapSize.height]);
  const positionPicker = (focus = true) => {
    if (!pickerRef.current?.matches(':popover-open') || !triggerRef.current)
      return;
    const picker = pickerRef.current;
    const options = picker.querySelector<HTMLElement>('[data-picker-options]');
    const scrollTop = options?.scrollTop ?? 0;
    picker.style.maxHeight = '';
    const panel = picker.getBoundingClientRect();
    const anchor = triggerRef.current.getBoundingClientRect();
    const selectedPin =
      triggerRef.current.dataset.active === 'true'
        ? mapRef.current
            ?.querySelector('[data-selected-pin]')
            ?.getBoundingClientRect()
        : undefined;
    // The expanded button sits above the actual location dot. Protect both.
    const protectedArea = {
      left: Math.min(anchor.left, selectedPin?.left ?? anchor.left),
      right: Math.max(anchor.right, selectedPin?.right ?? anchor.right),
      top: Math.min(anchor.top, selectedPin?.top ?? anchor.top),
      bottom: Math.max(anchor.bottom, selectedPin?.bottom ?? anchor.bottom),
    };
    const gap = 12;
    const top = Math.max(
      16,
      (headerRef.current?.getBoundingClientRect().bottom ?? 0) + gap
    );
    const bottom = innerHeight - 16;
    const height = Math.min(panel.height, bottom - top);
    const left = Math.max(
      16,
      Math.min(innerWidth - panel.width - 16, anchor.left)
    );
    const sideTop = Math.max(top, Math.min(bottom - height, anchor.top));
    const pins = Array.from(
      mapRef.current?.querySelectorAll(
        'button:not(:disabled), [data-selected-pin]:not(button)'
      ) ?? []
    ).map((pin) => pin.getBoundingClientRect());
    // Also try the edges of neighboring pins, so a narrow menu can clear them.
    const belowEdges = [
      protectedArea.bottom,
      ...pins.map((pin) => pin.bottom),
    ].filter((edge) => edge >= protectedArea.bottom);
    const aboveEdges = [
      protectedArea.top,
      ...pins.map((pin) => pin.top),
    ].filter((edge) => edge <= protectedArea.top);
    const candidates = [
      { x: protectedArea.right + gap, y: sideTop, height },
      { x: protectedArea.left - gap - panel.width, y: sideTop, height },
      ...belowEdges.map((edge) => ({
        x: left,
        y: edge + gap,
        height: Math.min(height, bottom - edge - gap),
      })),
      ...aboveEdges.map((edge) => {
        const availableHeight = Math.min(height, edge - gap - top);
        return {
          x: left,
          y: edge - gap - availableHeight,
          height: availableHeight,
        };
      }),
    ];
    const compact = innerWidth <= 540 && innerHeight <= 700;
    const compactHeight = Math.min(
      height,
      innerHeight * 0.55,
      bottom - protectedArea.bottom - gap,
      bottom - (detailRef.current?.getBoundingClientRect().bottom ?? top) - gap
    );
    const placement =
      compact && compactHeight >= 144
        ? {
            x: (innerWidth - panel.width) / 2,
            y: bottom - compactHeight,
            height: compactHeight,
          }
        : candidates
            .filter(
              (candidate) =>
                candidate.x >= 16 &&
                candidate.x + panel.width <= innerWidth - 16 &&
                candidate.height >= Math.min(height, 144)
            )
            .map((candidate) => ({
              ...candidate,
              overlaps: pins.filter(
                (pin) =>
                  candidate.x < pin.right + gap &&
                  candidate.x + panel.width > pin.left - gap &&
                  candidate.y < pin.bottom + gap &&
                  candidate.y + candidate.height > pin.top - gap
              ).length,
            }))
            .sort((a, b) => a.overlaps - b.overlaps || b.height - a.height)[0];
    if (!placement) return;
    // Constrain long lists to the available space instead of covering the pin.
    picker.style.left = `${placement.x}px`;
    picker.style.top = `${placement.y}px`;
    picker.style.maxHeight = `${placement.height}px`;
    if (options) options.scrollTop = focus ? 0 : scrollTop;
    if (focus)
      pickerRef.current
        .querySelector<HTMLButtonElement>('[data-place-option]')
        ?.focus({ preventScroll: true });
  };
  // An open picker follows its moving anchor without resetting keyboard focus.
  useLayoutEffect(() => {
    if (!pickerOpen) return;
    if (!triggerRef.current?.isConnected) pickerRef.current?.hidePopover();
    else positionPicker(false);
  });
  const closePicker = () => {
    pickerRef.current?.hidePopover();
    triggerRef.current?.focus({ preventScroll: true });
  };
  const cameraX = focalX - camera.x * pixelsPerUnit;
  const cameraY = focalY - camera.y * pixelsPerUnit;
  const cameraStyle = {
    width: 900 * pixelsPerUnit,
    height: 450 * pixelsPerUnit,
    transform: `translate(${cameraX}px, ${cameraY}px)`,
    // Land, targets and occlusion share this exact frame; no CSS interpolation.
    transition: 'none',
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
  const pickerAnchor =
    pickerPlaces.find((place) => sameCity(place, selected)) ?? pickerPlaces[0];
  const pickerTitle = pickerAnchor
    ? pickerPlaces.length > 1
      ? `Visits near ${pickerAnchor.city}`
      : `Visits to ${pickerAnchor.city}`
    : 'Visits';
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
                      const activeOffset = expandedSize.height / 2 + 22;
                      const y = markerY - (expanded ? activeOffset : 0);
                      const halfWidth = expanded ? expandedSize.width / 2 : 22;
                      const halfHeight = expanded
                        ? expandedSize.height / 2
                        : 22;
                      // The active visit's label takes priority over other map targets.
                      const behindActiveControl =
                        !active &&
                        selectedHasPicker &&
                        Math.abs(x - center.x * pixelsPerUnit) <
                          expandedSize.width / 2 + 22 &&
                        Math.abs(
                          y - (center.y * pixelsPerUnit - activeOffset)
                        ) <
                          expandedSize.height / 2 + 22;
                      // Reading surfaces take priority; these visits remain in the list.
                      const covered = readingBounds.some(
                        (bounds) =>
                          x + cameraX + halfWidth > bounds.left &&
                          x + cameraX - halfWidth < bounds.right &&
                          y + cameraY + halfHeight > bounds.top &&
                          y + cameraY - halfHeight < bounds.bottom
                      );
                      const underHeader =
                        y + cameraY - halfHeight < headerClearance;
                      const visible =
                        !covered &&
                        !underHeader &&
                        !behindActiveControl &&
                        x + cameraX >= halfWidth &&
                        x + cameraX <= mapSize.width - halfWidth &&
                        y + cameraY >= halfHeight &&
                        y + cameraY <= mapSize.height - halfHeight;
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
                            ref={expanded ? observeExpanded : undefined}
                            style={{ left: x, top: y }}
                            aria-label={label}
                            aria-pressed={hasPicker ? undefined : active}
                            aria-expanded={
                              hasPicker
                                ? pickerOpen &&
                                  triggerRef.current?.dataset.placeIds?.split(
                                    ' '
                                  )[0] === group[0].id
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
        aria-labelledby={`${pickerId}-title`}
        className={styles.placePicker}
        onBeforeToggle={(event) => {
          if (event.newState === 'open')
            requestAnimationFrame(() => positionPicker());
        }}
        onToggle={(event) => {
          const open = event.newState === 'open';
          setPickerOpen(open);
          if (open) positionPicker();
        }}
      >
        <div className={styles.pickerHeader}>
          <div>
            <p id={`${pickerId}-title`}>{pickerTitle}</p>
            <p className={styles.pickerCount}>{pickerEntries.length} visits</p>
          </div>
          <button type="button" onClick={closePicker}>
            Close
          </button>
        </div>
        <div className={styles.pickerOptions} data-picker-options>
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
