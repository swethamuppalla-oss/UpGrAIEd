import { useNavigate } from 'react-router-dom';
import './LandingDS.scss';

import Hero         from '../components/landing/Hero/Hero';
import ProductSplit from '../components/landing/ProductSplit/ProductSplit';
import Philosophy   from '../components/landing/Philosophy/Philosophy';

export default function LandingDS() {
  const navigate = useNavigate();
  const handleCta = () => navigate('/login?role=student');

  return (
    <main className="lp-ds">
      <Hero         onCtaClick={handleCta} />
      <ProductSplit />
      <Philosophy   onCtaClick={handleCta} />
    </main>
  );
}
