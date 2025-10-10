"use client"

import { Search, X, Loader2 , Filter } from 'lucide-react'
import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import SearchInputFilter from './SearchInputFilter'

export default function SearchInput() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [facets, setFacets] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  
  // Filter states
  const [filters, setFilters] = useState({
    category: '',
    warehouse: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    lowStock: false
  })

  const searchRef = useRef(null)
  const router = useRouter()
  const shouldSearchRef = useRef(false) // Track if we should search after filter apply

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
        setShowFilters(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // When filters open, close results
  useEffect(() => {
    if (showFilters) {
      setIsOpen(false)
    }
  }, [showFilters])

  // When results open, close filters
  useEffect(() => {
    if (isOpen) {
      setShowFilters(false)
    }
  }, [isOpen])

  // Debounced search - only for query changes, not filter changes
  useEffect(() => {
    // Skip this effect if we're applying filters via the button
    if (shouldSearchRef.current) {
      return
    }

    const delaySearch = setTimeout(() => {
      if (query.trim()) {
        performSearch(query, true) // true = auto-open results when typing
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(delaySearch)
  }, [query]) // Removed filters from dependency array

  async function performSearch(searchTerm, shouldOpenResults = true) {
    setIsLoading(true)
    try {
      // Build query params with filters
      const params = new URLSearchParams({
        q: searchTerm || '',
        size: '10'
      })

      // Add filters if they have values
      if (filters.category) params.append('category', filters.category)
      if (filters.warehouse) params.append('warehouse', filters.warehouse)
      if (filters.brand) params.append('brand', filters.brand)
      if (filters.minPrice) params.append('minPrice', filters.minPrice)
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
      if (filters.inStock) params.append('inStock', 'true')
      if (filters.lowStock) params.append('lowStock', 'true')

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()
      
      if (data.success) {
        setResults(data.results)
        setFacets(data.facets)
        if (shouldOpenResults) {
          setIsOpen(true)
        }
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
      shouldSearchRef.current = false // Reset flag
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/side-bar/inventory/items?search=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  function handleClear() {
    setQuery('')
    setResults([])
    setIsOpen(false)
    setFilters({
      category: '',
      warehouse: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      lowStock: false
    })
  }

  function handleResultClick(itemId) {
    router.push(`/side-bar/inventory/items/update/${itemId}`)
    setIsOpen(false)
    setQuery('')
  }

  function handleFilterChange(key, value) {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Function to apply filters and trigger search
  async function handleApplyFilters() {
    shouldSearchRef.current = true // Set flag to skip the useEffect
    setShowFilters(false)
    
    // Perform search with current query and filters
    await performSearch(query || '', true) // true = open results after search
  }

  // Count active filters
  const activeFilterCount = Object.entries(filters).filter(([key, value]) => {
    if (typeof value === 'boolean') return value === true
    return value !== '' && value !== null
  }).length

  return (
    <div className='hidden md:block relative' ref={searchRef}>
      <form onSubmit={handleSubmit}> 
        <label htmlFor="simple-search" className="sr-only">Search</label>
        <div className="relative w-full">
          {/* Search Icon */}
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            {isLoading ? (
              <Loader2 className='w-4 h-4 text-gray-500 dark:text-gray-400 animate-spin'/>
            ) : (
              <Search className='w-4 h-4 text-gray-500 dark:text-gray-400'/>
            )}
          </div>

          {/* Input Field */}
          <input 
            type="text" 
            id="simple-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="bg-gray-50 border 
            border-gray-300 
            text-gray-900 
            text-sm 
            rounded-lg 
            focus:ring-blue-500 
            focus:border-blue-500 
            block w-full pl-10 pr-10 px-2 py-1.5  
            dark:bg-gray-700 dark:border-gray-600 
            dark:placeholder-gray-400 dark:text-white 
            dark:focus:ring-blue-500 dark:focus:border-blue-500" 
            placeholder="Search items..." 
          />

          {/* Filter & Clear Buttons */}
          <div className="absolute inset-y-0 end-0 flex items-center gap-1 pe-2">
            {/* Filter Button */}
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600 relative transition-colors ${
                showFilters ? 'bg-gray-200 dark:bg-gray-600' : ''
              }`}
              title="Filters"
            >
              <Filter className='w-4 h-4 text-gray-500 dark:text-gray-400'/>
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white 
                               text-xs rounded-full flex items-center justify-center font-medium">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {/* Clear Button */}
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Clear"
              >
                <X className='w-4 h-4 text-gray-500 dark:text-gray-400'/>
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Filter Panel */}
      {showFilters && (
        <SearchInputFilter 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearAll={handleClear}
          onApplyFilters={handleApplyFilters}
          facets={facets}
        />
      )}

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full md:w-96 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Found {results.length} items
              {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)`}
            </p>
          </div>

          <div className="py-2">
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleResultClick(item.id)}
                className="w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-3 text-left transition-colors"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-10 h-10 object-cover rounded border"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center border">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                    <span>SKU: {item.sku}</span>
                    <span>•</span>
                    <span className={item.quantity > 0 ? 'text-green-600' : 'text-red-600'}>
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  ${item.sellingPrice}
                </div>
              </button>
            ))}
          </div>

          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSubmit}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              View all results for "{query}"
            </button>
          </div>

          {facets && (
            <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              <div className="flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-400">
                <span>Categories: {facets.categories.length}</span>
                <span>•</span>
                <span>Brands: {facets.brands.length}</span>
                <span>•</span>
                <span>Price: ${facets.priceRange.min} - ${facets.priceRange.max}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* No results now suggests clearing filters */}
      {isOpen && query && results.length === 0 && !isLoading && (
        <div className="absolute z-50 w-full md:w-96 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            No items found for "{query}"
          </p>
          {activeFilterCount > 0 && (
            <button
              onClick={handleClear}
              className="mt-2 w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear filters to see more results
            </button>
          )}
        </div>
      )}
    </div>
  )
}