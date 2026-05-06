import GrowthNavbar from '../../components/growth/GrowthNavbar';
import { useEditMode } from '../../context/EditModeContext';
import { pricingConfig, pricingSections } from '../config/pricingConfig';
import HeroSection           from '../sections/hero/HeroSection';
import PricingSection        from '../sections/pricing/PricingSection';
import WhatsIncludedSection  from '../sections/whatsIncluded/WhatsIncludedSection';
import GuaranteesSection     from '../sections/guarantees/GuaranteesSection';
import FAQSection            from '../sections/faq/FAQSection';
import CTASection            from '../sections/cta/CTASection';

const PAGE_KEY = 'pricingV2';

const SECTION_MAP = {
  hero:          HeroSection,
  pricing:       PricingSection,
  whatsIncluded: WhatsIncludedSection,
  guarantees:    GuaranteesSection,
  faq:           FAQSection,
  cta:           CTASection,
};

export default function PricingV2() {
  const { editMode, getPageData, updatePageField } = useEditMode();
  const pageData = getPageData(PAGE_KEY);

  const getContent = (id) => pageData?.[id] ?? pricingConfig[id];

  const onSectionChange = (id, content) => {
    updatePageField(PAGE_KEY, id, content);
  };

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      <GrowthNavbar />

      {pricingSections.map(({ id, type }) => {
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
