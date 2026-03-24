/**
 * Main canvas that hosts the Three.js visual.
 * Renders HazePulseField and connects audio + params.
 */
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useAudio } from '@/hooks/useAudio'
import { useVisualParams } from '@/hooks/useVisualParams'
import { HazePulseField } from '@/visuals/HazePulseField'

interface CanvasProps {
  hasFile: boolean
}

export function Canvas({ hasFile }: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const visualRef = useRef<HazePulseField | null>(null)
  const rafRef = useRef<number>(0)
  const analysisRef = useRef(useAudio().analysis)
  const paramsRef = useRef(useVisualParams())

  const { analysis } = useAudio()
  const params = useVisualParams()
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
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x0a0a0b, 1)
    renderer.domElement.setAttribute('data-frequency-canvas', 'true')
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const visual = new HazePulseField({ width, height })
    visualRef.current = visual

    const scene = visual.getScene()
    const camera = visual.getCamera()

    const animate = () => {
      visual.update(analysisRef.current, paramsRef.current)
      renderer.render(scene, camera)
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    const onResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      renderer.setSize(w, h)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafRef.current)
      visual.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
      rendererRef.current = null
      visualRef.current = null
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="canvas-container"
      style={{
        width: '100%',
        height: '100%',
        background: '#0a0a0b',
      }}
    />
  )
}
