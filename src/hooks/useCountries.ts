import { useState, useEffect, useMemo } from 'react'

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

let cachedCountries: Country[] | null = null
let cachedNonParties: Country[] | null = null

export function useCountries(): UseCountriesResult {
  const [countries, setCountries] = useState<Country[]>(cachedCountries || [])
  const [nonParties, setNonParties] = useState<Country[]>(cachedNonParties || [])
  const [loading, setLoading] = useState(!cachedCountries)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (cachedCountries && cachedNonParties) {
      setCountries(cachedCountries)
      setNonParties(cachedNonParties)
      return
    }

    async function fetchCountries() {
      try {
        const res = await fetch('/api/countries', { 
          cache: 'no-store' 
        })
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        cachedCountries = data.parties
        cachedNonParties = data.nonParties
        setCountries(data.parties)
        setNonParties(data.nonParties)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCountries()
  }, [])

  return { countries, parties: countries, nonParties, loading, error }
}

export function useCountriesSearchable() {
  const { countries, parties, nonParties, loading, error } = useCountries()
  
  const sortedParties = useMemo(() => {
    return [...countries].sort((a, b) => a.name.localeCompare(b.name))
  }, [countries])

  return { 
    countries, 
    sortedParties, 
    parties, 
    nonParties, 
    loading, 
    error 
  }
}
