import { useAudio } from '@/hooks/useAudio'
import styles from './PlaybackBar.module.css'

export function PlaybackBar() {
  const { isPlaying, toggle, currentTime, duration, seek } = useAudio()

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    seek(x * duration)
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  return (
    <div className={styles.bar}>
      <button
        className={styles.playBtn}
        onClick={toggle}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      <div className={styles.timeline} onClick={handleScrub}>
        <div className={styles.track} />
        <div className={styles.progress} style={{ width: `${progress}%` }} />
      </div>
      <span className={styles.time}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  )
}
