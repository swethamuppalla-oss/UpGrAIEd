import { useState, useEffect } from 'react'
import EditableText from '../admin/EditableText'
import { getContent, updateContent } from '../../services'
import { useEditMode } from '../../context/EditModeContext'

const DEFAULT = {
  badge: 'COMMON QUESTIONS',
  title: 'Everything parents want to know',
  questions: [
    { question: 'What age group is UpgrAIed designed for?', answer: 'UpgrAIed is built for students aged 8–14 years. The content and AI interactions are calibrated for this age range — age-appropriate language, safe content, and a pace that matches school curricula.' },
    { question: 'Is this safe for my child to use unsupervised?', answer: 'Yes. Bloom, our AI companion, is filtered and moderated specifically for children. There are no open internet searches, no user-generated content, and every response is constrained to educational topics.' },
    { question: 'What subjects does UpgrAIed support?', answer: 'We currently support Maths, Science, Social Studies, and English for grades 4–9. We\'re actively expanding to include more subjects and competitive exam prep.' },
    { question: 'How is this different from YouTube or Google?', answer: 'UpgrAIed isn\'t a search engine or video library. It\'s a structured learning system. Your child uploads their actual school material, and Bloom creates a personalized 7-day learning plan with guided practice, quizzes, and checkpoints.' },
    { question: 'How do I know if my child is actually learning?', answer: 'You\'ll receive a weekly parent report showing which concepts were studied, quiz scores, XP earned, and where your child needs extra support. The dashboard gives you a full picture without needing to be in the room.' },
    { question: 'Can I cancel anytime?', answer: 'Absolutely. There are no contracts or commitments. You can cancel your subscription from your parent dashboard at any time. Your child\'s progress data is retained for 30 days after cancellation.' },
  ],
}

export default function FAQSectionV2() {
  const { editMode, isAdmin } = useEditMode()
  const [content, setContent] = useState(null)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    getContent('faq').then(d => {
      if (!d) return setContent({})
      const questions = d.questions ?? d
      setContent(Array.isArray(questions) ? { questions } : d)
    }).catch(() => setContent({}))
  }, [])

  const d = {
    ...DEFAULT,
    ...content,
    questions: content?.questions?.length ? content.questions : DEFAULT.questions,
  }

  const save = (updated) => {
    setContent(updated)
    if (editMode && isAdmin) updateContent('faq', updated).catch(() => {})
  }

  const updateQ = (i, field, v) => {
    const questions = d.questions.map((q, qi) => qi === i ? { ...q, [field]: v } : q)
    save({ ...d, questions })
  }

  return (
    <section style={{ background: '#F7FFF8', padding: '96px 0' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div style={{ display: 'inline-block', background: 'rgba(110,220,95,0.15)', borderRadius: 100, padding: '5px 16px', marginBottom: 16 }}>
            <EditableText value={d.badge} onChange={v => save({ ...d, badge: v })} style={{ fontSize: 12, fontWeight: 800, color: '#166B10', letterSpacing: '0.08em', textTransform: 'uppercase' }} />
          </div>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800, color: '#0D2318', letterSpacing: '-0.02em' }}>
            <EditableText value={d.title} onChange={v => save({ ...d, title: v })} />
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {d.questions.map((item, i) => (
            <FAQItem
              key={i}
              item={item}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              onQuestionChange={v => updateQ(i, 'question', v)}
              onAnswerChange={v => updateQ(i, 'answer', v)}
            />
          ))}
        </div>

        <div style={{
          marginTop: 40, padding: '24px 28px', borderRadius: 16,
          background: 'rgba(110,220,95,0.08)', border: '1px solid rgba(110,220,95,0.2)',
          textAlign: 'center',
        }}>
          <p style={{ color: 'rgba(13,35,24,0.7)', fontSize: 15, margin: 0 }}>
            Still have questions?{' '}
            <a href="mailto:hello@upgraied.com" style={{ color: '#166B10', fontWeight: 700, textDecoration: 'none' }}>
              Email us at hello@upgraied.com →
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}

function FAQItem({ item, isOpen, onToggle, onQuestionChange, onAnswerChange }) {
  return (
    <div style={{
      background: '#FFFFFF',
      borderRadius: 14,
      border: `1px solid ${isOpen ? 'rgba(110,220,95,0.3)' : 'rgba(13,35,24,0.07)'}`,
      boxShadow: isOpen ? '0 4px 20px rgba(10,31,18,0.08)' : 'none',
      overflow: 'hidden',
      transition: 'border-color 0.2s, box-shadow 0.2s',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'left', gap: 16,
        }}
      >
        <span style={{ fontSize: 15, fontWeight: 600, color: '#0D2318', lineHeight: 1.4, flex: 1 }}>
          <EditableText value={item.question} onChange={onQuestionChange} />
        </span>
        <span style={{
          color: '#6EDC5F', fontSize: 20, flexShrink: 0, fontWeight: 300,
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease',
          display: 'inline-block',
        }}>+</span>
      </button>

      {isOpen && (
        <div style={{ padding: '0 24px 20px', borderTop: '1px solid rgba(13,35,24,0.05)' }}>
          <p style={{ fontSize: 14, color: 'rgba(13,35,24,0.65)', lineHeight: 1.7, margin: '16px 0 0' }}>
            <EditableText value={item.answer} onChange={onAnswerChange} multiline />
          </p>
        </div>
      )}
    </div>
  )
}
