import Head from 'next/head';
import Link from 'next/link';
import { Crown, Search, MapPin, Star, Eye, Heart } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>PrivatLux - Premium Escort Directory UK</title>
        <meta name="description" content="Discover premium escort services in the UK. Browse verified profiles, read reviews, and connect with elite companions. Updated deployment." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Simple Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Crown className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">
                Privat<span className="text-primary-600">Lux</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/search" className="text-gray-700 hover:text-primary-600">Browse Escorts</Link>
              <Link href="/login" className="text-gray-700 hover:text-primary-600">Login</Link>
              <Link href="/register" className="btn-primary">Register</Link>
            </div>
          </div>
        </div>
      </nav>

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
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-lg shadow-2xl p-6">
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search by name, services..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
                    />
                  </div>
                </div>
                <Link href="/search" className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 shadow-lg flex items-center justify-center">
                  Search Escorts
                </Link>
              </div>
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
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-4">PrivatLux</h3>
            <p className="text-gray-400 mb-4">Premium escort directory connecting you with elite companions across the UK.</p>
          </div>
          
          {/* Footer Links */}
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors">
              Terms and Conditions
            </a>
            <a href="/adult-content" className="text-gray-400 hover:text-white transition-colors">
              Adult Content Warning
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/contact" className="text-gray-400 hover:text-white transition-colors">
              Contact Us
            </a>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400">&copy; 2024 PrivatLux. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}