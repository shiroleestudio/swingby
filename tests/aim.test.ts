// 끌어서 돌리기 조준 (§10.2, 2026-10)
import { describe, expect, it } from 'vitest';

import { inArc, padAngle } from '../src/core/angle.js';
import { AimInput, CANCEL_DY, DEG_PER_PX } from '../src/game/input.js';
import { loadLevel } from '../tools/levels-fs.js';

const L = loadLevel('1-1');
const c = padAngle(L);

describe('끌어서 돌리기', () => {
  it('누른 자리는 상관없고 끈 거리만큼 돈다 (오른쪽 = 시계 방향)', () => {
    for (const [x, y] of [[10, 700], [380, 20]] as const) {
      const a = new AimInput();
      a.begin(x, y, -66);
      a.update(L, x + 25, y);
      expect(a.angle).toBe(-66 + 25 * DEG_PER_PX);
      a.update(L, x - 25, y);
      expect(a.angle).toBe(-66 - 25 * DEG_PER_PX);
    }
  });

  it('0.5° 단위로 맞춰진다', () => {
    const a = new AimInput();
    a.begin(0, 0, -66);
    a.update(L, 3, 0);                      // 0.6°
    expect(a.angle).toBe(-65.5);
  });

  it('걸을 수 있는 범위(±ARC) 밖으로는 안 돈다', () => {
    const a = new AimInput();
    a.begin(0, 0, c);
    a.update(L, 5000, 0);                   // 1000° 를 끌어도 한 바퀴 돌아 넘어가지 않는다
    expect(inArc(L, a.angle)).toBe(true);
    expect(a.angle).toBeGreaterThan(c + 89.4);
    expect(Number.isInteger(a.angle * 2)).toBe(true);
    a.update(L, -5000, 0);
    expect(inArc(L, a.angle)).toBe(true);
    expect(a.angle).toBeLessThan(c - 89.4);
  });

  it('아래로 끌면 취소, 다시 올리면 이어서 조준', () => {
    const a = new AimInput();
    a.begin(100, 100, -66);
    a.update(L, 120, 100 + CANCEL_DY + 1);
    expect(a.far).toBe(false);
    expect(a.shouldLaunch()).toBe(false);
    expect(a.angle).toBe(-66);              // 취소 중에는 각도를 건드리지 않는다
    a.update(L, 120, 100);
    expect(a.far).toBe(true);
    expect(a.angle).toBe(-62);
    expect(a.shouldLaunch()).toBe(true);
  });

  it('툭 친 것은 발사하지 않는다', () => {
    const a = new AimInput();
    a.begin(50, 50, -66);
    a.update(L, 52, 51);
    expect(a.shouldLaunch()).toBe(false);
  });
});
