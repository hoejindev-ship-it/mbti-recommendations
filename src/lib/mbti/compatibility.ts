import type { Axis } from "./questions";

export interface AxisInsight {
  axis: Axis;
  label: string;
  mine: string;
  theirs: string;
  same: boolean;
  summary: string;
  tip: string;
}

export interface Compatibility {
  score: number;
  grade: string;
  headline: string;
  strengths: string[];
  complements: string[];
  axes: AxisInsight[];
}

const AXES: Axis[] = ["EI", "SN", "TF", "JP"];

const AXIS_LABEL: Record<Axis, string> = {
  EI: "에너지 방향 (E/I)",
  SN: "정보 인식 (S/N)",
  TF: "판단 기준 (T/F)",
  JP: "생활 방식 (J/P)",
};

const LETTER_NAME: Record<string, string> = {
  E: "외향",
  I: "내향",
  S: "현실",
  N: "직관",
  T: "사고",
  F: "감정",
  J: "계획",
  P: "즉흥",
};

// 점수 가중치: [같을 때, 다를 때]. 대화 방식이 맞는 S/N, 생활 리듬이 맞는 J/P를 조금 더 크게 본다.
const WEIGHTS: Record<Axis, [number, number]> = {
  EI: [12, 16],
  SN: [28, 6],
  TF: [14, 10],
  JP: [14, 6],
};

const SCORE_MIN = 45;
const SCORE_MAX = 98;

const RAW_MIN = AXES.reduce((sum, ax) => sum + Math.min(...WEIGHTS[ax]), 0);
const RAW_MAX = AXES.reduce((sum, ax) => sum + Math.max(...WEIGHTS[ax]), 0);

const SAME_TEXT: Record<Axis, Record<string, [string, string]>> = {
  EI: {
    E: [
      "둘 다 사람들과 어울릴 때 에너지가 나서 함께 있으면 분위기가 금방 달아올라요.",
      "둘 다 말이 많아 서로 이야기를 끊기 쉬워요. 상대의 말을 끝까지 듣는 순서를 만들어 보세요.",
    ],
    I: [
      "둘 다 조용한 시간을 소중히 여겨 서로의 휴식을 자연스럽게 존중해요.",
      "둘 다 먼저 연락하거나 제안하기를 미루기 쉬워요. 가끔은 한 명이 먼저 약속을 잡아 보세요.",
    ],
  },
  SN: {
    S: [
      "둘 다 현실적이고 구체적이라 계획과 약속이 어긋나는 일이 적어요.",
      "새로운 시도가 줄어 일상이 단조로워질 수 있어요. 한 달에 한 번은 낯선 곳에 가 보세요.",
    ],
    N: [
      "둘 다 상상과 아이디어를 좋아해 대화가 깊고 끝없이 이어져요.",
      "이야기만 커지고 실행이 늦어질 수 있어요. 작은 일이라도 날짜를 정해 실행해 보세요.",
    ],
  },
  TF: {
    T: [
      "둘 다 논리적이라 문제가 생기면 감정 소모 없이 빠르게 해결해요.",
      "맞는 말인데 차가워 보일 수 있어요. 해결책을 말하기 전에 먼저 공감 한마디를 건네 보세요.",
    ],
    F: [
      "둘 다 상대의 마음을 먼저 살펴 정서적으로 편안한 사이가 돼요.",
      "서운함을 말하지 않고 참기 쉬워요. 불편한 점은 부드럽게라도 그때그때 이야기하세요.",
    ],
  },
  JP: {
    J: [
      "둘 다 계획적이라 일정과 역할 분담이 척척 맞아요.",
      "계획이 틀어지면 둘 다 예민해질 수 있어요. 일정에 여유 시간을 일부러 넣어 두세요.",
    ],
    P: [
      "둘 다 유연해서 즉흥적인 계획 변경도 즐겁게 받아들여요.",
      "마감과 약속이 느슨해질 수 있어요. 꼭 지켜야 할 일 한두 가지는 미리 정해 두세요.",
    ],
  },
};

const DIFF_TEXT: Record<Axis, [string, string]> = {
  EI: [
    "한 명은 사람과 있을 때, 다른 한 명은 혼자 있을 때 충전돼서 서로의 균형을 잡아 줘요.",
    "외향 쪽은 내향 쪽에게 충전할 시간을 주고, 내향 쪽은 가끔 외향 쪽의 모임에 함께해 보세요.",
  ],
  SN: [
    "한 명은 현실을, 다른 한 명은 가능성을 봐서 서로 시야를 넓혀 줘요.",
    "서로 같은 이야기를 다르게 이해할 수 있어요. 직관 쪽은 구체적인 예시를, 현실 쪽은 아이디어의 취지를 먼저 들어 보세요.",
  ],
  TF: [
    "논리와 공감이 만나 결정이 치우치지 않고 균형 잡혀요.",
    "사고 쪽은 감정을 '문제'로 보지 말고, 감정 쪽은 직설을 '공격'으로 받아들이지 마세요.",
  ],
  JP: [
    "계획하는 쪽이 중심을 잡고 즉흥적인 쪽이 활력을 줘서 일상이 안정적이면서 재미있어요.",
    "계획 쪽은 일정이 바뀔 수 있다는 점을, 즉흥 쪽은 미리 알려 주는 배려를 서로 챙겨 보세요.",
  ],
};

function grade(score: number): [string, string] {
  if (score >= 88) return ["천생연분", "서로의 부족한 곳을 자연스럽게 채워 주는 최고의 조합이에요."];
  if (score >= 76) return ["찰떡궁합", "함께하면 편하고 즐거운, 오래 갈 수 있는 사이예요."];
  if (score >= 64) return ["좋은 친구", "서로 다른 점이 매력으로 작용하는 균형 잡힌 사이예요."];
  if (score >= 54) return ["노력형 케미", "처음엔 다르게 느껴지지만 알아갈수록 깊어지는 사이예요."];
  return ["성장형 관계", "서로 많이 다르기에 배울 점이 가장 많은 사이예요."];
}

/**
 * 두 MBTI의 축별 일치/불일치로 궁합을 계산한다. 서로 바꿔도 같은 결과(대칭)다.
 * 재미로 보는 참고용이며 실제 관계의 좋고 나쁨을 판단하지 않는다.
 */
export function computeCompatibility(a: string, b: string): Compatibility {
  const axes: AxisInsight[] = [];
  const strengths: string[] = [];
  const complements: string[] = [];
  let raw = 0;

  AXES.forEach((axis, i) => {
    const la = a[i];
    const lb = b[i];
    const same = la === lb;
    raw += WEIGHTS[axis][same ? 0 : 1];

    let summary: string;
    let tip: string;
    if (same) {
      [summary, tip] = SAME_TEXT[axis][la];
      strengths.push(summary);
      complements.push(tip);
    } else {
      [summary, tip] = DIFF_TEXT[axis];
      strengths.push(summary);
      complements.push(tip);
    }
    axes.push({
      axis,
      label: AXIS_LABEL[axis],
      mine: `${la} ${LETTER_NAME[la]}`,
      theirs: `${lb} ${LETTER_NAME[lb]}`,
      same,
      summary,
      tip,
    });
  });

  const score = Math.round(SCORE_MIN + ((raw - RAW_MIN) / (RAW_MAX - RAW_MIN)) * (SCORE_MAX - SCORE_MIN));
  const [gradeName, headline] = grade(score);
  return { score, grade: gradeName, headline, strengths, complements, axes };
}
