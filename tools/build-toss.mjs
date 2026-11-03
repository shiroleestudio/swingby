// 앱인토스 업로드용 빌드. docs/PLAN.md §15.7
//
//   npm run build:toss   →   build/toss/space-surfer-moon-rabbit.ait
//
// 우리 웹 빌드와 다른 점(VITE_TARGET=toss):
//   · 토스 SDK 를 싣는다 — 게임센터 순위표, 상단 X 버튼 여백, 뒤로 가기로 닫기
//   · 힌트·이어하기·다시 뽑기는 광고 없이 준다(토스 광고를 붙이기 전까지)
//   · 서비스 워커를 쓰지 않는다(sw.js 도 뺀다)
//   · 개인정보처리방침 링크를 뺀다(토스 밖으로 나가는 링크 금지)
// .ait 는 앱인토스 콘솔 → 앱 번들에 올린다.

import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, renameSync, rmSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'build', 'toss');
const DIST = join(OUT, 'site');            // apps-in-toss.config.ts 의 webBundleDir 과 같아야 한다
const NAME = 'space-surfer-moon-rabbit.ait';

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

const run = (cmd, args, env = {}) =>
  execFileSync(cmd, args, { cwd: ROOT, stdio: 'inherit', env: { ...process.env, ...env } });

run('npx', ['tsc', '--noEmit']);
run('npx', ['vite', 'build', '--outDir', DIST, '--emptyOutDir'], { VITE_TARGET: 'toss' });
rmSync(join(DIST, 'sw.js'), { force: true });
if (!existsSync(join(DIST, 'index.html'))) throw new Error('index.html 이 없다');

run('npx', ['ait', 'build']);              // 저장소 맨 위에 <appName>.ait 를 만든다
renameSync(join(ROOT, NAME), join(OUT, NAME));
console.log(`\n  앱인토스 번들: ${join(OUT, NAME)} (${(statSync(join(OUT, NAME)).size / 1024).toFixed(0)}KB)`);
