// §3.1 Vort mark: a leaning vertical stroke (~10° clockwise) with a
// punctuation dot to its right. Flat coral, no gradient, no shadow (§3.2/§3.7).
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      aria-hidden="true"
      role="img"
    >
      {/* leaning stroke: ~12% of height stroke width, rounded ends, ~10° tilt */}
      <line
        x1="42"
        y1="18"
        x2="30"
        y2="82"
        stroke="var(--primary)"
        strokeWidth="12"
        strokeLinecap="round"
      />
      {/* dot: diameter ~26% of height, right of stroke, lower third */}
      <circle cx="66" cy="70" r="13" fill="var(--primary)" />
    </svg>
  );
}

export function Wordmark({ size = 28 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <LogoMark size={size} />
      <span
        className="font-heading font-extrabold text-fg"
        style={{ fontSize: size * 0.85, letterSpacing: "-0.04em" }}
      >
        Vort
      </span>
    </div>
  );
}
