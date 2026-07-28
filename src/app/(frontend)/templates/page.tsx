import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Free Basel Convention Templates | DexMetal',
  description: 'Download free Basel Convention compliance templates — vCOP8 notification forms, movement documents, and operator checklists. Built by practitioners with 20+ years of experience.',
}

const templates = [
  {
    title: 'vCOP8 Notification Form',
    description: 'The official 21-block Basel Convention transboundary movement notification template. Pre-formatted for Competent Authority submission.',
    badge: 'PDF',
    badgeColor: '#FF5C00',
    action: 'Download PDF',
    href: '/templates/vcop8_notification.pdf',
    type: 'download',
    disclaimer: 'Template only. Consult your Competent Authority for jurisdiction-specific requirements.',
    updated: 'Updated: January 2026',
  },
  {
    title: 'Basel Movement Document',
    description: 'Movement document template required to accompany every Basel-notified hazardous waste shipment from origin to destination facility.',
    badge: 'PDF',
    badgeColor: '#FF5C00',
    action: 'Download PDF',
    href: '/templates/test_movement.pdf',
    type: 'download',
    disclaimer: 'Template only. Movement documents must reference an approved notification number.',
    updated: 'Updated: January 2026',
  },
  {
    title: 'Operator Pre-Shipment Checklist',
    description: '45-point interactive checklist covering notification status, waste classification, CA contacts, Movement Document readiness, and export documentation.',
    badge: 'Interactive',
    badgeColor: '#1D9E75',
    action: 'Open Checklist',
    href: '/checklist',
    type: 'link',
    disclaimer: null,
    updated: null,
  },
  {
    title: 'Competent Authority Contact Lookup',
    description: 'Verified CA contacts for 182 Basel signatory countries — email, phone, address. Updated from official Basel Convention sources.',
    badge: 'Live Tool',
    badgeColor: '#1D9E75',
    action: 'Look Up CA',
    href: '/tools/pic-status-checker',
    type: 'link',
    disclaimer: null,
    updated: null,
  },
]

export default function TemplatesPage() {
  return (
    <main style={{ backgroundColor: '#1C1B18', minHeight: '100vh', padding: '64px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#2a2a28', border: '1px solid #3a3a38', borderRadius: '6px', padding: '4px 12px', marginBottom: '16px' }}>
            <span style={{ color: '#1D9E75', fontSize: '12px', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Free Resources</span>
          </div>
          <h1 style={{ color: '#ffffff', fontSize: '36px', fontWeight: 700, margin: '0 0 16px', lineHeight: 1.2 }}>
            Basel Convention Templates
          </h1>
          <p style={{ color: '#a0a09a', fontSize: '16px', lineHeight: 1.7, maxWidth: '600px', margin: 0 }}>
            Practitioner-built templates for Basel transboundary movement notifications. Free to download and use. No account required.
          </p>
        </div>

        {/* Template Cards */}
        <div style={{ display: 'grid', gap: '20px', marginBottom: '64px' }}>
          {templates.map((t) => (
            <div
              key={t.title}
              style={{
                backgroundColor: '#232320',
                border: '1px solid #2a2a28',
                borderRadius: '12px',
                padding: '28px 32px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1, minWidth: '280px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: '#ffffff', fontSize: '17px', fontWeight: 700 }}>{t.title}</span>
                  <span style={{
                    backgroundColor: t.badgeColor + '22',
                    color: t.badgeColor,
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: `1px solid ${t.badgeColor}44`,
                  }}>{t.badge}</span>
                </div>
                <p style={{ color: '#a0a09a', fontSize: '14px', lineHeight: 1.6, margin: '0 0 8px' }}>{t.description}</p>
                {t.disclaimer && (
                  <p style={{ color: '#77736b', fontSize: '12px', margin: '0 0 4px' }}>⚠ {t.disclaimer}</p>
                )}
                {t.updated && (
                  <p style={{ color: '#55524e', fontSize: '11px', margin: 0 }}>{t.updated}</p>
                )}
              </div>
              <div style={{ flexShrink: 0 }}>
                <Link
                  href={t.href}
                  {...(t.type === 'download' ? { download: true } : { target: '_self' })}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#FF5C00',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {t.action}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Email capture for pre-filled versions */}
        <div style={{
          backgroundColor: '#232320',
          border: '1px solid #1D9E75',
          borderRadius: '12px',
          padding: '36px 32px',
          marginBottom: '48px',
        }}>
          <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: 700, margin: '0 0 12px' }}>
            Need a pre-filled notification package?
          </h2>
          <p style={{ color: '#a0a09a', fontSize: '14px', lineHeight: 1.7, margin: '0 0 20px' }}>
            The Basel Navigator generates a completed vCOP8 notification file for your specific trade lane — waste stream, export country, destination country, and Competent Authority references included.
          </p>
          <Link
            href="/tools/basel-navigator"
            style={{
              display: 'inline-block',
              backgroundColor: '#1D9E75',
              color: '#ffffff',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Use Basel Navigator — Free
          </Link>
        </div>

        {/* Service upsell */}
        <div style={{ borderTop: '1px solid #2a2a28', paddingTop: '40px' }}>
          <p style={{ color: '#77736b', fontSize: '13px', margin: '0 0 16px' }}>
            Want your finished file checked before you submit it?
          </p>
          <Link
            href="/services/shipment-compliance-review"
            style={{ color: '#FF5C00', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}
          >
            Basel Shipment Triage — $149 →
          </Link>
        </div>

      </div>
    </main>
  )
}
