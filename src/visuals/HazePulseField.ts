/**
 * Haze / Pulse Field visual system for FREQUENCY.
 * Atmospheric, signal-distortion, spectral bloom aesthetic.
 * Reacts to bass, mids, highs, loudness, and transients.
 */
import * as THREE from 'three'
import type { AudioAnalysis } from '@/audio/types'
import type { VisualParams } from '@/utils/visualParams'
import { PALETTE_COLORS } from '@/utils/visualParams'

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAGMENT_SHADER = `
  uniform float uTime;
  uniform vec3 uPrimary;
  uniform vec3 uSecondary;
  uniform vec3 uAccent;
  uniform float uIntensity;
  uniform float uBloom;
  uniform float uHazeDensity;
  uniform float uDistortion;
  uniform float uMotionSpeed;
  uniform float uGrain;
  uniform float uLow;
  uniform float uMid;
  uniform float uHigh;
  uniform float uEnergy;
  uniform float uTransient;
  varying vec2 vUv;

  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    float t = uTime * uMotionSpeed;
    vec2 uv = vUv - 0.5;

    // Distortion from audio
    float distort = uDistortion * (uLow * 0.4 + uMid * 0.3 + uHigh * 0.3 + uTransient * 0.5);
    float n1 = snoise(vec3(uv * 4.0, t * 0.5)) * distort;
    float n2 = snoise(vec3(uv * 6.0 + 100.0, t * 0.7)) * distort * 0.5;
    uv += vec2(n1, n2) * 0.08;

    // Radial distance for pulse rings
    float r = length(uv) * 2.0;

    // Haze layers - multiple noise octaves
    float haze = 0.0;
    haze += snoise(vec3(uv * 3.0, t * 0.3)) * 0.5;
    haze += snoise(vec3(uv * 6.0 + 50.0, t * 0.5)) * 0.25;
    haze += snoise(vec3(uv * 12.0 + 200.0, t * 0.8)) * 0.125;
    haze = haze * 0.5 + 0.5;
    haze = pow(haze, 1.0 - uHazeDensity * 0.5);

    // Pulse rings driven by bass and transients
    float pulse = sin(r * 8.0 - t * 2.0 - uLow * 4.0) * 0.5 + 0.5;
    pulse *= exp(-r * 1.5);
    pulse *= (uLow * 0.7 + uTransient * 0.8 + uEnergy * 0.3);

    // Center bloom
    float centerGlow = exp(-r * 2.0) * (uEnergy * 0.6 + uMid * 0.4 + uHigh * 0.2);
    centerGlow *= uBloom;

    // Combine: dark base + haze + pulse + bloom
    vec3 col = uSecondary * 0.15;
    col += uPrimary * haze * uHazeDensity * 0.4 * uIntensity;
    col += uAccent * pulse * uIntensity * 0.8;
    col += uPrimary * centerGlow * uIntensity;

    // Grain
    float grain = fract(sin(dot(uv + t, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * uGrain;

    // Clamp
    col = clamp(col, 0.0, 1.0);

    gl_FragColor = vec4(col, 1.0);
  }
`

export interface HazePulseFieldConfig {
  width: number
  height: number
}

export class HazePulseField {
  private scene: THREE.Scene
  private camera: THREE.OrthographicCamera
  private mesh: THREE.Mesh
  private material: THREE.ShaderMaterial
  private startTime: number

  constructor(config: HazePulseFieldConfig) {
    this.startTime = performance.now() / 1000
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.camera.position.z = 1

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uPrimary: { value: new THREE.Color(0.2, 1, 0.2) },
        uSecondary: { value: new THREE.Color(0.1, 0.3, 0.1) },
        uAccent: { value: new THREE.Color(0.5, 1, 0.5) },
        uIntensity: { value: 0.7 },
        uBloom: { value: 0.6 },
        uHazeDensity: { value: 0.5 },
        uDistortion: { value: 0.4 },
        uMotionSpeed: { value: 1 },
        uGrain: { value: 0.2 },
        uLow: { value: 0 },
        uMid: { value: 0 },
        uHigh: { value: 0 },
        uEnergy: { value: 0 },
        uTransient: { value: 0 },
      },
      depthWrite: false,
    })

    const geo = new THREE.PlaneGeometry(2, 2)
    this.mesh = new THREE.Mesh(geo, this.material)
    this.scene.add(this.mesh)
  }

  getScene() {
    return this.scene
  }

  getCamera() {
    return this.camera
  }

  update(analysis: AudioAnalysis, params: VisualParams) {
    const t = performance.now() / 1000 - this.startTime
    const u = this.material.uniforms

    u.uTime.value = t
    u.uIntensity.value = params.intensity
    u.uBloom.value = params.bloom
    u.uHazeDensity.value = params.hazeDensity
    u.uDistortion.value = params.distortion
    u.uMotionSpeed.value = params.motionSpeed
    u.uGrain.value = params.grain

    u.uLow.value = analysis.lowEnergy
    u.uMid.value = analysis.midEnergy
    u.uHigh.value = analysis.highEnergy
    u.uEnergy.value = analysis.smoothedEnergy
    u.uTransient.value = analysis.transient

    const palette = PALETTE_COLORS[params.palette]
    u.uPrimary.value.set(palette.primary)
    u.uSecondary.value.set(palette.secondary)
    u.uAccent.value.set(palette.accent)
  }

  dispose() {
    this.material.dispose()
    ;(this.mesh.geometry as THREE.BufferGeometry).dispose()
  }
}
