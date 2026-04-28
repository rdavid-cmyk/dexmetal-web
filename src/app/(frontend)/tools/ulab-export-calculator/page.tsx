import ULABExportCalculator from '@/components/tools/ULABExportCalculator'
import EmailGate from '@/components/EmailGate'

export const metadata = {
  title: 'ULAB Export Calculator | DexMetal',
  description:
    'Estimate the value and viability of your used lead-acid battery shipment — lead recovery value, logistics costs, and net margin at current LME prices.',
}

export default function ULABExportCalculatorPage() {
  return (
    <EmailGate toolName="ulab-export-calculator">
      <ULABExportCalculator />
    </EmailGate>
  )
}
