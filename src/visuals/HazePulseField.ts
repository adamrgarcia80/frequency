/**
 * Haze / Pulse Field visual system for FREQUENCY.
 * Lava lamp–style: soft cloudy blobs, hard edges, particle elements.
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

  // Voronoi-like cells for hard edges
  vec2 voronoi(vec2 p) {
    vec2 n = floor(p);
    vec2 f = fract(p);
    float md = 8.0;
    vec2 mc = vec2(0.0);
    for (int j = -2; j <= 2; j++) {
      for (int i = -2; i <= 2; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 off = vec2(
          snoise(vec3(n + g, uTime * 0.2)),
          snoise(vec3(n + g + 100.0, uTime * 0.2))
        );
        vec2 r = g - f + off;
        float d = length(r);
        if (d < md) {
          md = d;
          mc = r;
        }
      }
    }
    return vec2(md, length(mc));
  }

  void main() {
    float t = uTime * uMotionSpeed;
    vec2 uv = vUv - 0.5;

    // Domain warp for organic flow (lava lamp)
    float distort = uDistortion * (0.3 + uLow * 0.4 + uMid * 0.2 + uHigh * 0.2 + uTransient * 0.5);
    vec2 warp = vec2(
      snoise(vec3(uv * 2.5, t * 0.4)) * distort,
      snoise(vec3(uv * 2.5 + 30.0, t * 0.5 + 1.0)) * distort
    );
    uv += warp * 0.15;

    float r = length(uv) * 2.2;

    // --- SOFT CLOUDY BLOBS (lava lamp) ---
    float blob1 = snoise(vec3(uv * 2.0, t * 0.3)) * 0.5 + 0.5;
    float blob2 = snoise(vec3(uv * 3.5 + 50.0, t * 0.45 + 2.0)) * 0.5 + 0.5;
    float blob3 = snoise(vec3(uv * 5.0 + 100.0, t * 0.6 + 4.0)) * 0.5 + 0.5;
    float softBlob = (blob1 * 0.5 + blob2 * 0.35 + blob3 * 0.15);
    softBlob = smoothstep(0.35, 0.75, softBlob);
    softBlob *= (0.7 + uEnergy * 0.5 + uLow * 0.3);

    // --- HARD EDGES (voronoi cells) ---
    vec2 vor = voronoi(uv * 4.0);
    float cellEdge = 1.0 - smoothstep(0.0, 0.08 + uTransient * 0.04, vor.x);
    float cellInterior = smoothstep(0.15, 0.4, vor.y);
    float hardEdge = cellEdge * (0.4 + cellInterior * 0.6);
    hardEdge *= (0.5 + uMid * 0.4 + uHigh * 0.3);

    // --- PARTICLE ELEMENTS (twinkling dots) ---
    vec2 particleUV = uv * 25.0;
    vec2 pi = floor(particleUV);
    vec2 pf = fract(particleUV);
    float particle = 0.0;
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 cell = pi + vec2(float(i), float(j));
        float id = snoise(vec3(cell, t * 2.0)) * 0.5 + 0.5;
        vec2 offset = vec2(snoise(vec3(cell, 0.0)), snoise(vec3(cell + 10.0, 0.0))) * 0.5;
        vec2 pos = offset + vec2(float(i), float(j)) - pf;
        float d = length(pos);
        float size = 0.04 + id * 0.03 + uTransient * 0.02;
        float bright = (1.0 - smoothstep(0.0, size, d)) * (0.3 + id * 0.7);
        bright *= (0.5 + sin(t * 3.0 + id * 6.28) * 0.5);
        particle += bright * (0.6 + uHigh * 0.5 + uEnergy * 0.3);
      }
    }
    particle = min(1.0, particle);

    // --- PULSE RINGS (driven by bass) ---
    float pulse = sin(r * 6.0 - t * 2.5 - uLow * 5.0) * 0.5 + 0.5;
    pulse *= exp(-r * 1.2);
    pulse *= (uLow * 0.8 + uTransient * 0.6 + uEnergy * 0.3);

    // --- CENTER BLOOM ---
    float centerGlow = exp(-r * 1.8) * (uEnergy * 0.5 + uMid * 0.35 + uHigh * 0.2);
    centerGlow *= uBloom;

    // --- COMBINE (multi-color palette) ---
    vec3 col = uSecondary * 0.12;
    col += uPrimary * softBlob * uHazeDensity * 0.5 * uIntensity;
    col += uAccent * hardEdge * 0.6 * uIntensity;
    col += uAccent * particle * 0.9 * uIntensity;
    col += uPrimary * pulse * uIntensity * 0.7;
    col += mix(uPrimary, uAccent, 0.5) * centerGlow * uIntensity;

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
        uPrimary: { value: new THREE.Color(0.15, 0.39, 0.92) },
        uSecondary: { value: new THREE.Color(0.98, 0.45, 0.09) },
        uAccent: { value: new THREE.Color(0.89, 0.91, 0.94) },
        uIntensity: { value: 0.7 },
        uBloom: { value: 0.6 },
        uHazeDensity: { value: 0.5 },
        uDistortion: { value: 0.4 },
        uMotionSpeed: { value: 1 },
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
