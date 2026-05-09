import PICStatusChecker from '@/components/tools/PICStatusChecker'
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
  title: 'PIC Status Checker | DexMetal',
  description:
    'Check whether your waste shipment requires Prior Informed Consent under the Basel Convention — including OECD tacit consent and the 2025 Y49 amendment.',
}

export default function PICStatusCheckerPage() {
  return (
    <EmailGate toolName="pic-status-checker">
      <PICStatusChecker />
      <DonateBar />
    </EmailGate>
  )
}