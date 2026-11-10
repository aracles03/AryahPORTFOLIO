import { useState, useCallback, useRef } from 'react'
import { useTypewriter } from '../hooks/useTypewriter'
import Cursor from './Cursor'
import SpamPopup from './SpamPopup'
import styles from './IntroScreen.module.css'

let popupCounter = 0

function randomPos() {
  const w = 240
  const h = 120
  const maxX = Math.max(100, window.innerWidth - w - 20)
  const maxY = Math.max(100, window.innerHeight - h - 20)
  return {
    x: Math.floor(Math.random() * maxX),
    y: Math.floor(Math.random() * maxY),
  }
}

const QUESTION_TEXT = 'Hi, do you want to know more about Aryah?'
const BOLD_WORD = 'Aryah'

function renderWithBold(displayed, fullText, boldWord) {
  const start = fullText.indexOf(boldWord)
  if (start === -1) return displayed
  const end = start + boldWord.length
  const before = displayed.slice(0, Math.min(displayed.length, start))
  const bold = displayed.slice(Math.min(displayed.length, start), Math.min(displayed.length, end))
  const after = displayed.slice(Math.min(displayed.length, end))
  return (
    <>
      {before}
      <strong>{bold}</strong>
      {after}
    </>
  )
}

export default function IntroScreen({ onEnter }) {
  const { displayed, done } = useTypewriter(
    QUESTION_TEXT,
    { delay: 55, startDelay: 700 }
  )

  const [popups, setPopups] = useState([])
  const spawnQueued = useRef(false)

  const spawnPopup = useCallback(() => {
    const id = ++popupCounter
    const pos = randomPos()
    setPopups(prev => [...prev, { id, x: pos.x, y: pos.y }])
  }, [])

  const handleClose = useCallback((closedId, suppressSpawn = false) => {
    setPopups(prev => prev.filter(p => p.id !== closedId))
    if (suppressSpawn) return
    // spawn 2 more when one is closed (unless it was closed via the true "Ogah" escape button)
    setTimeout(() => spawnPopup(), 60)
    setTimeout(() => spawnPopup(), 280)
  }, [spawnPopup])

  const handleSpam = useCallback(() => {
    if (spawnQueued.current) return
    spawnQueued.current = true
    spawnPopup()
    setTimeout(() => spawnPopup(), 350)
    setTimeout(() => spawnPopup(), 750)
    setTimeout(() => { spawnQueued.current = false }, 900)
  }, [spawnPopup])

  return (
    <div className={styles.screen}>
      {/* Popups */}
      {popups.map(p => (
        <SpamPopup
          key={p.id}
          id={p.id}
          x={p.x}
          y={p.y}
          onClose={handleClose}
          onAccept={onEnter}
        />
      ))}

      {/* Center content */}
      <div className={styles.center}>
        <p className={styles.question}>
          {renderWithBold(displayed, QUESTION_TEXT, BOLD_WORD)}
          <Cursor />
        </p>

        <div
          className={styles.btnRow}
          style={{ opacity: done ? 1 : 0, pointerEvents: done ? 'auto' : 'none' }}
        >
          <button className={styles.btnYes} onClick={onEnter}>
            YES
          </button>
          <button className={styles.btnNo} onClick={handleSpam}>
            No
          </button>
        </div>
      </div>
    </div>
  )
}
