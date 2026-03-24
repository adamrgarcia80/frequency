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
  blue: { primary: '#3b82f6', secondary: '#f97316', accent: '#e2e8f0' },
  orange: { primary: '#fb923c', secondary: '#a855f7', accent: '#171717' },
  yellow: { primary: '#fde047', secondary: '#60a5fa', accent: '#ffffff' },
  purple: { primary: '#c084fc', secondary: '#4ade80', accent: '#fcd34d' },
  green: { primary: '#34d399', secondary: '#38bdf8', accent: '#ffffff' },
}
