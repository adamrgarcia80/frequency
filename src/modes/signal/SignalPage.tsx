import { useState } from 'react'
import { ModeLayout } from '@/components/layout/ModeLayout'
import { SignalCanvas } from './SignalCanvas'
import { SignalControls } from './SignalControls'
import { DEFAULT_SIGNAL_PARAMS, type SignalParams } from './types'

export function SignalPage() {
  const [params, setParams] = useState<SignalParams>(DEFAULT_SIGNAL_PARAMS)

  const setParam = <K extends keyof SignalParams>(key: K, value: SignalParams[K]) => {
    setParams((p) => ({ ...p, [key]: value }))
  }

  return (
    <ModeLayout
      controls={<SignalControls params={params} setParam={setParam} />}
      canvas={<SignalCanvas params={params} />}
    />
  )
}
