import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Navbar from '../../components/Navbar';
import EscortCard from '../../components/EscortCard';
import SearchFilters from '../../components/SearchFilters';
import Pagination from '../../components/Pagination';
import { Grid, List, SortAsc, SortDesc } from 'lucide-react';

export default function EscortsPage() {
  const router = useRouter();
  const [escorts, setEscorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEscorts: 0,
    hasNext: false,
    hasPrev: false
  });
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filters, setFilters] = useState({});

  useEffect(() => {
    // Initialize filters from URL query
    const urlFilters = { ...router.query };
    delete urlFilters.page; // Remove page from filters
    setFilters(urlFilters);
    fetchEscorts(parseInt(router.query.page) || 1, urlFilters);
  }, [router.query]);

  const fetchEscorts = async (page = 1, currentFilters = {}) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '12',
        sortBy,
        sortOrder,
        ...currentFilters
      });

      const response = await fetch(`/api/escorts?${queryParams}`);
      if (response.ok) {
        const data = await response.json();
        setEscorts(data.escorts);
        setPagination({
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalEscorts: data.totalEscorts,
          hasNext: data.hasNext,
          hasPrev: data.hasPrev
        });
      } else {
        console.error('Failed to fetch escorts');
      }
    } catch (error) {
      console.error('Error fetching escorts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    
    // Update URL with filters
    const query = { ...newFilters };
    if (Object.keys(query).length === 0) {
      router.push('/escorts', undefined, { shallow: true });
    } else {
      router.push({
        pathname: '/escorts',
        query
      }, undefined, { shallow: true });
    }
  }, [router]);

  const handlePageChange = (page) => {
    const query = { ...filters, page: page.toString() };
    router.push({
      pathname: '/escorts',
      query
    }, undefined, { shallow: true });
  };

  const handleSortChange = (newSortBy) => {
    const newSortOrder = sortBy === newSortBy && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    fetchEscorts(pagination.currentPage, filters);
  };

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'views', label: 'Most Viewed' },
    { value: 'premium', label: 'Premium First' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Browse Escorts - PrivatLux</title>
        <meta name="description" content="Browse premium escort profiles in the UK. Find verified companions with advanced search and filtering options." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <Navbar />
      
      <SearchFilters 
        onFilterChange={handleFilterChange}
        initialFilters={filters}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Browse Escorts
            </h1>
            <p className="text-gray-600">
              {pagination.totalEscorts} escort{pagination.totalEscorts !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* Sort Options */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-');
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                  fetchEscorts(pagination.currentPage, filters);
                }}
                className="form-select text-sm border-gray-300 rounded-md"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="views-desc">Most Viewed</option>
                <option value="premium-desc">Premium First</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[...Array(12)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="card-body">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-2/3 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : escorts.length > 0 ? (
          <>
            {/* Escorts Grid/List */}
            <div className={`grid gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {escorts.map((escort) => (
                <EscortCard 
                  key={escort._id} 
                  escort={escort}
                  featured={escort.premium?.isPremium}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  hasNext={pagination.hasNext}
                  hasPrev={pagination.hasPrev}
                />
              </div>
            )}
          </>
        ) : (
          /* No Results */
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-6xl text-gray-300 mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No escorts found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters to find more results.
              </p>
              <button
                onClick={() => {
                  setFilters({});
                  router.push('/escorts');
                }}
                className="btn-primary"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}