import type { Zone, ZonesData } from './types'
import rawData from '@/data/zones.json'

/*
 * [STEP 6 수정] zones.json import 실패 대비 fallback
 * - JSON parse 에러는 빌드 타임에 TypeScript가 잡아주지만,
 *   런타임에 data.zones가 비어있을 경우를 방어한다.
 */
let data: ZonesData

try {
  data = rawData as ZonesData
  if (!Array.isArray(data?.zones)) throw new Error('zones 배열 없음')
} catch (e) {
  console.error('[zones.ts] zones.json 파싱 실패:', e)
  // 최소 fallback — 앱이 빈 화면 대신 맵 페이지라도 렌더링되도록 함
  data = {
    meta: { title: '', fullTitle: '', version: '', source: '' },
    zones: [],
  }
}

export const zonesMeta = data.meta

export const zones: Zone[] = data.zones

/**
 * id(zone0, zone1, …, postshow)로 존 조회
 * 존재하지 않으면 null 반환 — 페이지에서 notFound() 처리
 */
export function getZoneById(id: string): Zone | null {
  return zones.find((z) => z.id === id) ?? null
}

/**
 * slug(preshow, golden-garden, …)로 존 조회
 */
export function getZoneBySlug(slug: string): Zone | null {
  return zones.find((z) => z.slug === slug) ?? null
}

/**
 * 현재 존의 이전/다음 존 반환 (순환 없음, 끝에서 null)
 */
export function getAdjacentZones(id: string): { prev: Zone | null; next: Zone | null } {
  const idx = zones.findIndex((z) => z.id === id)
  if (idx === -1) return { prev: null, next: null }
  return {
    prev: idx > 0 ? zones[idx - 1] : null,
    next: idx < zones.length - 1 ? zones[idx + 1] : null,
  }
}

/** 인터랙션 타입 한글 레이블 */
export const INTERACTION_LABELS: Record<string, string> = {
  kiosk: '키오스크',
  motion: '모션',
  voice: '음성',
  'mirror-ar': 'AR 거울',
  ambient: '앰비언트',
}
