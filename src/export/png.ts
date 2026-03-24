/**
 * Export canvas to high-resolution PNG.
 * Uses a multiplier for print-ready output.
 */
const EXPORT_SCALE = 2

export function exportCanvasToPNG(canvas: HTMLCanvasElement, scale = EXPORT_SCALE): void {
  const w = canvas.width
  const h = canvas.height
  const outW = w * scale
  const outH = h * scale

  const exportCanvas = document.createElement('canvas')
  exportCanvas.width = outW
  exportCanvas.height = outH
  const ctx = exportCanvas.getContext('2d')
  if (!ctx) return

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(canvas, 0, 0, w, h, 0, 0, outW, outH)

  const url = exportCanvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = `frequency-${Date.now()}.png`
  link.href = url
  link.click()
}
