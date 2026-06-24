import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import './WaveMesh.css'

// ---------------------------------------------------------------------------
// Wave displacement vertex shader
// Implements the node-graph formula described in the spec:
//
// wave1 = (sin(x * xFreq1) + 1)^2 * xAmp1          (x-based, strong)
// wave2 = (sin(y * yFreq1) + 1) * 0.5               (y-based, soft)
// combo1 = wave1 * wave2
//
// wave3 = (sin(x * xFreq2 + PI) + 1)^2             (x-based, phase-shifted)
// wave4 = (sin(y * yFreq2 + PI) + 1) * yAmp2       (y-based, phase-shifted)
// combo2 = wave3 * wave4
//
// Z offset = combo1 + combo2
// ---------------------------------------------------------------------------
const vertexShader = /* glsl */`
  uniform float uTime;
  uniform float uXFreq1;
  uniform float uXFreq2;
  uniform float uXAmp1;
  uniform float uYFreq1;
  uniform float uYFreq2;
  uniform float uYAmp2;
  uniform float uSpeed;

  varying vec3 vLocalPos;

  void main() {
    vec3 pos = position;

    float t = uTime * uSpeed;

    // --- Wave component 1 (x-based, strong) ---
    float w1 = sin(pos.x * uXFreq1 + t) + 1.0;
    w1 = pow(w1, 2.0) * uXAmp1;

    // --- Wave component 2 (z-based, soft modulator) ---
    float w2 = (sin(pos.z * uYFreq1 + t) + 1.0) * 0.5;

    float combo1 = w1 * w2;

    // --- Wave component 3 (x-based, pi phase-shifted) ---
    float w3 = sin(pos.x * uXFreq2 + 3.14159265 + t) + 1.0;
    w3 = pow(w3, 2.0);

    // --- Wave component 4 (z-based, pi phase-shifted) ---
    float w4 = (sin(pos.z * uYFreq2 + 3.14159265 + t) + 1.0) * uYAmp2;

    float combo2 = w3 * w4;

    // Final Z displacement
    pos.y += combo1 + combo2;

    vLocalPos = pos;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = /* glsl */`
  uniform vec3 uColor;
  uniform vec3 uAmbient;
  uniform float uOpacity;

  varying vec3 vLocalPos;

  void main() {
    float gradient = vLocalPos.x / 80.0 + 0.5; 
    gradient = clamp(gradient, 0.0, 1.0);

    gl_FragColor = vec4(uColor * gradient + uAmbient * (1.0 - gradient), uOpacity);
  }
`

const fragmentShaderFlat = /* glsl */`
  uniform vec3 uColor;
  uniform float uOpacity;

  void main() {
    gl_FragColor = vec4(uColor, uOpacity);
  }
`

// Default parameter values
const DEFAULTS = {
  xFreq1: 0.3,
  xFreq2: 0.3,
  xAmp1:  2.0,
  yFreq1: 0.05,
  yFreq2: 0.06,
  yAmp2:  1.2,
  speed:  0.15,
}

export default function WaveMesh() {
  const canvasRef   = useRef(null)
  const paramsRef   = useRef({ ...DEFAULTS })
  const uniformsRef = useRef(null)
  const uniformsLowRef = useRef(null)

  const [params, setParams] = useState({ ...DEFAULTS })
  const [panelOpen, setPanelOpen] = useState(true)

  // Keep ref in sync with state (used inside animate loop)
  useEffect(() => {
    paramsRef.current = params
    const u = uniformsRef.current
    if (!u) return
    u.uXFreq1.value = params.xFreq1
    u.uXFreq2.value = params.xFreq2
    u.uXAmp1.value  = params.xAmp1
    u.uYFreq1.value = params.yFreq1
    u.uYFreq2.value = params.yFreq2
    u.uYAmp2.value  = params.yAmp2
    u.uSpeed.value  = params.speed

    const ul = uniformsLowRef.current
    if (!ul) return
    ul.uXFreq1.value = params.xFreq1
    ul.uXFreq2.value = params.xFreq2
    ul.uXAmp1.value  = params.xAmp1
    ul.uYFreq1.value = params.yFreq1
    ul.uYFreq2.value = params.yFreq2
    ul.uYAmp2.value  = params.yAmp2
    ul.uSpeed.value  = params.speed
  }, [params])

  const handleSlider = useCallback((key) => (e) => {
    setParams(prev => ({ ...prev, [key]: parseFloat(e.target.value) }))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({  
      canvas, 
      antialias: true,
      premultipliedAlpha: false })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x111111)

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 1, 100)
    camera.position.set(6, 2, 2)
    camera.lookAt(0, 0, 0)

    // Uniforms shared across all mesh materials
    const uniforms = {
      uTime:   { value: 0 },
      uXFreq1: { value: DEFAULTS.xFreq1 },
      uXFreq2: { value: DEFAULTS.xFreq2 },
      uXAmp1:  { value: DEFAULTS.xAmp1  },
      uYFreq1: { value: DEFAULTS.yFreq1 },
      uYFreq2: { value: DEFAULTS.yFreq2 },
      uYAmp2:  { value: DEFAULTS.yAmp2  },
      uSpeed:  { value: DEFAULTS.speed  },
      uColor:    { value: new THREE.Color(0xeeeeee) },
      uAmbient:  { value: new THREE.Color(0x494949) },
      uOpacity:  { value: 1.0 },
    }
    uniformsRef.current = uniforms

    // Uniforms for the low-poly overlay mesh (shared wave params, different look)
    const uniformsLow = {
      uTime:   { value: 0 },
      uXFreq1: { value: DEFAULTS.xFreq1 },
      uXFreq2: { value: DEFAULTS.xFreq2 },
      uXAmp1:  { value: DEFAULTS.xAmp1  },
      uYFreq1: { value: DEFAULTS.yFreq1 },
      uYFreq2: { value: DEFAULTS.yFreq2 },
      uYAmp2:  { value: DEFAULTS.yAmp2  },
      uSpeed:  { value: DEFAULTS.speed  },
      uColor:   { value: new THREE.Color(0x494949) },
      uOpacity: { value: 0.65 },
    }
    uniformsLowRef.current = uniformsLow


    // Shared transform values — derived from wave_mesh.glb, applied to both
    const sharedScale  = 0.1

    // Load GLB
    const loader = new GLTFLoader()
    
    loader.load('/wave_mesh.glb', (gltf) => {
      const meshGroup = gltf.scene

      meshGroup.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms,
            side: THREE.FrontSide,
          })
        }
      })

      meshGroup.scale.setScalar(sharedScale)
      scene.add(meshGroup)
    })

    loader.load('/wave_mesh_low.glb', (gltf) => {
      const meshGroupLow = gltf.scene

      meshGroupLow.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader: fragmentShaderFlat,
            uniforms: uniformsLow,
            transparent: true,
            side: THREE.FrontSide,
          })
        }
      })

      // Apply the exact same offset and scale as the hi-res mesh
      meshGroupLow.position.setY(- 0.05)
      meshGroupLow.scale.setScalar(sharedScale)
      scene.add(meshGroupLow)
    })

    // Resize
    function handleResize() {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    handleResize()
    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(canvas)

    // Animate
    let animId
    const timer = new THREE.Timer()

    function animate() {
      animId = requestAnimationFrame(animate)
      timer.update()
      const elapsed = timer.getElapsed()
      uniforms.uTime.value = elapsed
      uniformsLow.uTime.value = elapsed
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      resizeObserver.disconnect()
      renderer.dispose()
      timer.dispose()
    }
  }, [])

  // Slider config: [key, label, min, max, step]
  const sliders = [
    ['xFreq1', 'X Frequency 1', 0.01, 2.0,  0.01],
    ['xFreq2', 'X Frequency 2', 0.01, 2.0,  0.01],
    ['xAmp1',  'X Amplitude',   0.0,  20.0, 0.1 ],
    ['yFreq1', 'Y Frequency 1', 0.01, 1.0,  0.005],
    ['yFreq2', 'Y Frequency 2', 0.01, 1.0,  0.005],
    ['yAmp2',  'Y Amplitude 2', 0.0,  8.0,  0.1 ],
    ['speed',  'Speed',         0.0,  3.0,  0.05],
  ]

  return (
    <div className="wave-wrapper">
      <canvas ref={canvasRef} className="wave-canvas" />

      <button
        className="wave-panel-toggle"
        onClick={() => setPanelOpen(o => !o)}
        title="Toggle wave controls"
      >
        {panelOpen ? '✕' : '⚙'}
      </button>

      {panelOpen && (
        <div className="wave-panel">
          <div className="wave-panel-header">Wave Parameters</div>
          {sliders.map(([key, label, min, max, step]) => (
            <label key={key} className="wave-slider-row">
              <span className="wave-slider-label">{label}</span>
              <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={params[key]}
                onChange={handleSlider(key)}
                className="wave-slider"
              />
              <span className="wave-slider-value">{params[key].toFixed(2)}</span>
            </label>
          ))}
          <button
            className="wave-reset-btn"
            onClick={() => setParams({ ...DEFAULTS })}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}
