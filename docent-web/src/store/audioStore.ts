/**
 * ─────────────────────────────────────────────────────────────────
 * 오디오가 라우팅 변경 시에도 파괴되지 않는 이유
 * ─────────────────────────────────────────────────────────────────
 *
 * [핵심 원칙] HTMLAudioElement는 React 외부(모듈 스코프)의 변수로 관리한다.
 *
 * 1. 모듈 싱글턴 (audioElement 변수)
 *    - `audioElement`는 이 모듈이 최초 import될 때 단 한 번 초기화된다.
 *    - React 컴포넌트나 훅이 unmount/remount 되어도, JS 모듈은 번들 수명 내내
 *      메모리에 유지되므로 Audio 객체가 GC(가비지 컬렉션)되지 않는다.
 *    - 즉, 라우팅 전환 = 컴포넌트 파괴 ≠ Audio 객체 파괴.
 *
 * 2. Next.js App Router layout.tsx 의 비재마운트 특성
 *    - layout.tsx는 자식 세그먼트(page.tsx)가 바뀌어도 re-mount되지 않는다.
 *    - FloatingAudioPlayer를 layout.tsx에 배치하면 DOM에서 사라지지 않으므로
 *      재생 중 라우팅을 해도 UI가 끊기지 않는다.
 *
 * 3. Zustand 전역 스토어의 React 외부 생존
 *    - Zustand는 React context 없이 독립 store를 생성한다.
 *    - 컴포넌트 트리 전체가 교체되어도 스토어 상태(currentZoneId, isPlaying 등)는
 *      그대로 유지된다.
 *
 * [흐름 요약]
 *   Audio 객체 (모듈 싱글턴, React 생명주기 밖)
 *       ↕  addEventListener (useAudioSync 훅에서 한 번만 등록)
 *   Zustand store (전역 상태, React 생명주기 밖)
 *       ↕  useAudioStore (subscribe)
 *   FloatingAudioPlayer (layout에 상주 → 라우팅과 무관하게 살아있음)
 * ─────────────────────────────────────────────────────────────────
 */

import { create } from 'zustand'

// ── 모듈 스코프 싱글턴 ──────────────────────────────────────────
// React 컴포넌트 밖에 선언 → 라우팅 전환으로 절대 파괴되지 않음
let _audioElement: HTMLAudioElement | null = null

export function getAudioElement(): HTMLAudioElement {
  if (typeof window === 'undefined') {
    // SSR 환경에서는 Audio를 생성할 수 없음 — 클라이언트 전용
    throw new Error('[AudioStore] HTMLAudioElement는 클라이언트 전용입니다.')
  }
  if (!_audioElement) {
    _audioElement = new Audio()
    _audioElement.preload = 'metadata'
  }
  return _audioElement
}
// ────────────────────────────────────────────────────────────────

interface AudioState {
  currentZoneId: string | null
  isPlaying: boolean
  isLoading: boolean
  currentTime: number
  duration: number
  playbackRate: 0.75 | 1.0 | 1.25
}

interface AudioActions {
  /** 존 오디오 로드 (이미 같은 존이면 no-op) */
  loadZone: (zoneId: string, audioUrl: string) => void
  /** 재생 (모바일 autoplay 정책상 반드시 유저 제스처 후 호출) */
  play: () => Promise<void>
  pause: () => void
  togglePlay: () => void
  seek: (time: number) => void
  setPlaybackRate: (rate: 0.75 | 1.0 | 1.25) => void
  /** 내부 전용 — useAudioSync 훅에서만 사용 */
  _setCurrentTime: (t: number) => void
  _setDuration: (d: number) => void
  _setIsLoading: (v: boolean) => void
  _setIsPlaying: (v: boolean) => void
}

type AudioStore = AudioState & AudioActions

export const useAudioStore = create<AudioStore>((set, get) => ({
  // ── 초기 상태 ─────────────────────────────────────────────────
  currentZoneId: null,
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1.0,

  // ── 액션 ──────────────────────────────────────────────────────
  loadZone: (zoneId, audioUrl) => {
    // 이미 같은 존이면 다시 로드하지 않음 (진행 위치 보존)
    if (get().currentZoneId === zoneId) return

    const audio = getAudioElement()
    audio.pause()
    audio.src = audioUrl
    audio.load()
    set({
      currentZoneId: zoneId,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      isLoading: true,
    })
  },

  play: async () => {
    const audio = getAudioElement()
    try {
      await audio.play()
      set({ isPlaying: true })
    } catch {
      // 모바일 브라우저의 autoplay 정책에 의해 거부될 수 있음
      // 유저 제스처(버튼 클릭) 후에만 호출하면 이 분기는 실질적으로 발생하지 않음
      set({ isPlaying: false })
    }
  },

  pause: () => {
    getAudioElement().pause()
    set({ isPlaying: false })
  },

  togglePlay: () => {
    const { isPlaying, play, pause } = get()
    if (isPlaying) pause()
    else play()
  },

  seek: (time) => {
    const audio = getAudioElement()
    audio.currentTime = time
    set({ currentTime: time })
  },

  setPlaybackRate: (rate) => {
    getAudioElement().playbackRate = rate
    set({ playbackRate: rate })
  },

  // ── 내부 전용 세터 (useAudioSync에서 Audio 이벤트를 스토어에 반영) ──
  _setCurrentTime: (t) => set({ currentTime: t }),
  _setDuration: (d) => set({ duration: d }),
  _setIsLoading: (v) => set({ isLoading: v }),
  _setIsPlaying: (v) => set({ isPlaying: v }),
}))
