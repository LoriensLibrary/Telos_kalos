interface Segments {
  head: string;
  lArm: string;
  rArm: string;
  trunk: string;
  lLeg: string;
  rLeg: string;
}

interface Props {
  size?: number;
  segments?: Segments;
  visceral?: number; // lb — scales the visceral hotspot
}

const DEFAULT_SEGMENTS: Segments = {
  head: '3.8', lArm: '6.4', rArm: '6.6', trunk: '48.2', lLeg: '23.8', rLeg: '23.2',
};

// Stylized DEXA body scan visualization — anterior view with segmented
// fat/lean/bone color coding, like a real DEXA report image.
export default function DEXABody({ size = 380, segments = DEFAULT_SEGMENTS, visceral = 1.14 }: Props) {
  const w = 240;
  const h = 520;

  // Scale visceral hotspot: baseline 1.45 lb = largest, 1.0 lb = smallest target
  // Maps visceral value [1.0..1.5] → ellipse radii [28..52, 22..40]
  const vClamp = Math.min(1.5, Math.max(0.8, visceral));
  const vIntensity = (vClamp - 0.8) / 0.7; // 0..1
  const viscRx = 28 + vIntensity * 24;
  const viscRy = 22 + vIntensity * 18;
  const viscOpacity = 0.4 + vIntensity * 0.4;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      style={{ width: '100%', maxWidth: size, height: 'auto', display: 'block' }}
    >
      <defs>
        <linearGradient id="fatGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB87A" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FF9988" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="leanGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ac)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--cy)" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="boneGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5F7FA" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#B8E8FF" stopOpacity="0.75" />
        </linearGradient>
        <radialGradient id="organHeat" cx="50%" cy="35%" r="50%">
          <stop offset="0%" stopColor="#FF9988" stopOpacity={viscOpacity} />
          <stop offset="100%" stopColor="#FF9988" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      {/* background grid — scan ruler feel */}
      {Array.from({ length: 13 }).map((_, i) => (
        <line key={`h${i}`} x1="0" y1={i * 40} x2={w} y2={i * 40} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}
      {Array.from({ length: 7 }).map((_, i) => (
        <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2={h} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
      ))}

      {/* === BODY OUTLINE (lean tissue base layer) === */}
      <g fill="url(#leanGrad)" stroke="rgba(125,211,252,0.4)" strokeWidth="0.5">
        <ellipse cx="120" cy="48" rx="26" ry="32" />
        <path d="M108,76 L108,92 L132,92 L132,76 Z" />
        <path d="M70,98 Q80,90 108,92 L132,92 Q160,90 170,98 L172,120 Q120,114 68,120 Z" />
        <path d="M68,120 Q66,140 70,180 L72,240 Q90,250 120,250 Q150,250 168,240 L170,180 Q174,140 172,120 Q120,114 68,120 Z" />
        <path d="M72,240 L74,290 Q120,300 166,290 L168,240 Q120,250 72,240 Z" />
        <path d="M58,108 L40,200 L52,210 L72,116 Z" />
        <path d="M182,108 L200,200 L188,210 L168,116 Z" />
        <path d="M40,200 L30,290 L46,294 L54,210 Z" />
        <path d="M200,200 L210,290 L194,294 L186,210 Z" />
        <ellipse cx="36" cy="304" rx="9" ry="14" />
        <ellipse cx="204" cy="304" rx="9" ry="14" />
        <path d="M76,290 L70,400 L100,408 L106,290 Z" />
        <path d="M164,290 L170,400 L140,408 L134,290 Z" />
        <path d="M70,400 L72,496 L98,500 L100,408 Z" />
        <path d="M170,400 L168,496 L142,500 L140,408 Z" />
        <ellipse cx="85" cy="506" rx="16" ry="8" />
        <ellipse cx="155" cy="506" rx="16" ry="8" />
      </g>

      {/* === FAT OVERLAY (subcutaneous, distributed) === */}
      <g fill="url(#fatGrad)" opacity="0.7" stroke="rgba(255,184,122,0.4)" strokeWidth="0.4">
        {/* trunk fat (visceral hotspot — scales with visceral value) */}
        <ellipse cx="120" cy="195" rx={viscRx} ry={viscRy} fill="url(#organHeat)" />
        <ellipse cx="78" cy="210" rx="10" ry="22" />
        <ellipse cx="162" cy="210" rx="10" ry="22" />
        <ellipse cx="92" cy="280" rx="14" ry="10" />
        <ellipse cx="148" cy="280" rx="14" ry="10" />
        <ellipse cx="88" cy="340" rx="14" ry="22" />
        <ellipse cx="152" cy="340" rx="14" ry="22" />
      </g>

      {/* === BONE / SKELETAL OVERLAY === */}
      <g fill="url(#boneGrad)" stroke="rgba(255,255,255,0.6)" strokeWidth="0.6" filter="url(#glow)">
        <path d="M118,92 L118,260 L122,260 L122,92 Z" opacity="0.7" />
        <path d="M80,100 Q120,108 160,100" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
        {[0, 1, 2, 3].map((i) => (
          <path
            key={`rib${i}`}
            d={`M${80 + i * 2},${130 + i * 14} Q120,${145 + i * 14} ${160 - i * 2},${130 + i * 14}`}
            fill="none"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="0.8"
          />
        ))}
        <path d="M82,300 L86,400 L92,400 L88,300 Z" opacity="0.6" />
        <path d="M158,300 L154,400 L148,400 L152,300 Z" opacity="0.6" />
        <path d="M82,410 L84,498 L90,498 L88,410 Z" opacity="0.6" />
        <path d="M158,410 L156,498 L150,498 L152,410 Z" opacity="0.6" />
        <path d="M58,116 L42,200" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
        <path d="M182,116 L198,200" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" fill="none" />
      </g>

      {/* === REGION DIVIDERS === */}
      <g stroke="rgba(255,255,255,0.30)" strokeDasharray="3 3" strokeWidth="0.8" fill="none">
        <line x1="20" y1="92" x2="220" y2="92" />
        <line x1="20" y1="245" x2="220" y2="245" />
        <line x1="20" y1="290" x2="220" y2="290" />
        <line x1="65" y1="92" x2="55" y2="200" />
        <line x1="175" y1="92" x2="185" y2="200" />
        <line x1="120" y1="92" x2="120" y2="500" strokeDasharray="2 6" strokeWidth="0.5" />
      </g>

      {/* === REGION LABELS + VALUES (now driven by props) === */}
      <g fill="rgba(255,255,255,0.9)" fontFamily="Geist Mono, monospace" fontSize="9" letterSpacing="1.5">
        <text x="160" y="55" fill="var(--ac-b)">HEAD</text>
        <text x="160" y="68" fontSize="8" fill="rgba(255,255,255,0.55)">{segments.head} lb</text>

        <text x="2" y="160" fill="var(--cy-b)">L ARM</text>
        <text x="2" y="173" fontSize="8" fill="rgba(255,255,255,0.55)">{segments.lArm} lb</text>

        <text x="210" y="160" fill="var(--cy-b)">R ARM</text>
        <text x="210" y="173" fontSize="8" fill="rgba(255,255,255,0.55)">{segments.rArm} lb</text>

        <text x="170" y="190" fill="var(--ac-b)">TRUNK</text>
        <text x="170" y="203" fontSize="8" fill="rgba(255,255,255,0.55)">{segments.trunk} lb</text>

        <text x="125" y="195" fill="#FFD9A0" fontSize="8">VISC {visceral.toFixed(2)}</text>

        <text x="170" y="270" fill="var(--purple)">PELVIS</text>

        <text x="2" y="370" fill="var(--cy-b)">L LEG</text>
        <text x="2" y="383" fontSize="8" fill="rgba(255,255,255,0.55)">{segments.lLeg} lb</text>

        <text x="210" y="370" fill="var(--cy-b)">R LEG</text>
        <text x="210" y="383" fontSize="8" fill="rgba(255,255,255,0.55)">{segments.rLeg} lb</text>
      </g>

      {/* === SCAN HEADER STRIP === */}
      <g>
        <rect x="0" y="0" width={w} height="22" fill="rgba(4,4,10,0.7)" />
        <text x="8" y="14" fill="var(--ac-b)" fontFamily="Geist Mono, monospace" fontSize="8" letterSpacing="1.5">
          DEXA · ANTERIOR VIEW · 6 MIN SCAN
        </text>
        <text x={w - 8} y="14" textAnchor="end" fill="rgba(255,255,255,0.5)" fontFamily="Geist Mono, monospace" fontSize="8">
          KALOS
        </text>
      </g>
    </svg>
  );
}
