import Link from 'next/link'
import Image from 'next/image'
import { 
  MapPinIcon, 
  StarIcon, 
  HeartIcon,
  ClockIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const EscortCard = ({ escort, isFavorite = false, onFavoriteToggle }) => {
  const [isFav, setIsFav] = useState(isFavorite)
  const [loading, setLoading] = useState(false)
  const { isAuthenticated } = useAuth()

  const handleFavoriteToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error('Please login to add favorites')
      return
    }

    setLoading(true)
    try {
      if (isFav) {
        await axios.delete(`/api/escorts/${escort._id}/favorite`)
        setIsFav(false)
        toast.success('Removed from favorites')
      } else {
        await axios.post(`/api/escorts/${escort._id}/favorite`)
        setIsFav(true)
        toast.success('Added to favorites')
      }
      
      if (onFavoriteToggle) {
        onFavoriteToggle(escort._id, !isFav)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const getOnlineStatus = () => {
    const lastOnline = new Date(escort.lastOnline)
    const now = new Date()
    const diffInHours = (now - lastOnline) / (1000 * 60 * 60)
    
    if (diffInHours < 1) return 'online'
    if (diffInHours < 24) return 'recently'
    return 'offline'
  }

  const onlineStatus = getOnlineStatus()

  return (
    <Link href={`/escorts/${escort._id}`} className="group block">
      <div className="card-hover relative overflow-hidden">
        {/* Image Section */}
        <div className="relative h-64 mb-4 overflow-hidden rounded-lg">
          <Image
            src={escort.images?.[0]?.url || '/placeholder-escort.jpg'}
            alt={escort.stageName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay Elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          
          {/* Status Badge */}
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              onlineStatus === 'online' 
                ? 'bg-green-500 text-white' 
                : onlineStatus === 'recently'
                ? 'bg-yellow-500 text-white'
                : 'bg-gray-500 text-white'
            }`}>
              {onlineStatus === 'online' ? 'Online' : 
               onlineStatus === 'recently' ? 'Recently' : 'Offline'}
            </span>
          </div>

          {/* Featured Badge */}
          {escort.featured && (
            <div className="absolute top-2 right-12">
              <span className="bg-gold-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                Featured
              </span>
            </div>
          )}

          {/* Verified Badge */}
          {escort.verification?.isVerified && (
            <div className="absolute bottom-2 left-2">
              <div className="flex items-center bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <CheckBadgeIcon className="h-3 w-3 text-blue-500 mr-1" />
                <span className="text-xs font-medium text-gray-800">Verified</span>
              </div>
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteToggle}
            disabled={loading}
            className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors duration-200"
          >
            {isFav ? (
              <HeartIconSolid className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
            )}
          </button>
        </div>

        {/* Content Section */}
        <div className="space-y-3">
          {/* Name and Age */}
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {escort.stageName}
            </h3>
            <span className="text-sm text-gray-500 font-medium">
              {escort.age} years
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-1 flex-shrink-0" />
            <span className="text-sm truncate">
              {escort.location.area ? `${escort.location.area}, ` : ''}{escort.location.city}
            </span>
          </div>

          {/* Physical Attributes */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {escort.height && (
              <span>{escort.height}</span>
            )}
            {escort.hairColor && (
              <span className="capitalize">{escort.hairColor}</span>
            )}
            {escort.ethnicity && (
              <span className="capitalize">{escort.ethnicity}</span>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center space-x-3 text-sm">
            {escort.availability.incall && (
              <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                Incall
              </span>
            )}
            {escort.availability.outcall && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                Outcall
              </span>
            )}
          </div>

          {/* Reviews and Price */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex items-center">
              <div className="flex items-center">
                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">
                  {escort.reviews.average ? escort.reviews.average.toFixed(1) : 'New'}
                </span>
                {escort.reviews.count > 0 && (
                  <span className="ml-1 text-xs text-gray-500">
                    ({escort.reviews.count})
                  </span>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-lg font-semibold text-primary-600">
                £{escort.pricing.hourly}
              </div>
              <div className="text-xs text-gray-500">per hour</div>
            </div>
          </div>

          {/* Services Preview */}
          {escort.services && escort.services.length > 0 && (
            <div className="pt-2">
              <div className="flex flex-wrap gap-1">
                {escort.services.slice(0, 3).map((service, index) => (
                  <span 
                    key={index}
                    className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                  >
                    {service.name}
                  </span>
                ))}
                {escort.services.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{escort.services.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default EscortCard