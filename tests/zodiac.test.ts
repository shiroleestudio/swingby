import { describe, expect, it } from 'vitest';
import { CHAPTERS } from '../src/levels/chapters.js';
import { MAP_H, MAP_W, ZODIAC } from '../src/levels/zodiac.js';

describe('별자리 지도 (§13.2.2)', () => {
  it('장마다 별자리가 있고 별 수가 단계 수와 같다', () => {
    for (const c of CHAPTERS) {
      const z = ZODIAC[c.chapter];
      expect(z, `${c.chapter}장`).toBeDefined();
      expect(z!.stars.length).toBe(c.levels.length);
    }
  });

  it('별은 지도 안(위쪽 이름 자리 밖)에 있고 손가락으로 누를 만큼 떨어져 있다', () => {
    for (const z of Object.values(ZODIAC)) {
      for (const [x, y] of z.stars) {
        expect(x).toBeGreaterThanOrEqual(8); expect(x).toBeLessThanOrEqual(MAP_W - 8);
        expect(y).toBeGreaterThanOrEqual(20); expect(y).toBeLessThanOrEqual(MAP_H - 8);
      }
      for (let i = 0; i < z.stars.length; i++) {
        for (let j = i + 1; j < z.stars.length; j++) {
          const [ax, ay] = z.stars[i]!, [bx, by] = z.stars[j]!;
          expect(Math.sqrt((ax - bx) ** 2 + (ay - by) ** 2), `${z.latin} ${i}-${j}`).toBeGreaterThanOrEqual(18);
        }
      }
    }
  });

  it('선은 있는 별끼리 잇고 모든 별이 이어진다', () => {
    for (const z of Object.values(ZODIAC)) {
      const seen = new Set<number>();
      for (const [a, b] of z.lines) {
        expect(a).toBeLessThan(z.stars.length); expect(b).toBeLessThan(z.stars.length);
        seen.add(a); seen.add(b);
      }
      expect(seen.size).toBe(z.stars.length);
    }
  });
});
