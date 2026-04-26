import React, { useState } from 'react';

const FAQS = [
  {
    q: 'Is UpgrAIed safe for children?',
    a: 'Absolutely. Every module is designed for ages 8–14 with age-appropriate content, guided AI usage, and zero access to unfiltered internet. ROB only responds within curated, safe learning contexts. Parents also have full visibility through their dashboard.',
  },
  {
    q: 'Do kids need any coding or tech knowledge?',
    a: 'Zero prerequisites. UpgrAIed starts from absolute basics and builds up. Children who have never touched a computer can start, and children who are already curious about tech will be challenged and engaged at their level.',
  },
  {
    q: 'Will my child use AI responsibly?',
    a: "Yes — that's the whole point. We teach children that AI is a tool, not a replacement for thinking. Every mission is designed to build the child's own reasoning skills, using AI as a supporting guide, not a shortcut.",
  },
  {
    q: 'How much screen time does this involve?',
    a: 'We recommend 30–45 minutes per session, 3–4 times a week. Sessions are designed to be focused and purposeful — not endless scrolling. The structured format means children stay productive and log off feeling accomplished.',
  },
  {
    q: 'Can parents track progress?',
    a: "Yes — the parent dashboard is a core feature, not an afterthought. You'll see completed missions, earned badges, quiz scores, time spent, and module progress in real time. Champion plan members receive weekly automated reports.",
  },
  {
    q: 'What if my child doesn\'t like it?',
    a: "We offer a free demo session before any commitment. Try it first, see how your child engages with ROB and the missions, and then decide. We're confident you'll see the spark in the first session.",
  },
  {
    q: 'Is this available for children outside India?',
    a: 'Yes! UpgrAIed is built for global Indian families and international parents looking for premium AI education. The platform is available worldwide with pricing in both INR and USD.',
  },
  {
    q: 'What makes UpgrAIed different from other edtech?',
    a: 'UpgrAIed is not a course library. It\'s a structured learning system with a personality-driven AI companion (ROB), gamified missions, real skill outcomes, and parent intelligence built in. We are building the first premium AI education experience for children, not just more video content.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section style={{ padding: '100px 32px' }}>
      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: '50px',
            background: 'rgba(255,122,47,0.1)', border: '1px solid rgba(255,122,47,0.2)',
            color: '#FF7A2F', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
            marginBottom: '16px',
          }}>
            FREQUENTLY ASKED
          </div>
          <h2 style={{
            fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 800,
            letterSpacing: '-0.02em', lineHeight: 1.1,
            color: 'var(--text-primary)',
          }}>
            Everything parents want to know
          </h2>
        </div>

        {/* FAQ Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, i) => (
            <FAQItem
              key={i} faq={faq} index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Bottom note */}
        <div style={{
          marginTop: '48px', textAlign: 'center',
          padding: '24px', borderRadius: '16px',
          background: 'rgba(123,63,228,0.07)',
          border: '1px solid rgba(155,111,244,0.15)',
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Still have questions?{' '}
            <a
              href="https://wa.me/919999999999?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20UpgrAIed%20for%20my%20child."
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#9B6FF4', fontWeight: 600 }}
            >
              Chat with us on WhatsApp →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div
      style={{
        borderRadius: '14px',
        background: isOpen ? 'rgba(26,26,38,0.9)' : 'rgba(20,20,30,0.6)',
        border: `1px solid ${isOpen ? 'rgba(155,111,244,0.25)' : 'rgba(255,255,255,0.06)'}`,
        overflow: 'hidden',
        transition: 'all 0.25s ease',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%', padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left',
          gap: '16px',
        }}
      >
        <span style={{
          color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600, lineHeight: 1.5,
        }}>
          {faq.q}
        </span>
        <span style={{
          color: '#9B6FF4', fontSize: '20px', flexShrink: 0,
          transition: 'transform 0.25s',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
        }}>
          +
        </span>
      </button>

      {isOpen && (
        <div style={{
          padding: '0 24px 22px',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          paddingTop: '16px',
          animation: 'faqReveal 0.25s ease both',
        }}>
          <p style={{
            color: 'var(--text-secondary)', fontSize: '14px',
            lineHeight: 1.7,
          }}>
            {faq.a}
          </p>
        </div>
      )}
    </div>
  );
}
