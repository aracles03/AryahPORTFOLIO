import { useState } from 'react'
import styles from './GamePage.module.css'
import { useLanguage } from '../context/LanguageContext'
import Game3D from './Game3D'

export default function GamePage({ onBack }) {
  const { lang } = useLanguage()
  const [stage, setStage] = useState('cover') // cover | play
  const [spawning, setSpawning] = useState(false)

  function handlePlay() {
    setStage('play')
    setSpawning(true)
    window.setTimeout(() => setSpawning(false), 1250)
  }

  return (
    <div className={styles.page}>
      {stage !== 'play' && (
        <button className={styles.backBtn} onClick={onBack}>
          <span className={styles.backArrow}>←</span> {lang === 'id' ? 'Kembali ke Portfolio' : 'Back to Portfolio'}
        </button>
      )}

      {stage === 'cover' && (
        <CoverScreen lang={lang} onPlay={handlePlay} />
      )}
      {stage === 'play' && (
        <Game3D
          lang={lang}
          playerName={lang === 'id' ? 'Pemain' : 'Player'}
          onExit={() => setStage('cover')}
        />
      )}
      {spawning && <SpawnTransition lang={lang} />}
    </div>
  )
}

/* ============ COVER SCREEN ============ */
function CoverScreen({ lang, onPlay }) {
  return (
    <div className={styles.cover}>
      <div className={styles.coverSky}>
        <span className={styles.coverGlow} />
        <span className={styles.coverSun} />
        <span className={styles.coverSunRays} />
        <span className={styles.coverBird} style={{ top: '16%', left: '58%', animationDelay: '-1.5s' }} />
        <span className={styles.coverBird} style={{ top: '22%', left: '64%', animationDelay: '-3.8s' }} />
        <span className={styles.coverBird} style={{ top: '13%', left: '50%', animationDelay: '-6s' }} />
        <span className={styles.coverCloud} style={{ top: '10%' }} />
        <span className={styles.coverCloud} style={{ top: '24%', transform: 'scale(0.7)', animationDuration: '34s', animationDelay: '-10s' }} />
        <span className={styles.coverCloud} style={{ top: '17%', transform: 'scale(0.55)', animationDuration: '26s', animationDelay: '-4s' }} />

        <span className={styles.coverHills} />

        <div className={styles.coverGround} />
        <span className={styles.coverRoad} />
        <span className={styles.coverCrossing} />
        <span className={styles.coverCar} />

        <span className={styles.coverBuilding} style={{ left: '2%', height: '30%' }} />
        <span className={styles.coverBuilding} style={{ left: '9%', height: '46%' }} />
        <span className={styles.coverBuilding} style={{ left: '17%', height: '36%' }} />
        <span className={styles.coverBuilding} style={{ right: '3%', height: '40%' }} />
        <span className={styles.coverBuilding} style={{ right: '11%', height: '54%' }} />
        <span className={styles.coverBuilding} style={{ right: '20%', height: '28%' }} />

        <span className={styles.coverLamp} style={{ left: '24%' }} />
        <span className={styles.coverLamp} style={{ right: '26%' }} />

        <span className={styles.coverTree} style={{ left: '29%' }} />
        <span className={styles.coverTree} style={{ left: '35%', transform: 'scale(0.7)' }} />
        <span className={styles.coverTree} style={{ right: '31%', transform: 'scale(0.85)' }} />
        <span className={styles.coverTree} style={{ right: '37%', transform: 'scale(0.6)' }} />

        <span className={styles.coverBench} />

        <span className={styles.coverSparkle} style={{ left: '20%', animationDelay: '0s' }} />
        <span className={styles.coverSparkle} style={{ left: '46%', animationDelay: '-2.4s' }} />
        <span className={styles.coverSparkle} style={{ left: '68%', animationDelay: '-4.5s' }} />
        <span className={styles.coverSparkle} style={{ left: '82%', animationDelay: '-1.2s' }} />

        <span className={styles.coverCharDuo} />
      </div>
      <div className={styles.coverCard}>
        <p className={styles.coverEyebrow}>{lang === 'id' ? 'MINI GAME 3D' : '3D MINI GAME'}</p>
        <h1 className={styles.coverTitle}>Jalan Bareng Aryah</h1>
        <p className={styles.coverDesc}>
          {lang === 'id'
            ? 'Jelajahi kota kecil dalam 3D, kunjungi titik-titik cerita, dan kenalan lebih dekat sama Aryah lewat petualangan singkat ini.'
            : 'Explore a small 3D town, visit story points, and get to know Aryah better through this short adventure.'}
        </p>
        <button className={styles.playBtn} onClick={onPlay}>
          <span className={styles.playIcon}>▶</span> PLAY
        </button>
      </div>
    </div>
  )
}

/* ============ SPAWN TRANSITION ============ */
function SpawnTransition({ lang }) {
  return (
    <div className={styles.spawnOverlay}>
      <span className={styles.spawnRing} />
      <span className={styles.spawnRing} style={{ animationDelay: '0.15s' }} />
      <p className={styles.spawnLabel}>
        {lang === 'id' ? 'Masuk ke kota...' : 'Entering the city...'}
      </p>
    </div>
  )
}
