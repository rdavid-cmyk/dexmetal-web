'use client'

import { useState, useEffect } from 'react'

interface Block {
  number: number
  title: string
  description: string
  slug: string
  hasLearnMore?: boolean
  isReserved?: boolean
}

const NOTIFICATION_BLOCKS: Block[] = [
  {
    number: 1,
    title: 'Exporter – Notifier',
    description: 'Name, address, and contact details of the waste exporter/notifier',
    slug: 'exporter-notifier',
  },
  {
    number: 2,
    title: 'Importer – Consignee',
    description: 'Name, address, and contact details of the waste importer/consignee',
    slug: 'importer-consignee',
  },
  {
    number: 3,
    title: 'Notification No + shipment type + operation type + pre-consent',
    description:
      'Unique notification number, shipment type, operation type, and pre-consent status',
    slug: 'notification-number',
  },
  {
    number: 4,
    title: 'Total intended number of shipments',
    description: 'Total number of shipments planned for this notification',
    slug: 'total-shipments',
  },
  {
    number: 5,
    title: 'Total intended quantity',
    description: 'Total quantity of waste in tonnes',
    slug: 'total-quantity',
  },
  {
    number: 6,
    title: 'Intended period of time',
    description: 'Planned start and end dates for the shipment period',
    slug: 'intended-period',
  },
  {
    number: 7,
    title: 'Packaging type(s) + special handling',
    description: 'Type of packaging and any special handling requirements',
    slug: 'packaging',
  },
  {
    number: 8,
    title: 'Intended carrier(s)',
    description: 'Details of the planned carrier(s) for waste transport',
    slug: 'intended-carriers',
  },
  {
    number: 9,
    title: 'Waste generator(s) – producer(s)',
    description: 'Name, address, and contact of waste generator(s) and producer(s)',
    slug: 'waste-generator',
  },
  {
    number: 10,
    title: 'Disposal/recovery facility',
    description: 'Details of the final disposal or recovery facility',
    slug: 'disposal-facility',
  },
  {
    number: 11,
    title: 'Disposal/recovery operation(s)',
    description: 'The specific disposal or recovery operation code(s)',
    slug: 'operation-code',
  },
  {
    number: 12,
    title: 'Designation and composition of the waste',
    description: 'Detailed designation and composition of the waste',
    slug: 'waste-designation',
  },
  {
    number: 13,
    title: 'Physical characteristics',
    description: 'Physical form and characteristics of the waste',
    slug: 'physical-characteristics',
  },
  {
    number: 14,
    title: 'Waste identification codes (i–xii)',
    description: 'All applicable waste identification codes (Basel, OECD, EU, etc.)',
    slug: 'waste-codes',
  },
  {
    number: 15,
    title: 'Countries/states concerned',
    description: 'All countries/states involved in the transboundary movement',
    slug: 'countries-concerned',
  },
  {
    number: 16,
    title: 'EU customs offices',
    description: 'EU customs offices of entry and exit',
    slug: 'customs-offices',
  },
  {
    number: 17,
    title: 'Exporter/generator declaration',
    description: 'Declaration by the exporter or generator',
    slug: 'declaration',
  },
  {
    number: 18,
    title: 'Number of annexes',
    description: 'Number of annexes attached to the notification',
    slug: 'annexes',
    hasLearnMore: true,
  },
  {
    number: 19,
    title: 'Reserved for Competent Authority',
    description: 'For official use only',
    slug: '',
    isReserved: true,
  },
  {
    number: 20,
    title: 'Reserved for Competent Authority',
    description: 'For official use only',
    slug: '',
    isReserved: true,
  },
  {
    number: 21,
    title: 'Reserved for Competent Authority',
    description: 'For official use only',
    slug: '',
    isReserved: true,
  },
]

const MOVEMENT_BLOCKS: Block[] = [
  {
    number: 1,
    title: 'Exporter – Notifier',
    description: 'Name, address, and contact details of the waste exporter/notifier',
    slug: 'exporter-notifier',
  },
  {
    number: 2,
    title: 'Importer – Consignee',
    description: 'Name, address, and contact details of the waste importer/consignee',
    slug: 'importer-consignee',
  },
  {
    number: 3,
    title: 'Notification No + Shipment No',
    description: 'The notification number and the specific shipment number within that notification',
    slug: 'notification-shipment-no',
  },
  {
    number: 4,
    title: 'Actual date of shipment',
    description: 'The actual date on which the transboundary movement commenced',
    slug: 'actual-date',
  },
  {
    number: 5,
    title: 'Actual quantity',
    description: 'Actual quantity of waste in tonnes for this specific shipment',
    slug: 'actual-quantity',
  },
  {
    number: 6,
    title: 'Packaging type(s) + special handling',
    description: 'Type of packaging used and any special handling requirements',
    slug: 'packaging',
  },
  {
    number: 7,
    title: 'Carrier(s)',
    description: 'Details of the carrier(s) actually transporting the waste',
    slug: 'carriers',
  },
  {
    number: 8,
    title: 'Waste generator(s) – producer(s)',
    description: 'Name, address, and contact of waste generator(s) and producer(s)',
    slug: 'waste-generator',
  },
  {
    number: 9,
    title: 'Disposal/recovery facility',
    description: 'Details of the final disposal or recovery facility',
    slug: 'disposal-facility',
  },
  {
    number: 10,
    title: 'Disposal/recovery operation(s)',
    description: 'The specific disposal or recovery operation code(s)',
    slug: 'operation-code',
  },
  {
    number: 11,
    title: 'Designation and composition of the waste',
    description: 'Detailed designation and composition of the waste',
    slug: 'waste-designation',
  },
  {
    number: 12,
    title: 'Physical characteristics',
    description: 'Physical form and characteristics of the waste',
    slug: 'physical-characteristics',
  },
  {
    number: 13,
    title: 'Waste identification codes (i–xii)',
    description: 'All applicable waste identification codes (Basel, OECD, EU, etc.)',
    slug: 'waste-codes',
  },
  {
    number: 14,
    title: 'Countries/states concerned',
    description: 'All countries/states involved in the transboundary movement',
    slug: 'countries-concerned',
  },
  {
    number: 15,
    title: 'EU customs offices',
    description: 'EU customs offices of entry and exit (EU routes only)',
    slug: 'customs-offices',
  },
  {
    number: 16,
    title: 'Generator/Exporter declaration',
    description: 'Declaration and signature by the generator or exporter',
    slug: 'declaration',
  },
  {
    number: 17,
    title: 'Importer/Consignee receipt confirmation',
    description: 'Confirmation of receipt by the importer/consignee with date and signature',
    slug: 'receipt-confirmation',
  },
  {
    number: 18,
    title: 'Certificate of disposal/recovery',
    description: 'For official use only — completed by the receiving facility and Competent Authority',
    slug: '',
    isReserved: true,
  },
  {
    number: 19,
    title: 'Reserved for Competent Authority',
    description: 'For official use only',
    slug: '',
    isReserved: true,
  },
]
const SHIPMENT_TYPES = [
  { value: 'single', label: 'Single' },
  { value: 'multiple', label: 'Multiple' },
]

const OPERATION_TYPES = [
  { value: 'disposal', label: 'Disposal' },
  { value: 'recovery', label: 'Recovery' },
]

const PHYSICAL_FORMS = [
  { value: 'solid', label: 'Solid' },
  { value: 'liquid', label: 'Liquid' },
  { value: 'sludge', label: 'Sludge' },
  { value: 'gas', label: 'Gas' },
  { value: 'powder', label: 'Powder' },
  { value: 'other', label: 'Other' },
]

const PACKAGING_TYPES = [
  { value: 'drums', label: 'Drums' },
  { value: 'wooden_barrels', label: 'Wooden barrels' },
  { value: 'jerricans', label: 'Jerricans' },
  { value: 'boxes', label: 'Boxes' },
  { value: 'bags', label: 'Bags' },
  { value: 'composite', label: 'Composite packaging' },
  { value: 'pressure_receptacles', label: 'Pressure receptacles' },
  { value: 'bulk', label: 'Bulk' },
]

const TRANSPORT_MODES = [
  { value: 'road', label: 'Road' },
  { value: 'rail', label: 'Rail' },
  { value: 'sea', label: 'Sea' },
  { value: 'air', label: 'Air' },
  { value: 'inland_waterway', label: 'Inland waterway' },
]

const DISPOSAL_CODES = [
  { value: 'D1', label: 'D1 - Controlled landfill' },
  { value: 'D2', label: 'D2 - Deep injection' },
  { value: 'D3', label: 'D3 - Deep well injection' },
  { value: 'D4', label: 'D4 - Surface impoundment' },
  { value: 'D5', label: 'D5 - Specially engineered landfill' },
  { value: 'D6', label: 'D6 - Release into water bodies' },
  { value: 'D7', label: 'D7 - Release into sea/oceans' },
  { value: 'D8', label: 'D8 - Biological treatment' },
  { value: 'D9', label: 'D9 - Physico-chemical treatment' },
  { value: 'D10', label: 'D10 - Incineration' },
  { value: 'D11', label: 'D11 - Incineration at sea' },
  { value: 'D12', label: 'D12 - Permanent storage' },
  { value: 'D13', label: 'D13 - Blending/recipe' },
  { value: 'D14', label: 'D14 - Repackaging' },
  { value: 'D15', label: 'D15 - Storage pending D1-D14' },
]

const RECOVERY_CODES = [
  { value: 'R1', label: 'R1 - Use as fuel' },
  { value: 'R2', label: 'R2 - Solvent reclamation' },
  { value: 'R3', label: 'R3 - Recycling/reclamation of organics' },
  { value: 'R4', label: 'R4 - Recycling/reclamation of metals' },
  { value: 'R5', label: 'R5 - Recycling/reclamation of inorganics' },
  { value: 'R6', label: 'R6 - Regeneration of acids/bases' },
  { value: 'R7', label: 'R7 - Recovery of components' },
  { value: 'R8', label: 'R8 - Recovery of catalysts' },
  { value: 'R9', label: 'R9 - Re-refining used oil' },
  { value: 'R10', label: 'R10 - Land treatment' },
  { value: 'R11', label: 'R11 - Uses of waste' },
  { value: 'R12', label: 'R12 - Waste exchange' },
  { value: 'R13', label: 'R13 - Accumulation of R1-R12' },
]

interface FormData {
  [key: string]: string | string[] | boolean
}

export default function BaselFormAssistantPage() {
  const [activeTab, setActiveTab] = useState<'reference' | 'fill'>('reference')
  const [selectedDoc, setSelectedDoc] = useState<'notification' | 'movement'>('notification')
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({})
  const [isEuRoute, setIsEuRoute] = useState(false)
  const [copilotOpen, setCopilotOpen] = useState(false)
  const [copilotContext, setCopilotContext] = useState('')

  const blocks = selectedDoc === 'notification' ? NOTIFICATION_BLOCKS : MOVEMENT_BLOCKS
  const totalSteps = blocks.length

  useEffect(() => {
    const saved = localStorage.getItem('basel_notification_form')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setFormData(parsed.formData || {})
        setIsEuRoute(parsed.isEuRoute || false)
        setCurrentStep(parsed.currentStep || 0)
      } catch {}
    }
  }, [])

  useEffect(() => {
    if (Object.keys(formData).length > 0 || isEuRoute) {
      localStorage.setItem(
        'basel_notification_form',
        JSON.stringify({ formData, isEuRoute, currentStep }),
      )
    }
  }, [formData, isEuRoute, currentStep])

  const handleCopilotOpen = async (blockNumber: number, blockTitle: string) => {
    const message = `I have a question about Block ${blockNumber}: ${blockTitle} in the Basel Notification form.`
    setCopilotContext(message)
    setCopilotOpen(true)

    try {
      await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          context: { blockNumber, blockTitle, docType: selectedDoc },
        }),
      })
    } catch (error) {
      console.error('Failed to send context to chat API:', error)
    }
  }

  const handleInputChange = (field: string, value: string | string[] | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    const current = (formData[field] as string[]) || []
    if (checked) {
      setFormData((prev) => ({ ...prev, [field]: [...current, value] }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: current.filter((v: string) => v !== value) }))
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSaveProgress = () => {
    localStorage.setItem(
      'basel_notification_form',
      JSON.stringify({ formData, isEuRoute, currentStep }),
    )
    alert('Progress saved!')
  }

  const handleClearForm = () => {
    setFormData({})
    setIsEuRoute(false)
    setCurrentStep(0)
    localStorage.removeItem('basel_notification_form')
  }

  const handleGeneratePDF = () => {
    alert('Your form is ready. PDF generation coming soon.')
  }

  const renderBlockField = (blockNumber: number) => {
    const f = (key: string) => formData[key] as string
    const fc = (key: string) => (formData[key] as string[]) || []
    const fb = (key: string) => formData[key] as boolean

    switch (blockNumber) {
      case 1:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Company Name *
              </label>
              <input
                type="text"
                value={f('block1_name') || ''}
                onChange={(e) => handleInputChange('block1_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Address *
              </label>
              <textarea
                value={f('block1_address') || ''}
                onChange={(e) => handleInputChange('block1_address', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={3}
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Country *
              </label>
              <input
                type="text"
                value={f('block1_country') || ''}
                onChange={(e) => handleInputChange('block1_country', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter country"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Contact Person *
              </label>
              <input
                type="text"
                value={f('block1_contact') || ''}
                onChange={(e) => handleInputChange('block1_contact', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter contact person"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Phone *
              </label>
              <input
                type="text"
                value={f('block1_phone') || ''}
                onChange={(e) => handleInputChange('block1_phone', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter phone"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Email *
              </label>
              <input
                type="email"
                value={f('block1_email') || ''}
                onChange={(e) => handleInputChange('block1_email', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter email"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Company Name *
              </label>
              <input
                type="text"
                value={f('block2_name') || ''}
                onChange={(e) => handleInputChange('block2_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Address *
              </label>
              <textarea
                value={f('block2_address') || ''}
                onChange={(e) => handleInputChange('block2_address', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={3}
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Country *
              </label>
              <input
                type="text"
                value={f('block2_country') || ''}
                onChange={(e) => handleInputChange('block2_country', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter country"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Contact Person *
              </label>
              <input
                type="text"
                value={f('block2_contact') || ''}
                onChange={(e) => handleInputChange('block2_contact', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter contact person"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Phone *
              </label>
              <input
                type="text"
                value={f('block2_phone') || ''}
                onChange={(e) => handleInputChange('block2_phone', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter phone"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Email *
              </label>
              <input
                type="email"
                value={f('block2_email') || ''}
                onChange={(e) => handleInputChange('block2_email', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter email"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Notification Number
              </label>
              <input
                type="text"
                value={f('block3_notification_no') || ''}
                onChange={(e) => handleInputChange('block3_notification_no', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter notification number"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Shipment Type *
              </label>
              <select
                value={f('block3_shipment_type') || ''}
                onChange={(e) => handleInputChange('block3_shipment_type', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              >
                <option value="">Select shipment type</option>
                {SHIPMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Operation Type *
              </label>
              <select
                value={f('block3_operation_type') || ''}
                onChange={(e) => handleInputChange('block3_operation_type', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              >
                <option value="">Select operation type</option>
                {OPERATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="block3_preconsent"
                checked={fb('block3_preconsent')}
                onChange={(e) => handleInputChange('block3_preconsent', e.target.checked)}
                className="w-5 h-5"
                style={{ accentColor: '#1D9E75' }}
              />
              <label
                htmlFor="block3_preconsent"
                className="font-body text-white"
                style={{ color: '#ffffff' }}
              >
                Pre-consent (Yes)
              </label>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Number of Shipments *
              </label>
              <input
                type="number"
                value={f('block4_shipments') || ''}
                onChange={(e) => handleInputChange('block4_shipments', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter number of shipments"
                min="1"
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Quantity (tonnes) *
              </label>
              <input
                type="number"
                value={f('block5_quantity') || ''}
                onChange={(e) => handleInputChange('block5_quantity', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter quantity in tonnes"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Start Date *
              </label>
              <input
                type="date"
                value={f('block6_start') || ''}
                onChange={(e) => handleInputChange('block6_start', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                End Date
              </label>
              <input
                type="date"
                value={f('block6_end') || ''}
                onChange={(e) => handleInputChange('block6_end', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              />
            </div>
          </div>
        )

      case 7:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Packaging Types *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PACKAGING_TYPES.map((t) => (
                  <div key={t.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`block7_${t.value}`}
                      checked={fc('block7_packaging').includes(t.value)}
                      onChange={(e) =>
                        handleCheckboxChange('block7_packaging', t.value, e.target.checked)
                      }
                      className="w-4 h-4"
                      style={{ accentColor: '#1D9E75' }}
                    />
                    <label htmlFor={`block7_${t.value}`} className="font-body text-sm text-white">
                      {t.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Special Handling Requirements
              </label>
              <textarea
                value={f('block7_special_handling') || ''}
                onChange={(e) => handleInputChange('block7_special_handling', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={3}
                placeholder="Enter special handling requirements"
              />
            </div>
          </div>
        )

      case 8:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Carrier Name *
              </label>
              <input
                type="text"
                value={f('block8_name') || ''}
                onChange={(e) => handleInputChange('block8_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter carrier name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Address *
              </label>
              <textarea
                value={f('block8_address') || ''}
                onChange={(e) => handleInputChange('block8_address', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={3}
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Transport Mode *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TRANSPORT_MODES.map((t) => (
                  <div key={t.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`block8_${t.value}`}
                      checked={fc('block8_transport').includes(t.value)}
                      onChange={(e) =>
                        handleCheckboxChange('block8_transport', t.value, e.target.checked)
                      }
                      className="w-4 h-4"
                      style={{ accentColor: '#1D9E75' }}
                    />
                    <label htmlFor={`block8_${t.value}`} className="font-body text-sm text-white">
                      {t.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 9:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Company Name *
              </label>
              <input
                type="text"
                value={f('block9_name') || ''}
                onChange={(e) => handleInputChange('block9_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Address *
              </label>
              <textarea
                value={f('block9_address') || ''}
                onChange={(e) => handleInputChange('block9_address', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={3}
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Contact Person *
              </label>
              <input
                type="text"
                value={f('block9_contact') || ''}
                onChange={(e) => handleInputChange('block9_contact', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter contact person"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Phone *
              </label>
              <input
                type="text"
                value={f('block9_phone') || ''}
                onChange={(e) => handleInputChange('block9_phone', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter phone"
              />
            </div>
          </div>
        )

      case 10:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Facility Name *
              </label>
              <input
                type="text"
                value={f('block10_name') || ''}
                onChange={(e) => handleInputChange('block10_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter facility name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Address *
              </label>
              <textarea
                value={f('block10_address') || ''}
                onChange={(e) => handleInputChange('block10_address', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={3}
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Permit Number *
              </label>
              <input
                type="text"
                value={f('block10_permit') || ''}
                onChange={(e) => handleInputChange('block10_permit', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter permit number"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Contact Person *
              </label>
              <input
                type="text"
                value={f('block10_contact') || ''}
                onChange={(e) => handleInputChange('block10_contact', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter contact person"
              />
            </div>
          </div>
        )

      case 11:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Disposal/Recovery Code *
              </label>
              <select
                value={f('block11_code') || ''}
                onChange={(e) => handleInputChange('block11_code', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              >
                <option value="">Select operation code</option>
                <optgroup label="Disposal Codes">
                  {DISPOSAL_CODES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Recovery Codes">
                  {RECOVERY_CODES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        )

      case 12:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Waste Description *
              </label>
              <textarea
                value={f('block12_description') || ''}
                onChange={(e) => handleInputChange('block12_description', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={4}
                placeholder="Enter waste description"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Chemical Composition *
              </label>
              <textarea
                value={f('block12_composition') || ''}
                onChange={(e) => handleInputChange('block12_composition', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={4}
                placeholder="Enter chemical composition"
              />
            </div>
          </div>
        )

      case 13:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Physical Form *
              </label>
              <select
                value={f('block13_form') || ''}
                onChange={(e) => handleInputChange('block13_form', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              >
                <option value="">Select physical form</option>
                {PHYSICAL_FORMS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            {f('block13_form') === 'other' && (
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  Other Description *
                </label>
                <input
                  type="text"
                  value={f('block13_other') || ''}
                  onChange={(e) => handleInputChange('block13_other', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="Describe physical form"
                />
              </div>
            )}
          </div>
        )

      case 14:
        return (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  Basel Annex Code
                </label>
                <input
                  type="text"
                  value={f('block14_basel') || ''}
                  onChange={(e) => handleInputChange('block14_basel', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. A1181"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  OECD Code
                </label>
                <input
                  type="text"
                  value={f('block14_oecd') || ''}
                  onChange={(e) => handleInputChange('block14_oecd', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. GC020"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  EU List Code
                </label>
                <input
                  type="text"
                  value={f('block14_eu') || ''}
                  onChange={(e) => handleInputChange('block14_eu', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. 20 01 35*"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  National Code
                </label>
                <input
                  type="text"
                  value={f('block14_national') || ''}
                  onChange={(e) => handleInputChange('block14_national', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="Enter national code"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  UN Class
                </label>
                <input
                  type="text"
                  value={f('block14_un_class') || ''}
                  onChange={(e) => handleInputChange('block14_un_class', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. 9"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  UN Number
                </label>
                <input
                  type="text"
                  value={f('block14_un_number') || ''}
                  onChange={(e) => handleInputChange('block14_un_number', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. UN3077"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  Y-code
                </label>
                <input
                  type="text"
                  value={f('block14_y_code') || ''}
                  onChange={(e) => handleInputChange('block14_y_code', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. Y29"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  H-code
                </label>
                <input
                  type="text"
                  value={f('block14_h_code') || ''}
                  onChange={(e) => handleInputChange('block14_h_code', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. H10"
                />
              </div>
            </div>
          </div>
        )

      case 15:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Country of Export *
              </label>
              <input
                type="text"
                value={f('block15_export') || ''}
                onChange={(e) => handleInputChange('block15_export', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter export country"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Country of Import *
              </label>
              <input
                type="text"
                value={f('block15_import') || ''}
                onChange={(e) => handleInputChange('block15_import', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter import country"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Transit Countries (one per line)
              </label>
              <textarea
                value={f('block15_transit') || ''}
                onChange={(e) => handleInputChange('block15_transit', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={4}
                placeholder="Enter transit countries, one per line"
              />
            </div>
          </div>
        )

      case 16:
        if (!isEuRoute) return null
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Entry Customs Office *
              </label>
              <input
                type="text"
                value={f('block16_entry') || ''}
                onChange={(e) => handleInputChange('block16_entry', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter entry customs office"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Exit Customs Office *
              </label>
              <input
                type="text"
                value={f('block16_exit') || ''}
                onChange={(e) => handleInputChange('block16_exit', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter exit customs office"
              />
            </div>
          </div>
        )

      case 17:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Signatory Name *
              </label>
              <input
                type="text"
                value={f('block17_name') || ''}
                onChange={(e) => handleInputChange('block17_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter signatory name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Date *
              </label>
              <input
                type="date"
                value={f('block17_date') || ''}
                onChange={(e) => handleInputChange('block17_date', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="block17_acknowledge"
                checked={fb('block17_acknowledge')}
                onChange={(e) => handleInputChange('block17_acknowledge', e.target.checked)}
                className="w-5 h-5"
                style={{ accentColor: '#1D9E75' }}
              />
              <label
                htmlFor="block17_acknowledge"
                className="font-body text-white"
                style={{ color: '#ffffff' }}
              >
                I confirm the above information is accurate
              </label>
            </div>
          </div>
        )

      case 18:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Number of Annexes *
              </label>
              <input
                type="number"
                value={f('block18_count') || ''}
                onChange={(e) => handleInputChange('block18_count', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter number of annexes"
                min="0"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Annex Descriptions
              </label>
              <textarea
                value={f('block18_descriptions') || ''}
                onChange={(e) => handleInputChange('block18_descriptions', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={4}
                placeholder="Enter descriptions for each annex"
              />
            </div>
          </div>
        )

      case 19:
      case 20:
      case 21:
        return (
          <div
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: '#1a1a18', border: '1px dashed #4a4a48' }}
          >
            <p className="font-body text-lg mb-2" style={{ color: '#888' }}>
              Reserved for Competent Authority
            </p>
            <p className="font-body text-sm" style={{ color: '#666' }}>
              For official use only
            </p>
          </div>
        )

      default:
        return null
    }
  }

  const renderMovementBlockField = (blockNumber: number) => {
    const f = (key: string) => formData[key] as string
    const fc = (key: string) => (formData[key] as string[]) || []
    const fb = (key: string) => formData[key] as boolean

    switch (blockNumber) {
      case 1:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Company Name *
              </label>
              <input
                type="text"
                value={f('mov_block1_name') || ''}
                onChange={(e) => handleInputChange('mov_block1_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Address *
              </label>
              <textarea
                value={f('mov_block1_address') || ''}
                onChange={(e) => handleInputChange('mov_block1_address', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={3}
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Country *
              </label>
              <input
                type="text"
                value={f('mov_block1_country') || ''}
                onChange={(e) => handleInputChange('mov_block1_country', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter country"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Contact Person *
              </label>
              <input
                type="text"
                value={f('mov_block1_contact') || ''}
                onChange={(e) => handleInputChange('mov_block1_contact', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter contact person"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Phone *
              </label>
              <input
                type="text"
                value={f('mov_block1_phone') || ''}
                onChange={(e) => handleInputChange('mov_block1_phone', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter phone"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Email *
              </label>
              <input
                type="email"
                value={f('mov_block1_email') || ''}
                onChange={(e) => handleInputChange('mov_block1_email', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter email"
              />
            </div>
          </div>
        )

      case 2:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Company Name *
              </label>
              <input
                type="text"
                value={f('mov_block2_name') || ''}
                onChange={(e) => handleInputChange('mov_block2_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Address *
              </label>
              <textarea
                value={f('mov_block2_address') || ''}
                onChange={(e) => handleInputChange('mov_block2_address', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={3}
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Country *
              </label>
              <input
                type="text"
                value={f('mov_block2_country') || ''}
                onChange={(e) => handleInputChange('mov_block2_country', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter country"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Contact Person *
              </label>
              <input
                type="text"
                value={f('mov_block2_contact') || ''}
                onChange={(e) => handleInputChange('mov_block2_contact', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter contact person"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Phone *
              </label>
              <input
                type="text"
                value={f('mov_block2_phone') || ''}
                onChange={(e) => handleInputChange('mov_block2_phone', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter phone"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Email *
              </label>
              <input
                type="email"
                value={f('mov_block2_email') || ''}
                onChange={(e) => handleInputChange('mov_block2_email', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter email"
              />
            </div>
          </div>
        )

      case 3:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Notification Number
              </label>
              <input
                type="text"
                value={f('mov_block3_notification_no') || ''}
                onChange={(e) => handleInputChange('mov_block3_notification_no', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter notification number"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Shipment Number
              </label>
              <input
                type="text"
                value={f('mov_block3_shipment_no') || ''}
                onChange={(e) => handleInputChange('mov_block3_shipment_no', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="e.g. 1 of 3"
              />
            </div>
          </div>
        )

      case 4:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Actual Date of Shipment *
              </label>
              <input
                type="date"
                value={f('mov_block4_date') || ''}
                onChange={(e) => handleInputChange('mov_block4_date', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              />
            </div>
          </div>
        )

      case 5:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Actual Quantity (tonnes) *
              </label>
              <input
                type="number"
                value={f('mov_block5_quantity') || ''}
                onChange={(e) => handleInputChange('mov_block5_quantity', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter actual quantity in tonnes"
                min="0"
                step="0.01"
              />
            </div>
          </div>
        )

      case 6:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Packaging Types *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {PACKAGING_TYPES.map((t) => (
                  <div key={t.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`mov_block6_${t.value}`}
                      checked={fc('mov_block6_packaging').includes(t.value)}
                      onChange={(e) =>
                        handleCheckboxChange('mov_block6_packaging', t.value, e.target.checked)
                      }
                      className="w-4 h-4"
                      style={{ accentColor: '#1D9E75' }}
                    />
                    <label htmlFor={`mov_block6_${t.value}`} className="font-body text-sm text-white">
                      {t.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Special Handling Requirements
              </label>
              <textarea
                value={f('mov_block6_special_handling') || ''}
                onChange={(e) => handleInputChange('mov_block6_special_handling', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={3}
                placeholder="Enter special handling requirements"
              />
            </div>
          </div>
        )

      case 7:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Carrier Name *
              </label>
              <input
                type="text"
                value={f('mov_block7_name') || ''}
                onChange={(e) => handleInputChange('mov_block7_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter carrier name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Address *
              </label>
              <textarea
                value={f('mov_block7_address') || ''}
                onChange={(e) => handleInputChange('mov_block7_address', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={3}
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Transport Mode *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TRANSPORT_MODES.map((t) => (
                  <div key={t.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`mov_block7_${t.value}`}
                      checked={fc('mov_block7_transport').includes(t.value)}
                      onChange={(e) =>
                        handleCheckboxChange('mov_block7_transport', t.value, e.target.checked)
                      }
                      className="w-4 h-4"
                      style={{ accentColor: '#1D9E75' }}
                    />
                    <label htmlFor={`mov_block7_${t.value}`} className="font-body text-sm text-white">
                      {t.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 8:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Company Name *
              </label>
              <input
                type="text"
                value={f('mov_block8_name') || ''}
                onChange={(e) => handleInputChange('mov_block8_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter company name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Address *
              </label>
              <textarea
                value={f('mov_block8_address') || ''}
                onChange={(e) => handleInputChange('mov_block8_address', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={3}
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Contact Person *
              </label>
              <input
                type="text"
                value={f('mov_block8_contact') || ''}
                onChange={(e) => handleInputChange('mov_block8_contact', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter contact person"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Phone *
              </label>
              <input
                type="text"
                value={f('mov_block8_phone') || ''}
                onChange={(e) => handleInputChange('mov_block8_phone', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter phone"
              />
            </div>
          </div>
        )

      case 9:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Facility Name *
              </label>
              <input
                type="text"
                value={f('mov_block9_name') || ''}
                onChange={(e) => handleInputChange('mov_block9_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter facility name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Address *
              </label>
              <textarea
                value={f('mov_block9_address') || ''}
                onChange={(e) => handleInputChange('mov_block9_address', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={3}
                placeholder="Enter address"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Permit Number *
              </label>
              <input
                type="text"
                value={f('mov_block9_permit') || ''}
                onChange={(e) => handleInputChange('mov_block9_permit', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter permit number"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Contact Person *
              </label>
              <input
                type="text"
                value={f('mov_block9_contact') || ''}
                onChange={(e) => handleInputChange('mov_block9_contact', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter contact person"
              />
            </div>
          </div>
        )

      case 10:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Disposal/Recovery Code *
              </label>
              <select
                value={f('mov_block10_code') || ''}
                onChange={(e) => handleInputChange('mov_block10_code', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              >
                <option value="">Select operation code</option>
                <optgroup label="Disposal Codes">
                  {DISPOSAL_CODES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Recovery Codes">
                  {RECOVERY_CODES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>
          </div>
        )

      case 11:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Waste Description *
              </label>
              <textarea
                value={f('mov_block11_description') || ''}
                onChange={(e) => handleInputChange('mov_block11_description', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={4}
                placeholder="Enter waste description"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Chemical Composition *
              </label>
              <textarea
                value={f('mov_block11_composition') || ''}
                onChange={(e) => handleInputChange('mov_block11_composition', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={4}
                placeholder="Enter chemical composition"
              />
            </div>
          </div>
        )

      case 12:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Physical Form *
              </label>
              <select
                value={f('mov_block12_form') || ''}
                onChange={(e) => handleInputChange('mov_block12_form', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              >
                <option value="">Select physical form</option>
                {PHYSICAL_FORMS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
            {f('mov_block12_form') === 'other' && (
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  Other Description *
                </label>
                <input
                  type="text"
                  value={f('mov_block12_other') || ''}
                  onChange={(e) => handleInputChange('mov_block12_other', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="Describe physical form"
                />
              </div>
            )}
          </div>
        )

      case 13:
        return (
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  Basel Annex Code
                </label>
                <input
                  type="text"
                  value={f('mov_block13_basel') || ''}
                  onChange={(e) => handleInputChange('mov_block13_basel', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. A1181"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  OECD Code
                </label>
                <input
                  type="text"
                  value={f('mov_block13_oecd') || ''}
                  onChange={(e) => handleInputChange('mov_block13_oecd', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. GC020"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  EU List Code
                </label>
                <input
                  type="text"
                  value={f('mov_block13_eu') || ''}
                  onChange={(e) => handleInputChange('mov_block13_eu', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. 20 01 35*"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  National Code
                </label>
                <input
                  type="text"
                  value={f('mov_block13_national') || ''}
                  onChange={(e) => handleInputChange('mov_block13_national', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="Enter national code"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  UN Class
                </label>
                <input
                  type="text"
                  value={f('mov_block13_un_class') || ''}
                  onChange={(e) => handleInputChange('mov_block13_un_class', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. 9"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  UN Number
                </label>
                <input
                  type="text"
                  value={f('mov_block13_un_number') || ''}
                  onChange={(e) => handleInputChange('mov_block13_un_number', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. UN3077"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  Y-code
                </label>
                <input
                  type="text"
                  value={f('mov_block13_y_code') || ''}
                  onChange={(e) => handleInputChange('mov_block13_y_code', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. Y29"
                />
              </div>
              <div>
                <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                  H-code
                </label>
                <input
                  type="text"
                  value={f('mov_block13_h_code') || ''}
                  onChange={(e) => handleInputChange('mov_block13_h_code', e.target.value)}
                  className="w-full px-4 py-3 rounded-lg font-body text-white"
                  style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                  placeholder="e.g. H10"
                />
              </div>
            </div>
          </div>
        )

      case 14:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Country of Export *
              </label>
              <input
                type="text"
                value={f('mov_block14_export') || ''}
                onChange={(e) => handleInputChange('mov_block14_export', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter export country"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Country of Import *
              </label>
              <input
                type="text"
                value={f('mov_block14_import') || ''}
                onChange={(e) => handleInputChange('mov_block14_import', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter import country"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Transit Countries (one per line)
              </label>
              <textarea
                value={f('mov_block14_transit') || ''}
                onChange={(e) => handleInputChange('mov_block14_transit', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                rows={4}
                placeholder="Enter transit countries, one per line"
              />
            </div>
          </div>
        )

      case 15:
        if (!isEuRoute) return null
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Entry Customs Office *
              </label>
              <input
                type="text"
                value={f('mov_block15_entry') || ''}
                onChange={(e) => handleInputChange('mov_block15_entry', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter entry customs office"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Exit Customs Office *
              </label>
              <input
                type="text"
                value={f('mov_block15_exit') || ''}
                onChange={(e) => handleInputChange('mov_block15_exit', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter exit customs office"
              />
            </div>
          </div>
        )

      case 16:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Signatory Name *
              </label>
              <input
                type="text"
                value={f('mov_block16_name') || ''}
                onChange={(e) => handleInputChange('mov_block16_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter signatory name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Date *
              </label>
              <input
                type="date"
                value={f('mov_block16_date') || ''}
                onChange={(e) => handleInputChange('mov_block16_date', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="mov_block16_acknowledge"
                checked={fb('mov_block16_acknowledge')}
                onChange={(e) => handleInputChange('mov_block16_acknowledge', e.target.checked)}
                className="w-5 h-5"
                style={{ accentColor: '#1D9E75' }}
              />
              <label
                htmlFor="mov_block16_acknowledge"
                className="font-body text-white"
                style={{ color: '#ffffff' }}
              >
                I confirm the above information is accurate
              </label>
            </div>
          </div>
        )

      case 17:
        return (
          <div className="grid gap-4">
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Recipient Name *
              </label>
              <input
                type="text"
                value={f('mov_block17_name') || ''}
                onChange={(e) => handleInputChange('mov_block17_name', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
                placeholder="Enter recipient name"
              />
            </div>
            <div>
              <label className="block font-body text-sm mb-2" style={{ color: '#ffffff' }}>
                Date of Receipt *
              </label>
              <input
                type="date"
                value={f('mov_block17_date') || ''}
                onChange={(e) => handleInputChange('mov_block17_date', e.target.value)}
                className="w-full px-4 py-3 rounded-lg font-body text-white"
                style={{ backgroundColor: '#1C1B18', border: '1px solid #3a3a38' }}
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="mov_block17_confirm"
                checked={fb('mov_block17_confirm')}
                onChange={(e) => handleInputChange('mov_block17_confirm', e.target.checked)}
                className="w-5 h-5"
                style={{ accentColor: '#1D9E75' }}
              />
              <label
                htmlFor="mov_block17_confirm"
                className="font-body text-white"
                style={{ color: '#ffffff' }}
              >
                I confirm receipt of the above waste shipment
              </label>
            </div>
          </div>
        )

      case 18:
      case 19:
        return (
          <div
            className="p-6 rounded-lg text-center"
            style={{ backgroundColor: '#1a1a18', border: '1px dashed #4a4a48' }}
          >
            <p className="font-body text-lg mb-2" style={{ color: '#888' }}>
              Reserved for Competent Authority
            </p>
            <p className="font-body text-sm" style={{ color: '#666' }}>
              For official use only
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#1C1B18' }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-white text-3xl mb-2">
            Basel Desk
          </h1>
          <p className="font-body text-base" style={{ color: '#a0a09a' }}>
            Generate Basel Convention notification and movement documents
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('reference')}
            className="px-6 py-3 rounded-lg font-display font-bold transition-all"
            style={{
              backgroundColor: activeTab === 'reference' ? '#1D9E75' : '#2c2c2a',
              color: activeTab === 'reference' ? '#ffffff' : '#a0a09a',
            }}
          >
            Interactive Reference
          </button>
          <button
            onClick={() => setActiveTab('fill')}
            className="px-6 py-3 rounded-lg font-display font-bold transition-all"
            style={{
              backgroundColor: activeTab === 'fill' ? '#1D9E75' : '#2c2c2a',
              color: activeTab === 'fill' ? '#ffffff' : '#a0a09a',
            }}
          >
            Fill Your Form
          </button>
        </div>

        {activeTab === 'reference' && (
          <div>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setSelectedDoc('notification')}
                className="px-4 py-2 rounded-lg font-display font-bold transition-all"
                style={{
                  backgroundColor: selectedDoc === 'notification' ? '#1D9E75' : '#2c2c2a',
                  color: selectedDoc === 'notification' ? '#ffffff' : '#a0a09a',
                }}
              >
                Notification Form (Blocks 1-21)
              </button>
              <button
                onClick={() => setSelectedDoc('movement')}
                className="px-4 py-2 rounded-lg font-display font-bold transition-all"
                style={{
                  backgroundColor: selectedDoc === 'movement' ? '#1D9E75' : '#2c2c2a',
                  color: selectedDoc === 'movement' ? '#ffffff' : '#a0a09a',
                }}
              >
                Movement Document (Blocks 1-19)
              </button>
            </div>

            <div className="grid gap-4">
              {blocks.map((block) => {
                const showLearnMore =
                  block.slug && block.slug.length > 0 && block.hasLearnMore !== false
                const prefix = selectedDoc === 'notification' ? 'notification-app' : 'movement-doc'
                const learnMoreUrl = `/knowledge-hub/${prefix}/${block.slug}`

                const isReserved = block.isReserved === true

                return (
                  <div
                    key={block.number}
                    className="p-6 rounded-lg"
                    style={{
                      backgroundColor: isReserved ? '#1a1a18' : '#2c2c2a',
                      border: isReserved ? '1px dashed #4a4a48' : '1px solid #3a3a38',
                      opacity: isReserved ? 0.7 : 1,
                    }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className="px-2 py-1 rounded text-xs font-bold"
                            style={{
                              backgroundColor: isReserved ? '#555' : '#1D9E75',
                              color: '#ffffff',
                            }}
                          >
                            Block {block.number}
                          </span>
                          <h3 className="font-display font-bold text-white text-lg">
                            {block.title}
                          </h3>
                        </div>
                        <p className="font-body text-sm mb-3" style={{ color: '#a0a09a' }}>
                          {block.description}
                        </p>
                        {showLearnMore && !isReserved && (
                          <div className="flex gap-3">
                            <a
                              href={learnMoreUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-body transition-colors"
                              style={{ backgroundColor: '#1C1B18', color: '#1D9E75' }}
                            >
                              Learn More →
                            </a>
                            <button
                              onClick={() => handleCopilotOpen(block.number, block.title)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded text-sm font-body transition-colors"
                              style={{ backgroundColor: '#FF5C00', color: '#ffffff' }}
                            >
                              Ask Copilot
                            </button>
                          </div>
                        )}
                        {isReserved && (
                          <div className="flex gap-3">
                            <span
                              className="inline-flex items-center px-3 py-1.5 rounded text-sm font-body"
                              style={{ backgroundColor: '#2a2a28', color: '#888' }}
                            >
                              Reserved for Competent Authority
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {activeTab === 'fill' && (
          <div>
            <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#2c2c2a' }}>
              <div className="flex items-center gap-4">
                <span className="font-body text-sm" style={{ color: '#a0a09a' }}>
                  Select Document:
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedDoc('notification')
                      setCurrentStep(0)
                    }}
                    className="px-4 py-2 rounded font-display font-bold transition-all"
                    style={{
                      backgroundColor: selectedDoc === 'notification' ? '#1D9E75' : '#1C1B18',
                      color: '#ffffff',
                    }}
                  >
                    Notification
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDoc('movement')
                      setCurrentStep(0)
                    }}
                    className="px-4 py-2 rounded font-display font-bold transition-all"
                    style={{
                      backgroundColor: selectedDoc === 'movement' ? '#1D9E75' : '#1C1B18',
                      color: '#ffffff',
                    }}
                  >
                    Movement Document
                  </button>
                </div>
              </div>

              <div
                className="flex items-center gap-4 mt-4 pt-4"
                style={{ borderTop: '1px solid #3a3a38' }}
              >
                <input
                  type="checkbox"
                  id="is_eu_route"
                  checked={isEuRoute}
                  onChange={(e) => setIsEuRoute(e.target.checked)}
                  className="w-5 h-5"
                  style={{ accentColor: '#1D9E75' }}
                />
                <label
                  htmlFor="is_eu_route"
                  className="font-body text-sm text-white"
                  style={{ color: '#ffffff' }}
                >
                  This shipment transits through or involves EU member states
                </label>
              </div>
            </div>

            <div className="mb-4 flex items-center justify-between">
              <span className="font-body text-sm" style={{ color: '#a0a09a' }}>
                Step {currentStep + 1} of {totalSteps}
              </span>
              <div className="w-64 h-2 rounded-full" style={{ backgroundColor: '#2c2c2a' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    backgroundColor: '#1D9E75',
                    width: `${((currentStep + 1) / totalSteps) * 100}%`,
                  }}
                />
              </div>
            </div>

            {(() => {
              const block = blocks[currentStep]
              const isReserved = block.isReserved === true

              if (isReserved) {
                return (
                  <div
                    className="p-6 rounded-lg"
                    style={{ backgroundColor: '#1a1a18', border: '1px dashed #4a4a48' }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <span
                        className="px-2 py-1 rounded text-xs font-bold"
                        style={{ backgroundColor: '#555', color: '#ffffff' }}
                      >
                        Block {block.number}
                      </span>
                      <h3 className="font-display font-bold text-white text-xl">{block.title}</h3>
                    </div>
                    <p className="font-body text-sm" style={{ color: '#888' }}>
                      This section is reserved for official use by the Competent Authority. No data
                      entry required.
                    </p>
                  </div>
                )
              }

              return (
                <div
                  className="p-6 rounded-lg"
                  style={{ backgroundColor: '#2c2c2a', border: '1px solid #3a3a38' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="px-2 py-1 rounded text-xs font-bold"
                      style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}
                    >
                      Block {block.number}
                    </span>
                    <h3 className="font-display font-bold text-white text-xl">{block.title}</h3>
                  </div>
                  <p className="font-body text-sm mb-6" style={{ color: '#a0a09a' }}>
                    {block.description}
                  </p>

                  {selectedDoc === 'notification' ? renderBlockField(block.number) : renderMovementBlockField(block.number)}

                  <div className="flex justify-between mt-8">
                    <button
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                      className="px-6 py-3 rounded-lg font-display font-bold transition-all disabled:opacity-50"
                      style={{
                        backgroundColor: '#2c2c2a',
                        color: '#ffffff',
                        border: '1px solid #3a3a38',
                      }}
                    >
                      Previous
                    </button>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveProgress}
                        className="px-6 py-3 rounded-lg font-display font-bold transition-all"
                        style={{
                          backgroundColor: '#1C1B18',
                          color: '#FF5C00',
                          border: '1px solid #FF5C00',
                        }}
                      >
                        Save Progress
                      </button>
                      {currentStep === totalSteps - 1 ? (
                        <button
                          onClick={handleGeneratePDF}
                          className="px-6 py-3 rounded-lg font-display font-bold transition-all"
                          style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}
                        >
                          Generate PDF
                        </button>
                      ) : (
                        <button
                          onClick={handleNext}
                          className="px-6 py-3 rounded-lg font-display font-bold transition-all"
                          style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}
                        >
                          Next
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {copilotOpen && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
          >
            <div
              className="p-6 rounded-lg max-w-md w-full mx-4"
              style={{ backgroundColor: '#2c2c2a' }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-white text-lg">Basel Copilot</h3>
                <button onClick={() => setCopilotOpen(false)} className="text-white text-xl">
                  ×
                </button>
              </div>
              <p className="font-body text-sm mb-4" style={{ color: '#a0a09a' }}>
                Context: {copilotContext}
              </p>
              <p className="font-body text-sm" style={{ color: '#a0a09a' }}>
                The Copilot chat widget integration will open here with the block context
                pre-loaded.
              </p>
              <button
                onClick={() => setCopilotOpen(false)}
                className="mt-4 w-full px-4 py-2 rounded font-display font-bold"
                style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
