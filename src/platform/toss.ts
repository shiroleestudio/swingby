// 앱인토스(토스 앱 안의 WebView 미니앱) 연결. docs/PLAN.md §15.7
//
// `npm run build:toss`(VITE_TARGET=toss)일 때만 SDK 를 부른다. 아래 IS_TOSS 는 빌드할 때
// 상수로 접혀서, 웹·itch 빌드에는 SDK 코드가 한 줄도 들어가지 않는다.
// SDK 가 없는 브라우저(개발 서버)에서 불러도 조용히 아무 일도 하지 않는다.

type Sdk = typeof import('@apps-in-toss/web-framework');

export const IS_TOSS = import.meta.env.VITE_TARGET === 'toss';

let sdk: Promise<Sdk | null> | null = null;
function load(): Promise<Sdk | null> {
  if (!IS_TOSS) return Promise.resolve(null);
  return (sdk ??= import('@apps-in-toss/web-framework').catch(() => null));
}

/**
 * 토스 상단 X 버튼(오른쪽 위에 떠 있다)과 노치를 피할 여백을 CSS 변수로 넘긴다.
 * X 버튼은 safe area top + 5~10px 에서 시작하고 높이가 약 36px 이라, 위쪽은 그만큼 더 띄운다.
 */
export async function applyTossInsets(root: HTMLElement): Promise<void> {
  const s = await load();
  if (!s) return;
  const set = (i: { top: number; bottom: number }): void => {
    root.style.setProperty('--st', `${Math.round(i.top + X_BUTTON)}px`);
    root.style.setProperty('--sb', `${Math.round(i.bottom)}px`);
  };
  try {
    set(s.SafeAreaInsets.get());
    s.SafeAreaInsets.subscribe({ onEvent: set });
  } catch { /* 지원하지 않는 토스 앱 — CSS 의 env() 값이 남는다 */ }
}
const X_BUTTON = 44;

/**
 * 게임센터 순위표에 점수를 낸다. 판이 끝날 때만 부른다(진입 직후에 부르면 프로필 화면과 겹친다).
 * 같은 값은 다시 보내지 않는다 — 브리지를 짧은 시간에 여러 번 부르지 않게.
 */
let lastScore = '';
export async function submitScore(sec: number): Promise<void> {
  const score = sec.toFixed(1);
  if (score === lastScore) return;
  lastScore = score;
  const s = await load();
  if (!s) return;
  try { await s.submitGameCenterLeaderBoardScore({ score }); } catch { /* 순위표는 덤이다 */ }
}

/** 게임센터 순위표를 연다. 열리는 동안 게임은 백그라운드가 된다 */
export async function openLeaderboard(): Promise<void> {
  const s = await load();
  if (!s) return;
  try { await s.openGameCenterLeaderboard(); } catch { /* 지원하지 않는 토스 앱 */ }
}

/** 미니앱을 닫는다 — 타이틀에서 안드로이드 뒤로 가기 */
export async function closeApp(): Promise<void> {
  const s = await load();
  if (!s) return;
  try { await s.closeView(); } catch { /* 무시 */ }
}
