import { useState } from 'react'
import Head from 'next/head'
import { useQuery } from 'react-query'
import axios from 'axios'
import EscortCard from '../../components/EscortCard'
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon 
} from '@heroicons/react/24/outline'

const EscortsPage = () => {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    city: '',
    minAge: '',
    maxAge: '',
    minPrice: '',
    maxPrice: '',
    hairColor: '',
    ethnicity: '',
    sortBy: 'newest'
  })
  const [showFilters, setShowFilters] = useState(false)

  const { data, isLoading, error } = useQuery(
    ['escorts', filters],
    () => {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value)
      })
      return axios.get(`/api/escorts?${params.toString()}`).then(res => res.data)
    },
    {
      keepPreviousData: true,
      staleTime: 30000, // 30 seconds
    }
  )

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1 // Reset to first page when filters change
    }))
  }

  const cities = [
    'London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 
    'Newcastle', 'Bristol', 'Nottingham', 'Sheffield', 'Brighton'
  ]

  return (
    <>
      <Head>
        <title>Browse Escorts - PrivatLux</title>
        <meta name="description" content="Browse premium escort profiles on PrivatLux. Find your perfect companion with advanced search and filtering." />
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
            Browse Escorts
          </h1>
          <p className="text-lg text-gray-600">
            Discover our carefully selected premium companions
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-outline flex items-center space-x-2"
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span>Filters</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {data?.pagination?.total || 0} escorts found
              </span>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input-field py-2 text-sm"
              >
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="card mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="input-field py-2 text-sm"
                  >
                    <option value="">All Cities</option>
                    {cities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age Range
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={filters.minAge}
                      onChange={(e) => handleFilterChange('minAge', e.target.value)}
                      className="input-field py-2 text-sm"
                      min="18"
                      max="65"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxAge}
                      onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                      className="input-field py-2 text-sm"
                      min="18"
                      max="65"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hair Color
                  </label>
                  <select
                    value={filters.hairColor}
                    onChange={(e) => handleFilterChange('hairColor', e.target.value)}
                    className="input-field py-2 text-sm"
                  >
                    <option value="">Any</option>
                    <option value="blonde">Blonde</option>
                    <option value="brunette">Brunette</option>
                    <option value="black">Black</option>
                    <option value="red">Red</option>
                    <option value="grey">Grey</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ethnicity
                  </label>
                  <select
                    value={filters.ethnicity}
                    onChange={(e) => handleFilterChange('ethnicity', e.target.value)}
                    className="input-field py-2 text-sm"
                  >
                    <option value="">Any</option>
                    <option value="caucasian">Caucasian</option>
                    <option value="asian">Asian</option>
                    <option value="african">African</option>
                    <option value="latina">Latina</option>
                    <option value="mixed">Mixed</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setFilters(prev => ({
                    page: 1,
                    limit: 12,
                    city: '',
                    minAge: '',
                    maxAge: '',
                    minPrice: '',
                    maxPrice: '',
                    hairColor: '',
                    ethnicity: '',
                    sortBy: 'newest'
                  }))}
                  className="btn-secondary mr-3"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="btn-primary"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Error loading escorts. Please try again.</p>
          </div>
        ) : data?.escorts?.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No escorts found matching your criteria.</p>
            <button
              onClick={() => setFilters(prev => ({
                ...prev,
                city: '',
                minAge: '',
                maxAge: '',
                hairColor: '',
                ethnicity: ''
              }))}
              className="btn-primary mt-4"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {data.escorts.map((escort) => (
                <EscortCard key={escort._id} escort={escort} />
              ))}
            </div>

            {/* Pagination */}
            {data?.pagination?.totalPages > 1 && (
              <div className="flex justify-center items-center space-x-4">
                <button
                  onClick={() => handleFilterChange('page', filters.page - 1)}
                  disabled={!data.pagination.hasPrev}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="text-gray-600">
                  Page {data.pagination.page} of {data.pagination.totalPages}
                </span>
                
                <button
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  disabled={!data.pagination.hasNext}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

export default EscortsPage