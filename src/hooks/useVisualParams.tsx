import { createContext, useContext, useState, useCallback } from 'react'
import type { VisualParams, ColorPalette } from '@/utils/visualParams'
import { DEFAULT_PARAMS } from '@/utils/visualParams'

interface VisualParamsState extends VisualParams {
  setParam: <K extends keyof VisualParams>(key: K, value: VisualParams[K]) => void
  setPalette: (palette: ColorPalette) => void
  reset: () => void
}

const VisualParamsContext = createContext<VisualParamsState | null>(null)

export function VisualParamsProvider({ children }: { children: React.ReactNode }) {
  const [params, setParams] = useState<VisualParams>(DEFAULT_PARAMS)

  const setParam = useCallback(<K extends keyof VisualParams>(key: K, value: VisualParams[K]) => {
    setParams((p) => ({ ...p, [key]: value }))
  }, [])

  const setPalette = useCallback((palette: ColorPalette) => {
    setParams((p) => ({ ...p, palette }))
  }, [])

  const reset = useCallback(() => setParams(DEFAULT_PARAMS), [])

  const value: VisualParamsState = {
    ...params,
    setParam,
    setPalette,
    reset,
  }

  return (
    <VisualParamsContext.Provider value={value}>
      {children}
    </VisualParamsContext.Provider>
  )
}

export function useVisualParams() {
  const ctx = useContext(VisualParamsContext)
  if (!ctx) throw new Error('useVisualParams must be used within VisualParamsProvider')
  return ctx
}
