export const metadata = {
  title: 'E-Waste Export Route Risk Mapper',
  description:
    'Map your e-waste export route and instantly identify Basel notification requirements, ban restrictions, and compliance complexity before you ship.',
}


import EWasteRouteMapper from '@/components/tools/EWasteRouteMapper'
import ToolRelatedReading from '@/components/tools/ToolRelatedReading'

export default function EWasteRouteMapperPage() {
  return (
    <>
    <EWasteRouteMapper />
    <ToolRelatedReading
      postSlug="urban-mine-the-hunt"
      postTitle="Urban Mine — The Hunt"
      episodeNum={2}
      teaser="Map your e-waste route before you commit the shipment. The exposure lives in the transit chain."
    />
    </>
  )
}
