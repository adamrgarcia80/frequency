import { useEffect, useRef } from 'react'
import { useAudio } from '@/hooks/useAudio'
import { FilamentField } from './FilamentField'
import type { FilamentParams } from './types'

interface FilamentCanvasProps {
  params: FilamentParams
  imageRef: HTMLImageElement | null
}

export function FilamentCanvas({ params, imageRef }: FilamentCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const fieldRef = useRef<FilamentField | null>(null)
  const analysisRef = useRef(useAudio().analysis)
  const paramsRef = useRef(params)

  const { analysis } = useAudio()
  analysisRef.current = analysis
  paramsRef.current = params

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const canvas = document.createElement('canvas')
    canvas.setAttribute('data-frequency-canvas', 'true')
    container.appendChild(canvas)

    const resize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      canvas.width = w
      canvas.height = h
      if (fieldRef.current) {
        fieldRef.current.setImage(imageRef)
      }
    }

    resize()
    const field = new FilamentField(canvas)
    fieldRef.current = field

    const animate = () => {
      field.update(analysisRef.current, paramsRef.current)
      requestAnimationFrame(animate)
    }
    const raf = requestAnimationFrame(animate)

    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
      field.dispose()
      container.removeChild(canvas)
      fieldRef.current = null
    }
  }, [])

  useEffect(() => {
    if (fieldRef.current) {
      fieldRef.current.setImage(imageRef)
    }
  }, [imageRef])

  return (
    <div
      ref={containerRef}
      className="mode-canvas"
      style={{ width: '100%', height: '100%', background: '#0a0a0b' }}
    />
  )
}
