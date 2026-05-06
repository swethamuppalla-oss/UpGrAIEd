import { useState } from 'react';
import { useAdminMode } from '../../hooks/useAdminMode';
import './EditableImage.scss';

const FALLBACK = '/placeholder.png';

function compressImage(file, quality = 0.6) {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d');
    const img    = new Image();
    const url    = URL.createObjectURL(file);

    img.onload = () => {
      canvas.width  = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.src = url;
  });
}

export default function EditableImage({
  src,
  alt = '',
  onSave,
  className = '',
  style,
  storageKey,
}) {
  const { isAdmin } = useAdminMode();
  const [preview, setPreview]     = useState(() =>
    storageKey ? (localStorage.getItem(storageKey) || null) : null
  );
  const [uploading, setUploading] = useState(false);

  const displayed = preview ?? src ?? FALLBACK;

  const handleChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const compressed = await compressImage(file);
    setPreview(compressed);

    if (storageKey) {
      try { localStorage.setItem(storageKey, compressed); } catch { /* quota exceeded */ }
    }

    setUploading(true);
    try {
      await onSave(file, compressed);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleError = (e) => { e.target.src = FALLBACK; };

  if (!isAdmin) {
    return (
      <img
        src={displayed}
        alt={alt}
        className={`ei__img ${className}`}
        style={style}
        onError={handleError}
      />
    );
  }

  return (
    <div
      className={`ei ei--editable${uploading ? ' ei--uploading' : ''} ${className}`}
      style={style}
    >
      <img
        src={displayed}
        alt={alt}
        className="ei__img"
        onError={handleError}
      />

      <div className="ei__overlay">
        {uploading ? (
          <>
            <div className="ei__spinner" />
            <span className="ei__overlay-label">Uploading…</span>
          </>
        ) : (
          <>
            <span className="ei__overlay-icon">📷</span>
            <span className="ei__overlay-label">Replace image</span>
            <span className="ei__overlay-sub">Click to upload</span>
          </>
        )}
      </div>

      {!uploading && (
        <input
          type="file"
          accept="image/*"
          className="ei__file-input"
          onChange={handleChange}
          aria-label="Replace image"
        />
      )}
    </div>
  );
}
