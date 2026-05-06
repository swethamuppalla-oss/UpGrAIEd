import { useEffect } from 'react'
import { trackEvent } from '../utils/analytics'
import GrowthNavbar from '../components/growth/GrowthNavbar'
import HeroSectionV2 from '../components/sections/HeroSectionV2'
import BloomGridV2 from '../components/sections/BloomGridV2'
import WhyUpgraiedV2 from '../components/sections/WhyUpgraiedV2'
import TrustSectionV2 from '../components/sections/TrustSectionV2'
import PricingSectionV2 from '../components/sections/PricingSectionV2'
import FAQSectionV2 from '../components/sections/FAQSectionV2'
import CTASectionV2 from '../components/sections/CTASectionV2'

export default function LandingPageV2() {
  useEffect(() => {
    trackEvent('landing_view_v2', {})
  }, [])

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', fontFamily: "'Nunito', 'Inter', -apple-system, sans-serif" }}>
      <GrowthNavbar />
      <HeroSectionV2 />
      <BloomGridV2 />
      <WhyUpgraiedV2 />
      <TrustSectionV2 />
      <PricingSectionV2 />
      <FAQSectionV2 />
      <CTASectionV2 />
    </div>
  )
}
