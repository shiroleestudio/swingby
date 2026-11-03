// Capacitor 앱 셸 설정. docs/PLAN.md §15.2
//
// 웹 자산을 그대로 WebView 로 감싼다. **게임 코드는 바뀌지 않는다.**
//
// android/ 는 `npx cap add android` 가 만드는 생성물이라 git 에서 제외한다.
// 손으로 고친 설정(아이콘·스플래시·버전·서명)은 tools/build-android.mjs 가
// 매번 다시 입힌다. 그래서 android/ 를 지우고 다시 만들어도 같은 앱이 나온다.
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shiroleestudio.swingby',   // 내부 이름. 한 번 올리면 바꿀 수 없다 (§15.2)
  appName: '스페이스서퍼 달토끼',
  webDir: 'build/app/site',              // npm run build:android 가 VITE_TARGET=app 으로 만든다
  android: {
    allowMixedContent: false,
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
