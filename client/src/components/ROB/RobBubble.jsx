import { useEffect, useState } from 'react'

export default function RobBubble({ message, visible }) {
  const [typed, setTyped] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  useEffect(() => {
    if (!visible || !message) {
      setTyped('')
      setIsTyping(true)
      return undefined
    }

    // 1. Show typing dots for 1.2s
    setIsTyping(true)
    setTyped('')

    const typingDelay = setTimeout(() => {
      setIsTyping(false)
      // 2. Type out the message quickly
      let index = 0
      const interval = setInterval(() => {
        index++
        setTyped(message.slice(0, index))
        if (index >= message.length) {
          clearInterval(interval)
        }
      }, 25)
      
      return () => clearInterval(interval)
    }, 1200)

    return () => clearTimeout(typingDelay)
  }, [message, visible])

  if (!visible) return null

  return (
    <>
      <style>{`
        @keyframes bubbleFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes typingDot {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
      <div style={{
        position: 'absolute',
        top: -60,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(8px)',
        padding: '12px 18px',
        borderRadius: 20,
        color: '#0F0B1C',
        fontWeight: 600,
        fontSize: 14,
        lineHeight: 1.4,
        boxShadow: '0 12px 30px rgba(0,0,0,0.4)',
        minWidth: 140,
        maxWidth: 240,
        textAlign: 'center',
        animation: 'bubbleFloat 3s ease-in-out infinite',
        zIndex: 10,
      }}>
        {isTyping ? (
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', height: 20, alignItems: 'center' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7B3FE4', animation: 'typingDot 1s infinite' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7B3FE4', animation: 'typingDot 1s infinite 0.2s' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#7B3FE4', animation: 'typingDot 1s infinite 0.4s' }} />
          </div>
        ) : (
          <div>{typed}</div>
        )}
        {/* Tail */}
        <svg style={{ position: 'absolute', bottom: -12, left: '50%', transform: 'translateX(-50%)', width: 20, height: 12, overflow: 'visible' }}>
          <path d="M 0 0 L 10 12 L 20 0 Z" fill="rgba(255,255,255,0.95)" />
        </svg>
      </div>
    </>
  )
}
