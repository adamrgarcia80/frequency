/**
 * Visual parameter presets and types for FREQUENCY.
 * Controls intensity, bloom, haze, distortion, etc.
 */
export type ColorPalette = 'toxic' | 'ember' | 'ultraviolet' | 'monochrome'

export interface VisualParams {
  intensity: number
  bloom: number
  hazeDensity: number
  distortion: number
  motionSpeed: number
  grain: number
  palette: ColorPalette
}

export const DEFAULT_PARAMS: VisualParams = {
  intensity: 0.7,
  bloom: 0.6,
  hazeDensity: 0.5,
  distortion: 0.4,
  motionSpeed: 1,
  grain: 0.2,
  palette: 'toxic',
}

export const PALETTE_COLORS: Record<ColorPalette, { primary: string; secondary: string; accent: string }> = {
  toxic: { primary: '#2aff2a', secondary: '#1a4a1a', accent: '#7cff7c' },
  ember: { primary: '#ff9a6c', secondary: '#4a2512', accent: '#ffb088' },
  ultraviolet: { primary: '#9d6bff', secondary: '#2a1a4a', accent: '#c49bff' },
  monochrome: { primary: '#e0e0e0', secondary: '#404040', accent: '#ffffff' },
}
