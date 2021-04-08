import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import galaxyVertexShader from './shaders/galaxy/vertex.glsl'
import galaxyFragmentShader from './shaders/galaxy/fragment.glsl'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Galaxy
 */
const parameters = {}
parameters.count = 170 * 40
parameters.size = 0.005
parameters.radius = 5
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.5
parameters.randomnessPower = 3
parameters.insideColor = '#ff6030'
parameters.outsideColor = '#1b3984'

let geometry = null
let material = null
let points = null

const generateGalaxy = () => {
    if (points !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(points)
    }

    /**
     * Geometry
     */
    geometry = new THREE.BufferGeometry()

    const positions = new Float32Array(170 * 40 * 3)
    const colors = new Float32Array(parameters.count * 3)

    for (let i = 0; i < 170; i++) {
        for (let j = 0; j < 40; j++) {
            const i3 = i * j * 3

            // Position
            const radius = Math.random() * parameters.radius

            if (i < 85) {
                positions[i3] = 4 * Math.pow(Math.sin(i / 85.0 * Math.PI), 2) + 0.1 * Math.sin(6.0 * i / 17 * Math.PI)
                positions[i3 + 1] = 4 * Math.cos(i / 85.0 * Math.PI) + 0.1 * Math.cos(6.0 * i / 17.0 * Math.PI)
                positions[i3 + 2] = 7 * Math.cos(i / 85.0 * Math.PI) + 15 * Math.sin((j - 20.0) / 40.0 * Math.PI)
            } else {
                positions[i3] = -4 * Math.pow(Math.sin((i - 85 / 85) / Math.PI), 2) + 0.1 * Math.sin(((6 * (i - 85)) / 17) * Math.PI)
                positions[i3 + 1] = -4 * Math.cos((i - 85 / 85) / Math.PI) + 0.1 * Math.cos(((6 * (i - 85)) / 17) * Math.PI)
                positions[i3 + 2] = -7 * Math.cos((i - 85 / 85) / Math.PI) + 15 * Math.sin(((j - 20) / 40) * Math.PI)
            }

            // Color
            colors[i3] = 1 - (j / 40.0) // mixedColor.r
            colors[i3 + 1] = 0 //mixedColor.g
            colors[i3 + 2] = j / 40.0 // mixedColor.b

            // Scales
            // scales[i] = Math.random()
        }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    /**
     * Material
     */

    material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: galaxyVertexShader,
        fragmentShader: galaxyFragmentShader,
        uniforms: {
            uSize: { value: 8 * renderer.getPixelRatio() },
            uTime: { value: 0 }
        }
    })

    /**
     * Points
     */
    points = new THREE.Points(geometry, material)
    scene.add(points)
}

gui.add(parameters, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(0.01).max(20).step(0.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

window.addEventListener('click', () => {
    console.log(camera.position)
})

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

generateGalaxy()

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update material
    // material.uniforms.uTime.value = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()