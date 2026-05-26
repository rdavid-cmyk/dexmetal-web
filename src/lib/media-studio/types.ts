export type MediaStudioFormat = 'youtube' | 'linkedin' | 'short'

export type MediaStudioAssetKind =
  | 'script'
  | 'thumbnail'
  | 'image'
  | 'video'
  | 'remotion'
  | 'hyperframes'
  | 'reference'

export type MediaStudioAssetStatus = 'draft' | 'queued' | 'complete' | 'failed'

export interface MediaStudioClip {
  title: string
  hook: string
  script: string
  cta: string
  format: MediaStudioFormat
  seconds: number
}

export interface MediaStudioPlan {
  id: string
  sourceUrl?: string
  sourceTitle: string
  trafficGoal: string
  positioning: string
  clips: MediaStudioClip[]
  thumbnailPrompts: string[]
  falJobs: {
    label: string
    model: string
    input: Record<string, unknown>
  }[]
  remotionBrief: string
  hyperframesBrief: string
  createdAt: string
}

export interface MediaStudioAsset {
  id: string
  kind: MediaStudioAssetKind
  status: MediaStudioAssetStatus
  title: string
  prompt?: string
  model?: string
  sourceUrl?: string
  outputUrl?: string
  requestId?: string
  notes?: string
  planId?: string
  metadata?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

