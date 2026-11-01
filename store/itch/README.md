# itch.io 올리기 (PLAN §15.6)

웹 빌드를 그대로 쓴다. 다른 점은 둘 — **힌트를 광고 없이 준다**(itch 는 자기 도메인의
iframe 에서 돌려 우리 광고가 뜨지 않는다), **서비스 워커를 쓰지 않는다**.

## 0. 계정

사업용 구글 계정(shiroleestudio@gmail.com)으로 itch.io 에 가입한다. 표시 이름은 `Shirolee Studio`.
결제·세금 정보는 기부를 받기로 하면 그때 넣는다. 계정 정보는 저장소에 적지 않는다(§0.8).

## 1. 파일 만들기

```
npm run build:itch      →  build/itch/swingby-itch.zip  (약 165KB)
```

zip 맨 위에 `index.html` 이 있다. 새 버전은 같은 명령으로 다시 만들어 itch 에서 파일을 바꿔 올린다.

## 2. itch.io 에서 (Dashboard → Create new project)

| 항목 | 값 |
|---|---|
| Title | `Space Surfer: Moon Rabbit` ("Space Surfer" 단독은 이미 있어 "Moon Rabbit" 을 꼭 붙인다 — CLAUDE.md 11번) |
| Project URL | `space-surfer-moon-rabbit` |
| Short description | `A moon rabbit, a carrot rocket, and a lot of gravity.` |
| Classification | Games |
| Kind of project | **HTML** |
| Release status | Released (먼저 보여 주고 반응을 보려면 In development) |
| Pricing | **No payments** 또는 **$0 or donate**(제안 금액 $2) — 아래 "수익" 참고 |
| Uploads | `swingby-itch.zip` 올리고 **"This file will be played in the browser"** 체크 |
| Viewport dimensions | **960 × 720** (PC 배치, PLAN §13.8) |
| Frame options | **Mobile friendly** ✓ → Orientation **Portrait**, **Fullscreen button** ✓, Automatically start ✗ |
| Genre | Action (스테이지를 뺀 뒤로 퍼즐보다 버티기, PLAN §22.9) |
| Tags (최대 10) | `space` `gravity` `physics` `endless` `arcade` `pixel-art` `cute` `casual` `mobile` `touch` |
| Cover image | `cover-630x500.png` |
| Screenshots | `shot-4-infinity` → `shot-5-levelup` → `shot-6-boss` → `shot-7-catalog`. 1~3(조준·분사·궤도)은 스테이지 화면이라 v0.6.0 부터 쓰지 않는다 (PLAN §22.9) |
| Visibility | 처음엔 **Draft** 로 저장해 직접 해 보고 → **Public** |

판 번호는 설정 화면의 "버전" 에 보인다(`package.json`, itch 올릴 때 0.3.0). 다시 올릴 때 올린다.

확인한 것(2026-10, 다른 출처의 iframe 에서 실제로 눌러 봄): 타이틀·설정(버전·광고 제거 줄 없음)·힌트 무료·
서비스 워커 0·저장 동작·인피니티 결과의 **이어하기가 광고 없이** 바로 이어짐·레벨업 "다시 뽑기" 무료.

폰에서는 itch 가 언제나 전체 화면으로 띄운다. 위의 960×720 은 PC 에서 페이지 안에 넣을 때 크기다 — 이 크기면 PC 배치(맵 왼쪽, 오른쪽 패널)로 뜬다.

## 3. 소개 문구

### English (기본)

> A moon rabbit on a carrot rocket, trying to stay alive in endless space.
>
> Drag to aim, let go to launch. Gravity does the rest.
> How long can you last?
>
> - Tap or swipe to change course
> - Grab carrots to level up
> - A boss shows up every 2 minutes
> - Find all 110 Messier objects
>
> Free. No ads on itch.

### 한국어

> 당근 로켓을 탄 달토끼가 끝없는 우주에서 버티는 게임이에요.
>
> 끌어서 방향을 정하고 손을 떼면 날아가요. 나머지는 중력이 해요.
> 얼마나 오래 버틸 수 있을까요?
>
> - 탭이나 스와이프로 방향 바꾸기
> - 당근 모아서 레벨업
> - 2분마다 보스 등장
> - 메시에 천체 110개 모으기
>
> 무료예요. itch 에는 광고가 없어요.

## 4. 수익 (선택)

- **$0 or donate**: 무료로 하되 기부 버튼을 둔다. itch 몫은 기본 10%, 0~100% 로 바꿀 수 있다.
- 받으려면 itch 설정에서 **결제 방식**(PayPal "Direct to you" 또는 itch 가 모아서 지급)과
  **세금 정보(tax interview, 한국 개인은 W-8BEN)** 를 넣는다. 계정 정보는 저장소에 적지 않는다(§0.8).
- 이 빌드에는 광고가 없다. 광고 수익은 우리 웹(H5)·앱(AdMob)에서 낸다.
