'use client';

import {
  type KeyboardEvent,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { INITIAL_LAYER, layers } from './layer-data';
import { createSculpture, definitions, VIEW_BOX } from './layer-geometry';
import styles from './layers.module.css';
import ViewIcon from './view-icon';

function usePose(assembled: boolean, angle: number) {
  const [pose, setPose] = useState({ spread: 1, angle: 0 });
  const current = useRef(pose);
  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    const target = { spread: assembled ? 0 : 1, angle };
    const publish = (next: typeof pose) => {
      current.current = next;
      setPose(next);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (preference.matches) {
        publish(target);
        return;
      }
      const from = current.current;
      const started = performance.now();
      const tick = (now: number) => {
        // A frame timestamp can precede effect setup within that same frame.
        const progress = Math.max(0, Math.min(1, (now - started) / 450));
        const ease = 1 - (1 - progress) ** 3;
        publish(
          progress === 1
            ? target
            : {
                spread: from.spread + (target.spread - from.spread) * ease,
                angle: from.angle + (target.angle - from.angle) * ease,
              }
        );
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };
    start();
    preference.addEventListener('change', start);
    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener('change', start);
    };
  }, [assembled, angle]);
  return pose;
}

export default function LayerExplorer({
  introduction,
}: {
  introduction: ReactNode;
}) {
  const [selected, setSelected] = useState<number>(INITIAL_LAYER);
  const [assembled, setAssembled] = useState(false);
  const [angle, setAngle] = useState(0);
  const [ready, setReady] = useState(false);
  const [hovered, setHovered] = useState<number | undefined>();
  const [iconPreview, setIconPreview] = useState(false);
  const pose = usePose(assembled, angle);
  const iconPose = usePose(iconPreview ? !assembled : assembled, 0);
  const geometry = useMemo(
    () => createSculpture(pose.spread, pose.angle, selected),
    [pose, selected]
  );
  const svg = useRef<SVGSVGElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState({
    measured: false,
    compact: false,
    scale: 1,
    x: 0,
    y: -35,
    width: 900,
    height: 700,
  });
  // Enlarge assembly inside the unchanged frame; the separated stack already
  // fills the available mobile height at the rotation extremes.
  // Share the assembly progress so scale and plate movement finish together.
  const sculptureScale = viewport.measured
    ? 1 + (viewport.compact ? 0.15 : 0.12) * (1 - pose.spread)
    : 1;
  const sculptureX = 472 * (1 - sculptureScale);
  const sculptureY = 392 * (1 - sculptureScale);
  // Reserve the numbered row below the transformed base, including at rotation extremes.
  const sculptureOffset = viewport.measured
    ? Math.min(
        -56,
        (viewport.height - (viewport.compact ? 16 : 54) - viewport.y) /
          viewport.scale -
          (geometry.baseFront[1] * sculptureScale + sculptureY)
      ) *
      (1 - pose.spread)
    : 0;
  const markers = useMemo(() => {
    const points = geometry.anchors.map(([x, y]) => ({
      x: (x * sculptureScale + sculptureX) * viewport.scale + viewport.x,
      y:
        (y * sculptureScale + sculptureY + sculptureOffset) * viewport.scale +
        viewport.y,
    }));
    // Follow the plates, spreading only enough to keep 44px targets apart.
    const ys = points.map((point) => point.y);
    for (let i = 1; i < ys.length; i++) ys[i] = Math.max(ys[i], ys[i - 1] + 48);
    const centerOffset = (ys[0] + ys[3] - points[0].y - points[3].y) / 2;
    const shift = Math.max(
      22 - (ys[0] - centerOffset),
      Math.min(0, viewport.height - 22 - (ys[3] - centerOffset))
    );
    const progress = 1 - pose.spread;
    const rowX = Math.max(
      94,
      Math.min(
        viewport.width - 94,
        (geometry.baseFront[0] * sculptureScale + sculptureX) * viewport.scale +
          viewport.x
      )
    );
    const rowY = Math.min(
      viewport.height - 22,
      (geometry.baseFront[1] * sculptureScale + sculptureY + sculptureOffset) *
        viewport.scale +
        viewport.y +
        32
    );
    return points.map((point, i) => {
      const x =
        Math.max(22, point.x - 28) * (1 - progress) +
        (rowX + (i - 1.5) * 48) * progress;
      const y =
        (ys[i] - centerOffset + shift) * (1 - progress) + rowY * progress;
      return {
        x,
        y,
        originX: (x + 16 - viewport.x) / viewport.scale,
        originY: (y - viewport.y) / viewport.scale,
      };
    });
  }, [
    geometry,
    viewport,
    pose.spread,
    sculptureOffset,
    sculptureScale,
    sculptureX,
    sculptureY,
  ]);
  const markerButtons = useRef<(HTMLButtonElement | null)[]>([]);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (hovered === undefined) return;
    const dismiss = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setHovered(undefined);
    };
    document.addEventListener('keydown', dismiss);
    return () => document.removeEventListener('keydown', dismiss);
  }, [hovered]);
  useLayoutEffect(() => {
    const element = frame.current;
    if (!element) return;
    let active = true;
    const position = () => {
      if (!active || !svg.current) return;
      const matrix = svg.current.getScreenCTM();
      if (!matrix) return;
      const bounds = element.getBoundingClientRect();
      setViewport({
        measured: true,
        compact: matchMedia('(max-width: 700px)').matches,
        scale: matrix.a,
        x: matrix.e - bounds.left,
        y: matrix.f - bounds.top,
        width: bounds.width,
        height: bounds.height,
      });
      setReady(true);
    };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(element);
    void document.fonts.ready.then(position);
    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

  function navigate(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    markers = false
  ) {
    let next: number;
    if (event.key === 'ArrowRight' || (markers && event.key === 'ArrowDown'))
      next = (index + 1) % 4;
    else if (event.key === 'ArrowLeft' || (markers && event.key === 'ArrowUp'))
      next = (index + 3) % 4;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = 3;
    else return;
    event.preventDefault();
    setSelected(next);
    (markers ? markerButtons : tabs).current[next]?.focus();
  }

  return (
    <section className={styles.hero} aria-labelledby="title">
      {introduction}
      <figure
        className={styles.objectStage}
        aria-label="Explore four connected layers"
        data-assembled={assembled}
      >
        <div className={styles.objectFrame} ref={frame}>
          {/* Numbered buttons and tabs provide keyboard equivalents for selecting the illustrated surfaces. */}
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: Numbered native buttons implement the same selection and keyboard navigation. */}
          <svg
            ref={svg}
            id="sculpture"
            className={styles.sculpture}
            viewBox={VIEW_BOX}
            role="img"
            aria-labelledby="sculpture-title sculpture-description"
            data-selected={selected}
            data-hover={hovered}
            data-spread={pose.spread.toFixed(3)}
            data-angle={pose.angle.toFixed(2)}
            onClick={(event) => {
              if (!(event.target instanceof Element)) return;
              const layer = event.target.closest<SVGElement>(
                '[data-sculpture-layer]'
              );
              if (layer) setSelected(Number(layer.dataset.sculptureLayer));
            }}
          >
            <title id="sculpture-title">
              {`${layers[selected].name} selected, four connected layers`}
            </title>
            <desc id="sculpture-description">
              {`${layers[selected].drawing} Choose a named tab to read each perspective.`}
            </desc>
            <g
              id="object-content"
              transform={`translate(${sculptureX} ${sculptureY + sculptureOffset}) scale(${sculptureScale})`}
              // biome-ignore lint/security/noDangerouslySetInnerHtml: Deterministic local SVG geometry and fixed labels only, with no external input.
              dangerouslySetInnerHTML={{
                __html: definitions + geometry.markup,
              }}
            />
            <g
              className={styles.markerLeaders}
              pointerEvents="none"
              visibility={viewport.measured ? 'visible' : 'hidden'}
            >
              {geometry.anchors.map(([x, y], i) => (
                <line
                  key={layers[i].name}
                  x1={markers[i].originX}
                  y1={markers[i].originY}
                  x2={x * sculptureScale + sculptureX}
                  y2={y * sculptureScale + sculptureY + sculptureOffset}
                  stroke={i === selected ? '#a74425' : '#728580'}
                  opacity={
                    (i === (hovered ?? selected) ? 1 : 0.5) *
                    Math.max(0, 1 - (1 - pose.spread) * 3)
                  }
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </g>
          </svg>
          <fieldset
            className={styles.markers}
            aria-label="Select a numbered layer"
            data-assembled={assembled}
            style={{ visibility: viewport.measured ? 'visible' : 'hidden' }}
            data-interactive
          >
            {layers.map((layer, i) => (
              <button
                key={layer.name}
                type="button"
                ref={(element) => {
                  markerButtons.current[i] = element;
                }}
                data-marker={i}
                style={
                  viewport.measured
                    ? { left: markers[i].x - 22, top: markers[i].y - 22 }
                    : { left: '12%', top: `${20 + i * 17}%` }
                }
                aria-label={`Select ${layer.name} on sculpture`}
                aria-pressed={selected === i}
                aria-controls="caption"
                tabIndex={selected === i ? 0 : -1}
                disabled={!ready}
                onClick={() => setSelected(i)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setHovered(undefined);
                  else navigate(event, i, true);
                }}
                data-tooltip-open={hovered === i}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(undefined)}
                onFocus={() => setHovered(i)}
                onBlur={() => setHovered(undefined)}
              >
                <span className={styles.markerNumber}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className={styles.markerName} aria-hidden="true">
                  {layer.name}
                </span>
              </button>
            ))}
          </fieldset>
        </div>
        <div className={styles.viewGroup} data-interactive>
          <p className={styles.instruction}>
            {assembled
              ? 'Four perspectives, working together.'
              : 'Choose a number or a layer.'}
          </p>
          <div className={styles.viewControls} data-view-controls>
            <button
              id="assembly"
              className={styles.assembly}
              type="button"
              aria-label={assembled ? 'Separate layers' : 'Assemble layers'}
              aria-describedby="view-state"
              data-assembled={assembled}
              data-icon-preview={iconPreview}
              disabled={!ready}
              onPointerEnter={(event) => {
                if (event.pointerType === 'mouse') setIconPreview(true);
              }}
              onPointerLeave={() => setIconPreview(false)}
              onFocus={() => setIconPreview(true)}
              onBlur={() => setIconPreview(false)}
              onClick={() => {
                setIconPreview(false);
                setAssembled(!assembled);
              }}
            >
              <ViewIcon spread={iconPose.spread} />
              <span>{assembled ? 'Separate' : 'Assemble'}</span>
            </button>
            <label className={styles.turn} htmlFor="rotation">
              <span className={styles.turnLabel}>Rotate</span>
              <span className={styles.rotationTrack}>
                <input
                  id="rotation"
                  type="range"
                  min="-30"
                  max="30"
                  step="1"
                  value={angle}
                  disabled={!ready}
                  aria-label="Rotate sculpture"
                  aria-valuetext={
                    angle === 0
                      ? '0 degrees, centred'
                      : `${Math.abs(angle)} degrees ${angle < 0 ? 'left' : 'right'}`
                  }
                  onChange={(event) => setAngle(Number(event.target.value))}
                />
              </span>
              <output htmlFor="rotation" aria-hidden="true">
                {angle > 0 ? '+' : ''}
                {angle}°
              </output>
            </label>
            <button
              id="reset"
              className={styles.reset}
              type="button"
              disabled={!ready}
              onClick={() => {
                setAngle(0);
                setAssembled(false);
                setSelected(INITIAL_LAYER);
              }}
            >
              Reset all
            </button>
          </div>
          <p
            id="view-state"
            className={styles.visuallyHidden}
            aria-live="polite"
          >
            {assembled ? 'Assembled' : 'Separated'}
          </p>
        </div>
      </figure>
      <div className={styles.explorer}>
        <div
          className={styles.tabs}
          role="tablist"
          aria-label="Choose a layer"
          data-interactive
        >
          {layers.map((layer, i) => (
            <button
              key={layer.name}
              type="button"
              id={`layer-${i}`}
              ref={(element) => {
                tabs.current[i] = element;
              }}
              role="tab"
              data-select={i}
              aria-selected={selected === i}
              aria-controls={`caption-${i}`}
              tabIndex={selected === i ? 0 : -1}
              disabled={!ready}
              onClick={() => setSelected(i)}
              onKeyDown={(event) => navigate(event, i)}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
              {layer.name}
            </button>
          ))}
        </div>
        <div
          id="caption"
          className={styles.caption}
          aria-live="polite"
          aria-atomic="true"
          data-interactive
        >
          {layers.map((layer, i) => (
            <div
              key={layer.name}
              id={`caption-${i}`}
              role="tabpanel"
              aria-labelledby={`layer-${i}`}
              hidden={selected !== i}
              // biome-ignore lint/a11y/noNoninteractiveTabindex: Each text-only tabpanel is keyboard-focusable; hidden panels are excluded from focus navigation.
              tabIndex={0}
            >
              <h2>{layer.name}</h2>
              <p id={selected === i ? 'caption-body' : undefined}>
                {layer.caption}
              </p>
            </div>
          ))}
        </div>
        <noscript>
          <style>{'[data-interactive]{display:none!important}'}</style>
          <div className={styles.staticPerspectives}>
            {layers.map((layer) => (
              <section key={layer.name}>
                <h2>{layer.name}</h2>
                <p>{layer.caption}</p>
              </section>
            ))}
          </div>
        </noscript>
      </div>
    </section>
  );
}
