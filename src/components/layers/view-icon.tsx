export default function ViewIcon({ spread }: { spread: number }) {
  return (
    <svg
      width="24"
      height="26"
      viewBox="0 0 28 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
      data-view-icon-spread={spread.toFixed(3)}
    >
      {[3, 2, 1, 0].map((i) => (
        <path
          key={i}
          transform={`translate(0 ${(1 - spread) * 4.5})`}
          d={`M3 ${7 + i * (3 + spread * 3)} L14 ${2 + i * (3 + spread * 3)} L25 ${7 + i * (3 + spread * 3)} L14 ${12 + i * (3 + spread * 3)} Z`}
          fill="var(--view-icon-fill, #e5eae9)"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
