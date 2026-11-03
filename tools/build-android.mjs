// 구글 플레이 업로드용 안드로이드 빌드. docs/PLAN.md §15.2
//
//   npm run build:android   →   build/app/space-surfer-moon-rabbit.aab
//
// 웹 게임을 Capacitor WebView 로 감싼다. 게임 코드는 같고 다른 점은(VITE_TARGET=app):
//   · 힌트·이어하기·다시 뽑기는 광고 없이 준다(AdMob 을 붙이기 전까지, §14)
//   · 서비스 워커를 쓰지 않는다(자산이 앱 안에 있다)
//   · 안드로이드 뒤로 가기 버튼 — 타이틀에서 누르면 앱을 닫는다(src/platform/app.ts)
//
// android/ 는 생성물이라 git 에 넣지 않는다. 없으면 만들고, 아이콘·스플래시·버전을 매번 다시 입힌다.
// .aab 를 만들려면 안드로이드 SDK(ANDROID_HOME)가 있어야 한다 — 없으면 android/ 준비까지만 한다.
// GitHub Actions 의 .github/workflows/android.yml 이 SDK 있는 곳에서 이것을 돌린다.
//
// 서명(선택): 환경 변수 ANDROID_KEYSTORE(파일 경로)·ANDROID_KEYSTORE_PASSWORD·ANDROID_KEY_ALIAS·
// ANDROID_KEY_PASSWORD 가 모두 있으면 업로드 키로 서명한다. **키와 비밀번호는 저장소에 넣지 않는다**(§0.8).

import { execFileSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'build', 'app');
const SITE = join(OUT, 'site');            // capacitor.config.ts 의 webDir 과 같아야 한다
const NAME = 'space-surfer-moon-rabbit.aab';

const run = (cmd, args, opts = {}) =>
  execFileSync(cmd, args, { cwd: ROOT, stdio: 'inherit', ...opts, env: { ...process.env, ...opts.env } });

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

// ① 웹 자산
run('npx', ['tsc', '--noEmit']);
run('npx', ['vite', 'build', '--outDir', SITE, '--emptyOutDir'], { env: { VITE_TARGET: 'app' } });
rmSync(join(SITE, 'sw.js'), { force: true });
if (!existsSync(join(SITE, 'index.html'))) throw new Error('index.html 이 없다');

// ② 안드로이드 프로젝트
if (!existsSync(join(ROOT, 'android'))) run('npx', ['cap', 'add', 'android']);
run('npx', ['cap', 'sync', 'android']);
run('npx', ['tsx', 'tools/android-res.ts']);

// ③ 버전 — 0.7.1 → versionCode 701. 플레이는 올릴 때마다 versionCode 가 커져야 한다
const { version } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
const [ma, mi, pa] = version.split('.').map(Number);
const code = ma * 10000 + mi * 100 + pa;
const gradle = join(ROOT, 'android', 'app', 'build.gradle');
let g = readFileSync(gradle, 'utf8')
  .replace(/versionCode \d+/, `versionCode ${code}`)
  .replace(/versionName "[^"]*"/, `versionName "${version}"`);

// ④ 서명 — 값은 빌드 때 환경 변수에서 읽는다. build.gradle 에도 비밀번호가 적히지 않는다
const SIGN = ['ANDROID_KEYSTORE', 'ANDROID_KEYSTORE_PASSWORD', 'ANDROID_KEY_ALIAS', 'ANDROID_KEY_PASSWORD'];
const signed = SIGN.every((k) => process.env[k]);
if (!g.includes('signingConfigs')) {
  g = g.replace(/\n    buildTypes \{/, `
    signingConfigs {
        release {
            if (System.getenv('ANDROID_KEYSTORE')) {
                storeFile file(System.getenv('ANDROID_KEYSTORE'))
                storePassword System.getenv('ANDROID_KEYSTORE_PASSWORD')
                keyAlias System.getenv('ANDROID_KEY_ALIAS')
                keyPassword System.getenv('ANDROID_KEY_PASSWORD')
            }
        }
    }
    buildTypes {`).replace(/(release \{\n\s+minifyEnabled false)/, `$1
            if (System.getenv('ANDROID_KEYSTORE')) signingConfig signingConfigs.release`);
}
writeFileSync(gradle, g);

// ⑤ 세로 고정 (§15.2) — 폰에서는 세로 배치만 쓴다
const manifest = join(ROOT, 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
const m = readFileSync(manifest, 'utf8');
if (!m.includes('screenOrientation')) writeFileSync(manifest, m.replace('<activity', '<activity\n            android:screenOrientation="portrait"'));
console.log(`\n  안드로이드 버전 ${version} (versionCode ${code})${signed ? ', 업로드 키로 서명' : ', 서명 없음'}`);

// ⑥ .aab
if (!process.env.ANDROID_HOME && !process.env.ANDROID_SDK_ROOT) {
  console.log('  ANDROID_HOME 이 없어 .aab 는 만들지 않았다. GitHub Actions 의 "안드로이드 빌드" 워크플로를 돌린다');
  process.exit(0);
}
run('./gradlew', ['bundleRelease', '--no-daemon'], { cwd: join(ROOT, 'android') });
const aab = join(ROOT, 'android', 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab');
copyFileSync(aab, join(OUT, NAME));
console.log(`\n  플레이 번들: ${join(OUT, NAME)} (${(statSync(join(OUT, NAME)).size / 1024).toFixed(0)}KB)`);
