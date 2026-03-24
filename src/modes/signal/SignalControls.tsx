import { ControlSlider } from '@/components/shared/ControlSlider'
import { PaletteSwatches } from '@/components/shared/PaletteSwatches'
import { ExportButton } from '@/components/shared/ExportButton'
import type { SignalParams } from './types'
import styles from './SignalControls.module.css'

interface SignalControlsProps {
  params: SignalParams
  setParam: <K extends keyof SignalParams>(key: K, value: SignalParams[K]) => void
}

export function SignalControls({ params, setParam }: SignalControlsProps) {
  return (
    <div className={styles.controls}>
      <ExportButton />
      <h3 className={styles.title}>Signal</h3>
      <ControlSlider label="Intensity" value={params.intensity} onChange={(v) => setParam('intensity', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Bloom" value={params.bloom} onChange={(v) => setParam('bloom', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Haze" value={params.hazeDensity} onChange={(v) => setParam('hazeDensity', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Distortion" value={params.distortion} onChange={(v) => setParam('distortion', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Speed" value={params.motionSpeed} onChange={(v) => setParam('motionSpeed', v)} min={0.2} max={2} step={0.1} />
      <PaletteSwatches value={params.palette} onChange={(p) => setParam('palette', p)} />
    </div>
  )
}
