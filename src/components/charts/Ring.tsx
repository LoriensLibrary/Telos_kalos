interface Props {
  pct: number; // 0..100
  size?: number;
  stroke?: number;
  color?: string;
  track?: string;
  label?: string;
  sublabel?: string;
}

export default function Ring({
  pct,
  size = 96,
  stroke = 9,
  color = 'var(--ac)',
  track = 'rgba(255,255,255,0.08)',
  label,
  sublabel,
}: Props) {
  // Pad the SVG canvas so the drop-shadow glow has room and doesn't get
  // clipped at the corners, which leaves visible square edges.
  const pad = 10;
  const cs = size + pad * 2; // canvas size
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - Math.min(100, Math.max(0, pct)) / 100);

  return (
    <div
      className="ring-wrap"
      style={{ position: 'relative', width: size, height: size }}
    >
      <svg
        width={cs}
        height={cs}
        viewBox={`0 0 ${cs} ${cs}`}
        style={{
          position: 'absolute',
          left: -pad,
          top: -pad,
          overflow: 'visible',
          transform: 'rotate(-90deg)',
        }}
      >
        <circle cx={cs / 2} cy={cs / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <circle
          cx={cs / 2}
          cy={cs / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {label && (
          <div className="mono num" style={{ fontSize: size / 5, lineHeight: 1, color: 'var(--ink)' }}>
            {label}
          </div>
        )}
        {sublabel && (
          <div className="lbl" style={{ fontSize: 8, marginTop: 3 }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
}
