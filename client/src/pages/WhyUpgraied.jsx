import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getContent } from '../services/contentService';
import GrowthNavbar from '../components/growth/GrowthNavbar';
import ParentBenefits from '../components/growth/ParentBenefits';
import TrustSection from '../components/growth/TrustSection';
import FAQSection from '../components/growth/FAQSection';
import StickyCTA from '../components/growth/StickyCTA';
import BloomCharacter from '../components/Bloom/BloomCharacter';
import BloomParticles from '../components/Bloom/BloomParticles';
import { useConfigValue } from '../hooks/useConfigValue';
import { DEFAULT_CURRICULUM } from '../config/defaults';
import '../styles/bloom.css';

const COMPARISONS = [
  {
    label: 'UpgrAIed',
    badge: '✅',
    items: [
      'Interactive AI missions with Bloom',
      'Builds real reasoning & confidence',
      'Age-appropriate guided content',
      'Parent dashboard with live reports',
      'Structured learning outcomes',
      'Personality-driven engagement',
    ],
    featured: true,
  },
  {
    label: 'Random YouTube / Apps',
    badge: '❌',
    items: [
      'Passive video consumption',
      'No skill outcomes or accountability',
      'Unfiltered, unmoderated content',
      'No visibility for parents',
      'Infinite scroll, no structure',
      'Designed to keep kids addicted',
    ],
    featured: false,
  },
];

export default function WhyUpgraied() {
  const navigate = useNavigate();
  const curriculumModules = useConfigValue('curriculum.modules', DEFAULT_CURRICULUM.modules);
  const [heroContent, setHeroContent] = useState(null);

  useEffect(() => {
    getContent('whyUpgraied').then(setHeroContent);
  }, []);

  return (
    <div style={{ background: '#0A1F12', minHeight: '100vh' }}>
      <GrowthNavbar />
      <BloomParticles count={14} zIndex={0} />

      {/* PAGE HERO */}
      <section className="pg-section" style={{ paddingTop: 130, textAlign: 'center', position: 'relative' }}>
        <div className="pg-orb" style={{ top: '5%', left: '15%', width: 600, height: 400, background: 'radial-gradient(circle, rgba(110,220,95,0.10), transparent 70%)', filter: 'blur(70px)' }} />
        <div className="pg-orb" style={{ top: '5%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(99,199,255,0.07), transparent 70%)', filter: 'blur(55px)', animationDuration: '24s' }} />

        <div style={{ maxWidth: 780, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Bloom mascot hero */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <BloomCharacter size="large" emotion="excited" speech="Not just another learning journey — a transformation!" animate />
          </div>
          <div className="pg-badge">WHY UPGRAIED</div>
          <h1 className="pg-h1" style={{ marginBottom: 20 }}>
            {heroContent?.title ?? "Not another learning system."}{' '}
            <span className="bloom-text-green">{heroContent?.titleHighlight ?? "A transformation system."}</span>
          </h1>
          <p className="pg-sub" style={{ maxWidth: 560, margin: '0 auto 40px' }}>
            {heroContent?.subtitle ?? "UpgrAIed is built on one belief: children who learn to think with AI will outperform every peer who doesn't. We give them the tools, structure, and companionship to make that happen."}
          </p>
          <button className="bloom-btn-primary" style={{ fontSize: 16, padding: '15px 36px' }} onClick={() => navigate('/book-demo')}>
            Book Free Demo →
          </button>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="pg-section pg-section-alt">
        <div className="pg-container-sm">
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 className="pg-h2">UpgrAIed vs. The Alternative</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }} className="pg-grid-2">
            {COMPARISONS.map((col, i) => (
              <div key={i} style={{
                padding: 32, borderRadius: 24,
                background: col.featured ? 'linear-gradient(145deg, rgba(28,55,38,0.95), rgba(22,43,31,0.9))' : 'rgba(14,26,18,0.7)',
                border: col.featured ? '1px solid rgba(110,220,95,0.38)' : '1px solid rgba(110,220,95,0.08)',
                boxShadow: col.featured ? '0 0 60px rgba(110,220,95,0.10)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <span style={{ fontSize: 20 }}>{col.badge}</span>
                  <span style={{ fontWeight: 800, fontSize: 17, color: col.featured ? '#A8F5A2' : 'rgba(168,245,162,0.35)' }}>
                    {col.label}
                  </span>
                </div>
                {col.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 13 }}>
                    <span className={col.featured ? 'pg-compare-yes' : 'pg-compare-no'}>
                      {col.featured ? '→' : '–'}
                    </span>
                    <span style={{ fontSize: 14, color: col.featured ? '#F0FFF4' : 'rgba(168,245,162,0.3)', lineHeight: 1.5 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEARNING JOURNEY PREVIEW */}
      <section className="pg-section" style={{ background: '#0D2318' }}>
        <div className="pg-orb" style={{ bottom: '-5%', right: '-5%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(99,199,255,0.06), transparent 70%)', filter: 'blur(60px)' }} />
        <div className="pg-container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="pg-badge pg-badge-sky">LEARNING JOURNEY PREVIEW</div>
            <h2 className="pg-h2">What children actually learn</h2>
            <p className="pg-sub">Every module is hands-on, outcome-driven, and built around Bloom missions.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }} className="pg-grid-3">
            {curriculumModules.map((item, i) => (
              <ModuleCard key={i} {...item} delay={i * 0.08} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 36 }}>
            <p style={{ color: 'rgba(168,245,162,0.45)', fontSize: 14 }}>+ 6 more modules in Growth & Champion plans</p>
          </div>
        </div>
      </section>

      <ParentBenefits />
      <TrustSection />
      <FAQSection />

      {/* FINAL CTA */}
      <section className="pg-section" style={{ background: '#0A1F12', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <BloomCharacter size="medium" emotion="encouraging" speech="Your child's future starts now!" animate style={{ marginBottom: 24 }} />
          <h2 className="pg-h2">Enroll your child today</h2>
          <p className="pg-sub" style={{ marginBottom: 32 }}>The first session is free. No credit card needed.</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="bloom-btn-primary" style={{ fontSize: 16, padding: '15px 36px' }} onClick={() => navigate('/book-demo')}>
              Book Free Demo
            </button>
            <button className="bloom-btn-ghost" style={{ fontSize: 16, padding: '15px 36px' }} onClick={() => navigate('/pricing')}>
              See Plans
            </button>
          </div>
        </div>
      </section>

      <StickyCTA />
    </div>
  );
}

function ModuleCard({ module, title, desc, icon, emotion, delay }) {
  const [hov, setHov] = React.useState(false);
  return (
    <div
      className="pg-module-card"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="pg-module-num">MODULE {module}</div>
      <div style={{ fontSize: 32, marginBottom: 10 }}>{icon}</div>
      <h4 style={{ fontSize: 16, fontWeight: 700, color: '#F0FFF4', marginBottom: 8 }}>{title}</h4>
      <p style={{ color: 'rgba(168,245,162,0.65)', fontSize: 13, lineHeight: 1.65, marginBottom: 16 }}>{desc}</p>
      {hov && (
        <div style={{ marginTop: 'auto' }} className="bloom-animate-pop">
          <BloomCharacter size="tiny" emotion={emotion} animate={false} />
        </div>
      )}
    </div>
  );
}
