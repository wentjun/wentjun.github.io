import { useLayoutEffect, useRef, useState } from 'react';

type Camera = { x: number; y: number; scale: number };
type FrameClock = {
  now: () => number;
  request: (callback: FrameRequestCallback) => number;
  cancel: (id: number) => void;
};

export function createCameraMotion(
  initial: Camera,
  publish: (camera: Camera) => void,
  clock: FrameClock
) {
  let camera = initial;
  let pending: number | undefined;
  const stop = () => {
    if (pending !== undefined) clock.cancel(pending);
    pending = undefined;
  };
  const update = (next: Camera) => {
    camera = next;
    publish(next);
  };
  return {
    move(target: Camera, viewport: number, direct = false) {
      stop();
      const from = camera;
      if (direct) {
        update(target);
        return;
      }
      if (
        from.x === target.x &&
        from.y === target.y &&
        from.scale === target.scale
      )
        return;
      // Widen only beyond a screen of travel, capped at 25% less detail.
      const screens =
        (Math.hypot(target.x - from.x, target.y - from.y) * target.scale) /
        Math.max(1, viewport);
      const widen = Math.min(0.25, Math.max(0, screens - 1) * 0.12);
      const duration = widen > 0 ? 720 : 420;
      const start = clock.now();
      const tick: FrameRequestCallback = (now) => {
        const t = Math.min(1, Math.max(0, (now - start) / duration));
        if (t === 1) {
          pending = undefined;
          update(target);
          return;
        }
        const ease = t * t * (3 - 2 * t);
        const scale = from.scale + (target.scale - from.scale) * ease;
        update({
          x: from.x + (target.x - from.x) * ease,
          y: from.y + (target.y - from.y) * ease,
          scale: Math.max(
            target.scale * 0.75,
            scale * (1 - widen * Math.sin(Math.PI * t) ** 2)
          ),
        });
        pending = clock.request(tick);
      };
      pending = clock.request(tick);
    },
    stop,
  };
}

export function useTravelCamera(target: Camera, width: number, height: number) {
  const [camera, setCamera] = useState(target);
  const motion = useRef<ReturnType<typeof createCameraMotion> | null>(null);
  const size = useRef('');
  const { x, y, scale } = target;
  useLayoutEffect(() => {
    if (!motion.current) {
      motion.current = createCameraMotion({ x, y, scale }, setCamera, {
        now: () => performance.now(),
        request: (callback) => requestAnimationFrame(callback),
        cancel: (id) => cancelAnimationFrame(id),
      });
    }
    const controller = motion.current;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const nextSize = `${width}:${height}`;
    // Measurements and resize must settle before paint, including first mount.
    controller.move(
      { x, y, scale },
      width,
      reduced.matches || size.current !== nextSize
    );
    size.current = nextSize;
    const preferenceChanged = () => {
      if (reduced.matches) controller.move({ x, y, scale }, width, true);
    };
    reduced.addEventListener('change', preferenceChanged);
    return () => {
      controller.stop();
      reduced.removeEventListener('change', preferenceChanged);
    };
  }, [x, y, scale, width, height]);
  return camera;
}
