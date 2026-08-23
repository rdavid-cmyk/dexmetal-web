export type RegulatoryEventType =
  | 'cop-decision'
  | 'ban-amendment'
  | 'country-update'
  | 'secretariat-notice'
  | 'listing-change'

export interface RegulatoryEvent {
  id: string
  date: string
  type: RegulatoryEventType
  title: string
  summary: string
  impact: 'high' | 'medium' | 'low'
  affectedRegions: string[]
  serviceLink?: string
  source: string
  sourceUrl: string
  documentNumber?: string
}

export const regulatoryEvents: RegulatoryEvent[] = [
  {
    id: 'cop17-strategic-framework',
    date: '2025-05-09',
    type: 'cop-decision',
    title: 'COP17 Adopts Strategic Framework for 2025–2031',
    summary:
      'At its seventeenth meeting, the Conference of the Parties adopted the renewed strategic framework for the implementation of the Basel Convention for 2025-2031. Operators should treat it as the current policy frame for Basel implementation, enforcement capacity, and national reporting work.',
    impact: 'high',
    affectedRegions: ['Global'],
    source: 'Basel Convention Secretariat',
    sourceUrl:
      'https://www.basel.int/TheConvention/ConferenceoftheParties/Meetings/COP17/tabid/9743/ItemId/3595/Default.aspx',
    documentNumber: 'BC-17/1',
  },
  {
    id: 'cop17-plastic-waste',
    date: '2025-05-09',
    type: 'cop-decision',
    title: 'COP17 Requests Further Information on Plastic Waste Amendments',
    summary:
      'COP17 adopted decision BC-17/11 on further consideration of plastic waste and invited Parties and others to provide information and comments on the Basel plastic waste amendments, including their implementation, challenges, and impacts.',
    impact: 'high',
    affectedRegions: ['Asia-Pacific', 'Africa', 'Caribbean'],
    source: 'Basel Convention Secretariat',
    sourceUrl:
      'https://www.basel.int/Implementation/Plasticwaste/Callforinformation/FollowuptoBCCOP17/tabid/10470/Default.aspx',
    documentNumber: 'BC-17/11',
  },
  {
    id: 'cop17-compliance-work-programme',
    date: '2025-05-09',
    type: 'cop-decision',
    title: 'COP17 Adopts Compliance Committee Work Programme for 2026–2027',
    summary:
      'Decision BC-17/14 adopted the 2026-2027 work programme of the Committee Administering the Mechanism for Promoting Implementation and Compliance, including work on national reporting and country-contact obligations.',
    impact: 'medium',
    affectedRegions: ['Global'],
    source: 'Basel Convention Secretariat',
    sourceUrl:
      'https://www.basel.int/Implementation/LegalMatters/ComplianceActivities/WorkProgramme/20262027/tabid/10269/Default.aspx',
    documentNumber: 'BC-17/14',
  },
  {
    id: 'eu-wsr-2024',
    date: '2024-05-20',
    type: 'country-update',
    title: 'EU Waste Shipment Regulation 2024/1157 Enters into Force',
    summary:
      'Regulation (EU) 2024/1157 entered into force on 20 May 2024. Most provisions apply from 21 May 2026, with most export rules applying from 21 May 2027; exporters should plan for stricter non-EU shipment controls, digital procedures, and facility-audit obligations.',
    impact: 'high',
    affectedRegions: ['Europe', 'Africa', 'Asia-Pacific', 'Caribbean'],
    serviceLink: '/services',
    source: 'EUR-Lex',
    sourceUrl: 'https://eur-lex.europa.eu/eli/reg/2024/1157/oj',
    documentNumber: 'Regulation (EU) 2024/1157',
  },
  {
    id: 'bc17-ewaste-technical-guidelines',
    date: '2025-05-09',
    type: 'cop-decision',
    title: 'COP17 Takes Up Updated E-Waste Technical Guidelines',
    summary:
      'COP17 adopted decision BC-17/4 on technical guidelines for transboundary movements of electrical and electronic waste and used electrical and electronic equipment, including the waste/non-waste distinction under the Basel Convention.',
    impact: 'high',
    affectedRegions: ['Global'],
    source: 'Basel Convention Secretariat',
    sourceUrl:
      'https://www.basel.int/Implementation/Ewaste/TechnicalGuidelines/Decisions/tabid/8236/Default.aspx',
    documentNumber: 'BC-17/4',
  },
  {
    id: 'bc17-waste-batteries-guidelines',
    date: '2025-05-09',
    type: 'cop-decision',
    title: 'COP17 Advances Waste Lead-Acid Battery Technical Guidelines',
    summary:
      'COP17 adopted decision BC-17/5 on technical guidelines for the environmentally sound management of waste lead-acid batteries and other waste batteries, continuing work led by China, Uruguay, and the European Union.',
    impact: 'medium',
    affectedRegions: ['Caribbean', 'Africa', 'Asia-Pacific'],
    serviceLink: '/services',
    source: 'Basel Convention Secretariat',
    sourceUrl:
      'https://www.basel.int/Implementation/Wastebatteries/Decisions/tabid/9416/Default.aspx',
    documentNumber: 'BC-17/5',
  },
  {
    id: 'ban-amendment-enforcement',
    date: '2019-12-05',
    type: 'ban-amendment',
    title: 'Basel Ban Amendment Enters into Force',
    summary:
      'The Ban Amendment entered into force on 5 December 2019. It prohibits Parties listed in Annex VII from exporting hazardous wastes covered by the Convention to States not listed in Annex VII for final disposal or recovery.',
    impact: 'high',
    affectedRegions: ['Global'],
    serviceLink: '/services',
    source: 'Basel Convention Secretariat',
    sourceUrl: 'https://www.basel.int/Implementation/LegalMatters/BanAmendment/Overview/tabid/7433/Default.aspx',
    documentNumber: 'Ban Amendment',
  },
]

export const typeLabels: Record<RegulatoryEventType, string> = {
  'cop-decision': 'COP Decision',
  'ban-amendment': 'Ban Amendment',
  'country-update': 'Country Update',
  'secretariat-notice': 'Secretariat Notice',
  'listing-change': 'Listing Change',
}

export const typeColors: Record<RegulatoryEventType, string> = {
  'cop-decision': '#1D9E75',
  'ban-amendment': '#e53e3e',
  'country-update': '#3182ce',
  'secretariat-notice': '#d69e2e',
  'listing-change': '#805ad5',
}
