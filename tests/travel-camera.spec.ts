import { expect, test } from '@playwright/test';
import { createCameraMotion } from '../src/components/whereabouts/travel-camera';

function harness() {
  let time = 0;
  let id = 0;
  const pending = new Map<number, FrameRequestCallback>();
  let frame = { x: 600, y: 180, scale: 10 };
  const motion = createCameraMotion(
    frame,
    (next) => {
      frame = next;
    },
    {
      now: () => time,
      request: (callback) => {
        pending.set(++id, callback);
        return id;
      },
      cancel: (handle) => {
        pending.delete(handle);
      },
    }
  );
  return {
    motion,
    frame: () => frame,
    pending: () => pending.size,
    step(ms: number) {
      time += ms;
      const callbacks = [...pending.values()];
      pending.clear();
      for (const callback of callbacks) callback(time);
    },
  };
}

test('distant camera travel briefly widens and settles at the original detail', () => {
  const h = harness();
  const target = { x: 200, y: 140, scale: 10 };
  h.motion.move(target, 1000);
  h.step(350);
  expect(h.frame().scale).toBeLessThan(10);
  expect(h.frame().scale).toBeGreaterThanOrEqual(7.5);
  expect(h.frame().x).toBeGreaterThan(target.x);
  expect(h.frame().x).toBeLessThan(600);
  h.step(1000);
  expect(h.frame()).toEqual(target);
  expect(h.pending()).toBe(0);
});

test('nearby moves only pan and repeated coordinates schedule no motion', () => {
  const h = harness();
  h.motion.move(h.frame(), 1000);
  expect(h.pending()).toBe(0);
  const target = { x: 590, y: 180, scale: 10 };
  h.motion.move(target, 1000);
  h.step(150);
  expect(h.frame().scale).toBe(10);
  h.step(1000);
  h.motion.move({ ...target }, 1000);
  expect(h.pending()).toBe(0);
});

test('interrupts from the visible frame and only settles at the latest selection', () => {
  const h = harness();
  h.motion.move({ x: 200, y: 140, scale: 10 }, 1000);
  h.step(200);
  const interrupted = { ...h.frame() };
  const latest = { x: 650, y: 190, scale: 10 };
  h.motion.move(latest, 1000);
  expect(h.frame()).toEqual(interrupted);
  expect(h.pending()).toBe(1);
  h.step(0);
  expect(h.frame()).toEqual(interrupted);
  h.step(1000);
  expect(h.frame()).toEqual(latest);
  h.step(1000);
  expect(h.frame()).toEqual(latest);
  expect(h.pending()).toBe(0);
});

test('reduced motion cancels a flight and applies the destination directly', () => {
  const h = harness();
  h.motion.move({ x: 200, y: 140, scale: 10 }, 1000);
  h.step(200);
  const target = { x: 650, y: 190, scale: 10 };
  h.motion.move(target, 1000, true);
  expect(h.frame()).toEqual(target);
  expect(h.pending()).toBe(0);
  h.step(1000);
  expect(h.frame()).toEqual(target);
});
