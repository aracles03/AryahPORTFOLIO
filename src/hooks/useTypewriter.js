import { useState, useEffect } from 'react'

export function useTypewriter(text, { delay = 60, startDelay = 600 } = {}) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let i = 0
    let timeout

    const start = setTimeout(() => {
      const tick = () => {
        i++
        setDisplayed(text.slice(0, i))
        if (i < text.length) {
          timeout = setTimeout(tick, i < 5 ? 120 : delay)
        } else {
          setDone(true)
        }
      }
      tick()
    }, startDelay)

    return () => {
      clearTimeout(start)
      clearTimeout(timeout)
    }
  }, [text, delay, startDelay])

  return { displayed, done }
}
