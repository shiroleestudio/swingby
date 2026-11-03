// 앱 아이콘을 스프라이트 생성기로 만든다. docs/PLAN.md §15.5
//
//   npx tsx tools/make-icons.ts
//
// 그림은 tools/icon-art.ts. 안드로이드 아이콘·스플래시는 빌드할 때 tools/android-res.ts 가 만든다.

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { art, png } from './icon-art.js';
import { ROOT } from './gen-run.js';

for (const [n, path] of [
  [32, 'public/favicon.png'], [192, 'public/icon-192.png'], [512, 'public/icon-512.png'], [1024, 'store/icon-1024.png'],
  [600, 'store/toss/logo-600.png'],   // 앱인토스 콘솔 앱 로고 (§15.7)
  [512, 'store/play/icon-512.png'],   // 구글 플레이 스토어 아이콘 (§15.5)
] as const) {
  const buf = png(n, n, art(n, n));
  writeFileSync(join(ROOT, path), buf);
  console.log(`  ${path}  ${n}×${n}  ${(buf.length / 1024).toFixed(1)}KB`);
}
