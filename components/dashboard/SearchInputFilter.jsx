"use client"

import { Search } from 'lucide-react'
import React, { useState, useEffect } from 'react'

/**
 * SearchInputFilter Component
 * Advanced filter panel for inventory search
 * 
 * @param {Object} filters - Current filter values
 * @param {Function} onFilterChange - Callback when a filter changes
 * @param {Function} onClearAll - Callback to clear all filters
 * @param {Object} facets - Available filter options from search results
 */
export default function SearchInputFilter({ filters, onFilterChange, onClearAll, onApplyFilters, facets }) {
  const [categories, setCategories] = useState([])
  const [warehouses, setWarehouses] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch filter options on mount
  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        setLoading(true)
        
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
        
        // Fetch categories, warehouses, and brands in parallel
        const [categoriesRes, warehousesRes, brandsRes] = await Promise.all([
          fetch(`${baseUrl}/api/categories`),
          fetch(`${baseUrl}/api/warehouse`),
          fetch(`${baseUrl}/api/brands`)
        ])

        const [categoriesData, warehousesData, brandsData] = await Promise.all([
          categoriesRes.json(),
          warehousesRes.json(),
          brandsRes.json()
        ])

        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
        setWarehouses(Array.isArray(warehousesData) ? warehousesData : [])
        setBrands(Array.isArray(brandsData) ? brandsData : [])
      } catch (error) {
        console.error('Error fetching filter options:', error)
        // Set empty arrays on error to prevent crashes
        setCategories([])
        setWarehouses([])
        setBrands([])
      } finally {
        setLoading(false)
      }
    }

    fetchFilterOptions()
  }, [])

  return (
    <div className="absolute z-50 w-full md:w-96 mt-2 bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Search Filters
        </h3>
        <div className="flex items-center gap-2">
          <button
            onClick={onApplyFilters}
            className="text-sm text-blue-600 px-3 py-1.5  font-medium   
                       transition-colors flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            Search
          </button>
          <button
            onClick={onClearAll}
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 
                     dark:hover:text-white hover:underline"
          >
            Clear all
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading filters...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => onFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                       rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.title}
                </option>
              ))}
            </select>
            {facets?.categories.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {facets.categories.length} categories found
              </p>
            )}
          </div>

          {/* Warehouse Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Warehouse
            </label>
            <select
              value={filters.warehouse}
              onChange={(e) => onFilterChange('warehouse', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                       rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Warehouses</option>
              {warehouses.map(wh => (
                <option key={wh.id} value={wh.id}>
                  {wh.title} {wh.location && `(${wh.location})`}
                </option>
              ))}
            </select>
            {facets?.warehouses.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {facets.warehouses.length} warehouses found
              </p>
            )}
          </div>

          {/* Brand Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Brand
            </label>
            <select
              value={filters.brand}
              onChange={(e) => onFilterChange('brand', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                       rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Brands</option>
              {brands.map(br => (
                <option key={br.id} value={br.id}>
                  {br.title}
                </option>
              ))}
            </select>
            {facets?.brands.length > 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {facets.brands.length} brands found
              </p>
            )}
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Price Range
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => onFilterChange('minPrice', e.target.value)}
                className="w-1/2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                         rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => onFilterChange('maxPrice', e.target.value)}
                className="w-1/2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 
                         rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {facets?.priceRange && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Available: ${facets.priceRange.min?.toFixed(2)} - ${facets.priceRange.max?.toFixed(2)}
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

          {/* Stock Filters (Checkboxes) */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => onFilterChange('inStock', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
                         focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 
                         focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                In Stock Only
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.lowStock}
                onChange={(e) => onFilterChange('lowStock', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded 
                         focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 
                         focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">
                Low Stock Items (at/below reorder point)
              </span>
            </label>
          </div>

          {/* Info Box */}
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 
                        dark:border-blue-800 rounded-md">
            <p className="text-xs text-blue-800 dark:text-blue-300">
              💡 <strong>Tip:</strong> Combine multiple filters to narrow down your search results
            </p>
          </div>
        </div>
      )}
    </div>
  )
}