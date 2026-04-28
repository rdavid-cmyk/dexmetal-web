import PICStatusChecker from '@/components/tools/PICStatusChecker'
import EmailGate from '@/components/EmailGate'

export const metadata = {
  title: 'PIC Status Checker | DexMetal',
  description:
    'Check whether your waste shipment requires Prior Informed Consent under the Basel Convention — including OECD tacit consent and the 2025 Y49 amendment.',
}

export default function PICStatusCheckerPage() {
  return (
    <EmailGate toolName="pic-status-checker">
      <PICStatusChecker />
    </EmailGate>
  )
}
