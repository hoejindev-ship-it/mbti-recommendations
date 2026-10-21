import { toAxisBars, type AxisScores } from "@/lib/mbti/score";

const NAMES: Record<string, string> = {
  E: "외향", I: "내향", S: "현실", N: "직관", T: "사고", F: "감정", J: "계획", P: "즉흥",
};

export default function AxisBars({ scores }: { scores: AxisScores }) {
  const bars = toAxisBars(scores);

  return (
    <div className="bars">
      {bars.map((b) => {
        const firstWins = b.first.percent >= b.second.percent;
        return (
          <div key={b.axis} className="bar" role="group" aria-label={`${b.first.letter} ${b.first.percent}%, ${b.second.letter} ${b.second.percent}%`}>
            <div className="bar-labels">
              <span className={firstWins ? "win" : ""}>
                {b.first.letter} {NAMES[b.first.letter]} <strong>{b.first.percent}%</strong>
              </span>
              <span className={firstWins ? "" : "win"}>
                <strong>{b.second.percent}%</strong> {NAMES[b.second.letter]} {b.second.letter}
              </span>
            </div>
            <div className="bar-track">
              <div
                className={`bar-fill ${firstWins ? "from-left" : "from-right"}`}
                style={{ width: `${Math.max(b.first.percent, b.second.percent)}%` }}
              />
              <div className="bar-mid" />
            </div>
            {b.borderline && <div className="muted bar-note">두 성향이 비슷해요. 상황에 따라 반대쪽으로 나올 수도 있어요.</div>}
          </div>
        );
      })}
    </div>
  );
}
