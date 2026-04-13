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

export const ChatBotIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <rect x="3" y="4" width="18" height="14" rx="3" />
    <path d="M9 10h.01M15 10h.01" />
    <path d="M9 14h6" />
    <path d="M7 18v3l3-3" />
  </svg>
);

export const ChartBarIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <rect x="3" y="12" width="4" height="8" rx="1" />
    <rect x="10" y="6" width="4" height="14" rx="1" />
    <rect x="17" y="3" width="4" height="17" rx="1" />
  </svg>
);

export const CalendarIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

export const LayoutIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <rect x="3" y="3" width="7" height="9" rx="1" />
    <rect x="14" y="3" width="7" height="5" rx="1" />
    <rect x="14" y="12" width="7" height="9" rx="1" />
    <rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

export const SearchIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

export const ChatBubbleIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-4.52-1.12L3 21l1.12-4.48A9 9 0 0 1 12 3a9 9 0 0 1 9 9z" />
    <path d="M8 12h.01M12 12h.01M16 12h.01" />
  </svg>
);

export const MapIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" />
    <path d="M9 3v15M15 6v15" />
  </svg>
);

export const ClipboardIcon = ({ size = 24, ...rest }) => (
  <svg {...base(size)} {...rest}>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 3h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3z" />
    <path d="M9 11h6M9 15h4" />
  </svg>
);
