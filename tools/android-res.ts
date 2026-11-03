// 안드로이드 앱 아이콘·스플래시를 android/ 에 입힌다. docs/PLAN.md §15.2
//
//   npx tsx tools/android-res.ts      (npm run build:android 가 부른다)
//
// `npx cap add android` 가 깐 Capacitor 기본 그림(파란 X 로고)을 우리 그림으로 덮는다.
// 크기는 템플릿에 있는 파일을 그대로 읽어 맞춘다 — 템플릿이 바뀌어도 빠지는 칸이 없다.

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { art, png, SKY } from './icon-art.js';
import { ROOT } from './gen-run.js';

const RES = join(ROOT, 'android', 'app', 'src', 'main', 'res');

function size(path: string): [number, number] {
  const b = readFileSync(path);
  return [b.readUInt32BE(16), b.readUInt32BE(20)];
}

let count = 0;
for (const dir of readdirSync(RES)) {
  const full = join(RES, dir);
  if (!statSync(full).isDirectory()) continue;
  for (const f of readdirSync(full)) {
    if (!f.endsWith('.png')) continue;
    const p = join(full, f);
    const [w, h] = size(p);
    let rgba: Uint8Array;
    if (f === 'splash.png') rgba = art(w, h, { scale: 0.3 });
    else if (f === 'ic_launcher_foreground.png') rgba = art(w, h, { sky: false, scale: 0.45 });   // 안전 영역 66/108 안
    else if (f === 'ic_launcher.png' || f === 'ic_launcher_round.png') rgba = art(w, h);
    else continue;
    writeFileSync(p, png(w, h, rgba));
    count++;
  }
}

// 적응형 아이콘 배경색 = 밤하늘
const bg = join(RES, 'values', 'ic_launcher_background.xml');
writeFileSync(bg, readFileSync(bg, 'utf8').replace(/#[0-9A-Fa-f]{6}/, SKY));
console.log(`  안드로이드 그림 ${count}개를 입혔다 (배경 ${SKY})`);
