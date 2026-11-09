/**
 * Original album-cover artwork for the Metal East Records demo.
 * Drawn as SVG (no images); fictional bands and titles — no real artwork is copied.
 */

export type RecordId = "midnight" | "thunder" | "ember" | "souk";

export type RecordInfo = {
  id: RecordId;
  title: string;
  artist: string;
  genre: string;
  /** Colour of the record's centre label. */
  label: string;
};

export const RECORDS: RecordInfo[] = [
  { id: "midnight", title: "Midnight Groove", artist: "Neon Avenue", genre: "Pop · Funk", label: "#f5c542" },
  { id: "thunder", title: "Desert Thunder", artist: "Iron Dunes", genre: "Heavy Metal", label: "#c0392b" },
  { id: "ember", title: "Ember Halo", artist: "Saltfire", genre: "Synthwave", label: "#e08a2c" },
  { id: "souk", title: "Neon Souk", artist: "Old Deira", genre: "Lo-fi · Oriental", label: "#2bb3a3" },
];

function Midnight() {
  return (
    <>
      <defs>
        <radialGradient id="mg-spot" cx="50%" cy="0%" r="95%">
          <stop offset="0" stopColor="#fff6d8" stopOpacity="0.95" />
          <stop offset="0.35" stopColor="#f5c542" stopOpacity="0.35" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="mg-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f5c542" stopOpacity="0.55" />
          <stop offset="1" stopColor="#f5c542" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="#07060a" />
      <polygon points="38,0 62,0 88,82 12,82" fill="url(#mg-spot)" />
      <ellipse cx="50" cy="82" rx="30" ry="5" fill="url(#mg-floor)" />
      {/* Dancer silhouette, mid-pose */}
      <g fill="#0b0a0d" stroke="#fff6d8" strokeWidth="0.8" strokeLinejoin="round">
        <path d="M47 30 l7 -2 l2 -6 l3 1 l-2 7 l-6 4 z" /> {/* hat */}
        <circle cx="51" cy="35" r="3.6" />
        <path d="M48 39 L56 39 L58 55 L46 55 Z" /> {/* torso */}
        <path d="M56 41 L70 33 L71 35 L58 45 Z" /> {/* raised arm */}
        <path d="M48 41 L39 50 L41 52 L50 45 Z" /> {/* lower arm */}
        <path d="M47 55 L44 70 L40 79 L44 80 L49 70 L52 56 Z" /> {/* standing leg */}
        <path d="M53 55 L60 66 L67 68 L67 71 L58 69 L50 58 Z" /> {/* kicked leg */}
      </g>
      {[[20, 20], [80, 26], [74, 12], [26, 52], [84, 56], [14, 36]].map(([x, y], i) => (
        <path
          key={i}
          d={`M${x} ${y - 3} L${x + 0.8} ${y - 0.8} L${x + 3} ${y} L${x + 0.8} ${y + 0.8} L${x} ${y + 3} L${x - 0.8} ${y + 0.8} L${x - 3} ${y} L${x - 0.8} ${y - 0.8} Z`}
          fill="#f5c542"
          opacity={0.9 - i * 0.1}
        />
      ))}
      <text x="50" y="94" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="9.5" fill="#f5c542">
        Midnight Groove
      </text>
      <text x="6" y="9" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="5.5" letterSpacing="1.2" fill="#fff6d8">
        NEON AVENUE
      </text>
    </>
  );
}

function Thunder() {
  return (
    <>
      <defs>
        <linearGradient id="dt-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a0503" />
          <stop offset="0.6" stopColor="#7a1a0c" />
          <stop offset="1" stopColor="#c2541c" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#dt-sky)" />
      <circle cx="50" cy="58" r="22" fill="#f0b25a" opacity="0.85" />
      <path d="M57 6 L42 40 L52 40 L38 76 L66 32 L55 32 L68 6 Z" fill="#fff3d6" stroke="#1a0503" strokeWidth="1.2" />
      <path d="M0 74 Q25 62 50 72 T100 68 L100 100 L0 100 Z" fill="#1a0503" />
      <path d="M0 84 Q30 76 60 84 T100 82 L100 100 L0 100 Z" fill="#0c0201" />
      <text x="50" y="18" textAnchor="middle" fontFamily="Impact, 'Arial Black', sans-serif" fontSize="11" letterSpacing="1" fill="#1a0503" stroke="#f0b25a" strokeWidth="0.6">
        IRON DUNES
      </text>
      <text x="50" y="95" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="5.5" letterSpacing="2" fill="#f0b25a">
        DESERT THUNDER
      </text>
    </>
  );
}

function Ember() {
  return (
    <>
      <defs>
        <linearGradient id="eh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b0b2e" />
          <stop offset="0.55" stopColor="#7a1f5c" />
          <stop offset="1" stopColor="#e08a2c" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#eh-sky)" />
      {[30, 25, 20].map((r, i) => (
        <circle key={r} cx="50" cy="48" r={r} fill="none" stroke="#ffb35c" strokeOpacity={0.25 + i * 0.2} strokeWidth="0.8" />
      ))}
      <circle cx="50" cy="48" r="15" fill="#120617" />
      <circle cx="50" cy="48" r="15" fill="none" stroke="#ffd29a" strokeWidth="1.4" />
      {/* perspective grid */}
      <rect y="68" width="100" height="32" fill="#120617" opacity="0.85" />
      {[-60, -35, -15, 0, 15, 35, 60].map((dx) => (
        <line key={dx} x1={50 + dx * 0.15} y1="68" x2={50 + dx * 1.6} y2="100" stroke="#ff7ac8" strokeWidth="0.5" opacity="0.7" />
      ))}
      {[72, 77, 84, 93].map((y) => (
        <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#ff7ac8" strokeWidth="0.5" opacity="0.6" />
      ))}
      <text x="50" y="14" textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="8" letterSpacing="3" fill="#ffd29a">
        EMBER HALO
      </text>
      <text x="50" y="21" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="4.5" letterSpacing="2" fill="#ff9ad5">
        SALTFIRE
      </text>
    </>
  );
}

function Souk() {
  return (
    <>
      <defs>
        <linearGradient id="ns-sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#06262b" />
          <stop offset="1" stopColor="#2a0f3d" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" fill="url(#ns-sky)" />
      <path d="M78 14 a9 9 0 1 0 6 15 a7 7 0 1 1 -6 -15 z" fill="#f6e7b5" />
      {/* horseshoe arch gate */}
      <path
        d="M24 92 L24 52 C24 30 36 22 50 22 C64 22 76 30 76 52 L76 92 Z"
        fill="none"
        stroke="#2bb3a3"
        strokeWidth="3"
      />
      <path d="M31 92 L31 54 C31 37 40 30 50 30 C60 30 69 37 69 54 L69 92 Z" fill="#041619" opacity="0.8" />
      {/* lanterns */}
      {[38, 50, 62].map((x, i) => (
        <g key={x}>
          <line x1={x} y1="30" x2={x} y2={40 + i * 3 - (i === 1 ? 3 : 0)} stroke="#f6e7b5" strokeWidth="0.4" />
          <ellipse cx={x} cy={43 + i * 3 - (i === 1 ? 3 : 0)} rx="2.6" ry="3.6" fill={["#ff6fb5", "#ffd166", "#2bb3a3"][i]} />
        </g>
      ))}
      <text x="50" y="72" textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontWeight="700" fontSize="10" fill="#ffd166">
        Neon Souk
      </text>
      <text x="50" y="80" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="4.5" letterSpacing="2" fill="#7fe3d6">
        OLD DEIRA
      </text>
    </>
  );
}

const ART: Record<RecordId, () => JSX.Element> = {
  midnight: Midnight,
  thunder: Thunder,
  ember: Ember,
  souk: Souk,
};

export function RecordCover({ id, className }: { id: RecordId; className?: string }) {
  const Art = ART[id];
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden preserveAspectRatio="xMidYMid slice">
      <Art />
    </svg>
  );
}
