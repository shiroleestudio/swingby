// 조준 입력 해석. docs/PLAN.md §10
//
// **끌어서 돌리기**(2026-10 사용자 결정): 화면 어디든 누르고 좌우로 끌면 그만큼 각도가 돈다.
// 예전에는 손가락과 돔 중심을 잇는 방향이 곧 발사 방향이라 손가락이 로켓을 가렸다.
// 이제 손가락 위치는 상관없고 **움직인 거리**만 본다 — 아래쪽에 손을 둔 채 0.5° 단위로 맞춘다.

import { inArc, norm, padAngle, quantize } from '../core/angle.js';
import { ARC } from '../core/constants.js';
import type { Level } from '../core/types.js';

export const DEG_PER_PX = 0.2;  // 오른쪽으로 1 CSS px 끌면 시계 방향 0.2° (0.5° 한 칸 = 2.5px)
export const CANCEL_DY = 70;   // 누른 점보다 이만큼(CSS px) 아래로 끌면 취소 영역
export const TAP_MOVE = 8;     // 발사로 치기 위한 최소 이동
export const TAP_HOLD = 250;   // 또는 최소 누름 시간(ms)

export class AimInput {
  active = false;
  far = false;                 // 취소 영역 밖인가 (= 손을 떼면 발사되는가)
  angle = 0;

  private base = 0;
  private fromX = 0;
  private fromY = 0;
  private moved = 0;
  private t0 = 0;

  begin(x: number, y: number, angle: number): void {
    this.active = true;
    this.far = true;
    this.angle = this.base = angle;
    this.fromX = x; this.fromY = y;
    this.moved = 0;
    this.t0 = performance.now();
  }

  /** 누른 점에서 끈 거리로 각도를 정한다. 반환값은 취소 영역 밖인가. */
  update(L: Level, x: number, y: number): boolean {
    if (!this.active) return false;
    const dx = x - this.fromX, dy = y - this.fromY;
    this.moved = Math.max(this.moved, Math.hypot(dx, dy));
    this.far = dy < CANCEL_DY;
    if (this.far) this.angle = dragAngle(L, this.base, dx);
    return this.far;
  }

  /** 손을 뗄 때 발사인가. 툭 친 것은 발사하지 않는다 (§10.2). */
  shouldLaunch(): boolean {
    if (!this.active || !this.far) return false;
    return this.moved >= TAP_MOVE || performance.now() - this.t0 >= TAP_HOLD;
  }

  finish(): void { this.active = false; this.far = false; }
}

/**
 * 누른 순간의 각 base 에서 dx 만큼 끈 각. 돔 방향 ±ARC 안에서 0.5° 칸에 맞춘다.
 * 범위 끝이 칸에 안 맞으면(돔 방향이 소수라서) 안쪽 칸으로 물러난다 — 규칙 9(§8.5) 밖으로 나가지 않게
 */
export function dragAngle(L: Level, base: number, dx: number): number {
  const c = padAngle(L);
  const rel = Math.max(-ARC, Math.min(ARC, norm(base - c) + dx * DEG_PER_PX));
  let q = quantize(c + rel);
  if (!inArc(L, q)) q -= Math.sign(rel) * 0.5;
  return q;
}
