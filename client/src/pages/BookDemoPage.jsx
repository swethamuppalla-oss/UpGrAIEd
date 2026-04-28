import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GrowthNavbar from '../components/growth/GrowthNavbar';
import StickyCTA from '../components/growth/StickyCTA';

const TIME_SLOTS = [
  'Morning (9am – 12pm)',
  'Afternoon (12pm – 3pm)',
  'Evening (4pm – 7pm)',
  'Weekend – Morning',
  'Weekend – Afternoon',
];

const WHAT_HAPPENS = [
  { icon: '👋', title: 'Meet ROB', desc: 'Your child gets a live intro to their AI buddy and how the platform works.' },
  { icon: '🎯', title: 'Mini Mission', desc: 'They complete their first real mission — guided by ROB, no pressure.' },
  { icon: '📊', title: 'Parent Walkthrough', desc: 'You see the parent dashboard and how you track progress.' },
  { icon: '🗣️', title: 'Q&A with Advisor', desc: 'Ask anything — curriculum, plans, expectations. Honest answers.' },
];

export default function BookDemoPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    parentName: '',
    childAge: '',
    phone: '',
    email: '',
    timeSlot: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <GrowthNavbar />

      <section style={{ padding: '120px 32px 80px' }}>
        <div style={{
          position: 'absolute', top: '10%', right: '10%',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.08), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start',
        }} className="demo-grid">
          {/* LEFT: Info */}
          <div>
            <div style={{
              display: 'inline-block', padding: '4px 14px', borderRadius: '50px',
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)',
              color: '#22C55E', fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em',
              marginBottom: '20px',
            }}>
              100% FREE · NO CREDIT CARD
            </div>
            <h1 style={{
              fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: 800,
              letterSpacing: '-0.03em', lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: '18px',
            }}>
              Book your child's{' '}
              <span style={{
                background: 'linear-gradient(135deg, #22C55E, #3B82F6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                free demo
              </span>
            </h1>
            <p style={{
              color: 'var(--text-secondary)', fontSize: '16px', lineHeight: 1.75, marginBottom: '40px',
            }}>
              A 45-minute live session where your child meets ROB, completes
              their first mission, and you see exactly what UpgrAIed delivers.
              No commitment. All questions answered.
            </p>

            <div style={{ marginBottom: '40px' }}>
              <h3 style={{
                fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px',
              }}>
                What happens in your demo session:
              </h3>
              {WHAT_HAPPENS.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', gap: '14px', marginBottom: '18px',
                }}>
                  <div style={{
                    width: '40px', height: '40px', flexShrink: 0, borderRadius: '12px',
                    background: 'rgba(123,63,228,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
                  }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{
                      fontWeight: 700, fontSize: '14px', color: 'var(--text-primary)', marginBottom: '4px',
                    }}>{item.title}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: 1.55 }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div style={{
              display: 'flex', gap: '12px', flexWrap: 'wrap',
            }}>
              {[
                { icon: '🔒', text: 'Safe for kids' },
                { icon: '⚡', text: 'Instant confirmation' },
                { icon: '📞', text: 'Advisor call included' },
              ].map((badge, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '6px 14px', borderRadius: '50px',
                  background: 'rgba(26,26,38,0.8)', border: '1px solid rgba(255,255,255,0.08)',
                  color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 600,
                }}>
                  <span>{badge.icon}</span>
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Form */}
          <div>
            {submitted ? (
              <SuccessState form={form} navigate={navigate} />
            ) : (
              <DemoForm
                form={form}
                loading={loading}
                timeSlots={TIME_SLOTS}
                onChange={handleChange}
                onSubmit={handleSubmit}
              />
            )}
          </div>
        </div>
      </section>

      <StickyCTA />
    </div>
  );
}

function DemoForm({ form, loading, timeSlots, onChange, onSubmit }) {
  return (
    <div style={{
      padding: '40px', borderRadius: '28px',
      background: 'rgba(26,26,38,0.8)',
      border: '1px solid rgba(155,111,244,0.2)',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    }}>
      <h2 style={{
        fontSize: '22px', fontWeight: 800, color: 'var(--text-primary)',
        letterSpacing: '-0.01em', marginBottom: '8px',
      }}>
        Reserve your free session
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '28px' }}>
        Our team will confirm within 2 hours on WhatsApp.
      </p>

      <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <FormField
          label="Parent Name *"
          name="parentName"
          type="text"
          placeholder="Your full name"
          value={form.parentName}
          onChange={onChange}
          required
        />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField
            label="Child's Age *"
            name="childAge"
            type="number"
            placeholder="Age (8–14)"
            value={form.childAge}
            onChange={onChange}
            min="6" max="18"
            required
          />
          <FormField
            label="Phone / WhatsApp *"
            name="phone"
            type="tel"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChange={onChange}
            required
          />
        </div>
        <FormField
          label="Email Address *"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={onChange}
          required
        />

        <div>
          <label style={{
            display: 'block', color: 'var(--text-secondary)',
            fontSize: '13px', fontWeight: 600, marginBottom: '8px',
          }}>
            Preferred Time Slot *
          </label>
          <select
            name="timeSlot"
            value={form.timeSlot}
            onChange={onChange}
            required
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: form.timeSlot ? 'var(--text-primary)' : 'var(--text-muted)',
              fontSize: '14px', outline: 'none', cursor: 'pointer',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(155,111,244,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          >
            <option value="" disabled>Select a preferred time</option>
            {timeSlots.map((slot, i) => (
              <option key={i} value={slot} style={{ background: '#1A1A26' }}>{slot}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{
            display: 'block', color: 'var(--text-secondary)',
            fontSize: '13px', fontWeight: 600, marginBottom: '8px',
          }}>
            Anything you'd like us to know? (Optional)
          </label>
          <textarea
            name="message"
            value={form.message}
            onChange={onChange}
            placeholder="E.g. My child loves gaming, struggles with focus..."
            rows={3}
            style={{
              width: '100%', padding: '12px 16px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
              resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(155,111,244,0.5)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', padding: '15px 24px', borderRadius: '14px',
            background: loading
              ? 'rgba(123,63,228,0.5)'
              : 'linear-gradient(135deg, #7B3FE4, #EC4899)',
            color: '#fff', border: 'none', fontWeight: 700, fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 8px 28px rgba(123,63,228,0.4)',
            transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            marginTop: '4px',
          }}
          onMouseOver={e => { if (!loading) e.currentTarget.style.boxShadow = '0 12px 36px rgba(123,63,228,0.55)'; }}
          onMouseOut={e => { if (!loading) e.currentTarget.style.boxShadow = '0 8px 28px rgba(123,63,228,0.4)'; }}
        >
          {loading ? (
            <>
              <span style={{
                width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
                borderTop: '2px solid #fff', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite', display: 'inline-block',
              }} />
              Booking your session...
            </>
          ) : (
            '🚀 Book Free Demo Session'
          )}
        </button>

        <p style={{
          color: 'var(--text-muted)', fontSize: '12px', textAlign: 'center', lineHeight: 1.5,
        }}>
          By submitting you agree to be contacted by our team. No spam, no pressure.
        </p>
      </form>
    </div>
  );
}

function FormField({ label, name, type, placeholder, value, onChange, required, min, max }) {
  return (
    <div>
      <label style={{
        display: 'block', color: 'var(--text-secondary)',
        fontSize: '13px', fontWeight: 600, marginBottom: '8px',
      }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        style={{
          width: '100%', padding: '12px 16px', borderRadius: '12px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'var(--text-primary)', fontSize: '14px', outline: 'none',
          transition: 'border-color 0.2s', fontFamily: 'inherit',
        }}
        onFocus={e => e.target.style.borderColor = 'rgba(155,111,244,0.5)'}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
      />
    </div>
  );
}

function SuccessState({ form, navigate }) {
  return (
    <div style={{
      padding: '48px 40px', borderRadius: '28px', textAlign: 'center',
      background: 'linear-gradient(160deg, rgba(34,197,94,0.08), rgba(59,130,246,0.05))',
      border: '1px solid rgba(34,197,94,0.2)',
    }}>
      <div style={{
        width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 20px',
        background: 'rgba(34,197,94,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '36px',
      }}>
        ✅
      </div>
      <h2 style={{
        fontSize: '24px', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px',
      }}>
        You're booked, {form.parentName.split(' ')[0]}!
      </h2>
      <p style={{
        color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px',
      }}>
        We'll WhatsApp you at <strong style={{ color: 'var(--text-primary)' }}>{form.phone}</strong> within
        2 hours to confirm your <strong style={{ color: 'var(--text-primary)' }}>{form.timeSlot}</strong> slot.
      </p>

      <div style={{
        padding: '18px 20px', borderRadius: '14px', textAlign: 'left',
        background: 'rgba(26,26,38,0.8)', border: '1px solid rgba(255,255,255,0.08)',
        marginBottom: '28px',
      }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '12px', fontWeight: 700, marginBottom: '10px', letterSpacing: '0.06em' }}>
          WHAT HAPPENS NEXT
        </div>
        {[
          '📱 WhatsApp confirmation within 2 hours',
          '📧 Joining details sent to your email',
          "🎯 Your child's first mission is ready",
        ].map((step, i) => (
          <div key={i} style={{
            color: 'var(--text-primary)', fontSize: '14px', marginBottom: '8px',
          }}>{step}</div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a
          href={`https://wa.me/919999999999?text=Hi%2C+I+just+booked+a+demo+for+my+child.+My+name+is+${encodeURIComponent(form.parentName)}.`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '11px 22px', borderRadius: '50px',
            background: 'rgba(37,211,102,0.12)',
            border: '1px solid rgba(37,211,102,0.3)',
            color: '#25D366', fontWeight: 700, fontSize: '13px',
            textDecoration: 'none',
          }}
        >
          💬 Message Us on WhatsApp
        </a>
        <button
          onClick={() => navigate('/pricing')}
          style={{
            padding: '11px 22px', borderRadius: '50px',
            background: 'rgba(123,63,228,0.12)',
            border: '1px solid rgba(155,111,244,0.25)',
            color: '#9B6FF4', fontWeight: 700, fontSize: '13px', cursor: 'pointer',
          }}
        >
          See Pricing Plans
        </button>
      </div>
    </div>
  );
}
