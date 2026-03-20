'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { getZoneById, getAdjacentZones, INTERACTION_LABELS } from '@/lib/zones'
import { useAudioStore } from '@/store/audioStore'
import FadeInSection from '@/components/zone/FadeInSection'

// 인터랙션 타입별 아이콘 (SVG 인라인)
function InteractionIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    kiosk: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <rect x="5" y="2" width="14" height="20" rx="2" />
        <circle cx="12" cy="17" r="1" fill="currentColor" />
      </svg>
    ),
    motion: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7z" />
        <circle cx="12" cy="9" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    ),
    voice: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z" />
        <path d="M19 10a7 7 0 0 1-14 0M12 19v3M8 22h8" />
      </svg>
    ),
    'mirror-ar': (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 3v18" />
      </svg>
    ),
    ambient: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  }
  return <>{icons[type] ?? null}</>
}

export default function ZonePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const zone = getZoneById(id)
  const { prev, next } = getAdjacentZones(id)

  const loadZone = useAudioStore((s) => s.loadZone)
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const togglePlay = useAudioStore((s) => s.togglePlay)
  const currentZoneId = useAudioStore((s) => s.currentZoneId)

  // 스크롤 시 네비게이션 바 배경 전환
  const [navOpaque, setNavOpaque] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => setNavOpaque(el.scrollTop > 80)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // 페이지 진입 시 해당 존 오디오 로드 (자동 재생 안 함)
  useEffect(() => {
    if (!zone) return
    loadZone(zone.id, zone.assets.audioUrl)
  }, [zone, loadZone])

  // 존이 없으면 맵으로 리디렉트
  if (!zone) {
    router.replace('/map')
    return null
  }

  const isThisZonePlaying = currentZoneId === zone.id && isPlaying
  const hasImage = !zone.assets.mainImage.includes('zone2') // zone2 이미지 없음 처리

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex flex-col min-h-dvh bg-garden-bg"
      ref={scrollRef}
      style={{ overflowY: 'auto' }}
    >
      {/* ── 네비게이션 바 (스크롤 시 배경 반투명 전환) ─────── */}
      <motion.nav
        animate={{ backgroundColor: navOpaque ? 'rgba(10,15,20,0.9)' : 'transparent' }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 backdrop-blur-sm"
      >
        <Link
          href="/map"
          className="flex items-center gap-1.5 text-xs text-white/60 active:opacity-50 font-sans"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path d="M15 19l-7-7 7-7" />
          </svg>
          목록 보기
        </Link>

        <span className="text-[10px] tracking-widest text-white/30 font-sans">
          {zone.id === 'postshow' ? 'OUTRO' : `ZONE ${zone.id.replace('zone', '')}`}
        </span>

        <Link href="/" aria-label="홈" className="text-white/60 active:opacity-50">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
        </Link>
      </motion.nav>

      {/* ── 히어로 이미지 ────────────────────────────────────── */}
      <div className="relative w-full aspect-[4/3] bg-[#1a2030] -mt-12 shrink-0">
        {hasImage ? (
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1.0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={zone.assets.mainImage}
              alt={zone.title}
              fill
              priority
              sizes="(max-width: 448px) 100vw, 448px"
              className="object-cover"
            />
          </motion.div>
        ) : (
          // zone2처럼 이미지 없는 경우 — 색상 그라데이션 폴백
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${zone.accentColor}40 0%, #0a0f14 100%)`,
            }}
          />
        )}

        {/* 하단 그라데이션 오버레이 (텍스트와 자연스럽게 연결) */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-garden-bg via-garden-bg/60 to-transparent pointer-events-none" />

        {/* 히어로 위 타이틀 */}
        <div className="absolute inset-x-0 bottom-4 px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="text-2xl font-bold text-white mb-1">{zone.title}</h1>
            <p className="text-xs text-white/60 font-sans leading-relaxed">{zone.subtitle}</p>
          </motion.div>
        </div>
      </div>

      {/* ── 오디오 재생 버튼 (큰 CTA) ───────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="px-5 pt-4 pb-2"
      >
        <button
          onClick={togglePlay}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl border border-gold/30 bg-gold/5 active:scale-[0.97] transition-transform"
        >
          {/* 재생/일시정지 아이콘 */}
          <AnimatePresence mode="wait">
            <motion.span
              key={isThisZonePlaying ? 'pause' : 'play'}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="shrink-0 w-9 h-9 rounded-full border border-gold/50 flex items-center justify-center text-gold"
            >
              {isThisZonePlaying ? (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 ml-0.5">
                  <path d="M5 3.868v16.264a1 1 0 001.555.832l13-8.132a1 1 0 000-1.664l-13-8.132A1 1 0 005 3.868z" />
                </svg>
              )}
            </motion.span>
          </AnimatePresence>

          <div className="flex flex-col items-start">
            <span className="text-xs text-gold font-sans font-medium">오디오 도슨트</span>
            <span className="text-[10px] text-white/40 font-sans">
              {isThisZonePlaying ? '재생 중… 하단 바에서 제어하세요' : '터치하여 해설을 들어보세요'}
            </span>
          </div>

          {/* 재생 중일 때 미니 웨이브 */}
          {isThisZonePlaying && (
            <div className="ml-auto flex items-center gap-[2px] h-5">
              {[0, 0.1, 0.2, 0.3].map((d, i) => (
                <motion.div
                  key={i}
                  className="w-[2px] rounded-full bg-gold/60"
                  animate={{ scaleY: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.7, delay: d, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ height: '16px', originY: 0.5 }}
                />
              ))}
            </div>
          )}
        </button>
      </motion.div>

      {/* ── 콘텐츠 영역 ─────────────────────────────────────── */}
      <div className="px-5 pb-32 flex flex-col gap-8">
        {/* 메인 설명 */}
        <FadeInSection delay={0.1}>
          <p className="text-sm leading-[1.9] text-white/80 font-serif whitespace-pre-line">
            {zone.content.mainDescription}
          </p>
        </FadeInSection>

        {/* 인터랙티브 아이템 목록 */}
        {zone.content.items.length > 0 && (
          <FadeInSection delay={0.15}>
            <div className="flex flex-col gap-4">
              <h2 className="text-[11px] tracking-[0.2em] text-gold/60 font-sans uppercase">
                체험 요소
              </h2>
              {zone.content.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-xl border border-white/10 bg-[#111820] p-4"
                >
                  {/* 아이템 헤더 */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-bold text-white">{item.name}</h3>
                    <span
                      className="shrink-0 flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-sans"
                      style={{
                        color: zone.accentColor,
                        borderColor: `${zone.accentColor}40`,
                        backgroundColor: `${zone.accentColor}15`,
                      }}
                    >
                      <InteractionIcon type={item.interactionType} />
                      {INTERACTION_LABELS[item.interactionType] ?? item.interactionType}
                    </span>
                  </div>
                  {/* 별칭 */}
                  {item.altNames && item.altNames.length > 0 && (
                    <p className="text-[10px] text-white/30 mb-2 font-sans">
                      {item.altNames.join(' · ')}
                    </p>
                  )}
                  {/* 설명 */}
                  <p className="text-xs text-white/65 leading-relaxed font-serif">
                    {item.description}
                  </p>
                  {/* zone3 꽃 키워드 그리드 */}
                  {item.flowers && (
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {item.flowers.map((flower, fi) => (
                        <motion.div
                          key={fi}
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.35, delay: fi * 0.05 }}
                          className="flex flex-col items-center gap-1 p-2 rounded-lg border border-[#DB2777]/20 bg-[#DB2777]/5"
                        >
                          <span className="text-sm font-bold text-[#DB2777]">
                            {flower.keyword}
                          </span>
                          <span className="text-[9px] text-white/40 text-center leading-tight font-sans line-clamp-2">
                            {flower.description.slice(0, 20)}…
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  {/* 비고 */}
                  {item.note && (
                    <p className="mt-2 text-[10px] text-white/30 italic font-sans">{item.note}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </FadeInSection>
        )}

        {/* 사이니지 패널 */}
        {zone.content.signage && zone.content.signage.length > 0 && (
          <FadeInSection delay={0.2}>
            <div className="flex flex-col gap-3">
              <h2 className="text-[11px] tracking-[0.2em] text-gold/60 font-sans uppercase">
                전시 안내
              </h2>
              {zone.content.signage.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                  className="border-l-2 pl-4 py-1"
                  style={{ borderColor: zone.accentColor }}
                >
                  <p className="text-xs font-bold text-white mb-1">{s.title}</p>
                  <p className="text-xs text-white/55 leading-relaxed font-serif whitespace-pre-line">
                    {s.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </FadeInSection>
        )}

        {/* 나레이션 블록 (zone0 전용) */}
        {zone.content.narration && (
          <FadeInSection delay={0.25}>
            <div
              className="rounded-xl p-4 border"
              style={{
                borderColor: `${zone.accentColor}30`,
                backgroundColor: `${zone.accentColor}0a`,
              }}
            >
              <p className="text-[10px] text-gold/50 font-sans mb-2 tracking-wide">
                — {zone.content.narration.speaker}
              </p>
              <p className="text-xs text-white/75 leading-[2] font-serif whitespace-pre-line italic">
                {zone.content.narration.text}
              </p>
            </div>
          </FadeInSection>
        )}

        {/* 이전/다음 존 네비게이션 */}
        <FadeInSection delay={0.3}>
          <div className="flex gap-3 pt-2">
            {prev ? (
              <Link
                href={`/zone/${prev.id}`}
                className="flex-1 flex items-center gap-2 rounded-xl border border-white/10 bg-[#111820] px-4 py-3 active:opacity-70"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-white/40 shrink-0">
                  <path d="M15 19l-7-7 7-7" />
                </svg>
                <div>
                  <p className="text-[9px] text-white/30 font-sans">이전 존</p>
                  <p className="text-xs text-white font-bold">{prev.title}</p>
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
            {next ? (
              <Link
                href={`/zone/${next.id}`}
                className="flex-1 flex items-center justify-end gap-2 rounded-xl border border-white/10 bg-[#111820] px-4 py-3 active:opacity-70 text-right"
              >
                <div>
                  <p className="text-[9px] text-white/30 font-sans">다음 존</p>
                  <p className="text-xs text-white font-bold">{next.title}</p>
                </div>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 text-white/40 shrink-0">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </FadeInSection>
      </div>
    </motion.div>
  )
}
