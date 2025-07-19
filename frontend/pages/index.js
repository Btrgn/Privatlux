import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { 
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { useQuery } from 'react-query'
import axios from 'axios'

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCity, setSelectedCity] = useState('')

  // Fetch featured escorts
  const { data: featuredEscorts, isLoading } = useQuery(
    'featured-escorts',
    () => axios.get('/api/escorts/featured/list?limit=6').then(res => res.data),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const cities = [
    'London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool', 
    'Newcastle', 'Bristol', 'Nottingham', 'Sheffield', 'Brighton'
  ]

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Verified Profiles',
      description: 'All our escorts go through a strict verification process to ensure authenticity and safety.'
    },
    {
      icon: UserGroupIcon,
      title: 'Premium Selection',
      description: 'Carefully curated selection of high-class escorts and professional massage therapists.'
    },
    {
      icon: StarIcon,
      title: 'Reviewed & Rated',
      description: 'Real reviews from verified clients help you make informed decisions.'
    }
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.append('search', searchQuery)
    if (selectedCity) params.append('city', selectedCity)
    
    window.location.href = `/escorts?${params.toString()}`
  }

  return (
    <>
      <Head>
        <title>PrivatLux - Premium Escort & Massage Services in the UK</title>
        <meta 
          name="description" 
          content="Discover the UK's premier platform for high-class escort and massage services. Verified profiles, secure booking, and exceptional experiences." 
        />
        <meta name="keywords" content="escort services, massage therapy, UK escorts, premium companions, luxury entertainment" />
      </Head>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 hero-pattern">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 text-shadow-lg">
              Welcome to <span className="text-gold-400">PrivatLux</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-3xl mx-auto text-shadow">
              The UK's premier platform for high-class escort and massage services. 
              Discover exceptional companions and professional wellness experiences.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                      What are you looking for?
                    </label>
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        id="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="e.g., blonde, massage, outcall..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <select
                      id="city"
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">All Cities</option>
                      {cities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-lg"
                  >
                    Search Escorts
                  </button>
                  <Link
                    href="/massages"
                    className="flex-1 bg-gold-600 hover:bg-gold-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-lg text-center"
                  >
                    Find Massages
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Escorts Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Featured Companions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our carefully selected premium companions, each offering unique experiences 
              and exceptional service standards.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-64 bg-gray-300 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEscorts?.escorts?.map((escort) => (
                <Link
                  key={escort._id}
                  href={`/escorts/${escort._id}`}
                  className="group card-hover cursor-pointer"
                >
                  <div className="relative h-64 mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={escort.images?.[0]?.url || '/placeholder-escort.jpg'}
                      alt={escort.stageName}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {escort.stageName}
                  </h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">{escort.location.city}</span>
                    <span className="mx-2">•</span>
                    <span className="text-sm">{escort.age} years</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">
                        {escort.reviews.average || 'New'}
                      </span>
                    </div>
                    <span className="text-lg font-semibold text-primary-600">
                      £{escort.pricing.hourly}/hour
                    </span>
                  </div>
                </Link>
              )) || []}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/escorts"
              className="btn-primary text-lg px-8 py-3"
            >
              View All Escorts
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Why Choose PrivatLux?
            </h2>
            <p className="text-lg text-gray-600">
              Experience the difference with our premium platform and exceptional service standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
            Ready to Join PrivatLux?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Whether you're seeking companionship or offering premium services, 
            join our exclusive community today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register?role=client"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Join as Client
            </Link>
            <Link
              href="/register?role=escort"
              className="bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
            >
              Become an Escort
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

export default HomePage