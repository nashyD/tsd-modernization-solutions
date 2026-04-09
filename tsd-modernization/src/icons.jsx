// Line-style SVG icons used across the site in place of emoji.
// All icons: 24×24 viewBox, currentColor strokes, size prop for width/height.

const base = (size) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: "false",
});

export const BoltIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);

export const CheckIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const ClockIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);

export const TagIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
    <circle cx="7" cy="7" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const BuildingIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <rect x="4" y="3" width="16" height="18" rx="1" />
    <path d="M9 21V13h6v8" />
    <path d="M9 7h.01M15 7h.01M9 10h.01M15 10h.01" />
  </svg>
);

export const SparklesIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <path d="M12 3v5M12 16v5M3 12h5M16 12h5" />
    <path d="m5.6 5.6 2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
  </svg>
);

export const MonitorIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <rect x="2" y="4" width="20" height="13" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);

export const TrendingUpIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <path d="m3 17 6-6 4 4 8-8" />
    <path d="M14 7h7v7" />
  </svg>
);
