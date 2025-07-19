import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Search, MapPin, Star, Eye, Heart, Crown } from 'lucide-react';
import Navbar from '../components/Navbar';
import EscortCard from '../components/EscortCard';
import SearchFilters from '../components/SearchFilters';

export default function Home() {
  const [featuredEscorts, setFeaturedEscorts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedEscorts();
  }, []);

  const fetchFeaturedEscorts = async () => {
    try {
      const response = await fetch('/api/escorts/featured/list');
      if (response.ok) {
        const data = await response.json();
        setFeaturedEscorts(data.escorts);
      }
    } catch (error) {
      console.error('Error fetching featured escorts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (searchLocation) params.append('city', searchLocation);
    
    window.location.href = `/escorts?${params.toString()}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>PrivatLux - Premium Escort Directory UK</title>
        <meta name="description" content="Discover premium escort services in the UK. Browse verified profiles, read reviews, and connect with elite companions." />
        <meta name="keywords" content="escort, UK, premium, elite, directory, companions" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-shadow-lg">
              Welcome to <span className="text-primary-200">PrivatLux</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 font-light">
              Discover premium escort services across the UK. Connect with verified, elite companions.
            </p>
            
            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-2xl p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name, services..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Location"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 shadow-lg"
                >
                  Search Escorts
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured Escorts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <Crown className="inline-block w-8 h-8 text-primary-600 mr-2" />
              Featured Escorts
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our premium verified escorts. These elite companions offer exceptional services and experiences.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="card-body">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredEscorts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredEscorts.map((escort) => (
                <EscortCard key={escort._id} escort={escort} featured />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured escorts available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/escorts">
              <a className="btn-primary text-lg px-8 py-3">
                View All Escorts
              </a>
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
              <div className="text-gray-600">Verified Escorts</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
              <div className="text-gray-600">UK Cities</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PrivatLux?</h2>
            <p className="text-xl text-gray-600">Experience the difference with our premium platform</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Verified Profiles</h3>
              <p className="text-gray-600">All our escorts go through a rigorous verification process to ensure authenticity and quality.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy Protection</h3>
              <p className="text-gray-600">Your privacy is our priority. Secure, discreet, and confidential interactions.</p>
            </div>
            
            <div className="text-center p-6">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Premium Experience</h3>
              <p className="text-gray-600">Connect with elite companions who provide exceptional and memorable experiences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">PrivatLux</h3>
              <p className="text-gray-400">Premium escort directory connecting you with elite companions across the UK.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/escorts"><a className="hover:text-white transition-colors">Browse Escorts</a></Link></li>
                <li><Link href="/register"><a className="hover:text-white transition-colors">Register</a></Link></li>
                <li><Link href="/add-escort"><a className="hover:text-white transition-colors">List Your Services</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/faq"><a className="hover:text-white transition-colors">FAQ</a></Link></li>
                <li><Link href="/terms"><a className="hover:text-white transition-colors">Terms of Service</a></Link></li>
                <li><Link href="/privacy"><a className="hover:text-white transition-colors">Privacy Policy</a></Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">
                Email: support@privatlux.co.uk<br />
                Phone: +44 20 7123 4567
              </p>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 PrivatLux. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}