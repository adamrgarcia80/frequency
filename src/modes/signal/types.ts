import type { ColorPalette } from '@/utils/palettes'

export interface SignalParams {
  intensity: number
  bloom: number
  hazeDensity: number
  distortion: number
  motionSpeed: number
  palette: ColorPalette
}

export const DEFAULT_SIGNAL_PARAMS: SignalParams = {
  intensity: 0.7,
  bloom: 0.6,
  hazeDensity: 0.5,
  distortion: 0.4,
  motionSpeed: 1,
  palette: 'acid',
}
