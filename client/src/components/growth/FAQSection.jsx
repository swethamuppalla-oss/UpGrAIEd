import React, { useState, useEffect } from 'react';
import BloomCharacter from '../Bloom/BloomCharacter';
import { getContent } from '../../services'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    getContent('faq').then(data => setFaqs(data?.questions ?? []));
  }, []);

  const openFaq = faqs[openIndex];

  return (
    <section className="pg-section" style={{ background: '#F7FFF8' }}>
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
            {faqs.map((faq, i) => (
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
                  <span style={{ color: '#0A1F12', fontSize: 15, fontWeight: 600, lineHeight: 1.5 }}>
                    {faq.question}
                  </span>
                  <span style={{
                    color: '#6EDC5F', fontSize: 22, flexShrink: 0,
                    transition: 'transform 0.25s',
                    transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)',
                    display: 'inline-block',
                  }}>+</span>
                </button>
                {openIndex === i && (
                  <div className="pg-faq-answer">{faq.answer}</div>
                )}
              </div>
            ))}

            {/* Bottom note */}
            <div style={{
              marginTop: 28, padding: '20px 24px', borderRadius: 16,
              background: 'rgba(110,220,95,0.08)', border: '1px solid rgba(110,220,95,0.2)',
              textAlign: 'center',
            }}>
              <p style={{ color: '#4B6B57', fontSize: 15, margin: 0 }}>
                Still have questions?{' '}
                <a
                  href="mailto:hello@upgraied.com"
                  style={{ color: '#6EDC5F', fontWeight: 700 }}
                >
                  Email us at hello@upgraied.com →
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
