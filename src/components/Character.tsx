import { getCharacter, type CharacterTheme } from "@/lib/mbti/characters";

const CX = 100;
const CY = 106;

function Mirror({ children }: { children: React.ReactNode }) {
  return (
    <>
      <g>{children}</g>
      <g transform="translate(200 0) scale(-1 1)">{children}</g>
    </>
  );
}

function EarsBack({ c }: { c: CharacterTheme }) {
  const dark = c.fur2;
  switch (c.ears) {
    case "pointy":
      return (
        <Mirror>
          <path d="M48 84 L52 20 L92 56 Z" fill={c.mask === "husky" ? dark : c.fur} />
          <path d="M57 70 L59 38 L80 56 Z" fill={c.mask === "husky" ? "#f1f1f4" : c.fur2} />
        </Mirror>
      );
    case "bat":
      return (
        <Mirror>
          <path d="M44 86 L46 10 L98 58 Z" fill={c.mask === "shepherd" ? dark : c.fur} />
          <path d="M54 72 L56 32 L82 56 Z" fill={c.mask === "shepherd" ? "#5a4a3e" : "#f6c9c0"} />
        </Mirror>
      );
    case "fold":
      return (
        <Mirror>
          <path d="M50 76 L42 34 Q72 22 92 56 Z" fill={c.mask === "collie" ? dark : c.mask === "pug" ? dark : c.fur2} />
        </Mirror>
      );
    case "floppy":
      return (
        <Mirror>
          <ellipse cx={44} cy={104} rx={19} ry={36} transform="rotate(10 44 104)" fill={c.fur2} />
        </Mirror>
      );
    case "longfloppy":
      return (
        <Mirror>
          <ellipse cx={42} cy={122} rx={21} ry={52} transform="rotate(6 42 122)" fill={c.fur2} />
        </Mirror>
      );
    case "puff":
      return (
        <Mirror>
          <circle cx={44} cy={104} r={27} fill={c.fur} />
          <circle cx={40} cy={126} r={20} fill={c.fur} />
        </Mirror>
      );
  }
}

function Cloud({ c }: { c: CharacterTheme }) {
  const bumps = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    return { x: CX + Math.cos(a) * 52, y: CY - 4 + Math.sin(a) * 46 };
  });
  return (
    <g fill={c.fur}>
      {bumps.map((b, i) => (
        <circle key={i} cx={b.x} cy={b.y} r={19} />
      ))}
      {c.name === "푸들" && <circle cx={100} cy={40} r={24} />}
    </g>
  );
}

function Markings({ c }: { c: CharacterTheme }) {
  switch (c.mask) {
    case "husky":
      return (
        <>
          <path d="M30 30 H170 V92 Q150 78 128 90 Q100 72 72 90 Q50 78 30 92 Z" fill={c.fur2} />
          <path d="M100 44 L86 92 L114 92 Z" fill="#fff" />
        </>
      );
    case "blaze":
      return (
        <>
          <path d="M100 48 Q82 92 80 124 L120 124 Q118 92 100 48 Z" fill={c.fur2} />
          <ellipse cx={66} cy={122} rx={20} ry={16} fill={c.fur2} />
          <ellipse cx={134} cy={122} rx={20} ry={16} fill={c.fur2} />
        </>
      );
    case "beagle":
      return <path d="M40 60 Q100 14 160 60 L160 84 Q100 68 40 84 Z" fill={c.fur2} />;
    case "eyepatch":
      return (
        <>
          <ellipse cx={74} cy={90} rx={20} ry={18} fill={c.fur2} />
          <ellipse cx={128} cy={84} rx={14} ry={13} fill={c.fur2} />
          <path d="M70 52 Q96 38 118 56 Q96 60 70 52 Z" fill={c.fur2} />
        </>
      );
    case "collie":
      return (
        <>
          <path d="M100 48 Q84 92 82 124 L118 124 Q116 92 100 48 Z" fill="#fff" />
          <ellipse cx={100} cy={128} rx={32} ry={22} fill="#fff" />
        </>
      );
    case "shepherd":
      return <path d="M58 58 Q100 30 142 58 Q122 72 100 70 Q78 72 58 58 Z" fill={c.fur2} />;
    case "shiba":
      return (
        <>
          <ellipse cx={66} cy={124} rx={24} ry={20} fill={c.fur2} />
          <ellipse cx={134} cy={124} rx={24} ry={20} fill={c.fur2} />
          <circle cx={78} cy={78} r={5} fill={c.fur2} />
          <circle cx={122} cy={78} r={5} fill={c.fur2} />
        </>
      );
    case "schnauzer":
      return (
        <>
          <path d="M64 116 Q100 176 136 116 Q100 130 64 116 Z" fill="#eceef2" />
          <ellipse cx={78} cy={82} rx={16} ry={8} fill="#eceef2" />
          <ellipse cx={122} cy={82} rx={16} ry={8} fill="#eceef2" />
        </>
      );
    default:
      return null;
  }
}

export default function Character({
  mbti,
  size = 160,
}: {
  mbti: string | null | undefined;
  size?: number;
}) {
  const c = getCharacter(mbti);
  const id = `dog-${mbti ?? "x"}`;
  const darkMuzzle = c.mask === "pug" || c.mask === "shepherd";
  const longMuzzle = c.mask === "collie" || c.mask === "shepherd";

  return (
    <svg
      viewBox="0 0 200 210"
      width={size}
      height={(size * 210) / 200}
      role="img"
      aria-label={`${c.name} 캐릭터`}
    >
      <defs>
        <clipPath id={`${id}-clip`}>
          <ellipse cx={CX} cy={CY} rx={58} ry={52} />
        </clipPath>
        <radialGradient id={`${id}-bg`} cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#fff" stopOpacity={0.9} />
          <stop offset="1" stopColor={c.accent} stopOpacity={0.35} />
        </radialGradient>
      </defs>

      <circle cx={100} cy={105} r={98} fill={`url(#${id}-bg)`} />
      <circle cx={100} cy={105} r={98} fill="none" stroke={c.accent} strokeWidth={4} strokeDasharray="2 9" strokeLinecap="round" />

      {/* 몸통과 목줄 */}
      <path d="M44 210 C48 166 74 150 100 150 C126 150 152 166 156 210 Z" fill={c.fur === "#fffdf7" ? "#f3ecdc" : c.fur} />
      <path d="M62 156 Q100 176 138 156 L134 170 Q100 188 66 170 Z" fill={c.collar} />
      <circle cx={100} cy={178} r={7} fill="#f6c84a" stroke="#c9972a" strokeWidth={2} />

      {c.fluff ? <Cloud c={c} /> : null}
      <EarsBack c={c} />

      {/* 머리 */}
      <ellipse cx={CX} cy={CY} rx={58} ry={52} fill={c.fur} />
      <g clipPath={`url(#${id}-clip)`}>
        <Markings c={c} />
      </g>

      {/* 주둥이 */}
      <ellipse
        cx={CX}
        cy={longMuzzle ? 126 : 124}
        rx={darkMuzzle ? 30 : 27}
        ry={darkMuzzle ? 24 : 20}
        fill={c.muzzle}
      />
      {c.wrinkle && (
        <g fill="none" stroke={c.mask === "pug" ? "#8a6a40" : "#c9a06a"} strokeWidth={3} strokeLinecap="round">
          <path d="M80 66 Q100 58 120 66" />
          <path d="M84 76 Q100 70 116 76" />
        </g>
      )}

      {/* 눈 */}
      {[78, 122].map((x) => (
        <g key={x}>
          <circle cx={x} cy={96} r={6.5} fill="#2b1f1a" />
          <circle cx={x + 2.2} cy={93.5} r={2.2} fill="#fff" />
        </g>
      ))}
      {(c.mask === "shepherd" || c.mask === "eyepatch" || c.mask === "collie") && (
        <>
          <circle cx={78} cy={82} r={3.5} fill={c.mask === "collie" ? "#f2d9a8" : "#e0b070"} />
          <circle cx={122} cy={82} r={3.5} fill={c.mask === "collie" ? "#f2d9a8" : "#e0b070"} />
        </>
      )}

      {/* 코와 입 */}
      <ellipse cx={CX} cy={112} rx={10} ry={7} fill={c.nose} />
      <ellipse cx={CX - 3} cy={110} rx={3} ry={1.8} fill="#fff" opacity={0.6} />
      <path d="M100 119 V128" stroke="#4a3228" strokeWidth={3} strokeLinecap="round" />
      <path d="M100 128 Q90 138 80 130 M100 128 Q110 138 120 130" fill="none" stroke="#4a3228" strokeWidth={3} strokeLinecap="round" />
      {c.tongue && <path d="M91 133 Q100 156 109 133 Z" fill="#f4788a" stroke="#d4566a" strokeWidth={2} strokeLinejoin="round" />}

      {/* 볼 터치 */}
      <ellipse cx={62} cy={116} rx={9} ry={5.5} fill="#ff9aa8" opacity={0.4} />
      <ellipse cx={138} cy={116} rx={9} ry={5.5} fill="#ff9aa8" opacity={0.4} />
    </svg>
  );
}
