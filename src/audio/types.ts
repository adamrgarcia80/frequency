/**
 * Audio analysis types for FREQUENCY.
 * These values drive the visual parameters.
 */
export interface AudioAnalysis {
  /** Raw waveform amplitude 0-1 */
  amplitude: number
  /** FFT frequency data (normalized 0-1 per bin) */
  frequencyData: Float32Array
  /** Low band energy (sub-bass, ~20-250Hz) */
  lowEnergy: number
  /** Mid band energy (~250-4000Hz) */
  midEnergy: number
  /** High band energy (~4000Hz+) */
  highEnergy: number
  /** Smoothed overall energy (for gentle response) */
  smoothedEnergy: number
  /** Transient/spike detection (beat-like changes) */
  transient: number
  /** RMS for loudness perception */
  rms: number
}

export const DEFAULT_ANALYSIS: AudioAnalysis = {
  amplitude: 0,
  frequencyData: new Float32Array(128),
  lowEnergy: 0,
  midEnergy: 0,
  highEnergy: 0,
  smoothedEnergy: 0,
  transient: 0,
  rms: 0,
}
