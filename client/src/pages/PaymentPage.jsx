import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { createPaymentOrder, getPaymentStatus, verifyPayment } from '../services/api';

const topOrbStyle = {
  top: -140,
  right: -120,
  width: 400,
  height: 400,
  background: 'radial-gradient(circle, rgba(123, 63, 228, 0.15) 0%, transparent 65%)',
  filter: 'blur(90px)',
};

const bottomOrbStyle = {
  bottom: -120,
  left: -120,
  width: 350,
  height: 350,
  background: 'radial-gradient(circle, rgba(255, 92, 40, 0.15) 0%, transparent 65%)',
  filter: 'blur(90px)',
};

const glassCardStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 20,
  padding: 32,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
};

const formatCurrency = (amount = 0) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);

const getLevelsIncluded = (programme) => (programme === 'Senior' ? 4 : 7);

const StatusStep = ({ icon, text, tone, active }) => {
  const backgroundMap = {
    green: 'rgba(76,217,100,0.16)',
    orange: 'rgba(255,149,0,0.16)',
    gray: 'rgba(255,255,255,0.08)',
  };

  const colorMap = {
    green: 'var(--green)',
    orange: 'var(--orange)',
    gray: 'var(--text3)',
  };

  return (
    <div className="flex items-center gap-3">
      <span
        className={active ? 'animate-pulse' : ''}
        style={{
          width: 20,
          height: 20,
          borderRadius: 999,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: backgroundMap[tone],
          color: colorMap[tone],
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {icon}
      </span>
      <span style={{ color: 'var(--text2)', fontSize: 14 }}>{text}</span>
    </div>
  );
};

export default function PaymentPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pageState, setPageState] = useState('checking');
  const [reservationData, setReservationData] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkPaymentStatus = async ({ silent = false } = {}) => {
    try {
      const data = await getPaymentStatus();

      if (data.status === 'none') {
        navigate('/reserve', { replace: true });
        return;
      }

      if (data.status === 'paid') {
        navigate('/dashboard/parent', { replace: true });
        return;
      }

      setReservationData(data);

      if (data.status === 'approved') {
        if (pageState === 'pending' && !silent) {
          toast.success('Payment link activated!');
        }
        setPageState('payment');
        return;
      }

      setPageState('pending');
    } catch (error) {
      if (!silent) {
        toast.error(error?.response?.data?.error?.message || 'Could not check your reservation right now');
      }
      setPageState('pending');
    }
  };

  useEffect(() => {
    checkPaymentStatus({ silent: true });
  }, []);

  useEffect(() => {
    if (pageState !== 'pending') return undefined;

    const interval = setInterval(() => {
      checkPaymentStatus();
    }, 60000);

    return () => clearInterval(interval);
  }, [pageState]);

  const pricing = reservationData?.pricing || null;
  const programmeLevels = getLevelsIncluded(reservationData?.programme);

  const successRows = useMemo(
    () => [
      `${formatCurrency(pricing?.total || 0)} paid successfully`,
      `GST invoice sent to ${reservationData?.email || ''}`,
      `${reservationData?.childName || 'Your child'} can now access all ${programmeLevels} levels`,
      `Login details sent to ${reservationData?.email || ''}`,
    ],
    [pricing?.total, programmeLevels, reservationData?.childName, reservationData?.email]
  );

  const handlePaymentSuccess = async (razorpayResponse) => {
    try {
      const verification = await verifyPayment({
        razorpay_order_id: razorpayResponse.razorpay_order_id,
        razorpay_payment_id: razorpayResponse.razorpay_payment_id,
        razorpay_signature: razorpayResponse.razorpay_signature,
      });

      if (verification?.transactionId) {
        setOrderId(verification.transactionId);
      }
      setPageState('success');
    } catch (error) {
      toast.error(error?.response?.data?.error?.message || 'Payment verification failed. Contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      const orderData = await createPaymentOrder();
      setOrderId(orderData.orderId);

      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded');
      }

      const brandPurple =
        getComputedStyle(document.documentElement).getPropertyValue('--purple').trim() || '#7B3FE4';

      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'UpgrAIed',
        description: `Lifetime Access - ${reservationData.grade}`,
        image: '',
        handler: handlePaymentSuccess,
        prefill: {
          name: reservationData.parentName,
          email: reservationData.email,
          contact: reservationData.phone,
        },
        notes: {
          grade: reservationData.grade,
          childName: reservationData.childName,
        },
        theme: {
          color: brandPurple,
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setLoading(false);
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.error?.message || 'Could not initiate payment. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-5 py-10" style={{ background: 'var(--dark)' }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes checkIn {
          from { transform: scale(0); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 50; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes confetti {
          from { transform: translate(0, 0) scale(1); opacity: 1; }
          to { transform: translate(var(--tx), var(--ty)) scale(0.4); opacity: 0; }
        }
      `}</style>

      <div className="pointer-events-none fixed" style={topOrbStyle} />
      <div className="pointer-events-none fixed" style={bottomOrbStyle} />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-80px)] max-w-[600px] flex-col">
        <div className="mb-10 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="border-none bg-transparent p-0 font-clash text-[28px] font-bold grad-text"
          >
            UpgrAIed
          </button>

          <div className="flex items-center gap-3">
            <span className="hidden text-[14px] sm:inline" style={{ color: 'var(--text2)' }}>
              {user?.name}
            </span>
            <button
              type="button"
              onClick={() => navigate('/dashboard/parent')}
              className="rounded-xl px-3 py-2 text-sm font-semibold"
              style={{
                background: 'transparent',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              {'<- Back to Dashboard'}
            </button>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          {pageState === 'checking' && (
            <div className="text-center">
              <div
                style={{
                  width: 40,
                  height: 40,
                  border: '3px solid var(--border)',
                  borderTopColor: 'var(--purple)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                  margin: '0 auto',
                }}
              />
              <p className="mt-4 text-[14px]" style={{ color: 'var(--text2)' }}>
                Checking your reservation...
              </p>
            </div>
          )}

          {pageState === 'pending' && (
            <div style={{ ...glassCardStyle, textAlign: 'center' }}>
              <div style={{ fontSize: 64, marginBottom: 20 }}>...</div>
              <h1 className="mb-4 font-clash text-[28px] font-semibold text-[var(--text)]">
                Your reservation is being reviewed
              </h1>
              <p className="mb-6 text-[15px]" style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
                Our team will review your reservation and WhatsApp you within 2 hours to confirm your child&apos;s
                enrolment and share pricing.
              </p>

              <div className="mx-auto flex max-w-[340px] flex-col gap-4 text-left">
                <StatusStep icon="OK" text="Reservation received" tone="green" />
                <StatusStep icon=".." text="Team review in progress" tone="orange" active />
                <StatusStep icon="L" text="Payment link activated" tone="gray" />
                <StatusStep icon="A" text="Access granted" tone="gray" />
              </div>

              <p className="mt-6 text-[12px]" style={{ color: 'var(--text2)' }}>
                This page updates automatically every 60 seconds.
              </p>
              <button
                type="button"
                onClick={() => checkPaymentStatus()}
                className="mt-3 rounded-xl px-4 py-2 text-sm font-semibold"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--border)',
                  color: 'var(--text)',
                }}
              >
                Refresh Now
              </button>
            </div>
          )}

          {pageState === 'payment' && reservationData && (
            <div className="w-full space-y-6">
              <div className="rounded-[20px] p-[1px]" style={{ background: 'linear-gradient(135deg, var(--orange), var(--purple))' }}>
                <div
                  className="flex flex-col gap-5 rounded-[19px] p-6 md:flex-row md:items-start md:justify-between"
                  style={{ background: 'rgba(15,11,28,0.95)' }}
                >
                  <div className="min-w-0 flex-1">
                    <span
                      className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em]"
                      style={{ background: 'rgba(76,217,100,0.16)', color: 'var(--green)' }}
                    >
                      Lifetime Access
                    </span>
                    <h1 className="mb-2 mt-4 font-clash text-[24px] font-semibold text-[var(--text)]">
                      {reservationData.programme} Programme
                    </h1>
                    <p className="mb-4 text-[16px]" style={{ color: 'var(--text2)' }}>
                      {reservationData.grade}
                    </p>
                    <div style={{ height: 1, background: 'var(--border)', marginBottom: 16 }} />

                    <div className="space-y-3 text-[14px]" style={{ color: 'var(--text2)' }}>
                      <div>All {programmeLevels} levels included</div>
                      <div>66 modules</div>
                      <div>New content added weekly</div>
                      <div>Lifetime access - pay once, learn forever</div>
                      <div>Certificate on completion</div>
                    </div>
                  </div>

                  <div
                    className="w-full md:w-[180px]"
                    style={{
                      flexShrink: 0,
                      borderRadius: 16,
                      padding: 24,
                      textAlign: 'center',
                      background: 'rgba(123,63,228,0.12)',
                      border: '1px solid rgba(123,63,228,0.25)',
                    }}
                  >
                    {pricing ? (
                      <>
                        <div className="font-clash text-[40px] font-bold grad-text">
                          {formatCurrency(pricing.base)}
                        </div>
                        <p className="mb-0 mt-1 text-[12px]" style={{ color: 'var(--text2)' }}>
                          One-time payment
                        </p>
                        <p className="mb-0 mt-2 text-[11px]" style={{ color: 'var(--text2)' }}>
                          + {formatCurrency(pricing.gst)} GST (18%)
                        </p>
                        <div
                          style={{
                            marginTop: 8,
                            paddingTop: 8,
                            borderTop: '1px solid var(--border)',
                            color: 'var(--text)',
                            fontSize: 14,
                            fontWeight: 600,
                          }}
                        >
                          Total: {formatCurrency(pricing.total)}
                        </div>
                      </>
                    ) : (
                      <div className="space-y-3">
                        <div className="mx-auto animate-pulse" style={{ width: 110, height: 40, borderRadius: 12, background: 'rgba(255,255,255,0.08)' }} />
                        <div className="mx-auto animate-pulse" style={{ width: 100, height: 12, borderRadius: 8, background: 'rgba(255,255,255,0.08)' }} />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={glassCardStyle}>
                <div
                  className="flex items-center justify-between gap-4"
                  style={{ borderBottom: '1px solid var(--border)', padding: '14px 0' }}
                >
                  <span style={{ color: 'var(--text3)', fontSize: 14 }}>Parent</span>
                  <span style={{ color: 'var(--text)', fontSize: 14 }}>{reservationData.parentName}</span>
                </div>
                <div
                  className="flex items-center justify-between gap-4"
                  style={{ borderBottom: '1px solid var(--border)', padding: '14px 0' }}
                >
                  <span style={{ color: 'var(--text3)', fontSize: 14 }}>Student</span>
                  <span style={{ color: 'var(--text)', fontSize: 14 }}>
                    {reservationData.childName} - {reservationData.grade}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 pt-[14px]">
                  <span style={{ color: 'var(--text3)', fontSize: 14 }}>Programme</span>
                  <span style={{ color: 'var(--text)', fontSize: 14 }}>{reservationData.programme}</span>
                </div>
              </div>

              <div style={glassCardStyle}>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={loading}
                  className="flex h-[56px] w-full items-center justify-center gap-2 rounded-xl text-[17px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ background: 'var(--grad2)' }}
                >
                  {loading && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  )}
                  {loading ? 'Processing...' : `Pay ${formatCurrency(pricing?.total || 0)} with Razorpay ->`}
                </button>
                <p className="mt-3 text-center text-[12px]" style={{ color: 'var(--text3)' }}>
                  Secured by Razorpay - 256-bit SSL encryption
                </p>
                <p className="mt-2 text-center text-[12px]" style={{ color: 'var(--text3)' }}>
                  Accepts UPI - Cards - Net Banking - Wallets
                </p>
              </div>
            </div>
          )}

          {pageState === 'success' && reservationData && (
            <div style={{ ...glassCardStyle, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              {[
                { color: 'var(--orange)', tx: '-80px', ty: '-40px', delay: '0s' },
                { color: 'var(--purple)', tx: '90px', ty: '-30px', delay: '0.05s' },
                { color: 'var(--pink)', tx: '60px', ty: '70px', delay: '0.1s' },
                { color: 'var(--orange)', tx: '-70px', ty: '80px', delay: '0.15s' },
                { color: 'var(--purple)', tx: '0px', ty: '-90px', delay: '0.2s' },
              ].map((dot, index) => (
                <span
                  key={index}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '34%',
                    width: 8,
                    height: 8,
                    borderRadius: 999,
                    background: dot.color,
                    '--tx': dot.tx,
                    '--ty': dot.ty,
                    animation: `confetti 0.8s ease-out ${dot.delay} forwards`,
                  }}
                />
              ))}

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

              <h1 className="mb-3 mt-5 font-clash text-[32px] font-semibold grad-text">
                Welcome to UpgrAIed!
              </h1>
              <p className="mb-6 text-[15px]" style={{ color: 'var(--text2)', lineHeight: 1.6 }}>
                Payment successful. {reservationData.childName}&apos;s lifetime access has been activated.
              </p>

              <div
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  padding: '16px 20px',
                  textAlign: 'left',
                }}
              >
                {successRows.map((line) => (
                  <div key={line} className="py-2 text-[14px]" style={{ color: 'var(--text2)' }}>
                    {line}
                  </div>
                ))}
                {orderId && (
                  <p className="mb-0 mt-3 font-mono text-[12px]" style={{ color: 'var(--text3)' }}>
                    Reference ID: {orderId}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => navigate('/dashboard/parent')}
                className="mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-white"
                style={{ background: 'var(--grad2)' }}
              >
                {'Go to Dashboard ->'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
