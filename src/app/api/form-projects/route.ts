import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      notification_data,
      movement_data,
      export_country_iso,
      import_country_iso,
      transit_country_isos,
      is_eu_route,
    } = body

    const result = await query(
      `INSERT INTO form_projects (notification_data, movement_data, export_country_iso, import_country_iso, transit_country_isos, is_eu_route) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, created_at`,
      [JSON.stringify(notification_data || {}), JSON.stringify(movement_data || {}), export_country_iso || null, import_country_iso || null, transit_country_isos || null, is_eu_route || false]
    )

    const row = result.rows[0]
    return NextResponse.json({ id: row.id, created_at: row.created_at })
  } catch (error: any) {
    console.error('form-projects POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const result = await query(`SELECT * FROM form_projects WHERE id = $1`, [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error('form-projects GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}