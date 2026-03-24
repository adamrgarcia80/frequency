import { useState } from 'react'
import { ModeLayout } from '@/components/layout/ModeLayout'
import { FilamentCanvas } from './FilamentCanvas'
import { FilamentControls } from './FilamentControls'
import { DEFAULT_FILAMENT_PARAMS, type FilamentParams } from './types'

export function FilamentPage() {
  const [params, setParams] = useState<FilamentParams>(DEFAULT_FILAMENT_PARAMS)
  const [image, setImage] = useState<HTMLImageElement | null>(null)

  const setParam = <K extends keyof FilamentParams>(key: K, value: FilamentParams[K]) => {
    setParams((p) => ({ ...p, [key]: value }))
  }

  return (
    <ModeLayout
      controls={<FilamentControls params={params} setParam={setParam} onImageUpload={setImage} />}
      canvas={<FilamentCanvas params={params} imageRef={image} />}
    />
  )
}
