import React from 'react';

/**
 * BloomGrid — responsive image grid with hover lift effect.
 *
 * Props:
 *   images      — array of string URLs
 *   columns     — number of columns (default 2)
 *   gap         — grid gap in px (default 12)
 *   aspectRatio — CSS aspect-ratio per tile (default '1/1')
 *   onImageClick — optional (index, url) => void
 */
export default function BloomGrid({
  images = [],
  columns = 2,
  gap = 12,
  aspectRatio = '1/1',
  onImageClick,
}) {
  if (!images.length) return null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap,
        borderRadius: 'var(--radius-card, 16px)',
        overflow: 'hidden',
      }}
    >
      {images.map((src, i) => (
        <div
          key={i}
          className="bloom-grid-tile"
          style={{ aspectRatio, cursor: onImageClick ? 'pointer' : 'default' }}
          onClick={() => onImageClick?.(i, src)}
        >
          <img src={src} alt="" loading="lazy" />
        </div>
      ))}
    </div>
  );
}
