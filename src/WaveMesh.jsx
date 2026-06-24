import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import './WaveMesh.css'

export default function WaveMesh() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Renderer
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setClearColor(0x111111)

    // Scene
    const scene = new THREE.Scene()

    // Camera
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
    camera.position.set(0, 1, 6)
    camera.lookAt(0, -1, 0)

    // Lighting — subtle ambient + a bright directional to highlight the mesh
    const ambient = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(3, 5, 5)
    scene.add(dirLight)

    const backLight = new THREE.DirectionalLight(0xcccccc, 0.4)
    backLight.position.set(-3, -2, -4)
    scene.add(backLight)

    // Load GLB
    const loader = new GLTFLoader()
    let meshGroup = null

    loader.load('/wave_mesh.glb', (gltf) => {
      meshGroup = gltf.scene

      // Apply bright gray material to every mesh
      meshGroup.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xd4d4d4,
            roughness: 0.45,
            metalness: 0.1,
          })
        }
      })

      // Center the model
      const box = new THREE.Box3().setFromObject(meshGroup)
      const center = box.getCenter(new THREE.Vector3())
      meshGroup.position.sub(center)

      // Scale to fit nicely
      meshGroup.scale.setScalar(0.1)

      meshGroup.rotation.y = 2

      scene.add(meshGroup)
    })

    // Resize handler
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
      const t = timer.getElapsed()

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

  return (
    <div className="wave-wrapper">
      <canvas ref={canvasRef} className="wave-canvas" />
    </div>
  )
}
