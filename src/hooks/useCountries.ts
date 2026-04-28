import { useState, useEffect } from 'react'

interface Country {
  code: string
  name: string
  region?: string
  isParty?: boolean
  reason?: string
}

interface UseCountriesResult {
  countries: Country[]
  parties: Country[]
  nonParties: Country[]
  loading: boolean
  error: string | null
}

export function useCountries(): UseCountriesResult {
  const [countries, setCountries] = useState<Country[]>([])
  const [nonParties, setNonParties] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCountries() {
      try {
        const res = await fetch('/api/countries', { 
          cache: 'no-store' 
        })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        setCountries(data.parties || [])
        setNonParties(data.nonParties || [])
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCountries()
  }, [])

  return { 
    countries: [...countries, ...nonParties], 
    parties: countries, 
    nonParties, 
    loading, 
    error 
  }
}

export function useCountriesSearchable() {
  const { countries, parties, nonParties, loading, error } = useCountries()
  
  return { 
    countries, 
    parties, 
    nonParties, 
    loading, 
    error 
  }
}
