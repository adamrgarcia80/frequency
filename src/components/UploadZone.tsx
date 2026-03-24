import { useRef } from 'react'
import { useAudio } from '@/hooks/useAudio'
import styles from './UploadZone.module.css'

export function UploadZone({ onFileLoaded }: { onFileLoaded?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const { loadFile } = useAudio()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith('audio/')) {
      loadFile(file)
      onFileLoaded?.()
    }
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith('audio/')) {
      loadFile(file)
      onFileLoaded?.()
    }
  }

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  return (
    <div
      className={styles.zone}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        onChange={handleChange}
        className={styles.input}
      />
      <span className={styles.label}>Drop audio or click to upload</span>
    </div>
  )
}
