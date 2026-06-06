'use client'

import { useState, useRef, useEffect } from 'react'

interface ToolCTA {
  toolName: string
  toolSlug: string
  description: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  source?: 'faq' | 'groq'
  cta?: ToolCTA
}

export function BaselCopilot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const gotResultRef = useRef(false)
  const voiceEnabledRef = useRef(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    try {
      const w = window as any
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition
      setHasSpeechSupport(!!SR)
    } catch (e) {}
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const speakText = async (text: string) => {
    try {
      if (!voiceEnabledRef.current) return
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      })
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => URL.revokeObjectURL(url)
      audio.play()
    } catch (e) {}
  }

  const sendMessage = async (messageOverride?: string) => {
    const userMessage = (messageOverride !== undefined ? messageOverride : input).trim()
    if (!userMessage || isThinking) return

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
      const botContent = data.answer
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: botContent,
        source: data.source,
        cta: data.cta || undefined,
      }])
      speakText(botContent)
    } catch (error) {
      const errMsg = 'Sorry, something went wrong. Please try again.'
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: errMsg,
        source: 'groq',
      }])
      speakText(errMsg)
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

  const startListening = () => {
    try {
      const w = window as any
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition
      if (!SR) return

      gotResultRef.current = false
      const recognition = new SR()
      recognition.lang = 'en-US'
      recognition.interimResults = false
      recognition.maxAlternatives = 1

      recognition.onstart = () => {
        setIsListening(true)
        setInput('Listening...')
      }

      recognition.onresult = (event: any) => {
        gotResultRef.current = true
        const transcript = event.results[0][0].transcript
        setIsListening(false)
        setInput(transcript)
        sendMessage(transcript)
      }

      recognition.onerror = () => {
        setIsListening(false)
        setInput('')
      }

      recognition.onend = () => {
        setIsListening(false)
        if (!gotResultRef.current) setInput('')
      }

      recognitionRef.current = recognition
      recognition.start()
    } catch (e) {
      setIsListening(false)
    }
  }

  const stopListening = () => {
    try { recognitionRef.current?.stop() } catch (e) {}
    setIsListening(false)
    setInput('')
  }

  const toggleVoice = () => {
    const next = !voiceEnabledRef.current
    voiceEnabledRef.current = next
    if (!next && audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setVoiceEnabled(next)
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
        DexMetal Agent
      </button>
    )
  }

  return (
    <>
      <style>{`@keyframes copilot-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.7;transform:scale(1.15)}}`}</style>
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
          <img
            src="/images/dexmetal-agent-avatar.png"
            alt="DexMetal Agent"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              flexShrink: 0,
              backgroundColor: '#1C1B18',
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '16px' }}>DexMetal Agent</div>
            <div style={{ color: '#888', fontSize: '12px' }}>Basel compliance, operator-grade</div>
          </div>
          <button
            onClick={toggleVoice}
            title={voiceEnabled ? 'Mute voice output' : 'Unmute voice output'}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              color: voiceEnabled ? '#1D9E75' : '#555',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {voiceEnabled ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            )}
          </button>
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
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.content}
              </div>
              {msg.source === 'faq' && (
                <span style={{ color: '#1D9E75', fontSize: '11px', marginTop: '4px', fontWeight: 500 }}>
                  From Knowledge Hub
                </span>
              )}
              {msg.cta && (
                <div style={{
                  marginTop: '8px',
                  padding: '12px',
                  backgroundColor: '#252525',
                  borderRadius: '8px',
                  border: '1px solid #333',
                  maxWidth: '85%',
                }}>
                  <div style={{ color: '#1D9E75', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>RELEVANT TOOL</div>
                  <a href={'/tools/' + msg.cta.toolSlug} style={{ color: '#fff', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>
                    {msg.cta.toolName} →
                  </a>
                  <div style={{ color: '#888', fontSize: '12px', marginTop: '4px' }}>{msg.cta.description}</div>
                </div>
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
            disabled={isThinking || isListening}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #333',
              backgroundColor: '#252525',
              color: isListening ? '#1D9E75' : '#fff',
              fontSize: '14px',
              fontFamily: 'DM Sans, sans-serif',
              outline: 'none',
            }}
          />
          {hasSpeechSupport && (
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isThinking}
              title={isListening ? 'Stop listening' : 'Voice input'}
              style={{
                padding: '12px',
                borderRadius: '8px',
                backgroundColor: isListening ? '#1D9E75' : '#2a2a2a',
                color: '#fff',
                border: 'none',
                cursor: isThinking ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: isListening ? 'copilot-pulse 1s ease-in-out infinite' : 'none',
                opacity: isThinking ? 0.5 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            </button>
          )}
          <button
            onClick={() => sendMessage()}
            disabled={isThinking || !input.trim() || isListening}
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              backgroundColor: '#FF5C00',
              color: '#fff',
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              cursor: (isThinking || !input.trim() || isListening) ? 'not-allowed' : 'pointer',
              opacity: (isThinking || !input.trim() || isListening) ? 0.5 : 1,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  )
}
