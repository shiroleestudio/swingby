// 앱인토스 미니앱 설정 (docs/PLAN.md §15.7). `npm run build:toss` 가 읽는다.
// appName 은 콘솔에 등록한 값과 같아야 하고, 한 번 정하면 바꿀 수 없다.
import { defineConfig } from '@apps-in-toss/web-framework/config';

export default defineConfig({
  appName: 'space-surfer-moon-rabbit',
  brand: {
    primaryColor: '#FCA044',   // 팔레트 $27 주 버튼 주황
  },
  permissions: [],
  webView: {
    bounces: false,
    pullToRefreshEnabled: false,
    overScrollMode: 'never',
    allowsBackForwardNavigationGestures: false,
  },
  webBundleDir: 'build/toss/site',
});
