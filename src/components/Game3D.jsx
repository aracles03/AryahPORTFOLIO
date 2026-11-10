import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import styles from './GamePage.module.css'

const WORLD_SIZE = 900
const MOVE_SPEED = 1.3
const TURN_SPEED = 0.038
const INTERACT_RADIUS = 26
const EYE_HEIGHT = 7.5
const BOB_AMOUNT = 0.3
const BOB_SPEED = 8
const PLAYER_RADIUS = 4

// texture cache so repeated NPC/character sprites reuse the same GPU texture
THREE.Cache.enabled = true

const POIS = [
  {
    id: 'highschool', x: -220, z: -260, icon: '🏫', color: 0x4c9a4c,
    image: '/logos/education/sman7-manado.png',
    title_id: 'SMAN 7 Manado', title_en: 'SMAN 7 Manado',
    body_id: 'Aryah menghabiskan masa SMA di SMAN 7 Manado, jurusan Mathematics and Physics, dari 2022 sampai 2025. Rata-rata nilainya 93/100! Selama 3 tahun itu dia juga aktif di 2 tahun organisasi dan sudah mengerjakan 5+ project kecil-kecilan.',
    body_en: 'Aryah spent his high school years at SMAN 7 Manado, majoring in Mathematics and Physics, from 2022 to 2025, with an average score of 93/100! During those 3 years he was also active in organizations for 2 years and already worked on 5+ small projects.',
  },
  {
    id: 'college', x: 260, z: -240, icon: '🎓', color: 0x1B2A56,
    image: '/logos/education/president-university.png',
    title_id: 'President University', title_en: 'President University',
    body_id: 'Sekarang Aryah kuliah di President University, jurusan Information Technology (2025 - sekarang) dengan GPA 3.87/4.00. Udah 6+ project dan aktif di organisasi kampus juga!',
    body_en: 'Aryah is currently studying Information Technology at President University (2025 - present) with a 3.87/4.00 GPA. Already 6+ projects done and active in campus organizations too!',
  },
  {
    id: 'projects', x: 0, z: -20, icon: '💻', color: 0x6366f1,
    images: ['/projects/ombara.png', '/projects/gestabuild.png', '/projects/Mochitopia.png', '/projects/rekalimbah.png'],
    title_id: 'Karya-Karya Aryah', title_en: "Aryah's Work",
    body_id: 'Beberapa project yang udah dibikin Aryah: Ombara (100 Destinasi Wisata Indonesia), GestaBuild (gesture-based architectural builder), Mochitopia (platform quiz belajar), dan RekaLimbah (edukasi upcycling limbah). Scroll ke bagian Projects buat lihat lebih lengkap ya!',
    body_en: "Some projects Aryah has built: Ombara (100 Indonesian tourist destinations), GestaBuild (a gesture-based architectural builder), Mochitopia (a learning quiz platform), and RekaLimbah (waste-upcycling education). Scroll to the Projects section to see the full list!",
  },
  {
    id: 'skills', x: -260, z: 230, icon: '⚡', color: 0xf59e0b,
    title_id: 'Skill & Tools', title_en: 'Skills & Tools',
    body_id: 'Aryah biasa pakai React.js, Next.js, TypeScript, Node.js, Python, JavaScript, MySQL, sampai GitHub buat kerja sehari-hari. Paling jago di JavaScript & GitHub!',
    body_en: 'Aryah usually works with React.js, Next.js, TypeScript, Node.js, Python, JavaScript, MySQL, and GitHub in daily work. Strongest at JavaScript & GitHub!',
  },
  {
    id: 'quote', x: 250, z: 250, icon: '✨', color: 0xec4899,
    title_id: 'Prinsip Hidup', title_en: 'Life Motto',
    body_id: '"Aku terbatas, tapi aku memiliki Tuhan yang tak terbatas" - kalimat ini yang selalu jadi pegangan Aryah dalam menjalani hidup dan berkarya.',
    body_en: '"I am limited, but I have a God who is unlimited" - this is the quote Aryah always holds onto in life and work.',
  },
  {
    id: 'contact', x: 0, z: 320, icon: '📬', color: 0xef4444,
    title_id: 'Yuk Terhubung', title_en: "Let's Connect",
    body_id: 'Tertarik kolaborasi atau sekadar mau say hi? Scroll ke bagian Contact di halaman utama buat lihat LinkedIn, GitHub, Instagram, sampai email Aryah.',
    body_en: 'Interested in collaborating or just want to say hi? Scroll to the Contact section on the main page to find Aryah\'s LinkedIn, GitHub, Instagram, and email.',
  },
]

export { POIS }

/* ---------- procedural building-facade texture ---------- */
function buildingTexture(baseColor, winColor, cols, rows) {
  const cvs = document.createElement('canvas')
  cvs.width = 128
  cvs.height = 256
  const ctx = cvs.getContext('2d')
  ctx.fillStyle = baseColor
  ctx.fillRect(0, 0, cvs.width, cvs.height)
  const padX = cvs.width / cols
  const padY = cvs.height / rows
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = Math.random() > 0.45
      ctx.fillStyle = lit ? winColor : 'rgba(20,25,35,0.55)'
      ctx.fillRect(c * padX + padX * 0.22, r * padY + padY * 0.22, padX * 0.56, padY * 0.56)
    }
  }
  const tex = new THREE.CanvasTexture(cvs)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

function nameTagTexture(name, accent) {
  const cvs = document.createElement('canvas')
  cvs.width = 512
  cvs.height = 128
  const ctx = cvs.getContext('2d')
  ctx.clearRect(0, 0, cvs.width, cvs.height)
  const w = Math.min(420, 60 + name.length * 30)
  const x = (cvs.width - w) / 2
  ctx.fillStyle = 'rgba(15,15,20,0.78)'
  roundRect(ctx, x, 30, w, 60, 30)
  ctx.fill()
  ctx.strokeStyle = accent
  ctx.lineWidth = 4
  roundRect(ctx, x, 30, w, 60, 30)
  ctx.stroke()
  ctx.fillStyle = '#fff'
  ctx.font = '700 34px Inter, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(name, cvs.width / 2, 60)
  const tex = new THREE.CanvasTexture(cvs)
  return tex
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function poiIconTexture(icon) {
  const cvs = document.createElement('canvas')
  cvs.width = 128
  cvs.height = 128
  const ctx = cvs.getContext('2d')
  ctx.font = '82px serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(icon, 64, 70)
  return new THREE.CanvasTexture(cvs)
}

/* ---------- character built from uploaded artwork (billboard sprite) ---------- */
const CHAR_TEXTURES = { boy: '/characters/boy.png', girl: '/characters/girl.png' }
const textureLoader = new THREE.TextureLoader()

export function buildSpriteCharacter(kind, heightOverride) {
  const group = new THREE.Group()
  const targetHeight = heightOverride || 14
  const tex = textureLoader.load(CHAR_TEXTURES[kind] || CHAR_TEXTURES.boy, (loaded) => {
    const iw = loaded.image.width
    const ih = loaded.image.height
    const w = targetHeight * (iw / ih)
    sprite.scale.set(w, targetHeight, 1)
    sprite.position.y = targetHeight / 2
    shadow.scale.set(w * 0.55, w * 0.28, 1)
  })
  if ('colorSpace' in tex) tex.colorSpace = THREE.SRGBColorSpace

  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true })
  const sprite = new THREE.Sprite(mat)
  sprite.scale.set(targetHeight * 0.42, targetHeight, 1)
  sprite.position.y = targetHeight / 2
  sprite.center.set(0.5, 0)
  group.add(sprite)

  // soft contact shadow blob under the character
  const shadowTex = softCircleTexture()
  const shadow = new THREE.Sprite(new THREE.SpriteMaterial({ map: shadowTex, transparent: true, opacity: 0.35, depthWrite: false }))
  shadow.scale.set(10, 5, 1)
  shadow.position.y = 0.15
  group.add(shadow)

  group.userData.isSprite = true
  group.userData.sprite = sprite
  group.userData.spriteMat = mat
  return group
}

function softCircleTexture() {
  const cvs = document.createElement('canvas')
  cvs.width = 128
  cvs.height = 128
  const ctx = cvs.getContext('2d')
  const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  grad.addColorStop(0, 'rgba(0,0,0,0.55)')
  grad.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(cvs)
}

/* ---------- build a stylized low-poly character with articulated limbs (used for NPCs) ---------- */
export function buildCharacter(kind, scale = 0.56) {
  const group = new THREE.Group()
  const isGirl = kind === 'girl'
  const skin = new THREE.MeshStandardMaterial({ color: 0xffd4a8, roughness: 0.7 })
  const outfit = new THREE.MeshStandardMaterial({ color: isGirl ? 0xe85d9c : 0x3b6fd6, roughness: 0.6 })
  const hairMat = new THREE.MeshStandardMaterial({ color: isGirl ? 0x4a2c1c : 0x22201d, roughness: 0.8 })
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x2b2b33, roughness: 0.7 })
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 })

  // torso
  const torso = new THREE.Mesh(new THREE.CapsuleGeometry(3.4, 5.2, 4, 8), outfit)
  torso.position.y = 8.6
  torso.castShadow = true
  group.add(torso)

  // head
  const head = new THREE.Mesh(new THREE.SphereGeometry(3.1, 16, 16), skin)
  head.position.y = 15.2
  head.castShadow = true
  group.add(head)

  // hair
  if (isGirl) {
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(3.35, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.62), hairMat)
    hairCap.position.y = 15.9
    group.add(hairCap)
    const tailGeo = new THREE.CapsuleGeometry(0.9, 5, 4, 8)
    const tailL = new THREE.Mesh(tailGeo, hairMat)
    tailL.position.set(-2.6, 13, 0.5)
    tailL.rotation.z = 0.3
    group.add(tailL)
    const tailR = tailL.clone()
    tailR.position.x = 2.6
    tailR.rotation.z = -0.3
    group.add(tailR)
  } else {
    const hairCap = new THREE.Mesh(new THREE.SphereGeometry(3.25, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), hairMat)
    hairCap.position.y = 16.3
    group.add(hairCap)
  }

  // arms — hung from shoulder pivots so they can swing naturally
  const armHalf = 3.15 // half the total capsule length+radius
  const shoulderY = 9.2 + armHalf
  const armGeo = new THREE.CapsuleGeometry(0.85, 4.6, 4, 8)
  const armPivotL = new THREE.Group()
  armPivotL.position.set(-4.1, shoulderY, 0)
  const armL = new THREE.Mesh(armGeo, skin)
  armL.position.set(0, -armHalf, 0)
  armL.castShadow = true
  armPivotL.add(armL)
  group.add(armPivotL)
  const armPivotR = new THREE.Group()
  armPivotR.position.set(4.1, shoulderY, 0)
  const armR = armL.clone()
  armR.position.set(0, -armHalf, 0)
  armPivotR.add(armR)
  group.add(armPivotR)

  // legs / skirt — hung from hip pivots so they can swing when walking
  let legPivotL, legPivotR, hipY
  if (isGirl) {
    const skirt = new THREE.Mesh(new THREE.ConeGeometry(4.4, 5, 12), outfit)
    skirt.position.y = 4.6
    skirt.castShadow = true
    group.add(skirt)
    const legHalf = 2.75
    hipY = 2.2 + legHalf
    const legGeo = new THREE.CapsuleGeometry(0.95, 3.6, 4, 8)
    legPivotL = new THREE.Group()
    legPivotL.position.set(-1.5, hipY, 0)
    const legL = new THREE.Mesh(legGeo, skin)
    legL.position.set(0, -legHalf, 0)
    legPivotL.add(legL)
    group.add(legPivotL)
    legPivotR = new THREE.Group()
    legPivotR.position.set(1.5, hipY, 0)
    const legR = legL.clone()
    legR.position.set(0, -legHalf, 0)
    legPivotR.add(legR)
    group.add(legPivotR)
  } else {
    const legHalf = 3.95
    hipY = 3 + legHalf
    const legGeo = new THREE.CapsuleGeometry(1.15, 5.6, 4, 8)
    legPivotL = new THREE.Group()
    legPivotL.position.set(-1.7, hipY, 0)
    const legL = new THREE.Mesh(legGeo, pantsMat)
    legL.position.set(0, -legHalf, 0)
    legL.castShadow = true
    legPivotL.add(legL)
    group.add(legPivotL)
    legPivotR = new THREE.Group()
    legPivotR.position.set(1.7, hipY, 0)
    const legR = legL.clone()
    legR.position.set(0, -legHalf, 0)
    legPivotR.add(legR)
    group.add(legPivotR)
  }

  // shoes — attached to the hip pivots so they move with the legs
  const shoeGeo = new THREE.BoxGeometry(1.8, 1.1, 2.6)
  const shoeL = new THREE.Mesh(shoeGeo, shoeMat)
  shoeL.position.set(0, -(hipY - 0.55), 0.6)
  legPivotL.add(shoeL)
  const shoeR = shoeL.clone()
  legPivotR.add(shoeR)

  // eyes
  const eyeGeo = new THREE.SphereGeometry(0.28, 8, 8)
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x222222 })
  const eyeL = new THREE.Mesh(eyeGeo, eyeMat)
  eyeL.position.set(-1.1, 15.3, 2.85)
  group.add(eyeL)
  const eyeR = eyeL.clone()
  eyeR.position.x = 1.1
  group.add(eyeR)

  if (isGirl) {
    const bow = new THREE.Mesh(new THREE.TorusKnotGeometry(0.55, 0.22, 32, 6), new THREE.MeshStandardMaterial({ color: 0xec4899 }))
    bow.position.set(2.4, 17.4, 0.5)
    bow.scale.set(0.7, 0.7, 0.7)
    group.add(bow)
  }

  group.userData.parts = { armPivotL, armPivotR, legPivotL, legPivotR }
  group.scale.setScalar(scale)
  return group
}

export default function Game3D({ lang, playerName, onExit }) {
  const mountRef = useRef(null)
  const minimapRef = useRef(null)
  const keysRef = useRef({})
  const stateRef = useRef({
    pos: new THREE.Vector3(0, 0, 220),
    heading: Math.PI,
    walkT: 0,
  })
  const callbacksRef = useRef({})
  const nearbyRef = useRef(null)

  const [nearbyPoi, setNearbyPoi] = useState(null)
  const [openPoi, setOpenPoi] = useState(null)
  const [visited, setVisited] = useState(() => new Set())
  const [muted, setMuted] = useState(false)
  const audioEngineRef = useRef({})

  callbacksRef.current.onNearbyChange = (poi) => setNearbyPoi(poi)
  callbacksRef.current.onOpenPoi = (poi) => {
    setOpenPoi(poi)
    setVisited((prev) => new Set(prev).add(poi.id))
  }

  useEffect(() => {
    callbacksRef.current.setPaused?.(!!openPoi)
  }, [openPoi])

  // ---------- ambient city backsound (procedural, no external audio file needed) ----------
  useEffect(() => {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    const ctx = new AudioCtx()
    let hornTimer

    const master = ctx.createGain()
    master.gain.value = 0.32
    master.connect(ctx.destination)

    // distant traffic hum: filtered noise, slowly wobbling
    const bufferSize = ctx.sampleRate * 2
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true

    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'lowpass'
    noiseFilter.frequency.value = 480
    noiseFilter.Q.value = 0.6

    const noiseGain = ctx.createGain()
    noiseGain.gain.value = 0.15
    noise.connect(noiseFilter)
    noiseFilter.connect(noiseGain)
    noiseGain.connect(master)
    noise.start()

    const lfo = ctx.createOscillator()
    lfo.frequency.value = 0.06
    const lfoGain = ctx.createGain()
    lfoGain.gain.value = 110
    lfo.connect(lfoGain)
    lfoGain.connect(noiseFilter.frequency)
    lfo.start()

    // low city rumble
    const drone = ctx.createOscillator()
    drone.type = 'sine'
    drone.frequency.value = 58
    const droneGain = ctx.createGain()
    droneGain.gain.value = 0.035
    drone.connect(droneGain)
    droneGain.connect(master)
    drone.start()

    // ---------- fun looping tune, keeps the little walk lighthearted ----------
    const NOTE_FREQ = {
      C3: 130.81, F3: 174.61, G3: 196.0, A3: 220.0,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25,
    }
    const MELODY = [
      'C5', 'G4', 'E4', 'G4', 'C5', 'E5', 'D5', 'C5',
      'B4', 'D5', 'G4', 'B4', 'C5', null, 'E4', 'G4',
    ]
    const BASSLINE = ['C3', 'G3', 'A3', 'F3']

    function pluck(freq, time, dur, type, vol) {
      const osc = ctx.createOscillator()
      osc.type = type
      osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(0, time)
      g.gain.linearRampToValueAtTime(vol, time + 0.012)
      g.gain.exponentialRampToValueAtTime(0.001, time + dur)
      osc.connect(g)
      g.connect(master)
      osc.start(time)
      osc.stop(time + dur + 0.05)
    }

    const STEP_DUR = 0.27
    let melodyStep = 0
    let nextNoteTime = ctx.currentTime + 0.3
    let melodySchedulerTimer
    function melodyScheduler() {
      while (nextNoteTime < ctx.currentTime + 0.15) {
        const note = MELODY[melodyStep % MELODY.length]
        if (note) pluck(NOTE_FREQ[note], nextNoteTime, 0.32, 'triangle', 0.07)
        if (melodyStep % 4 === 0) {
          const bassNote = BASSLINE[Math.floor(melodyStep / 4) % BASSLINE.length]
          pluck(NOTE_FREQ[bassNote], nextNoteTime, STEP_DUR * 3.6, 'sine', 0.055)
        }
        nextNoteTime += STEP_DUR
        melodyStep++
      }
      melodySchedulerTimer = setTimeout(melodyScheduler, 80)
    }
    melodyScheduler()

    // occasional far-off car horn
    function playHorn() {
      const now = ctx.currentTime
      const osc = ctx.createOscillator()
      osc.type = 'square'
      osc.frequency.value = 300 + Math.random() * 70
      const hg = ctx.createGain()
      hg.gain.setValueAtTime(0, now)
      hg.gain.linearRampToValueAtTime(0.045, now + 0.06)
      hg.gain.linearRampToValueAtTime(0, now + 0.4)
      osc.connect(hg)
      hg.connect(master)
      osc.start(now)
      osc.stop(now + 0.45)
    }
    function scheduleHorn() {
      hornTimer = setTimeout(() => {
        playHorn()
        scheduleHorn()
      }, 9000 + Math.random() * 15000)
    }
    scheduleHorn()

    const resume = () => { if (ctx.state === 'suspended') ctx.resume() }
    resume()
    window.addEventListener('pointerdown', resume, { once: true })
    window.addEventListener('keydown', resume, { once: true })

    audioEngineRef.current = { ctx, master }

    return () => {
      clearTimeout(hornTimer)
      clearTimeout(melodySchedulerTimer)
      window.removeEventListener('pointerdown', resume)
      window.removeEventListener('keydown', resume)
      try { noise.stop(); lfo.stop(); drone.stop() } catch (e) { /* already stopped */ }
      ctx.close()
    }
  }, [])

  useEffect(() => {
    const master = audioEngineRef.current.master
    if (master) master.gain.value = muted ? 0 : 0.32
  }, [muted])

  useEffect(() => {
    const mount = mountRef.current
    const width = mount.clientWidth
    const height = mount.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x8fd0f0)
    scene.fog = new THREE.Fog(0x8fd0f0, 260, 640)

    const camera = new THREE.PerspectiveCamera(78, width / height, 0.1, 2000)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    // ---------- lights ----------
    const hemi = new THREE.HemisphereLight(0xbfe3ff, 0x557755, 0.9)
    scene.add(hemi)
    const sun = new THREE.DirectionalLight(0xfff2d0, 1.1)
    sun.position.set(160, 220, 80)
    sun.castShadow = true
    sun.shadow.mapSize.set(2048, 2048)
    sun.shadow.camera.left = -400
    sun.shadow.camera.right = 400
    sun.shadow.camera.top = 400
    sun.shadow.camera.bottom = -400
    sun.shadow.camera.far = 700
    scene.add(sun)

    // ---------- ground ----------
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x7fc06a, roughness: 1 })
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE), groundMat)
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // ---------- roads (cross grid) ----------
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x3a3d42, roughness: 0.95 })
    const roadNS = new THREE.Mesh(new THREE.PlaneGeometry(30, WORLD_SIZE), roadMat)
    roadNS.rotation.x = -Math.PI / 2
    roadNS.position.y = 0.02
    roadNS.receiveShadow = true
    scene.add(roadNS)
    const roadEW = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_SIZE, 30), roadMat)
    roadEW.rotation.x = -Math.PI / 2
    roadEW.position.y = 0.02
    roadEW.receiveShadow = true
    scene.add(roadEW)
    const ringRoad = new THREE.Mesh(new THREE.RingGeometry(150, 180, 4, 1), roadMat)
    ringRoad.rotation.x = -Math.PI / 2
    ringRoad.rotation.z = Math.PI / 4
    ringRoad.position.y = 0.015
    scene.add(ringRoad)

    // lane markings
    const laneMat = new THREE.MeshBasicMaterial({ color: 0xffe27a })
    for (let i = -WORLD_SIZE / 2; i < WORLD_SIZE / 2; i += 24) {
      const dashNS = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 10), laneMat)
      dashNS.rotation.x = -Math.PI / 2
      dashNS.position.set(0, 0.03, i)
      scene.add(dashNS)
      const dashEW = new THREE.Mesh(new THREE.PlaneGeometry(10, 1.2), laneMat)
      dashEW.rotation.x = -Math.PI / 2
      dashEW.position.set(i, 0.03, 0)
      scene.add(dashEW)
    }

    // sidewalks flanking the main roads
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0xb9b6ad, roughness: 1 })
    ;[-24, 24].forEach((offset) => {
      const swNS = new THREE.Mesh(new THREE.PlaneGeometry(10, WORLD_SIZE), sidewalkMat)
      swNS.rotation.x = -Math.PI / 2
      swNS.position.set(offset, 0.015, 0)
      swNS.receiveShadow = true
      scene.add(swNS)
      const swEW = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_SIZE, 10), sidewalkMat)
      swEW.rotation.x = -Math.PI / 2
      swEW.position.set(0, 0.015, offset)
      swEW.receiveShadow = true
      scene.add(swEW)
    })

    // solid obstacles the player can't walk through (filled in as buildings/houses are built)
    const collisionBoxes = []

    // street lamps along the roads
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x2b2b30, roughness: 0.6 })
    const lampGlowMat = new THREE.MeshBasicMaterial({ color: 0xfff2b8 })
    for (let i = -WORLD_SIZE / 2 + 60; i < WORLD_SIZE / 2; i += 90) {
      if (Math.abs(i) < 40) continue
      ;[[28, i], [-28, i], [i, 28], [i, -28]].forEach(([lx, lz]) => {
        const lamp = new THREE.Group()
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.6, 14, 8), lampMat)
        pole.position.y = 7
        pole.castShadow = true
        lamp.add(pole)
        const head = new THREE.Mesh(new THREE.SphereGeometry(1.3, 10, 10), lampGlowMat)
        head.position.y = 14.2
        lamp.add(head)
        lamp.position.set(lx, 0, lz)
        scene.add(lamp)
        collisionBoxes.push({ x: lx, z: lz, hw: 0.6 + PLAYER_RADIUS, hd: 0.6 + PLAYER_RADIUS })
      })
    }

    // ---------- buildings ----------
    const buildingColors = ['#5a6b8c', '#7a8aa8', '#6f5a7a', '#8a7160', '#5f7a6f', '#4f6b5c', '#8a6a8f']
    const winColors = ['#ffe9a8', '#fff4cf', '#cdeaff']
    const buildingSpots = [
      { x: -300, z: -300 }, { x: -300, z: -220 }, { x: -370, z: -140 }, { x: -370, z: -280 },
      { x: 300, z: -300 }, { x: 300, z: -220 }, { x: 370, z: -140 }, { x: 370, z: -280 },
      { x: -300, z: 300 }, { x: -300, z: 220 }, { x: -370, z: 140 },
      { x: 300, z: 300 }, { x: 300, z: 220 }, { x: 370, z: 140 },
      { x: -180, z: -350 }, { x: 180, z: -350 }, { x: -180, z: 350 }, { x: 180, z: 350 },
      { x: -420, z: -60 }, { x: 420, z: -60 }, { x: -420, z: 60 }, { x: 420, z: 60 },
      // extra infill and outer ring for a denser, taller skyline
      { x: -260, z: -190 }, { x: 260, z: -190 }, { x: -260, z: 190 }, { x: 260, z: 190 },
      { x: -100, z: -400 }, { x: 100, z: -400 }, { x: -100, z: 400 }, { x: 100, z: 400 },
      { x: -420, z: -220 }, { x: 420, z: -220 }, { x: -420, z: 220 }, { x: 420, z: 220 },
      { x: -420, z: -350 }, { x: 420, z: -350 }, { x: -420, z: 350 }, { x: 420, z: 350 },
      { x: -300, z: -400 }, { x: 300, z: -400 }, { x: -300, z: 400 }, { x: 300, z: 400 },
    ]
    buildingSpots.forEach((spot, i) => {
      const w = 32 + Math.random() * 20
      const d = 32 + Math.random() * 20
      const h = 60 + Math.random() * 160
      const baseColor = buildingColors[i % buildingColors.length]
      const winColor = winColors[i % winColors.length]
      const tex = buildingTexture(baseColor, winColor, 5, Math.max(4, Math.round(h / 22)))
      tex.repeat.set(1, 1)
      const mat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 })
      const bldg = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
      bldg.position.set(spot.x, h / 2, spot.z)
      bldg.castShadow = true
      bldg.receiveShadow = true
      scene.add(bldg)

      // roof cap
      const roof = new THREE.Mesh(new THREE.BoxGeometry(w * 1.02, 3, d * 1.02), new THREE.MeshStandardMaterial({ color: 0x2b2f36 }))
      roof.position.set(spot.x, h + 1.5, spot.z)
      scene.add(roof)

      collisionBoxes.push({ x: spot.x, z: spot.z, hw: w / 2 + PLAYER_RADIUS, hd: d / 2 + PLAYER_RADIUS })
    })

    // ---------- houses (small, near quote/contact area) ----------
    const houseSpots = [
      { x: 180, z: 180 }, { x: 220, z: 130 }, { x: -60, z: 260 }, { x: 60, z: 260 }, { x: -260, z: 60 },
    ]
    houseSpots.forEach((spot) => {
      const houseGroup = new THREE.Group()
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(26, 16, 22),
        new THREE.MeshStandardMaterial({ color: 0xd8c2a0, roughness: 0.9 })
      )
      base.position.y = 8
      base.castShadow = true
      base.receiveShadow = true
      houseGroup.add(base)
      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(20, 12, 4),
        new THREE.MeshStandardMaterial({ color: 0xa04a3a, roughness: 0.8 })
      )
      roof.position.y = 22
      roof.rotation.y = Math.PI / 4
      roof.castShadow = true
      houseGroup.add(roof)
      houseGroup.position.set(spot.x, 0, spot.z)
      scene.add(houseGroup)

      collisionBoxes.push({ x: spot.x, z: spot.z, hw: 13 + PLAYER_RADIUS, hd: 11 + PLAYER_RADIUS })
    })

    // ---------- little park / plaza with benches ----------
    const parkSpots = [{ x: -140, z: 60 }, { x: 140, z: -80 }]
    parkSpots.forEach((spot) => {
      const grass = new THREE.Mesh(
        new THREE.CircleGeometry(26, 24),
        new THREE.MeshStandardMaterial({ color: 0x8fcf72, roughness: 1 })
      )
      grass.rotation.x = -Math.PI / 2
      grass.position.set(spot.x, 0.02, spot.z)
      grass.receiveShadow = true
      scene.add(grass)

      const fountainBase = new THREE.Mesh(
        new THREE.CylinderGeometry(6, 6.6, 2.2, 20),
        new THREE.MeshStandardMaterial({ color: 0xb9b6ad, roughness: 0.8 })
      )
      fountainBase.position.set(spot.x, 1.1, spot.z)
      fountainBase.castShadow = true
      scene.add(fountainBase)
      const fountainWater = new THREE.Mesh(
        new THREE.CylinderGeometry(4.6, 4.6, 0.4, 20),
        new THREE.MeshStandardMaterial({ color: 0x7ec7e8, roughness: 0.2, metalness: 0.2 })
      )
      fountainWater.position.set(spot.x, 2.3, spot.z)
      scene.add(fountainWater)

      // benches around the plaza
      for (let a = 0; a < 3; a++) {
        const ang = (a / 3) * Math.PI * 2 + 0.6
        const bx = spot.x + Math.cos(ang) * 17
        const bz = spot.z + Math.sin(ang) * 17
        const bench = new THREE.Group()
        const seat = new THREE.Mesh(new THREE.BoxGeometry(7, 0.6, 2.2), new THREE.MeshStandardMaterial({ color: 0x8a5a34 }))
        seat.position.y = 2.2
        bench.add(seat)
        const back = new THREE.Mesh(new THREE.BoxGeometry(7, 2, 0.5), new THREE.MeshStandardMaterial({ color: 0x8a5a34 }))
        back.position.set(0, 3.4, -0.9)
        bench.add(back)
        bench.position.set(bx, 0, bz)
        bench.rotation.y = -ang
        bench.castShadow = true
        scene.add(bench)
      }
      collisionBoxes.push({ x: spot.x, z: spot.z, hw: 6.5 + PLAYER_RADIUS, hd: 6.5 + PLAYER_RADIUS })
    })

    // ---------- perimeter shield walls (glowing blue barrier marking the map edge) ----------
    const shields = []
    const shieldHeight = 55
    const shieldEdge = WORLD_SIZE / 2 - 6
    function makeShieldWall(x, z, rotY, length) {
      const mat = new THREE.MeshStandardMaterial({
        color: 0x2f6fed,
        transparent: true,
        opacity: 0.2,
        emissive: 0x3b82f6,
        emissiveIntensity: 0.7,
        side: THREE.DoubleSide,
        depthWrite: false,
      })
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(length, shieldHeight), mat)
      wall.position.set(x, shieldHeight / 2, z)
      wall.rotation.y = rotY
      scene.add(wall)
      // bright top edge line for a clearer "energy shield" silhouette
      const rim = new THREE.Mesh(
        new THREE.PlaneGeometry(length, 1.4),
        new THREE.MeshBasicMaterial({ color: 0x8fc4ff, transparent: true, opacity: 0.85, side: THREE.DoubleSide })
      )
      rim.position.set(x, shieldHeight, z)
      rim.rotation.y = rotY
      scene.add(rim)
      shields.push(wall)
    }
    const shieldLen = WORLD_SIZE - 10
    makeShieldWall(0, -shieldEdge, 0, shieldLen)
    makeShieldWall(0, shieldEdge, 0, shieldLen)
    makeShieldWall(-shieldEdge, 0, Math.PI / 2, shieldLen)
    makeShieldWall(shieldEdge, 0, Math.PI / 2, shieldLen)
    // hard collision so the player physically can't walk through the shield
    collisionBoxes.push({ x: 0, z: -shieldEdge, hw: WORLD_SIZE, hd: 3 })
    collisionBoxes.push({ x: 0, z: shieldEdge, hw: WORLD_SIZE, hd: 3 })
    collisionBoxes.push({ x: -shieldEdge, z: 0, hw: 3, hd: WORLD_SIZE })
    collisionBoxes.push({ x: shieldEdge, z: 0, hw: 3, hd: WORLD_SIZE })

    // ---------- cars ----------
    const carColors = [0xef4444, 0x3b82f6, 0xf59e0b, 0x22c55e, 0xffffff]
    const cars = []
    for (let i = 0; i < 8; i++) {
      const car = new THREE.Group()
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(9, 3.6, 18),
        new THREE.MeshStandardMaterial({ color: carColors[i % carColors.length], roughness: 0.4, metalness: 0.3 })
      )
      body.position.y = 3
      body.castShadow = true
      car.add(body)
      const cabin = new THREE.Mesh(
        new THREE.BoxGeometry(7, 3, 9),
        new THREE.MeshStandardMaterial({ color: 0xdbeeff, roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.75 })
      )
      cabin.position.set(0, 5.6, -1)
      car.add(cabin)
      const wheelGeo = new THREE.CylinderGeometry(1.7, 1.7, 1.6, 12)
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111 })
      ;[[-4.2, 1.5, 6], [4.2, 1.5, 6], [-4.2, 1.5, -6], [4.2, 1.5, -6]].forEach(([wx, wy, wz]) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat)
        wheel.rotation.z = Math.PI / 2
        wheel.position.set(wx, wy, wz)
        car.add(wheel)
      })
      const onNS = i % 2 === 0
      const lane = (Math.random() > 0.5 ? 1 : -1) * 8
      if (onNS) {
        car.position.set(lane, 0, -350 + i * 90)
        car.rotation.y = lane > 0 ? Math.PI : 0
      } else {
        car.position.set(-350 + i * 90, 0, lane)
        car.rotation.y = lane > 0 ? -Math.PI / 2 : Math.PI / 2
      }
      scene.add(car)
      cars.push({ mesh: car, axis: onNS ? 'z' : 'x', dir: lane > 0 ? -1 : 1, speed: 8 + Math.random() * 6 })
    }

    // ---------- trees scattered ----------
    for (let i = 0; i < 130; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 55 + Math.random() * 390
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      if (Math.abs(x) < 20 || Math.abs(z) < 20) continue
      const tree = new THREE.Group()
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.7, 9, 6), new THREE.MeshStandardMaterial({ color: 0x8a5a34 }))
      trunk.position.y = 4.5
      trunk.castShadow = true
      tree.add(trunk)
      const leaves = new THREE.Mesh(new THREE.IcosahedronGeometry(7.2, 0), new THREE.MeshStandardMaterial({ color: 0x3f8a3f, flatShading: true }))
      leaves.position.y = 13
      leaves.castShadow = true
      tree.add(leaves)
      tree.position.set(x, 0, z)
      const treeScale = 1.0 + Math.random() * 0.6
      tree.scale.setScalar(treeScale)
      scene.add(tree)
      const trunkR = 1.7 * treeScale
      collisionBoxes.push({ x, z, hw: trunkR + PLAYER_RADIUS, hd: trunkR + PLAYER_RADIUS })
    }

    // ---------- bushes scattered ----------
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 40 + Math.random() * 400
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      if (Math.abs(x) < 22 || Math.abs(z) < 22) continue
      const bushR = 2.2 + Math.random() * 1.4
      const bush = new THREE.Mesh(
        new THREE.IcosahedronGeometry(bushR, 0),
        new THREE.MeshStandardMaterial({ color: 0x4f9a4f, flatShading: true })
      )
      bush.position.set(x, 1.6, z)
      bush.castShadow = true
      scene.add(bush)
      collisionBoxes.push({ x, z, hw: bushR * 0.8 + PLAYER_RADIUS, hd: bushR * 0.8 + PLAYER_RADIUS })
    }

    // ---------- flower planters scattered near sidewalks ----------
    const petalColors = [0xef476f, 0xffd166, 0xf78fb3, 0xffffff]
    for (let i = 0; i < 38; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 45 + Math.random() * 340
      const x = Math.cos(angle) * r
      const z = Math.sin(angle) * r
      if (Math.abs(x) < 20 || Math.abs(z) < 20) continue
      const planter = new THREE.Group()
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.3, 1.4, 10), new THREE.MeshStandardMaterial({ color: 0x8a6a55 }))
      pot.position.y = 0.7
      planter.add(pot)
      for (let f = 0; f < 5; f++) {
        const flower = new THREE.Mesh(new THREE.SphereGeometry(0.55, 6, 6), new THREE.MeshStandardMaterial({ color: petalColors[(i + f) % petalColors.length], flatShading: true }))
        flower.position.set((Math.random() - 0.5) * 2, 1.6 + Math.random() * 0.4, (Math.random() - 0.5) * 2)
        planter.add(flower)
      }
      planter.position.set(x, 0, z)
      scene.add(planter)
      collisionBoxes.push({ x, z, hw: 1.6 + PLAYER_RADIUS * 0.5, hd: 1.6 + PLAYER_RADIUS * 0.5 })
    }

    // ---------- small food carts / kiosks scattered around, extra street life ----------
    function makeFoodCart(x, z, rotY, awningColor) {
      const cart = new THREE.Group()
      const body = new THREE.Mesh(new THREE.BoxGeometry(6, 3.4, 3.4), new THREE.MeshStandardMaterial({ color: 0xf4e4c1 }))
      body.position.y = 2.2
      body.castShadow = true
      cart.add(body)
      const awning = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.6, 1.2, 6, 1, true, 0, Math.PI), new THREE.MeshStandardMaterial({ color: awningColor, side: THREE.DoubleSide }))
      awning.rotation.z = Math.PI / 2
      awning.rotation.y = Math.PI / 2
      awning.position.set(0, 4.4, 0)
      awning.scale.set(1, 1, 1.05)
      cart.add(awning)
      const wheelGeo = new THREE.CylinderGeometry(0.7, 0.7, 0.4, 10)
      const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222 })
      ;[-2.4, 2.4].forEach((wx) => {
        const wheel = new THREE.Mesh(wheelGeo, wheelMat)
        wheel.rotation.x = Math.PI / 2
        wheel.position.set(wx, 0.7, 1.8)
        cart.add(wheel)
      })
      cart.position.set(x, 0, z)
      cart.rotation.y = rotY
      scene.add(cart)
      collisionBoxes.push({ x, z, hw: 4 + PLAYER_RADIUS * 0.4, hd: 3 + PLAYER_RADIUS * 0.4 })
    }
    makeFoodCart(52, -180, -Math.PI / 2, 0xef4444)
    makeFoodCart(-52, 200, Math.PI / 2, 0xf59e0b)
    makeFoodCart(200, 52, Math.PI, 0x22c55e)
    makeFoodCart(-260, -40, 0, 0x3b82f6)

    // ---------- helper: build a simple street bench ----------
    function makeBench(x, z, rotY) {
      const bench = new THREE.Group()
      const seat = new THREE.Mesh(new THREE.BoxGeometry(7, 0.6, 2.2), new THREE.MeshStandardMaterial({ color: 0x8a5a34 }))
      seat.position.y = 2.2
      seat.castShadow = true
      bench.add(seat)
      const back = new THREE.Mesh(new THREE.BoxGeometry(7, 2, 0.5), new THREE.MeshStandardMaterial({ color: 0x8a5a34 }))
      back.position.set(0, 3.4, -0.9)
      back.castShadow = true
      bench.add(back)
      bench.position.set(x, 0, z)
      bench.rotation.y = rotY
      scene.add(bench)
      collisionBoxes.push({ x, z, hw: 4 + PLAYER_RADIUS * 0.4, hd: 2 + PLAYER_RADIUS * 0.4 })
      return bench
    }

    // extra benches dotted along the sidewalks / plazas (used by sitting NPCs below)
    const sidewalkBenchSpots = [
      { x: 40, z: -140, rot: Math.PI / 2 },
      { x: -40, z: 120, rot: -Math.PI / 2 },
      { x: 300, z: -140, rot: 0 },
      { x: -300, z: 160, rot: Math.PI },
      { x: 40, z: 300, rot: Math.PI / 2 },
      { x: -180, z: -60, rot: 0 },
      { x: -40, z: -220, rot: -Math.PI / 2 },
      { x: 40, z: 200, rot: Math.PI / 2 },
      { x: 220, z: 40, rot: 0 },
      { x: -220, z: -40, rot: Math.PI },
      { x: -300, z: -160, rot: 0 },
      { x: 300, z: 160, rot: Math.PI },
    ]
    sidewalkBenchSpots.forEach((s) => makeBench(s.x, s.z, s.rot))

    /* =====================================================================
       NPCs — passerby, sitting friends, and couples on a date, so the town
       actually feels lived-in instead of empty. Built from the low-poly
       articulated body (same rig as the character preview) so arms and
       legs can actually swing while they walk.
    ===================================================================== */
    const npcs = []
    const NPC_SCALE = 0.5
    // hip pivot height (unscaled) baked into buildCharacter's rig, used to plant feet on the ground / bench
    const HIP_Y = { boy: 6.95, girl: 4.95 }

    function makeNpcBody(kind, scaleJitter = 1) {
      const body = buildCharacter(kind, NPC_SCALE * scaleJitter)
      scene.add(body)
      return body
    }

    function faceDirection(mesh, dx, dz) {
      if (dx === 0 && dz === 0) return
      mesh.rotation.y = Math.atan2(dx, dz)
    }

    // -- walkers: stroll back and forth along a short path on the sidewalks --
    const walkerPaths = [
      [{ x: -24, z: -380 }, { x: -24, z: -60 }],
      [{ x: 24, z: -60 }, { x: 24, z: -380 }],
      [{ x: -24, z: 60 }, { x: -24, z: 380 }],
      [{ x: 24, z: 380 }, { x: 24, z: 60 }],
      [{ x: -380, z: 24 }, { x: -60, z: 24 }],
      [{ x: -60, z: -24 }, { x: -380, z: -24 }],
      [{ x: 60, z: 24 }, { x: 380, z: 24 }],
      [{ x: 380, z: -24 }, { x: 60, z: -24 }],
      [{ x: -240, z: -270 }, { x: -160, z: -250 }],
      [{ x: 200, z: -260 }, { x: 300, z: -230 }],
      [{ x: -280, z: 200 }, { x: -220, z: 280 }],
      [{ x: 200, z: 200 }, { x: 280, z: 260 }],
      [{ x: -24, z: -140 }, { x: -24, z: 140 }],
      [{ x: 24, z: 140 }, { x: 24, z: -140 }],
      [{ x: -140, z: -24 }, { x: 140, z: -24 }],
      [{ x: 140, z: 24 }, { x: -140, z: 24 }],
      [{ x: -320, z: 24 }, { x: -320, z: -80 }],
      [{ x: 320, z: -24 }, { x: 320, z: 80 }],
      [{ x: 24, z: -320 }, { x: -80, z: -320 }],
      [{ x: -24, z: 320 }, { x: 80, z: 320 }],
      [{ x: -160, z: -60 }, { x: -60, z: -160 }],
      [{ x: 160, z: 60 }, { x: 60, z: 160 }],
      [{ x: -370, z: -260 }, { x: -280, z: -260 }],
      [{ x: 280, z: 260 }, { x: 370, z: 260 }],
    ]
    walkerPaths.forEach((path, i) => {
      const kind = i % 2 === 0 ? 'boy' : 'girl'
      const body = makeNpcBody(kind, 0.9 + Math.random() * 0.22)
      body.position.set(path[0].x, 0, path[0].z)
      faceDirection(body, path[1].x - path[0].x, path[1].z - path[0].z)
      npcs.push({
        mesh: body, parts: body.userData.parts, mode: 'walk', a: path[0], b: path[1],
        t: Math.random(), speed: 0.05 + Math.random() * 0.025, dir: 1,
        walkPhase: Math.random() * Math.PI * 2,
      })
    })

    // helper: pose a body sitting on a bench (hips dropped to seat height, legs bent forward)
    function seatNpc(body, kind, x, z, faceRotY) {
      const hipWorld = HIP_Y[kind] * NPC_SCALE
      body.position.set(x, 2.5 - hipWorld, z)
      body.rotation.y = faceRotY
      const { legPivotL, legPivotR, armPivotL, armPivotR } = body.userData.parts
      legPivotL.rotation.x = -1.25
      legPivotR.rotation.x = -1.25
      armPivotL.rotation.x = -0.2
      armPivotR.rotation.x = -0.2
    }

    // -- solo sitters: someone chilling alone on a bench --
    const soloSitSpots = [
      { x: sidewalkBenchSpots[0].x, z: sidewalkBenchSpots[0].z - 1.4, rot: sidewalkBenchSpots[0].rot },
      { x: sidewalkBenchSpots[2].x, z: sidewalkBenchSpots[2].z - 1.4, rot: sidewalkBenchSpots[2].rot },
      { x: sidewalkBenchSpots[4].x, z: sidewalkBenchSpots[4].z - 1.4, rot: sidewalkBenchSpots[4].rot },
      { x: sidewalkBenchSpots[6].x, z: sidewalkBenchSpots[6].z - 1.4, rot: sidewalkBenchSpots[6].rot },
      { x: sidewalkBenchSpots[8].x, z: sidewalkBenchSpots[8].z - 1.4, rot: sidewalkBenchSpots[8].rot },
      { x: sidewalkBenchSpots[10].x, z: sidewalkBenchSpots[10].z - 1.4, rot: sidewalkBenchSpots[10].rot },
    ]
    soloSitSpots.forEach((s, i) => {
      const kind = i % 2 === 0 ? 'girl' : 'boy'
      const body = makeNpcBody(kind, 0.95)
      seatNpc(body, kind, s.x, s.z, s.rot)
      npcs.push({ mesh: body, mode: 'sit', baseY: body.position.y, bobPhase: Math.random() * Math.PI * 2 })
    })

    // -- couples on a date: two NPCs sitting close together, or strolling side by side --
    const parkSpotsForCouples = [{ x: -140, z: 60, benchAngle: 0.6 }, { x: 140, z: -80, benchAngle: 0.6 + (2 / 3) * Math.PI }]
    parkSpotsForCouples.forEach((spot) => {
      const ang = spot.benchAngle
      const bx = spot.x + Math.cos(ang) * 17
      const bz = spot.z + Math.sin(ang) * 17
      const faceRot = -ang
      const along = new THREE.Vector3(Math.cos(faceRot + Math.PI / 2), 0, Math.sin(faceRot + Math.PI / 2))
      const boy = makeNpcBody('boy', 0.98)
      const girl = makeNpcBody('girl', 0.9)
      seatNpc(boy, 'boy', bx - along.x * 1.7, bz - along.z * 1.7, faceRot)
      seatNpc(girl, 'girl', bx + along.x * 1.7, bz + along.z * 1.7, faceRot)
      npcs.push({ mesh: boy, mode: 'sit', baseY: boy.position.y, bobPhase: Math.random() * Math.PI * 2 })
      npcs.push({ mesh: girl, mode: 'sit', baseY: girl.position.y, bobPhase: Math.random() * Math.PI * 2 + 1 })
    })

    // one more couple sharing a sidewalk bench (bench index 7, not used by solo sitters)
    {
      const b = sidewalkBenchSpots[7]
      const along = new THREE.Vector3(Math.cos(b.rot), 0, Math.sin(b.rot))
      const boy = makeNpcBody('boy', 0.98)
      const girl = makeNpcBody('girl', 0.9)
      seatNpc(boy, 'boy', b.x - along.x * 1.7, b.z - 1.4 - along.z * 1.7, b.rot)
      seatNpc(girl, 'girl', b.x + along.x * 1.7, b.z - 1.4 + along.z * 1.7, b.rot)
      npcs.push({ mesh: boy, mode: 'sit', baseY: boy.position.y, bobPhase: Math.random() * Math.PI * 2 })
      npcs.push({ mesh: girl, mode: 'sit', baseY: girl.position.y, bobPhase: Math.random() * Math.PI * 2 + 1 })
    }

    // strolling couples, walking the same path together, side by side (pacaran jalan-jalan)
    function makeStrollCouple(p1, p2, offset = 3) {
      const dx = p2.x - p1.x, dz = p2.z - p1.z
      const len = Math.hypot(dx, dz) || 1
      const perpX = (-dz / len) * offset, perpZ = (dx / len) * offset
      const boy = makeNpcBody('boy', 1.05)
      const girl = makeNpcBody('girl', 0.95)
      const boyPath = [{ x: p1.x - perpX, z: p1.z - perpZ }, { x: p2.x - perpX, z: p2.z - perpZ }]
      const girlPath = [{ x: p1.x + perpX, z: p1.z + perpZ }, { x: p2.x + perpX, z: p2.z + perpZ }]
      boy.position.set(boyPath[0].x, 0, boyPath[0].z)
      girl.position.set(girlPath[0].x, 0, girlPath[0].z)
      faceDirection(boy, boyPath[1].x - boyPath[0].x, boyPath[1].z - boyPath[0].z)
      faceDirection(girl, girlPath[1].x - girlPath[0].x, girlPath[1].z - girlPath[0].z)
      npcs.push({ mesh: boy, parts: boy.userData.parts, mode: 'walk', a: boyPath[0], b: boyPath[1], t: 0, speed: 0.032, dir: 1, walkPhase: 0 })
      npcs.push({ mesh: girl, parts: girl.userData.parts, mode: 'walk', a: girlPath[0], b: girlPath[1], t: 0, speed: 0.032, dir: 1, walkPhase: 0.5 })
    }
    makeStrollCouple({ x: -60, z: -400 }, { x: 60, z: -400 })
    makeStrollCouple({ x: 380, z: -80 }, { x: 380, z: 80 })
    makeStrollCouple({ x: -60, z: 400 }, { x: -180, z: 400 })

    // ---------- drifting clouds ----------
    const cloudMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: 0.9 })
    const clouds = []
    for (let i = 0; i < 14; i++) {
      const cloud = new THREE.Group()
      const puffs = 3 + Math.floor(Math.random() * 3)
      for (let p = 0; p < puffs; p++) {
        const puff = new THREE.Mesh(new THREE.SphereGeometry(8 + Math.random() * 6, 8, 8), cloudMat)
        puff.position.set(p * 10 - puffs * 4, Math.random() * 3, Math.random() * 6)
        cloud.add(puff)
      }
      cloud.position.set((Math.random() - 0.5) * WORLD_SIZE * 1.3, 140 + Math.random() * 60, (Math.random() - 0.5) * WORLD_SIZE * 1.3)
      scene.add(cloud)
      clouds.push({ mesh: cloud, speed: 1.5 + Math.random() * 2 })
    }

    // ---------- POI beacons ----------
    const poiMeshes = []
    POIS.forEach((poi) => {
      const group = new THREE.Group()
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 40, 8),
        new THREE.MeshBasicMaterial({ color: poi.color, transparent: true, opacity: 0.5 })
      )
      beam.position.y = 20
      group.add(beam)
      const ring = new THREE.Mesh(new THREE.RingGeometry(6, 7.2, 24), new THREE.MeshBasicMaterial({ color: poi.color, side: THREE.DoubleSide, transparent: true, opacity: 0.6 }))
      ring.rotation.x = -Math.PI / 2
      ring.position.y = 0.1
      group.add(ring)
      const iconTex = poiIconTexture(poi.icon)
      const iconMat = new THREE.SpriteMaterial({ map: iconTex, transparent: true })
      const iconSprite = new THREE.Sprite(iconMat)
      iconSprite.scale.set(12, 12, 1)
      iconSprite.position.y = 42
      group.add(iconSprite)
      group.position.set(poi.x, 0, poi.z)
      scene.add(group)
      poiMeshes.push({ ...poi, group, iconSprite, baseY: 42 })
    })

    // ---------- player (first-person: no visible body, camera IS the character's eyes) ----------
    const player = new THREE.Object3D()
    player.position.copy(stateRef.current.pos)
    player.rotation.y = stateRef.current.heading
    // not added to the scene on purpose - we look through the character's eyes, we don't see them

    camera.position.set(player.position.x, EYE_HEIGHT, player.position.z)
    camera.lookAt(
      player.position.x + Math.sin(stateRef.current.heading) * 10,
      EYE_HEIGHT,
      player.position.z + Math.cos(stateRef.current.heading) * 10
    )

    // ---------- input ----------
    function onKeyDown(e) {
      keysRef.current[e.key.toLowerCase()] = true
      if (e.key.toLowerCase() === 'e' || e.key === 'Enter') {
        callbacksRef.current.interact?.()
      }
    }
    function onKeyUp(e) { keysRef.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    callbacksRef.current.setKey = (key, val) => { keysRef.current[key] = val }
    callbacksRef.current.interact = () => {
      if (nearbyRef.current) {
        callbacksRef.current.onOpenPoi?.(nearbyRef.current)
      }
    }

    // ---------- animation loop ----------
    let rafId
    let paused = false
    callbacksRef.current.setPaused = (v) => { paused = v }

    function resolveCollisions(x, z) {
      let px = x
      let pz = z
      for (const box of collisionBoxes) {
        const minX = box.x - box.hw, maxX = box.x + box.hw
        const minZ = box.z - box.hd, maxZ = box.z + box.hd
        if (px > minX && px < maxX && pz > minZ && pz < maxZ) {
          const penLeft = px - minX
          const penRight = maxX - px
          const penTop = pz - minZ
          const penBottom = maxZ - pz
          const minPen = Math.min(penLeft, penRight, penTop, penBottom)
          if (minPen === penLeft) px = minX
          else if (minPen === penRight) px = maxX
          else if (minPen === penTop) pz = minZ
          else pz = maxZ
        }
      }
      return { x: px, z: pz }
    }

    // moving obstacles (cars, NPCs) aren't static boxes — push the player out with a simple circle check instead
    function resolveDynamicCollisions(x, z) {
      let px = x
      let pz = z
      const carRadius = 11 + PLAYER_RADIUS
      cars.forEach((c) => {
        const dx = px - c.mesh.position.x
        const dz = pz - c.mesh.position.z
        const dist = Math.hypot(dx, dz)
        if (dist < carRadius && dist > 0.0001) {
          const push = carRadius - dist
          px += (dx / dist) * push
          pz += (dz / dist) * push
        }
      })
      const npcRadius = 3.4 + PLAYER_RADIUS
      npcs.forEach((npc) => {
        const dx = px - npc.mesh.position.x
        const dz = pz - npc.mesh.position.z
        const dist = Math.hypot(dx, dz)
        if (dist < npcRadius && dist > 0.0001) {
          const push = npcRadius - dist
          px += (dx / dist) * push
          pz += (dz / dist) * push
        }
      })
      return { x: px, z: pz }
    }

    const camPos = camera.position.clone()
    const clock = new THREE.Clock()

    const MAP_SIZE = 168
    callbacksRef.current.drawMinimap = (st) => {
      const cvs = minimapRef.current
      if (!cvs) return
      const ctx = cvs.getContext('2d')
      const size = MAP_SIZE
      const scale = size / WORLD_SIZE
      const toMap = (x, z) => [size / 2 + x * scale, size / 2 + z * scale]

      ctx.clearRect(0, 0, size, size)
      ctx.save()
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2)
      ctx.clip()

      ctx.fillStyle = '#6fae52'
      ctx.fillRect(0, 0, size, size)

      // roads
      ctx.strokeStyle = 'rgba(40,42,48,0.85)'
      ctx.lineWidth = 30 * scale
      ctx.beginPath(); ctx.moveTo(size / 2, 0); ctx.lineTo(size / 2, size); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(0, size / 2); ctx.lineTo(size, size / 2); ctx.stroke()

      // buildings / houses / plaza
      ctx.fillStyle = 'rgba(255,255,255,0.55)'
      collisionBoxes.forEach((b) => {
        const [bx, bz] = toMap(b.x, b.z)
        ctx.fillRect(bx - b.hw * scale, bz - b.hd * scale, b.hw * 2 * scale, b.hd * 2 * scale)
      })

      // POIs
      POIS.forEach((poi) => {
        const [px, pz] = toMap(poi.x, poi.z)
        ctx.beginPath()
        ctx.fillStyle = `#${poi.color.toString(16).padStart(6, '0')}`
        ctx.arc(px, pz, 4, 0, Math.PI * 2)
        ctx.fill()
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(255,255,255,0.9)'
        ctx.stroke()
      })

      ctx.restore()
      // ring border
      ctx.beginPath()
      ctx.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(255,255,255,0.55)'
      ctx.lineWidth = 2
      ctx.stroke()

      // player marker (arrow), always pointing the way the character is actually facing
      const [ppx, ppz] = toMap(st.pos.x, st.pos.z)
      ctx.save()
      ctx.translate(ppx, ppz)
      ctx.rotate(Math.PI - st.heading)
      ctx.beginPath()
      ctx.moveTo(0, -7)
      ctx.lineTo(5, 6)
      ctx.lineTo(0, 3)
      ctx.lineTo(-5, 6)
      ctx.closePath()
      ctx.fillStyle = '#fff'
      ctx.fill()
      ctx.strokeStyle = '#6366f1'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()
    }

    function animate() {
      rafId = requestAnimationFrame(animate)
      const dt = Math.min(clock.getDelta(), 0.05)
      const keys = keysRef.current
      const st = stateRef.current

      if (!paused) {
        let turn = 0
        if (keys['a'] || keys['arrowleft']) turn += 1
        if (keys['d'] || keys['arrowright']) turn -= 1
        st.heading += turn * TURN_SPEED * 60 * dt

        let move = 0
        if (keys['w'] || keys['arrowup']) move += 1
        if (keys['s'] || keys['arrowdown']) move -= 1

        if (move !== 0) {
          const nx = st.pos.x + Math.sin(st.heading) * move * MOVE_SPEED * 60 * dt
          const nz = st.pos.z + Math.cos(st.heading) * move * MOVE_SPEED * 60 * dt
          const resolved = resolveCollisions(nx, nz)
          const resolvedDyn = resolveDynamicCollisions(resolved.x, resolved.z)
          st.pos.x = Math.max(-WORLD_SIZE / 2 + 20, Math.min(WORLD_SIZE / 2 - 20, resolvedDyn.x))
          st.pos.z = Math.max(-WORLD_SIZE / 2 + 20, Math.min(WORLD_SIZE / 2 - 20, resolvedDyn.z))
          st.walkT += dt * BOB_SPEED
        }

        player.position.set(st.pos.x, 0, st.pos.z)
        player.rotation.y = st.heading

        // first-person camera: sits exactly at the character's eyes, looks the same
        // direction the character walks in, and turns with them (fixes the old "W walks backward" bug)
        const bob = move !== 0 ? Math.abs(Math.sin(st.walkT)) * BOB_AMOUNT : 0
        camPos.x = st.pos.x
        camPos.z = st.pos.z
        camPos.y += (EYE_HEIGHT + bob - camPos.y) * 0.4
        camera.position.copy(camPos)
        camera.lookAt(
          camPos.x + Math.sin(st.heading) * 10,
          camPos.y,
          camPos.z + Math.cos(st.heading) * 10
        )

        // proximity check
        let found = null
        for (const poi of poiMeshes) {
          const d = Math.hypot(poi.x - st.pos.x, poi.z - st.pos.z)
          if (d < INTERACT_RADIUS) { found = poi; break }
        }
        if (found?.id !== nearbyRef.current?.id) {
          nearbyRef.current = found
          callbacksRef.current.onNearbyChange?.(found)
        }

        // cars driving loop
        const t = performance.now() / 1000
        cars.forEach((c) => {
          const range = 300
          if (c.axis === 'z') {
            c.mesh.position.z = ((c.mesh.position.z + c.dir * c.speed * dt + range) % (range * 2)) - range
          } else {
            c.mesh.position.x = ((c.mesh.position.x + c.dir * c.speed * dt + range) % (range * 2)) - range
          }
        })

        // NPCs: walkers stroll their path with swinging arms/legs, sitters idle-sway gently
        npcs.forEach((npc) => {
          if (npc.mode === 'walk') {
            npc.t += npc.speed * npc.dir * dt
            if (npc.t >= 1) { npc.t = 1; npc.dir = -1 }
            if (npc.t <= 0) { npc.t = 0; npc.dir = 1 }
            npc.mesh.position.x = npc.a.x + (npc.b.x - npc.a.x) * npc.t
            npc.mesh.position.z = npc.a.z + (npc.b.z - npc.a.z) * npc.t
            const fdx = (npc.b.x - npc.a.x) * npc.dir
            const fdz = (npc.b.z - npc.a.z) * npc.dir
            faceDirection(npc.mesh, fdx, fdz)
            npc.walkPhase += dt * 7
            const swing = Math.sin(npc.walkPhase) * 0.55
            if (npc.parts) {
              npc.parts.legPivotL.rotation.x = swing
              npc.parts.legPivotR.rotation.x = -swing
              npc.parts.armPivotL.rotation.x = -swing * 0.85
              npc.parts.armPivotR.rotation.x = swing * 0.85
            }
          } else if (npc.mode === 'sit') {
            npc.mesh.position.y = npc.baseY + Math.sin(t * 1.4 + npc.bobPhase) * 0.15
          }
        })

        // shield walls pulse gently, like an energy barrier
        shields.forEach((s, i) => {
          s.material.opacity = 0.14 + Math.abs(Math.sin(t * 0.7 + i * 0.8)) * 0.14
        })

        // clouds drifting across the sky
        clouds.forEach((c) => {
          const range = WORLD_SIZE * 0.75
          c.mesh.position.x = ((c.mesh.position.x + c.speed * dt + range) % (range * 2)) - range
        })

        // poi bob + rotate
        poiMeshes.forEach((poi, i) => {
          poi.iconSprite.position.y = poi.baseY + Math.sin(t * 2 + i) * 2
          poi.group.children[1].rotation.z = t * 0.5
        })

        callbacksRef.current.drawMinimap?.(st)
      }

      renderer.render(scene, camera)
    }
    animate()

    function onResize() {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', onResize)

    callbacksRef.current.cleanup = () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement)
    }

    return () => callbacksRef.current.cleanup?.()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerName])

  function setDir(dir, pressed) {
    callbacksRef.current.setKey?.(dir, pressed)
  }
  function tryInteract() {
    callbacksRef.current.interact?.()
  }

  const visitedCount = visited.size

  return (
    <div className={styles.playWrap}>
      <div className={styles.hud}>
        <button className={styles.hudExit} onClick={onExit}>
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <line x1="5" y1="5" x2="19" y2="19" />
            <line x1="19" y1="5" x2="5" y2="19" />
          </svg>
          {lang === 'id' ? 'Keluar' : 'Exit'}
        </button>
        <button className={styles.hudMute} onClick={() => setMuted((m) => !m)} aria-label={lang === 'id' ? 'Bisukan suara' : 'Mute sound'}>
          {muted ? (
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="4 9 8 9 12 5 12 19 8 15 4 15 4 9" />
              <line x1="16.5" y1="9" x2="21.5" y2="15" />
              <line x1="21.5" y1="9" x2="16.5" y2="15" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="4 9 8 9 12 5 12 19 8 15 4 15 4 9" />
              <path d="M16 8.5a5 5 0 0 1 0 7" />
              <path d="M18.5 6a8.5 8.5 0 0 1 0 12" />
            </svg>
          )}
        </button>
        <div className={styles.hudProgress}>
          <span>{visitedCount}/{POIS.length}</span>
          <span className={styles.hudProgressLabel}>{lang === 'id' ? 'tempat dikunjungi' : 'places visited'}</span>
        </div>
      </div>

      <div className={styles.minimapWrap}>
        <canvas ref={minimapRef} width={168} height={168} className={styles.minimapCanvas} />
        <span className={styles.minimapNorth}>N</span>
        <span className={styles.minimapLabel}>{lang === 'id' ? 'Peta' : 'Map'}</span>
      </div>

      <div ref={mountRef} className={styles.canvasMount} />

      {nearbyPoi && !openPoi && (
        <div className={styles.interactPrompt}>
          <kbd>E</kbd> {lang === 'id' ? 'untuk lihat info' : 'to view info'}
        </div>
      )}

      <div className={styles.dpad}>
        <button className={styles.dpadUp} onTouchStart={() => setDir('arrowup', true)} onTouchEnd={() => setDir('arrowup', false)} onMouseDown={() => setDir('arrowup', true)} onMouseUp={() => setDir('arrowup', false)}>▲</button>
        <button className={styles.dpadLeft} onTouchStart={() => setDir('arrowleft', true)} onTouchEnd={() => setDir('arrowleft', false)} onMouseDown={() => setDir('arrowleft', true)} onMouseUp={() => setDir('arrowleft', false)}>◀</button>
        <button className={styles.dpadRight} onTouchStart={() => setDir('arrowright', true)} onTouchEnd={() => setDir('arrowright', false)} onMouseDown={() => setDir('arrowright', true)} onMouseUp={() => setDir('arrowright', false)}>▶</button>
        <button className={styles.dpadDown} onTouchStart={() => setDir('arrowdown', true)} onTouchEnd={() => setDir('arrowdown', false)} onMouseDown={() => setDir('arrowdown', true)} onMouseUp={() => setDir('arrowdown', false)}>▼</button>
        {nearbyPoi && (
          <button className={styles.dpadInteract} onClick={tryInteract}>E</button>
        )}
      </div>

      {openPoi && (
        <div className={styles.modalOverlay} onClick={() => setOpenPoi(null)}>
          <div className={styles.modalCard} onClick={(e) => e.stopPropagation()} style={{ '--poi-color': `#${openPoi.color.toString(16).padStart(6, '0')}` }}>
            {openPoi.image && (
              <img className={styles.modalPhoto} src={openPoi.image} alt={lang === 'id' ? openPoi.title_id : openPoi.title_en} />
            )}
            {openPoi.images && (
              <div className={styles.modalPhotoGrid}>
                {openPoi.images.map((src) => (
                  <img key={src} src={src} alt="" />
                ))}
              </div>
            )}
            {!openPoi.image && !openPoi.images && (
              <span className={styles.modalIconGraphic}>
                {openPoi.id === 'skills' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                )}
                {openPoi.id === 'quote' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                )}
                {openPoi.id === 'contact' && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 7l10 6 10-6" />
                  </svg>
                )}
              </span>
            )}
            <h3 className={styles.modalTitle}>{lang === 'id' ? openPoi.title_id : openPoi.title_en}</h3>
            <p className={styles.modalBody}>{lang === 'id' ? openPoi.body_id : openPoi.body_en}</p>
            <button className={styles.modalClose} onClick={() => setOpenPoi(null)}>
              {lang === 'id' ? 'Lanjut jalan' : 'Keep walking'}
            </button>
          </div>
        </div>
      )}

      {visitedCount === POIS.length && (
        <div className={styles.winBanner}>
          🎉 {lang === 'id' ? 'Semua tempat sudah kamu kunjungi! Makasih udah main.' : "You've visited every spot! Thanks for playing."}
        </div>
      )}
    </div>
  )
}
