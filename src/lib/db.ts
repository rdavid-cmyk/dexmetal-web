import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.PGHOST || '127.0.0.1',
  port: parseInt(process.env.PGPORT || '5432'),
  user: process.env.PGUSER || 'dexmetal',
  password: process.env.PGPASSWORD || 'dexmetal2026',
  database: process.env.PGDATABASE || 'dexmetalweb',
})

export const query = (text: string, params?: any[]) => pool.query(text, params)
export const getClient = () => pool.connect()

export default { query, getClient }
