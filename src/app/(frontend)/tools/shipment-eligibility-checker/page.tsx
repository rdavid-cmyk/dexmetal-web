export const metadata = {
  title: 'Shipment Eligibility Checker | DexMetal',
  description:
    'Check if your waste shipment is eligible under the Basel Convention — Ban Amendment, OECD controls, plastic waste rules, and more.',
}


import ShipmentEligibilityChecker from '@/components/tools/ShipmentEligibilityChecker'
import EmailGate from '@/components/EmailGate'
import ToolRelatedReading from '@/components/tools/ToolRelatedReading'

export default function ShipmentEligibilityCheckerPage() {
  return (
    <EmailGate toolName="shipment-eligibility-checker">
      <ShipmentEligibilityChecker />
      <ToolRelatedReading
        postSlug="the-140000-phone-call"
        postTitle="The $140,000 Phone Call"
        episodeNum={8}
        teaser="What Basel non-compliance actually costs — and the seven checks that prevent it."
      />
    </EmailGate>
  )
}
