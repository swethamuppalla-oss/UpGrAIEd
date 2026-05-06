import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BloomCharacter from '../../components/Bloom/BloomCharacter';

const WELCOME = {
  id: 0,
  from: 'bloom',
  text: "Hey! I'm Bloom, your AI tutor. Ask me anything — I'm here to help you really understand, not just memorize.",
};

export default function AITutor() {
  const nav = useNavigate();
  const [messages, setMessages] = useState([WELCOME]);
  const [input, setInput] = useState('');
  const [bloomEmotion, setBloomEmotion] = useState('happy');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function send() {
    const text = input.trim();
    if (!text) return;

    setBloomEmotion('thinking');
    setMessages(m => [...m, { id: Date.now(), from: 'user', text }]);
    setInput('');

    setTimeout(() => {
      setBloomEmotion('happy');
      setMessages(m => [
        ...m,
        { id: Date.now(), from: 'bloom', text: '🤔 Thinking... (AI responses coming soon — backend integration in progress!)' },
      ]);
    }, 800);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#F5F0FF', color: '#0A1F12' }}>
      {/* Header */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: '0 24px', height: 64,
        background: '#FFFFFF', borderBottom: '1px solid rgba(123,63,228,0.14)',
        position: 'sticky', top: 0, zIndex: 10, flexShrink: 0,
      }}>
        <button
          onClick={() => nav('/upgr-ai')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#4B6B57', fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', gap: 4, padding: 0,
          }}
        >
          ← Back
        </button>

        <div style={{ width: 1, height: 20, background: 'rgba(123,63,228,0.15)' }} />

        <BloomCharacter emotion={bloomEmotion} size="tiny" animate />
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#0A1F12' }}>Bloom</div>
          <div style={{ fontSize: 11, color: '#7B3FE4', fontWeight: 600 }}>AI Tutor · online</div>
        </div>
      </header>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '28px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}
          >
            <div style={{
              maxWidth: '72%', padding: '12px 16px', borderRadius: 16,
              background: msg.from === 'user' ? '#7B3FE4' : '#FFFFFF',
              color: msg.from === 'user' ? '#fff' : '#0A1F12',
              border: msg.from === 'bloom' ? '1px solid rgba(123,63,228,0.12)' : 'none',
              fontSize: 14, lineHeight: 1.65,
              borderBottomLeftRadius: msg.from === 'bloom' ? 4 : 16,
              borderBottomRightRadius: msg.from === 'user' ? 4 : 16,
              boxShadow: msg.from === 'bloom' ? '0 2px 8px rgba(10,31,18,0.05)' : 'none',
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        padding: '14px 20px',
        background: '#FFFFFF', borderTop: '1px solid rgba(123,63,228,0.12)',
        display: 'flex', gap: 10, flexShrink: 0,
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask Bloom anything..."
          style={{
            flex: 1, padding: '12px 18px', borderRadius: 24,
            border: '1.5px solid rgba(123,63,228,0.2)', outline: 'none',
            fontSize: 14, background: '#F5F0FF', color: '#0A1F12',
            transition: 'border-color 0.15s',
          }}
          onFocus={e => (e.target.style.borderColor = '#7B3FE4')}
          onBlur={e => (e.target.style.borderColor = 'rgba(123,63,228,0.2)')}
        />
        <button
          onClick={send}
          style={{
            background: '#7B3FE4', color: '#fff', border: 'none',
            padding: '12px 22px', borderRadius: 24, cursor: 'pointer',
            fontSize: 14, fontWeight: 600, flexShrink: 0,
            boxShadow: '0 2px 12px rgba(123,63,228,0.3)',
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
