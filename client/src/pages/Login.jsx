import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp, adminLogin, demoLogin } from '../services/auth';

// ─── role → dashboard route ───────────────────────────────────────────────────
const ROLE_ROUTE = {
  student: '/dashboard/student',
  parent:  '/dashboard/parent',
  creator: '/dashboard/creator',
  admin:   '/dashboard/admin',
};

// ─── Demo account definitions ─────────────────────────────────────────────────
const DEMO_ACCOUNTS = [
  { role: 'student', emoji: '🎓', name: 'Arjun K.',  sub: 'Student · Grade 8',    tint: 'orange' },
  { role: 'parent',  emoji: '👩‍👦', name: 'Priya S.',  sub: 'Parent Account',        tint: 'pink'   },
  { role: 'creator', emoji: '🎬', name: 'Rahul M.',  sub: 'Content Creator',       tint: 'green'  },
  { role: 'admin',   emoji: '🛡️', name: 'Admin',     sub: 'Platform Admin',        tint: 'purple' },
];

const TINT = {
  orange: 'border-[#FF5C28]/30 hover:bg-[#FF5C28]/10 hover:border-[#FF5C28]/60',
  pink:   'border-[#E4398A]/30 hover:bg-[#E4398A]/10 hover:border-[#E4398A]/60',
  green:  'border-green-500/30  hover:bg-green-500/10  hover:border-green-500/60',
  purple: 'border-[#7B3FE4]/30 hover:bg-[#7B3FE4]/10 hover:border-[#7B3FE4]/60',
};

const EMOJI_BG = {
  orange: 'bg-[#FF5C28]/15',
  pink:   'bg-[#E4398A]/15',
  green:  'bg-green-500/15',
  purple: 'bg-[#7B3FE4]/15',
};

// ─── Reusable input ───────────────────────────────────────────────────────────
const Field = ({ label, ...props }) => (
  <div>
    {label && (
      <label className="block text-xs font-medium text-[var(--text2)] uppercase tracking-wider mb-1.5">
        {label}
      </label>
    )}
    <input
      className="
        w-full rounded-xl border border-white/10 bg-white/[0.06]
        px-4 py-3 text-sm text-[var(--text)] placeholder:text-white/25
        focus:outline-none focus:border-[#7B3FE4]/70 focus:bg-white/[0.08]
        transition-all duration-200
      "
      {...props}
    />
  </div>
);

// ─── Gradient primary button ──────────────────────────────────────────────────
const PrimaryBtn = ({ children, loading, className = '', ...props }) => (
  <button
    disabled={loading}
    className={`
      relative w-full rounded-xl py-3 text-sm font-semibold text-white
      bg-gradient-to-r from-[#FF5C28] via-[#7B3FE4] to-[#E4398A]
      hover:opacity-90 active:scale-[0.99] transition-all duration-200
      disabled:opacity-50 disabled:cursor-not-allowed
      flex items-center justify-center gap-2 ${className}
    `}
    {...props}
  >
    {loading && (
      <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
    )}
    {children}
  </button>
);

// ─── Inline error ─────────────────────────────────────────────────────────────
const Error = ({ msg }) =>
  msg ? <p className="text-sm text-[#E4398A] mt-1">{msg}</p> : null;

// ─── Main component ───────────────────────────────────────────────────────────
export default function Login() {
  const navigate    = useNavigate();
  const { login }   = useAuth();

  const [tab,      setTab]      = useState('user');   // 'user' | 'admin'
  const [email,    setEmail]    = useState('');
  const [otp,      setOtp]      = useState('');
  const [password, setPassword] = useState('');
  const [otpSent,  setOtpSent]  = useState(false);
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState('');       // 'sendOtp'|'signIn'|'admin'|role
  const [devOtp,   setDevOtp]   = useState('');

  const clearError = () => setError('');

  // AuthContext.login expects (userData, jwtToken)
  const handleSuccess = (token, user) => {
    login(user, token);
    navigate(ROLE_ROUTE[user.role] ?? '/login', { replace: true });
  };

  // ── Send OTP ────────────────────────────────────────────────────────────────
  const handleSendOtp = async () => {
    clearError();
    if (!email.trim()) { setError('Please enter your email address.'); return; }
    setLoading('sendOtp');
    try {
      const res = await sendOtp(email.trim().toLowerCase());
      setOtpSent(true);
      if (res.data.otp) setDevOtp(res.data.otp); // dev mode only
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to send OTP. Try again.');
    } finally {
      setLoading('');
    }
  };

  // ── Verify OTP → sign in ────────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault();
    clearError();
    if (!email.trim())  { setError('Email is required.'); return; }
    if (!otp.trim())    { setError('Enter the OTP sent to your email.'); return; }
    setLoading('signIn');
    try {
      const res = await verifyOtp(email.trim().toLowerCase(), otp.trim());
      handleSuccess(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading('');
    }
  };

  // ── Admin login ─────────────────────────────────────────────────────────────
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    clearError();
    if (!email.trim() || !password) { setError('Email and password are required.'); return; }
    setLoading('admin');
    try {
      const res = await adminLogin(email.trim().toLowerCase(), password);
      handleSuccess(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Invalid credentials.');
    } finally {
      setLoading('');
    }
  };

  // ── Demo login ──────────────────────────────────────────────────────────────
  const handleDemo = async (role) => {
    clearError();
    setLoading(role);
    try {
      const res = await demoLogin(role);
      handleSuccess(res.data.token, res.data.user);
    } catch {
      // Fallback: UI-only demo if server unreachable
      const names = { student: 'Arjun Kumar', parent: 'Priya Sharma', creator: 'Rahul Mehta', admin: 'Admin' };
      const fakeUser  = { _id: `demo-${role}`, name: names[role], role, email: `demo-${role}@upgraied.com` };
      const fakeToken = `demo_token_${role}_${Date.now()}`;
      handleSuccess(fakeToken, fakeUser);
    } finally {
      setLoading('');
    }
  };

  const switchTab = (t) => {
    setTab(t);
    setError('');
    setOtpSent(false);
    setOtp('');
    setDevOtp('');
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
         style={{ background: '#08060F' }}>

      {/* ── Floating orbs ─────────────────────────────────────────────────── */}
      <div className="pointer-events-none fixed"
           style={{ top: '-120px', left: '-120px', width: 480, height: 480,
                    background: 'radial-gradient(circle, rgba(255,92,40,0.18) 0%, transparent 65%)',
                    filter: 'blur(90px)' }} />
      <div className="pointer-events-none fixed"
           style={{ bottom: '-120px', right: '-120px', width: 480, height: 480,
                    background: 'radial-gradient(circle, rgba(123,63,228,0.18) 0%, transparent 65%)',
                    filter: 'blur(90px)' }} />
      <div className="pointer-events-none fixed"
           style={{ top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    width: 480, height: 480,
                    background: 'radial-gradient(circle, rgba(228,57,138,0.18) 0%, transparent 65%)',
                    filter: 'blur(90px)' }} />

      {/* ── Logo ──────────────────────────────────────────────────────────── */}
      <div className="mb-8 text-center relative z-10">
        <h1 className="font-clash text-[2.75rem] font-bold tracking-tight grad-text leading-none">
          UpgrAIed
        </h1>
        <p className="mt-2 text-sm" style={{ color: 'var(--text2)' }}>
          AI-powered learning for Grades 6–12
        </p>
      </div>

      {/* ── Card ──────────────────────────────────────────────────────────── */}
      <div className="relative z-10 w-full"
           style={{ maxWidth: 440 }}>
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 24,
          padding: '32px 32px 28px',
        }}>

          {/* ── Tabs ──────────────────────────────────────────────────────── */}
          <div className="flex mb-7 rounded-xl overflow-hidden"
               style={{ background: 'rgba(255,255,255,0.05)', padding: 4, gap: 4 }}>
            {[
              { id: 'user',  label: 'Student / Parent / Creator' },
              { id: 'admin', label: 'Admin' },
            ].map(({ id, label }) => (
              <button
                key={id}
                onClick={() => switchTab(id)}
                className={`
                  flex-1 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200
                  ${tab === id
                    ? 'bg-gradient-to-r from-[#FF5C28] via-[#7B3FE4] to-[#E4398A] text-white shadow-lg'
                    : 'text-[var(--text2)] hover:text-[var(--text)]'}
                `}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── User/OTP tab ───────────────────────────────────────────────── */}
          {tab === 'user' && (
            <form onSubmit={handleSignIn} className="flex flex-col gap-4" noValidate>
              <Field
                label="Email address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); clearError(); }}
                autoFocus
              />

              {/* OTP row: input + Send OTP button side by side */}
              <div>
                <label className="block text-xs font-medium text-[var(--text2)] uppercase tracking-wider mb-1.5">
                  One-time password
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6-digit OTP"
                    value={otp}
                    onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); clearError(); }}
                    className="
                      flex-1 rounded-xl border border-white/10 bg-white/[0.06]
                      px-4 py-3 text-sm text-[var(--text)] placeholder:text-white/25
                      focus:outline-none focus:border-[#7B3FE4]/70 focus:bg-white/[0.08]
                      transition-all duration-200 font-mono tracking-widest
                    "
                  />
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading === 'sendOtp'}
                    className="
                      shrink-0 rounded-xl border border-white/10 bg-white/[0.06]
                      px-4 py-3 text-xs font-semibold text-[var(--text2)]
                      hover:bg-white/[0.12] hover:text-[var(--text)] hover:border-white/20
                      active:scale-95 transition-all duration-200
                      disabled:opacity-50 disabled:cursor-not-allowed
                      flex items-center gap-1.5 whitespace-nowrap
                    "
                  >
                    {loading === 'sendOtp'
                      ? <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      : null}
                    {otpSent ? 'Resend OTP' : 'Send OTP'}
                  </button>
                </div>

                {/* Dev-mode OTP hint */}
                {devOtp && (
                  <p className="mt-1.5 text-xs" style={{ color: '#7B3FE4' }}>
                    Dev — OTP: <span className="font-mono font-bold">{devOtp}</span>
                  </p>
                )}
                {otpSent && !devOtp && (
                  <p className="mt-1.5 text-xs text-green-400">OTP sent! Check your email.</p>
                )}
              </div>

              <Error msg={error} />

              <PrimaryBtn loading={loading === 'signIn'} type="submit" className="mt-1">
                Sign In
              </PrimaryBtn>
            </form>
          )}

          {/* ── Admin tab ─────────────────────────────────────────────────── */}
          {tab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="flex flex-col gap-4" noValidate>
              <Field
                label="Admin email"
                type="email"
                placeholder="admin@upgraied.com"
                value={email}
                onChange={e => { setEmail(e.target.value); clearError(); }}
                autoFocus
              />
              <Field
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => { setPassword(e.target.value); clearError(); }}
              />

              <Error msg={error} />

              <PrimaryBtn loading={loading === 'admin'} type="submit" className="mt-1">
                Sign In as Admin
              </PrimaryBtn>
            </form>
          )}

          {/* ── Divider ───────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            <span className="text-xs" style={{ color: 'var(--text2)' }}>Try a demo account</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
          </div>

          {/* ── Demo accounts 2×2 grid ────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-2.5">
            {DEMO_ACCOUNTS.map(({ role, emoji, name, sub, tint }) => (
              <button
                key={role}
                onClick={() => handleDemo(role)}
                disabled={!!loading}
                className={`
                  flex items-center gap-3 rounded-xl border p-3
                  transition-all duration-200 text-left
                  disabled:opacity-50 disabled:cursor-not-allowed
                  active:scale-[0.97] ${TINT[tint]}
                `}
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <span className={`text-xl shrink-0 flex items-center justify-center w-9 h-9 rounded-lg ${EMOJI_BG[tint]}`}>
                  {loading === role
                    ? <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    : emoji}
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold text-[var(--text)] truncate">{name}</span>
                  <span className="block text-[10px]" style={{ color: 'var(--text2)' }}>{sub}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <p className="relative z-10 mt-8 text-xs" style={{ color: 'var(--text2)' }}>
        © {new Date().getFullYear()} D Kalash (OPC) Private Limited, Bengaluru
      </p>
    </div>
  );
}
