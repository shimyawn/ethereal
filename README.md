# Ethereal — 신들의 치유정원

태안 국제원예치유박람회 미디어아트 특별전 **"신들의 치유정원"** 오디오 도슨트 웹앱입니다.
관람객이 전시 존을 이동하며 오디오 해설을 듣고, 각 존의 스토리와 인터랙션 체험 안내를 확인할 수 있습니다.

## Features

- 5개 존 + 프리쇼/포스트쇼 구간별 스토리 및 체험 안내
- 오디오 도슨트 플레이어 (재생/탐색/배속 조절)
- 인터랙티브 전시 지도
- 체험 요소 안내 (키오스크, 모션, 음성 인식, AR 거울 등)
- 페이지 전환 애니메이션

## Tech Stack

- **Next.js 14** (App Router)
- **React 18** · **TypeScript**
- **Tailwind CSS v3**
- **Framer Motion** — 페이지/요소 애니메이션
- **Zustand** — 오디오 상태 관리

## Getting Started

```bash
cd docent-web
npm install
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## Project Structure

```
docent-web/
  src/
    app/
      page.tsx            # 스플래시 (파티클 + 골드 타이포)
      map/                # 전시 지도
      zone/[id]/          # 존별 상세 (히어로, 오디오, 체험 안내)
    components/
      audio/              # FloatingAudioPlayer (하단 고정 플레이어)
      zone/               # FadeInSection
    data/zones.json       # 존 데이터 (스토리, 사이니지, 인터랙션)
    hooks/useAudioSync.ts # 오디오 이벤트 ↔ Zustand 동기화
    store/audioStore.ts   # 전역 오디오 상태
  public/
    audio/                # 존별 도슨트 MP3
    images/               # 존별 메인 이미지, 지도, 파티클
```
