// 한 판의 점수. docs/PLAN.md §22.3
//
// 점수 = 버틴 초 × 10 + 스침 × 10 (정수, 단위 "점"). 15분을 버티면 판이 끝나 누구나 900초가
// 되므로, 클리어한 사람끼리는 스침으로 줄을 세운다. 처음엔 토스 순위표용이었고(§15.7,
// 2026-11-03) 2026-11-10 부터 모든 빌드의 결과 화면이 이 점수를 크게 보여 준다.

export function runScore(sec: number, grazes: number): number {
  return Math.round(sec * 10) + grazes * 10;
}
