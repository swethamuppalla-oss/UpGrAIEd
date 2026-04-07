import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { checkPhone, createReservation } from '../services/api';

const GRADE_OPTIONS = ['Grade 6', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];
const SOURCE_OPTIONS = ['School PTM', 'Friend / Family', 'Social Media', 'Google Search', 'Other'];

const initialForm = {
  parentName: '',
  childName: '',
  grade: '',
  phone: '',
  email: '',
  city: '',
  source: '',
};

const inputStyle = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.10)',
  color: 'var(--text)',
  outline: 'none',
};

const normalizePhone = (value = '') =>
  value.replace(/\s|-/g, '').replace(/^\+91/, '').trim();

const isEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const Field = ({ label, required, error, helper, children }) => (
  <div>
    <label className="mb-2 block text-[13px] font-medium text-[var(--text)]">
      {label}{required ? ' *' : ''}
    </label>
    {children}
    {helper && <p className="mt-1 text-[11px]" style={{ color: 'var(--text2)' }}>{helper}</p>}
    {error && <p className="mt-1 text-[12px]" style={{ color: 'var(--red)' }}>{error}</p>}
  </div>
);

export default function ReservePage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reservationId, setReservationId] = useState('');

  const normalizedPhone = useMemo(() => normalizePhone(form.phone), [form.phone]);

  const validate = async () => {
    const nextErrors = {};

    if (!form.parentName.trim()) nextErrors.parentName = 'Parent name is required';
    if (!form.childName.trim()) nextErrors.childName = 'Child name is required';
    if (!form.grade) nextErrors.grade = 'Please select a grade';
    if (!form.city.trim()) nextErrors.city = 'City is required';

    if (!form.phone.trim()) {
      nextErrors.phone = 'WhatsApp number is required';
    } else if (!/^\d{10}$/.test(normalizedPhone)) {
      nextErrors.phone = 'Enter a valid 10-digit WhatsApp number';
    }

    if (!form.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!isEmail(form.email.trim())) {
      nextErrors.email = 'Enter a valid email address';
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return false;
    }

    try {
      const check = await checkPhone(normalizedPhone);
      if (check.exists) {
        setErrors({ phone: 'A reservation with this number already exists' });
        return false;
      }
    } catch {
      // Let submission surface backend errors if the pre-check fails.
    }

    setErrors({});
    return true;
  };

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const valid = await validate();
    if (!valid) {
      toast.error('Please fix the highlighted fields');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        phone: normalizedPhone,
        parentName: form.parentName.trim(),
        childName: form.childName.trim(),
        email: form.email.trim().toLowerCase(),
        city: form.city.trim(),
      };
      const response = await createReservation(payload);
      setReservationId(response.reservationId);
      setSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to create reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-5 py-10" style={{ background: 'var(--dark)' }}>
      <style>{`
        @keyframes checkIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 50; }
          to { stroke-dashoffset: 0; }
        }
        @media (max-width: 480px) {
          .reserve-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <div className="pointer-events-none fixed" style={{ top: -120, left: -120, width: 400, height: 400, background: 'radial-gradient(circle, rgba(255,92,40,0.15) 0%, transparent 65%)', filter: 'blur(90px)' }} />
      <div className="pointer-events-none fixed" style={{ bottom: -120, right: -120, width: 350, height: 350, background: 'radial-gradient(circle, rgba(123,63,228,0.15) 0%, transparent 65%)', filter: 'blur(90px)' }} />
      <div className="pointer-events-none fixed" style={{ top: '40%', right: '10%', width: 250, height: 250, background: 'radial-gradient(circle, rgba(228,57,138,0.12) 0%, transparent 65%)', filter: 'blur(80px)' }} />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-[560px] flex-col items-center justify-center">
        <button type="button" onClick={() => navigate('/')} className="mb-2 cursor-pointer border-none bg-transparent p-0 font-clash text-[28px] font-bold grad-text">
          UpgrAIed
        </button>

        <div className="mb-6 rounded-full px-4 py-2 text-[12px] font-semibold" style={{ background: 'rgba(255,92,40,0.16)', color: 'var(--orange)' }}>
          🚀 Now enrolling — Grades 6–12
        </div>

        <h1 className="mb-3 text-center font-clash text-[36px] font-semibold text-[var(--text)]">
          Reserve Your Child&apos;s Place
        </h1>
        <p className="mb-2 text-center text-[15px]" style={{ color: 'var(--text2)', lineHeight: 1.6 }}>
          We&apos;ll WhatsApp you within 2 hours with full curriculum details and pricing.
        </p>
        <p className="mb-10 text-center text-[13px]" style={{ color: 'var(--text2)' }}>
          No payment now · No commitment · Free reservation
        </p>

        <div
          className="w-full transition-all duration-300"
          style={{ opacity: 1, transform: 'translateY(0)' }}
        >
          {!submitted ? (
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: 32,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
              }}
            >
              <form noValidate onSubmit={handleSubmit} className="space-y-[18px]">
                <div className="reserve-grid grid grid-cols-2 gap-3">
                  <Field label="Parent Name" required error={errors.parentName}>
                    <input value={form.parentName} onChange={(e) => handleChange('parentName', e.target.value)} placeholder="e.g. Priya Sharma" className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} />
                  </Field>
                  <Field label="Child Name" required error={errors.childName}>
                    <input value={form.childName} onChange={(e) => handleChange('childName', e.target.value)} placeholder="e.g. Arjun Kumar" className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} />
                  </Field>
                </div>

                <div className="reserve-grid grid grid-cols-2 gap-3">
                  <Field label="Child&apos;s Grade" required error={errors.grade}>
                    <select value={form.grade} onChange={(e) => handleChange('grade', e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}>
                      <option value="">Select grade</option>
                      {GRADE_OPTIONS.map((grade) => <option key={grade} value={grade}>{grade}</option>)}
                    </select>
                  </Field>
                  <Field label="City" required error={errors.city}>
                    <input value={form.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="e.g. Bengaluru" className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} />
                  </Field>
                </div>

                <Field label="WhatsApp Number" required error={errors.phone} helper="We&apos;ll send curriculum details on WhatsApp">
                  <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+91 98765 43210" className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} />
                </Field>

                <Field label="Email Address" required error={errors.email}>
                  <input value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="parent@email.com" className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle} />
                </Field>

                <Field label="How did you hear about us?" error={errors.source}>
                  <select value={form.source} onChange={(e) => handleChange('source', e.target.value)} className="w-full rounded-xl px-4 py-3 text-sm" style={inputStyle}>
                    <option value="">Select (optional)</option>
                    {SOURCE_OPTIONS.map((source) => <option key={source} value={source}>{source}</option>)}
                  </select>
                </Field>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl text-[16px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: 'var(--grad2)' }}
                >
                  {loading && <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                  {loading ? 'Reserving...' : 'Reserve My Child\'s Place →'}
                </button>

                <p className="text-center text-[12px]" style={{ color: 'var(--text2)' }}>
                  🔒 Your details are safe with us. We never share your information.
                </p>
              </form>
            </div>
          ) : (
            <div
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20,
                padding: 32,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                textAlign: 'center',
              }}
            >
              <div
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full"
                style={{
                  border: '2px solid var(--green)',
                  animation: 'checkIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <svg viewBox="0 0 24 24" width="36" height="36">
                  <path
                    d="M5 13l4 4L19 7"
                    fill="none"
                    stroke="var(--green)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="50"
                    strokeDashoffset="50"
                    style={{ animation: 'drawCheck 0.5s ease 0.3s forwards' }}
                  />
                </svg>
              </div>

              <h2 className="mt-5 mb-3 font-clash text-[28px] font-semibold text-[var(--text)]">
                You&apos;re on the list! 🎉
              </h2>
              <p className="mb-6 text-[15px]" style={{ color: 'var(--text2)', lineHeight: 1.6 }}>
                We&apos;ll WhatsApp {form.phone} within 2 hours with the full curriculum and pricing.
              </p>

              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  textAlign: 'left',
                }}
              >
                {[
                  '✅ Reservation confirmed',
                  '📞 Our team will call you within 2 hours',
                  '🎓 Your child\'s learning journey starts soon',
                ].map((line) => (
                  <div key={line} className="flex items-center gap-3 py-2 text-[14px]" style={{ color: 'var(--text2)' }}>
                    <span>{line.split(' ')[0]}</span>
                    <span>{line.slice(2)}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-[12px] font-mono" style={{ color: 'var(--text2)' }}>
                Reservation ID: {reservationId}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button type="button" onClick={() => navigate('/')} className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold" style={{ background: 'transparent', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  Back to Home
                </button>
                <button type="button" onClick={() => navigate('/login')} className="flex-1 rounded-xl px-4 py-3 text-sm font-semibold text-white" style={{ background: 'var(--grad2)' }}>
                  Go to Login
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
