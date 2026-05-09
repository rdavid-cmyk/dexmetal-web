import EWasteMaterialRecovery from '@/components/tools/EWasteMaterialRecovery'
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
  title: 'E-Waste Material Recovery Estimator | DexMetal',
  description:
    'Estimate the recoverable material value from your e-waste shipment — copper, gold, lead, silver and more — before you trade.',
}

export default function EWasteMaterialRecoveryPage() {
  return (
    <EmailGate toolName="ewaste-material-recovery">
      <EWasteMaterialRecovery />
      <DonateBar />
    </EmailGate>
  )
}