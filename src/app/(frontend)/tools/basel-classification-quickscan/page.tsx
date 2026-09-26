export const metadata = {
  title: 'Basel Classification QuickScan',
  description:
    'Identify the correct Basel waste code for your e-waste or battery shipment in three questions. Covers current e-waste and battery entries including A1181, Y49, A1160, A1170/B1090, plastic-waste pathways, and the 2025 e-waste amendments.',
}


import BaselClassificationQuickscan from '@/components/tools/BaselClassificationQuickscan'
import ToolRelatedReading from '@/components/tools/ToolRelatedReading'

export default function BaselClassificationQuickscanPage() {
  return (
    <>
    <BaselClassificationQuickscan />
    <ToolRelatedReading
      postSlug="billion-dollar-ewaste-industry-opportunity"
      postTitle="The Billion-Dollar e-Waste Opportunity"
      episodeNum={1}
      teaser="How compliant operators classify, price, and extract value from e-waste streams legally."
    />
    </>
  )
}
