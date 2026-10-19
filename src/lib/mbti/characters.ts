// 유형별 테마: 대표 캐릭터 이름(텍스트)과 포인트 색. 캐릭터 이미지는 사용하지 않는다.
export interface CharacterTheme {
  name: string;
  accent: string;
}

export const CHARACTERS: Record<string, CharacterTheme> = {
  ENFP: { name: "미츠리", accent: "#f08fb0" },
  ENFJ: { name: "탄지로", accent: "#2f8f6b" },
  ENTP: { name: "도우마", accent: "#b04a63" },
  ENTJ: { name: "우즈이", accent: "#c8a24a" },
  ESFP: { name: "아카자", accent: "#4f86e0" },
  ESFJ: { name: "렌고쿠", accent: "#ee7a1c" },
  ESTP: { name: "이노스케", accent: "#6f93ad" },
  ESTJ: { name: "사네미", accent: "#7fbf8f" },
  INFP: { name: "젠이츠", accent: "#f2c230" },
  INFJ: { name: "시노부", accent: "#9a68d6" },
  INTP: { name: "무이치로", accent: "#3fb0a8" },
  INTJ: { name: "무잔", accent: "#d01c3a" },
  ISFP: { name: "네즈코", accent: "#ec8aa6" },
  ISFJ: { name: "카나오", accent: "#a47bc2" },
  ISTP: { name: "이구로", accent: "#8a9a3e" },
  ISTJ: { name: "기유", accent: "#2a8a78" },
};

const FALLBACK: CharacterTheme = { name: "귀살대원", accent: "#d01c3a" };

export function getCharacter(mbti: string | null | undefined): CharacterTheme {
  return (mbti && CHARACTERS[mbti]) || FALLBACK;
}
