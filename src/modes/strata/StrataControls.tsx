import { ControlSlider } from '@/components/shared/ControlSlider'
import { PaletteSwatches } from '@/components/shared/PaletteSwatches'
import { ExportButton } from '@/components/shared/ExportButton'
import type { StrataParams } from './types'
import styles from './StrataControls.module.css'

interface StrataControlsProps {
  params: StrataParams
  setParam: <K extends keyof StrataParams>(key: K, value: StrataParams[K]) => void
}

export function StrataControls({ params, setParam }: StrataControlsProps) {
  return (
    <div className={styles.controls}>
      <ExportButton />
      <h3 className={styles.title}>Strata</h3>
      <ControlSlider label="Density" value={params.density} onChange={(v) => setParam('density', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Relief" value={params.relief} onChange={(v) => setParam('relief', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Drift" value={params.drift} onChange={(v) => setParam('drift', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Erosion" value={params.erosion} onChange={(v) => setParam('erosion', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Bloom" value={params.bloom} onChange={(v) => setParam('bloom', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Grain" value={params.grain} onChange={(v) => setParam('grain', v)} min={0} max={0.5} step={0.02} />
      <PaletteSwatches value={params.palette} onChange={(p) => setParam('palette', p)} />
    </div>
  )
}
