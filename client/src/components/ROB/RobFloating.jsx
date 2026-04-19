import { useEffect, useMemo, useRef, useState } from 'react'
import RobBuddyPanel from './RobBuddyPanel'
import RobCharacter from './RobCharacter'

const messages = [
  'Hey! Did you know AI can recognize faces? 🤖',
  'I learned 3 new things today! 📚',
  'Click me to quiz you! 🎯',
  'You are doing amazing! Keep going! ⚡',
  'I am getting smarter because of YOU! 🧠',
  'Fun fact: AI learns from mistakes too! 😅',
  'Ready for your next mission? 🚀',
  'I was thinking... does AI dream? 🌙',
]

const presets = [
  { bottom: 24, right: 24 },
  { bottom: 24, left: 24 },
  { top: '42%', right: 24 },
  { top: 88, right: 32 },
  { top: '36%', left: '46%' },
]

function randomBetween(min, max) {
  return Math.floor(min + Math.random() * (max - min))
}

export default function RobFloating({ currentModuleId }) {
  const [presetIndex, setPresetIndex] = useState(0)
  const [emotion, setEmotion] = useState('happy')
  const [speech, setSpeech] = useState('')
  const [panelOpen, setPanelOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [pixelPosition, setPixelPosition] = useState(null)
  const [confetti, setConfetti] = useState([])
  const moveTimerRef = useRef(null)
  const speechTimerRef = useRef(null)
  const speechHideRef = useRef(null)
  const clickTimerRef = useRef(null)
  const dragStartRef = useRef(null)
  const movedRef = useRef(false)

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const currentPosition = pixelPosition || presets[presetIndex]

  useEffect(() => {
    return () => window.clearTimeout(clickTimerRef.current)
  }, [])

  useEffect(() => {
    const scheduleMove = () => {
      moveTimerRef.current = window.setTimeout(() => {
        if (!dragging) {
          setEmotion('excited')
          setPresetIndex(prev => (prev + 1) % presets.length)
          window.setTimeout(() => setEmotion(prev => (prev === 'excited' ? 'happy' : prev)), 1400)
        }
        scheduleMove()
      }, randomBetween(8000, 12000))
    }

    scheduleMove()
    return () => window.clearTimeout(moveTimerRef.current)
  }, [dragging])

  useEffect(() => {
    const scheduleSpeech = () => {
      speechTimerRef.current = window.setTimeout(() => {
        if (!hovered && !dragging) {
          const nextMessage = messages[Math.floor(Math.random() * messages.length)]
          setSpeech(nextMessage)
          speechHideRef.current = window.setTimeout(() => setSpeech(''), 3000)
        }
        scheduleSpeech()
      }, randomBetween(15000, 20000))
    }

    scheduleSpeech()
    return () => {
      window.clearTimeout(speechTimerRef.current)
      window.clearTimeout(speechHideRef.current)
    }
  }, [dragging, hovered])

  useEffect(() => {
    if (!dragging) return undefined

    const handleMove = (event) => {
      movedRef.current = true
      setPixelPosition({
        top: Math.max(24, event.clientY - 80),
        left: Math.max(12, event.clientX - 70),
      })
    }

    const handleUp = () => {
      setDragging(false)
      setEmotion('happy')
      dragStartRef.current = null
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [dragging])

  const confettiBurst = useMemo(() => (
    confetti.map(piece => (
      <span
        key={piece.id}
        style={{
          position: 'fixed',
          left: piece.left,
          top: piece.top,
          fontSize: 20,
          pointerEvents: 'none',
          zIndex: 1201,
          animation: `robConfetti ${piece.duration}s ease-out forwards`,
          transform: `translate(${piece.dx}px, ${piece.dy}px)`,
        }}
      >
        {piece.char}
      </span>
    ))
  ), [confetti])

  const handlePointerDown = (event) => {
    dragStartRef.current = { x: event.clientX, y: event.clientY }
    movedRef.current = false
    setDragging(true)
    setEmotion('excited')
  }

  const handleClick = () => {
    if (movedRef.current) return
    window.clearTimeout(clickTimerRef.current)
    clickTimerRef.current = window.setTimeout(() => {
      setPanelOpen(true)
    }, 180)
  }

  const handleDoubleClick = () => {
    window.clearTimeout(clickTimerRef.current)
    setEmotion('excited')
    setSpeech('Weeee! That tickles! 🤖✨')
    const origin = pixelPosition || {
      left: window.innerWidth - 140,
      top: window.innerHeight - 180,
    }
    setConfetti(Array.from({ length: 16 }, (_, index) => ({
      id: `${Date.now()}-${index}`,
      left: (origin.left || 24) + 60,
      top: (origin.top || 24) + 40,
      dx: (index - 8) * 8,
      dy: 80 + (index % 4) * 16,
      duration: 0.8 + (index % 3) * 0.15,
      char: ['🎉', '✨', '🎊'][index % 3],
    })))
    window.setTimeout(() => {
      setConfetti([])
      setSpeech('')
      setEmotion('happy')
    }, 1200)
  }

  return (
    <>
      <style>{`
        @keyframes robFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes robConfetti {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>

      {confettiBurst}

      <div
        style={{
          position: 'fixed',
          zIndex: 999,
          pointerEvents: 'all',
          transition: dragging ? 'none' : 'all 1.2s cubic-bezier(0.34,1.56,0.64,1)',
          cursor: hovered ? 'grab' : 'pointer',
          ...currentPosition,
        }}
      >
        <div
          onPointerDown={handlePointerDown}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onMouseEnter={() => {
            setHovered(true)
            setSpeech('Click me! 👆')
          }}
          onMouseLeave={() => {
            setHovered(false)
            if (speech === 'Click me! 👆') setSpeech('')
          }}
          style={{
            animation: dragging ? 'none' : 'robFloat 3s ease-in-out infinite',
            transform: `scale(${hovered ? 1.1 : 1}) rotate(${dragging && dragStartRef.current ? 6 : 0}deg)`,
            transition: 'transform 0.2s ease',
            touchAction: 'none',
            userSelect: 'none',
          }}
        >
          <RobCharacter
            size={isMobile ? 'small' : 'medium'}
            emotion={emotion}
            speech={speech}
            chestProgress={72}
            style={{ width: isMobile ? 60 : undefined }}
          />
        </div>
      </div>

      <RobBuddyPanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        currentModuleId={currentModuleId}
      />
    </>
  )
}
