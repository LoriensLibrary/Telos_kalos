interface Props {
  scores: [number, number, number];
  projected: [number, number, number];
  size?: number;
}

const LABS = ['MUSCLE', 'FAT', 'SYMMETRY'] as const;

export default function TriangleChart({ scores, projected, size = 220 }: Props) {
  // viewBox padding so LONGEVITY / PERFORMANCE labels fit fully on each side.
  const padH = 60;
  const padV = 18;
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.46;
  const vbX = -padH;
  const vbY = -padV;
  const vbW = size + padH * 2;
  const vbH = size + padV * 2;

  const angles = [-90, 150, 30].map((a) => (a * Math.PI) / 180);
  const vtx = angles.map((a) => ({ x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }));

  const pt = (s: number[]) =>
    angles.map((a, i) => ({
      x: cx + ((r * s[i]) / 100) * Math.cos(a),
      y: cy + ((r * s[i]) / 100) * Math.sin(a),
    }));
  const pts = pt(scores);
  const proj = pt(projected);
  const poly = (arr: { x: number; y: number }[]) => arr.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <svg
      viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {[0.25, 0.5, 0.75, 1].map((s) => (
        <polygon
          key={s}
          points={angles
            .map((a) => `${cx + r * s * Math.cos(a)},${cy + r * s * Math.sin(a)}`)
            .join(' ')}
          fill="none"
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="0.8"
        />
      ))}
      {vtx.map((v, i) => (
        <line key={i} x1={cx} y1={cy} x2={v.x} y2={v.y} stroke="rgba(255,255,255,0.10)" />
      ))}

      <polygon
        points={poly(proj)}
        fill="color-mix(in srgb, var(--ac) 5%, transparent)"
        stroke="var(--ac-b)"
        strokeWidth="1"
        strokeDasharray="4 3"
        opacity="0.6"
      />
      <polygon
        points={poly(pts)}
        fill="color-mix(in srgb, var(--ac) 18%, transparent)"
        stroke="var(--ac)"
        strokeWidth="2"
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill="var(--ac)" stroke="var(--bg)" strokeWidth="2" />
      ))}

      {vtx.map((v, i) => {
        const ox = v.x > cx + 1 ? 8 : v.x < cx - 1 ? -8 : 0;
        const oy = v.y > cy ? 14 : -8;
        return (
          <text
            key={i}
            x={v.x + ox}
            y={v.y + oy}
            textAnchor={v.x > cx + 1 ? 'start' : v.x < cx - 1 ? 'end' : 'middle'}
            fill="rgba(255,255,255,0.72)"
            fontSize="10"
            fontFamily="Geist Mono, monospace"
            letterSpacing="1.2"
          >
            {LABS[i]}
          </text>
        );
      })}
    </svg>
  );
}
