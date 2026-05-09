'use client'

import { useState, useEffect, useRef } from 'react'
import EmailGate from '@/components/EmailGate'
import JSZip from 'jszip'
import ShepherdTour, { TourStep } from '@/components/tools/ShepherdTour'

interface SupportingDoc {
  id: number
  name: string
  blocks: number[]
  mandatory: boolean
}

const SUPPORTING_DOCS: SupportingDoc[] = [
  { id: 1, name: "Exporter/Notifier Registration Certificate", blocks: [1], mandatory: true },
  { id: 2, name: "Consignee/Importer Authorization", blocks: [2], mandatory: true },
  { id: 3, name: "Facility Pre-Authorization / Permit", blocks: [7], mandatory: true },
  { id: 4, name: "Waste Generator Declaration", blocks: [6], mandatory: true },
  { id: 5, name: "Carrier Authorization(s)", blocks: [5], mandatory: true },
  { id: 6, name: "Waste Composition Analysis Report", blocks: [14, 16], mandatory: true },
  { id: 7, name: "Packaging Declaration", blocks: [12], mandatory: true },
  { id: 8, name: "UN Dangerous Goods Declaration", blocks: [13, 14], mandatory: false },
  { id: 9, name: "Financial Guarantee / Insurance Certificate", blocks: [15], mandatory: true },
  { id: 10, name: "Contract between Notifier and Facility", blocks: [7], mandatory: true },
  { id: 11, name: "Customs Broker Authorization", blocks: [16], mandatory: false },
  { id: 12, name: "Basel Y-Code Classification Worksheet", blocks: [14], mandatory: true },
  { id: 13, name: "Physical Characteristics Statement", blocks: [13], mandatory: true },
  { id: 14, name: "Process Description (Waste Generation)", blocks: [15], mandatory: true },
  { id: 15, name: "Non-Hazardous Declaration", blocks: [14], mandatory: false },
  { id: 16, name: "Import Country CA Consent Letter", blocks: [20], mandatory: true },
  { id: 17, name: "Export Country CA Acknowledgement", blocks: [8], mandatory: true },
  { id: 18, name: "Transit Country CA Consent(s)", blocks: [10], mandatory: false },
  { id: 19, name: "Movement Document (pre-prepared)", blocks: [11], mandatory: true },
  { id: 20, name: "Pre-Shipment Inspection Certificate", blocks: [5, 12], mandatory: false },
  { id: 21, name: "Port of Loading Documentation", blocks: [11], mandatory: false },
  { id: 22, name: "Port of Discharge Documentation", blocks: [11], mandatory: false },
  { id: 23, name: "IATA/IMDG Compliance Certificate", blocks: [13], mandatory: false },
  { id: 24, name: "Deed of Indemnity", blocks: [7], mandatory: false },
  { id: 25, name: "EMA / National CA Pre-Approval (T&T)", blocks: [8], mandatory: false },
  { id: 26, name: "Waste Testing / Characterization Report", blocks: [14, 16], mandatory: true },
  { id: 27, name: "Compliance Checklist (self-certification)", blocks: [18], mandatory: true },
  { id: 28, name: "Correspondence Log", blocks: [], mandatory: true }
]

interface Block {
  number: number
  title: string
  description: string
  slug: string
  hasLearnMore?: boolean
  isReserved?: boolean
  isSynced?: boolean
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

const MOVEMENT_BLOCKS: Block[] = [
  { number: 1, title: 'Corresponding notification + serial/total', description: 'Notification number and shipment serial', slug: 'notification-serial' },
  { number: 2, title: 'Actual quantity of waste', description: 'Actual quantity shipped (may differ from notification)', slug: 'actual-quantity' },
  { number: 3, title: 'Exporter – Notifier', description: 'Name, address, contact (synced from Notification)', slug: 'exporter-notifier-synced', isSynced: true },
  { number: 4, title: 'Importer – Consignee', description: 'Name, address, contact (synced from Notification)', slug: 'importer-consignee-synced', isSynced: true },
  { number: 5, title: 'Date of shipment', description: 'Actual date of shipment', slug: 'shipment-date' },
  { number: 6, title: 'Packaging + number of packages', description: 'Packaging type and count', slug: 'packaging' },
  { number: 7, title: 'Carrier(s)', description: 'Carrier details', slug: 'carriers' },
  { number: 8, title: 'Waste generator(s)', description: 'Generator info (synced from Notification)', slug: 'generator-synced', isSynced: true },
  { number: 9, title: 'Disposal/recovery facility', description: 'Facility details (synced from Notification)', slug: 'facility-synced', isSynced: true },
  { number: 10, title: 'Disposal/recovery operation', description: 'Operation code (synced from Notification)', slug: 'operation-synced', isSynced: true },
  { number: 11, title: 'Designation and composition', description: 'Waste designation (synced from Notification)', slug: 'designation-synced', isSynced: true },
  { number: 12, title: 'Physical characteristics', description: 'Physical form (synced from Notification)', slug: 'physical-synced', isSynced: true },
  { number: 13, title: 'Waste identification codes', description: 'Waste codes (synced from Notification)', slug: 'codes-synced', isSynced: true },
  { number: 14, title: 'Countries concerned', description: 'Export, transit, import countries', slug: 'countries' },
  { number: 15, title: 'Exporter/generator declaration', description: 'Declaration by exporter/generator', slug: 'exporter-declaration' },
  { number: 16, title: 'Additional information', description: 'Additional info for those involved', slug: 'additional-info' },
  { number: 17, title: 'Received by importer', description: 'Shipment received by importer/consignee', slug: 'received-importer', isReserved: true },
  { number: 18, title: 'Received at facility', description: 'Shipment received at disposal/recovery facility', slug: 'received-facility', isReserved: true },
  { number: 19, title: 'Disposal/recovery certification', description: 'Certification of completion by facility', slug: 'certification', isReserved: true },
]

const SHIPMENT_TYPES = [{ value: 'single', label: 'Single' }, { value: 'multiple', label: 'Multiple' }]
const OPERATION_TYPES = [{ value: 'disposal', label: 'Disposal' }, { value: 'recovery', label: 'Recovery' }]
const PHYSICAL_FORMS = [{ value: 'solid', label: 'Solid' }, { value: 'liquid', label: 'Liquid' }, { value: 'sludge', label: 'Sludge' }, { value: 'gas', label: 'Gas' }, { value: 'powder', label: 'Powder' }, { value: 'other', label: 'Other' }]
const PACKAGING_TYPES = [{ value: 'drums', label: 'Drums' }, { value: 'wooden_barrels', label: 'Wooden barrels' }, { value: 'jerricans', label: 'Jerricans' }, { value: 'boxes', label: 'Boxes' }, { value: 'bags', label: 'Bags' }, { value: 'composite', label: 'Composite packaging' }, { value: 'pressure_receptacles', label: 'Pressure receptacles' }, { value: 'bulk', label: 'Bulk' }]
const TRANSPORT_MODES = [{ value: 'road', label: 'Road' }, { value: 'rail', label: 'Rail' }, { value: 'sea', label: 'Sea' }, { value: 'air', label: 'Air' }, { value: 'inland_waterway', label: 'Inland waterway' }]
const DISPOSAL_CODES = [{ value: 'D1', label: 'D1 - Controlled landfill' }, { value: 'D2', label: 'D2 - Deep injection' }, { value: 'D3', label: 'D3 - Deep well injection' }, { value: 'D4', label: 'D4 - Surface impoundment' }, { value: 'D5', label: 'D5 - Specially engineered landfill' }, { value: 'D6', label: 'D6 - Release into water bodies' }, { value: 'D7', label: 'D7 - Release into sea/oceans' }, { value: 'D8', label: 'D8 - Biological treatment' }, { value: 'D9', label: 'D9 - Physico-chemical treatment' }, { value: 'D10', label: 'D10 - Incineration' }, { value: 'D11', label: 'D11 - Incineration at sea' }, { value: 'D12', label: 'D12 - Permanent storage' }, { value: 'D13', label: 'D13 - Blending/recipe' }, { value: 'D14', label: 'D14 - Repackaging' }, { value: 'D15', label: 'D15 - Storage pending D1-D14' }]
const RECOVERY_CODES = [{ value: 'R1', label: 'R1 - Use as fuel' }, { value: 'R2', label: 'R2 - Solvent reclamation' }, { value: 'R3', label: 'R3 - Recycling/reclamation of organics' }, { value: 'R4', label: 'R4 - Recycling/reclamation of metals' }, { value: 'R5', label: 'R5 - Recycling/reclamation of inorganics' }, { value: 'R6', label: 'R6 - Regeneration of acids/bases' }, { value: 'R7', label: 'R7 - Recovery of components' }, { value: 'R8', label: 'R8 - Recovery of catalysts' }, { value: 'R9', label: 'R9 - Re-refining used oil' }, { value: 'R10', label: 'R10 - Land treatment' }, { value: 'R11', label: 'R11 - Uses of waste' }, { value: 'R12', label: 'R12 - Waste exchange' }, { value: 'R13', label: 'R13 - Accumulation of R1-R12' }]

const BASEL_COUNTRIES = [
  { code: 'TT', name: 'Trinidad and Tobago' },
  { code: 'US', name: 'United States of America' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'JP', name: 'Japan' },
  { code: 'CN', name: 'China' },
  { code: 'IN', name: 'India' },
  { code: 'BR', name: 'Brazil' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'MX', name: 'Mexico' },
  { code: 'AR', name: 'Argentina' },
  { code: 'CL', name: 'Chile' },
  { code: 'KE', name: 'Kenya' },
  { code: 'EG', name: 'Egypt' },
  { code: 'PK', name: 'Pakistan' },
  { code: 'BD', name: 'Bangladesh' },
  { code: 'PH', name: 'Philippines' },
  { code: 'ID', name: 'Indonesia' },
  { code: 'TH', name: 'Thailand' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'KR', name: 'South Korea' },
  { code: 'TR', name: 'Turkey' },
  { code: 'PL', name: 'Poland' },
  { code: 'CZ', name: 'Czech Republic' },
  { code: 'HU', name: 'Hungary' },
  { code: 'RO', name: 'Romania' },
  { code: 'PT', name: 'Portugal' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'SE', name: 'Sweden' },
  { code: 'NO', name: 'Norway' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'AT', name: 'Austria' },
  { code: 'CH', name: 'Switzerland' },
  { code: 'IE', name: 'Ireland' },
  { code: 'GR', name: 'Greece' },
  { code: 'IL', name: 'Israel' },
  { code: 'AE', name: 'United Arab Emirates' },
  { code: 'SA', name: 'Saudi Arabia' },
]

const CA_API_KEY = 'bca_df927e76febd60b7f97be6e73a3aed205d1b6a0592a97f10'


interface FormData {
  [key: string]: string | string[] | boolean | number | null
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

function getFormString(val: string | string[] | boolean | number | null | undefined, fallback = ''): string {
  if (typeof val === 'string') return val
  if (typeof val === 'number') return String(val)
  if (typeof val === 'boolean') return String(val)
  return fallback
}

function getFormNumber(val: string | string[] | boolean | number | null | undefined): number {
  if (typeof val === 'number') return val
  if (typeof val === 'string') return parseFloat(val) || 0
  return 0
}

async function fetchCAData(countryCode: string) {
  try {
    const res = await fetch(`https://api.dexmetal.com/api/v1/ca/${countryCode}`, {
      headers: { 'X-API-Key': CA_API_KEY }
    })
    if (!res.ok) throw new Error('CA not found')
    return await res.json()
  } catch {
    return null
  }
}

function BaselFormAssistantPageContent() {
  const [activeTab, setActiveTab] = useState<'reference' | 'fill' | 'submission'>('reference')
  const [selectedDoc, setSelectedDoc] = useState<'notification' | 'movement'>('notification')
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<FormData>({})
  const [isEuRoute, setIsEuRoute] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [movementFormData, setMovementFormData] = useState<FormData>({})
  const [movementStep, setMovementStep] = useState(0)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)
  const [cloudSaveMessage, setCloudSaveMessage] = useState<string | null>(null)
    const movementFileInputRef = useRef<HTMLInputElement>(null)

  const [caDataExport, setCaDataExport] = useState<{name?: string; department?: string; email?: string; phone?: string; address?: string} | null>(null)
  const [caDataImport, setCaDataImport] = useState<{name?: string; department?: string; email?: string; phone?: string; address?: string} | null>(null)
  const [caDataTransit, setCaDataTransit] = useState<Record<string, {name?: string; department?: string; email?: string; phone?: string; address?: string}>>({})
  const [caLoadingExport, setCaLoadingExport] = useState(false)
  const [caLoadingImport, setCaLoadingImport] = useState(false)
  const [caLoadingTransit, setCaLoadingTransit] = useState<Record<string, boolean>>({})
  const [caErrorExport, setCaErrorExport] = useState<string | null>(null)
  const [caErrorImport, setCaErrorImport] = useState<string | null>(null)

  interface DocState {
    file: File | null
    fileName: string
    confirmed: boolean
  }
  const [docStates, setDocStates] = useState<Record<number, DocState>>({})
  const submissionFileInputRef = useRef<HTMLInputElement>(null)

  const blocks = NOTIFICATION_BLOCKS
  const movementBlocks = MOVEMENT_BLOCKS
  const totalSteps = 21
  const movementTotalSteps = 19

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
    
    // Load project from URL ?project=<id> param
    const projectId = new URLSearchParams(window.location.search).get('project')
    if (projectId) {
      fetch(`/api/form-projects?id=${projectId}`)
        .then(res => res.json())
        .then(data => {
          if (data.id) {
            setFormData(data.notification_data || {})
            setMovementFormData(data.movement_data || {})
            setIsEuRoute(data.is_eu_route || false)
            localStorage.setItem('dexmetal_project_id', data.id)
            setCloudSaveMessage(`Project loaded: https://dexmetal.com/tools/basel-form-assistant?project=${data.id}`)
          }
        })
        .catch(console.error)
    }
  }, [])

  useEffect(() => {
    const saved = localStorage.getItem('dexmetal_movement_form')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setMovementFormData(parsed.formData || {})
        setMovementStep(parsed.currentStep || 0)
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(
      'basel_notification_form',
      JSON.stringify({ formData, isEuRoute, currentStep }),
    )
  }, [formData, isEuRoute, currentStep])

  useEffect(() => {
    localStorage.setItem(
      'dexmetal_movement_form',
      JSON.stringify({ formData: movementFormData, currentStep: movementStep }),
    )
  }, [movementFormData, movementStep])

  useEffect(() => {
    const savedDocs = localStorage.getItem('dexmetal_submission_docs')
    if (savedDocs) {
      try {
        const parsed = JSON.parse(savedDocs)
        setDocStates(parsed)
      } catch {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('dexmetal_submission_docs', JSON.stringify(docStates))
  }, [docStates])

  const handleDocUpload = (docId: number, file: File | null) => {
    setDocStates(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        file,
        fileName: file?.name || '',
      }
    }))
  }

  const handleDocConfirm = (docId: number, confirmed: boolean) => {
    setDocStates(prev => ({
      ...prev,
      [docId]: {
        ...prev[docId],
        confirmed
      }
    }))
  }

  const handleDownloadPackage = async () => {
    const zip = new JSZip()
    let hasFiles = false
    
    for (const doc of SUPPORTING_DOCS) {
      const state = docStates[doc.id]
      if (state?.file) {
        const arrayBuffer = await state.file.arrayBuffer()
        zip.file(state.fileName, arrayBuffer)
        hasFiles = true
      }
    }
    
    if (!hasFiles) {
      alert('No files uploaded to include in the package.')
      return
    }
    
    const blob = await zip.generateAsync({ type: 'blob' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const today = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `basel_submission_package_${today}.zip`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleInputChange = (field: string, value: string | string[] | boolean | number | null) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleMovementInputChange = (field: string, value: string | string[] | boolean | number | null) => {
    setMovementFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    const current = (formData[field] as string[]) || []
    if (checked) {
      setFormData((prev) => ({ ...prev, [field]: [...current, value] }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: current.filter((v: string) => v !== value) }))
    }
  }

  const handleMovementCheckboxChange = (field: string, value: string, checked: boolean) => {
    const current = (movementFormData[field] as string[]) || []
    if (checked) {
      setMovementFormData((prev) => ({ ...prev, [field]: [...current, value] }))
    } else {
      setMovementFormData((prev) => ({ ...prev, [field]: current.filter((v: string) => v !== value) }))
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1)
    }
    
    // Auto-patch to cloud
    const projectId = localStorage.getItem('dexmetal_project_id')
    if (projectId) {
      fetch(`/api/form-projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_data: formData, movement_data: movementFormData })
      }).catch(console.error)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleMovementNext = () => {
    if (movementStep < movementTotalSteps - 1) {
      setMovementStep((prev) => prev + 1)
    }
  }

  const handleMovementPrev = () => {
    if (movementStep > 0) {
      setMovementStep((prev) => prev - 1)
    }
  }

  const handleSaveProgress = () => {
    localStorage.setItem('basel_notification_form', JSON.stringify({ formData, isEuRoute, currentStep }))
    alert('Progress saved!')
  }

  const handleMovementSaveProgress = () => {
    localStorage.setItem('dexmetal_movement_form', JSON.stringify({ formData: movementFormData, currentStep: movementStep }))
    alert('Movement form progress saved!')
  }

  const handleSaveToCloud = async () => {
    try {
      const projectId = localStorage.getItem('dexmetal_project_id')
      if (projectId) {
        // PATCH
        const res = await fetch(`/api/form-projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notification_data: formData, movement_data: movementFormData })
        })
        const data = await res.json()
        if (data.id) setCloudSaveMessage(`Saved: https://dexmetal.com/tools/basel-form-assistant?project=${data.id}`)
        else setCloudSaveMessage('Save failed')
      } else {
        // POST new
        const res = await fetch('/api/form-projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            notification_data: formData,
            movement_data: movementFormData,
            export_country_iso: String(formData.block1_country || '').slice(0, 2).toUpperCase() || null,
            import_country_iso: String(formData.block2_country || '').slice(0, 2).toUpperCase() || null,
            is_eu_route: isEuRoute
          })
        })
        const data = await res.json()
        if (data.id) {
          localStorage.setItem('dexmetal_project_id', data.id)
          setCloudSaveMessage(`Saved: https://dexmetal.com/tools/basel-form-assistant?project=${data.id}`)
        } else {
          setCloudSaveMessage('Save failed')
        }
      }
    } catch (e: any) {
      setCloudSaveMessage('Save failed: ' + e.message)
    }
  }

  const handleSyncFromNotification = () => {
    const notificationData = localStorage.getItem('basel_notification_form')
    if (!notificationData) {
      setSyncMessage('No Notification data found. Complete the Notification form first.')
      return
    }
    try {
      const parsed = JSON.parse(notificationData)
      const nf = parsed.formData || {}
      const syncedData: FormData = {}
      
      syncedData['mv_block1_notification_no'] = (nf['block3_notification_no'] as string) || ''
      syncedData['mv_block1_serial'] = '1'
      syncedData['mv_block1_total'] = String(nf['block4_shipments'] || '1')
      
      syncedData['mv_block3_name'] = (nf['block1_name'] as string) || ''
      syncedData['mv_block3_address'] = (nf['block1_address'] as string) || ''
      syncedData['mv_block3_contact'] = (nf['block1_contact'] as string) || ''
      syncedData['mv_block3_phone'] = (nf['block1_phone'] as string) || ''
      syncedData['mv_block3_email'] = (nf['block1_email'] as string) || ''
      
      syncedData['mv_block4_name'] = (nf['block2_name'] as string) || ''
      syncedData['mv_block4_address'] = (nf['block2_address'] as string) || ''
      syncedData['mv_block4_contact'] = (nf['block2_contact'] as string) || ''
      syncedData['mv_block4_phone'] = (nf['block2_phone'] as string) || ''
      syncedData['mv_block4_email'] = (nf['block2_email'] as string) || ''
      
      syncedData['mv_block8_name'] = (nf['block9_name'] as string) || ''
      syncedData['mv_block8_address'] = (nf['block9_address'] as string) || ''
      syncedData['mv_block8_contact'] = (nf['block9_contact'] as string) || ''
      syncedData['mv_block8_phone'] = (nf['block9_phone'] as string) || ''
      
      syncedData['mv_block9_name'] = (nf['block10_name'] as string) || ''
      syncedData['mv_block9_address'] = (nf['block10_address'] as string) || ''
      syncedData['mv_block9_permit'] = (nf['block10_permit'] as string) || ''
      syncedData['mv_block9_contact'] = (nf['block10_contact'] as string) || ''
      
      syncedData['mv_block10_code'] = (nf['block11_code'] as string) || ''
      
      syncedData['mv_block11_description'] = (nf['block12_description'] as string) || ''
      syncedData['mv_block11_composition'] = (nf['block12_composition'] as string) || ''
      
      syncedData['mv_block12_form'] = (nf['block13_form'] as string) || ''
      
      syncedData['mv_block13_basel'] = (nf['block14_basel'] as string) || ''
      syncedData['mv_block13_oecd'] = (nf['block14_oecd'] as string) || ''
      syncedData['mv_block13_eu'] = (nf['block14_eu'] as string) || ''
      syncedData['mv_block13_un_class'] = (nf['block14_un_class'] as string) || ''
      syncedData['mv_block13_un_number'] = (nf['block14_un_number'] as string) || ''
      syncedData['mv_block13_y_code'] = (nf['block14_y_code'] as string) || ''
      syncedData['mv_block13_h_code'] = (nf['block14_h_code'] as string) || ''
      
      syncedData['mv_block14_export'] = (nf['block15_export'] as string) || ''
      syncedData['mv_block14_import'] = (nf['block15_import'] as string) || ''
      syncedData['mv_block14_transit'] = (nf['block15_transit'] as string) || ''
      syncedData['mv_block5_date'] = (nf['block6_start'] as string) || ''
      syncedData['mv_block6_packaging'] = (nf['block7_packaging'] as string[]) || null
      syncedData['mv_block6_packages'] = Number(nf['block7_packages']) || 1
      syncedData['mv_block6_special'] = (nf['block7_special_handling'] as string) || ''
      syncedData['mv_block7_name'] = (nf['block8_carrier_name'] as string) || ''
      syncedData['mv_block7_address'] = (nf['block8_carrier_address'] as string) || ''
      syncedData['mv_block7_phone'] = (nf['block8_carrier_phone'] as string) || ''
      syncedData['mv_block7_transport'] = ((nf['block8_transport'] as string[])?.[0] || '') || ''
      syncedData['mv_block16_info'] = (nf['block7_special_handling'] as string) || ''
      
      setMovementFormData((prev) => ({ ...prev, ...syncedData }))
      setSyncMessage('Synced from Notification — review fields before submitting')
    } catch {
      setSyncMessage('Error syncing data. Please try again.')
    }
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
        meta: { schema_version: '1.0.0', exported_at: new Date().toISOString(), tool: 'DexMetal Basel Navigator' }
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
  
  const handleMovementPDF = async () => {
    const saved = localStorage.getItem('dexmetal_movement_form')
    if (!saved) {
      alert('No movement form data found. Please fill out the form first.')
      return
    }

    try {
      const { formData: mfd } = JSON.parse(saved)
      const notificationSaved = localStorage.getItem('basel_notification_form')
      const nf = notificationSaved ? (JSON.parse(notificationSaved).formData || {}) : {}
      
      const transitList = ((mfd.mv_block14_transit as string) || '').split(',').filter(Boolean).map((c: string) => ({ country: c.trim(), ca_code: null, entry_point: null, exit_point: null }))
      
      const formProject = {
        project: {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          status: 'draft',
          jurisdiction: {
            export_country_iso: (nf.block1_country as string)?.slice(0, 2).toUpperCase() || 'TT',
            import_country_iso: (nf.block2_country as string)?.slice(0, 2).toUpperCase() || 'US',
            transit_country_isos: ((mfd.mv_block14_transit as string) || '').split(',').filter(Boolean).map((c: string) => c.trim().slice(0, 2).toUpperCase()),
            is_eu_route: false
          }
        },
        notification: null,
        movement: {
          block_1: { notification_no: mfd.mv_block1_notification_no || null, serial_number: parseInt(String(mfd.mv_block1_serial)) || 1, total_shipments: parseInt(String(mfd.mv_block1_total)) || 1 },
          block_3: { registration_no: '', name: mfd.mv_block3_name || '', address: mfd.mv_block3_address || '', contact_person: mfd.mv_block3_contact || '', tel: mfd.mv_block3_phone || '', fax: null, email: mfd.mv_block3_email || '' },
          block_4: { registration_no: '', name: mfd.mv_block4_name || '', address: mfd.mv_block4_address || '', contact_person: mfd.mv_block4_contact || '', tel: mfd.mv_block4_phone || '', fax: null, email: mfd.mv_block4_email || '' },
          block_5: { quantity_tonnes: parseFloat(String(mfd.mv_block2_quantity)) || null, quantity_cubic_metres: null },
          block_6: { actual_date: mfd.mv_block5_date || '' },
          block_7: { packaging_types: (mfd.mv_block6_packaging as string[]) || ['1'], number_of_packages: parseInt(String(mfd.mv_block6_packages)) || 1, special_handling_required: !!mfd.mv_block6_special, special_handling_detail: mfd.mv_block6_special || null },
          block_8: { carrier_a: { registration_no: '', name: mfd.mv_block7_name || '', address: mfd.mv_block7_address || '', tel: mfd.mv_block7_phone || '', fax: null, email: null, means_of_transport: (mfd.mv_block7_transport as string)?.charAt(0).toUpperCase() || 'S', date_of_transfer: null }, carrier_b: null, carrier_c: null, more_than_3_carriers: false },
          block_9: { same_as_block_1: false, generators: [{ registration_no: '', name: mfd.mv_block8_name || '', address: mfd.mv_block8_address || '', contact_person: mfd.mv_block8_contact || null, tel: mfd.mv_block8_phone || null, fax: null, email: null, site_and_process_of_generation: null }] },
          block_10: { facility_type: (nf.block3_operation_type as string) || 'recovery', registration_no: mfd.mv_block9_permit || null, name: mfd.mv_block9_name || '', address: mfd.mv_block9_address || '', contact_person: mfd.mv_block9_contact || null, tel: '', fax: null, email: null, actual_site_if_different: null },
          block_11: { operation_code: mfd.mv_block10_code || 'R4', technology_employed: '', reason_for_export: '' },
          block_12: { common_name: mfd.mv_block11_description || '', major_constituents: mfd.mv_block11_composition || '', hazardous_constituents: null, chemical_analysis_attached: false },
          block_13: { physical_characteristics: [mfd.mv_block12_form || '2'], physical_characteristics_other: null },
          block_14: { i_basel_annex: mfd.mv_block13_basel || null, ii_oecd_code: mfd.mv_block13_oecd || null, iii_ec_list: mfd.mv_block13_eu || null, iv_national_export: null, v_national_import: null, vi_other: null, vii_y_code: mfd.mv_block13_y_code || null, viii_h_codes: mfd.mv_block13_h_code ? [mfd.mv_block13_h_code] : [], ix_un_class: mfd.mv_block13_un_class || null, x_un_number: mfd.mv_block13_un_number || null, xi_un_shipping_name: null, xii_customs_code_hs: null },
          block_15: { name: mfd.mv_block15_name || '', date: mfd.mv_block15_date || '', signature_status: mfd.mv_block15_signed ? 'signed' : 'pending' },
          block_16: { additional_info: mfd.mv_block16_info || null },
          block_17: { date: null, name: null, signature_status: null },
          block_18: { facility_type: null, date_of_reception: null, accepted: null, quantity_received_tonnes: null, quantity_received_cubic: null, approximate_date_of_disposal_recovery: null, disposal_recovery_operation_code: null, name: null, signature_status: null },
          block_19: { certifier_name: null, date: null, signature_status: null }
        },
        supporting_documents: null,
        validation: null,
        meta: { schema_version: '1.0.0', exported_at: new Date().toISOString(), tool: 'DexMetal Basel Navigator' }
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
      a.download = 'basel_movement_draft.pdf'
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

  const handleMovementDownloadProgress = () => {
    const data = { formData: movementFormData, currentStep: movementStep }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const today = new Date().toISOString().split('T')[0]
    a.href = url
    a.download = `basel_movement_${today}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleLoadProgressClick = () => {
    fileInputRef.current?.click()
  }

  const handleMovementLoadProgressClick = () => {
    movementFileInputRef.current?.click()
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

  const handleMovementFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string)
        if (parsed.formData) {
          setMovementFormData(parsed.formData)
          setMovementStep(parsed.currentStep || 0)
          alert('Movement form progress restored!')
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
    setFormData({ ...SAMPLE_DATA })
    setIsEuRoute(false)
    setCurrentStep(0)
    setActiveTab('fill')
    setSelectedDoc('notification')
    setCloudSaveMessage('Sample data loaded — 18 blocks pre-filled. Use Next to review each block.')
    setTimeout(() => setCloudSaveMessage(null), 4000)
  }

  const renderNotificationForm = () => {
    const currentBlock = blocks[currentStep]

    const NAVIGATOR_TOUR_STEPS: TourStep[] = [
      { text: 'This tool generates Basel notification form data — the official documentation required for transboundary waste movement under the Basel Convention.' },
      { text: 'Start with Block 1 — Competent Authorities. These are the national bodies responsible for Basel oversight in the exporting and importing countries.', attachTo: { element: '#tour-nav-form', on: 'top' } },
      { text: 'Click Load Sample to see a fully completed notification with all 20 blocks pre-filled — great for understanding the format.', attachTo: { element: '#tour-load-sample', on: 'bottom' } },
      { text: 'When all blocks are complete, click Generate PDF to export your official Basel notification document.', attachTo: { element: '#tour-generate-pdf', on: 'top' } },
    ]

    return (
      <div className="min-h-screen font-body" style={{ backgroundColor: '#1C1B18', padding: '32px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-display text-4xl font-bold" style={{ color: '#1a1a1a' }}>Fill Out Your Notification</h1>
            <ShepherdTour steps={NAVIGATOR_TOUR_STEPS} tourKey="basel-navigator" />
          </div>
          <p className="text-lg mb-6" style={{ color: '#666660' }}>Complete the vCOP8 Notification Document fields below.</p>
          {DISCLAIMER_BANNER}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setSelectedDoc('notification')} className="px-4 py-2 rounded font-display font-bold" style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}>Notification</button>
            <button onClick={() => setSelectedDoc('movement')} className="px-4 py-2 rounded font-display font-bold opacity-50" style={{ backgroundColor: '#cccccc', color: '#ffffff' }}>Movement Document</button>
          </div>
          <div className="flex gap-4 mb-6 border-b" style={{ borderColor: '#e5e5e0' }}>
            <button onClick={() => { setActiveTab('reference'); setSelectedDoc('notification'); }} className="px-4 py-2 font-display font-bold" style={{ color: '#999990' }}>Reference</button>
            <button onClick={() => setActiveTab('fill')} className="px-4 py-2 font-display font-bold border-b-2" style={{ borderColor: '#1D9E75', color: '#1D9E75' }}>Smart Form</button>
            <button onClick={() => setActiveTab('submission')} className="px-4 py-2 font-display font-bold" style={{ color: '#999990' }}>Submission Package</button>
          </div>
          <div className="mb-4 flex gap-2 flex-wrap">
            <button id="tour-load-sample" onClick={handleLoadSampleData} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Load Sample</button>
            <button onClick={handleSaveProgress} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Save Progress</button>
            <button onClick={handleSaveToCloud} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}>Save Online</button>
            <button onClick={handleDownloadProgress} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Save to File</button>
            <button onClick={handleLoadProgressClick} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Load from File</button>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept=".json" style={{ display: 'none' }} />
          </div>
          {cloudSaveMessage && (
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#e8f4f0', border: '1px solid #1D9E75' }}>
              <p style={{ color: '#1D9E75', fontSize: '14px' }}>{cloudSaveMessage}</p>
            </div>
          )}
          <div id="tour-nav-form" className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#e8f4f0', border: '1px solid #1D9E75' }}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isEuRoute} onChange={(e) => setIsEuRoute(e.target.checked)} className="w-4 h-4" style={{ accentColor: '#1D9E75' }} />
              <span className="font-display font-bold" style={{ color: '#1D9E75' }}>This is an EU route (shows Block 16)</span>
            </label>
          </div>
          <div className="flex justify-between items-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e0' }}>
            <button onClick={handlePrev} disabled={currentStep === 0} className="px-4 py-2 rounded font-display font-bold disabled:opacity-50" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>← Prev</button>
            <span className="font-display font-bold" style={{ color: '#1a1a1a' }}>Step {currentStep + 1} of {totalSteps}: Block {currentBlock?.number}</span>
            <button onClick={handleNext} disabled={currentStep === totalSteps - 1} className="px-4 py-2 rounded font-display font-bold disabled:opacity-50" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Next →</button>
          </div>
          <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e0' }}>
            <span className="inline-block px-2 py-1 rounded text-sm font-bold mb-2" style={{ backgroundColor: '#FF5C00', color: '#ffffff' }}>Block {currentBlock?.number}</span>
            <h2 className="text-2xl font-display font-bold mb-4" style={{ color: '#1a1a1a' }}>{currentBlock?.title}</h2>
            <p className="mb-6" style={{ color: '#666660' }}>{currentBlock?.description}</p>

            {currentStep === 0 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Name</label><input type="text" value={getFormString(formData.block1_name)} onChange={(e) => handleInputChange('block1_name', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Address</label><textarea value={getFormString(formData.block1_address)} onChange={(e) => handleInputChange('block1_address', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} rows={3} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Country</label><input type="text" value={getFormString(formData.block1_country)} onChange={(e) => handleInputChange('block1_country', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Contact Person</label><input type="text" value={getFormString(formData.block1_contact)} onChange={(e) => handleInputChange('block1_contact', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Phone</label><input type="text" value={getFormString(formData.block1_phone)} onChange={(e) => handleInputChange('block1_phone', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Email</label><input type="email" value={getFormString(formData.block1_email)} onChange={(e) => handleInputChange('block1_email', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Name</label><input type="text" value={getFormString(formData.block2_name)} onChange={(e) => handleInputChange('block2_name', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Address</label><textarea value={getFormString(formData.block2_address)} onChange={(e) => handleInputChange('block2_address', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} rows={3} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Country</label><input type="text" value={getFormString(formData.block2_country)} onChange={(e) => handleInputChange('block2_country', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Contact Person</label><input type="text" value={getFormString(formData.block2_contact)} onChange={(e) => handleInputChange('block2_contact', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Phone</label><input type="text" value={getFormString(formData.block2_phone)} onChange={(e) => handleInputChange('block2_phone', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Email</label><input type="email" value={getFormString(formData.block2_email)} onChange={(e) => handleInputChange('block2_email', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Notification Number</label><input type="text" value={getFormString(formData.block3_notification_no)} onChange={(e) => handleInputChange('block3_notification_no', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g., TT-2026-001" /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Shipment Type</label><select value={getFormString(formData.block3_shipment_type)} onChange={(e) => handleInputChange('block3_shipment_type', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }}><option value="">Select...</option>{SHIPMENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Operation Type</label><select value={getFormString(formData.block3_operation_type)} onChange={(e) => handleInputChange('block3_operation_type', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }}><option value="">Select...</option>{OPERATION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                <div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!formData.block3_pre_consent} onChange={(e) => handleInputChange('block3_pre_consent', e.target.checked)} className="w-4 h-4" style={{ accentColor: '#1D9E75' }} /><span className="font-display font-bold" style={{ color: '#1a1a1a' }}>Pre-consented facility</span></label></div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Total Number of Shipments</label><input type="number" min="1" value={getFormNumber(formData.block4_shipments) || ''} onChange={(e) => handleInputChange('block4_shipments', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Quantity in tonnes</label><input type="number" step="0.01" value={getFormNumber(formData.block5_quantity) || ''} onChange={(e) => handleInputChange('block5_quantity', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g., 24.5" /></div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Start Date</label><input type="date" value={getFormString(formData.block6_start)} onChange={(e) => handleInputChange('block6_start', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>End Date</label><input type="date" value={getFormString(formData.block6_end)} onChange={(e) => handleInputChange('block6_end', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {currentStep === 6 && (
              <div className="space-y-4">
                <div>
                  <label className="block font-display text-sm font-bold mb-2" style={{ color: '#1a1a1a' }}>Packaging Type(s)</label>
                  <div className="space-y-2">
                    {PACKAGING_TYPES.map(p => (
                      <label key={p.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={((formData.block7_packaging as string[]) || []).includes(p.value)} onChange={(e) => handleCheckboxChange('block7_packaging', p.value, e.target.checked)} className="w-4 h-4" style={{ accentColor: '#1D9E75' }} />
                        <span style={{ color: '#1a1a1a' }}>{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Special Handling Instructions</label><textarea value={getFormString(formData.block7_special_handling)} onChange={(e) => handleInputChange('block7_special_handling', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} rows={3} /></div>
              </div>
            )}

            {currentStep === 7 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Carrier Name</label><input type="text" value={getFormString(formData.block8_carrier_name)} onChange={(e) => handleInputChange('block8_carrier_name', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Carrier Address</label><textarea value={getFormString(formData.block8_carrier_address)} onChange={(e) => handleInputChange('block8_carrier_address', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} rows={3} /></div>
                <div>
                  <label className="block font-display text-sm font-bold mb-2" style={{ color: '#1a1a1a' }}>Transport Mode(s)</label>
                  <div className="space-y-2">
                    {TRANSPORT_MODES.map(t => (
                      <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={((formData.block8_transport_modes as string[]) || []).includes(t.value)} onChange={(e) => handleCheckboxChange('block8_transport_modes', t.value, e.target.checked)} className="w-4 h-4" style={{ accentColor: '#1D9E75' }} />
                        <span style={{ color: '#1a1a1a' }}>{t.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 8 && (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 cursor-pointer mb-4">
                    <input type="checkbox" checked={!!formData.block9_unknown} onChange={(e) => handleInputChange('block9_unknown', e.target.checked)} className="w-4 h-4" style={{ accentColor: '#1D9E75' }} />
                    <span className="font-display font-bold" style={{ color: '#1a1a1a' }}>Generator unknown — post-consumer waste</span>
                  </label>
                </div>
                {!formData.block9_unknown && (
                  <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Name</label><input type="text" value={getFormString(formData.block9_name)} onChange={(e) => handleInputChange('block9_name', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                )}
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Address</label><textarea value={getFormString(formData.block9_address)} onChange={(e) => handleInputChange('block9_address', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} rows={3} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Contact</label><input type="text" value={getFormString(formData.block9_contact)} onChange={(e) => handleInputChange('block9_contact', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Phone</label><input type="text" value={getFormString(formData.block9_phone)} onChange={(e) => handleInputChange('block9_phone', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {currentStep === 9 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Facility Name</label><input type="text" value={getFormString(formData.block10_name)} onChange={(e) => handleInputChange('block10_name', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Address</label><textarea value={getFormString(formData.block10_address)} onChange={(e) => handleInputChange('block10_address', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} rows={3} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Permit Number</label><input type="text" value={getFormString(formData.block10_permit)} onChange={(e) => handleInputChange('block10_permit', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Contact</label><input type="text" value={getFormString(formData.block10_contact)} onChange={(e) => handleInputChange('block10_contact', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {currentStep === 10 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Operation Code</label><select value={getFormString(formData.block11_code)} onChange={(e) => handleInputChange('block11_code', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }}><option value="">Select...</option>{DISPOSAL_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}{RECOVERY_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
              </div>
            )}

            {currentStep === 11 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Waste Description</label><textarea value={getFormString(formData.block12_description)} onChange={(e) => handleInputChange('block12_description', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} rows={3} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Waste Composition</label><textarea value={getFormString(formData.block12_composition)} onChange={(e) => handleInputChange('block12_composition', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} rows={3} /></div>
              </div>
            )}

            {currentStep === 12 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Physical Form</label><select value={getFormString(formData.block13_form)} onChange={(e) => handleInputChange('block13_form', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }}><option value="">Select...</option>{PHYSICAL_FORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
                {getFormString(formData.block13_form) === 'other' && (
                  <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Specify Other</label><input type="text" value={getFormString(formData.block13_other)} onChange={(e) => handleInputChange('block13_other', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                )}
              </div>
            )}

            {currentStep === 13 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Basel Annex Code (i)</label><input type="text" value={getFormString(formData.block14_basel)} onChange={(e) => handleInputChange('block14_basel', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g. A1160" /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>OECD Code (ii)</label><input type="text" value={getFormString(formData.block14_oecd)} onChange={(e) => handleInputChange('block14_oecd', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g. not listed" /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>EC List of Wastes (iii)</label><input type="text" value={getFormString(formData.block14_eu)} onChange={(e) => handleInputChange('block14_eu', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="EU only" /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>National Code — Export (iv)</label><input type="text" value={getFormString(formData.block14_national_export)} onChange={(e) => handleInputChange('block14_national_export', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>National Code — Import (v)</label><input type="text" value={getFormString(formData.block14_national_import)} onChange={(e) => handleInputChange('block14_national_import', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Y-Code (vii)</label><input type="text" value={getFormString(formData.block14_y_code)} onChange={(e) => handleInputChange('block14_y_code', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g. Y31" /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>H-Code (viii)</label><input type="text" value={getFormString(formData.block14_h_code)} onChange={(e) => handleInputChange('block14_h_code', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g. H6.1, H8" /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>UN Class (ix)</label><input type="text" value={getFormString(formData.block14_un_class)} onChange={(e) => handleInputChange('block14_un_class', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g. 6.1, 8" /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>UN Number (x)</label><input type="text" value={getFormString(formData.block14_un_number)} onChange={(e) => handleInputChange('block14_un_number', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g. UN2794" /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>UN Shipping Name (xi)</label><input type="text" value={getFormString(formData.block14_un_shipping)} onChange={(e) => handleInputChange('block14_un_shipping', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g. Batteries, wet, filled with acid" /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>HS Customs Code (xii)</label><input type="text" value={getFormString(formData.block14_hs_code)} onChange={(e) => handleInputChange('block14_hs_code', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g. 8548.10" /></div>
              </div>
            )}

            {currentStep === 14 && (
              <div className="space-y-6">
                <div>
                  <label className="block font-display text-sm font-bold mb-2" style={{ color: '#1a1a1a' }}>Export Country (State of Export)</label>
                  <select
                    value={getFormString(formData.block15_export_code)}
                    onChange={async (e) => {
                      const code = e.target.value
                      handleInputChange('block15_export', BASEL_COUNTRIES.find(c => c.code === code)?.name || '')
                      handleInputChange('block15_export_code', code)
                      setCaDataExport(null)
                      setCaErrorExport(null)
                      if (code) {
                        setCaLoadingExport(true)
                        const data = await fetchCAData(code)
                        if (data) {
                          setCaDataExport(data)
                        } else {
                          setCaErrorExport('CA data not available for this country — verify manually')
                        }
                        setCaLoadingExport(false)
                      }
                    }}
                    className="w-full px-3 py-2 rounded border"
                    style={{ borderColor: '#e5e5e0' }}
                  >
                    <option value="">Select export country...</option>
                    {BASEL_COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                  {caLoadingExport && <p className="text-sm mt-2" style={{ color: '#666660' }}>Loading CA data...</p>}
                  {caErrorExport && <p className="text-sm mt-2" style={{ color: '#FF5C00' }}>{caErrorExport}</p>}
                  {caDataExport && !caLoadingExport && (
                    <div className="mt-3 p-4 rounded-lg" style={{ backgroundColor: '#1a1a18', border: '1px solid #1D9E75' }}>
                      <p className="font-display font-bold text-sm mb-2" style={{ color: '#1D9E75' }}>Competent Authority (Export)</p>
                      <p className="text-sm" style={{ color: '#d0d0cc' }}>{(caDataExport as Record<string, string>)?.ca_name || 'N/A'}</p>
                      <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataExport.department || 'N/A'}</p>
                      <p className="text-sm" style={{ color: '#d0d0cc' }}>{(caDataExport as Record<string, string>)?.email_primary || 'N/A'}</p>
                      <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataExport.phone || 'N/A'}</p>
                      <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataExport.address || 'N/A'}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-display text-sm font-bold mb-2" style={{ color: '#1a1a1a' }}>Import Country (State of Import)</label>
                  <select
                    value={getFormString(formData.block15_import_code)}
                    onChange={async (e) => {
                      const code = e.target.value
                      handleInputChange('block15_import', BASEL_COUNTRIES.find(c => c.code === code)?.name || '')
                      handleInputChange('block15_import_code', code)
                      setCaDataImport(null)
                      setCaErrorImport(null)
                      if (code) {
                        setCaLoadingImport(true)
                        const data = await fetchCAData(code)
                        if (data) {
                          setCaDataImport(data)
                        } else {
                          setCaErrorImport('CA data not available for this country — verify manually')
                        }
                        setCaLoadingImport(false)
                      }
                    }}
                    className="w-full px-3 py-2 rounded border"
                    style={{ borderColor: '#e5e5e0' }}
                  >
                    <option value="">Select import country...</option>
                    {BASEL_COUNTRIES.map(c => (
                      <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                  </select>
                  {caLoadingImport && <p className="text-sm mt-2" style={{ color: '#666660' }}>Loading CA data...</p>}
                  {caErrorImport && <p className="text-sm mt-2" style={{ color: '#FF5C00' }}>{caErrorImport}</p>}
                  {caDataImport && !caLoadingImport && (
                    <div className="mt-3 p-4 rounded-lg" style={{ backgroundColor: '#1a1a18', border: '1px solid #1D9E75' }}>
                      <p className="font-display font-bold text-sm mb-2" style={{ color: '#1D9E75' }}>Competent Authority (Import)</p>
                      <p className="text-sm" style={{ color: '#d0d0cc' }}>{(caDataImport as Record<string, string>)?.ca_name || 'N/A'}</p>
                      <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataImport.department || 'N/A'}</p>
                      <p className="text-sm" style={{ color: '#d0d0cc' }}>{(caDataImport as Record<string, string>)?.email_primary || 'N/A'}</p>
                      <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataImport.phone || 'N/A'}</p>
                      <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataImport.address || 'N/A'}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-display text-sm font-bold mb-2" style={{ color: '#1a1a1a' }}>Transit Countries (comma-separated ISO codes)</label>
                  <input
                    type="text"
                    value={getFormString(formData.block15_transit)}
                    onChange={async (e) => {
                      const value = e.target.value
                      handleInputChange('block15_transit', value)
                      const codes = value.split(',').map((s: string) => s.trim().toUpperCase()).filter(Boolean)
                      for (const code of codes) {
                        if (!caDataTransit[code]) {
                          setCaLoadingTransit(prev => ({ ...prev, [code]: true }))
                          const data = await fetchCAData(code)
                          setCaDataTransit(prev => ({ ...prev, [code]: data }))
                          setCaLoadingTransit(prev => ({ ...prev, [code]: false }))
                        }
                      }
                    }}
                    className="w-full px-3 py-2 rounded border"
                    style={{ borderColor: '#e5e5e0' }}
                    placeholder="e.g., JM, CU, AN"
                  />
                  {Object.keys(caDataTransit).length > 0 && (
                    <div className="mt-3 space-y-3">
                      {Object.entries(caDataTransit).map(([code, data]) => (
                        <div key={code} className="p-4 rounded-lg" style={{ backgroundColor: '#1a1a18', border: '1px solid #1D9E75' }}>
                          <p className="font-display font-bold text-sm mb-2" style={{ color: '#1D9E75' }}>Competent Authority (Transit — {code})</p>
                          <p className="text-sm" style={{ color: '#d0d0cc' }}>{(data as Record<string, string>)?.ca_name || 'N/A'}</p>
                          <p className="text-sm" style={{ color: '#d0d0cc' }}>{data?.department || 'N/A'}</p>
                          <p className="text-sm" style={{ color: '#d0d0cc' }}>{(data as Record<string, string>)?.email_primary || 'N/A'}</p>
                          <p className="text-sm" style={{ color: '#d0d0cc' }}>{data?.phone || 'N/A'}</p>
                          <p className="text-sm" style={{ color: '#d0d0cc' }}>{data?.address || 'N/A'}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentStep === 15 && isEuRoute && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>EU Customs Office of Entry</label><input type="text" value={getFormString(formData.block16_entry)} onChange={(e) => handleInputChange('block16_entry', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g., Rotterdam, NL" /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>EU Customs Office of Exit</label><input type="text" value={getFormString(formData.block16_exit)} onChange={(e) => handleInputChange('block16_exit', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g., Hamburg, DE" /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Customs Office of Export</label><input type="text" value={getFormString(formData.block16_export_customs)} onChange={(e) => handleInputChange('block16_export_customs', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {currentStep === 15 && !isEuRoute && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#f0f0e0', color: '#888880' }}>
                <p className="font-bold">Block 16 applies to EU routes only.</p>
                <p className="text-sm mt-1">Toggle the EU route option above to enable this block.</p>
              </div>
            )}

            {currentStep === 16 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Signatory Name</label><input type="text" value={getFormString(formData.block17_signatory)} onChange={(e) => handleInputChange('block17_signatory', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Date</label><input type="date" value={getFormString(formData.block17_date)} onChange={(e) => handleInputChange('block17_date', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!formData.block17_confirmed} onChange={(e) => handleInputChange('block17_confirmed', e.target.checked)} className="w-4 h-4" style={{ accentColor: '#1D9E75' }} /><span className="font-display font-bold" style={{ color: '#1a1a1a' }}>I confirm the above information is accurate and complete</span></label></div>
              </div>
            )}

            {currentStep === 17 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Number of Annexes</label><input type="number" min="0" value={getFormNumber(formData.block18_count) || ''} onChange={(e) => handleInputChange('block18_count', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Annex Descriptions</label><textarea value={getFormString(formData.block18_descriptions)} onChange={(e) => handleInputChange('block18_descriptions', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} rows={4} placeholder="List each annex on a new line" /></div>
              </div>
            )}

            {currentStep >= 18 && currentStep <= 20 && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#f0f0e0', color: '#888880' }}>
                <p className="font-bold">Reserved for Competent Authority — leave blank</p>
                <p className="text-sm mt-1">The CA will complete this section after reviewing your notification.</p>
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <button onClick={handlePrev} disabled={currentStep === 0} className="px-6 py-3 rounded-lg font-display font-bold disabled:opacity-50" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>← Previous Block</button>
            <button id="tour-generate-pdf" onClick={handleGeneratePDF} className="px-6 py-3 rounded-lg font-display font-bold transition-all" style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}>Generate PDF</button>
            <button onClick={handleNext} disabled={currentStep === totalSteps - 1} className="px-6 py-3 rounded-lg font-display font-bold disabled:opacity-50" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Next Block →</button>
          </div>
        </div>
      </div>
    )
  }

  const renderMovementForm = () => {
    const currentBlock = movementBlocks[movementStep]
    const isReserved = currentBlock?.isReserved
    const isSynced = currentBlock?.isSynced

    return (
      <div className="min-h-screen font-body" style={{ backgroundColor: '#1C1B18', padding: '32px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Movement Document</h1>
          <p className="text-lg mb-6" style={{ color: '#666660' }}>Complete the vCOP8 Movement Document fields below.</p>
          {DISCLAIMER_BANNER}
          
          <div className="mb-4 flex gap-2 flex-wrap">
            <button onClick={handleSyncFromNotification} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#FF5C00', color: '#ffffff' }}>Sync from Notification</button>
            <button onClick={handleMovementSaveProgress} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Save Progress</button>
            <button onClick={handleMovementDownloadProgress} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Save to File</button>
            <button onClick={handleMovementLoadProgressClick} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Load from File</button>
            <input type="file" ref={movementFileInputRef} onChange={handleMovementFileSelect} accept=".json" style={{ display: 'none' }} />
          </div>

          {syncMessage && (
            <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: syncMessage.includes('Synced') ? '#e8f4f0' : '#fce8e8', border: `1px solid ${syncMessage.includes('Synced') ? '#1D9E75' : '#e53e3e'}` }}>
              <p style={{ color: syncMessage.includes('Synced') ? '#1D9E75' : '#e53e3e', fontSize: '14px' }}>{syncMessage}</p>
            </div>
          )}

          <div className="flex justify-between items-center mb-6 p-4 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e0' }}>
            <button onClick={handleMovementPrev} disabled={movementStep === 0} className="px-4 py-2 rounded font-display font-bold disabled:opacity-50" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>← Prev</button>
            <span className="font-display font-bold" style={{ color: '#1a1a1a' }}>Step {movementStep + 1} of {movementTotalSteps}: Block {currentBlock?.number}</span>
            <button onClick={handleMovementNext} disabled={movementStep === movementTotalSteps - 1} className="px-4 py-2 rounded font-display font-bold disabled:opacity-50" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Next →</button>
          </div>

          <div className="p-6 rounded-lg mb-6" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e0' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block px-2 py-1 rounded text-sm font-bold" style={{ backgroundColor: '#FF5C00', color: '#ffffff' }}>Block {currentBlock?.number}</span>
              {isSynced && <span className="px-2 py-1 rounded text-xs font-bold" style={{ backgroundColor: '#e8f4f0', color: '#1D9E75' }}>Synced</span>}
            </div>
            <h2 className="text-2xl font-display font-bold mb-4" style={{ color: '#1a1a1a' }}>{currentBlock?.title}</h2>
            <p className="mb-6" style={{ color: '#666660' }}>{currentBlock?.description}</p>

            {isReserved && (
              <div className="p-4 rounded-lg" style={{ backgroundColor: '#f0f0e0', color: '#888880' }}>
                <p className="font-bold">This section is reserved for the Competent Authority or facility.</p>
                <p className="text-sm mt-1">Leave blank. The relevant party will complete this.</p>
              </div>
            )}

            {!isReserved && movementStep === 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Notification Number</label>
                  <input type="text" value={getFormString(movementFormData.mv_block1_notification_no)} onChange={(e) => handleMovementInputChange('mv_block1_notification_no', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g., TT-2026-001" />
                </div>
                <div>
                  <label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Serial Number</label>
                  <input type="number" value={getFormNumber(movementFormData.mv_block1_serial) || 1} onChange={(e) => handleMovementInputChange('mv_block1_serial', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} min="1" />
                </div>
                <div>
                  <label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Total Shipments</label>
                  <input type="number" value={getFormNumber(movementFormData.mv_block1_total) || 1} onChange={(e) => handleMovementInputChange('mv_block1_total', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} min="1" />
                </div>
              </div>
            )}

            {!isReserved && movementStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Actual Quantity (tonnes)</label>
                  <input type="number" step="0.01" value={getFormNumber(movementFormData.mv_block2_quantity) || ''} onChange={(e) => handleMovementInputChange('mv_block2_quantity', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g., 24.5" />
                </div>
              </div>
            )}

            {!isReserved && movementStep === 2 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Name</label><input type="text" value={getFormString(movementFormData.mv_block3_name)} onChange={(e) => handleMovementInputChange('mv_block3_name', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Address</label><input type="text" value={getFormString(movementFormData.mv_block3_address)} onChange={(e) => handleMovementInputChange('mv_block3_address', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Contact Person</label><input type="text" value={getFormString(movementFormData.mv_block3_contact)} onChange={(e) => handleMovementInputChange('mv_block3_contact', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Phone</label><input type="text" value={getFormString(movementFormData.mv_block3_phone)} onChange={(e) => handleMovementInputChange('mv_block3_phone', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Email</label><input type="email" value={getFormString(movementFormData.mv_block3_email)} onChange={(e) => handleMovementInputChange('mv_block3_email', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {!isReserved && movementStep === 3 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Name</label><input type="text" value={getFormString(movementFormData.mv_block4_name)} onChange={(e) => handleMovementInputChange('mv_block4_name', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Address</label><input type="text" value={getFormString(movementFormData.mv_block4_address)} onChange={(e) => handleMovementInputChange('mv_block4_address', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Contact Person</label><input type="text" value={getFormString(movementFormData.mv_block4_contact)} onChange={(e) => handleMovementInputChange('mv_block4_contact', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Phone</label><input type="text" value={getFormString(movementFormData.mv_block4_phone)} onChange={(e) => handleMovementInputChange('mv_block4_phone', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Email</label><input type="email" value={getFormString(movementFormData.mv_block4_email)} onChange={(e) => handleMovementInputChange('mv_block4_email', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {!isReserved && movementStep === 4 && (
              <div className="space-y-4">
                <div>
                  <label className="block font-display text-sm font-bold mb-1" style={{ color: '#1a1a1a' }}>Actual Date of Shipment</label>
                  <input type="date" value={getFormString(movementFormData.mv_block5_date)} onChange={(e) => handleMovementInputChange('mv_block5_date', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} />
                </div>
              </div>
            )}

            {!isReserved && movementStep === 5 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Packaging Type</label><select value={getFormString((movementFormData.mv_block6_packaging as string[])?.[0] || '')} onChange={(e) => handleMovementInputChange('mv_block6_packaging', [e.target.value])} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }}><option value="">Select...</option>{PACKAGING_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
                <div><label className="block font-display text-sm font-bold mb-1">Number of Packages</label><input type="number" value={getFormNumber(movementFormData.mv_block6_packages) || ''} onChange={(e) => handleMovementInputChange('mv_block6_packages', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Special Handling</label><input type="text" value={getFormString(movementFormData.mv_block6_special)} onChange={(e) => handleMovementInputChange('mv_block6_special', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {!isReserved && movementStep === 6 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Carrier Name</label><input type="text" value={getFormString(movementFormData.mv_block7_name)} onChange={(e) => handleMovementInputChange('mv_block7_name', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Address</label><input type="text" value={getFormString(movementFormData.mv_block7_address)} onChange={(e) => handleMovementInputChange('mv_block7_address', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Phone</label><input type="text" value={getFormString(movementFormData.mv_block7_phone)} onChange={(e) => handleMovementInputChange('mv_block7_phone', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Means of Transport</label><select value={getFormString(movementFormData.mv_block7_transport)} onChange={(e) => handleMovementInputChange('mv_block7_transport', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }}><option value="">Select...</option>{TRANSPORT_MODES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
              </div>
            )}

            {!isReserved && movementStep === 7 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Generator Name</label><input type="text" value={getFormString(movementFormData.mv_block8_name)} onChange={(e) => handleMovementInputChange('mv_block8_name', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Address</label><input type="text" value={getFormString(movementFormData.mv_block8_address)} onChange={(e) => handleMovementInputChange('mv_block8_address', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Contact</label><input type="text" value={getFormString(movementFormData.mv_block8_contact)} onChange={(e) => handleMovementInputChange('mv_block8_contact', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Phone</label><input type="text" value={getFormString(movementFormData.mv_block8_phone)} onChange={(e) => handleMovementInputChange('mv_block8_phone', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {!isReserved && movementStep === 8 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Facility Name</label><input type="text" value={getFormString(movementFormData.mv_block9_name)} onChange={(e) => handleMovementInputChange('mv_block9_name', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Address</label><input type="text" value={getFormString(movementFormData.mv_block9_address)} onChange={(e) => handleMovementInputChange('mv_block9_address', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Permit No</label><input type="text" value={getFormString(movementFormData.mv_block9_permit)} onChange={(e) => handleMovementInputChange('mv_block9_permit', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Contact</label><input type="text" value={getFormString(movementFormData.mv_block9_contact)} onChange={(e) => handleMovementInputChange('mv_block9_contact', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {!isReserved && movementStep === 9 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Operation Code</label><select value={getFormString(movementFormData.mv_block10_code)} onChange={(e) => handleMovementInputChange('mv_block10_code', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }}><option value="">Select...</option>{RECOVERY_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}{DISPOSAL_CODES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
              </div>
            )}

            {!isReserved && movementStep === 10 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Common Name</label><textarea value={getFormString(movementFormData.mv_block11_description)} onChange={(e) => handleMovementInputChange('mv_block11_description', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} rows={3} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Major Constituents</label><textarea value={getFormString(movementFormData.mv_block11_composition)} onChange={(e) => handleMovementInputChange('mv_block11_composition', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} rows={3} /></div>
              </div>
            )}

            {!isReserved && movementStep === 11 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Physical Form</label><select value={getFormString(movementFormData.mv_block12_form)} onChange={(e) => handleMovementInputChange('mv_block12_form', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }}><option value="">Select...</option>{PHYSICAL_FORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
              </div>
            )}

            {!isReserved && movementStep === 12 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Basel Code</label><input type="text" value={getFormString(movementFormData.mv_block13_basel)} onChange={(e) => handleMovementInputChange('mv_block13_basel', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g., A1160" /></div>
                <div><label className="block font-display text-sm font-bold mb-1">OECD Code</label><input type="text" value={getFormString(movementFormData.mv_block13_oecd)} onChange={(e) => handleMovementInputChange('mv_block13_oecd', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g., GC020" /></div>
                <div><label className="block font-display text-sm font-bold mb-1">EU List Code</label><input type="text" value={getFormString(movementFormData.mv_block13_eu)} onChange={(e) => handleMovementInputChange('mv_block13_eu', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">UN Class</label><input type="text" value={getFormString(movementFormData.mv_block13_un_class)} onChange={(e) => handleMovementInputChange('mv_block13_un_class', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">UN Number</label><input type="text" value={getFormString(movementFormData.mv_block13_un_number)} onChange={(e) => handleMovementInputChange('mv_block13_un_number', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g., UN2794" /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Y Code</label><input type="text" value={getFormString(movementFormData.mv_block13_y_code)} onChange={(e) => handleMovementInputChange('mv_block13_y_code', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">H Code</label><input type="text" value={getFormString(movementFormData.mv_block13_h_code)} onChange={(e) => handleMovementInputChange('mv_block13_h_code', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
              </div>
            )}

            {!isReserved && movementStep === 13 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Export Country</label><input type="text" value={getFormString(movementFormData.mv_block14_export)} onChange={(e) => handleMovementInputChange('mv_block14_export', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Import Country</label><input type="text" value={getFormString(movementFormData.mv_block14_import)} onChange={(e) => handleMovementInputChange('mv_block14_import', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Transit Countries (comma-separated)</label><input type="text" value={getFormString(movementFormData.mv_block14_transit)} onChange={(e) => handleMovementInputChange('mv_block14_transit', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} placeholder="e.g., Jamaica, Cuba" /></div>
              </div>
            )}

            {!isReserved && movementStep === 14 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Declarant Name</label><input type="text" value={getFormString(movementFormData.mv_block15_name)} onChange={(e) => handleMovementInputChange('mv_block15_name', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="block font-display text-sm font-bold mb-1">Date</label><input type="date" value={getFormString(movementFormData.mv_block15_date)} onChange={(e) => handleMovementInputChange('mv_block15_date', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} /></div>
                <div><label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={!!movementFormData.mv_block15_signed} onChange={(e) => handleMovementInputChange('mv_block15_signed', e.target.checked)} className="w-4 h-4" style={{ accentColor: '#1D9E75' }} /><span className="font-display font-bold" style={{ color: '#1a1a1a' }}>Signed</span></label></div>
              </div>
            )}

            {!isReserved && movementStep === 15 && (
              <div className="space-y-4">
                <div><label className="block font-display text-sm font-bold mb-1">Additional Information</label><textarea value={getFormString(movementFormData.mv_block16_info)} onChange={(e) => handleMovementInputChange('mv_block16_info', e.target.value)} className="w-full px-3 py-2 rounded border" style={{ borderColor: '#e5e5e0' }} rows={4} /></div>
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button onClick={handleMovementPrev} disabled={movementStep === 0} className="px-6 py-3 rounded-lg font-display font-bold disabled:opacity-50" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>← Previous Block</button>
            <button onClick={handleMovementPDF} className="px-6 py-3 rounded-lg font-display font-bold transition-all" style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}>Generate PDF</button>
            <button onClick={handleMovementNext} disabled={movementStep === movementTotalSteps - 1} className="px-6 py-3 rounded-lg font-display font-bold disabled:opacity-50" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Next Block →</button>
          </div>
        </div>
      </div>
    )
  }

  if (activeTab === 'reference') {
    return (
      <div className="min-h-screen font-body" style={{ backgroundColor: '#1C1B18', padding: '32px 24px' }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="font-display text-4xl font-bold mb-4" style={{ color: '#1a1a1a' }}>Basel Navigator</h1>
          <p className="text-lg mb-8" style={{ color: '#666660' }}>Quick reference guide to the vCOP8 Notification and Movement documents.</p>
          {DISCLAIMER_BANNER}
          <div className="flex gap-4 mb-8 border-b" style={{ borderColor: '#e5e5e0' }}>
            <button onClick={() => setActiveTab('reference')} className="px-4 py-2 font-display font-bold border-b-2" style={{ borderColor: '#FF5C00', color: '#FF5C00' }}>Reference</button>
            <button onClick={() => setActiveTab('fill')} className="px-4 py-2 font-display font-bold" style={{ color: '#999990' }}>Fill Form</button>
            <button onClick={() => setActiveTab('submission')} className="px-4 py-2 font-display font-bold" style={{ color: '#999990' }}>Submission Package</button>
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

  if (selectedDoc === 'notification' && activeTab === 'fill') {
    return renderNotificationForm()
  }

  if (selectedDoc === 'movement' && activeTab === 'fill') {
    return renderMovementForm()
  }

  if (activeTab === 'submission') {
    const mandatoryDocs = SUPPORTING_DOCS.filter(d => d.mandatory)
    const completedMandatory = mandatoryDocs.filter(d => docStates[d.id]?.file || docStates[d.id]?.confirmed).length
    const mandatoryRemaining = mandatoryDocs.length - completedMandatory
    const totalComplete = SUPPORTING_DOCS.filter(d => docStates[d.id]?.file || docStates[d.id]?.confirmed).length
    const progressPercent = Math.round((completedMandatory / mandatoryDocs.length) * 100)
    const canDownload = mandatoryRemaining === 0

    const handleFileUpload = (docId: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          alert('File size must be under 10MB')
          return
        }
        handleDocUpload(docId, file)
      }
    }

    return (
      <div className="min-h-screen font-body" style={{ backgroundColor: '#1C1B18', padding: '32px 24px' }}>
        <div className="max-w-5xl mx-auto">
          <h1 className="font-display text-4xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Submission Package</h1>
          <p className="text-lg mb-6" style={{ color: '#666660' }}>Track and upload all 28 required supporting documents for your Basel notification.</p>
          {DISCLAIMER_BANNER}
          <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e5e0' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-display font-bold" style={{ color: '#1a1a1a' }}>{completedMandatory} of {mandatoryDocs.length} mandatory documents complete</span>
              <span className="font-display font-bold" style={{ color: progressPercent === 100 ? '#1D9E75' : '#FF5C00' }}>{progressPercent}%</span>
            </div>
            <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#e5e5e0' }}>
              <div className="h-3 rounded-full transition-all" style={{ width: `${progressPercent}%`, backgroundColor: progressPercent === 100 ? '#1D9E75' : '#FF5C00' }} />
            </div>
            {mandatoryRemaining > 0 && (
              <p className="mt-2 text-sm" style={{ color: '#666660' }}>{mandatoryRemaining} mandatory document(s) remaining</p>
            )}
            {canDownload && (
              <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: '#e8f4f0', border: '1px solid #1D9E75' }}>
                <p className="font-display font-bold" style={{ color: '#1D9E75' }}>All mandatory documents completed! You can now download your submission package.</p>
              </div>
            )}
          </div>
          <div className="space-y-3">
            {SUPPORTING_DOCS.map(doc => {
              const state = docStates[doc.id] || {}
              const isComplete = !!state.file || state.confirmed
              return (
                <div key={doc.id} className="p-4 rounded-lg flex items-center justify-between" style={{ backgroundColor: '#ffffff', border: `1px solid ${isComplete ? '#1D9E75' : '#e5e5e0'}` }}>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-bold text-sm" style={{ color: '#1a1a1a', minWidth: '24px' }}>{doc.id}.</span>
                    <div>
                      <span className="font-display font-bold" style={{ color: '#1a1a1a' }}>{doc.name}</span>
                      {doc.blocks.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {doc.blocks.map(b => (
                            <span key={b} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: '#1C1B18', color: '#666660' }}>Block {b}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${doc.mandatory ? '' : 'optional-badge'}`} style={doc.mandatory ? { backgroundColor: '#FF5C00', color: '#ffffff' } : { backgroundColor: '#2c2c2a', color: '#a0a09a' }}>{doc.mandatory ? 'MANDATORY' : 'OPTIONAL'}</span>
                    <input
                      type="file"
                      ref={submissionFileInputRef}
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload(doc.id)}
                      style={{ display: 'none' }}
                    />
                    <button onClick={() => submissionFileInputRef.current?.click()} className="px-3 py-1 rounded text-sm font-display" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Upload</button>
                    {state.file && (
                      <span className="text-sm flex items-center gap-1" style={{ color: '#1D9E75' }}>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        {state.fileName}
                      </span>
                    )}
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={state.confirmed || false} onChange={(e) => handleDocConfirm(doc.id, e.target.checked)} className="w-4 h-4" style={{ accentColor: '#1D9E75' }} />
                      <span className="text-sm" style={{ color: state.confirmed ? '#1D9E75' : '#666660' }}>{state.confirmed ? 'Confirmed' : 'Confirm'}</span>
                    </label>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6 flex justify-end">
            <button onClick={handleDownloadPackage} disabled={!canDownload} className="px-6 py-3 rounded-lg font-display font-bold transition-all disabled:opacity-50" style={{ backgroundColor: canDownload ? '#1D9E75' : '#cccccc', color: '#ffffff' }}>Download Submission Package</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen font-body" style={{ backgroundColor: '#1C1B18', padding: '32px 24px' }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl font-bold mb-2" style={{ color: '#1a1a1a' }}>Fill Out Your Notification</h1>
        <p className="text-lg mb-6" style={{ color: '#666660' }}>Complete the vCOP8 Notification Document fields below.</p>
        {DISCLAIMER_BANNER}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setSelectedDoc('notification')} className={`px-4 py-2 rounded font-display font-bold ${selectedDoc === 'notification' ? '' : 'opacity-50'}`} style={{ backgroundColor: selectedDoc === 'notification' ? '#1D9E75' : '#cccccc', color: '#ffffff' }}>Notification</button>
          <button onClick={() => setSelectedDoc('movement')} className={`px-4 py-2 rounded font-display font-bold ${selectedDoc === 'movement' ? '' : 'opacity-50'}`} style={{ backgroundColor: selectedDoc === 'movement' ? '#1D9E75' : '#cccccc', color: '#ffffff' }}>Movement Document</button>
        </div>
        <div className="flex gap-4 mb-6 border-b" style={{ borderColor: '#e5e5e0' }}>
          <button onClick={() => { setActiveTab('reference'); setSelectedDoc('notification'); }} className="px-4 py-2 font-display font-bold border-b-2" style={{ borderColor: '#FF5C00', color: '#FF5C00' }}>Reference</button>
          <button onClick={() => setActiveTab('fill')} className="px-4 py-2 font-display font-bold border-b-2" style={{ borderColor: '#1D9E75', color: '#1D9E75' }}>Smart Form</button>
          <button onClick={() => setActiveTab('submission')} className="px-4 py-2 font-display font-bold" style={{ color: '#999990' }}>Submission Package</button>
        </div>
        <div className="mb-4 flex gap-2">
          <button onClick={handleLoadSampleData} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Load Sample</button>
          <button onClick={handleSaveProgress} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Save Progress</button>
          <button onClick={handleSaveToCloud} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#1D9E75', color: '#ffffff' }}>Save Online</button>
          <button onClick={handleDownloadProgress} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Save to File</button>
          <button onClick={handleLoadProgressClick} className="px-4 py-2 rounded font-display text-sm" style={{ backgroundColor: '#e5e5e0', color: '#1a1a1a' }}>Load from File</button>
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
          {currentStep === 15 && isEuRoute && (
            <div className="space-y-4">
              <p style={{ color: '#666660' }}>EU route - showing Block 16 instead. Toggle off to edit Block 15.</p>
            </div>
          )}
          {currentStep === 15 && !isEuRoute && (
            <div className="space-y-6">
              <div>
                <label className="block font-display text-sm font-bold mb-2" style={{ color: '#1a1a1a' }}>Export Country (State of Export)</label>
                <select 
                  value={getFormString(formData.block15_export_code)} 
                  onChange={async (e) => {
                    const code = e.target.value
                    handleInputChange('block15_export', BASEL_COUNTRIES.find(c => c.code === code)?.name || '')
                    handleInputChange('block15_export_code', code)
                    setCaDataExport(null)
                    setCaErrorExport(null)
                    if (code) {
                      setCaLoadingExport(true)
                      const data = await fetchCAData(code)
                      if (data) {
                        setCaDataExport(data)
                      } else {
                        setCaErrorExport('CA data not available for this country — verify manually')
                      }
                      setCaLoadingExport(false)
                    }
                  }}
                  className="w-full px-3 py-2 rounded border"
                  style={{ borderColor: '#e5e5e0' }}
                >
                  <option value="">Select export country...</option>
                  {BASEL_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                {caLoadingExport && <p className="text-sm mt-2" style={{ color: '#666660' }}>Loading CA data...</p>}
                {caErrorExport && <p className="text-sm mt-2" style={{ color: '#FF5C00' }}>{caErrorExport}</p>}
                {caDataExport && !caLoadingExport && (
                  <div className="mt-3 p-4 rounded-lg" style={{ backgroundColor: '#1a1a18', border: '1px solid #1D9E75' }}>
                    <p className="font-display font-bold text-sm mb-2" style={{ color: '#1D9E75' }}>Competent Authority (Export)</p>
                    <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataExport.name || 'N/A'}</p>
                    <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataExport.department || 'N/A'}</p>
                    <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataExport.email || 'N/A'}</p>
                    <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataExport.phone || 'N/A'}</p>
                    <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataExport.address || 'N/A'}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-display text-sm font-bold mb-2" style={{ color: '#1a1a1a' }}>Import Country (State of Import)</label>
                <select 
                  value={getFormString(formData.block15_import_code)} 
                  onChange={async (e) => {
                    const code = e.target.value
                    handleInputChange('block15_import', BASEL_COUNTRIES.find(c => c.code === code)?.name || '')
                    handleInputChange('block15_import_code', code)
                    setCaDataImport(null)
                    setCaErrorImport(null)
                    if (code) {
                      setCaLoadingImport(true)
                      const data = await fetchCAData(code)
                      if (data) {
                        setCaDataImport(data)
                      } else {
                        setCaErrorImport('CA data not available for this country — verify manually')
                      }
                      setCaLoadingImport(false)
                    }
                  }}
                  className="w-full px-3 py-2 rounded border"
                  style={{ borderColor: '#e5e5e0' }}
                >
                  <option value="">Select import country...</option>
                  {BASEL_COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
                {caLoadingImport && <p className="text-sm mt-2" style={{ color: '#666660' }}>Loading CA data...</p>}
                {caErrorImport && <p className="text-sm mt-2" style={{ color: '#FF5C00' }}>{caErrorImport}</p>}
                {caDataImport && !caLoadingImport && (
                  <div className="mt-3 p-4 rounded-lg" style={{ backgroundColor: '#1a1a18', border: '1px solid #1D9E75' }}>
                    <p className="font-display font-bold text-sm mb-2" style={{ color: '#1D9E75' }}>Competent Authority (Import)</p>
                    <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataImport.name || 'N/A'}</p>
                    <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataImport.department || 'N/A'}</p>
                    <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataImport.email || 'N/A'}</p>
                    <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataImport.phone || 'N/A'}</p>
                    <p className="text-sm" style={{ color: '#d0d0cc' }}>{caDataImport.address || 'N/A'}</p>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-display text-sm font-bold mb-2" style={{ color: '#1a1a1a' }}>Transit Countries (comma-separated ISO codes)</label>
                <input 
                  type="text" 
                  value={getFormString(formData.block15_transit)} 
                  onChange={async (e) => {
                    const value = e.target.value
                    handleInputChange('block15_transit', value)
                    const codes = value.split(',').map((s: string) => s.trim().toUpperCase()).filter(Boolean)
                    const newTransitCA: Record<string, any> = {}
                    const codesToFetch: string[] = []
                    for (const code of codes) {
                      if (!caDataTransit[code]) {
                        codesToFetch.push(code)
                      }
                    }
                    for (const code of codesToFetch) {
                      setCaLoadingTransit(prev => ({ ...prev, [code]: true }))
                      const data = await fetchCAData(code)
                      setCaDataTransit(prev => ({ ...prev, [code]: data }))
                      setCaLoadingTransit(prev => ({ ...prev, [code]: false }))
                    }
                  }}
                  className="w-full px-3 py-2 rounded border"
                  style={{ borderColor: '#e5e5e0' }}
                  placeholder="e.g., JM, CU, AN"
                />
                {Object.keys(caDataTransit).length > 0 && (
                  <div className="mt-3 space-y-3">
                    {Object.entries(caDataTransit).map(([code, data]) => (
                      <div key={code} className="p-4 rounded-lg" style={{ backgroundColor: '#1a1a18', border: '1px solid #1D9E75' }}>
                        <p className="font-display font-bold text-sm mb-2" style={{ color: '#1D9E75' }}>Competent Authority (Transit — {code})</p>
                        <p className="text-sm" style={{ color: '#d0d0cc' }}>{data?.name || 'N/A'}</p>
                        <p className="text-sm" style={{ color: '#d0d0cc' }}>{data?.department || 'N/A'}</p>
                        <p className="text-sm" style={{ color: '#d0d0cc' }}>{data?.email || 'N/A'}</p>
                        <p className="text-sm" style={{ color: '#d0d0cc' }}>{data?.phone || 'N/A'}</p>
                        <p className="text-sm" style={{ color: '#d0d0cc' }}>{data?.address || 'N/A'}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
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

export default function BaselFormAssistantPage() {
  return (
    <EmailGate toolName="basel-navigator">
      <BaselFormAssistantPageContent />
      <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #3a3a38' }}>
        <p style={{ color: '#a0a09a', fontSize: '13px', marginBottom: '10px' }}>Found this useful? Help keep it free.</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          <a href="https://ko-fi.com/dexmetal" target="_blank" rel="noopener noreferrer" style={{ padding: '6px 12px', backgroundColor: '#1D9E75', color: '#ffffff', borderRadius: '4px', fontSize: '13px', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>Support on Ko-fi</a>
          <a href="https://www.paypal.biz/dexmetal" target="_blank" rel="noopener noreferrer" style={{ padding: '6px 12px', backgroundColor: '#0070BA', color: '#ffffff', borderRadius: '4px', fontSize: '13px', textDecoration: 'none', fontFamily: 'DM Sans, sans-serif' }}>Donate via PayPal</a>
        </div>
      </div>
    </EmailGate>
  )
}
