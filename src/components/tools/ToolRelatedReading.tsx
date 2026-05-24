// Shared Related Reading component for tool pages
// Renders a "From the Field Notes" section linking to the relevant blog post

import Link from 'next/link'
import React from 'react'

type RelatedReadingProps = {
  postSlug: string
  postTitle: string
  episodeNum: number
  teaser: string
}

export default function ToolRelatedReading({ postSlug, postTitle, episodeNum, teaser }: RelatedReadingProps) {
  return (
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.06)',
      marginTop: '3rem',
      paddingTop: '2rem',
    }}>
      <div style={{
        fontSize: '10px',
        fontWeight: 700,
        letterSpacing: '2.5px',
        textTransform: 'uppercase' as const,
        color: '#1D9E75',
        marginBottom: '1rem',
      }}>
        From the Field Notes
      </div>
      <Link
        href={`/blog/${postSlug}`}
        style={{
          display: 'block',
          background: '#2c2c2a',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '1.25rem 1.5rem',
          textDecoration: 'none',
          transition: 'border-color 0.15s',
        }}
      >
        <div style={{
          fontSize: '11px',
          color: '#1D9E75',
          fontWeight: 600,
          letterSpacing: '1px',
          textTransform: 'uppercase' as const,
          marginBottom: '6px',
        }}>
          Episode {String(episodeNum).padStart(2, '0')}
        </div>
        <div style={{
          fontSize: '16px',
          fontWeight: 600,
          color: '#f0ece4',
          marginBottom: '8px',
        }}>
          {postTitle}
        </div>
        <div style={{ fontSize: '14px', color: '#8f8d86', lineHeight: 1.6 }}>
          {teaser}
        </div>
      </Link>
    </div>
  )
}
