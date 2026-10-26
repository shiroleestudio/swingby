# 스페이스서퍼 달토끼 (Space Surfer: Moon Rabbit)

달토끼가 당근 로켓을 타고 행성의 중력을 타 넘는 물리 퍼즐. TypeScript + Vite + Canvas 2D, 서버 없음.
내부 이름은 `swingby`(저장 키·앱 ID·zip 이름)이고 바꾸지 않는다.

- 웹판(개발자 버전, 모든 단계 열림): https://shiroleestudio.github.io/swingby/?open
- itch.io 무료 웹판: 허브 https://shiroleestudio.github.io 의 게임 소개에서
- 개인정보처리방침: https://shiroleestudio.github.io/privacy/swingby/ (저장소 안에 사본 없음)

## 실행

```bash
npm install
npm run dev        # 개발 서버 (--host, 같은 Wi-Fi 폰에서 접속)
npm test           # 회귀 테스트 — 물리·결정론·단계가 배포 관문
npm run check      # tsc + core/ 의 DOM 사용 검사
npm run build      # dist/
npm run preview    # 빌드 결과 확인. 배포 전 확인은 dev 가 아니라 이것으로
npm run build:itch # itch.io 업로드 zip → build/itch/swingby-itch.zip (store/itch/README.md)
```

Node 는 `.nvmrc`(22). 런타임 의존성은 0개, 개발 의존성은 Vite·TypeScript·Vitest·tsx 다섯뿐이다.
글꼴 서브셋(`npm run fonts`)에만 Python 3 이 필요하다.

## 구조

| 경로 | 내용 |
|---|---|
| `src/core/` | 물리·단계·검증 — DOM 금지. 게임과 도구가 공유한다 |
| `src/render/`, `src/ui/` | 그리기와 화면. 색은 `src/render/palette.ts` 와 `styles.css` 의 토큰만 |
| `src/levels/data/*.json` | 단계. 손으로 쓰지 않고 생성기·에디터로 만들어 `npm run validate` 를 통과시킨다 |
| `src/i18n/` | 문구. 한국어 `ko.ts` 가 원본 |
| `tools/` | 생성·검증·벤치·itch 빌드 스크립트 |
| `tests/` | 회귀 테스트 |
| `store/` | 스토어 제출 준비물(문구·아이콘·테스터 안내). 계정 정보·키는 넣지 않는다 |
| `docs/PLAN.md` | 설계 명세(v5). 길다 — 작업 규칙 요약은 `AGENTS.md` |

## 운영

- **작업 규칙**은 `AGENTS.md`(사람과 AI 공용). `CLAUDE.md` 는 그 파일을 가리키기만 한다. 명세는 `docs/PLAN.md`.
- **배포**: 기본 브랜치 `main` 에 푸시 → `.github/workflows/pages.yml` 이 검사 → 테스트 → 단계 검증 → 빌드 → Pages. 하나라도 실패하면 사이트는 바뀌지 않는다. Actions 탭에서 확인.
- **Pages 설정**은 Settings → Pages → Source = **GitHub Actions** 여야 한다. "Deploy from a branch" 로 바뀌면 빈 화면이 된다(한 번 겪었다).
- **되돌리기**: `git revert <커밋>` 후 `main` 푸시.
- **itch 판 갱신**: `npm run build:itch` → itch.io 대시보드에서 zip 교체. 자동이 아니다.
- **광고**: 웹판 광고는 GitHub Actions 시크릿 `VITE_H5_CLIENT` 가 있을 때만 들어간다. 비어 있으면 광고 없이 빌드되고 그게 기본 상태다. 저장소 파일에 광고 ID 를 적지 않는다.
- **앱판(Capacitor, 아직 안 함)** 을 내면 매년 Play 의 targetSdk 상향과 광고 SDK 갱신이 따라온다. `capacitor.config.ts` 의 appId 는 출시 전 `com.shiroleestudio.swingby` 로 확정한다.
- **Node**: 매년 10월 LTS 가 바뀌면 `.nvmrc` 와 `pages.yml` 의 `node-version` 을 같이 올린다. 의존성 업그레이드는 깨졌을 때만, `npm test` 가 통과해야 한다.
- **사용자 데이터**(진행 상황)는 브라우저 localStorage 에만 있다. 서버·계정 없음.
- **라이선스**: 코드는 `LICENSE`(MIT). 그림·소리·문구·캐릭터는 이시로스튜디오의 것으로 MIT 에 포함되지 않는다.
- **릴리스**: `CHANGELOG.md` 맨 위 한 줄 + Releases 에서 `vX.Y.Z` 태그. itch zip 도 같은 버전으로.
- 계정·정기 점검·다른 저장소: 허브 저장소(shiroleestudio.github.io)의 `STUDIO.md`.
