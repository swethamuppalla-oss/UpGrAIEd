import GrowthNavbar from '../../components/growth/GrowthNavbar';
import { useEditMode } from '../../context/EditModeContext';
import { whyConfig, whySections } from '../config/whyConfig';
import HeroSection       from '../sections/hero/HeroSection';
import ProblemSection    from '../sections/problem/ProblemSection';
import HowItWorksSection from '../sections/howItWorks/HowItWorksSection';
import BenefitsSection   from '../sections/benefits/BenefitsSection';
import TrustSection      from '../sections/trust/TrustSection';
import FAQSection        from '../sections/faq/FAQSection';
import CTASection        from '../sections/cta/CTASection';

const PAGE_KEY = 'whyV2';

const SECTION_MAP = {
  hero:       HeroSection,
  problem:    ProblemSection,
  howItWorks: HowItWorksSection,
  benefits:   BenefitsSection,
  trust:      TrustSection,
  faq:        FAQSection,
  cta:        CTASection,
};

export default function WhyV2() {
  const { editMode, getPageData, updatePageField } = useEditMode();
  const pageData = getPageData(PAGE_KEY);

  const getContent = (id) => pageData?.[id] ?? whyConfig[id];

  const onSectionChange = (id, content) => {
    updatePageField(PAGE_KEY, id, content);
  };

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <GrowthNavbar />

      {whySections.map(({ id, type }) => {
        const Component = SECTION_MAP[type];
        if (!Component) return null;

        return (
          <Component
            key={id}
            content={getContent(id)}
            onContentChange={editMode ? (c) => onSectionChange(id, c) : undefined}
          />
        );
      })}
    </div>
  );
}
