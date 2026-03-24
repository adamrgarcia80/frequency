/**
 * Visual parameter presets and types for FREQUENCY.
 * Controls intensity, bloom, haze, distortion, etc.
 */
export type ColorPalette = 'blue' | 'orange' | 'yellow' | 'purple' | 'green'

export interface VisualParams {
  intensity: number
  bloom: number
  hazeDensity: number
  distortion: number
  motionSpeed: number
  palette: ColorPalette
}

export const DEFAULT_PARAMS: VisualParams = {
  intensity: 0.7,
  bloom: 0.6,
  hazeDensity: 0.5,
  distortion: 0.4,
  motionSpeed: 1,
  palette: 'blue',
}

export const PALETTE_COLORS: Record<
  ColorPalette,
  { primary: string; secondary: string; accent: string }
> = {
  blue: { primary: '#2563eb', secondary: '#f97316', accent: '#e2e8f0' },
  orange: { primary: '#f97316', secondary: '#a855f7', accent: '#0a0a0a' },
  yellow: { primary: '#facc15', secondary: '#3b82f6', accent: '#ffffff' },
  purple: { primary: '#a855f7', secondary: '#86efac', accent: '#fbbf24' },
  green: { primary: '#22c55e', secondary: '#7dd3fc', accent: '#ffffff' },
}
