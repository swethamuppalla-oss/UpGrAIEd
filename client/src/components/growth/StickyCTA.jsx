import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WA_NUMBER = '919999999999';
const WA_MESSAGE = encodeURIComponent("Hi, I'd like to know more about UpgrAIed for my child.");

export default function StickyCTA() {
  const [showBar, setShowBar] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setShowBar(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* WhatsApp floating button */}
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`}
        target="_blank" rel="noopener noreferrer"
        style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 999,
          width: 58, height: 58, borderRadius: '50%',
          background: 'linear-gradient(135deg, #25D366, #128C7E)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
          boxShadow: '0 8px 32px rgba(37,211,102,0.50)',
          transition: 'transform 0.2s, box-shadow 0.2s', textDecoration: 'none',
        }}
        onMouseOver={e => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.boxShadow = '0 14px 44px rgba(37,211,102,0.65)'; }}
        onMouseOut={e => { e.currentTarget.style.transform = 'scale(1)';    e.currentTarget.style.boxShadow = '0 8px 32px rgba(37,211,102,0.50)'; }}
        title="Chat on WhatsApp"
      >💬</a>

    </>
  );
}
