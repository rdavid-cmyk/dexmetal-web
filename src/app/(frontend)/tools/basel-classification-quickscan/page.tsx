import BaselClassificationQuickscan from '@/components/tools/BaselClassificationQuickscan'
import EmailGate from '@/components/EmailGate'

function DonateBar() {
  return (
    <div style={{ marginTop: '32px', paddingTop: '24px', borderTop: '1px solid #3a3a38' }}>
      <p style={{ color: '#a0a09a', fontSize: '13px', marginBottom: '10px' }}>
        Found this useful? Help keep it free.
      </p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <a
          href="https://ko-fi.com/dexmetal"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '6px 12px',
            backgroundColor: '#1D9E75',
            color: '#ffffff',
            borderRadius: '4px',
            fontSize: '13px',
            textDecoration: 'none',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          Support on Ko-fi
        </a>
        <a
          href="https://www.paypal.biz/dexmetal"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '6px 12px',
            backgroundColor: '#0070BA',
            color: '#ffffff',
            borderRadius: '4px',
            fontSize: '13px',
            textDecoration: 'none',
            fontFamily: 'DM Sans, sans-serif',
          }}
        >
          Donate via PayPal
        </a>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Basel Classification QuickScan | DexMetal',
  description:
    'Identify the correct Basel waste code for your e-waste or battery shipment in three questions. Covers A1181, Y31, B1110, A1170, B3011, and 2025 amendments.',
}

export default function BaselClassificationQuickscanPage() {
  return (
    <EmailGate toolName="basel-classification-quickscan">
      <BaselClassificationQuickscan />
      <DonateBar />
    </EmailGate>
  )
}