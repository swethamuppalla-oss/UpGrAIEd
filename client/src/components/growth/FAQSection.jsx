import React, { useState } from 'react';
import BloomCharacter from '../Bloom/BloomCharacter';

const FAQS = [
  { q: 'Is UpgrAIed safe for children?',                  a: 'Absolutely. Every module is designed for ages 8–14 with age-appropriate content, guided AI usage, and zero access to unfiltered internet. Bloom only responds within curated, safe learning contexts. Parents also have full visibility through their dashboard.' },
  { q: 'Do kids need any coding or tech knowledge?',       a: 'Zero prerequisites. UpgrAIed starts from absolute basics and builds up. Children who have never touched a computer can start, and children who are already curious about tech will be challenged and engaged at their level.' },
  { q: 'Will my child use AI responsibly?',                a: "Yes — that's the whole point. We teach children that AI is a tool, not a replacement for thinking. Every mission builds the child's own reasoning skills, using AI as a supporting guide, not a shortcut." },
  { q: 'How much screen time does this involve?',          a: 'We recommend 30–45 minutes per session, 3–4 times a week. Sessions are designed to be focused and purposeful — not endless scrolling. The structured format means children log off feeling accomplished.' },
  { q: 'Can parents track progress?',                      a: "Yes — the parent dashboard is a core feature, not an afterthought. You'll see completed missions, earned badges, quiz scores, time spent, and module progress in real time. Champion plan members receive weekly automated reports." },
  { q: "What if my child doesn't like it?",                a: "We offer a free demo session before any commitment. Try it first, see how your child engages with Bloom and the missions, and then decide. We're confident you'll see the spark in the first session." },
  { q: 'Is this available for children outside India?',    a: 'Yes! UpgrAIed is built for global Indian families and international parents looking for premium AI education. Available worldwide with pricing in both INR and USD.' },
  { q: 'What makes UpgrAIed different from other edtech?', a: "UpgrAIed is not a course library. It's a structured learning system with a personality-driven AI companion (Bloom), gamified missions, real skill outcomes, and parent intelligence built in. We're building the first premium AI education experience for children, not just more video content." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const openFaq = FAQS[openIndex];

  return (
    <section className="pg-section" style={{ background: '#0A1F12' }}>
      <div className="pg-orb" style={{ top: '20%', left: '-5%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(110,220,95,0.07), transparent 70%)', filter: 'blur(50px)' }} />
      <div className="pg-container-sm">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="pg-badge pg-badge-warm">FREQUENTLY ASKED</div>
          <h2 className="pg-h2">Everything parents want to know</h2>
        </div>

        {/* Bloom + FAQ layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 40, alignItems: 'flex-start' }}>
          {/* Sticky Bloom mascot */}
          <div style={{ position: 'sticky', top: 100 }}>
            <BloomCharacter
              size="medium"
              emotion={openFaq ? 'thinking' : 'curious'}
              speech={openFaq ? 'Great question!' : 'Ask me anything!'}
              animate
            />
          </div>

          {/* FAQ list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                className={`pg-faq-item${openIndex === i ? ' open' : ''}`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  style={{
                    width: '100%', padding: '20px 24px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16,
                  }}
                >
                  <span style={{ color: '#F0FFF4', fontSize: 15, fontWeight: 600, lineHeight: 1.5 }}>
                    {faq.q}
                  </span>
                  <span style={{
                    color: '#6EDC5F', fontSize: 22, flexShrink: 0,
                    transition: 'transform 0.25s',
                    transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)',
                    display: 'inline-block',
                  }}>+</span>
                </button>
                {openIndex === i && (
                  <div className="pg-faq-answer">{faq.a}</div>
                )}
              </div>
            ))}

            {/* Bottom note */}
            <div style={{
              marginTop: 28, padding: '20px 24px', borderRadius: 16,
              background: 'rgba(110,220,95,0.06)', border: '1px solid rgba(110,220,95,0.18)',
              textAlign: 'center',
            }}>
              <p style={{ color: 'rgba(168,245,162,0.7)', fontSize: 15, margin: 0 }}>
                Still have questions?{' '}
                <a
                  href="https://wa.me/919999999999?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20UpgrAIed%20for%20my%20child."
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: '#6EDC5F', fontWeight: 700 }}
                >
                  Chat with us on WhatsApp →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
