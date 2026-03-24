import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AudioProvider } from '@/hooks/useAudio'
import { Nav } from '@/components/layout/Nav'
import { UploadZone } from '@/components/UploadZone'
import { PlaybackBar } from '@/components/PlaybackBar'
import { SignalPage } from '@/modes/signal/SignalPage'
import { StrataPage } from '@/modes/strata/StrataPage'
import { FilamentPage } from '@/modes/filament/FilamentPage'
import styles from './App.module.css'

function App() {
  const [hasFile, setHasFile] = useState(false)

  return (
    <AudioProvider>
      <BrowserRouter basename="/frequency">
        <div className={styles.app}>
          <Nav />
          <div className={styles.sharedBar}>
            <UploadZone onFileLoaded={() => setHasFile(true)} />
            {hasFile && <PlaybackBar />}
          </div>
          <Routes>
            <Route path="/" element={<SignalPage />} />
            <Route path="/strata" element={<StrataPage />} />
            <Route path="/filament" element={<FilamentPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AudioProvider>
  )
}

export default App
