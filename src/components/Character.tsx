import { getCharacter, type CharacterTheme } from "@/lib/mbti/characters";

const SKIN = "#f6d9bf";
const SKIN_SHADE = "#e6b898";

function Hair({ c, part }: { c: CharacterTheme; part: "back" | "front" }) {
  const h = c.hair;
  if (part === "back") {
    switch (c.hairStyle) {
      case "long":
        return <path d="M58 92 C40 150 48 190 70 196 L130 196 C152 190 160 150 142 92 Z" fill={h} />;
      case "bob":
        return <path d="M56 90 C44 130 54 150 70 150 L130 150 C146 150 156 130 144 90 Z" fill={h} />;
      case "ponytail":
        return <path d="M128 70 C170 60 186 120 160 160 C170 120 150 100 128 96 Z" fill={h} />;
      case "buns":
        return (
          <>
            <circle cx="62" cy="50" r="17" fill={h} />
            <circle cx="138" cy="50" r="17" fill={h} />
          </>
        );
      case "wavy":
        return <path d="M56 80 C40 110 56 128 66 120 L134 120 C144 128 160 110 144 80 Z" fill={h} />;
      default:
        return null;
    }
  }
  switch (c.hairStyle) {
    case "spiky":
      return <path d="M54 88 L56 52 L72 70 L82 36 L98 62 L116 34 L124 66 L146 48 L146 88 C130 70 70 70 54 88 Z" fill={h} />;
    case "bob":
    case "long":
      return <path d="M54 90 C52 40 148 40 146 90 C132 66 96 62 80 70 C70 74 62 80 54 90 Z" fill={h} />;
    case "wavy":
      return <path d="M54 90 C48 44 150 40 146 90 C140 70 128 64 112 74 C100 62 84 66 76 76 C68 70 60 78 54 90 Z" fill={h} />;
    case "buns":
    case "ponytail":
      return <path d="M54 90 C54 42 146 42 146 90 C130 64 70 64 54 90 Z" fill={h} />;
    default:
      return <path d="M54 92 C50 44 150 44 146 92 C134 72 100 70 90 62 C84 72 66 74 54 92 Z" fill={h} />;
  }
}

function Eye({ c, x }: { c: CharacterTheme; x: number }) {
  if (c.eyes === "sleepy")
    return (
      <g>
        <ellipse cx={x} cy={108} rx={9} ry={5} fill="#fff" />
        <circle cx={x} cy={109} r={4} fill={c.eyeColor} />
        <path d={`M${x - 11} 104 H${x + 11}`} stroke="#222" strokeWidth={3} strokeLinecap="round" />
      </g>
    );
  const ry = c.eyes === "stern" ? 7 : c.eyes === "bright" ? 10 : 9;
  return (
    <g>
      <ellipse cx={x} cy={108} rx={9} ry={ry} fill="#fff" />
      <ellipse cx={x} cy={109} rx={6} ry={ry - 1} fill={c.eyeColor} />
      <circle cx={x} cy={109} r={3} fill="#111" />
      <circle cx={x + 2.5} cy={105.5} r={2} fill="#fff" />
      {c.eyes === "stern" && (
        <path d={`M${x - 12} ${98} L${x + 11} ${x < 100 ? 102 : 94}`} stroke="#222" strokeWidth={3} strokeLinecap="round" />
      )}
    </g>
  );
}

function Accessory({ c }: { c: CharacterTheme }) {
  const a = c.accessoryColor;
  switch (c.accessory) {
    case "headband":
      return <path d="M52 84 C70 66 130 66 148 84 L148 92 C130 76 70 76 52 92 Z" fill={a} stroke="#0006" />;
    case "ribbon":
      return (
        <g transform="translate(138 62)" fill={a}>
          <path d="M0 0 L-16 -9 L-16 9 Z" />
          <path d="M0 0 L16 -9 L16 9 Z" />
          <circle r={4} fill="#0003" />
        </g>
      );
    case "flower":
      return (
        <g transform="translate(70 62)">
          {[0, 72, 144, 216, 288].map((r) => (
            <ellipse key={r} cx={0} cy={-8} rx={5} ry={8} fill={a} transform={`rotate(${r})`} />
          ))}
          <circle r={4} fill="#f2c230" />
        </g>
      );
    case "glasses":
      return (
        <g fill="none" stroke={a} strokeWidth={2.5}>
          <rect x={64} y={98} width={26} height={20} rx={5} />
          <rect x={110} y={98} width={26} height={20} rx={5} />
          <path d="M90 107 H110" />
        </g>
      );
    case "scarf":
      return <path d="M66 156 C90 172 110 172 134 156 L138 176 C110 190 90 190 62 176 Z" fill={a} stroke="#0004" />;
    case "earring":
      return (
        <g fill={a}>
          <circle cx={56} cy={126} r={4.5} />
          <path d="M56 130 V142" stroke={a} strokeWidth={2.5} />
        </g>
      );
    case "cap":
      return (
        <g fill={a}>
          <path d="M52 80 C60 46 140 46 148 80 Z" />
          <rect x={48} y={78} width={104} height={8} rx={3} />
        </g>
      );
    case "moon":
      return (
        <path d="M142 56 a14 14 0 1 0 12 22 a11 11 0 1 1 -12 -22 Z" fill={a} />
      );
    case "fan":
      return (
        <g transform="translate(158 168) rotate(-20)">
          <path d="M0 0 L-26 -30 A38 38 0 0 1 26 -30 Z" fill={a} stroke="#8a5a2a" strokeWidth={2} />
          <path d="M0 0 L-10 -33 M0 0 L0 -36 M0 0 L10 -33" stroke="#8a5a2a" strokeWidth={1.5} />
        </g>
      );
    default:
      return null;
  }
}

function PatternDef({ c, id }: { c: CharacterTheme; id: string }) {
  const a = c.haori;
  const b = c.haoriAlt;
  switch (c.pattern) {
    case "check":
      return (
        <pattern id={id} width={20} height={20} patternUnits="userSpaceOnUse">
          <rect width={20} height={20} fill={a} />
          <rect width={10} height={10} fill={b} />
          <rect x={10} y={10} width={10} height={10} fill={b} />
        </pattern>
      );
    case "stripe":
      return (
        <pattern id={id} width={14} height={14} patternUnits="userSpaceOnUse">
          <rect width={14} height={14} fill={a} />
          <rect width={5} height={14} fill={b} />
        </pattern>
      );
    case "wave":
      return (
        <pattern id={id} width={24} height={14} patternUnits="userSpaceOnUse">
          <rect width={24} height={14} fill={a} />
          <path d="M0 10 Q6 0 12 10 T24 10" fill="none" stroke={b} strokeWidth={2.5} />
        </pattern>
      );
    case "star":
      return (
        <pattern id={id} width={26} height={26} patternUnits="userSpaceOnUse">
          <rect width={26} height={26} fill={a} />
          <path d="M13 5 L15 11 L21 11 L16 15 L18 21 L13 17 L8 21 L10 15 L5 11 L11 11 Z" fill={b} />
        </pattern>
      );
    case "diamond":
      return (
        <pattern id={id} width={22} height={22} patternUnits="userSpaceOnUse">
          <rect width={22} height={22} fill={a} />
          <path d="M11 3 L19 11 L11 19 L3 11 Z" fill={b} />
        </pattern>
      );
    default:
      return (
        <pattern id={id} width={4} height={4} patternUnits="userSpaceOnUse">
          <rect width={4} height={4} fill={a} />
        </pattern>
      );
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
  const pid = `haori-${mbti ?? "x"}`;

  return (
    <svg
      viewBox="0 0 200 220"
      width={size}
      height={(size * 220) / 200}
      role="img"
      aria-label={`${c.name} 캐릭터`}
    >
      <defs>
        <PatternDef c={c} id={pid} />
        <radialGradient id={`bg-${mbti ?? "x"}`} cx="50%" cy="40%" r="65%">
          <stop offset="0" stopColor={c.accent} stopOpacity={0.55} />
          <stop offset="1" stopColor={c.accent} stopOpacity={0.08} />
        </radialGradient>
      </defs>

      <circle cx={100} cy={110} r={96} fill={`url(#bg-${mbti ?? "x"})`} stroke={c.accent} strokeWidth={3} />

      <Hair c={c} part="back" />

      {/* 어깨와 하오리 */}
      <path d="M20 214 C24 170 56 150 100 150 C144 150 176 170 180 214 Z" fill={`url(#${pid})`} stroke="#0008" strokeWidth={2} />
      {/* 안쪽 옷깃 */}
      <path d="M78 150 L100 190 L122 150 Z" fill="#14100e" />
      <path d="M70 152 L100 196 M130 152 L100 196" stroke="#f3e6cf" strokeWidth={3} fill="none" />
      {/* 목 */}
      <path d="M86 130 H114 V152 C108 160 92 160 86 152 Z" fill={SKIN_SHADE} />

      {/* 얼굴 */}
      <ellipse cx={100} cy={106} rx={44} ry={46} fill={SKIN} />
      <ellipse cx={56} cy={110} rx={5} ry={9} fill={SKIN} />
      <ellipse cx={144} cy={110} rx={5} ry={9} fill={SKIN} />

      <Eye c={c} x={80} />
      <Eye c={c} x={120} />
      <path d="M92 134 Q100 140 108 134" stroke="#8a4a3a" strokeWidth={3} fill="none" strokeLinecap="round" />
      <ellipse cx={70} cy={124} rx={7} ry={4} fill="#f0908a" opacity={0.35} />
      <ellipse cx={130} cy={124} rx={7} ry={4} fill="#f0908a" opacity={0.35} />

      <Hair c={c} part="front" />
      {c.accessory !== "scarf" && <Accessory c={c} />}
      {c.accessory === "scarf" && <Accessory c={c} />}
    </svg>
  );
}
