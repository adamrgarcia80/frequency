import { useState } from 'react'
import { AudioProvider } from '@/hooks/useAudio'
import { VisualParamsProvider } from '@/hooks/useVisualParams'
import { Header } from '@/components/Header'
import { Canvas } from '@/components/Canvas'
import { Controls } from '@/components/Controls'
import { UploadZone } from '@/components/UploadZone'
import { PlaybackBar } from '@/components/PlaybackBar'
import styles from './App.module.css'

function App() {
  const [hasFile, setHasFile] = useState(false)

  return (
    <AudioProvider>
      <VisualParamsProvider>
      <div className={styles.app}>
        <Header />
        <main className={styles.main}>
          <aside className={styles.sidebar}>
            <UploadZone onFileLoaded={() => setHasFile(true)} />
            {hasFile && <PlaybackBar />}
            <Controls />
          </aside>
          <section className={styles.canvasSection}>
            <Canvas hasFile={hasFile} />
          </section>
        </main>
      </div>
      </VisualParamsProvider>
    </AudioProvider>
  )
}

export default App
