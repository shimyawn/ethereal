/**
 * Root Layout — Next.js App Router
 *
 * [왜 여기에 FloatingAudioPlayer를 두는가?]
 * App Router의 layout.tsx는 자식 page.tsx가 교체되어도 자신은 re-mount되지 않는다.
 * 따라서 FloatingAudioPlayer를 layout에 배치하면:
 *  - 라우팅 전환 중에도 컴포넌트가 DOM에서 사라지지 않음
 *  - 오디오가 끊기지 않고 계속 재생됨
 *  - useAudioSync 훅의 이벤트 리스너가 단 한 번만 등록되고 중복 없이 유지됨
 */

import type { Metadata, Viewport } from 'next'
import { Noto_Serif_KR } from 'next/font/google'
import './globals.css'
import FloatingAudioPlayer from '@/components/audio/FloatingAudioPlayer'

// ── Noto Serif KR — 한국어 명조체 ────────────────────────────────
// preload: false → 대형 한국어 폰트가 렌더링을 블록하지 않도록 비동기 로드
// display: 'swap' → 폰트 미로드 상태에서 시스템 폴백 폰트로 먼저 렌더링,
//                   로드 완료 시 교체(FOUT 최소화, FOIT 방지)
const notoSerifKR = Noto_Serif_KR({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: '신들의 치유정원 | 태안 국제원예치유박람회',
  description:
    '태안 국제원예치유박람회 미디어아트 특별전 : 신들의 치유정원 — 모바일 오디오 도슨트',
  icons: { icon: '/favicon.ico' },
  // Open Graph (SNS 공유 시 사용)
  openGraph: {
    title: '신들의 치유정원',
    description: '영혼의 나비가 되어 정원으로 들어오세요.',
    locale: 'ko_KR',
    type: 'website',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,    // 모바일 핀치 줌 방지 (전시 앱 UX)
  userScalable: false,
  themeColor: '#0A0F14',
  viewportFit: 'cover', // iOS 노치/홈 인디케이터 영역 대응
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={notoSerifKR.variable}>
      <body className="bg-garden-bg text-[#f0ece4] font-serif antialiased">
        {/* 모바일 중앙 정렬 컨테이너 */}
        <div className="relative mx-auto max-w-md min-h-dvh">
          {children}
          {/*
           * FloatingAudioPlayer는 layout에 고정 배치.
           * 라우팅이 바뀌어도 이 컴포넌트는 파괴되지 않으므로
           * 오디오 재생 상태가 페이지 전환 내내 유지된다.
           */}
          <FloatingAudioPlayer />
        </div>
      </body>
    </html>
  )
}
