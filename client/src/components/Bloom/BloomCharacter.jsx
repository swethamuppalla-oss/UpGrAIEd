import { useEffect, useRef, useState } from 'react'
import { useConfig } from '../../context/ConfigContext'

// Size configs
const SIZES = {
  tiny:   { w: 60,  h: 72 },
  small:  { w: 90,  h: 108 },
  medium: { w: 130, h: 156 },
  large:  { w: 180, h: 216 },
  hero:   { w: 240, h: 288 },
}

// Emotion → face config — exported so Bloom.jsx can share it
export const EMOTIONS = {
  happy: {
    eyeL: { cx: 78, cy: 100, rx: 10, ry: 11 },
    eyeR: { cx: 122, cy: 100, rx: 10, ry: 11 },
    pupilL: [84, 102], pupilR: [128, 102],
    mouthPath: 'M 80 120 Q 100 136 120 120',
    blush: true,
  },
  excited: {
    eyeL: { cx: 78, cy: 98, rx: 11, ry: 12 },
    eyeR: { cx: 122, cy: 98, rx: 11, ry: 12 },
    pupilL: [84, 100], pupilR: [128, 100],
    mouthPath: 'M 76 118 Q 100 140 124 118',
    blush: true,
    sparkles: true,
  },
  thinking: {
    eyeL: { cx: 78, cy: 100, rx: 10, ry: 8 },
    eyeR: { cx: 122, cy: 100, rx: 10, ry: 8 },
    pupilL: [80, 100], pupilR: [124, 100],
    mouthPath: 'M 84 122 Q 100 126 116 120',
    blush: false,
  },
  celebrating: {
    eyeL: { cx: 78, cy: 96, rx: 12, ry: 13 },
    eyeR: { cx: 122, cy: 96, rx: 12, ry: 13 },
    pupilL: [84, 98], pupilR: [128, 98],
    mouthPath: 'M 74 116 Q 100 144 126 116',
    blush: true,
    sparkles: true,
    stars: true,
  },
  encouraging: {
    eyeL: { cx: 78, cy: 100, rx: 10, ry: 10 },
    eyeR: { cx: 122, cy: 100, rx: 10, ry: 10 },
    pupilL: [84, 102], pupilR: [128, 102],
    mouthPath: 'M 80 120 Q 100 132 120 120',
    blush: true,
  },
  sleepy: {
    eyeL: { cx: 78, cy: 104, rx: 10, ry: 5 },
    eyeR: { cx: 122, cy: 104, rx: 10, ry: 5 },
    pupilL: [84, 104], pupilR: [128, 104],
    mouthPath: 'M 86 122 Q 100 126 114 122',
    blush: false,
    zzz: true,
  },
  curious: {
    eyeL: { cx: 76, cy: 98, rx: 11, ry: 12 },
    eyeR: { cx: 124, cy: 100, rx: 9, ry: 10 },
    pupilL: [82, 100], pupilR: [130, 102],
    mouthPath: 'M 84 120 Q 100 130 116 118',
    blush: false,
  },
  error: {
    eyeL: { cx: 78, cy: 102, rx: 10, ry: 7 },
    eyeR: { cx: 122, cy: 102, rx: 10, ry: 7 },
    pupilL: [84, 102], pupilR: [128, 102],
    mouthPath: 'M 82 126 Q 100 116 118 126',
    blush: false,
    sweat: true,
  },
  teaching: {
    eyeL: { cx: 78, cy: 100, rx: 10, ry: 10 },
    eyeR: { cx: 122, cy: 100, rx: 10, ry: 10 },
    pupilL: [82, 100], pupilR: [126, 100],
    mouthPath: 'M 80 120 Q 100 133 120 120',
    blush: false,
    pointer: true,
  },
}

export default function BloomCharacter({
  emotion = 'happy',
  size = 'medium',
  speech,
  style,
  chestText,
  level,
  animate = true,
}) {
  const emo = EMOTIONS[emotion] || EMOTIONS.happy
  const { w, h } = SIZES[size] || SIZES.medium
  const [blink, setBlink] = useState(false)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const blinkTimer = useRef(null)
  
  const config = useConfig()
  const customImg = config?.mascot?.bloom?.expressions?.[emotion] || config?.mascot?.bloom?.avatar

  // Random blink every 3–6 s
  useEffect(() => {
    const scheduleBlink = () => {
      const delay = 3000 + Math.random() * 3000
      blinkTimer.current = setTimeout(() => {
        setBlink(true)
        setTimeout(() => { setBlink(false); scheduleBlink() }, 180)
      }, delay)
    }
    scheduleBlink()
    return () => clearTimeout(blinkTimer.current)
  }, [])

  // Eye tracking on parent container
  useEffect(() => {
    const onMove = (e) => {
      const el = document.getElementById('bloom-char-' + size)
      if (!el) return
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / window.innerWidth
      const dy = (e.clientY - cy) / window.innerHeight
      setEyeOffset({ x: dx * 4, y: dy * 3 })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [size])

  const eyeScaleY = blink ? 0.05 : 1

  return (
    <div
      id={'bloom-char-' + size}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, ...style }}
    >
      {speech && (
        <div className="bloom-bubble bloom-animate-pop" style={{ marginBottom: 4, maxWidth: Math.max(w * 1.4, 160) }}>
          {speech}
        </div>
      )}

      {customImg ? (
        <img 
          src={customImg} 
          alt={`Bloom ${emotion}`} 
          style={{ 
            width: w, 
            height: h, 
            objectFit: 'contain', 
            filter: 'drop-shadow(0 8px 24px rgba(110,220,95,0.35))',
            animation: animate ? 'bloom-float 5s ease-in-out infinite' : undefined
          }} 
        />
      ) : (
      <svg
        width={w}
        height={h}
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          animation: animate ? 'bloom-float 5s ease-in-out infinite' : undefined,
          cursor: 'default',
          filter: 'drop-shadow(0 8px 24px rgba(110,220,95,0.35))',
          overflow: 'visible',
        }}
      >
        <defs>
          <radialGradient id="bg-bloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(110,220,95,0.15)" />
            <stop offset="100%" stopColor="rgba(110,220,95,0)" />
          </radialGradient>
          <radialGradient id="body-grad" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#A8F5A2" />
            <stop offset="60%" stopColor="#6EDC5F" />
            <stop offset="100%" stopColor="#4DB84A" />
          </radialGradient>
          <radialGradient id="belly-grad" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#D4FAD0" />
            <stop offset="100%" stopColor="#A8F5A2" />
          </radialGradient>
          <radialGradient id="leaf-grad" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#A8F5A2" />
            <stop offset="100%" stopColor="#3DAA3A" />
          </radialGradient>
          <radialGradient id="flower-center" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFE88A" />
            <stop offset="100%" stopColor="#FFD95A" />
          </radialGradient>
          <filter id="glow-bloom">
            <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="chest-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
        </defs>

        {/* Ambient glow */}
        <ellipse cx="100" cy="200" rx="70" ry="20" fill="rgba(110,220,95,0.15)" />
        <circle cx="100" cy="130" r="85" fill="url(#bg-bloom)" />

        {/* Body */}
        <rect x="60" y="148" width="80" height="72" rx="22" fill="url(#body-grad)" />

        {/* Belly panel */}
        <rect x="72" y="158" width="56" height="50" rx="14" fill="url(#belly-grad)" opacity="0.9" />

        {/* Chest text/level */}
        {(chestText || level) && (
          <>
            <rect x="76" y="168" width="48" height="26" rx="8" fill="rgba(13,35,20,0.5)" />
            <text x="100" y="185" textAnchor="middle" fill="#A8F5A2" fontSize="11" fontWeight="800" fontFamily="sans-serif">
              {chestText || `Lv ${level}`}
            </text>
          </>
        )}

        {/* Arm Left */}
        <ellipse cx="52" cy="178" rx="12" ry="18" fill="url(#leaf-grad)" transform="rotate(-20 52 178)" />
        <ellipse cx="46" cy="190" rx="8" ry="12" fill="url(#leaf-grad)" transform="rotate(-30 46 190)" />

        {/* Arm Right */}
        <ellipse cx="148" cy="178" rx="12" ry="18" fill="url(#leaf-grad)" transform="rotate(20 148 178)" />
        <ellipse cx="154" cy="190" rx="8" ry="12" fill="url(#leaf-grad)" transform="rotate(30 154 190)" />

        {/* Feet */}
        <ellipse cx="82" cy="222" rx="16" ry="9" fill="#4DB84A" />
        <ellipse cx="118" cy="222" rx="16" ry="9" fill="#4DB84A" />

        {/* Head */}
        <circle cx="100" cy="96" r="54" fill="url(#body-grad)" />

        {/* Leaf ears */}
        <ellipse cx="52" cy="72" rx="14" ry="22" fill="url(#leaf-grad)" transform="rotate(-30 52 72)" />
        <ellipse cx="56" cy="68" rx="8" ry="14" fill="#A8F5A2" transform="rotate(-30 56 68)" />
        <ellipse cx="148" cy="72" rx="14" ry="22" fill="url(#leaf-grad)" transform="rotate(30 148 72)" />
        <ellipse cx="144" cy="68" rx="8" ry="14" fill="#A8F5A2" transform="rotate(30 144 68)" />

        {/* Flower on top */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse
            key={i}
            cx={100 + 13 * Math.cos((angle * Math.PI) / 180)}
            cy={43 + 13 * Math.sin((angle * Math.PI) / 180)}
            rx="7" ry="9"
            fill={i % 2 === 0 ? '#FFD95A' : '#FF8A65'}
            transform={`rotate(${angle} ${100 + 13 * Math.cos((angle * Math.PI) / 180)} ${43 + 13 * Math.sin((angle * Math.PI) / 180)})`}
            opacity="0.95"
          />
        ))}
        <circle cx="100" cy="43" r="11" fill="url(#flower-center)" filter="url(#glow-bloom)" />
        <circle cx="100" cy="43" r="5" fill="#FF8A65" />

        {/* Antenna stem */}
        <line x1="100" y1="42" x2="100" y2="52" stroke="#4DB84A" strokeWidth="3" strokeLinecap="round" />

        {/* Eyes */}
        {/* Left eye white */}
        <ellipse
          cx={emo.eyeL.cx} cy={emo.eyeL.cy}
          rx={emo.eyeL.rx} ry={emo.eyeL.ry}
          fill="white"
          transform={`scale(1 ${eyeScaleY})`}
          style={{ transformOrigin: `${emo.eyeL.cx}px ${emo.eyeL.cy}px`, transition: 'transform 0.08s' }}
        />
        {/* Right eye white */}
        <ellipse
          cx={emo.eyeR.cx} cy={emo.eyeR.cy}
          rx={emo.eyeR.rx} ry={emo.eyeR.ry}
          fill="white"
          style={{ transform: `scaleY(${eyeScaleY})`, transformOrigin: `${emo.eyeR.cx}px ${emo.eyeR.cy}px`, transition: 'transform 0.08s' }}
        />
        {/* Pupils */}
        {!blink && (
          <>
            <circle
              cx={emo.pupilL[0] + eyeOffset.x}
              cy={emo.pupilL[1] + eyeOffset.y}
              r="5" fill="#1A3020"
            />
            <circle
              cx={emo.pupilR[0] + eyeOffset.x}
              cy={emo.pupilR[1] + eyeOffset.y}
              r="5" fill="#1A3020"
            />
            {/* Eye shine */}
            <circle cx={emo.pupilL[0] + eyeOffset.x + 2} cy={emo.pupilL[1] + eyeOffset.y - 2} r="1.5" fill="white" />
            <circle cx={emo.pupilR[0] + eyeOffset.x + 2} cy={emo.pupilR[1] + eyeOffset.y - 2} r="1.5" fill="white" />
          </>
        )}

        {/* Blush */}
        {emo.blush && (
          <>
            <ellipse cx="68" cy="112" rx="10" ry="6" fill="rgba(255,138,101,0.35)" />
            <ellipse cx="132" cy="112" rx="10" ry="6" fill="rgba(255,138,101,0.35)" />
          </>
        )}

        {/* Mouth */}
        <path d={emo.mouthPath} stroke="#2D6B30" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Emotion extras */}
        {emo.sparkles && (
          <>
            <text x="148" y="78" fontSize="14" fill="#FFD95A">✦</text>
            <text x="40" y="90" fontSize="10" fill="#A8F5A2">✦</text>
            <text x="155" y="102" fontSize="8" fill="#63C7FF">✦</text>
          </>
        )}
        {emo.stars && (
          <>
            <text x="138" y="68" fontSize="18" fill="#FFD95A">⭐</text>
            <text x="40" y="80" fontSize="14" fill="#FFD95A">⭐</text>
          </>
        )}
        {emo.zzz && (
          <>
            <text x="150" y="75" fontSize="14" fill="#A8F5A2" opacity="0.8">z</text>
            <text x="162" y="62" fontSize="18" fill="#A8F5A2" opacity="0.6">z</text>
            <text x="176" y="48" fontSize="22" fill="#A8F5A2" opacity="0.4">z</text>
          </>
        )}
        {emo.sweat && (
          <path d="M 136 80 Q 140 90 136 98 Q 132 90 136 80" fill="#63C7FF" opacity="0.8" />
        )}
        {emo.pointer && (
          <line x1="154" y1="190" x2="172" y2="172" stroke="#FFD95A" strokeWidth="3" strokeLinecap="round" />
        )}
      </svg>
      )}
    </div>
  )
}
