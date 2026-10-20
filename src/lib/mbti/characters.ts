// 유형별 어울리는 강아지. 견종과 성격 설명은 참고했고, 그림은 직접 그린 SVG다.
export type Ears = "pointy" | "bat" | "fold" | "floppy" | "longfloppy" | "puff";
export type Mask =
  | "none"
  | "husky"
  | "blaze"
  | "beagle"
  | "eyepatch"
  | "collie"
  | "shepherd"
  | "shiba"
  | "pug"
  | "schnauzer";

export interface CharacterTheme {
  name: string;
  title: string;
  accent: string;
  fur: string;
  fur2: string;
  muzzle: string;
  nose: string;
  ears: Ears;
  mask: Mask;
  fluff: boolean;
  wrinkle: boolean;
  tongue: boolean;
  collar: string;
}

export const CHARACTERS: Record<string, CharacterTheme> = {
  INFJ: { name: "진돗개", title: "깔끔하고 예민한 이상주의자", accent: "#c9a27a", fur: "#fbf6ec", fur2: "#ecd9bc", muzzle: "#fffdf8", nose: "#2b2b2b", ears: "pointy", mask: "none", fluff: false, wrinkle: false, tongue: false, collar: "#e8836b" },
  INTJ: { name: "잭 러셀 테리어", title: "예리하고 민첩한 전략가", accent: "#b9783f", fur: "#fffaf2", fur2: "#b9783f", muzzle: "#fffaf2", nose: "#2b2b2b", ears: "fold", mask: "eyepatch", fluff: false, wrinkle: false, tongue: false, collar: "#3f7ab8" },
  ISTP: { name: "비숑", title: "에너지 넘치고 지치지 않는 해결사", accent: "#8fb8d8", fur: "#fffdf7", fur2: "#f3ecdc", muzzle: "#fffdf7", nose: "#2b2b2b", ears: "puff", mask: "none", fluff: true, wrinkle: false, tongue: false, collar: "#6fb3a8" },
  ISTJ: { name: "허스키", title: "신사적이고 유순한 원칙주의자", accent: "#6b7a90", fur: "#f7f7f9", fur2: "#59606b", muzzle: "#ffffff", nose: "#2b2b2b", ears: "pointy", mask: "husky", fluff: false, wrinkle: false, tongue: false, collar: "#d9534f" },
  INTP: { name: "비글", title: "똑똑하고 엉뚱한 사고뭉치", accent: "#b87333", fur: "#fffaf0", fur2: "#b5651d", muzzle: "#fffaf0", nose: "#2b2b2b", ears: "longfloppy", mask: "beagle", fluff: false, wrinkle: false, tongue: false, collar: "#5aa0d8" },
  ISFJ: { name: "슈나우저", title: "예민하고 까칠하지만 활발한 수호자", accent: "#8c93a0", fur: "#9aa0ab", fur2: "#6d7380", muzzle: "#9aa0ab", nose: "#2b2b2b", ears: "fold", mask: "schnauzer", fluff: false, wrinkle: false, tongue: false, collar: "#e6b34a" },
  ISFP: { name: "시바견", title: "태평하고 느긋한 자유로운 영혼", accent: "#e09a4a", fur: "#e8a057", fur2: "#fff1d8", muzzle: "#fff1d8", nose: "#2b2b2b", ears: "pointy", mask: "shiba", fluff: false, wrinkle: false, tongue: false, collar: "#c94f4f" },
  INFP: { name: "푸들", title: "상호작용을 잘하는 감성 몽상가", accent: "#b9703a", fur: "#b97a45", fur2: "#a5683a", muzzle: "#c58a55", nose: "#2b2b2b", ears: "puff", mask: "none", fluff: true, wrinkle: false, tongue: false, collar: "#e86f8f" },
  ENTP: { name: "불독", title: "웃기고 창의적인 토론가", accent: "#d4b48a", fur: "#f1dcb9", fur2: "#d9b78a", muzzle: "#fbeed6", nose: "#3a2c26", ears: "fold", mask: "none", fluff: false, wrinkle: true, tongue: false, collar: "#5b8fd9" },
  ESTP: { name: "레브라도 리트리버", title: "적응력이 뛰어나고 잘 따르는 모험가", accent: "#d9a85a", fur: "#efcf8e", fur2: "#d8ac5e", muzzle: "#f6dfae", nose: "#2b2b2b", ears: "floppy", mask: "none", fluff: false, wrinkle: false, tongue: true, collar: "#3fa37a" },
  ESTJ: { name: "보더콜리", title: "지능이 높은 믿음직한 관리자", accent: "#4a5568", fur: "#33363d", fur2: "#222428", muzzle: "#ffffff", nose: "#111", ears: "fold", mask: "collie", fluff: false, wrinkle: false, tongue: false, collar: "#e8a33a" },
  ENTJ: { name: "셰퍼드", title: "지능과 체력이 높은 지휘관", accent: "#a8743a", fur: "#d9a45f", fur2: "#2f2a26", muzzle: "#4a3a30", nose: "#1a1a1a", ears: "bat", mask: "shepherd", fluff: false, wrinkle: false, tongue: false, collar: "#c0392b" },
  ENFP: { name: "퍼그", title: "개성이 풍부한 분위기 메이커", accent: "#a27850", fur: "#e8c58d", fur2: "#4a3a30", muzzle: "#4a3a30", nose: "#1a1a1a", ears: "fold", mask: "pug", fluff: false, wrinkle: true, tongue: false, collar: "#f08a3a" },
  ESFJ: { name: "닥스훈트", title: "아기 같고 애교가 많은 친화력왕", accent: "#8a4b2a", fur: "#8a4b2a", fur2: "#6d371c", muzzle: "#c58a5a", nose: "#1a1a1a", ears: "longfloppy", mask: "none", fluff: false, wrinkle: false, tongue: true, collar: "#e86f8f" },
  ENFJ: { name: "골든 리트리버", title: "짝꿍을 배려하는 따뜻한 리더", accent: "#e0a850", fur: "#f0bc66", fur2: "#d9993a", muzzle: "#f8d796", nose: "#2b2b2b", ears: "floppy", mask: "none", fluff: false, wrinkle: false, tongue: true, collar: "#5aa0d8" },
  ESFP: { name: "웰시코기", title: "호기심 많고 겁 없는 분위기왕", accent: "#e88a3a", fur: "#f0a050", fur2: "#fff3e0", muzzle: "#fff3e0", nose: "#2b2b2b", ears: "bat", mask: "blaze", fluff: false, wrinkle: false, tongue: true, collar: "#3fa37a" },
};

const FALLBACK = CHARACTERS.ESFP;

export function getCharacter(mbti: string | null | undefined): CharacterTheme {
  return (mbti && CHARACTERS[mbti]) || FALLBACK;
}
