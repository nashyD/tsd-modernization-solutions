/* ── SVG icon components ──────────────────────────────────────── */

export const BotIcon = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M12 8V4H8" /><rect x="5" y="8" width="14" height="12" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" />
  </svg>
);

export const GlobeIcon = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />
  </svg>
);

export const CogIcon = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const CheckIcon = ({ size = 24, strokeWidth = 2, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const XIcon = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M18 6 6 18" /><path d="M6 6l12 12" />
  </svg>
);

export const SunIcon = ({ size = 20, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
  </svg>
);

export const MoonIcon = ({ size = 20, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export const MailIcon = ({ size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const PhoneIcon = ({ size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

export const MapPinIcon = ({ size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
  </svg>
);

export const LinkIcon = ({ size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

export const ArrowRightIcon = ({ size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);

export const QuoteIcon = ({ size = 32, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" opacity="0.15" {...rest}>
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
  </svg>
);

export const MenuIcon = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <line x1="4" y1="6" x2="20" y2="6" /><line x1="4" y1="12" x2="20" y2="12" /><line x1="4" y1="18" x2="20" y2="18" />
  </svg>
);

export const CalendarIcon = ({ size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
  </svg>
);

export const ClockIcon = ({ size = 18, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
  </svg>
);

export const ChevronDownIcon = ({ size = 16, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/* ── Gallery / slideshow icons ────────────────────────────────── */

export const BoltIcon = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
  </svg>
);

export const ChartBarIcon = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <rect x="3" y="12" width="4" height="8" rx="1" /><rect x="10" y="6" width="4" height="14" rx="1" /><rect x="17" y="3" width="4" height="17" rx="1" />
  </svg>
);

export const LayoutIcon = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
  </svg>
);

export const SearchIcon = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" />
  </svg>
);

export const ChatBubbleIcon = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-4.52-1.12L3 21l1.12-4.48A9 9 0 0 1 12 3a9 9 0 0 1 9 9z" /><path d="M8 12h.01M12 12h.01M16 12h.01" />
  </svg>
);

export const MapIcon = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" /><path d="M9 3v15M15 6v15" />
  </svg>
);

export const ClipboardIcon = ({ size = 24, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    <rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 3h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1V3z" /><path d="M9 11h6M9 15h4" />
  </svg>
);

/* ── Service tile icons (Claude Design handoff) ──────────────────
   Custom-drawn, viewBox 0 0 32 32, with `currentColor` driving the
   icon "body" and `#fff` as the accent pop. Designed to render with
   parent `color` set to a mid/light Carolina blue, layered over the
   gradient tile: tile → body (lighter blue) → white accents. */

export const AIIcon = ({ size = 28, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" shapeRendering="geometricPrecision" aria-hidden="true" {...rest}>
    {/* Outer chip package */}
    <rect x="6" y="6" width="20" height="20" rx="2" fill="currentColor" />
    <rect x="6" y="6" width="20" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    {/* Pin legs — 4 per side */}
    <line x1="2" y1="10" x2="6" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="2" y1="14" x2="6" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="2" y1="18" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="2" y1="22" x2="6" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="26" y1="10" x2="30" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="26" y1="14" x2="30" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="26" y1="18" x2="30" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="26" y1="22" x2="30" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="10" y1="2" x2="10" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="14" y1="2" x2="14" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="18" y1="2" x2="18" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="22" y1="2" x2="22" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="10" y1="26" x2="10" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="14" y1="26" x2="14" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="18" y1="26" x2="18" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    <line x1="22" y1="26" x2="22" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="square" />
    {/* Inner die */}
    <rect x="11" y="11" width="10" height="10" rx="1" fill="#fff" />
    {/* "AI" mark */}
    <path d="M12.6 19 L14.2 13 L15.8 19 M13 17 L15.4 17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <path d="M17.6 13 L19.4 13 M17.6 19 L19.4 19 M18.5 13 L18.5 19" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
    {/* Pin-1 indicator dot */}
    <circle cx="8.5" cy="8.5" r="1" fill="#fff" />
  </svg>
);

export const WebsiteIcon = ({ size = 28, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" shapeRendering="geometricPrecision" aria-hidden="true" {...rest}>
    {/* Browser body */}
    <rect x="3" y="6" width="26" height="20" rx="2" fill="currentColor" />
    <rect x="3" y="6" width="26" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    {/* Title bar */}
    <path d="M5 6 H27 A2 2 0 0 1 29 8 V11 H3 V8 A2 2 0 0 1 5 6 Z" fill="#fff" fillOpacity="0.18" />
    <line x1="3" y1="11" x2="29" y2="11" stroke="currentColor" strokeWidth="2" />
    {/* Traffic lights */}
    <circle cx="6" cy="8.5" r="1.1" fill="#fff" />
    <circle cx="9" cy="8.5" r="1.1" fill="#fff" opacity="0.7" />
    <circle cx="12" cy="8.5" r="1.1" fill="#fff" opacity="0.45" />
    {/* URL bar */}
    <rect x="16" y="7.25" width="11" height="2.5" rx="1.25" fill="#fff" fillOpacity="0.28" />
    {/* Page content rules */}
    <rect x="6" y="15" width="9" height="2" rx="1" fill="#fff" />
    <rect x="6" y="19" width="13" height="1.6" rx="0.8" fill="#fff" opacity="0.55" />
    <rect x="6" y="22" width="10" height="1.6" rx="0.8" fill="#fff" opacity="0.55" />
    {/* Cursor + click flicks */}
    <path d="M21 14 L21 23 L23.2 21 L24.7 24.2 L26 23.6 L24.5 20.4 L27 20.4 Z" fill="#fff" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
  </svg>
);

export const ProcessIcon = ({ size = 28, ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" shapeRendering="geometricPrecision" aria-hidden="true" {...rest}>
    {/* Back card — "before" paper */}
    <rect x="3" y="9" width="14" height="19" rx="2" fill="currentColor" fillOpacity="0.35" />
    <rect x="3" y="9" width="14" height="19" rx="2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <rect x="6" y="13" width="8" height="1.4" rx="0.7" fill="#fff" opacity="0.7" />
    <rect x="6" y="16" width="6" height="1.4" rx="0.7" fill="#fff" opacity="0.7" />
    <rect x="6" y="19" width="7" height="1.4" rx="0.7" fill="#fff" opacity="0.7" />
    <rect x="6" y="22" width="5" height="1.4" rx="0.7" fill="#fff" opacity="0.7" />
    {/* Front card — "after" dashboard */}
    <rect x="13" y="4" width="16" height="20" rx="2" fill="currentColor" />
    <rect x="13" y="4" width="16" height="20" rx="2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    {/* Header */}
    <circle cx="16" cy="8" r="1.4" fill="#fff" />
    <rect x="18.5" y="7" width="8" height="2" rx="1" fill="#fff" />
    {/* Ascending bars */}
    <rect x="15" y="16" width="3" height="5" rx="0.5" fill="#fff" />
    <rect x="19" y="13" width="3" height="8" rx="0.5" fill="#fff" />
    <rect x="23" y="10" width="3" height="11" rx="0.5" fill="#fff" />
    {/* Trendline + endpoint */}
    <path d="M16 14 L20 11 L24 8" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.85" />
    <circle cx="24" cy="8" r="1.3" fill="#fff" />
  </svg>
);

/* ── TSD Prism Logo ──────────────────────────────────────────── */
export const TSDLogo = ({ size = 48, ...rest }) => (
  <svg width={size * 1.17} height={size * 0.65} viewBox="0 0 140 78" fill="none" {...rest}>
    <g transform="skewX(-12)">
      <rect x="18" y="4" width="30" height="70" rx="2" fill="#a8d1ed" />
      <rect x="48" y="4" width="30" height="70" rx="2" fill="#7BB8E0" />
      <rect x="78" y="4" width="30" height="70" rx="2" fill="#2c5f8a" />
      <rect x="108" y="4" width="30" height="70" rx="2" fill="#13294B" />
    </g>
    <text x="30" y="52" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="26" fill="#fff" letterSpacing="2">T</text>
    <text x="60" y="52" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="26" fill="#fff" letterSpacing="2">S</text>
    <text x="92" y="52" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="26" fill="#fff" letterSpacing="2">D</text>
  </svg>
);
