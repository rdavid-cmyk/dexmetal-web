import { NextResponse } from 'next/server'
import countriesData from '@/data/countries.json'
import caContacts from '@/data/ca-contacts.json'

export const dynamic = 'force-dynamic'

interface CAContact {
  name: string
  email?: string | null
  phone?: string | null
  website?: string | null
}

export async function GET() {
  try {
    const allCountries = countriesData.parties || []
    const nonParties = countriesData.nonParties || []
    const caData = caContacts as Record<string, CAContact>
    
    const parties = allCountries.map((c: any) => {
      const code = c.code
      const ca = caData[code] || {}
      
      return {
        code: c.code,
        name: c.name,
        region: c.region,
        isParty: true,
        ca_name: ca.name || null,
        ca_email: ca.email || null,
        ca_phone: ca.phone || null,
        ca_website: ca.website || null
      }
    }).sort((a: any, b: any) => a.name.localeCompare(b.name))
    
    const npList = nonParties.map((c: any) => ({
      code: c.code,
      name: c.name,
      reason: c.reason,
      isParty: false,
      ca_name: null,
      ca_email: null,
      ca_phone: null,
      ca_website: null
    }))

    return NextResponse.json({
      parties,
      nonParties: npList,
      totalItems: parties.length + npList.length,
      lastUpdated: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to load countries data', parties: [], nonParties: [] },
      { status: 500 }
    )
  }
}
