import React, { useEffect, useState } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { BLOOM_GRID } from '../../config/defaults';
import { getContent } from '../../services'

export default function BloomGrid() {
  const config = useConfig();
  const [section, setSection] = useState(null);

  useEffect(() => {
    getContent('bloomGrid').then(data => { if (data) setSection(data); });
  }, []);

  // content_sections doc → items array; fall back to config.bloomGrid images → BLOOM_GRID strings
  const items = section?.items?.length
    ? section.items
    : config.bloomGrid?.length
      ? config.bloomGrid.map(url => ({ type: 'image', url, label: '' }))
      : BLOOM_GRID.map(url => ({ type: 'image', url, label: '' }));

  const title = section?.title || '';

  return (
    <div>
      {title && (
        <h2 style={{ textAlign: 'center', color: '#0A1F12', marginBottom: 24, fontSize: 28, fontWeight: 700 }}>
          {title}
        </h2>
      )}
      <div className="bloom-grid">
        {items.map((item, i) => (
          <div key={i} className="bloom-grid-item" style={{ position: 'relative' }}>
            {item.type === 'video' ? (
              <video autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                <source src={item.url} type="video/mp4" />
              </video>
            ) : (
              <img src={item.url || item} alt={item.label || ''} />
            )}
            {item.label && (
              <p style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                margin: 0, padding: '6px 10px',
                background: 'rgba(10,31,18,0.65)',
                color: '#FFFFFF', fontSize: 12, fontWeight: 600,
                borderRadius: '0 0 12px 12px',
              }}>
                {item.label}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
