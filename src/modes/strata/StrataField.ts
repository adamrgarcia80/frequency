/**
 * Mode 02: STRATA — Sculptural, terrain-like, topographic.
 * Central form, layered contour, volumetric haze, restrained motion.
 * Dark cinematic composition, elegant negative space.
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
  uniform float uHigh;
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
    float t = uTime * (0.3 + uDrift * 0.4);
    vec2 uv = vUv - 0.5;

    // Restrained drift
    vec2 warp = vec2(
      snoise(vec3(uv * 1.5, t)) * uDrift * 0.08,
      snoise(vec3(uv * 1.5 + 20.0, t + 1.0)) * uDrift * 0.08
    );
    uv += warp;

    float r = length(uv) * 2.5;

    // Central sculptural form - layered contour / relief
    float height = 0.0;
    height += snoise(vec3(uv * 3.0, t * 0.2)) * 0.5;
    height += snoise(vec3(uv * 6.0 + 50.0, t * 0.3)) * 0.25;
    height += snoise(vec3(uv * 12.0 + 100.0, t * 0.4)) * 0.125;
    height = height * 0.5 + 0.5;

    // Audio-driven deformation
    float audioDeform = uLow * 0.5 + uMid * 0.3 + uTransient * 0.6;
    height += snoise(vec3(uv * 2.0, t + uEnergy * 2.0)) * audioDeform * uRelief;

    // Contour bands (topographic)
    float contourFreq = 12.0 + uDensity * 8.0;
    float contour = sin(height * contourFreq - t * 0.5) * 0.5 + 0.5;
    contour = pow(contour, 2.0 - uErosion);

    // Erosion / mineral texture
    float erosion = snoise(vec3(uv * 20.0, t * 0.5)) * 0.5 + 0.5;
    contour *= (1.0 - erosion * uErosion * 0.5);

    // Volumetric haze
    float haze = exp(-r * 1.5) * (0.3 + height * 0.5);
    haze += snoise(vec3(uv * 2.0, t * 0.15)) * 0.5 + 0.5;
    haze *= uDensity * (0.4 + uEnergy * 0.3);

    // Center bloom
    float centerGlow = exp(-r * 2.0) * (0.2 + uEnergy * 0.4 + uMid * 0.3);
    centerGlow *= uBloom;

    // Dark base, sparse composition
    vec3 col = uSecondary * 0.08;
    col += uPrimary * contour * uRelief * 0.6;
    col += mix(uPrimary, uAccent, 0.3) * haze;
    col += uAccent * centerGlow * 0.8;

    // Grain
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
        uSecondary: { value: new THREE.Color(0.05, 0.05, 0.06) },
        uAccent: { value: new THREE.Color(0.89, 0.91, 0.94) },
        uDensity: { value: 0.6 },
        uRelief: { value: 0.7 },
        uDrift: { value: 0.4 },
        uErosion: { value: 0.5 },
        uBloom: { value: 0.5 },
        uGrain: { value: 0.15 },
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
