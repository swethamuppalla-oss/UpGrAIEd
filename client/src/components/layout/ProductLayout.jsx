import { Link } from 'react-router-dom';

const PRODUCT_META = {
  ai: { name: 'UpGrAIEd', color: '#7B3FE4', bgTag: 'rgba(123,63,228,0.1)', border: 'rgba(123,63,228,0.12)' },
  ed: { name: 'UpGrEd',   color: '#6EDC5F', bgTag: 'rgba(110,220,95,0.12)', border: 'rgba(110,220,95,0.15)' },
};

export default function ProductLayout({ product = 'ai', children }) {
  const meta = PRODUCT_META[product];

  return (
    <div style={{ minHeight: '100vh', background: '#FFFFFF', color: '#0A1F12', fontFamily: 'inherit' }}>
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: 64,
        borderBottom: `1px solid ${meta.border}`,
        background: '#FFFFFF',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/" style={{ textDecoration: 'none', fontWeight: 800, fontSize: 17, color: '#0A1F12' }}>
            UpgrAIed
          </Link>
          <span style={{
            fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
            padding: '2px 10px', borderRadius: 20,
            background: meta.bgTag, color: meta.color,
            border: `1px solid ${meta.color}30`,
          }}>
            {meta.name}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          <Link to="/home" style={{ textDecoration: 'none', color: '#4B6B57', fontSize: 14, fontWeight: 500 }}>
            All Products
          </Link>
          <Link
            to="/login"
            style={{
              textDecoration: 'none', fontSize: 14, fontWeight: 600,
              padding: '8px 22px', borderRadius: 24,
              background: meta.color, color: product === 'ed' ? '#0A1F12' : '#fff',
            }}
          >
            Log in
          </Link>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}
