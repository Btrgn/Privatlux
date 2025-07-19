import { useState, useEffect } from 'react';
import { Filter, X, Search } from 'lucide-react';

export default function SearchFilters({ onFilterChange, initialFilters = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    city: '',
    minAge: '',
    maxAge: '',
    bodyType: '',
    ethnicity: '',
    services: '',
    incall: false,
    outcall: false,
    verified: false,
    premium: false,
    ...initialFilters
  });

  const bodyTypes = [
    'Slim', 'Athletic', 'Average', 'Curvy', 'BBW', 'Other'
  ];

  const ethnicities = [
    'White', 'Asian', 'Black', 'Mixed', 'Latin', 'Middle Eastern', 'Other'
  ];

  const popularCities = [
    'London', 'Manchester', 'Birmingham', 'Liverpool', 'Leeds', 'Sheffield',
    'Bristol', 'Glasgow', 'Edinburgh', 'Newcastle', 'Nottingham', 'Cardiff'
  ];

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    const clearedFilters = {
      city: '',
      minAge: '',
      maxAge: '',
      bodyType: '',
      ethnicity: '',
      services: '',
      incall: false,
      outcall: false,
      verified: false,
      premium: false
    };
    setFilters(clearedFilters);
  };

  const getActiveFilterCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== false
    ).length;
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="container mx-auto px-4 py-4">
        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span>Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                  {getActiveFilterCount()}
                </span>
              )}
            </div>
            <X className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Filter Content */}
        <div className={`${isOpen ? 'block' : 'hidden'} md:block`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                value={filters.city}
                onChange={(e) => handleFilterChange('city', e.target.value)}
                className="form-select text-sm"
              >
                <option value="">All Cities</option>
                {popularCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Age Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  min="18"
                  max="65"
                  value={filters.minAge}
                  onChange={(e) => handleFilterChange('minAge', e.target.value)}
                  className="form-input text-sm w-full"
                />
                <input
                  type="number"
                  placeholder="Max"
                  min="18"
                  max="65"
                  value={filters.maxAge}
                  onChange={(e) => handleFilterChange('maxAge', e.target.value)}
                  className="form-input text-sm w-full"
                />
              </div>
            </div>

            {/* Body Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Body Type
              </label>
              <select
                value={filters.bodyType}
                onChange={(e) => handleFilterChange('bodyType', e.target.value)}
                className="form-select text-sm"
              >
                <option value="">All Types</option>
                {bodyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Ethnicity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ethnicity
              </label>
              <select
                value={filters.ethnicity}
                onChange={(e) => handleFilterChange('ethnicity', e.target.value)}
                className="form-select text-sm"
              >
                <option value="">All Ethnicities</option>
                {ethnicities.map(ethnicity => (
                  <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
                ))}
              </select>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Services
              </label>
              <input
                type="text"
                placeholder="Search services..."
                value={filters.services}
                onChange={(e) => handleFilterChange('services', e.target.value)}
                className="form-input text-sm"
              />
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quick Filters
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.incall}
                    onChange={(e) => handleFilterChange('incall', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Incall</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.outcall}
                    onChange={(e) => handleFilterChange('outcall', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Outcall</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.verified}
                    onChange={(e) => handleFilterChange('verified', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Verified</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.premium}
                    onChange={(e) => handleFilterChange('premium', e.target.checked)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Premium</span>
                </label>
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {getActiveFilterCount() > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
              <span className="text-sm text-gray-600">
                {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} applied
              </span>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}