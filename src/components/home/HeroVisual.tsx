export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-[#FBEBDD] via-[#FDF3E7] to-[#EAF3F1] shadow-sm">
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMax slice"
        aria-hidden="true"
      >
        <path
          d="M40 300 Q200 250 360 300"
          stroke="var(--secondary)"
          strokeWidth="6"
          fill="none"
          opacity="0.5"
        />
        <path
          d="M110 190 L200 110 L290 190 V270 H110 Z"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="7"
          strokeLinejoin="round"
        />
        <rect x="178" y="220" width="44" height="50" fill="var(--primary)" opacity="0.15" />
        <rect x="130" y="205" width="26" height="26" rx="2" fill="var(--accent)" opacity="0.85" />
        <rect x="244" y="205" width="26" height="26" rx="2" fill="var(--accent)" opacity="0.85" />
      </svg>
      <div className="absolute left-4 top-4 rounded-xl bg-card/95 px-3 py-2 text-xs font-medium shadow-sm backdrop-blur">
        <span className="text-secondary">● Annonce vérifiée</span>
      </div>
      <div className="absolute bottom-4 right-4 rounded-xl bg-card/95 px-3 py-2 text-xs font-medium shadow-sm backdrop-blur">
        250 000 <span className="text-accent">FCFA</span> / mois
      </div>
    </div>
  );
}
