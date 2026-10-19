export type Axis = "EI" | "SN" | "TF" | "JP";

export interface Question {
  id: number;
  axis: Axis;
  // "first"는 축의 앞 글자(E/S/T/J), "second"는 뒤 글자(I/N/F/P) 쪽에 동의하는 문항
  agree: "first" | "second";
  text: string;
}

export const SCALE_LABELS = [
  "전혀 아니다",
  "아니다",
  "보통이다",
  "그렇다",
  "매우 그렇다",
] as const;

export const QUESTIONS: Question[] = [
  // E / I
  { id: 1, axis: "EI", agree: "first", text: "처음 보는 사람들과도 금방 대화를 시작한다." },
  { id: 2, axis: "EI", agree: "second", text: "사람들과 어울린 뒤에는 혼자만의 시간이 꼭 필요하다." },
  { id: 3, axis: "EI", agree: "first", text: "주말에는 집보다 밖에서 사람들을 만나는 편이 즐겁다." },
  { id: 4, axis: "EI", agree: "second", text: "여러 명이 있는 자리에서는 듣는 쪽이 더 편하다." },
  { id: 5, axis: "EI", agree: "first", text: "생각은 말로 꺼내면서 정리될 때가 많다." },
  { id: 6, axis: "EI", agree: "second", text: "친한 사람 몇 명과 깊게 어울리는 것이 넓게 어울리는 것보다 좋다." },
  // S / N
  { id: 7, axis: "SN", agree: "first", text: "새로운 방법보다 이미 검증된 방법을 선호한다." },
  { id: 8, axis: "SN", agree: "second", text: "눈앞의 사실보다 그 뒤에 숨은 의미나 가능성이 더 궁금하다." },
  { id: 9, axis: "SN", agree: "first", text: "설명을 들을 때 구체적인 예시와 사실이 있어야 이해가 잘 된다." },
  { id: 10, axis: "SN", agree: "second", text: "공상이나 상상에 빠지는 시간이 많다." },
  { id: 11, axis: "SN", agree: "first", text: "일을 할 때 현실적이고 실용적인 면을 먼저 본다." },
  { id: 12, axis: "SN", agree: "second", text: "아직 없는 새로운 아이디어를 떠올리는 것이 즐겁다." },
  // T / F
  { id: 13, axis: "TF", agree: "first", text: "결정을 내릴 때 감정보다 논리와 원칙을 우선한다." },
  { id: 14, axis: "TF", agree: "second", text: "상대의 기분이 상할까 봐 직설적인 말을 삼킬 때가 많다." },
  { id: 15, axis: "TF", agree: "first", text: "갈등이 생기면 누가 옳은지부터 따져 보는 편이다." },
  { id: 16, axis: "TF", agree: "second", text: "다른 사람의 고민을 들으면 내 일처럼 마음이 쓰인다." },
  { id: 17, axis: "TF", agree: "first", text: "객관적인 근거가 없는 주장은 쉽게 믿지 않는다." },
  { id: 18, axis: "TF", agree: "second", text: "일의 결과만큼 함께하는 사람들의 분위기도 중요하다." },
  // J / P
  { id: 19, axis: "JP", agree: "first", text: "여행이나 약속은 미리 계획을 세워 두어야 마음이 편하다." },
  { id: 20, axis: "JP", agree: "second", text: "그날 기분에 따라 즉흥적으로 움직이는 것이 좋다." },
  { id: 21, axis: "JP", agree: "first", text: "할 일은 마감보다 훨씬 일찍 끝내 두는 편이다." },
  { id: 22, axis: "JP", agree: "second", text: "계획이 갑자기 바뀌어도 크게 스트레스받지 않는다." },
  { id: 23, axis: "JP", agree: "first", text: "물건과 일정이 정해진 자리에 정돈되어 있어야 한다." },
  { id: 24, axis: "JP", agree: "second", text: "마지막 순간에 몰아서 할 때 집중이 더 잘 된다." },
];
