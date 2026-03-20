'use client'

import { useEffect } from 'react'
import { getAudioElement, useAudioStore } from '@/store/audioStore'

/**
 * HTMLAudioElement 이벤트 → Zustand 스토어 동기화 훅
 *
 * layout.tsx의 FloatingAudioPlayer 내부에서 단 한 번만 마운트하여
 * 앱 전체 생명주기 동안 이벤트 리스너를 등록한다.
 * 라우팅이 바뀌어도 layout은 재마운트되지 않으므로 리스너 중복 등록 없음.
 */
export function useAudioSync() {
  const _setCurrentTime = useAudioStore((s) => s._setCurrentTime)
  const _setDuration = useAudioStore((s) => s._setDuration)
  const _setIsLoading = useAudioStore((s) => s._setIsLoading)
  const _setIsPlaying = useAudioStore((s) => s._setIsPlaying)

  useEffect(() => {
    // SSR 환경에서는 실행 안 함
    if (typeof window === 'undefined') return

    const audio = getAudioElement()

    const onTimeUpdate = () => _setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => {
      _setDuration(audio.duration)
      _setIsLoading(false)
    }
    const onWaiting = () => _setIsLoading(true)
    const onCanPlay = () => _setIsLoading(false)
    const onPlay = () => _setIsPlaying(true)
    const onPause = () => _setIsPlaying(false)
    const onEnded = () => {
      _setIsPlaying(false)
      _setCurrentTime(0)
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
    }
  }, [_setCurrentTime, _setDuration, _setIsLoading, _setIsPlaying])
}
