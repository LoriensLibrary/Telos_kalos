import type { AdherencePoint } from '../../data/types';
interface Props { data: AdherencePoint[]; width?: number; height?: number; }
export default function AdherenceChart({ data, width = 400, height = 140 }: Props) {
  const pad = { t: 10, r: 10, b: 28, l: 40 };
  const cw = width - pad.l - pad.r, ch = height - pad.t - pad.b;
  const max = 100; const bw = cw / data.length * 0.6, gap = cw / data.length * 0.4;
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
      {data.map((d, i) => { const x = pad.l + i * (bw + gap) + gap / 2; const bh = (d.val / max) * ch; const y = pad.t + ch - bh;
        return (<g key={i}>
          <rect x={x} y={y} width={bw} height={bh} rx="3" fill={d.color} opacity="0.8" />
          <text x={x + bw/2} y={height - 8} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">{d.label}</text>
          <text x={x + bw/2} y={y - 6} textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace" fontWeight="500">{d.val}%</text>
        </g>); })}
    </svg>);
}