import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Crown, Search, MapPin, Filter, Star, Heart, Eye, Clock } from 'lucide-react';

export default function EscortsIndex() {
  const router = useRouter();
  const [escorts, setEscorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    city: '',
    minAge: '',
    maxAge: '',
    bodyType: '',
    ethnicity: '',
    sortBy: 'premium'
  });
  const [showFilters, setShowFilters] = useState(false);

  const bodyTypes = ['Slim', 'Athletic', 'Average', 'Curvy', 'BBW', 'Other'];
  const ethnicities = ['White', 'Asian', 'Black', 'Mixed', 'Latin', 'Middle Eastern', 'Other'];
  const cities = ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Newcastle', 'Leeds', 'Bristol', 'Edinburgh', 'Glasgow', 'Cardiff'];

  useEffect(() => {
    fetchEscorts();
  }, []);

  const fetchEscorts = async (page = 1, customFilters = filters) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        ...Object.fromEntries(
          Object.entries(customFilters).filter(([_, value]) => value !== '')
        )
      });

      const response = await fetch(`/api/escorts?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setEscorts(data.escorts);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalEscorts: data.totalEscorts,
          hasNext: data.hasNext,
          hasPrev: data.hasPrev
        });
      } else {
        console.error('Failed to fetch escorts:', data.message);
      }
    } catch (error) {
      console.error('Error fetching escorts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchEscorts(1, newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      city: '',
      minAge: '',
      maxAge: '',
      bodyType: '',
      ethnicity: '',
      sortBy: 'premium'
    };
    setFilters(clearedFilters);
    fetchEscorts(1, clearedFilters);
  };

  const handlePageChange = (page) => {
    fetchEscorts(page);
    window.scrollTo(0, 0);
  };

  const toggleFavorite = async (escortId) => {
    // TODO: Implement favorite toggle with authentication
    console.log('Toggle favorite for escort:', escortId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Browse Escorts - PrivatLux</title>
        <meta name="description" content="Browse premium escort services in the UK. Find verified companions in your area." />
      </Head>

      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <a className="flex items-center space-x-2">
                <Crown className="w-8 h-8 text-primary-600" />
                <span className="text-2xl font-bold text-gray-900">
                  Privat<span className="text-primary-600">Lux</span>
                </span>
              </a>
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/escorts">
                <a className="text-primary-600 font-medium">Browse Escorts</a>
              </Link>
              <Link href="/login">
                <a className="text-gray-700 hover:text-primary-600">Login</a>
              </Link>
              <Link href="/register">
                <a className="btn-primary">Register</a>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Escorts</h1>
          <p className="text-gray-600">
            {pagination.totalEscorts ? `${pagination.totalEscorts} verified escorts available` : 'Loading...'}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by name, services..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="form-input pl-10 w-full"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="form-select pl-10 w-48"
                >
                  <option value="">All Cities</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="btn-outline flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t pt-6">
              <div className="grid md:grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Age</label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={filters.minAge}
                    onChange={(e) => handleFilterChange('minAge', e.target.value)}
                    className="form-input"
                    placeholder="18"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Age</label>
                  <input
                    type="number"
                    min="18"
                    max="65"
                    value={filters.maxAge}
                    onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                    className="form-input"
                    placeholder="65"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Body Type</label>
                  <select
                    value={filters.bodyType}
                    onChange={(e) => handleFilterChange('bodyType', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Any</option>
                    {bodyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ethnicity</label>
                  <select
                    value={filters.ethnicity}
                    onChange={(e) => handleFilterChange('ethnicity', e.target.value)}
                    className="form-select"
                  >
                    <option value="">Any</option>
                    {ethnicities.map(ethnicity => (
                      <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="form-select"
                  >
                    <option value="premium">Premium First</option>
                    <option value="createdAt">Newest</option>
                    <option value="rating">Highest Rated</option>
                    <option value="views">Most Popular</option>
                  </select>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-gray-500 hover:text-gray-700 text-sm"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Escorts Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="text-gray-600 mt-4">Loading escorts...</p>
          </div>
        ) : escorts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No escorts found matching your criteria.</p>
            <button
              onClick={clearFilters}
              className="mt-4 text-primary-600 hover:text-primary-700"
            >
              Clear filters and try again
            </button>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {escorts.map((escort) => (
                <div key={escort._id} className="card group hover:shadow-lg transition-shadow duration-200">
                  <div className="relative">
                    <img
                      src={escort.images?.find(img => img.isMain)?.url || '/images/placeholder.jpg'}
                      alt={escort.stageName}
                      className="w-full h-64 object-cover"
                    />
                    
                    {/* Premium Badge */}
                    {escort.premium?.isPremium && (
                      <div className="absolute top-3 left-3">
                        <span className="badge-primary">Premium</span>
                      </div>
                    )}
                    
                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(escort._id)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-gray-400" />
                    </button>
                    
                    {/* Quick Stats */}
                    <div className="absolute bottom-3 left-3 flex gap-2">
                      <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {escort.stats?.views || 0}
                      </span>
                      {escort.stats?.rating > 0 && (
                        <span className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-yellow-400" />
                          {escort.stats.rating.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="card-body">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-gray-900">{escort.stageName}</h3>
                      <span className="text-sm text-gray-500">{escort.age} years</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-3 flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {escort.location?.city}, {escort.location?.country}
                    </p>
                    
                    <p className="text-gray-700 text-sm line-clamp-2 mb-4">
                      {escort.description}
                    </p>
                    
                    {/* Services */}
                    <div className="flex gap-2 mb-4 text-xs">
                      {escort.services?.incall?.available && (
                        <span className="badge bg-green-100 text-green-800">Incall</span>
                      )}
                      {escort.services?.outcall?.available && (
                        <span className="badge bg-blue-100 text-blue-800">Outcall</span>
                      )}
                    </div>
                    
                    {/* Pricing */}
                    {escort.services?.incall?.rates?.['1hour'] && (
                      <div className="text-sm text-gray-600 mb-4">
                        From £{escort.services.incall.rates['1hour']}/hour
                      </div>
                    )}
                    
                    {/* Last Online */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Online {new Date(escort.lastOnline).toLocaleDateString()}
                      </span>
                      
                      <Link href={`/escorts/${escort._id}`}>
                        <a className="btn btn-primary text-sm">View Profile</a>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrev}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded ${
                          page === pagination.currentPage
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNext}
                  className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}