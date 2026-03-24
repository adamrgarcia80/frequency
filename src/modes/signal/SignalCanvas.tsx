import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useAudio } from '@/hooks/useAudio'
import { SignalField } from './SignalField'
import type { SignalParams } from './types'

interface SignalCanvasProps {
  params: SignalParams
}

export function SignalCanvas({ params }: SignalCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const analysisRef = useRef(useAudio().analysis)
  const paramsRef = useRef(params)

  const { analysis } = useAudio()
  analysisRef.current = analysis
  paramsRef.current = params

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const width = container.clientWidth
    const height = container.clientHeight

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x18181b, 1)
    renderer.domElement.setAttribute('data-frequency-canvas', 'true')
    container.appendChild(renderer.domElement)

    const visual = new SignalField({ width, height })
    const scene = visual.getScene()
    const camera = visual.getCamera()

    const animate = () => {
      visual.update(analysisRef.current, paramsRef.current)
      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }
    const raf = requestAnimationFrame(animate)

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      visual.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="mode-canvas"
      style={{ width: '100%', height: '100%', background: '#18181b' }}
    />
  )
}
