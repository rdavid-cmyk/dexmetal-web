import EWasteMaterialRecovery from '@/components/tools/EWasteMaterialRecovery'
import EmailGate from '@/components/EmailGate'

export const metadata = {
  title: 'E-Waste Material Recovery Estimator | DexMetal',
  description:
    'Estimate the recoverable material value from your e-waste shipment — copper, gold, lead, silver and more — before you trade.',
}

export default function EWasteMaterialRecoveryPage() {
  return (
    <EmailGate toolName="ewaste-material-recovery">
      <EWasteMaterialRecovery />
    </EmailGate>
  )
}
