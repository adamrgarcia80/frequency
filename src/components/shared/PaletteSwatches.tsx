import { PALETTES, PALETTE_COLORS, type ColorPalette } from '@/utils/palettes'
import styles from './PaletteSwatches.module.css'

interface PaletteSwatchesProps {
  value: ColorPalette
  onChange: (p: ColorPalette) => void
}

export function PaletteSwatches({ value, onChange }: PaletteSwatchesProps) {
  return (
    <div className={styles.row}>
      <span className={styles.label}>Palette</span>
      <div className={styles.swatches}>
        {PALETTES.map(({ id, label }) => (
          <button
            key={id}
            className={styles.swatch}
            data-active={value === id}
            onClick={() => onChange(id)}
            title={label}
            style={{
              background: `linear-gradient(135deg, ${PALETTE_COLORS[id].primary} 0%, ${PALETTE_COLORS[id].secondary} 50%, ${PALETTE_COLORS[id].accent} 100%)`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
