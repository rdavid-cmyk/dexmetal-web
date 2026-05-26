import crypto from 'crypto'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import type { MediaStudioAsset } from './types'

interface MediaStudioStore {
  assets: MediaStudioAsset[]
}

function getStoreDir() {
  return process.env.MEDIA_STUDIO_DATA_DIR || path.join(process.cwd(), 'data', 'media-studio')
}

function getStorePath() {
  return path.join(getStoreDir(), 'assets.json')
}

async function readStore(): Promise<MediaStudioStore> {
  try {
    const raw = await readFile(getStorePath(), 'utf8')
    return JSON.parse(raw) as MediaStudioStore
  } catch (error: any) {
    if (error?.code === 'ENOENT') return { assets: [] }
    throw error
  }
}

async function writeStore(store: MediaStudioStore) {
  await mkdir(getStoreDir(), { recursive: true })
  await writeFile(getStorePath(), `${JSON.stringify(store, null, 2)}\n`, 'utf8')
}

export async function listMediaStudioAssets() {
  const store = await readStore()
  return store.assets.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function createMediaStudioAsset(
  input: Omit<Partial<MediaStudioAsset>, 'id' | 'createdAt' | 'updatedAt'> & {
    title: string
    kind: MediaStudioAsset['kind']
  },
) {
  const store = await readStore()
  const now = new Date().toISOString()
  const asset: MediaStudioAsset = {
    id: crypto.randomUUID(),
    status: 'draft',
    ...input,
    createdAt: now,
    updatedAt: now,
  }

  store.assets.unshift(asset)
  await writeStore(store)
  return asset
}

export async function updateMediaStudioAsset(
  id: string,
  updates: Partial<Omit<MediaStudioAsset, 'id' | 'createdAt'>>,
) {
  const store = await readStore()
  const index = store.assets.findIndex((asset) => asset.id === id)

  if (index === -1) return null

  store.assets[index] = {
    ...store.assets[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }

  await writeStore(store)
  return store.assets[index]
}
