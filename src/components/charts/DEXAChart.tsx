import type { ScanPoint } from '../../data/types';
interface Props { data: ScanPoint[]; width?: number; height?: number; }
export default function DEXAChart({ data, width = 560, height = 200 }: Props) {
  const pad = { t: 20, r: 20, b: 40, l: 50 }; const cw = width - pad.l - pad.r; const ch = height - pad.t - pad.b;
  const allVals = data.flatMap(d => [d.fat, d.lean]); const max = Math.max(...allVals) * 1.1; const min = Math.min(0, ...allVals);
  const range = max - min || 1; const xStep = cw / (data.length - 1);
  const makePath = (key: 'fat' | 'lean') => data.map((d, i) => `${pad.l + i * xStep},${pad.t + ch - (((d[key] - min) / range) * ch)}`).join(' ');
  const makeArea = (key: 'fat' | 'lean') => { const pts = data.map((d, i) => `${pad.l + i * xStep},${pad.t + ch - (((d[key] - min) / range) * ch)}`); return `${pad.l},${pad.t + ch} ${pts.join(' ')} ${pad.l + (data.length - 1) * xStep},${pad.t + ch}`; };
  const yTicks = 5; const yLines = Array.from({ length: yTicks + 1 }, (_, i) => min + ((max - min) / yTicks) * i);
  const colors: Record<string,string> = { fat: '#FFB87A', lean: '#65D9A8' };
  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto' }}>
      {yLines.map((v, i) => { const y = pad.t + ch - ((v - min) / range) * ch; return (<g key={i}><line x1={pad.l} y1={y} x2={width - pad.r} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" /><text x={pad.l - 8} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">{v.toFixed(1)}</text></g>); })}
      {data.map((d, i) => (<text key={i} x={pad.l + i * xStep} y={height - 8} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="9" fontFamily="monospace">{d.label}</text>))}
      {(['fat', 'lean'] as const).map(key => (<g key={key}>
        <polygon points={makeArea(key)} fill={colors[key]} opacity="0.12" />
        <polyline points={makePath(key)} fill="none" stroke={colors[key]} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => (<circle key={i} cx={pad.l + i * xStep} cy={pad.t + ch - (((d[key] - min) / range) * ch)} r="3" fill={colors[key]} stroke="#07080A" strokeWidth="1.5" />))}
      </g>))}
      <g transform={`translate(${pad.l},${height - 2})`}><circle cx="0" cy="-3" r="4" fill={colors.fat} /><text x="10" y="0" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace">Body Fat %</text><circle cx="120" cy="-3" r="4" fill={colors.lean} /><text x="130" y="0" fill="rgba(255,255,255,0.5)" fontSize="9" fontFamily="monospace">Lean Mass</text></g>
    </svg>);
}