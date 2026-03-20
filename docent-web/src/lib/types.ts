export interface MapPin {
  x: string
  y: string
}

export interface ZoneAssets {
  mainImage: string
  audioUrl: string
}

export interface Signage {
  title: string
  description: string
}

export interface Narration {
  speaker: string
  text: string
}

export interface Flower {
  keyword: string
  description: string
}

export type InteractionType = 'kiosk' | 'motion' | 'voice' | 'mirror-ar' | 'ambient'

export interface ZoneItem {
  name: string
  altNames?: string[]
  description: string
  interactionType: InteractionType
  flowers?: Flower[]
  note?: string
}

export interface ZoneContent {
  mainDescription: string
  signage?: Signage[]
  narration?: Narration
  items: ZoneItem[]
}

export interface Zone {
  id: string
  slug: string
  title: string
  subtitle: string
  accentColor: string
  mapPin: MapPin
  assets: ZoneAssets
  content: ZoneContent
}

export interface ZonesMeta {
  title: string
  fullTitle: string
  version: string
  source: string
}

export interface ZonesData {
  meta: ZonesMeta
  zones: Zone[]
}
