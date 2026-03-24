import type { ColorPalette } from '@/utils/palettes'

export interface StrataParams {
  density: number
  relief: number
  drift: number
  erosion: number
  bloom: number
  grain: number
  palette: ColorPalette
}

export const DEFAULT_STRATA_PARAMS: StrataParams = {
  density: 0.5,
  relief: 0.7,
  drift: 0.3,
  erosion: 0.4,
  bloom: 0.4,
  grain: 0.08,
  palette: 'acid',
}
