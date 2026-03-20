'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { zones } from '@/lib/zones'

// 존 카드 stagger
const cardContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.3 } },
}
const cardItem = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

// 핀 등장 stagger
const pinContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.6 } },
}
const pinItem = {
  hidden: { scale: 0, opacity: 0 },
  show: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 400, damping: 20 } },
}

export default function MapPage() {
  const router = useRouter()

  return (
    <main className="flex flex-col min-h-dvh bg-garden-bg overflow-hidden">
      {/* ── 상단 헤더 ──────────────────────────────────────── */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between px-4 pt-5 pb-3 shrink-0"
      >
        <Link href="/" aria-label="홈으로" className="text-gold/60 active:opacity-50">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
        <h1 className="text-xs tracking-[0.25em] text-gold/70 font-sans">신들의 치유정원</h1>
        <div className="w-5" aria-hidden="true" />
      </motion.header>

      {/* ── 지도 영역 (화면의 상단 ~55%) ────────────────────── */}
      <div className="relative w-full shrink-0" style={{ height: '55vw', maxHeight: '260px' }}>
        {/* 전체 맵 이미지 */}
        <motion.div
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src="/images/global_map.png"
            alt="신들의 치유정원 전체 맵"
            fill
            priority          // LCP 이미지 — 선제 로드
            sizes="(max-width: 448px) 100vw, 448px"
            className="object-cover"
          />
          {/* 하단 그라데이션 (카드 섹션과 자연스럽게 연결) */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-garden-bg to-transparent pointer-events-none" />
        </motion.div>

        {/* ── 존 핀 마커 오버레이 ─────────────────────────── */}
        {/*
         * ⚠️ 임시 좌표 사용 중
         * global_map.png의 실제 구역 위치를 확인한 후
         * src/data/zones.json의 각 zone.mapPin.x / .y 를 조정하세요.
         */}
        <motion.div
          className="absolute inset-0"
          variants={pinContainer}
          initial="hidden"
          animate="show"
        >
          {zones.map((zone) => (
            <motion.button
              key={zone.id}
              variants={pinItem}
              onClick={() => router.push(`/zone/${zone.id}`)}
              aria-label={`${zone.title} 이동`}
              style={{ left: zone.mapPin.x, top: zone.mapPin.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
              whileTap={{ scale: 0.85 }}
            >
              {/* 핀 pulse 링 */}
              <span
                className="absolute inset-0 rounded-full animate-pulse-pin"
                style={{ backgroundColor: zone.accentColor, opacity: 0.5 }}
                aria-hidden="true"
              />
              {/* 핀 본체 */}
              <span
                className="relative flex items-center justify-center w-6 h-6 rounded-full border-2 border-white/80 shadow-lg text-[9px] font-bold text-white font-sans"
                style={{ backgroundColor: zone.accentColor }}
              >
                {zone.id === 'postshow' ? '끝' : zone.id.replace('zone', '')}
              </span>
              {/* hover 툴팁 */}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 whitespace-nowrap text-[10px] bg-black/80 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-sans">
                {zone.title}
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      {/* ── 존 카드 섹션 (하단 스크롤 영역) ────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="px-4 pt-4 pb-2 text-xs text-white/40 font-sans tracking-wide"
        >
          존을 선택하여 도슨트를 시작하세요
        </motion.p>

        {/* 수평 스크롤 카드 리스트 */}
        <motion.div
          variants={cardContainer}
          initial="hidden"
          animate="show"
          className="flex gap-3 overflow-x-auto px-4 pb-6 snap-x snap-mandatory"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {zones.map((zone) => (
            <motion.div
              key={zone.id}
              variants={cardItem}
              className="shrink-0 snap-center"
              style={{ width: '72vw', maxWidth: '280px' }}
            >
              <Link
                href={`/zone/${zone.id}`}
                className="block rounded-2xl overflow-hidden border border-white/10 bg-[#111820] active:scale-[0.97] transition-transform"
              >
                {/* 썸네일 이미지 */}
                <div className="relative w-full aspect-[3/2] bg-[#1a2030]">
                  <Image
                    src={zone.assets.mainImage}
                    alt={zone.title}
                    fill
                    sizes="280px"
                    className="object-cover"
                    // zone2는 이미지 파일 없을 수 있음 → onError로 처리
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  {/* 이미지 하단 그라데이션 */}
                  <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#111820] to-transparent" />
                  {/* 존 번호 뱃지 */}
                  <span
                    className="absolute top-2 left-2 text-[10px] font-bold text-white px-2 py-0.5 rounded-full font-sans"
                    style={{ backgroundColor: zone.accentColor }}
                  >
                    {zone.id === 'postshow' ? 'OUTRO' : `ZONE ${zone.id.replace('zone', '')}`}
                  </span>
                </div>

                {/* 카드 텍스트 */}
                <div className="px-3 pt-3 pb-4">
                  <h2 className="text-sm font-bold text-white mb-1">{zone.title}</h2>
                  <p className="text-[11px] text-white/50 leading-relaxed line-clamp-2 font-sans">
                    {zone.subtitle}
                  </p>
                  {/* 오디오 도슨트 표시 */}
                  <div className="flex items-center gap-1 mt-2.5">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-gold/60">
                      <path d="M12 3v10.55A4 4 0 1014 17V7h4V3h-6z" />
                    </svg>
                    <span className="text-[10px] text-gold/60 font-sans">오디오 도슨트</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </main>
  )
}
