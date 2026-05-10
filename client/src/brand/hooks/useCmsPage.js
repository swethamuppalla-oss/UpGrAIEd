import { useState, useEffect, useRef } from 'react'
import { getCmsSections } from '../../services/index.js'

const SECTION_KEYFRAMES = `
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
`

let kfInjected = false
export function ensureKeyframes() {
  if (kfInjected) return
  kfInjected = true
  const tag = document.createElement('style')
  tag.textContent = SECTION_KEYFRAMES
  document.head.appendChild(tag)
}

// Returns a map of section → data, and a loading flag.
export function useCmsPage(page) {
  const [sections, setSections] = useState({})
  const [loading, setLoading] = useState(true)
  const fetched = useRef(false)

  useEffect(() => {
    if (fetched.current) return
    fetched.current = true
    getCmsSections(page)
      .then(list => {
        const map = {}
        list.forEach(s => { map[s.section] = s })
        setSections(map)
      })
      .finally(() => setLoading(false))
  }, [page])

  return { sections, loading }
}

// Intersection-observer driven visible state for scroll animations.
export function useReveal(threshold = 0.15) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, visible]
}
