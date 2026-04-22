import BaselClassificationQuickscan from '@/components/tools/BaselClassificationQuickscan'
import EmailGate from '@/components/EmailGate'

export const metadata = {
  title: 'Basel Classification QuickScan | DexMetal',
  description:
    'Identify the correct Basel waste code for your e-waste or battery shipment in three questions. Covers A1181, Y31, B1110, A1170, B3011, and 2025 amendments.',
}

export default function BaselClassificationQuickscanPage() {
  return (
    <EmailGate toolName="basel-classification-quickscan">
      <BaselClassificationQuickscan />
    </EmailGate>
  )
}
