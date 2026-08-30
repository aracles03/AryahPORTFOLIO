import { useState, lazy, Suspense } from 'react'
import IntroScreen from './components/IntroScreen'
import Portfolio from './components/Portfolio'
import ProjectDetail from './components/ProjectDetail'
import Chatbot from './components/Chatbot'
import NetworkBackground from './components/NetworkBackground'
import GalaxyBackground from './components/GalaxyBackground'
import AuroraBackground from './components/AuroraBackground'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'

const GamePage = lazy(() => import('./components/GamePage'))

export default function App() {
  const [entered, setEntered] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [gameOpen, setGameOpen] = useState(false)

  return (
    <LanguageProvider>
    <ThemeProvider>
    <div className={entered ? 'app-portfolio' : 'app-intro'}>

      {/* Background video di semua halaman, opacity rendah.
          Taruh file video kamu di public/bg-video.mp4 */}
      <video className="bg-video" autoPlay muted loop playsInline preload="auto">
        <source src="/bg-video.mp4" type="video/mp4" />
      </video>

      {/* Abstract slowly-drifting color blobs, like flowing air/aurora, behind everything */}
      <AuroraBackground />

      {/* Twinkling starfield with mouse-parallax depth, dark mode only */}
      <GalaxyBackground />

      {/* Animated interactive network/cable background, di atas video, di belakang konten */}
      <NetworkBackground />

      <div className="app-content">
        {!entered ? (
          <IntroScreen onEnter={() => setEntered(true)} />
        ) : gameOpen ? (
          <div key="game" className="slide-in">
            <Suspense fallback={<div className="game-loading">Loading game...</div>}>
              <GamePage onBack={() => setGameOpen(false)} />
            </Suspense>
          </div>
        ) : selectedProject ? (
          <div key={selectedProject.slug} className="slide-in">
            <ProjectDetail
              project={selectedProject}
              onBack={() => setSelectedProject(null)}
            />
          </div>
        ) : (
          <div key="portfolio" className="slide-in">
            <Portfolio onSelectProject={setSelectedProject} onOpenGame={() => setGameOpen(true)} />
          </div>
        )}
        {/* Aleena AI: klik avatarnya untuk buka menu Chat / Bahasa / Tema / Musik. Disembunyikan saat main game. */}
        {entered && !gameOpen && <Chatbot enabled={entered} />}
      </div>
    </div>
    </ThemeProvider>
    </LanguageProvider>
  )
}
