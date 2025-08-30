'use client'

import { useState, useEffect, useRef } from 'react'

interface AddressSuggestion {
  properties: {
    formatted: string
    place_id: string
  }
  geometry: {
    coordinates: [number, number] // [lng, lat]
  }
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, coords?: { lat: number; lng: number }) => void
  value?: string
  disabled?: boolean
  placeholder?: string
}

export default function AddressAutocomplete({ 
  onAddressSelect, 
  value = '', 
  disabled, 
  placeholder = "Busca tu dirección..." 
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inputValue, setInputValue] = useState(value)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const GEOAPIFY_API_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&apiKey=${GEOAPIFY_API_KEY}&lang=es&limit=5&filter=circle:-60.6973,-31.6107,20000&bias=proximity:-60.6973,-31.6107&countries=ar`
      )
      const data = await response.json()
      setSuggestions(data.features || [])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onAddressSelect(newValue)
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      fetchSuggestions(newValue)
      setShowSuggestions(true)
    }, 300)
  }

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    const coords = {
      lat: suggestion.geometry.coordinates[1],
      lng: suggestion.geometry.coordinates[0]
    }
    setInputValue(suggestion.properties.formatted)
    onAddressSelect(suggestion.properties.formatted, coords)
    setSuggestions([])
    setShowSuggestions(false)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      <input
        id="direccion"
        type="text"
        required
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleInputChange}
        disabled={disabled}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        onFocus={() => inputValue.length >= 3 && setShowSuggestions(true)}
      />
      
      {showSuggestions && (suggestions.length > 0 || loading) && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
          {loading && (
            <div className="px-4 py-2 text-sm text-gray-500 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-2"></div>
              Buscando direcciones...
            </div>
          )}
          
          {!loading && suggestions.map((suggestion, index) => (
            <button
              key={suggestion.properties.place_id || index}
              type="button"
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="flex-1">{suggestion.properties.formatted}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}