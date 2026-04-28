'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  source?: 'faq' | 'groq'
}

export function BaselCopilot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isThinking) return

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setIsThinking(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      })
      const data = await response.json()
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.answer,
        source: data.source 
      }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, something went wrong. Please try again.',
        source: 'groq'
      }])
    } finally {
      setIsThinking(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#1D9E75',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 20px',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(29, 158, 117, 0.3)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        Basel Copilot
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(false)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          backgroundColor: '#1D9E75',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          padding: '12px 20px',
          fontFamily: 'DM Sans, sans-serif',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(29, 158, 117, 0.3)',
          zIndex: 9999,
        }}
      >
        Close Chat
      </button>
      <div
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          width: '400px',
          height: '500px',
          backgroundColor: '#1C1B18',
          borderRadius: '12px',
          border: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 9998,
          fontFamily: 'DM Sans, sans-serif',
        }}
      >
        <div
          style={{
            padding: '16px',
            borderBottom: '1px solid #333',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#1D9E75',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '16px' }}>Basel Copilot</div>
            <div style={{ color: '#888', fontSize: '12px' }}>Ask about Basel compliance</div>
          </div>
        </div>

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {messages.length === 0 && (
            <div style={{ color: '#666', textAlign: 'center', marginTop: '40px' }}>
              Ask me anything about Basel Convention compliance, competent authorities, or transboundary movement requirements.
            </div>
          )}
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '12px 16px',
                  borderRadius: '12px',
                  backgroundColor: msg.role === 'user' ? '#1D9E75' : '#2a2a2a',
                  color: '#fff',
                  fontSize: '14px',
                  lineHeight: 1.5,
                }}
              >
                {msg.content}
              </div>
              {msg.source === 'faq' && (
                <span style={{ color: '#1D9E75', fontSize: '11px', marginTop: '4px', fontWeight: 500 }}>
                  From Knowledge Hub
                </span>
              )}
            </div>
          ))}
          {isThinking && (
            <div style={{ color: '#888', fontSize: '13px', padding: '8px 0' }}>
              Thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div
          style={{
            padding: '12px',
            borderTop: '1px solid #333',
            display: 'flex',
            gap: '8px',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your question..."
            disabled={isThinking}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #333',
              backgroundColor: '#252525',
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'DM Sans, sans-serif',
              outline: 'none',
            }}
          />
          <button
            onClick={sendMessage}
            disabled={isThinking || !input.trim()}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#FF5C00',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: isThinking || !input.trim() ? 'not-allowed' : 'pointer',
              opacity: isThinking || !input.trim() ? 0.5 : 1,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  )
}