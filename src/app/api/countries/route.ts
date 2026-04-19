import { NextResponse } from 'next/server'
import countriesData from '@/data/countries.json'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const parties = (countriesData.parties as any[]).map(c => ({
      code: c.code,
      name: c.name,
      region: c.region
    })).sort((a, b) => a.name.localeCompare(b.name))

    const nonParties = (countriesData.nonParties as any[]).map(c => ({
      code: c.code,
      name: c.name,
      reason: c.reason,
      isParty: false
    }))

    return NextResponse.json({
      parties,
      nonParties,
      totalParties: parties.length,
      totalNonParties: nonParties.length,
      lastUpdated: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to load countries data', parties: [], nonParties: [] },
      { status: 500 }
    )
  }
}
