import type { ColorPalette } from '@/utils/palettes'

export interface FilamentParams {
  lineDensity: number
  smoothness: number
  tension: number
  turbulence: number
  imageInfluence: number
  edgeSensitivity: number
  motionSpeed: number
  palette: ColorPalette
}

export const DEFAULT_FILAMENT_PARAMS: FilamentParams = {
  lineDensity: 0.6,
  smoothness: 0.7,
  tension: 0.5,
  turbulence: 0.4,
  imageInfluence: 0,
  edgeSensitivity: 0.5,
  motionSpeed: 1,
  palette: 'acid',
}
