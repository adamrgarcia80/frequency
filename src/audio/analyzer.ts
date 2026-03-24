/**
 * Web Audio API analyzer for FREQUENCY.
 * Extracts waveform, FFT, band energies, smoothed values, and transients.
 */
import type { AudioAnalysis } from './types'

const FFT_SIZE = 256
const SMOOTHING = 0.85
const TRANSIENT_THRESHOLD = 0.15
const TRANSIENT_DECAY = 0.92

/** Maps FFT bins to low/mid/high bands (approx) */
const LOW_END = 3
const LOW_END_MID = 10
const MID_END = 40
const HIGH_END = 64

export function createAnalyzer(audioContext: AudioContext, source: MediaElementAudioSourceNode) {
  const analyser = audioContext.createAnalyser()
  analyser.fftSize = FFT_SIZE
  analyser.smoothingTimeConstant = 0.6
  analyser.minDecibels = -90
  analyser.maxDecibels = -10

  source.connect(analyser)
  analyser.connect(audioContext.destination)

  const frequencyData = new Float32Array(analyser.frequencyBinCount)
  const timeData = new Float32Array(analyser.fftSize)
  let prevEnergy = 0
  let smoothedEnergy = 0
  let transient = 0

  function getAnalysis(): AudioAnalysis {
    analyser.getFloatFrequencyData(frequencyData)
    analyser.getFloatTimeDomainData(timeData)

    // Waveform amplitude from time domain
    let sum = 0
    for (let i = 0; i < timeData.length; i++) {
      sum += Math.abs(timeData[i])
    }
    const amplitude = Math.min(1, sum / timeData.length * 4)

    // RMS
    let rmsSum = 0
    for (let i = 0; i < timeData.length; i++) {
      rmsSum += timeData[i] * timeData[i]
    }
    const rms = Math.sqrt(rmsSum / timeData.length)
    const rmsNorm = Math.min(1, rms * 8)

    // Convert dB to 0-1 range for frequency bins
    const normalizedFreq = new Float32Array(frequencyData.length)
    for (let i = 0; i < frequencyData.length; i++) {
      const db = frequencyData[i]
      normalizedFreq[i] = Math.max(0, (db + 90) / 90)
    }

    // Band energies (average of normalized values in each band)
    const lowEnergy = bandAverage(normalizedFreq, LOW_END, LOW_END_MID)
    const midEnergy = bandAverage(normalizedFreq, LOW_END_MID, MID_END)
    const highEnergy = bandAverage(normalizedFreq, MID_END, HIGH_END)

    // Smoothed energy
    const instantEnergy = (lowEnergy * 0.5 + midEnergy * 0.3 + highEnergy * 0.2)
    smoothedEnergy = smoothedEnergy * SMOOTHING + instantEnergy * (1 - SMOOTHING)

    // Transient detection: sudden increase in energy
    const energyDelta = Math.max(0, instantEnergy - prevEnergy)
    if (energyDelta > TRANSIENT_THRESHOLD) {
      transient = Math.min(1, energyDelta * 3)
    }
    prevEnergy = instantEnergy
    transient *= TRANSIENT_DECAY

    return {
      amplitude,
      frequencyData: normalizedFreq,
      lowEnergy,
      midEnergy,
      highEnergy,
      smoothedEnergy,
      transient,
      rms: rmsNorm,
    }
  }

  return { analyser, getAnalysis }
}

function bandAverage(data: Float32Array, start: number, end: number): number {
  let sum = 0
  for (let i = start; i < end && i < data.length; i++) {
    sum += data[i]
  }
  return sum / Math.max(1, end - start)
}
