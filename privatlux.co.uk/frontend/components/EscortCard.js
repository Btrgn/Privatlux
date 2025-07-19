import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Eye, Heart, Crown, Shield, Clock } from 'lucide-react';

export default function EscortCard({ escort, featured = false }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const mainImage = escort.images?.find(img => img.isMain)?.url || 
                   escort.images?.[0]?.url || 
                   '/images/placeholder-avatar.jpg';

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setFavoriteLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login
        window.location.href = '/login';
        return;
      }

      const response = await fetch(`/api/escorts/${escort._id}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatRate = (rates) => {
    if (!rates) return null;
    const hourRate = rates['1hour'];
    if (hourRate) {
      return `£${hourRate}/hr`;
    }
    return null;
  };

  const getAvailabilityStatus = () => {
    const now = new Date();
    const currentDay = now.toLocaleLowerCase();
    const daySchedule = escort.availability?.schedule?.[currentDay];
    
    if (daySchedule?.available) {
      return { status: 'available', text: 'Available Today' };
    }
    return { status: 'busy', text: 'Check Availability' };
  };

  const availability = getAvailabilityStatus();

  return (
    <Link href={`/escorts/${escort._id}`}>
      <a className="group block">
        <div className={`card hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
          featured ? 'ring-2 ring-primary-200' : ''
        }`}>
          {/* Image Container */}
          <div className="relative h-64 overflow-hidden">
            <Image
              src={mainImage}
              alt={escort.stageName}
              layout="fill"
              objectFit="cover"
              className="group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-wrap gap-1">
              {featured && (
                <span className="badge-primary flex items-center">
                  <Crown className="w-3 h-3 mr-1" />
                  Featured
                </span>
              )}
              {escort.premium?.isPremium && (
                <span className="badge bg-yellow-100 text-yellow-800 flex items-center">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </span>
              )}
              {escort.verification?.isVerified && (
                <span className="badge-success flex items-center">
                  <Shield className="w-3 h-3 mr-1" />
                  Verified
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={handleFavorite}
              disabled={favoriteLoading}
              className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                isFavorited 
                  ? 'bg-red-500 text-white' 
                  : 'bg-white bg-opacity-80 text-gray-600 hover:bg-opacity-100'
              } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}`}
            >
              <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
            </button>

            {/* Online Status */}
            <div className="absolute bottom-3 left-3">
              <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                availability.status === 'available' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  availability.status === 'available' ? 'bg-green-500' : 'bg-yellow-500'
                }`}></div>
                <span>{availability.text}</span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="card-body">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                {escort.stageName}
              </h3>
              <span className="text-sm text-gray-500">{escort.age} years</span>
            </div>

            {/* Location */}
            <div className="flex items-center space-x-1 text-gray-600 mb-2">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{escort.location?.city}</span>
            </div>

            {/* Physical attributes */}
            <div className="flex flex-wrap gap-2 mb-3">
              {escort.physical?.bodyType && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {escort.physical.bodyType}
                </span>
              )}
              {escort.physical?.ethnicity && (
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {escort.physical.ethnicity}
                </span>
              )}
            </div>

            {/* Services and Rates */}
            <div className="flex justify-between items-center mb-3">
              <div className="flex space-x-2 text-xs">
                {escort.services?.incall?.available && (
                  <span className="badge bg-blue-100 text-blue-800">Incall</span>
                )}
                {escort.services?.outcall?.available && (
                  <span className="badge bg-purple-100 text-purple-800">Outcall</span>
                )}
              </div>
              
              {(formatRate(escort.services?.incall?.rates) || formatRate(escort.services?.outcall?.rates)) && (
                <div className="text-sm font-semibold text-primary-600">
                  From {formatRate(escort.services?.incall?.rates) || formatRate(escort.services?.outcall?.rates)}
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-3">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  <Eye className="w-3 h-3" />
                  <span>{escort.stats?.views || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="w-3 h-3" />
                  <span>{escort.stats?.rating || 0}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-3 h-3" />
                  <span>{escort.stats?.favorites || 0}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>Last seen {new Date(escort.lastOnline).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Description Preview */}
            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
              {escort.description?.slice(0, 100)}...
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
}