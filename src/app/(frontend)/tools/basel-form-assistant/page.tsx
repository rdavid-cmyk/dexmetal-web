'use client'

import { useState, useEffect, useRef } from 'react'

interface Block {
  number: number
  title: string
  description: string
  slug: string
  hasLearnMore?: boolean
  isReserved?: boolean
}

const NOTIFICATION_BLOCKS: Block[] = [
  { number: 1, title: 'Exporter – Notifier', description: 'Name, address, and contact details of the waste exporter/notifier', slug: 'exporter-notifier' },
  { number: 2, title: 'Importer – Consignee', description: 'Name, address, and contact details of the waste importer/consignee', slug: 'importer-consignee' },
  { number: 3, title: 'Notification No + shipment type + operation type + pre-consent', description: 'Unique notification number, shipment type, operation type, and pre-consent status', slug: 'notification-number' },
  { number: 4, title: 'Total intended number of shipments', description: 'Total number of shipments planned for this notification', slug: 'total-shipments' },
  { number: 5, title: 'Total intended quantity', description: 'Total quantity of waste in tonnes', slug: 'total-quantity' },
  { number: 6, title: 'Intended period of time', description: 'Planned start and end dates for the shipment period', slug: 'intended-period' },
  { number: 7, title: 'Packaging type(s) + special handling', description: 'Type of packaging and any special handling requirements', slug: 'packaging' },
  { number: 8, title: 'Intended carrier(s)', description: 'Details of the planned carrier(s) for waste transport', slug: 'intentional-carriers' },
  { number: 9, title: 'Waste generator(s) – producer(s)', description: 'Name, address, and contact of waste generator(s) and producer(s)', slug: 'waste-generator' },
  { number: 10, title: 'Disposal/recovery facility', description: 'Details of the final disposal or recovery facility', slug: 'disposal-facility' },
  { number: 11, title: 'Disposal/recovery operation(s)', description: 'The specific disposal or recovery operation code(s)', slug: 'operation-code' },
  { number: 12, title: 'Designation and composition of the waste', description: 'Detailed designation and composition of the waste', slug: 'waste-designation' },
  { number: 13, title: 'Physical characteristics', description: 'Physical form and characteristics of the waste', slug: 'physical-characteristics' },
  { number: 14, title: 'Waste identification codes (i–xii)', description: 'All applicable waste identification codes (Basel, OECD, EU, etc.)', slug: 'waste-codes' },
  { number: 15, title: 'Countries/states concerned', description: 'All countries/states involved in the transboundary movement', slug: 'countries-concerned' },
  { number: 16, title: 'EU customs offices', description: 'EU customs offices of entry and exit', slug: 'customs-offices' },
  { number: 17, title: 'Exporter/generator declaration', description: 'Declaration by the exporter or generator', slug: 'declaration' },
  { number: 18, title: 'Number of annexes', description: 'Number of annexes attached to the notification', slug: 'annexes', hasLearnMore: true },
  { number: 19, title: 'Reserved for Competent Authority', description: 'For official use only', slug: '', isReserved: true },
  { number: 20, title: 'Reserved for Competent Authority', description: 'For official use only', slug: '', isReserved: true },
  { number: 21, title: 'Reserved for Competent Authority', description: 'For official use only', slug: '', isReserved: true },
]

const SHIPMENT_TYPES = [{ value: 'single', label: 'Single' }, { value: 'multiple', label: 'Multiple' }]
const OPERATION_TYPES = [{ value: 'disposal', label: 'Disposal' }, { value: 'recovery', label: 'Recovery' }]
const PHYSICAL_FORMS = [{ value: 'solid', label: 'Solid' }, { value: 'liquid', label: 'Liquid' }, { value: 'sludge', label: 'Sludge' }, { value: 'gas', label: 'Gas' }, { value: 'powder', label: 'Powder' }, { value: 'other', label: 'Other' }]
const PACKAGING_TYPES = [{ value: 'drums', label: 'Drums' }, { value: 'wooden_barrels', label: 'Wooden barrels' }, { value: 'jerricans', label: 'Jerricans' }, { value: 'boxes', label: 'Boxes' }, { value: 'bags', label: 'Bags' }, { value: 'composite', label: 'Composite packaging' }, { value: 'pressure_receptacles', label: 'Pressure receptacles' }, { value: 'bulk', label: 'Bulk' }]
const TRANSPORT_MODES = [{ value: 'road', label: 'Road' }, { value: 'rail', label: 'Rail' }, { value: 'sea', label: 'Sea' }, { value: 'air', label: 'Air' }, { value: 'inland_waterway', label: 'Inland waterway' }]
const DISPOSAL_CODES = [{ value: 'D1', label: 'D1 - Controlled landfill' }, { value: 'D2', label: 'D2 - Deep injection' }, { value: 'D3', label: 'D3 - Deep well injection' }, { value: 'D4', label: 'D4 - Surface impoundment' }, { value: 'D5', label: 'D5 - Specially engineered landfill' }, { value: 'D6', label: 'D6 - Release into water bodies' }, { value: 'D7', label: 'D7 - Release into sea/oceans' }, { value: 'D8', label: 'D8 - Biological treatment' }, { value: 'D9', label: 'D9 - Physico-chemical treatment' }, { value: 'D10', label: 'D10 - Incineration' }, { value: 'D11', label: 'D11 - Incineration at sea' }, { value: 'D12', label: 'D12 - Permanent storage' }, { value: 'D13', label: 'D13 - Blending/recipe' }, { value: 'D14', label: 'D14 - Repackaging' }, { value: 'D15', label: 'D15 - Storage pending D1-D14' }]
const RECOVERY_CODES = [{ value: 'R1', label: 'R1 - Use as fuel' }, { value: 'R2', label: 'R2 - Solvent reclamation' }, { value: 'R3', label: 'R3 - Recycling/reclamation of organics' }, { value: 'R4', label: 'R4 - Recycling/reclamation of metals' }, { value: 'R5', label: 'R5 - Recycling/reclamation of inorganics' }, { value: 'R6', label: 'R6 - Regeneration of acids/bases' }, { value: 'R7', label: 'R7 - Recovery of components' }, { value: 'R8', label: 'R8 - Recovery of catalysts' }, { value: 'R9', label: 'R9 - Re-refining used oil' }, { value: 'R10', label: 'R10 - Land treatment' }, { value: 'R11', label: 'R11 - Uses of waste' }, { value: 'R12', label: 'R12 - Waste exchange' }, { value: 'R13', label: 'R13 - Accumulation of R1-R12' }]

interface FormData {
  [key: string]: string | string[] | boolean
}

const SAMPLE_DATA: FormData = {
  block1_name: 'Caribbean Electronic Recovery Solutions',
  block1_address: 'Lot 45B, La Brea Industrial Estate, La Brea, Trinidad',
  block1_country: 'Trinidad and Tobago',
  block1_contact: 'Richard David',
  block1_phone: '+1 868 555 0100',
  block1_email: 'info@caribbeanrecovery.tt',
  block2_name: 'AMRI Inc',
  block2_address: '4848 Westway Park Blvd, Houston, TX 77041',
  block2_country: 'United States of America',
  block2_contact: 'Operations Manager',
  block2_phone: '+1 713 555 0200',
  block2_email: 'ops@amriinc.com',
  block3_notification_no: 'TT-2026-001',
  block3_shipment_type: 'single',
  block3_operation_type: 'recovery',
  block3_preconsent: false,
  block4_shipments: '1',
  block5_quantity: '24.5',
  block6_start: '2026-06-01',
  block6_end: '2026-06-30',
  block7_packaging: ['drums'],
  block7_special_handling: 'Used lead-acid batteries — corrosive, handle with PPE',
  block8_name: 'Caribbean Freight Services Ltd',
  block8_address: 'Port of Spain, Trinidad',
  block8_transport: ['sea'],
  block9_name: 'Caribbean Electronic Recovery Solutions',
  block9_address: 'Lot 45B, La Brea Industrial Estate, La Brea, Trinidad',
  block9_contact: 'Richard David',
  block9_phone: '+1 868 555 0100',
  block10_name: 'AMRI Inc — Houston Facility',
  block10_address: '4848 Westway Park Blvd, Houston, TX 77041',
  block10_permit: 'TX-EPA-2024-ULAB-0042',
  block10_contact: 'Operations Manager',
  block11_code: 'R4',
  block12_description: 'Used lead-acid batteries (ULABs) from automotive and industrial sources',
  block12_composition: 'Lead (Pb) ~60%, Sulfuric acid electrolyte ~20%, Polypropylene casing ~10%, other ~10%',
  block13_form: 'solid',
  block14_basel: 'A1160',
  block14_oecd: 'GC020',
  block14_eu: '',
  block14_national: '',
  block14_un_class: '8',
  block14_un_number: 'UN2794',
  block14_y_code: 'Y31',
  block14_h_code: 'H8',
  block15_export: 'Trinidad and Tobago',
  block15_import: 'United States of America',
  block15_transit: '',
  block17_name: 'Richard David',
  block17_date: '2026-05-15',
  block17_acknowledge: true,
  block18_count: '3',
  block18_descriptions: '1. Waste characterization report\n2. Facility permit (AMRI Inc)\n3. Insurance certificate',
}

const DISCLAIMER_BANNER = (
  <div className="mb-6 p-4 rounded-lg font-body" style={{ backgroundColor: '#2c2c2a', borderLeft: '3px solid #FF5C00', color: '#a0a09a', fontSize: '13px', padding: '12px 16px', marginBottom: '24px' }}>
    This tool assists with form preparation but does not guarantee compliance. Users are responsible for verifying accuracy with their competent authority.
  </div>
)

export default function BaselFormAssistantPage() {
  const [activeTab, setActiveTab] = useState<'reference' | 'fill'>('reference')
  const [selectedDoc, setSelectedDoc] = useState<'notification' | 'movement'>('notification')
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({})
  const [isEuRoute, setIsEuRoute] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const blocks = NOTIFICATION_BLOCKS
  const totalSteps = 21

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
    localStorage.setItem(
      'basel_notification_form',
      JSON.stringify({ formData, isEuRoute, currentStep }),
    )
  }, [formData, isEuRoute, currentStep])

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
    localStorage.setItem('basel_notification_form', JSON.stringify({ formData, isEuRoute, currentStep }))
    alert('Progress saved!')
  }

const handleGeneratePDF = async () => {
    const saved = localStorage.getItem('basel_notification_form')
    if (!saved) {
      alert('No form data found. Please fill out the form first.')
      return
    }

    try {
      const { formData: fd, isEuRoute: isEu } = JSON.parse(saved)
      
      const transitList = ((fd.block15_transit as string) || '').split(',').filter(Boolean).map((c: string) => ({ country: c.trim(), ca_code: null, entry_point: null, exit_point: null }))
      
      const formProject = {
        project: {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'draft',
          jurisdiction: {
            export_country_iso: (fd.block1_country as string)?.slice(0, 2).toUpperCase() || 'TT',
            import_country_iso: (fd.block2_country as string)?.slice(0, 2).toUpperCase() || 'US',
            transit_country_isos: ((fd.block15_transit as string) || '').split(',').filter(Boolean).map((c: string) => c.trim().slice(0, 2).toUpperCase()),
            is_eu_route: isEu
          }
        },
        notification: {
          block_1: { registration_no: '', name: fd.block1_name || '', address: fd.block1_address || '', contact_person: fd.block1_contact || '', tel: fd.block1_phone || '', fax: null, email: fd.block1_email || '' },
          block_2: { registration_no: '', name: fd.block2_name || '', address: fd.block2_address || '', contact_person: fd.block2_contact || '', tel: fd.block2_phone || '', fax: null, email: fd.block2_email || '' },
          block_3: { notification_no: fd.block3_notification_no || null, shipment_type: fd.block3_shipment_type || 'individual', operation_category: fd.block3_operation_type || 'recovery', pre_consented_facility: fd.block3_preconsent || false },
          block_4: { total_shipments: parseInt(fd.block4_shipments as string) || 1 },
          block_5: { quantity_tonnes: parseFloat(fd.block5_quantity as string) || null, quantity_cubic_metres: null, unit_note: null },
          block_6: { first_departure: fd.block6_start || '', last_departure: fd.block6_end || null },
          block_7: { packaging_types: (fd.block7_packaging as string[]) || ['1'], packaging_other_specify: null, special_handling_required: !!fd.block7_special_handling, special_handling_detail: fd.block7_special_handling || null },
          block_8: { carriers: [{ registration_no: '', name: fd.block8_name || '', address: fd.block8_address || '', contact_person: null, tel: '', fax: null, email: null, means_of_transport: (fd.block8_transport as string[])?.map(t => t.charAt(0).toUpperCase()) || ['S'] }] },
          block_9: { same_as_block_1: false, generators: [{ registration_no: '', name: fd.block9_name || '', address: fd.block9_address || '', contact_person: fd.block9_contact || null, tel: fd.block9_phone || null, fax: null, email: null, site_and_process_of_generation: null }] },
          block_10: { facility_type: fd.block3_operation_type === 'disposal' ? 'disposal' : 'recovery', registration_no: fd.block10_permit || null, name: fd.block10_name || '', address: fd.block10_address || '', contact_person: fd.block10_contact || null, tel: '', fax: null, email: null, actual_site_if_different: null },
          block_11: { operation_code: fd.block11_code || 'R4', technology_employed: '', reason_for_export: '' },
          block_12: { common_name: fd.block12_description || '', major_constituents: fd.block12_composition || '', hazardous_constituents: null, chemical_analysis_attached: false },
          block_13: { physical_characteristics: [fd.block13_form || '2'], physical_characteristics_other: null },
          block_14: { i_basel_annex: fd.block14_basel || null, ii_oecd_code: fd.block14_oecd || null, iii_ec_list: fd.block14_eu || null, iv_national_export: fd.block14_national || null, v_national_import: null, vi_other: null, vii_y_code: fd.block14_y_code || null, viii_h_codes: fd.block14_h_code ? [fd.block14_h_code] : [], ix_un_class: fd.block14_un_class || null, x_un_number: fd.block14_un_number || null, xi_un_shipping_name: null, xii_customs_code_hs: null },
          block_15: { 
            export_state: { country: String(fd.block15_export || ''), ca_code: null, border_point: null }, 
            transit_states: transitList, 
            import_state: { country: String(fd.block15_import || ''), ca_code: null, border_point: null } 
          },
          block_16: isEu ? { entry: '', exit: '', export: '' } : { entry: null, exit: null, export: null },
          block_17: { exporter_name: fd.block17_name || '', exporter_date: fd.block17_date || '', exporter_signature_status: fd.block17_acknowledge ? 'signed' : 'pending', generator_name: null, generator_date: null, generator_signature_status: null },
          block_18: { total_annexes: parseInt(fd.block18_count as string) || 0, annex_descriptions: (fd.block18_descriptions as string)?.split('\n').filter(Boolean) || [] }
        },
        movement: null,
        supporting_documents: null,
        validation: null,
        meta: { schema_version: '1.0.0', exported_at: new Date().toISOString(), tool: 'DexMetal Basel Form Assistant' }
      }

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formProject)
      })

      if (!response.ok) {
        throw new Error('PDF generation failed')
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'basel_notification_draft.pdf'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('PDF generation error:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }
  const handleDownloadProgress = () => {
    const data = { formData, isEuRoute, currentStep }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const today = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `basel_notification_${today}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleLoadProgressClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        if (parsed.formData) {
          setFormData(parsed.formData)
          setIsEuRoute(parsed.isEuRoute || false)
          setCurrentStep(parsed.currentStep || 0)
          alert('Progress restored!')
        } else {
          alert('Invalid file — could not restore progress')
        }
      } catch {
        alert('Invalid file — could not restore progress')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  const handleLoadSampleData = () => {
    setFormData(SAMPLE_DATA)
    setIsEuRoute(false)
    setCurrentStep(0)
  }

  if (activeTab === 'reference') {
    return (
      <div className="min-h-screen font-body" style={{ backgroundColor: '#f5f5f0', padding: '32px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Basel Form Assistant</h1>
          <p className="text-lg mb-8" style={{ color: '#666660' }}>Quick reference guide to the vCOP8 Notification and Movement documents.</p>
          {DISCLAIMER_BANNER}
          <div className="flex gap-4 mb-8 border-b" style={{ borderColor: '#e5e5e0' }}>
            <button onClick={() => setActiveTab('reference')} className="px-4 py-2 font-display font-bold border-b-2" style={{ borderColor: '#FF5C00', color: '#FF5C00' }}>Reference</button>
            <button onClick={() => setActiveTab('fill')} className="px-4 py-2 font-display font-bold" style={{ color: '#999990' }}>Fill Form</button>
          </div>
          <div className="space-y-4">
            {NOTIFICATION_BLOCKS.map((block) => (
              <div key={block.number} id={`block-${block.number}`} className="p-6 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e0' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="inline-block px-2 py-1 rounded text-sm font-bold" style={{ backgroundColor: '#FF5C00', color: '#ffffff', marginBottom: '8px' }}>Block {block.number}</span>
                    <h3 className="text-xl font-display font-bold" style={{ color: '#1a1a1a' }}>{block.title}</h3>
                    <p className="mt-1" style={{ color: '#666660' }}>{block.description}</p>
                  </div>
                  {block.isReserved && <span className="px-3 py-1 rounded text-sm font-bold" style={{ backgroundColor: '#f0f0e0', color: '#888880' }}>CA Only</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#f5f5f0', padding: '32px 24px' }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Fill Out Your Notification</h1>
        <p className="text-lg mb-6" style={{ color: '#666660' }}>Complete the vCOP8 Notification Document fields below.</p>
        {DISCLAIMER_BANNER}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setSelectedDoc('notification')} className={`px-4 py-2 rounded font-display font-bold ${selectedDoc === 'notification' ? '' : 'opacity-50'}`} style={{ backgroundColor: selectedDoc === 'notification' ? '#1D9E75' : '#cccccc', color: '#ffffff' }}>Notification</button>
          <button onClick={() => setSelectedDoc('movement')} className={`px-4 py-2 rounded font-display font-bold ${selectedDoc === 'movement' ? '' : 'opacity-50'}`} style={{ backgroundColor: selectedDoc === 'movement' ? '#1D9E75' : '#cccccc', color: '#ffffff' }}>Movement</button>
        </div>
        <div className="flex gap-4 mb-6 border-b" style={{ borderColor: '#e5e5e0' }}>
          <button onClick={() => { setActiveTab('reference'); setSelectedDoc('notification'); }} className="px-4 py-2 font-display font-bold border-b-2" style={{ borderColor: '#FF5C00', color: '#FF5C00' }}>Reference</button>
          <button onClick={() => setActiveTab('fill')} className="px-4 py-2 font-display font-bold border-b-2" style={{ borderColor: '#1D9E75', color: '#1D9E75' }}>Smart Form</button>
        </div>
        <div className="mb-4 flex gap-2">
          <button onClick={handleLoadSampleData} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Load Sample</button>
          <button onClick={handleSaveProgress} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Save Progress</button>
          <button onClick={handleDownloadProgress} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Download JSON</button>
          <button onClick={handleLoadProgressClick} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Load JSON</button>
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".json" style={{ display: 'none' }} />
        </div>
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#e8f4f0', border: '1px solid #1D9E75' }}>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isEuRoute} onChange={(e) => setIsEuRoute(e.target.checked)} className="w-4 h-4" style={{ accentColor: '#1D9E75' }} />
            <span className="font-display font-bold" style={{ color: '#1D9E75' }}>This is an EU route (shows Block 16)</span>
          </label>
        </div>
        <div className="flex justify-between items-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e0' }}>
          <button onClick={handlePrev} disabled={currentStep === 0} className="px-4 py-2 rounded font-display font-bold disabled:opacity-50" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>← Prev</button>
          <span className="font-display font-bold" style={{ color: '#1a1a1a' }}>Step {currentStep + 1} of {totalSteps}: Block {blocks[currentStep]?.number}</span>
          <button onClick={handleNext} disabled={currentStep === totalSteps - 1} className="px-4 py-2 rounded font-display font-bold disabled:opacity-50" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Next →</button>
        </div>
        <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e0' }}>
          <span className="inline-block px-2 py-1 rounded text-sm font-bold mb-2" style={{ backgroundColor: '#FF5C00', color: '#ffffff' }}>Block {blocks[currentStep]?.number}</span>
          <h2 className="text-2xl font-display font-bold mb-4" style={{ color: '#1a1a1a' }}>{blocks[currentStep]?.title}</h2>
          <p className="mb-6" style={{ color: '#666660' }}>{blocks[currentStep]?.description}</p>
          {currentStep >= 18 && currentStep <= 20 && (
            <div className="p-4 rounded-lg" style={{ backgroundColor: '#f0f0e0', color: '#888880' }}>
              <p className="font-bold">This section is reserved for the Competent Authority.</p>
              <p className="text-sm mt-1">Leave blank. The CA will complete this after receives your notification.</p>
            </div>
          )}
          {!isEuRoute && currentStep === 15 && (
            <p style={{ color: '#666660' }}>This section hidden — toggle EU route above to show.</p>
          )}
        </div>
        <div className="flex justify-between">
          <button onClick={handlePrev} disabled={currentStep === 0} className="px-6 py-3 rounded-lg font-display font-bold disabled:opacity-50" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>← Previous Block</button>
          <button onClick={handleGeneratePDF} className="px-6 py-3 rounded-lg font-display font-bold transition-all" style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}>Generate PDF</button>
          <button onClick={handleNext} disabled={currentStep === totalSteps - 1} className="px-6 py-3 rounded-lg font-display font-bold disabled:opacity-50" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Next Block →</button>
        </div>
      </div>
    </div>
  )
}
