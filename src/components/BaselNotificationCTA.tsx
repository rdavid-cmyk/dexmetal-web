import React from 'react'

export function BaselNotificationCTA() {
  return (
    <div
      className="mt-12 p-8 rounded-lg"
      style={{
        backgroundColor: '#1C1B18',
        border: '1px solid #1D9E75',
      }}
    >
      <h3
        className="font-display font-bold text-white mb-3"
        style={{ fontSize: '1.5rem' }}
      >
        Need Help With Your Basel Notification?
      </h3>
      <p className="font-body text-base leading-relaxed mb-6" style={{ color: '#c8c8c2' }}>
        Download the free Urban Miners Playbook — the field guide Basel compliance professionals use to prepare notifications, manage competent authorities, and stay audit-ready.
      </p>
      <a
        href="https://dexmetal.com/#email-capture"
        className="inline-block px-6 py-3 rounded-lg font-display font-bold text-white transition-all duration-200 hover:brightness-110"
        style={{ backgroundColor: '#1D9E75', fontSize: '1rem' }}
      >
        Get the Free Playbook
      </a>
      <p className="mt-4 font-body text-sm" style={{ color: '#a0a09a' }}>
        Or{' '}
        <a
          href="mailto:rdavid@gvoltt.com?subject=Basel Compliance Inquiry"
          className="hover:text-white transition-colors"
          style={{ color: '#1D9E75' }}
        >
          book a $2,500 done-for-you compliance engagement →
        </a>
      </p>
    </div>
  )
}
