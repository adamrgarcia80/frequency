/**
 * Mode 02: STRATA — Sculptural, sparse, cinematic.
 * Dominant terrain/relief form, volumetric haze, restrained movement.
 * Image-first: still frames are export-worthy campaign art.
 */
import * as THREE from 'three'
import type { AudioAnalysis } from '@/audio/types'
import type { StrataParams } from './types'
import { PALETTE_COLORS } from '@/utils/palettes'

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
  uniform float uDensity;
  uniform float uRelief;
  uniform float uDrift;
  uniform float uErosion;
  uniform float uBloom;
  uniform float uGrain;
  uniform float uLow;
  uniform float uMid;
  uniform float uEnergy;
  uniform float uTransient;
  varying vec2 vUv;

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
    // Restrained time - barely perceptible movement
    float t = uTime * (0.08 + uDrift * 0.12);
    vec2 uv = vUv - 0.5;

    // Very subtle domain warp - breath, not wobble
    vec2 warp = vec2(
      snoise(vec3(uv * 0.8, t)) * uDrift * 0.03,
      snoise(vec3(uv * 0.8 + 20.0, t + 2.0)) * uDrift * 0.03
    );
    uv += warp;

    float r = length(uv) * 2.2;

    // --- DOMINANT SCULPTURAL FORM ---
    // Single central terrain mass - radial falloff creates one focal formation
    float radialFalloff = exp(-r * 1.2);
    radialFalloff = smoothstep(0.15, 0.7, radialFalloff);

    // Layered height field - organic, mineral
    float height = snoise(vec3(uv * 2.2, t * 0.15)) * 0.5;
    height += snoise(vec3(uv * 4.5 + 33.0, t * 0.2)) * 0.25;
    height += snoise(vec3(uv * 9.0 + 77.0, t * 0.25)) * 0.125;
    height = height * 0.5 + 0.5;

    // Gentle audio influence - depth/breath, not distortion
    float audioBreath = 0.02 + uLow * 0.03 + uEnergy * 0.02 + uTransient * 0.02;
    height += snoise(vec3(uv * 1.5, t + uEnergy * 0.5)) * audioBreath * uRelief;

    // Combine: one dominant form
    float form = height * radialFalloff;

    // --- TOPOGRAPHIC CONTOUR LINES ---
    float contourFreq = 14.0 + uDensity * 10.0;
    float contour = sin(form * contourFreq - t * 0.2) * 0.5 + 0.5;
    contour = pow(contour, 2.2 - uErosion);
    contour *= radialFalloff;

    // Mineral erosion - subtle texture, not noisy
    float mineral = snoise(vec3(uv * 15.0, t * 0.1)) * 0.5 + 0.5;
    contour *= (1.0 - mineral * uErosion * 0.3);

    // --- VOLUMETRIC HAZE ---
    float hazeCore = exp(-r * 1.0) * (0.4 + form * 0.3);
    float hazeLayer = snoise(vec3(uv * 1.2, t * 0.08)) * 0.5 + 0.5;
    float haze = hazeCore * (0.5 + hazeLayer * 0.5);
    haze *= uDensity * 0.6;

    // --- SOFT BLOOM (center glow) ---
    float bloom = exp(-r * 2.5) * (0.15 + uEnergy * 0.2 + uMid * 0.1);
    bloom *= uBloom;

    // --- COMPOSITION ---
    // Deep black base, generous negative space
    vec3 col = uSecondary * 0.04;

    // Terrain - primary color, sculptural
    col += uPrimary * contour * uRelief * 0.5;

    // Haze - atmospheric, smoke-like
    col += mix(uPrimary, uAccent, 0.4) * haze;

    // Accent bloom - subtle highlight
    col += uAccent * bloom * 0.6;

    // Cinematic vignette - darken edges
    float vignette = 1.0 - smoothstep(0.5, 1.2, r);
    col *= (0.7 + vignette * 0.3);

    // Film grain - subtle, premium
    float grain = fract(sin(dot(uv + t, vec2(12.9898, 78.233))) * 43758.5453);
    col += (grain - 0.5) * uGrain;

    col = clamp(col, 0.0, 1.0);
    gl_FragColor = vec4(col, 1.0);
  }
`

export class StrataField {
  private scene: THREE.Scene
  private camera: THREE.OrthographicCamera
  private mesh: THREE.Mesh
  private material: THREE.ShaderMaterial
  private startTime: number

  constructor() {
    this.startTime = performance.now() / 1000
    this.scene = new THREE.Scene()
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    this.camera.position.z = 1

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uPrimary: { value: new THREE.Color(0.13, 0.76, 0.37) },
        uSecondary: { value: new THREE.Color(0.02, 0.02, 0.025) },
        uAccent: { value: new THREE.Color(0.89, 0.91, 0.94) },
        uDensity: { value: 0.5 },
        uRelief: { value: 0.7 },
        uDrift: { value: 0.3 },
        uErosion: { value: 0.4 },
        uBloom: { value: 0.4 },
        uGrain: { value: 0.08 },
        uLow: { value: 0 },
        uMid: { value: 0 },
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

  update(analysis: AudioAnalysis, params: StrataParams) {
    const t = performance.now() / 1000 - this.startTime
    const u = this.material.uniforms

    u.uTime.value = t
    u.uDensity.value = params.density
    u.uRelief.value = params.relief
    u.uDrift.value = params.drift
    u.uErosion.value = params.erosion
    u.uBloom.value = params.bloom
    u.uGrain.value = params.grain

    u.uLow.value = analysis.lowEnergy
    u.uMid.value = analysis.midEnergy
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
