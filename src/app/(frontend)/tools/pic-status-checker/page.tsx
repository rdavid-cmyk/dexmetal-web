export const metadata = {
  title: 'PIC Status Checker | DexMetal',
  description:
    'Check whether your waste shipment requires Prior Informed Consent under the Basel Convention — including OECD tacit consent and the 2025 Y49 amendment.',
}


import PICStatusChecker from '@/components/tools/PICStatusChecker'
import EmailGate from '@/components/EmailGate'
import ToolRelatedReading from '@/components/tools/ToolRelatedReading'

export default function PICStatusCheckerPage() {
  return (
    <EmailGate toolName="pic-status-checker">
      <PICStatusChecker />
      <ToolRelatedReading
        postSlug="basel-pic-2025-guide"
        postTitle="Navigating Basel PIC 2025"
        episodeNum={3}
        teaser="Prior Informed Consent is government authorization. Here is what operators get wrong."
      />
    </EmailGate>
  )
}
