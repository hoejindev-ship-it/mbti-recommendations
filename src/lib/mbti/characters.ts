// 유형별 오리지널 캐릭터 설정. 모든 이름/외형은 이 서비스를 위해 새로 만든 것이다.
export type HairStyle = "short" | "spiky" | "bob" | "long" | "buns" | "ponytail" | "wavy";
export type Pattern = "check" | "stripe" | "wave" | "plain" | "star" | "diamond";
export type Accessory =
  | "none"
  | "headband"
  | "ribbon"
  | "flower"
  | "glasses"
  | "scarf"
  | "earring"
  | "cap"
  | "moon"
  | "fan";
export type Eyes = "stern" | "soft" | "sleepy" | "bright";

export interface CharacterTheme {
  name: string;
  title: string;
  accent: string;
  hair: string;
  hairStyle: HairStyle;
  haori: string;
  haoriAlt: string;
  pattern: Pattern;
  accessory: Accessory;
  accessoryColor: string;
  eyes: Eyes;
  eyeColor: string;
}

export const CHARACTERS: Record<string, CharacterTheme> = {
  ISTJ: { name: "서진", title: "곧은 파수꾼", accent: "#46607a", hair: "#1c1c24", hairStyle: "short", haori: "#46607a", haoriAlt: "#1c2630", pattern: "check", accessory: "none", accessoryColor: "#fff", eyes: "stern", eyeColor: "#3a5a8a" },
  ISFJ: { name: "하윤", title: "다정한 수호자", accent: "#d98aa6", hair: "#5a3a2a", hairStyle: "bob", haori: "#f0b6c6", haoriAlt: "#a8566f", pattern: "plain", accessory: "ribbon", accessoryColor: "#b8324f", eyes: "soft", eyeColor: "#5a3a2a" },
  INFJ: { name: "해린", title: "달빛 조언자", accent: "#9a68d6", hair: "#241a38", hairStyle: "long", haori: "#7a52b8", haoriAlt: "#2a1a48", pattern: "star", accessory: "moon", accessoryColor: "#f3e6a0", eyes: "soft", eyeColor: "#7a52b8" },
  INTJ: { name: "이한", title: "냉철한 전략가", accent: "#d01c3a", hair: "#c9ccd6", hairStyle: "spiky", haori: "#1a1a26", haoriAlt: "#d01c3a", pattern: "plain", accessory: "glasses", accessoryColor: "#222", eyes: "stern", eyeColor: "#d01c3a" },
  ISTP: { name: "도윤", title: "조용한 해결사", accent: "#8a9a3e", hair: "#2a2a22", hairStyle: "spiky", haori: "#6a7430", haoriAlt: "#2a2e14", pattern: "stripe", accessory: "scarf", accessoryColor: "#d9d2b0", eyes: "sleepy", eyeColor: "#8a9a3e" },
  ISFP: { name: "연우", title: "꽃길의 예술가", accent: "#ec8aa6", hair: "#7a4a3a", hairStyle: "long", haori: "#f4c0a8", haoriAlt: "#c0705a", pattern: "diamond", accessory: "flower", accessoryColor: "#e8506e", eyes: "soft", eyeColor: "#c0705a" },
  INFP: { name: "소율", title: "별을 보는 몽상가", accent: "#f2c230", hair: "#f2d04a", hairStyle: "short", haori: "#f2c230", haoriAlt: "#7a5a10", pattern: "star", accessory: "none", accessoryColor: "#fff", eyes: "soft", eyeColor: "#a87a10" },
  INTP: { name: "시우", title: "안개 속 탐구자", accent: "#3fb0a8", hair: "#2a5a66", hairStyle: "long", haori: "#3fb0a8", haoriAlt: "#14404a", pattern: "wave", accessory: "none", accessoryColor: "#fff", eyes: "sleepy", eyeColor: "#3fb0a8" },
  ESTP: { name: "태오", title: "거침없는 모험가", accent: "#e0782a", hair: "#3a2418", hairStyle: "spiky", haori: "#e0782a", haoriAlt: "#4a2410", pattern: "stripe", accessory: "headband", accessoryColor: "#f4f0e0", eyes: "bright", eyeColor: "#e0782a" },
  ESFP: { name: "하준", title: "무대 위의 불꽃", accent: "#4f86e0", hair: "#1c3a8a", hairStyle: "wavy", haori: "#4f86e0", haoriAlt: "#14286a", pattern: "diamond", accessory: "earring", accessoryColor: "#f0c040", eyes: "bright", eyeColor: "#4f86e0" },
  ENFP: { name: "나래", title: "자유로운 불꽃놀이", accent: "#f08a3a", hair: "#e87a30", hairStyle: "buns", haori: "#f6b04a", haoriAlt: "#b8501a", pattern: "star", accessory: "flower", accessoryColor: "#fff2c8", eyes: "bright", eyeColor: "#b8501a" },
  ENTP: { name: "지호", title: "장난꾸러기 발명가", accent: "#b04a8a", hair: "#4a2a5a", hairStyle: "wavy", haori: "#b04a8a", haoriAlt: "#3a1a48", pattern: "check", accessory: "fan", accessoryColor: "#f0e0a0", eyes: "bright", eyeColor: "#b04a8a" },
  ESTJ: { name: "민재", title: "믿음직한 지휘자", accent: "#5a8a4a", hair: "#4a3020", hairStyle: "short", haori: "#5a8a4a", haoriAlt: "#1e3a18", pattern: "stripe", accessory: "cap", accessoryColor: "#2a2a2a", eyes: "stern", eyeColor: "#5a8a4a" },
  ESFJ: { name: "서아", title: "따스한 이웃", accent: "#e8731a", hair: "#a04a20", hairStyle: "ponytail", haori: "#f08a3a", haoriAlt: "#a04a1a", pattern: "wave", accessory: "ribbon", accessoryColor: "#fff2c8", eyes: "soft", eyeColor: "#a04a20" },
  ENFJ: { name: "하람", title: "이끄는 등불", accent: "#2f8f6b", hair: "#1a2438", hairStyle: "short", haori: "#2f8f6b", haoriAlt: "#a8dcc4", pattern: "wave", accessory: "headband", accessoryColor: "#e0c060", eyes: "soft", eyeColor: "#2f8f6b" },
  ENTJ: { name: "도현", title: "야망의 지휘관", accent: "#c8a24a", hair: "#1c1814", hairStyle: "ponytail", haori: "#1c1814", haoriAlt: "#c8a24a", pattern: "diamond", accessory: "earring", accessoryColor: "#c8a24a", eyes: "stern", eyeColor: "#c8a24a" },
};

const FALLBACK = CHARACTERS.ISTJ;

export function getCharacter(mbti: string | null | undefined): CharacterTheme {
  return (mbti && CHARACTERS[mbti]) || FALLBACK;
}
