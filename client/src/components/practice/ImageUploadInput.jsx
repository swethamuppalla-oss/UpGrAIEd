import { useRef, useState } from 'react';
import { uploadImage } from '../../services/api';

const PHASE = { IDLE: 'idle', PREVIEW: 'preview', EXTRACTING: 'extracting', EXTRACTED: 'extracted' };

export default function ImageUploadInput({ answer, onAnswer, disabled }) {
  const [phase, setPhase] = useState(PHASE.IDLE);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [extractError, setExtractError] = useState(null);
  const fileRef = useRef(null);

  function handleFileChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
    setPhase(PHASE.PREVIEW);
    setExtractError(null);
    e.target.value = '';
  }

  function retake() {
    setPhase(PHASE.IDLE);
    setFile(null);
    setPreviewUrl(null);
    onAnswer('');
    setExtractError(null);
  }

  async function extract() {
    if (!file) return;
    setPhase(PHASE.EXTRACTING);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { extractedText } = await uploadImage(fd);
      onAnswer(extractedText);
      setPhase(PHASE.EXTRACTED);
    } catch (err) {
      setExtractError(err.message || 'Could not read image. Try a clearer photo.');
      setPhase(PHASE.PREVIEW);
    }
  }

  if (phase === PHASE.IDLE) {
    return (
      <div className="practice__answer">
        <span className="practice__answer-label">Upload your written answer</span>
        <button
          type="button"
          className="practice__upload-zone"
          onClick={() => fileRef.current?.click()}
          disabled={disabled}
        >
          <span className="practice__upload-zone-icon">📷</span>
          <span className="practice__upload-zone-text">Take a photo or click to upload</span>
          <span className="practice__upload-zone-sub">Photograph your handwritten answer</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    );
  }

  if (phase === PHASE.PREVIEW) {
    return (
      <div className="practice__answer">
        <span className="practice__answer-label">Check your photo</span>
        <div className="practice__upload-preview">
          <img src={previewUrl} alt="Your answer preview" className="practice__upload-preview-img" />
        </div>
        {extractError && <p className="practice__upload-error">{extractError}</p>}
        <div className="practice__upload-actions">
          <button type="button" className="practice__btn practice__btn--ghost" onClick={retake}>
            Retake
          </button>
          <button type="button" className="practice__btn" onClick={extract}>
            Read my answer
          </button>
        </div>
      </div>
    );
  }

  if (phase === PHASE.EXTRACTING) {
    return (
      <div className="practice__answer">
        <span className="practice__answer-label">Reading your handwriting…</span>
        <div className="practice__upload-extracting">
          <div className="practice__upload-spinner" aria-hidden="true" />
          <span>Extracting text from your image</span>
        </div>
      </div>
    );
  }

  return (
    <div className="practice__answer">
      <span className="practice__answer-label">
        Extracted text — edit if anything looks wrong
      </span>
      {previewUrl && (
        <img
          src={previewUrl}
          alt="Your uploaded answer"
          className="practice__upload-preview-img practice__upload-preview-img--thumb"
        />
      )}
      <textarea
        className="practice__textarea"
        value={answer}
        onChange={(e) => onAnswer(e.target.value)}
        disabled={disabled}
        rows={4}
        placeholder="Extracted text appears here…"
      />
      <button type="button" className="practice__upload-retake-link" onClick={retake}>
        Upload a different photo
      </button>
    </div>
  );
}
