// 안드로이드 앱(Capacitor) 연결. docs/PLAN.md §15.2
//
// `npm run build:android`(VITE_TARGET=app)일 때만 플러그인을 부른다. IS_APP 은 빌드 때
// 상수로 접혀서, 웹·itch·토스 빌드에는 Capacitor 코드가 들어가지 않는다.

export const IS_APP = import.meta.env.VITE_TARGET === 'app';

/**
 * 안드로이드 뒤로 가기 버튼을 받는다. 리스너를 걸면 Capacitor 의 기본 동작(웹뷰 기록 뒤로)은 꺼진다.
 * 웹에서는 popstate 로 같은 일을 하는데, 그 방식은 기록을 늘 하나 더 쌓아 두어서 앱이 끝나지 않는다.
 * `handler` 가 거짓을 돌려주면(타이틀) 앱을 닫는다.
 */
export async function onBackButton(handler: () => boolean): Promise<void> {
  if (!IS_APP) return;
  try {
    const { App } = await import('@capacitor/app');
    await App.addListener('backButton', () => { if (!handler()) void App.exitApp(); });
  } catch { /* 플러그인이 없으면 웹 방식 그대로 */ }
}
