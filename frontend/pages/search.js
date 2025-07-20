import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Search, MapPin, Filter, Star, Heart, Eye, Shield, Video, Camera } from 'lucide-react';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [distance, setDistance] = useState('0');
  const [rateMin, setRateMin] = useState('');
  const [rateMax, setRateMax] = useState('');
  const [services, setServices] = useState('All');
  const [gender, setGender] = useState('All');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [ethnicity, setEthnicity] = useState('All');
  const [filters, setFilters] = useState({
    verified: false,
    photos: false,
    video: false,
    incall: false,
    outcall: false
  });

  const handleFilterChange = (filter) => {
    setFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>UK Escorts and Massages - PrivatLux (Updated)</title>
        <meta name="description" content="Search for escorts and massages in the UK. Find verified profiles with photos and videos." />
      </Head>

      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-12 text-sm">
            <div className="flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-gray-900">Home</Link>
              <span className="text-gray-900 font-medium">UK Escorts and Massages</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/favourites" className="text-gray-600 hover:text-gray-900">Favourites</Link>
              <Link href="/corporate" className="text-gray-600 hover:text-gray-900">Corporate Responsibility</Link>
              <Link href="/account" className="text-gray-600 hover:text-gray-900">My Account</Link>
              <Link href="/help" className="text-gray-600 hover:text-gray-900">Help</Link>
              <Link href="/post-ad" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Post your ad
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Search Section */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Term */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="e.g. 'asian', 'milf', 'no rush'"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="e.g. 'York', 'Mayfair', 'SW1'"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Distance */}
            <div>
              <select
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="0">0 miles</option>
                <option value="5">5 miles</option>
                <option value="10">10 miles</option>
                <option value="25">25 miles</option>
                <option value="50">50 miles</option>
                <option value="100">100 miles</option>
              </select>
            </div>

            {/* Search Button */}
            <button className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Rates */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Rates</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="min"
                  value={rateMin}
                  onChange={(e) => setRateMin(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="max"
                  value={rateMax}
                  onChange={(e) => setRateMax(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Services I offer</label>
              <select
                value={services}
                onChange={(e) => setServices(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All</option>
                <option value="Escort">Escort</option>
                <option value="Massage">Massage</option>
                <option value="Companionship">Companionship</option>
                <option value="Dating">Dating</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="All">All</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Trans">Trans</option>
              </select>
            </div>

            {/* Age */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Age</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="min"
                  value={ageMin}
                  onChange={(e) => setAgeMin(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="max"
                  value={ageMax}
                  onChange={(e) => setAgeMax(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Ethnicity */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Ethnicity</label>
            <select
              value={ethnicity}
              onChange={(e) => setEthnicity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All</option>
              <option value="Asian">Asian</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Mixed">Mixed</option>
              <option value="Latin">Latin</option>
              <option value="Middle Eastern">Middle Eastern</option>
            </select>
          </div>
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => handleFilterChange('verified')}
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              filters.verified 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <Shield className="w-4 h-4 mr-1" />
            18+ ID Verified
          </button>
          <button
            onClick={() => handleFilterChange('photos')}
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              filters.photos 
                ? 'bg-blue-100 text-blue-800 border border-blue-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <Camera className="w-4 h-4 mr-1" />
            Ads with photos
          </button>
          <button
            onClick={() => handleFilterChange('video')}
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              filters.video 
                ? 'bg-purple-100 text-purple-800 border border-purple-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            <Video className="w-4 h-4 mr-1" />
            Ads with video
          </button>
          <button
            onClick={() => handleFilterChange('incall')}
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              filters.incall 
                ? 'bg-orange-100 text-orange-800 border border-orange-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            Incall
          </button>
          <button
            onClick={() => handleFilterChange('outcall')}
            className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              filters.outcall 
                ? 'bg-red-100 text-red-800 border border-red-300' 
                : 'bg-gray-100 text-gray-700 border border-gray-300'
            }`}
          >
            Outcall
          </button>
        </div>

        {/* Results Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-900">14,462 results in UK Escorts & Erotic Massage</h2>
              <div className="flex space-x-4 mt-2 text-sm text-gray-600">
                <span>Independent (13,237)</span>
                <span>Agency (1,225)</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Relevance</option>
                <option>Newest</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sample Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Ad 1 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Photo</span>
              </div>
              <div className="absolute top-2 right-2 flex space-x-1">
                <button className="p-1 bg-white rounded-full shadow">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 bg-white rounded-full shadow">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="absolute top-2 left-2">
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">NEW</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Sophie, 25</h3>
              <p className="text-sm text-gray-600 mb-2">Mayfair, London</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">£200/hr</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-600 ml-1">4.8</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Ad 2 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Photo</span>
              </div>
              <div className="absolute top-2 right-2 flex space-x-1">
                <button className="p-1 bg-white rounded-full shadow">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 bg-white rounded-full shadow">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="absolute top-2 left-2">
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">VERIFIED</span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Emma, 28</h3>
              <p className="text-sm text-gray-600 mb-2">Chelsea, London</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">£250/hr</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-600 ml-1">4.9</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sample Ad 3 */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative">
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Photo</span>
              </div>
              <div className="absolute top-2 right-2 flex space-x-1">
                <button className="p-1 bg-white rounded-full shadow">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
                <button className="p-1 bg-white rounded-full shadow">
                  <Eye className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Isabella, 23</h3>
              <p className="text-sm text-gray-600 mb-2">Knightsbridge, London</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">£300/hr</span>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-600 ml-1">4.7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage; 