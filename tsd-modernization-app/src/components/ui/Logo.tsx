/**
 * Marketing-site brand mark: 4-slab prism with skewX(-12) + TSD letters.
 * Matches `tsd-modernization/public/tsd-ms-logo-tarheel.svg`, cropped to
 * just the lockup (no wordmark — pair with adjacent text).
 */
export function Logo({
  height = 22,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  // Source viewBox crop: x=191, y=40, w=338, h=160 → aspect ~2.11
  const width = Math.round(height * (338 / 160));
  return (
    <svg
      viewBox="191 40 338 160"
      width={width}
      height={height}
      className={className}
      aria-label="TSD Modernization Solutions"
      role="img"
    >
      <g transform="translate(225 40) skewX(-12)">
        <rect x="0" y="0" width="76" height="160" rx="4" fill="#a8d1ed" />
        <rect x="76" y="0" width="76" height="160" rx="4" fill="#7BB8E0" />
        <rect x="152" y="0" width="76" height="160" rx="4" fill="#2c5f8a" />
        <rect x="228" y="0" width="76" height="160" rx="4" fill="#13294B" />
      </g>
      <g
        fontFamily="var(--font-sans), Inter, system-ui, sans-serif"
        fontWeight={700}
        fill="#fff"
        letterSpacing={3}
      >
        <text x="255" y="150" fontSize={66}>
          T
        </text>
        <text x="331" y="150" fontSize={66}>
          S
        </text>
        <text x="407" y="150" fontSize={66}>
          D
        </text>
      </g>
    </svg>
  );
}

/**
 * Compact icon-only version for tiny contexts (favicon at 16-32px) where
 * the letters wouldn't be legible. 4 plain squares, no skew, no text.
 */
export function LogoMark({
  size = 22,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      className={className}
      aria-label="TSD Modernization Solutions"
      role="img"
    >
      <rect x="3" y="3" width="11" height="11" rx="2" fill="#13294B" />
      <rect x="18" y="3" width="11" height="11" rx="2" fill="#4B9CD3" />
      <rect x="3" y="18" width="11" height="11" rx="2" fill="#4B9CD3" />
      <rect x="18" y="18" width="11" height="11" rx="2" fill="#13294B" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Logo height={22} />
      <span className="font-semibold tracking-tight text-[var(--text)]">
        TSD Modernization
      </span>
    </span>
  );
}
