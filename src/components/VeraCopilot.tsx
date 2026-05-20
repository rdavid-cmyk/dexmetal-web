'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
  source?: 'faq' | 'groq'
}

const welcomeMessage =
  "Hi, I'm Vera. Welcome to DexMetal. I can help you with Basel Convention compliance, waste codes, and transboundary notification questions."

function VeraPortrait({ size = 'large' }: { size?: 'large' | 'small' }) {
  const isLarge = size === 'large'
  return (
    <div
      style={{
        width: isLarge ? '132px' : '42px',
        height: isLarge ? '168px' : '42px',
        borderRadius: isLarge ? '28px' : '50%',
        overflow: 'hidden',
        position: 'relative',
        background: '#151411',
      }}
    >
      <Image
        unoptimized
        src="/images/vera.png"
        alt="Vera"
        width={isLarge ? 300 : 110}
        height={isLarge ? 375 : 110}
        style={{
          position: 'absolute',
          width: isLarge ? '330%' : '300%',
          height: 'auto',
          left: isLarge ? '-115%' : '-100%',
          top: isLarge ? '-12%' : '-18%',
          maxWidth: 'none',
        }}
      />
    </div>
  )
}

export function VeraCopilot() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [hasSpeechSupport, setHasSpeechSupport] = useState(false)
  const [hasSpeechSynthesis, setHasSpeechSynthesis] = useState(false)
  const [voiceNotice, setVoiceNotice] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)
  const voiceEnabledRef = useRef(true)

  useEffect(() => {
    const w = window as any
    setHasSpeechSupport(Boolean(w.SpeechRecognition || w.webkitSpeechRecognition))
    setHasSpeechSynthesis('speechSynthesis' in window)

    return () => {
      recognitionRef.current?.stop?.()
      window.speechSynthesis?.cancel()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isThinking])

  useEffect(() => {
    voiceEnabledRef.current = voiceEnabled
    if (!voiceEnabled) {
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
    }
  }, [voiceEnabled])

  const speak = (text: string) => {
    if (!voiceEnabledRef.current || !hasSpeechSynthesis) return

    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.86
    utterance.pitch = 1.16
    utterance.volume = 1
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    const findVoice = () => {
      const allVoices = window.speechSynthesis.getVoices()
      if (!allVoices.length) return false
      const englishVoices = allVoices.filter(voice => voice.lang.toLowerCase().startsWith('en'))
      const preferredVoice =
        englishVoices.find(voice => /google us english/i.test(voice.name)) ||
        englishVoices.find(voice => /samantha|victoria|karen|zira|jenny|aria|ava|zoe|catherine/i.test(voice.name)) ||
        englishVoices.find(voice => /enhanced|premium|neural|natural/i.test(voice.name)) ||
        englishVoices[0]
      if (preferredVoice) utterance.voice = preferredVoice
      return true
    }
    const voices2 = window.speechSynthesis.getVoices()
    if (voices2.length === 0) {
      window.speechSynthesis.addEventListener('voiceschanged', () => { findVoice(); window.speechSynthesis.speak(utterance) }, { once: true })
    } else {
      findVoice()
      window.speechSynthesis.speak(utterance)
    }
  }

  const openVera = (speakGreeting = true) => {
    setIsOpen(true)
    setVoiceNotice('')
    if (messages.length === 0) {
      setMessages([{ role: 'assistant', content: welcomeMessage, source: 'faq' }])
    }
    if (speakGreeting) speak(welcomeMessage)
  }

  const closeVera = () => {
    setIsOpen(false)
    stopListening()
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }

  const startListening = () => {
    try {
      const w = window as any
      const SR = w.SpeechRecognition || w.webkitSpeechRecognition
      if (!SR) {
        setVoiceNotice('Speech recognition is not available in this browser.')
        return
      }

      openVera(false)
      window.speechSynthesis?.cancel()
      setIsSpeaking(false)
      setVoiceNotice('Listening...')

      const recognition = new SR()
      recognitionRef.current = recognition
      recognition.lang = 'en-US'
      recognition.interimResults = false
      recognition.continuous = false
      recognition.maxAlternatives = 1

      recognition.onresult = (event: any) => {
        const transcript = event.results?.[0]?.[0]?.transcript?.trim()
        setIsListening(false)
        setVoiceNotice('')
        if (transcript) {
          setInput(transcript)
          sendMessage(transcript, true)
        }
      }

      recognition.onerror = (event: any) => {
        setIsListening(false)
        const error = event?.error
        if (error === 'not-allowed' || error === 'service-not-allowed') {
          setVoiceNotice('Chrome is blocking the mic. Use the site controls in the address bar to allow microphone access for dexmetal.com.')
        } else {
          setVoiceNotice('I could not hear that clearly. Tap Mic and try again.')
        }
      }

      recognition.onend = () => {
        setIsListening(false)
        setVoiceNotice(current => (current === 'Listening...' ? '' : current))
      }

      recognition.start()
      setIsListening(true)
    } catch {
      setIsListening(false)
      setVoiceNotice('Mic startup failed. Check browser microphone permission for dexmetal.com and try again.')
    }
  }

  const stopListening = () => {
    recognitionRef.current?.stop?.()
    setIsListening(false)
    setVoiceNotice('')
  }

  const sendMessage = async (overrideInput?: string, fromVoice = false) => {
    const text = (overrideInput ?? input).trim()
    if (!text || isThinking) return

    setInput('')
    setVoiceNotice(fromVoice ? 'Vera heard you.' : '')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsThinking(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })
      const data = await res.json()
      const reply = data.answer || data.reply || "Sorry, I couldn't process that. Try rephrasing."

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        source: data.source,
      }])
      speak(reply)
    } catch {
      const fallback = 'Connection error. Please try again.'
      setMessages(prev => [...prev, { role: 'assistant', content: fallback }])
      speak(fallback)
    } finally {
      setIsThinking(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes vera-breathe {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-4px) scale(1.015); }
        }

        @keyframes vera-speak {
          0%, 100% { box-shadow: 0 0 0 0 rgba(29, 158, 117, 0.42), 0 16px 40px rgba(0,0,0,0.42); }
          50% { box-shadow: 0 0 0 12px rgba(29, 158, 117, 0), 0 16px 40px rgba(0,0,0,0.42); }
        }

        @media (max-width: 720px) {
          .vera-host {
            right: 12px !important;
            bottom: 12px !important;
            width: min(92vw, 340px) !important;
          }

          .vera-welcome {
            max-width: 210px !important;
          }

          .vera-panel {
            right: 12px !important;
            left: 12px !important;
            bottom: 168px !important;
            width: auto !important;
            max-height: calc(100vh - 190px) !important;
          }

          .vera-figure-wrap {
            width: 104px !important;
            height: 132px !important;
          }
        }
      `}</style>

      <div
        className="vera-host"
        style={{
          position: 'fixed',
          right: '24px',
          bottom: '24px',
          zIndex: 9998,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          gap: '12px',
          width: '420px',
          maxWidth: 'calc(100vw - 48px)',
          pointerEvents: 'none',
        }}
      >
        {!isOpen && (
          <button
            className="vera-welcome"
            onClick={() => openVera(true)}
            style={{
              pointerEvents: 'auto',
              marginBottom: '18px',
              maxWidth: '260px',
              padding: '14px 16px',
              border: '1px solid rgba(29, 158, 117, 0.32)',
              borderRadius: '16px 16px 4px 16px',
              background: 'rgba(28, 27, 24, 0.94)',
              color: '#fff',
              boxShadow: '0 12px 32px rgba(0,0,0,0.36)',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '13px',
              lineHeight: 1.45,
              backdropFilter: 'blur(12px)',
            }}
            aria-label="Open Vera welcome"
          >
            <strong style={{ display: 'block', marginBottom: '4px', color: '#1D9E75', fontSize: '14px' }}>
              Hi, I&apos;m Vera.
            </strong>
            Welcome to DexMetal. Ask me about Basel compliance, waste codes, or notifications.
            <span style={{ display: 'block', marginTop: '8px', color: '#FF8A3D', fontWeight: 700 }}>
              Talk to Vera
            </span>
          </button>
        )}

        <button
          onClick={() => (isOpen ? closeVera() : openVera(true))}
          style={{
            pointerEvents: 'auto',
            border: 'none',
            background: 'transparent',
            padding: 0,
            cursor: 'pointer',
            position: 'relative',
          }}
          aria-label={isOpen ? 'Close Vera' : 'Open Vera'}
        >
          <div
            className="vera-figure-wrap"
            style={{
              width: '132px',
              height: '168px',
              borderRadius: '28px',
              padding: '1px',
              background: 'linear-gradient(180deg, rgba(29,158,117,0.72), rgba(255,92,0,0.45))',
              boxShadow: '0 16px 40px rgba(0,0,0,0.42)',
              animation: isSpeaking
                ? 'vera-speak 1.1s ease-in-out infinite'
                : 'vera-breathe 4s ease-in-out infinite',
            }}
          >
            <VeraPortrait />
          </div>
          {isListening && (
            <span
              style={{
                position: 'absolute',
                left: '50%',
                bottom: '-8px',
                transform: 'translateX(-50%)',
                background: '#1D9E75',
                color: '#fff',
                borderRadius: '999px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              Listening
            </span>
          )}
        </button>
      </div>

      {isOpen && (
        <div
          className="vera-panel"
          style={{
            position: 'fixed',
            bottom: '210px',
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
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #2a2a28',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#1C1B18',
          }}>
            <VeraPortrait size="small" />
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '14px', fontFamily: 'Play, sans-serif' }}>
                Vera
              </div>
              <div style={{ color: '#1D9E75', fontSize: '12px' }}>DexMetal Basel guide</div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px', alignItems: 'center' }}>
              {hasSpeechSynthesis && (
                <button
                  onClick={() => setVoiceEnabled(v => !v)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: voiceEnabled ? '#1D9E75' : '#777',
                    cursor: 'pointer',
                    fontSize: '12px',
                    padding: '4px 6px',
                    fontWeight: 700,
                  }}
                  title={voiceEnabled ? 'Voice on' : 'Voice off'}
                >
                  {voiceEnabled ? 'Voice on' : 'Voice off'}
                </button>
              )}
              <button
                onClick={closeVera}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: '18px',
                  lineHeight: '1',
                  padding: '4px',
                }}
                aria-label="Close Vera"
              >
                x
              </button>
            </div>
          </div>

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                style={{
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '86%',
                  backgroundColor: message.role === 'user' ? '#FF5C00' : '#2a2a28',
                  color: '#fff',
                  padding: '10px 14px',
                  borderRadius: message.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  fontSize: '13px',
                  lineHeight: '1.5',
                }}
              >
                {message.content}
                {message.source && (
                  <div style={{ fontSize: '10px', color: '#aaa', marginTop: '4px' }}>
                    {message.source === 'faq' ? 'Basel KB' : 'AI'}
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
              }}>
                Thinking...
              </div>
            )}
            {voiceNotice && (
              <div style={{ color: '#aaa', fontSize: '12px', textAlign: 'center' }}>
                {voiceNotice}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={{
            padding: '12px',
            borderTop: '1px solid #2a2a28',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            <input
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? 'Listening...' : 'Ask Vera...'}
              disabled={isThinking || isListening}
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
            {hasSpeechSupport && (
              <button
                onClick={isListening ? stopListening : startListening}
                disabled={isThinking}
                style={{
                  padding: '10px 12px',
                  borderRadius: '8px',
                  backgroundColor: isListening ? '#1D9E75' : '#2a2a28',
                  color: '#fff',
                  border: 'none',
                  cursor: isThinking ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 700,
                  opacity: isThinking ? 0.5 : 1,
                }}
                aria-label={isListening ? 'Stop listening' : 'Talk to Vera'}
              >
                Mic
              </button>
            )}
            <button
              onClick={() => sendMessage()}
              disabled={isThinking || !input.trim() || isListening}
              style={{
                padding: '10px 16px',
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
      )}
    </>
  )
}
