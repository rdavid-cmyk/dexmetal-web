// force-dynamic: LMETicker polls every 15 min client-side; no server-side caching needed
export const dynamic = 'force-dynamic'

interface StooqRow {
  close: number | null
  open: number | null
}

// stooq CSV: Symbol,Date,Time,Open,High,Low,Close,Volume
// COMEX HG.F (copper) is in US cents/pound; PB.F (lead) in USD/tonne
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

// COMEX HG.F price is in US cents/pound
const CENTS_LB_TO_USD_TONNE = 2204.62 / 100

export async function GET() {
  const [cuRow, pbRow] = await Promise.all([
    fetchStooq('hg.f'), // COMEX copper futures — cents/lb
    fetchStooq('pb.f'), // COMEX lead futures — USD/tonne
  ])

  const copper = cuRow.close ? Math.round(cuRow.close * CENTS_LB_TO_USD_TONNE) : 9510
  const copperChange =
    cuRow.close && cuRow.open
      ? Math.round((cuRow.close - cuRow.open) * CENTS_LB_TO_USD_TONNE)
      : null

  // PB.F from stooq is in USD/tonne (LME-linked)
  const lead = pbRow.close ? Math.round(pbRow.close) : 1948
  const leadChange =
    pbRow.close && pbRow.open ? Math.round(pbRow.close - pbRow.open) : null

  const aluminum = 2395 // LME indicative — no reliably free AL futures feed

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
        change: null,
        unit: 'USD/t',
        live: false,
      },
    ],
    updated: new Date().toISOString(),
    delayed: !cuRow.close && !pbRow.close,
  })
}
