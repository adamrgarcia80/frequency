import { useState } from 'react'
import { ModeLayout } from '@/components/layout/ModeLayout'
import { StrataCanvas } from './StrataCanvas'
import { StrataControls } from './StrataControls'
import { DEFAULT_STRATA_PARAMS, type StrataParams } from './types'

export function StrataPage() {
  const [params, setParams] = useState<StrataParams>(DEFAULT_STRATA_PARAMS)

  const setParam = <K extends keyof StrataParams>(key: K, value: StrataParams[K]) => {
    setParams((p) => ({ ...p, [key]: value }))
  }

  return (
    <ModeLayout
      controls={<StrataControls params={params} setParam={setParam} />}
      canvas={<StrataCanvas params={params} />}
    />
  )
}
