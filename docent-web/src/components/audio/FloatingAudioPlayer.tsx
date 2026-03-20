'use client'

import { useAudioStore } from '@/store/audioStore'
import { useAudioSync } from '@/hooks/useAudioSync'
import { motion, AnimatePresence } from 'framer-motion'
import { useCallback } from 'react'

/** 초 → mm:ss */
function formatTime(sec: number): string {
  if (!isFinite(sec) || sec < 0) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function FloatingAudioPlayer() {
  // Audio 이벤트 ↔ Zustand 동기화 (이 컴포넌트는 layout에 1회만 마운트)
  useAudioSync()

  const currentZoneId = useAudioStore((s) => s.currentZoneId)
  const isPlaying = useAudioStore((s) => s.isPlaying)
  const isLoading = useAudioStore((s) => s.isLoading)
  const currentTime = useAudioStore((s) => s.currentTime)
  const duration = useAudioStore((s) => s.duration)
  const playbackRate = useAudioStore((s) => s.playbackRate)
  const togglePlay = useAudioStore((s) => s.togglePlay)
  const seek = useAudioStore((s) => s.seek)
  const setPlaybackRate = useAudioStore((s) => s.setPlaybackRate)

  const progress = duration > 0 ? currentTime / duration : 0

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (duration <= 0) return
      const rect = e.currentTarget.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
      seek(ratio * duration)
    },
    [duration, seek],
  )

  const cycleRate = useCallback(() => {
    const rates: Array<0.75 | 1.0 | 1.25> = [0.75, 1.0, 1.25]
    const idx = rates.indexOf(playbackRate)
    setPlaybackRate(rates[(idx + 1) % rates.length])
  }, [playbackRate, setPlaybackRate])

  return (
    <AnimatePresence>
      {currentZoneId && (
        <motion.div
          key="audio-player"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 flex justify-center"
        >
          <div className="w-full max-w-md bg-[#111820]/95 backdrop-blur-md border-t border-gold/20 px-4 pt-2 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
            {/* 진행 바 — 터치/클릭으로 탐색 가능 */}
            {/*
             * [STEP 6 수정] scaleX 대신 width % 사용.
             * iOS Safari에서 transform: scaleX가 will-change 없이 적용 시
             * 하위 요소 클릭 좌표 계산이 틀어지는 버그 방지.
             */}
            <div
              className="relative h-1 bg-white/10 rounded-full mb-3 cursor-pointer"
              onClick={handleSeek}
              role="slider"
              aria-label="재생 위치"
              aria-valuenow={Math.round(currentTime)}
              aria-valuemax={Math.round(duration)}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-gold transition-[width] duration-100 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-3">
              {/* 재생/일시정지 버튼 */}
              <button
                onClick={togglePlay}
                disabled={isLoading}
                aria-label={isPlaying ? '일시정지' : '재생'}
                className="shrink-0 w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center text-gold disabled:opacity-40 active:scale-90 transition-transform"
              >
                {isLoading ? (
                  // 로딩 스피너
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                ) : isPlaying ? (
                  // 일시정지 아이콘
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  // 재생 아이콘
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
                    <path d="M5 3.868v16.264a1 1 0 001.555.832l13-8.132a1 1 0 000-1.664l-13-8.132A1 1 0 005 3.868z" />
                  </svg>
                )}
              </button>

              {/* 웨이브 애니메이션 (재생 중일 때만) */}
              <div className="flex items-center gap-[3px] h-6 shrink-0">
                {[0, 0.15, 0.3, 0.45, 0.6].map((delay, i) => (
                  <motion.div
                    key={i}
                    className="w-[3px] rounded-full bg-gold/70"
                    animate={
                      isPlaying
                        ? { scaleY: [0.3, 1, 0.3], opacity: [0.5, 1, 0.5] }
                        : { scaleY: 0.3, opacity: 0.3 }
                    }
                    transition={
                      isPlaying
                        ? { duration: 0.8, delay, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.2 }
                    }
                    style={{ height: '20px', originY: 0.5 }}
                  />
                ))}
              </div>

              {/* 시간 표시 */}
              <div className="flex-1 text-xs text-white/50 tabular-nums">
                {formatTime(currentTime)}
                <span className="mx-0.5 opacity-40">/</span>
                {formatTime(duration)}
              </div>

              {/* 재생속도 버튼 */}
              <button
                onClick={cycleRate}
                aria-label="재생속도 변경"
                className="shrink-0 text-xs text-gold/70 border border-gold/20 rounded px-2 py-1 active:scale-95 transition-transform"
              >
                {playbackRate}x
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
