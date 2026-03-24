/**
 * Centralized palette definitions for all FREQUENCY modes.
 * Same 5 palettes across Signal, Strata, and Filament.
 */
export type ColorPalette =
  | 'acid'
  | 'ember'
  | 'ultraviolet'
  | 'monochrome'
  | 'infrared'

export const PALETTES: { id: ColorPalette; label: string }[] = [
  { id: 'acid', label: 'Acid Signal' },
  { id: 'ember', label: 'Resin Ember' },
  { id: 'ultraviolet', label: 'Ultraviolet Night' },
  { id: 'monochrome', label: 'Monochrome Smoke' },
  { id: 'infrared', label: 'Infrared Bloom' },
]

export const PALETTE_COLORS: Record<
  ColorPalette,
  { primary: string; secondary: string; accent: string }
> = {
  acid: { primary: '#22c55e', secondary: '#f97316', accent: '#e2e8f0' },
  ember: { primary: '#fb923c', secondary: '#a855f7', accent: '#171717' },
  ultraviolet: { primary: '#a78bfa', secondary: '#4ade80', accent: '#fcd34d' },
  monochrome: { primary: '#e4e4e7', secondary: '#52525b', accent: '#fafafa' },
  infrared: { primary: '#f87171', secondary: '#fb923c', accent: '#fef3c7' },
}
