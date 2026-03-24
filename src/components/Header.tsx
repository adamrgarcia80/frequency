import { useAudio } from '@/hooks/useAudio'
import { exportCanvasToPNG } from '@/export/png'
import styles from './Header.module.css'

export function Header() {
  const { audioUrl } = useAudio()

  const handleExport = () => {
    const canvas = document.querySelector('[data-frequency-canvas]') as HTMLCanvasElement
    if (canvas) exportCanvasToPNG(canvas)
  }

  return (
    <header className={styles.header}>
      <h1 className={styles.logo}>FREQUENCY</h1>
      <button
        className={styles.exportBtn}
        onClick={handleExport}
        disabled={!audioUrl}
        title="Export current frame as PNG"
      >
        Export PNG
      </button>
    </header>
  )
}
