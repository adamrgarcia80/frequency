import { useRef } from 'react'
import { ControlSlider } from '@/components/shared/ControlSlider'
import { PaletteSwatches } from '@/components/shared/PaletteSwatches'
import { ExportButton } from '@/components/shared/ExportButton'
import type { FilamentParams } from './types'
import styles from './FilamentControls.module.css'

interface FilamentControlsProps {
  params: FilamentParams
  setParam: <K extends keyof FilamentParams>(key: K, value: FilamentParams[K]) => void
  onImageUpload?: (img: HTMLImageElement | null) => void
}

export function FilamentControls({ params, setParam, onImageUpload }: FilamentControlsProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file?.type.startsWith('image/')) return
    const img = new Image()
    img.onload = () => onImageUpload?.(img)
    img.src = URL.createObjectURL(file)
    e.target.value = ''
  }

  return (
    <div className={styles.controls}>
      <ExportButton />
      {onImageUpload && (
        <div className={styles.imageRow}>
          <button
            type="button"
            className={styles.imageBtn}
            onClick={() => inputRef.current?.click()}
          >
            Image
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.hidden}
          />
        </div>
      )}
      <h3 className={styles.title}>Filament</h3>
      <ControlSlider label="Line density" value={params.lineDensity} onChange={(v) => setParam('lineDensity', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Smoothness" value={params.smoothness} onChange={(v) => setParam('smoothness', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Tension" value={params.tension} onChange={(v) => setParam('tension', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Turbulence" value={params.turbulence} onChange={(v) => setParam('turbulence', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Image influence" value={params.imageInfluence} onChange={(v) => setParam('imageInfluence', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Edge sensitivity" value={params.edgeSensitivity} onChange={(v) => setParam('edgeSensitivity', v)} min={0} max={1} step={0.05} />
      <ControlSlider label="Motion speed" value={params.motionSpeed} onChange={(v) => setParam('motionSpeed', v)} min={0.2} max={2} step={0.1} />
      <PaletteSwatches value={params.palette} onChange={(p) => setParam('palette', p)} />
    </div>
  )
}
