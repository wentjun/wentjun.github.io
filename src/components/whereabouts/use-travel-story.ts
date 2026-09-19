import { useEffect, useRef, useState } from 'react';
import { currentLocation } from './places';

function readingOffset(list: HTMLElement) {
  return Math.min(list.clientHeight * 0.3, 100);
}

export default function useTravelStory() {
  const [selectedId, setSelectedId] = useState(currentLocation.id);
  const [scrollEdges, setScrollEdges] = useState({
    before: false,
    after: true,
  });
  const selectedRef = useRef(currentLocation.id);
  const lastScroll = useRef(0);
  const historyRef = useRef<HTMLElement>(null);
  const mapScrollRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const map = mapScrollRef.current;
    const list = historyRef.current;
    if (!map || !list) return;

    const onWheel = (event: WheelEvent) => {
      // Preserve browser pinch-to-zoom and horizontal gestures.
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY))
        return;
      event.preventDefault();
      const unit =
        event.deltaMode === 1
          ? 20
          : event.deltaMode === 2
            ? list.clientHeight
            : 1;
      list.scrollBy({ top: event.deltaY * unit, behavior: 'instant' });
    };
    let touch: { x: number; y: number } | null = null;
    const onTouchStart = (event: TouchEvent) => {
      touch =
        event.touches.length === 1
          ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
          : null;
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!touch || event.touches.length !== 1) return;
      const next = event.touches[0];
      const delta = touch.y - next.clientY;
      if (Math.abs(delta) > Math.abs(touch.x - next.clientX)) {
        event.preventDefault();
        list.scrollBy({ top: delta, behavior: 'instant' });
      }
      touch = { x: next.clientX, y: next.clientY };
    };
    const onTouchEnd = () => {
      touch = null;
    };
    map.addEventListener('wheel', onWheel, { passive: false });
    map.addEventListener('touchstart', onTouchStart, { passive: true });
    map.addEventListener('touchmove', onTouchMove, { passive: false });
    map.addEventListener('touchend', onTouchEnd);
    map.addEventListener('touchcancel', onTouchEnd);
    return () => {
      map.removeEventListener('wheel', onWheel);
      map.removeEventListener('touchstart', onTouchStart);
      map.removeEventListener('touchmove', onTouchMove);
      map.removeEventListener('touchend', onTouchEnd);
      map.removeEventListener('touchcancel', onTouchEnd);
    };
  }, []);

  useEffect(() => {
    const list = historyRef.current;
    if (!list) return;
    let frame = 0;
    const rows = Array.from(list.querySelectorAll<HTMLElement>('[data-visit]'));
    let positions: { id: string; center: number; height: number }[] = [];
    let readingPosition = 0;
    let layoutChanged = false;
    const updateEdges = () => {
      const before = list.scrollTop > 2;
      const after = list.scrollTop + list.clientHeight < list.scrollHeight - 2;
      setScrollEdges((previous) =>
        previous.before === before && previous.after === after
          ? previous
          : { before, after }
      );
    };
    const updateLayout = () => {
      const previousPositions = positions;
      const previousReadingPosition = readingPosition;
      const availableHeight =
        list.parentElement?.clientHeight ?? list.clientHeight;
      const listTop = list.getBoundingClientRect().top;
      const scrollTop = list.scrollTop;
      // Content-relative positions stay constant during scrolling.
      positions = rows.map((row) => {
        const bounds = row.getBoundingClientRect();
        return {
          id: row.dataset.visit ?? currentLocation.id,
          center: bounds.top - listTop + scrollTop + bounds.height / 2,
          height: bounds.height,
        };
      });
      // End the viewport partway through a visit, rather than on a year heading.
      const peek = positions
        .map(({ center, height }) => center + height * 0.3)
        .findLast((bottom) => bottom <= availableHeight);
      list.style.setProperty('--list-window', `${peek ?? availableHeight}px`);
      readingPosition = readingOffset(list);
      const lastRow = positions.at(-1);
      // Let the final row reach the same reading position as every other row.
      const tail = lastRow
        ? Math.max(
            0,
            list.clientHeight - readingPosition - lastRow.height / 2 + 1
          )
        : 0;
      list.style.setProperty('--story-tail', `${tail}px`);
      updateEdges();
      // A scroll may have used the old cache before ResizeObserver ran.
      if (
        previousPositions.length > 0 &&
        (previousReadingPosition !== readingPosition ||
          positions.some(
            (row, index) => row.center !== previousPositions[index].center
          ))
      ) {
        layoutChanged = true;
        schedule();
      }
    };
    const followScroll = () => {
      frame = 0;
      updateEdges();
      if (list.scrollTop === lastScroll.current && !layoutChanged) return;
      layoutChanged = false;
      lastScroll.current = list.scrollTop;
      const readingLine = list.scrollTop + readingPosition;
      let next = currentLocation.id;
      if (list.scrollTop > 4) {
        for (const row of positions) {
          if (row.center > readingLine) break;
          next = row.id;
        }
      }
      if (next !== selectedRef.current) {
        selectedRef.current = next;
        setSelectedId(next);
      }
    };
    function schedule() {
      if (!frame) frame = requestAnimationFrame(followScroll);
    }
    list.addEventListener('scroll', schedule, { passive: true });
    const observer = new ResizeObserver(updateLayout);
    observer.observe(list);
    observer.observe(list.parentElement ?? list);
    for (const row of rows) observer.observe(row);
    for (const heading of list.querySelectorAll('h2'))
      observer.observe(heading);
    updateLayout();
    return () => {
      list.removeEventListener('scroll', schedule);
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  function selectPlace(id: string) {
    const list = historyRef.current;
    if (id === currentLocation.id) {
      list?.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      const row = Array.from(
        list?.querySelectorAll<HTMLElement>('[data-visit]') ?? []
      ).find((entry) => entry.dataset.visit === id);
      if (row && list) {
        const bounds = row.getBoundingClientRect();
        list.scrollTo({
          top:
            list.scrollTop +
            bounds.top -
            list.getBoundingClientRect().top +
            bounds.height / 2 -
            readingOffset(list) +
            1,
          behavior: 'instant',
        });
      }
    }
    // A click wins over any scroll event queued while its control came into view.
    lastScroll.current = historyRef.current?.scrollTop ?? 0;
    selectedRef.current = id;
    setSelectedId(id);
  }

  return {
    selectedId,
    selectPlace,
    historyRef,
    mapScrollRef,
    scrollEdges,
  };
}
