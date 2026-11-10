import { useState, useEffect } from 'react'

/**
 * Cycles through `texts`, typing each one out, pausing, deleting it,
 * then moving on to the next (looping forever).
 */
export function useTypewriterLoop(texts, {
  typeDelay = 55,
  deleteDelay = 30,
  pauseAfterType = 1500,
  pauseAfterDelete = 350,
  startDelay = 400,
} = {}) {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex] = useState(0)

  useEffect(() => {
    let timeout

    const typeText = (text, cb) => {
      let i = 0
      const tick = () => {
        i++
        setDisplayed(text.slice(0, i))
        if (i < text.length) {
          timeout = setTimeout(tick, typeDelay)
        } else {
          timeout = setTimeout(cb, pauseAfterType)
        }
      }
      tick()
    }

    const deleteText = (text, cb) => {
      let i = text.length
      const tick = () => {
        i--
        setDisplayed(text.slice(0, Math.max(i, 0)))
        if (i > 0) {
          timeout = setTimeout(tick, deleteDelay)
        } else {
          timeout = setTimeout(cb, pauseAfterDelete)
        }
      }
      tick()
    }

    const run = () => {
      const current = texts[index % texts.length]
      typeText(current, () => {
        deleteText(current, () => {
          setIndex((i) => i + 1)
        })
      })
    }

    timeout = setTimeout(run, index === 0 ? startDelay : 0)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, texts.join('|')])

  return displayed
}
