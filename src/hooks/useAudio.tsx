/**
 * Audio context, playback, and analysis state.
 * Provides the pipeline: file -> decode -> play -> analyze.
 */
import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'
import { createAnalyzer } from '@/audio/analyzer'
import type { AudioAnalysis } from '@/audio/types'

interface AudioState {
  audioUrl: string | null
  isPlaying: boolean
  currentTime: number
  duration: number
  analysis: AudioAnalysis
  loadFile: (file: File) => void
  play: () => void
  pause: () => void
  toggle: () => void
  seek: (time: number) => void
}

const AudioContext = createContext<AudioState | null>(null)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [analysis, setAnalysis] = useState<AudioAnalysis>({
    amplitude: 0,
    frequencyData: new Float32Array(128),
    lowEnergy: 0,
    midEnergy: 0,
    highEnergy: 0,
    smoothedEnergy: 0,
    transient: 0,
    rms: 0,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const contextRef = useRef<globalThis.AudioContext | null>(null)
  const analyzerRef = useRef<ReturnType<typeof createAnalyzer> | null>(null)
  const rafRef = useRef<number>(0)

  const loadFile = useCallback((file: File) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    const url = URL.createObjectURL(file)
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev)
      return url
    })
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
  }, [])

  const initAudioContext = useCallback((audio: HTMLAudioElement) => {
    if (contextRef.current) return
    const ctx = new globalThis.AudioContext()
    const source = ctx.createMediaElementSource(audio)
    const { getAnalysis } = createAnalyzer(ctx, source)
    contextRef.current = ctx
    analyzerRef.current = { analyser: null as never, getAnalysis }
  }, [])

  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio

    const onLoadedMetadata = () => setDuration(audio.duration)
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnded = () => setIsPlaying(false)

    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.pause()
      if (audioUrl) URL.revokeObjectURL(audioUrl)
    }
  }, [])

  useEffect(() => {
    if (!audioUrl || !audioRef.current) return
    const audio = audioRef.current
    audio.src = audioUrl
    audio.load()
  }, [audioUrl])

  useEffect(() => {
    if (!isPlaying || !audioRef.current || !analyzerRef.current) return

    const ctx = contextRef.current
    if (!ctx || ctx.state === 'suspended') {
      ctx?.resume()
    }

    const tick = () => {
      const a = analyzerRef.current
      if (a) setAnalysis(a.getAnalysis())
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [isPlaying])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio?.src) return
    initAudioContext(audio)
    if (contextRef.current?.state === 'suspended') {
      await contextRef.current.resume()
    }
    audio.play().then(() => setIsPlaying(true)).catch(console.error)
  }, [initAudioContext])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) pause()
    else play()
  }, [isPlaying, play, pause])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(time, duration || 0))
    setCurrentTime(audio.currentTime)
  }, [duration])

  const value: AudioState = {
    audioUrl,
    isPlaying,
    currentTime,
    duration,
    analysis,
    loadFile,
    play,
    pause,
    toggle,
    seek,
  }

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioContext)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}
