// force-dynamic: LMETicker polls every 15 min client-side; no server-side caching needed
export const dynamic = 'force-dynamic'

interface StooqRow {
  close: number | null
  open: number | null
}

// stooq CSV format (with &h header row): Symbol,Date,Time,Open,High,Low,Close,Volume
// cols:                                                     0     1    2   3     4    5   6      7
async function fetchStooq(symbol: string): Promise<StooqRow> {
  try {
    const res = await fetch(
      `https://stooq.com/q/l/?s=${encodeURIComponent(symbol)}&f=sd2t2ohlcv&h&e=csv`,
      { signal: AbortSignal.timeout(8000), cache: 'no-store' },
    )
    if (!res.ok) return { close: null, open: null }
    const text = await res.text()
    const lines = text.trim().split('\n')
    if (lines.length < 2) return { close: null, open: null }
    const cols = lines[1].split(',')
    const open = parseFloat(cols[3])
    const close = parseFloat(cols[6])
    if (isNaN(close) || close <= 0) return { close: null, open: null }
    return { close, open: isNaN(open) ? null : open }
  } catch {
    return { close: null, open: null }
  }
}

// COMEX HG.F (copper) is quoted in US cents per pound
const CENTS_LB_TO_USD_TONNE = 2204.62 / 100

// COMEX PB.F (lead) and ALI.F (aluminum) are quoted in USD per metric ton — no conversion needed

export async function GET() {
  const [cuRow, pbRow, aliRow] = await Promise.all([
    fetchStooq('hg.f'),  // COMEX copper futures — cents/lb → convert to USD/t
    fetchStooq('pb.f'),  // COMEX lead futures — USD/t
    fetchStooq('ali.f'), // CME aluminum futures — USD/t
  ])

  const copper = cuRow.close ? Math.round(cuRow.close * CENTS_LB_TO_USD_TONNE) : 9510
  const copperChange =
    cuRow.close && cuRow.open
      ? Math.round((cuRow.close - cuRow.open) * CENTS_LB_TO_USD_TONNE)
      : null

  const lead = pbRow.close ? Math.round(pbRow.close) : 1948
  const leadChange =
    pbRow.close && pbRow.open ? Math.round(pbRow.close - pbRow.open) : null

  const aluminum = aliRow.close ? Math.round(aliRow.close) : 2395
  const aluminumChange =
    aliRow.close && aliRow.open ? Math.round(aliRow.close - aliRow.open) : null

  const anyLive = cuRow.close !== null || pbRow.close !== null || aliRow.close !== null

  return Response.json({
    metals: [
      {
        symbol: 'LEAD',
        label: 'Lead',
        price: lead,
        change: leadChange,
        unit: 'USD/t',
        live: pbRow.close !== null,
      },
      {
        symbol: 'COPPER',
        label: 'Copper',
        price: copper,
        change: copperChange,
        unit: 'USD/t',
        live: cuRow.close !== null,
      },
      {
        symbol: 'ALUMINUM',
        label: 'Aluminum',
        price: aluminum,
        change: aluminumChange,
        unit: 'USD/t',
        live: aliRow.close !== null,
      },
    ],
    updated: new Date().toISOString(),
    delayed: !anyLive,
  })
}
