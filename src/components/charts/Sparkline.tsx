interface Props {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  fill?: boolean;
  showDots?: boolean;
}

export default function Sparkline({
  values,
  width = 320,
  height = 80,
  color = 'var(--ac)',
  fill = true,
  showDots = false,
}: Props) {
  if (!values.length) return null;
  const pad = 6;
  const cw = width - pad * 2;
  const ch = height - pad * 2;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = cw / (values.length - 1 || 1);
  const pts = values.map((v, i) => ({
    x: pad + i * step,
    y: pad + ch - ((v - min) / range) * ch,
  }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `${pts[0].x},${pad + ch} ${line} ${pts[pts.length - 1].x},${pad + ch}`;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
      {fill && <polygon points={area} fill={color} opacity={0.10} />}
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: `drop-shadow(0 0 4px ${color})` }}
      />
      {showDots &&
        pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2} fill={color} stroke="var(--bg)" strokeWidth={1} />
        ))}
    </svg>
  );
}
