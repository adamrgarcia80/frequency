import { exportCanvasToPNG } from '@/export/png'
import styles from './ExportButton.module.css'

export function ExportButton() {
  const handleExport = () => {
    const canvas = document.querySelector('[data-frequency-canvas]') as HTMLCanvasElement
    if (canvas) exportCanvasToPNG(canvas)
  }

  return (
    <button
      className={styles.exportBtn}
      onClick={handleExport}
      title="Export current frame as PNG"
    >
      Export PNG
    </button>
  )
}
