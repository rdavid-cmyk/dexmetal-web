import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { notification_data, movement_data, status, movement_synced_at } = body

    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    if (notification_data !== undefined) {
      updates.push(`notification_data = $${paramIndex++}`)
      values.push(JSON.stringify(notification_data))
    }
    if (movement_data !== undefined) {
      updates.push(`movement_data = $${paramIndex++}`)
      values.push(JSON.stringify(movement_data))
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`)
      values.push(status)
    }
    if (movement_synced_at !== undefined) {
      updates.push(`movement_synced_at = $${paramIndex++}`)
      values.push(movement_synced_at)
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 })
    }

    updates.push(`updated_at = NOW()`)
    values.push(id)

    const result = await query(
      `UPDATE form_projects SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING id, updated_at`,
      values
    )

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const row = result.rows[0]
    return NextResponse.json({ id: row.id, updated_at: row.updated_at })
  } catch (error: any) {
    console.error('form-projects/[id] PATCH error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const result = await query(`SELECT * FROM form_projects WHERE id = $1`, [id])

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(result.rows[0])
  } catch (error: any) {
    console.error('form-projects/[id] GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}