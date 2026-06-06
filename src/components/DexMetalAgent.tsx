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

export function DexMetalAgent() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

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
      <style jsx>{`\`
        @keyframes agent-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.85; transform: scale(1.03); }
        }
        @media (max-width: 720px) {
          .agent-panel {
            right: 8px !important;
            left: 8px !important;
            bottom: 80px !important;
            width: auto !important;
          }
        }
      \``}</style>

      {/* Floating button */}
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

      {/* Chat panel */}
      {isOpen && (
        <div
          className="agent-panel"
          style={{
            position: 'fixed',
            bottom: '96px',
            right: '24px',
            width: '390px',
            maxHeight: '560px',
            backgroundColor: '#1C1B18',
            border: '1px solid #2a2a28',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9999,
            boxShadow: '0 16px 44px rgba(0,0,0,0.52)',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
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

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '86%',
                backgroundColor: msg.role === 'user' ? '#FF5C00' : '#2a2a28',
                color: '#fff',
                padding: '10px 14px',
                borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
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
              padding: '0 16px 10px 16px',
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
                    backgroundColor: '#2a2a28',
                    color: '#fff',
                    border: '1px solid #3a3a38',
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
            borderTop: '1px solid #2a2a28',
            display: 'flex',
            gap: '8px',
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
                backgroundColor: '#2a2a28',
                color: '#fff',
                border: '1px solid #3a3a38',
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
                backgroundColor: '#FF5C00',
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
