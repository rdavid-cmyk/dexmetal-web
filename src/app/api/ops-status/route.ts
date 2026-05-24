import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const PM2_BIN = '/usr/bin/pm2'
const QUEUE_PATH = '/home/hermesagent/dexmetal-marketing/orchestration/queue.json'
const LOG_PATH = '/home/hermesagent/dexmetal-marketing/logs/orchestration.log'

type QueueTask = {
  title?: string
  status?: string
  assigned_to?: string
  completed_at?: string | null
  created_at?: string
  id?: string
  [key: string]: unknown
}

type Pm2Process = {
  name?: string
  monit?: { memory?: number }
  pm2_env?: {
    status?: string
    pm_uptime?: number
    restart_time?: number
  }
}

function readJsonFile(path: string) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'))
  } catch {
    return { tasks: [] }
  }
}

function readLogTail(path: string, lines: number) {
  try {
    const content = readFileSync(path, 'utf8').trimEnd()
    return content ? content.split('\n').slice(-lines) : []
  } catch {
    return []
  }
}

function formatUptime(startedAt?: number) {
  if (!startedAt) return 'n/a'
  const seconds = Math.max(0, Math.floor((Date.now() - startedAt) / 1000))
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) return `${days}d ${hours}h`
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

function getProcesses() {
  try {
    const raw = execSync(`${PM2_BIN} jlist 2>/dev/null`, { encoding: 'utf8' })
    const processes = JSON.parse(raw || '[]') as Pm2Process[]

    return processes.map((proc) => ({
      name: proc.name || 'unknown',
      status: proc.pm2_env?.status || 'unknown',
      uptime: formatUptime(proc.pm2_env?.pm_uptime),
      memory: proc.monit?.memory || 0,
      restarts: proc.pm2_env?.restart_time || 0,
    }))
  } catch {
    return []
  }
}

function getTasks(): QueueTask[] {
  const queueData = readJsonFile(QUEUE_PATH)
  return Array.isArray(queueData.tasks) ? (queueData.tasks as QueueTask[]) : []
}

function buildResponse() {
  const tasks = getTasks()
  const count = (status: string) => tasks.filter((task) => task.status === status).length

  return {
    timestamp: new Date().toISOString(),
    processes: getProcesses(),
    queue: {
      total: tasks.length,
      pending: count('pending'),
      in_progress: count('in_progress'),
      complete: count('complete'),
      failed: count('failed'),
      recent: tasks.slice(-5).reverse(),
    },
    log: readLogTail(LOG_PATH, 20),
  }
}

export async function GET() {
  try {
    return NextResponse.json(buildResponse())
  } catch {
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      processes: [],
      queue: {
        total: 0,
        pending: 0,
        in_progress: 0,
        complete: 0,
        failed: 0,
        recent: [],
      },
      log: [],
    })
  }
}
