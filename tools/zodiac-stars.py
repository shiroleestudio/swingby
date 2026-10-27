#!/usr/bin/env python3
"""단계 선택 별자리 지도의 별 자리를 실제 별 좌표에서 만든다 (§13.2.2, src/levels/zodiac.ts).

    python3 tools/zodiac-stars.py   → 장마다 [x, y] 다섯 개를 찍는다. zodiac.ts 의 stars 에 옮긴다

적경(시·분)·적위(도·분)를 평면에 펴고(동쪽이 왼쪽) 지도 100×80 에 맞춘 뒤,
손가락으로 누를 수 있게 별 사이를 MIN 이상 벌린다. 단계 좌표가 아니라 그림 좌표다.
"""
import math, json
def hm(h,m): return (h+m/60)*15
def dm(d,m): return d+ (m/60 if d>=0 else -m/60)
data = {
 1: [(hm(1,53.5),dm(19,18)),(hm(1,54.6),dm(20,48)),(hm(2,7.2),dm(23,28)),(hm(2,50.0),dm(27,16)),(hm(3,11.6),dm(19,44))],
 2: [(hm(5,37.6),dm(21,9)),(hm(4,35.9),dm(16,31)),(hm(4,19.8),dm(15,38)),(hm(4,28.6),dm(19,11)),(hm(5,26.3),dm(28,36))],
 3: [(hm(6,37.7),dm(16,24)),(hm(7,20.1),dm(21,59)),(hm(7,45.3),dm(28,2)),(hm(7,34.6),dm(31,53)),(hm(6,43.9),dm(25,8))],
 4: [(hm(8,16.5),dm(9,11)),(hm(8,44.7),dm(18,9)),(hm(8,43.3),dm(21,28)),(hm(8,46.7),dm(28,46)),(hm(8,58.5),dm(11,51))],
 5: [(hm(9,45.9),dm(23,46)),(hm(10,20.0),dm(19,51)),(hm(10,8.4),dm(11,58)),(hm(11,49.1),dm(14,34)),(hm(11,14.1),dm(20,31))],
 6: [(hm(11,50.7),dm(1,46)),(hm(12,41.7),-1-27/60),(hm(12,55.6),dm(3,24)),(hm(13,2.2),dm(10,58)),(hm(13,25.2),-11-10/60)],
 7: [(hm(15,4.1),-25-17/60),(hm(14,50.9),-16-2/60),(hm(15,17.0),-9-23/60),(hm(15,35.5),-14-47/60),(hm(15,37.0),-28-8/60)],
}
W,H,M,TOP=100,80,10,22
out={}
for k,stars in data.items():
    dec0=sum(d for _,d in stars)/5; ra0=sum(r for r,_ in stars)/5
    pts=[(-(r-ra0)*math.cos(math.radians(dec0)), -(d-dec0)) for r,d in stars]
    xs=[p[0] for p in pts]; ys=[p[1] for p in pts]
    w=max(xs)-min(xs); h=max(ys)-min(ys)
    s=min((W-2*M)/w,(H-2*M)/h)
    cx=(max(xs)+min(xs))/2; cy=(max(ys)+min(ys))/2
    # 위쪽 TOP 유닛은 별자리 이름 자리라 비운다
    s=min((W-2*M)/w,(H-TOP-M)/h)
    out[k]=[[round(W/2+(x-cx)*s),round((H+TOP-M)/2+(y-cy)*s)] for x,y in pts]
    print(k,out[k])
print('---relaxed')
MIN=20
for k,p in out.items():
    p=[list(map(float,q)) for q in p]
    for it in range(400):
        for i in range(5):
            for j in range(i+1,5):
                dx=p[j][0]-p[i][0]; dy=(p[j][1]-p[i][1])
                d=math.hypot(dx,dy) or 0.01
                if d<MIN:
                    f=(MIN-d)/2/d
                    p[i][0]-=dx*f; p[i][1]-=dy*f; p[j][0]+=dx*f; p[j][1]+=dy*f
        for q in p:
            q[0]=min(W-10,max(10,q[0])); q[1]=min(H-9,max(TOP,q[1]))
    out[k]=[[round(x),round(y)] for x,y in p]
    print(k,out[k])
json.dump(out,open('pos.json','w'))
