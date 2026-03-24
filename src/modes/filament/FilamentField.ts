/**
 * Mode 03: FILAMENT — Monoline, harmonic, calligraphic.
 * Audio-reactive linework, contour-like, sculptural.
 */
import type { AudioAnalysis } from '@/audio/types'
import type { FilamentParams } from './types'
import { PALETTE_COLORS } from '@/utils/palettes'

export class FilamentField {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private startTime: number
  private imageData: ImageData | null = null
  private lines: { points: { x: number; y: number }[] }[] = []
  private lineCount = 60

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('2D context not available')
    this.ctx = ctx
    this.startTime = performance.now() / 1000
    this.initLines()
  }

  private initLines() {
    this.lines = []
    for (let i = 0; i < this.lineCount; i++) {
      const points: { x: number; y: number }[] = []
      const segments = 8 + Math.floor(Math.random() * 12)
      for (let j = 0; j <= segments; j++) {
        points.push({
          x: Math.random(),
          y: Math.random(),
        })
      }
      this.lines.push({ points })
    }
  }

  setImage(image: HTMLImageElement | HTMLCanvasElement | null) {
    if (!image) {
      this.imageData = null
      return
    }
    const w = Math.min(256, image.width)
    const h = Math.min(256, image.height)
    const tmp = document.createElement('canvas')
    tmp.width = w
    tmp.height = h
    const tctx = tmp.getContext('2d')
    if (!tctx) return
    tctx.drawImage(image, 0, 0, w, h)
    this.imageData = tctx.getImageData(0, 0, w, h)
  }

  update(analysis: AudioAnalysis, params: FilamentParams) {
    const w = this.canvas.width
    const h = this.canvas.height
    const t = (performance.now() / 1000 - this.startTime) * params.motionSpeed

    this.ctx.fillStyle = '#0a0a0b'
    this.ctx.fillRect(0, 0, w, h)

    const palette = PALETTE_COLORS[params.palette]
    const energy = analysis.smoothedEnergy
    const low = analysis.lowEnergy
    const mid = analysis.midEnergy
    const high = analysis.highEnergy
    const transient = analysis.transient

    const density = 40 + params.lineDensity * 80
    const count = Math.floor(density)

    for (let i = 0; i < count; i++) {
      const seed = (i * 137.5) % 1
      const phase = (i / count) * Math.PI * 2 + t * 0.5
      const amp = (0.3 + low * 0.5 + transient * 0.3) * 80
      const freq = 2 + mid * 4
      const turb = params.turbulence * (0.5 + high * 0.5) * 30

      const points: { x: number; y: number }[] = []
      const segments = 12 + Math.floor(params.smoothness * 16)
      const baseY = (i / count) * h + Math.sin(t + seed * 10) * 20

      for (let j = 0; j <= segments; j++) {
        const tNorm = j / segments
        const x = tNorm * w + Math.sin(phase + tNorm * freq * Math.PI) * amp
        const y =
          baseY +
          Math.sin(tNorm * Math.PI * 2 + t) * 30 +
          (Math.random() - 0.5) * turb * (1 - params.smoothness)

        points.push({ x, y })
      }

      const tension = 0.2 + params.tension * 0.4
      const alpha = 0.3 + energy * 0.5 + mid * 0.2
      const thickness = 0.5 + low * 0.8 + transient * 0.5

      this.ctx.beginPath()
      this.ctx.strokeStyle = palette.primary
      this.ctx.globalAlpha = alpha
      this.ctx.lineWidth = thickness
      this.ctx.lineCap = 'round'
      this.ctx.lineJoin = 'round'

      for (let j = 0; j < points.length - 1; j++) {
        const p0 = points[Math.max(0, j - 1)]
        const p1 = points[j]
        const p2 = points[j + 1]
        const p3 = points[Math.min(points.length - 1, j + 2)]

        const cp1x = p1.x + (p2.x - p0.x) * tension * 0.5
        const cp1y = p1.y + (p2.y - p0.y) * tension * 0.5
        const cp2x = p2.x - (p3.x - p1.x) * tension * 0.5
        const cp2y = p2.y - (p3.y - p1.y) * tension * 0.5

        if (j === 0) {
          this.ctx.moveTo(p1.x, p1.y)
        }
        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y)
      }

      this.ctx.stroke()
    }

    this.ctx.globalAlpha = 1
  }

  dispose() {
    this.imageData = null
    this.lines = []
  }
}
