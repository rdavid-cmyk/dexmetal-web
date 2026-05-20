'use client'
import { motion, useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'

const stages = [
  'from first submission',
  'through competent authority queries',
  'to PIC approval',
  'to final approval',
]

const tools = [
  { name: 'Knowledge Hub', desc: 'Plain-language Basel guides and country requirements', href: '/knowledge-hub' },
  { name: 'Basel Navigator', desc: 'Generate notification and movement documents', href: '/tools/basel-navigator' },
  { name: 'Basel Checklist', desc: 'Prepare your shipment step by step', href: '/checklist' },
  { name: 'Basel CA API', desc: 'Find the competent authority for any country', href: '/basel-ca-api' },
]

export default function BaselIntro() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [stageIndex, setStageIndex] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let n = 0
    const timer = setInterval(() => {
      n++
      setCount(n)
      if (n >= 20) clearInterval(timer)
    }, 60)
    return () => clearInterval(timer)
  }, [isInView])

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex(i => (i + 1) % stages.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      ref={ref}
      className="relative py-20 px-6 overflow-hidden"
      style={{ background: '#1C1B18' }}
    >
      {/* Grain texture overlay */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'url(/noise.png)', backgroundSize: '200px' }} />

      <div className="relative max-w-5xl mx-auto text-center">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-sm uppercase tracking-widest mb-4"
          style={{ color: '#1D9E75', fontFamily: 'DM Sans' }}
        >
          Basel Compliance Solutions Provider
        </motion.p>

        {/* Counter headline */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl font-bold text-white mb-4"
          style={{ fontFamily: 'Play' }}
        >
          <span style={{
            background: 'linear-gradient(90deg, #1D9E75, #FF5C00)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {count} years
          </span>{' '}
          of Basel operator experience —<br />built into every tool.
        </motion.h2>

        {/* Cycling subline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg mb-14"
          style={{ color: '#9CA3AF', fontFamily: 'DM Sans' }}
        >
          DexMetal guides operators{' '}
          <motion.span
            key={stageIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            style={{ color: '#1D9E75' }}
          >
            {stages[stageIndex]}
          </motion.span>
        </motion.div>

        {/* Tools grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {tools.map((tool, i) => (
            <motion.a
              key={tool.name}
              href={tool.href}
              initial={{ opacity: 0, y: 32 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              whileHover={{ borderColor: '#1D9E75', scale: 1.02 }}
              className="block rounded-xl p-6 text-left border border-gray-700 transition-colors"
              style={{ background: '#252420' }}
            >
              <h3 className="text-white font-bold mb-2"
                style={{ fontFamily: 'Play' }}>
                {tool.name}
              </h3>
              <p className="text-sm text-gray-400"
                style={{ fontFamily: 'DM Sans' }}>
                {tool.desc}
              </p>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <motion.a
          href="/playbook"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="inline-block px-8 py-4 rounded-lg font-bold text-white"
          style={{ background: '#1D9E75', fontFamily: 'DM Sans' }}
          whileHover={{ background: '#FF5C00' }}
        >
          Where are you in your application? → Get the Free Playbook
        </motion.a>

      </div>
    </section>
  )
}
