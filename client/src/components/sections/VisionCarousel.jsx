import React, { useState } from 'react';

const ITEMS = [
  'Build thinking-first learners',
  'Replace memorization with understanding',
  'Make AI a learning partner',
  'Empower parents with visibility',
];

export default function VisionCarousel() {
  const [index, setIndex] = useState(0);

  return (
    <div className="carousel">
      <div className="carousel-content">
        {ITEMS[index]}
      </div>

      <div className="carousel-controls">
        {ITEMS.map((_, i) => (
          <button key={i} onClick={() => setIndex(i)} aria-label={`Go to item ${i + 1}`} />
        ))}
      </div>
    </div>
  );
}
