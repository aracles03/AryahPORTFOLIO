import { useState, useRef, useCallback, useEffect } from 'react'
import styles from './Chatbot.module.css'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'

const QUESTIONS = [
  {
    q_id: 'Siapa kamu?',
    q_en: 'Who are you?',
    a_id: 'Aku Aleena, asisten AI di portfolio Aryah Julio Miracle Kaensige. Aku di sini buat bantu kamu kenal Aryah lebih dekat.',
    a_en: "I'm Aleena, the AI assistant on Aryah Julio Miracle Kaensige's portfolio. I'm here to help you get to know Aryah better.",
  },
  {
    q_id: 'Apa skill utama Aryah?',
    q_en: "What are Aryah's main skills?",
    a_id: 'Aryah seorang Web Developer - kuat di React, Next.js, Node.js, Go, sampai database seperti PostgreSQL & Redis. Suka bikin produk dari database sampai interface.',
    a_en: 'Aryah is a Web Developer - strong in React, Next.js, Node.js, Go, and databases like PostgreSQL & Redis. He loves building products from database to interface.',
  },
  {
    q_id: 'Project apa yang paling dibanggakan?',
    q_en: 'Which project is he most proud of?',
    a_id: 'Beberapa project unggulannya ada di bagian "Selected work" di halaman ini, mulai dari fintech gateway sampai dashboard analytics. Scroll ke atas buat lihat semuanya!',
    a_en: 'His featured projects are in the "Selected work" section on this page, ranging from fintech gateways to analytics dashboards. Scroll up to see them all!',
  },
  {
    q_id: 'Gimana cara hubungi Aryah?',
    q_en: 'How can I contact Aryah?',
    a_id: 'Kamu bisa email langsung lewat bagian "Contact" di halaman ini, atau cek GitHub & LinkedIn-nya yang juga tersedia di sana.',
    a_en: 'You can email him directly through the "Contact" section on this page, or check his GitHub & LinkedIn also listed there.',
  },
  {
    q_id: 'Aryah lagi available untuk kerja?',
    q_en: 'Is Aryah available for work?',
    a_id: 'Yup! Statusnya saat ini available dan terbuka untuk remote work. Cek badge hijau "Available now" di bagian atas halaman ya.',
    a_en: 'Yup! He is currently available and open to remote work. Check the green "Available now" badge at the top of the page.',
  },
  {
    q_id: 'Kenapa namanya Aleena?',
    q_en: 'Why is she named Aleena?',
    a_id: 'Aleena dipilih karena terdengar ramah dan mudah diingat - cocok jadi teman ngobrol kamu sambil eksplor portfolio ini.',
    a_en: 'Aleena was chosen because it sounds friendly and is easy to remember - a fitting companion while you explore this portfolio.',
  },
]

const GREETING = {
  id: "Hai, aku Aleena! Aku asisten AI di portfolio ini, tugasku bantu kamu kenalan lebih dekat sama Aryah - mulai dari project, skill, sampai cara menghubunginya. Pilih salah satu pertanyaan di bawah, atau tanya apa aja ke aku ya!",
  en: "Hi, I'm Aleena! I'm the AI assistant on this portfolio, here to help you get to know Aryah better - from projects and skills to how to reach him. Pick a question below, or ask me anything!",
}

function IconChat(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M21 11.5a8.38 8.38 0 0 1-4.7 7.6 8.5 8.5 0 0 1-8.9-.7L3 20l1.4-4.1a8.38 8.38 0 0 1-.9-3.9 8.5 8.5 0 0 1 12.4-7.4 8.38 8.38 0 0 1 5.1 6.9z" />
    </svg>
  )
}
function IconGlobe(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <path d="M12 3c2.4 2.5 3.8 5.7 3.8 9s-1.4 6.5-3.8 9c-2.4-2.5-3.8-5.7-3.8-9s1.4-6.5 3.8-9z" />
    </svg>
  )
}
function IconMoon(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
    </svg>
  )
}
function IconSun(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <line x1="12" y1="2.5" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="21.5" y2="12" />
      <line x1="5.1" y1="5.1" x2="6.9" y2="6.9" />
      <line x1="17.1" y1="17.1" x2="18.9" y2="18.9" />
      <line x1="5.1" y1="18.9" x2="6.9" y2="17.1" />
      <line x1="17.1" y1="6.9" x2="18.9" y2="5.1" />
    </svg>
  )
}
function IconX(props) {
  return (
    <svg viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <line x1="5" y1="5" x2="19" y2="19" />
      <line x1="19" y1="5" x2="5" y2="19" />
    </svg>
  )
}

export default function Chatbot({ enabled = true }) {
  const { lang, setLang } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [messages, setMessages] = useState(() => [{ from: 'bot', text: GREETING[lang] || GREETING.id }])
  const [askedIds, setAskedIds] = useState([])
  const [typing, setTyping] = useState(false)
  const [teaserVisible, setTeaserVisible] = useState(false)
  const teaserShownRef = useRef(false)

  // Draggable bubble state
  const [pos, setPos] = useState(() => ({
    x: typeof window !== 'undefined' ? window.innerWidth - 92 : 300,
    y: typeof window !== 'undefined' ? window.innerHeight - 110 : 500,
  }))
  const dragRef = useRef({ dragging: false, offsetX: 0, offsetY: 0, moved: false })
  const bodyRef = useRef(null)

  const clampPos = useCallback((x, y) => {
    const w = 72
    const h = 72
    const maxX = window.innerWidth - w - 8
    const maxY = window.innerHeight - h - 8
    return {
      x: Math.min(Math.max(8, x), Math.max(8, maxX)),
      y: Math.min(Math.max(8, y), Math.max(8, maxY)),
    }
  }, [])

  const onPointerDown = useCallback((e) => {
    const point = e.touches ? e.touches[0] : e
    dragRef.current.dragging = true
    dragRef.current.moved = false
    dragRef.current.offsetX = point.clientX - pos.x
    dragRef.current.offsetY = point.clientY - pos.y
  }, [pos])

  useEffect(() => {
    function handleMove(e) {
      if (!dragRef.current.dragging) return
      const point = e.touches ? e.touches[0] : e
      const nx = point.clientX - dragRef.current.offsetX
      const ny = point.clientY - dragRef.current.offsetY
      dragRef.current.moved = true
      setPos(clampPos(nx, ny))
    }
    function handleUp() {
      dragRef.current.dragging = false
    }
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    window.addEventListener('touchmove', handleMove, { passive: false })
    window.addEventListener('touchend', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', handleUp)
    }
  }, [clampPos])

  useEffect(() => {
    function handleResize() {
      setPos((p) => clampPos(p.x, p.y))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [clampPos])

  useEffect(() => {
    if (!enabled || teaserShownRef.current) return

    const heroEl = document.getElementById('hero-photo-section')
    if (!heroEl) {
      // fallback: hero section not found, just show it after a short delay
      teaserShownRef.current = true
      const showTimer = setTimeout(() => setTeaserVisible(true), 1200)
      return () => clearTimeout(showTimer)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !teaserShownRef.current) {
            teaserShownRef.current = true
            setTimeout(() => setTeaserVisible(true), 600)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(heroEl)
    return () => observer.disconnect()
  }, [enabled])

  useEffect(() => {
    if (!teaserVisible) return
    const hideTimer = setTimeout(() => setTeaserVisible(false), 9000)
    return () => clearTimeout(hideTimer)
  }, [teaserVisible])

  useEffect(() => {
    if (open || menuOpen) setTeaserVisible(false)
  }, [open, menuOpen])

  const handleBubbleClick = useCallback(() => {
    if (dragRef.current.moved) return
    if (open) { setOpen(false); return }
    setMenuOpen((o) => !o)
  }, [open])

  const handleAsk = useCallback((item, idx) => {
    setMessages((prev) => [...prev, { from: 'user', text: lang === 'id' ? item.q_id : item.q_en }])
    setAskedIds((prev) => [...prev, idx])
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((prev) => [...prev, { from: 'bot', text: lang === 'id' ? item.a_id : item.a_en }])
    }, 550 + Math.random() * 400)
  }, [lang])

  useEffect(() => {
    setMessages((prev) => (
      prev.length === 1 && prev[0].from === 'bot'
        ? [{ from: 'bot', text: GREETING[lang] || GREETING.id }]
        : prev
    ))
  }, [lang])

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [messages, typing, open])

  const remaining = QUESTIONS.map((q, i) => ({ ...q, idx: i })).filter(
    (q) => !askedIds.includes(q.idx)
  )

  // Window placement: open above/left of bubble depending on space
  const winStyle = (() => {
    const winW = 320
    const winH = 440
    let left = pos.x + 72 - winW
    let top = pos.y - winH - 12
    if (left < 8) left = Math.min(pos.x, window.innerWidth - winW - 8)
    if (top < 8) top = pos.y + 80
    if (top + winH > window.innerHeight - 8) top = window.innerHeight - winH - 8
    return { left: Math.max(8, left), top: Math.max(8, top) }
  })()

  const teaserStyle = (() => {
    const w = 250
    let left = pos.x + 72 - w
    let top = pos.y - 66
    if (left < 8) left = Math.min(pos.x, window.innerWidth - w - 8)
    if (top < 8) top = pos.y + 80
    return { left: Math.max(8, left), top: Math.max(8, top) }
  })()

  return (
    <>
      <div
        className={styles.bubbleWrap}
        style={{ left: pos.x, top: pos.y }}
      >
        {menuOpen && (
          <div className={styles.menuCard}>
            <div className={styles.menuHeader}>
              <img src="/aleena.png" alt="Aleena" className={styles.menuAvatar} draggable={false} />
              <div className={styles.menuHeaderText}>
                <p className={styles.menuName}>Aleena</p>
                <p className={styles.menuSub}>{lang === 'id' ? 'Asisten AI' : 'AI Assistant'}</p>
              </div>
            </div>

            <div className={styles.menuGrid}>
              <button
                className={styles.menuBtn}
                onClick={() => { setOpen(true); setMenuOpen(false) }}
              >
                <IconChat className={styles.menuBtnIcon} />
                <span className={styles.menuBtnLabel}>Chat</span>
              </button>
              <button
                className={styles.menuBtn}
                onClick={() => setLang(lang === 'id' ? 'en' : 'id')}
              >
                <IconGlobe className={styles.menuBtnIcon} />
                <span className={styles.menuBtnLabel}>{lang === 'id' ? 'Bahasa' : 'Language'}</span>
              </button>
              <button
                className={styles.menuBtn}
                onClick={toggleTheme}
              >
                {theme === 'light' ? <IconMoon className={styles.menuBtnIcon} /> : <IconSun className={styles.menuBtnIcon} />}
                <span className={styles.menuBtnLabel}>{theme === 'light' ? (lang === 'id' ? 'Gelap' : 'Dark') : (lang === 'id' ? 'Terang' : 'Light')}</span>
              </button>
            </div>
          </div>
        )}

        <div
          className={styles.bubble}
          onMouseDown={onPointerDown}
          onTouchStart={onPointerDown}
          onClick={handleBubbleClick}
          role="button"
          aria-label="Buka menu Aleena"
        >
          <img src="/aleena.png" alt="Aleena chatbot" className={styles.bubbleImg} draggable={false} />
          <span className={styles.pulseRing} />
          {!open && !menuOpen && <span className={styles.notifDot} />}
        </div>
      </div>

      {menuOpen && <div className={styles.menuBackdrop} onClick={() => setMenuOpen(false)} />}

      {teaserVisible && !open && !menuOpen && (
        <div className={styles.teaser} style={teaserStyle}>
          <button className={styles.teaserClose} onClick={() => setTeaserVisible(false)} aria-label="Tutup">
            <IconX />
          </button>
          <div
            className={styles.teaserRow}
            onClick={() => { setOpen(true); setTeaserVisible(false) }}
            role="button"
          >
            <img src="/aleena.png" alt="Aleena" className={styles.teaserAvatar} />
            <div className={styles.teaserBubble}>
              <p className={styles.teaserText}>
                {lang === 'id'
                  ? 'Hai! Aku Aleena, mau ngobrol soal Aryah?'
                  : "Hi! I'm Aleena, want to chat about Aryah?"}
              </p>
            </div>
          </div>
        </div>
      )}

      {open && (
        <div className={styles.chatWindow} style={winStyle}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <img src="/aleena.png" alt="Aleena" className={styles.headerAvatar} />
              <div>
                <p className={styles.headerName}>Aleena</p>
                <p className={styles.headerStatus}>
                  <span className={styles.onlineDot} /> {lang === 'id' ? 'Online · Tanya apa aja!' : 'Online · Ask me anything!'}
                </p>
              </div>
            </div>
            <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Tutup chat">
              <IconX />
            </button>
          </div>

          <div className={styles.body} ref={bodyRef}>
            {messages.map((m, i) => (
              <div key={i} className={m.from === 'bot' ? styles.botMsg : styles.userMsg}>
                {m.text}
              </div>
            ))}
            {typing && (
              <div className={styles.botMsg}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
            )}
          </div>

          <div className={styles.options}>
            {remaining.length > 0 ? (
              remaining.map((item) => (
                <button
                  key={item.idx}
                  className={styles.optionBtn}
                  onClick={() => handleAsk(item, item.idx)}
                  disabled={typing}
                >
                  {lang === 'id' ? item.q_id : item.q_en}
                </button>
              ))
            ) : (
              <button
                className={styles.optionBtn}
                onClick={() => {
                  setAskedIds([])
                  setMessages((prev) => [
                    ...prev,
                    {
                      from: 'bot',
                      text: lang === 'id'
                        ? 'Mau tanya lagi? Pilihan pertanyaan udah aku reset ya.'
                        : "Want to ask more? I've reset the question list for you.",
                    },
                  ])
                }}
              >
                {lang === 'id' ? 'Tanya lagi dari awal' : 'Ask again from the start'}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
