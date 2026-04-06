const Modal = ({ open, onClose, children, title }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass rounded-2xl p-6 w-full max-w-md z-10">
        {title && <h3 className="font-clash text-lg font-semibold mb-4">{title}</h3>}
        {children}
      </div>
    </div>
  );
};

export default Modal;
