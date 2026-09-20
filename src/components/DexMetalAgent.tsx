'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
  source?: 'faq' | 'ai'
  cta?: { toolName: string; toolSlug: string; description: string }
}

const welcomeMessage = "DexMetal Agent online. Describe your shipment or compliance scenario."

const welcomeChips = [
  "Classify my waste",
  "Check shipment eligibility",
  "Find CA contacts",
  "ULAB export help",
]

function AgentAvatar({ size }: { size: number }) {
  const pad = Math.round(size * 0.15)
  const img = size - pad * 2
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: '#1C1B18',
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Image
        unoptimized
        src="/images/dexmetal-agent-avatar.png"
        alt="DexMetal Agent"
        width={img}
        height={img}
        style={{ width: `${img}px`, height: `${img}px`, objectFit: 'contain', display: 'block' }}
      />
    </div>
  )
}

export function DexMetalAgent({ embedded = false }: { embedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>(
    embedded ? [{ role: 'assistant', content: welcomeMessage, source: 'faq' }] : [],
  )
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (embedded) {
      const messagesContainer = messagesEndRef.current?.parentElement
      if (messagesContainer) messagesContainer.scrollTop = messagesContainer.scrollHeight
      return
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [embedded, messages, isThinking])

  const openAgent = () => {
    setIsOpen(true)
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: welcomeMessage, source: 'faq' }])
    }
  }

  const closeAgent = () => setIsOpen(false)

  const sendMessage = async (overrideInput?: string) => {
    const text = (overrideInput ?? input).trim()
    if (!text || isThinking) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsThinking(true)
    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history }),
      })
      const data = await res.json()
      const reply = data.answer || data.reply || "Sorry, I couldn't process that. Try rephrasing."
      setMessages(prev => [...prev, { role: 'assistant', content: reply, source: data.source, cta: data.cta }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }])
    } finally {
      setIsThinking(false)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
  }

  const showChips = messages.length === 1 && messages[0].content === welcomeMessage

  return (
    <>
      <style>{`
        @keyframes agent-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.03); }
        }
        @media (max-width: 720px) {
          .agent-panel:not(.agent-panel-embedded) {
            right: 8px !important;
            left: 8px !important;
            bottom: 80px !important;
            width: auto !important;
          }
        }
      `}</style>

      {/* Floating button */}
      {!embedded && (
        <div style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          zIndex: 9998,
        }}>
          <button
            onClick={() => isOpen ? closeAgent() : openAgent()}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
            }}
            aria-label={isOpen ? 'Close DexMetal Agent' : 'Open DexMetal Agent'}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              padding: '2px',
              background: 'linear-gradient(180deg, rgba(29,158,117,0.72), rgba(255,92,0,0.45))',
              boxShadow: '0 8px 24px rgba(0,0,0,0.42)',
              animation: 'agent-pulse 4s ease-in-out infinite',
            }}>
              <AgentAvatar size={52} />
            </div>
          </button>
        </div>
      )}

      {/* Chat panel */}
      {(embedded || isOpen) && (
        <div
          className={`agent-panel${embedded ? ' agent-panel-embedded' : ''}`}
          data-homepage-agent={embedded ? '' : undefined}
          role={embedded ? 'region' : undefined}
          aria-label={embedded ? 'DexMetal shipment guidance console' : undefined}
          style={{
            position: embedded ? 'relative' : 'fixed',
            bottom: embedded ? undefined : '96px',
            right: embedded ? undefined : '24px',
            width: embedded ? '100%' : '390px',
            maxWidth: embedded ? '1040px' : undefined,
            maxHeight: embedded ? undefined : '560px',
            margin: embedded ? '0 auto' : undefined,
            background: embedded
              ? 'linear-gradient(145deg, rgba(30,30,26,0.97), rgba(17,18,15,0.98))'
              : '#1C1B18',
            border: embedded ? '1px solid rgba(194,116,69,0.38)' : '1px solid #2a2a28',
            borderRadius: embedded ? '20px' : '16px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            boxShadow: embedded
              ? '0 30px 80px rgba(0,0,0,0.46), 0 0 0 1px rgba(29,158,117,0.08) inset'
              : '0 16px 44px rgba(0,0,0,0.52)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          {embedded ? (
            <div style={{
              padding: '15px 18px 14px',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              background: 'linear-gradient(90deg, rgba(194,116,69,0.08), rgba(29,158,117,0.05))',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '7px',
                color: '#a9a79f',
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>
                <span style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#1D9E75',
                  boxShadow: '0 0 0 4px rgba(29,158,117,0.12)',
                }} />
                DexMetal Agent
                <span style={{ marginLeft: 'auto', color: '#797872' }}>Operator console</span>
              </div>
              <h2 style={{
                color: '#fff',
                fontWeight: 700,
                fontSize: 'clamp(1.35rem, 3vw, 1.85rem)',
                lineHeight: 1.15,
                margin: 0,
              }}>
                Tell us about your shipment
              </h2>
            </div>
          ) : (
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #2a2a28',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}>
              <AgentAvatar size={36} />
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>DexMetal Agent</div>
                <div style={{ color: '#1D9E75', fontSize: '12px' }}>Basel compliance, operator-grade</div>
              </div>
              <button
                onClick={closeAgent}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: '18px',
                  lineHeight: '1',
                  padding: '4px',
                }}
                aria-label="Close DexMetal Agent"
              >×</button>
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: embedded ? '14px 16px 12px' : '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '86%',
                backgroundColor: msg.role === 'user' ? '#B86435' : embedded ? '#272722' : '#2a2a28',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                border: embedded && msg.role !== 'user' ? '1px solid rgba(255,255,255,0.055)' : undefined,
                fontSize: '13px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap',
              }}>
                {msg.content}
                {msg.cta && (
                  <a
                    href={`https://dexmetal.com/tools/${msg.cta.toolSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      marginTop: '10px',
                      padding: '10px 12px',
                      backgroundColor: '#1C1B18',
                      border: '1px solid #1D9E75',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      color: '#fff',
                    }}
                  >
                    <div style={{ fontWeight: 600, fontSize: '12px', color: '#1D9E75', marginBottom: '4px' }}>
                      {msg.cta.toolName}
                    </div>
                    <div style={{ fontSize: '11px', color: '#aaa' }}>
                      {msg.cta.description}
                    </div>
                  </a>
                )}
                {msg.source && (
                  <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px' }}>
                    {msg.source === 'faq' ? 'Basel KB' : 'AI'}
                  </div>
                )}
              </div>
            ))}
            {isThinking && (
              <div style={{
                alignSelf: 'flex-start',
                backgroundColor: '#2a2a28',
                color: '#888',
                padding: '10px 14px',
                borderRadius: '16px 16px 16px 4px',
                fontSize: '13px',
              }}>Thinking...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Welcome chips */}
          {showChips && (
            <div style={{
              padding: '0 16px 12px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
            }}>
              {welcomeChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  disabled={isThinking}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '14px',
                    backgroundColor: embedded ? 'rgba(255,255,255,0.035)' : '#2a2a28',
                    color: embedded ? '#ddd9cf' : '#fff',
                    border: embedded ? '1px solid rgba(255,255,255,0.12)' : '1px solid #3a3a38',
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >{chip}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px',
            borderTop: embedded ? '1px solid rgba(255,255,255,0.08)' : '1px solid #2a2a28',
            display: 'flex',
            gap: '8px',
            background: embedded ? 'rgba(7,8,7,0.28)' : undefined,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your shipment or compliance scenario..."
              disabled={isThinking}
              style={{
                flex: 1,
                padding: '10px 12px',
                borderRadius: '8px',
                backgroundColor: embedded ? '#23241f' : '#2a2a28',
                color: '#fff',
                border: embedded ? '1px solid rgba(255,255,255,0.13)' : '1px solid #3a3a38',
                fontSize: '13px',
                outline: 'none',
                minWidth: 0,
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={isThinking || !input.trim()}
              style={{
                padding: '10px 16px',
                borderRadius: '8px',
                backgroundColor: embedded ? '#B86435' : '#FF5C00',
                color: '#fff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: isThinking || !input.trim() ? 'not-allowed' : 'pointer',
                opacity: isThinking || !input.trim() ? 0.5 : 1,
              }}
            >Send</button>
          </div>
        </div>
      )}
    </>
  )
}
