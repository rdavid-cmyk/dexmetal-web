'use client'

import { usePathname } from 'next/navigation'

import { DexMetalAgent } from '@/components/DexMetalAgent'

export function DexMetalAgentPlacement() {
  return usePathname() === '/' ? null : <DexMetalAgent />
}
