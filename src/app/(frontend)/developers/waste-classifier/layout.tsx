import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Basel Waste Code Classifier — DexMetal',
  description:
    'Classify any waste stream by Basel Convention codes instantly. Free API. Input plain language — get Y-codes, A-codes, H-codes, and PIC requirement for your Basel notification.',
}

export default function WasteClassifierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
