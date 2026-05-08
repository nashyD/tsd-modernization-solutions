export function Logo({ size = 24, className = "" }: { size?: number; className?: string }) {
  // 4-slab prism mark: matches the marketing site's visual mark in spirit
  // (simplified vector — Carolina blue + Navy)
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
      <Logo size={22} />
      <span className="font-semibold tracking-tight text-[#13294B]">
        TSD Modernization
      </span>
    </span>
  );
}
