import { useVisualParams } from '@/hooks/useVisualParams'
import { PALETTE_COLORS, type ColorPalette } from '@/utils/visualParams'
import styles from './Controls.module.css'

const PALETTES: { id: ColorPalette; label: string }[] = [
  { id: 'toxic', label: 'Toxic' },
  { id: 'ember', label: 'Ember' },
  { id: 'ultraviolet', label: 'Ultraviolet' },
  { id: 'monochrome', label: 'Monochrome' },
]

export function Controls() {
  const params = useVisualParams()

  return (
    <div className={styles.controls}>
      <h3 className={styles.title}>Visual</h3>

      <Slider
        label="Intensity"
        value={params.intensity}
        onChange={(v) => params.setParam('intensity', v)}
        min={0}
        max={1}
        step={0.05}
      />
      <Slider
        label="Bloom"
        value={params.bloom}
        onChange={(v) => params.setParam('bloom', v)}
        min={0}
        max={1}
        step={0.05}
      />
      <Slider
        label="Haze density"
        value={params.hazeDensity}
        onChange={(v) => params.setParam('hazeDensity', v)}
        min={0}
        max={1}
        step={0.05}
      />
      <Slider
        label="Distortion"
        value={params.distortion}
        onChange={(v) => params.setParam('distortion', v)}
        min={0}
        max={1}
        step={0.05}
      />
      <Slider
        label="Motion speed"
        value={params.motionSpeed}
        onChange={(v) => params.setParam('motionSpeed', v)}
        min={0.2}
        max={2}
        step={0.1}
      />
      <Slider
        label="Grain"
        value={params.grain}
        onChange={(v) => params.setParam('grain', v)}
        min={0}
        max={0.5}
        step={0.02}
      />

      <div className={styles.paletteRow}>
        <span className={styles.paletteLabel}>Palette</span>
        <div className={styles.paletteSwatches}>
          {PALETTES.map(({ id, label }) => (
            <button
              key={id}
              className={styles.swatch}
              data-active={params.palette === id}
              onClick={() => params.setPalette(id)}
              title={label}
              style={{
                background: `linear-gradient(135deg, ${PALETTE_COLORS[id].primary}, ${PALETTE_COLORS[id].secondary})`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min: number
  max: number
  step: number
}) {
  return (
    <div className={styles.sliderRow}>
      <label className={styles.sliderLabel}>{label}</label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={styles.slider}
      />
      <span className={styles.sliderValue}>{value.toFixed(2)}</span>
    </div>
  )
}
