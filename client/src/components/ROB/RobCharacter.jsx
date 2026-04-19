import { useEffect, useMemo, useRef, useState } from 'react'

const sizeMap = {
  small: 80,
  medium: 140,
  large: 200,
  hero: 260,
}

const emotionMap = {
  idle: {
    mouth: 'happy',
    wrapperAnimation: '',
    headTransform: '',
    antenna: '#FF5C28',
    leftArmAnimation: '',
    rightArmAnimation: '',
    leftArmTransform: '',
    rightArmTransform: '',
  },
  happy: {
    mouth: 'happy',
    wrapperAnimation: 'robGentleBounce 2.8s ease-in-out infinite',
    headTransform: '',
    antenna: '#FF5C28',
    leftArmAnimation: '',
    rightArmAnimation: '',
    leftArmTransform: '',
    rightArmTransform: '',
  },
  excited: {
    mouth: 'excited',
    wrapperAnimation: 'robFastBounce 0.9s ease-in-out infinite',
    headTransform: '',
    antenna: '#FFD700',
    leftArmAnimation: 'robLeftWave 0.9s ease-in-out infinite',
    rightArmAnimation: 'robRightWave 0.9s ease-in-out infinite',
    leftArmTransform: '',
    rightArmTransform: '',
  },
  thinking: {
    mouth: 'thinking',
    wrapperAnimation: '',
    headTransform: 'rotate(-5 100 70)',
    antenna: '#7B3FE4',
    leftArmAnimation: '',
    rightArmAnimation: '',
    leftArmTransform: '',
    rightArmTransform: '',
  },
  wrong: {
    mouth: 'sad',
    wrapperAnimation: 'robShake 0.45s ease-in-out 2',
    headTransform: '',
    antenna: '#FF4444',
    leftArmAnimation: 'robLeftDroop 0.35s ease forwards',
    rightArmAnimation: 'robRightDroop 0.35s ease forwards',
    leftArmTransform: '',
    rightArmTransform: '',
  },
  error: {
    mouth: 'surprised',
    wrapperAnimation: 'robRapidShake 0.2s linear 4',
    headTransform: '',
    antenna: '#FF4444',
    leftArmAnimation: 'robLeftDroop 0.2s ease forwards',
    rightArmAnimation: 'robRightDroop 0.2s ease forwards',
    leftArmTransform: '',
    rightArmTransform: '',
  },
  learning: {
    mouth: 'thinking',
    wrapperAnimation: '',
    headTransform: '',
    antenna: '#00D4FF',
    leftArmAnimation: '',
    rightArmAnimation: '',
    leftArmTransform: '',
    rightArmTransform: '',
  },
  teaching: {
    mouth: 'happy',
    wrapperAnimation: '',
    headTransform: '',
    antenna: '#00D4FF',
    leftArmAnimation: '',
    rightArmAnimation: '',
    leftArmTransform: '',
    rightArmTransform: 'rotate(-40 154 142)',
  },
}

function renderMouth(mouth) {
  if (mouth === 'sad') {
    return (
      <path
        d="M 78 102 Q 100 88 122 102"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    )
  }

  if (mouth === 'surprised') {
    return (
      <ellipse
        cx="100"
        cy="96"
        rx="12"
        ry="10"
        fill="#1a1a2e"
        stroke="white"
        strokeWidth="2"
      />
    )
  }

  if (mouth === 'thinking') {
    return (
      <path
        d="M 78 95 Q 89 90 100 95 Q 111 100 122 95"
        fill="none"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
    )
  }

  if (mouth === 'excited') {
    return (
      <>
        <path
          d="M 75 90 Q 100 112 125 90"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M 75 90 Q 100 112 125 90 L 121 99 Q 100 112 79 99 Z"
          fill="white"
          opacity="0.15"
        />
      </>
    )
  }

  return (
    <path
      d="M 78 90 Q 100 108 122 90"
      fill="none"
      stroke="white"
      strokeWidth="3"
      strokeLinecap="round"
    />
  )
}

export default function RobCharacter({
  emotion = 'idle',
  speech = '',
  size = 'medium',
  style = {},
  chestProgress = 48,
}) {
  const svgRef = useRef(null)
  const timerRef = useRef(null)
  const [blinking, setBlinking] = useState(false)
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 })

  const config = emotionMap[emotion] || emotionMap.idle
  const width = sizeMap[size] || sizeMap.medium
  const progressWidth = Math.max(0, Math.min(100, chestProgress))
  const eyeRadius = emotion === 'learning' ? 16 : 14

  useEffect(() => {
    const blink = () => {
      setBlinking(true)
      window.setTimeout(() => setBlinking(false), 200)
    }

    const schedule = () => {
      const delay = 3000 + Math.random() * 2000
      timerRef.current = window.setTimeout(() => {
        blink()
        schedule()
      }, delay)
    }

    schedule()
    return () => window.clearTimeout(timerRef.current)
  }, [])

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!svgRef.current) return
      const rect = svgRef.current.getBoundingClientRect()
      const robCenterX = rect.left + rect.width / 2
      const robCenterY = rect.top + rect.height / 2
      const angle = Math.atan2(
        event.clientY - robCenterY,
        event.clientX - robCenterX,
      )
      const dist = 4
      setEyeOffset({
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const questionMarks = useMemo(() => (
    emotion === 'error'
      ? [
        { x: 28, y: 44, text: '?' },
        { x: 166, y: 48, text: '?' },
        { x: 100, y: 12, text: '?' },
      ]
      : []
  ), [emotion])

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        width,
        ...style,
      }}
    >
      <style>{`
        @keyframes robGentleBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes robFastBounce {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes robShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes robRapidShake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-6px); }
        }
        @keyframes robLeftWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-25deg); }
          75% { transform: rotate(15deg); }
        }
        @keyframes robRightWave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(25deg); }
          75% { transform: rotate(-15deg); }
        }
        @keyframes robLeftDroop {
          to { transform: rotate(20deg) translateY(8px); }
        }
        @keyframes robRightDroop {
          to { transform: rotate(-20deg) translateY(8px); }
        }
        @keyframes robAntennaPulse {
          0%, 100% {
            transform: scale(1);
            filter: drop-shadow(0 0 0 rgba(255,255,255,0.15));
          }
          50% {
            transform: scale(1.35);
            filter: drop-shadow(0 0 8px rgba(255,255,255,0.55));
          }
        }
        @keyframes robSpeechIn {
          0% {
            transform: scale(0) translateY(12px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        @keyframes robChestGlow {
          0%, 100% { box-shadow: 0 0 0 rgba(0, 212, 255, 0.15); }
          50% { box-shadow: 0 0 18px rgba(0, 212, 255, 0.45); }
        }
      `}</style>

      <svg
        ref={svgRef}
        viewBox="0 0 200 260"
        width={width}
        height={width * 1.3}
        style={{
          overflow: 'visible',
          animation: config.wrapperAnimation,
        }}
      >
        <defs>
          <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="100%" stopColor="#00A8C8" />
          </linearGradient>
          <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0099BB" />
            <stop offset="100%" stopColor="#006688" />
          </linearGradient>
          <linearGradient id="chestGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FF5C28" />
            <stop offset="100%" stopColor="#7B3FE4" />
          </linearGradient>
        </defs>

        {speech && (
          <foreignObject x="-10" y="-90" width="220" height="82" style={{ overflow: 'visible' }}>
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '10px 14px',
                fontSize: '13px',
                color: '#1a1a2e',
                fontFamily: 'Satoshi, sans-serif',
                fontWeight: '500',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                position: 'relative',
                lineHeight: '1.4',
                transformOrigin: 'bottom center',
                animation: 'robSpeechIn 0.28s cubic-bezier(0.34,1.56,0.64,1)',
              }}
            >
              {speech}
              <div
                style={{
                  position: 'absolute',
                  bottom: '-8px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '8px solid transparent',
                  borderRight: '8px solid transparent',
                  borderTop: '8px solid white',
                }}
              />
            </div>
          </foreignObject>
        )}

        {questionMarks.map(mark => (
          <text
            key={`${mark.x}-${mark.y}`}
            x={mark.x}
            y={mark.y}
            fill="white"
            fontSize="18"
            opacity="0.8"
          >
            {mark.text}
          </text>
        ))}

        <line
          x1="100"
          y1="20"
          x2="100"
          y2="4"
          stroke="#00AABB"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle
          cx="100"
          cy="0"
          r="5"
          fill={config.antenna}
          style={{ animation: 'robAntennaPulse 1.6s ease-in-out infinite' }}
        />

        <g transform={config.headTransform}>
          <rect
            x="40"
            y="20"
            width="120"
            height="100"
            rx="24"
            fill="url(#headGrad)"
          />

          <circle cx="75" cy="65" r={eyeRadius} fill="white" />
          <circle cx="125" cy="65" r={eyeRadius} fill="white" />

          <circle cx={75 + eyeOffset.x} cy={65 + eyeOffset.y} r="8" fill="#1a1a2e" />
          <circle cx={125 + eyeOffset.x} cy={65 + eyeOffset.y} r="8" fill="#1a1a2e" />

          <circle cx={79 + eyeOffset.x * 0.5} cy={61 + eyeOffset.y * 0.5} r="3" fill="white" />
          <circle cx={129 + eyeOffset.x * 0.5} cy={61 + eyeOffset.y * 0.5} r="3" fill="white" />

          <g
            style={{
              transformOrigin: '75px 65px',
              transform: `scaleY(${blinking ? 1 : 0})`,
              transition: 'transform 120ms ease',
            }}
          >
            <circle cx="75" cy="65" r="14" fill="#00D4FF" />
          </g>
          <g
            style={{
              transformOrigin: '125px 65px',
              transform: `scaleY(${blinking ? 1 : 0})`,
              transition: 'transform 120ms ease',
            }}
          >
            <circle cx="125" cy="65" r="14" fill="#00D4FF" />
          </g>

          <circle cx="100" cy="82" r="2.5" fill="rgba(255,255,255,0.3)" />
          {renderMouth(config.mouth)}
        </g>

        <rect x="85" y="118" width="30" height="16" rx="6" fill="#0099BB" />

        <rect
          x="50"
          y="130"
          width="100"
          height="80"
          rx="16"
          fill="url(#bodyGrad)"
        />

        <rect
          x="70"
          y="148"
          width="60"
          height="36"
          rx="8"
          fill="rgba(0,20,30,0.6)"
          stroke="rgba(0,212,255,0.4)"
          strokeWidth="1"
          style={emotion === 'learning' ? { animation: 'robChestGlow 1.8s ease-in-out infinite' } : undefined}
        />
        <line x1="75" y1="156" x2="125" y2="156" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
        <line x1="75" y1="163" x2="115" y2="163" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
        <rect x="74" y="170" width="52" height="6" rx="3" fill="rgba(255,255,255,0.1)" />
        <rect
          x="74"
          y="170"
          width={52 * (progressWidth / 100)}
          height="6"
          rx="3"
          fill="url(#chestGrad)"
          style={{ transition: 'width 0.35s ease' }}
        />

        <g
          style={{
            transformOrigin: '42px 142px',
            transformBox: 'fill-box',
            transform: config.leftArmTransform,
            animation: config.leftArmAnimation,
          }}
        >
          <rect x="18" y="136" width="28" height="12" rx="6" fill="#0099BB" />
        </g>
        <g
          style={{
            transformOrigin: '154px 142px',
            transformBox: 'fill-box',
            transform: config.rightArmTransform,
            animation: config.rightArmAnimation,
          }}
        >
          <rect x="154" y="136" width="28" height="12" rx="6" fill="#0099BB" />
        </g>

        <rect x="68" y="210" width="22" height="36" rx="8" fill="#0088AA" />
        <rect x="110" y="210" width="22" height="36" rx="8" fill="#0088AA" />
        <ellipse cx="79" cy="246" rx="16" ry="8" fill="#006688" />
        <ellipse cx="121" cy="246" rx="16" ry="8" fill="#006688" />
      </svg>
    </div>
  )
}
