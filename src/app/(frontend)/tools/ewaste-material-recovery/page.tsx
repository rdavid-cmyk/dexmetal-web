export const metadata = {
  title: 'E-Waste Material Recovery Estimator | DexMetal',
  description:
    'Estimate the recoverable material value from your e-waste shipment — copper, gold, lead, silver and more — before you trade.',
}


import EWasteMaterialRecovery from '@/components/tools/EWasteMaterialRecovery'
import EmailGate from '@/components/EmailGate'
import ToolRelatedReading from '@/components/tools/ToolRelatedReading'

export default function EWasteMaterialRecoveryPage() {
  return (
    <EmailGate toolName="ewaste-material-recovery">
      <EWasteMaterialRecovery />
      <ToolRelatedReading
        postSlug="urban-mine-the-hunt"
        postTitle="Urban Mine — The Hunt"
        episodeNum={2}
        teaser="Source control, chain of custody, and the compliance checks that protect urban mining operations."
      />
    </EmailGate>
  )
}
