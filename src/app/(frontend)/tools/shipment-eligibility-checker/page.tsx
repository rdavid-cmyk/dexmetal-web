import ShipmentEligibilityChecker from '@/components/tools/ShipmentEligibilityChecker'

export const metadata = {
  title: 'Shipment Eligibility Checker | DexMetal',
  description:
    'Check if your waste shipment is eligible under the Basel Convention — Ban Amendment, OECD controls, plastic waste rules, and more.',
}

export default function ShipmentEligibilityCheckerPage() {
  return <ShipmentEligibilityChecker />
}
