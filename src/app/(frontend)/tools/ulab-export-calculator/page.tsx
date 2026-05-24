export const metadata = {
  title: 'ULAB Export Calculator | DexMetal',
  description:
    'Estimate the value and viability of your used lead-acid battery shipment — lead recovery value, logistics costs, and net margin at current LME prices.',
}


import ULABExportCalculator from '@/components/tools/ULABExportCalculator'
import EmailGate from '@/components/EmailGate'
import ToolRelatedReading from '@/components/tools/ToolRelatedReading'

export default function ULABExportCalculatorPage() {
  return (
    <EmailGate toolName="ulab-export-calculator">
      <ULABExportCalculator />
      <ToolRelatedReading
        postSlug="the-certificate-that-doesnt-stop-a-crime"
        postTitle="The Certificate That Doesn't Stop a Crime"
        episodeNum={9}
        teaser="Seven compliance checks every ULAB exporter needs before the container moves."
      />
    </EmailGate>
  )
}
