import { useEffect, useRef, useState } from 'react'
import { useConfig } from '../../context/ConfigContext'
import { EMOTIONS } from './BloomCharacter'

// Variant accent → flower/glow palette
function deriveColors(accentColor) {
  if (accentColor === '#7B3FE4') {
    // master — purple-tinted body
    return {
      bodyTop:    '#C9B8F5',
      bodyMid:    '#9B6FF4',
      bodyBot:    '#7B3FE4',
      bellyTop:   '#E8D8FF',
      bellyBot:   '#C9B8F5',
      leafTop:    '#C9B8F5',
      leafBot:    '#5A2DB0',
      feet:       '#5A2DB0',
      flowerA:    '#FFD95A',
      flowerB:    '#C9B8F5',
      glowColor:  'rgba(123,63,228,0.35)',
      ambientFill:'rgba(123,63,228,0.12)',
    }
  }
  if (accentColor === '#63C7FF') {
    // explorer — sky-blue tinted
    return {
      bodyTop:    '#B8E8FF',
      bodyMid:    '#63C7FF',
      bodyBot:    '#3AAEE0',
      bellyTop:   '#DAFAFF',
      bellyBot:   '#B8E8FF',
      leafTop:    '#B8E8FF',
      leafBot:    '#2A8FBF',
      feet:       '#2A8FBF',
      flowerA:    '#FFD95A',
      flowerB:    '#B8E8FF',
      glowColor:  'rgba(99,199,255,0.35)',
      ambientFill:'rgba(99,199,255,0.12)',
    }
  }
  // sprout / achiever — default green
  return {
    bodyTop:    '#A8F5A2',
    bodyMid:    '#6EDC5F',
    bodyBot:    '#4DB84A',
    bellyTop:   '#D4FAD0',
    bellyBot:   '#A8F5A2',
    leafTop:    '#A8F5A2',
    leafBot:    '#3DAA3A',
    feet:       '#4DB84A',
    flowerA:    '#FFD95A',
    flowerB:    '#FF8A65',
    glowColor:  'rgba(110,220,95,0.35)',
    ambientFill:'rgba(110,220,95,0.15)',
  }
}

export default function Bloom({
  variant,
  size = 80,
  emotion: emotionOverride,
  animate = true,
  speech,
  chestText,
  style,
}) {
  const config  = useConfig()
  const emotion = emotionOverride || variant?.bloomEmotion || 'happy'
  const emo     = EMOTIONS[emotion] || EMOTIONS.happy
  const colors  = deriveColors(variant?.accentColor)

  const w = size
  const h = Math.round(size * 1.2)

  const uid = useRef(`bloom-${Math.random().toString(36).slice(2, 7)}`).current

  const [blink, setBlink]         = useState(false)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })
  const blinkTimer = useRef(null)

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

  useEffect(() => {
    const onMove = (e) => {
      const el = document.getElementById(uid)
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
  }, [uid])

  const eyeScaleY = blink ? 0.05 : 1

  // Admin custom image overrides
  const customImg = config?.mascot?.bloom?.expressions?.[emotion] || config?.mascot?.bloom?.avatar

  const gradBody   = `bloom-body-${uid}`
  const gradBelly  = `bloom-belly-${uid}`
  const gradLeaf   = `bloom-leaf-${uid}`
  const gradFlower = `bloom-flower-${uid}`
  const filtGlow   = `bloom-glow-${uid}`

  return (
    <div
      id={uid}
      style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: 8, ...style }}
    >
      {speech && (
        <div className="bloom-bubble bloom-animate-pop" style={{ maxWidth: Math.max(w * 1.5, 140) }}>
          {speech}
        </div>
      )}

      {customImg ? (
        <img
          src={customImg}
          alt={`Bloom ${emotion}`}
          style={{
            width: w, height: h, objectFit: 'contain',
            filter: `drop-shadow(0 8px 24px ${colors.glowColor})`,
            animation: animate ? 'bloom-float 5s ease-in-out infinite' : undefined,
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
            filter: `drop-shadow(0 8px 24px ${colors.glowColor})`,
            overflow: 'visible',
            cursor: 'default',
          }}
        >
          <defs>
            <radialGradient id={gradBody} cx="40%" cy="35%" r="65%">
              <stop offset="0%"   stopColor={colors.bodyTop} />
              <stop offset="60%"  stopColor={colors.bodyMid} />
              <stop offset="100%" stopColor={colors.bodyBot} />
            </radialGradient>
            <radialGradient id={gradBelly} cx="50%" cy="40%" r="60%">
              <stop offset="0%"   stopColor={colors.bellyTop} />
              <stop offset="100%" stopColor={colors.bellyBot} />
            </radialGradient>
            <radialGradient id={gradLeaf} cx="30%" cy="30%" r="70%">
              <stop offset="0%"   stopColor={colors.leafTop} />
              <stop offset="100%" stopColor={colors.leafBot} />
            </radialGradient>
            <radialGradient id={gradFlower} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor="#FFE88A" />
              <stop offset="100%" stopColor="#FFD95A" />
            </radialGradient>
            <filter id={filtGlow}>
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Ambient glow */}
          <ellipse cx="100" cy="200" rx="70" ry="20" fill={colors.ambientFill} />
          <circle  cx="100" cy="130" r="85"  fill={colors.ambientFill} />

          {/* Body */}
          <rect x="60" y="148" width="80" height="72" rx="22" fill={`url(#${gradBody})`} />

          {/* Belly panel */}
          <rect x="72" y="158" width="56" height="50" rx="14" fill={`url(#${gradBelly})`} opacity="0.9" />

          {/* Chest label (variant or custom) */}
          {(chestText || variant?.id) && (
            <>
              <rect x="76" y="168" width="48" height="26" rx="8" fill="rgba(13,35,20,0.45)" />
              <text x="100" y="185" textAnchor="middle" fill={colors.bodyTop} fontSize="11" fontWeight="800" fontFamily="sans-serif">
                {chestText || variant.id}
              </text>
            </>
          )}

          {/* Arms */}
          <ellipse cx="52"  cy="178" rx="12" ry="18" fill={`url(#${gradLeaf})`} transform="rotate(-20 52 178)" />
          <ellipse cx="46"  cy="190" rx="8"  ry="12" fill={`url(#${gradLeaf})`} transform="rotate(-30 46 190)" />
          <ellipse cx="148" cy="178" rx="12" ry="18" fill={`url(#${gradLeaf})`} transform="rotate(20 148 178)" />
          <ellipse cx="154" cy="190" rx="8"  ry="12" fill={`url(#${gradLeaf})`} transform="rotate(30 154 190)" />

          {/* Feet */}
          <ellipse cx="82"  cy="222" rx="16" ry="9" fill={colors.bodyBot} />
          <ellipse cx="118" cy="222" rx="16" ry="9" fill={colors.bodyBot} />

          {/* Head */}
          <circle cx="100" cy="96" r="54" fill={`url(#${gradBody})`} />

          {/* Leaf ears */}
          <ellipse cx="52"  cy="72" rx="14" ry="22" fill={`url(#${gradLeaf})`} transform="rotate(-30 52 72)" />
          <ellipse cx="56"  cy="68" rx="8"  ry="14" fill={colors.bodyTop}      transform="rotate(-30 56 68)" />
          <ellipse cx="148" cy="72" rx="14" ry="22" fill={`url(#${gradLeaf})`} transform="rotate(30 148 72)" />
          <ellipse cx="144" cy="68" rx="8"  ry="14" fill={colors.bodyTop}      transform="rotate(30 144 68)" />

          {/* Flower petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <ellipse
              key={i}
              cx={100 + 13 * Math.cos((angle * Math.PI) / 180)}
              cy={43  + 13 * Math.sin((angle * Math.PI) / 180)}
              rx="7" ry="9"
              fill={i % 2 === 0 ? colors.flowerA : colors.flowerB}
              transform={`rotate(${angle} ${100 + 13 * Math.cos((angle * Math.PI) / 180)} ${43 + 13 * Math.sin((angle * Math.PI) / 180)})`}
              opacity="0.95"
            />
          ))}
          <circle cx="100" cy="43" r="11" fill={`url(#${gradFlower})`} filter={`url(#${filtGlow})`} />
          <circle cx="100" cy="43" r="5"  fill="#FF8A65" />

          {/* Antenna */}
          <line x1="100" y1="42" x2="100" y2="52" stroke={colors.bodyBot} strokeWidth="3" strokeLinecap="round" />

          {/* Eyes */}
          <ellipse
            cx={emo.eyeL.cx} cy={emo.eyeL.cy} rx={emo.eyeL.rx} ry={emo.eyeL.ry}
            fill="white"
            style={{ transformOrigin: `${emo.eyeL.cx}px ${emo.eyeL.cy}px`, transform: `scaleY(${eyeScaleY})`, transition: 'transform 0.08s' }}
          />
          <ellipse
            cx={emo.eyeR.cx} cy={emo.eyeR.cy} rx={emo.eyeR.rx} ry={emo.eyeR.ry}
            fill="white"
            style={{ transformOrigin: `${emo.eyeR.cx}px ${emo.eyeR.cy}px`, transform: `scaleY(${eyeScaleY})`, transition: 'transform 0.08s' }}
          />
          {!blink && (
            <>
              <circle cx={emo.pupilL[0] + eyeOffset.x} cy={emo.pupilL[1] + eyeOffset.y} r="5" fill="#1A3020" />
              <circle cx={emo.pupilR[0] + eyeOffset.x} cy={emo.pupilR[1] + eyeOffset.y} r="5" fill="#1A3020" />
              <circle cx={emo.pupilL[0] + eyeOffset.x + 2} cy={emo.pupilL[1] + eyeOffset.y - 2} r="1.5" fill="white" />
              <circle cx={emo.pupilR[0] + eyeOffset.x + 2} cy={emo.pupilR[1] + eyeOffset.y - 2} r="1.5" fill="white" />
            </>
          )}

          {/* Blush */}
          {emo.blush && (
            <>
              <ellipse cx="68"  cy="112" rx="10" ry="6" fill="rgba(255,138,101,0.35)" />
              <ellipse cx="132" cy="112" rx="10" ry="6" fill="rgba(255,138,101,0.35)" />
            </>
          )}

          {/* Mouth */}
          <path d={emo.mouthPath} stroke="#2D6B30" strokeWidth="3" strokeLinecap="round" fill="none" />

          {/* Emotion extras */}
          {emo.sparkles && (
            <>
              <text x="148" y="78"  fontSize="14" fill="#FFD95A">✦</text>
              <text x="40"  y="90"  fontSize="10" fill={colors.bodyTop}>✦</text>
              <text x="155" y="102" fontSize="8"  fill={colors.bodyMid}>✦</text>
            </>
          )}
          {emo.stars && (
            <>
              <text x="138" y="68" fontSize="18" fill="#FFD95A">⭐</text>
              <text x="40"  y="80" fontSize="14" fill="#FFD95A">⭐</text>
            </>
          )}
          {emo.zzz && (
            <>
              <text x="150" y="75"  fontSize="14" fill={colors.bodyTop} opacity="0.8">z</text>
              <text x="162" y="62"  fontSize="18" fill={colors.bodyTop} opacity="0.6">z</text>
              <text x="176" y="48"  fontSize="22" fill={colors.bodyTop} opacity="0.4">z</text>
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
