import { NextResponse } from 'next/server'
import countriesData from '@/data/countries.json'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const allCountries = countriesData.parties || []
    const nonParties = countriesData.nonParties || []
    
    const parties = allCountries.map((c: any) => ({
      code: c.code,
      name: c.name,
      region: c.region,
      isParty: true
    })).sort((a: any, b: any) => a.name.localeCompare(b.name))
    
    const npList = nonParties.map((c: any) => ({
      code: c.code,
      name: c.name,
      reason: c.reason,
      isParty: false
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
