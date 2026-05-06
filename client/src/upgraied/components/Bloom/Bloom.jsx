import bloomConfig from '../../config/bloomConfig';
import './Bloom.scss';

export default function Bloom({ variant = 'bloom', size = 80 }) {
  const image = bloomConfig[variant];

  return (
    <div className="bloom">
      <img src={image} alt={variant} style={{ width: size, height: size }} />
    </div>
  );
}
