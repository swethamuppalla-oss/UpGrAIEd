const Card = ({ children, className = '', ...props }) => (
  <div
    className={`glass rounded-2xl p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export default Card;
