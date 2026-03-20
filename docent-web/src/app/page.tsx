'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

// ── 파티클 정의 (CSS keyframe 이름, 시작 좌표, 크기, 딜레이, 지속시간)
// Canvas나 외부 라이브러리 없이 순수 CSS animation으로 구현 — 성능 우선
const PARTICLES = [
  { animation: 'particle-float-a', left: '15%', top: '70%', size: 5, delay: '0s',    duration: '7s' },
  { animation: 'particle-float-b', left: '75%', top: '80%', size: 4, delay: '1.2s',  duration: '9s' },
  { animation: 'particle-float-c', left: '40%', top: '85%', size: 6, delay: '2.5s',  duration: '6s' },
  { animation: 'particle-float-d', left: '88%', top: '60%', size: 3, delay: '0.7s',  duration: '8s' },
  { animation: 'particle-float-e', left: '25%', top: '55%', size: 5, delay: '3.1s',  duration: '7.5s' },
  { animation: 'particle-float-f', left: '60%', top: '75%', size: 4, delay: '1.8s',  duration: '10s' },
  { animation: 'particle-float-g', left: '50%', top: '90%', size: 3, delay: '4.0s',  duration: '5.5s' },
]

// Framer Motion 텍스트 stagger 컨테이너
const textContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
}

// 개별 글자 애니메이션
const letterVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

// 요소 페이드인 변형
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function SplashPage() {
  const titleChars = '신들의 치유정원'.split('')

  return (
    <main className="relative flex flex-col items-center justify-center min-h-dvh overflow-hidden bg-garden-bg select-none">
      {/* ── 배경: CSS 파티클 (빛 조각) ─────────────────────────── */}
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #e0c97a 0%, #c9a84c 60%, transparent 100%)',
            animationName: p.animation,
            animationDuration: p.duration,
            animationDelay: p.delay,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── 배경 방사형 그라데이션 (중앙 미묘한 광원) ─────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(201,168,76,0.07) 0%, transparent 70%)',
        }}
      />

      {/* ── 메인 콘텐츠 ──────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center">
        {/* 상단 장식선 */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-px bg-gold/60"
          aria-hidden="true"
        />

        {/* 전시 제목 (한 글자씩 stagger 등장) */}
        <div>
          <motion.p
            variants={fadeUp}
            custom={0.4}
            initial="hidden"
            animate="show"
            className="text-xs tracking-[0.3em] text-gold/60 mb-4 font-sans"
          >
            태안 국제원예치유박람회 미디어아트 특별전
          </motion.p>

          <motion.h1
            variants={textContainer}
            initial="hidden"
            animate="show"
            className="flex flex-wrap justify-center text-4xl font-bold leading-tight"
            aria-label="신들의 치유정원"
          >
            {titleChars.map((char, i) => (
              <motion.span
                key={i}
                variants={letterVariant}
                className="text-gold inline-block"
                style={{
                  // 명조체 + 골드 텍스트 그라데이션
                  background: 'linear-gradient(160deg, #e0c97a 0%, #c9a84c 50%, #9a7a2e 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  // 공백은 자간 유지
                  ...(char === ' ' ? { width: '0.4em' } : {}),
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.h1>
        </div>

        {/* 부제 — 타이틀보다 0.8초 늦게 등장 */}
        <motion.p
          variants={fadeUp}
          custom={1.2}
          initial="hidden"
          animate="show"
          className="text-sm text-white/70 leading-relaxed tracking-wide font-serif"
        >
          영혼의 나비가 되어<br />정원으로 들어오세요
        </motion.p>

        {/* 하단 장식선 */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="w-16 h-px bg-gold/60"
          aria-hidden="true"
        />

        {/* CTA 버튼 — /map으로 이동, 골드 glow 효과 */}
        <motion.div
          variants={fadeUp}
          custom={1.6}
          initial="hidden"
          animate="show"
        >
          <Link
            href="/map"
            className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm tracking-widest text-gold font-sans border border-gold/50 rounded-full transition-colors active:scale-95"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            {/* 버튼 내부 glow — animate-glow (tailwind keyframe) */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full animate-glow pointer-events-none"
            />
            치유의 여정 시작하기
          </Link>
        </motion.div>
      </div>

      {/* ── 하단 스크롤 힌트 ────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-8 flex flex-col items-center gap-1"
        aria-hidden="true"
      >
        <span className="text-[10px] tracking-[0.25em] text-white/30 font-sans">SCROLL</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-5 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </main>
  )
}
