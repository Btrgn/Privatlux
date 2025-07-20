import Head from 'next/head';
import { Crown, Search, MapPin, Star, Eye, Heart, Shield, Users, Clock } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import Link to avoid SSR issues
const Link = dynamic(() => import('next/link'), { ssr: false });

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Head>
        <title>PrivatLux - Premium Escort Directory UK</title>
        <meta name="description" content="Discover premium escort services in the UK. Browse verified profiles, read reviews, and connect with elite companions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Enhanced Navigation */}
      <nav className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                Privat<span className="text-blue-600">Lux</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <a href="/search" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium">
                Browse Escorts
              </a>
              <a href="/login" className="text-gray-700 hover:text-blue-600 transition-all duration-300 font-medium">
                Login
              </a>
              <a href="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Register
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                Premium Escort Directory
              </span>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                PrivatLux
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-blue-100 font-light leading-relaxed">
              Discover premium escort services across the UK. Connect with verified, elite companions for unforgettable experiences.
            </p>
            
            {/* Enhanced Search Form */}
            <div className="max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Search by name, services..."
                      className="w-full pl-12 pr-4 py-4 border-2 border-white/20 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 bg-white/90 backdrop-blur-sm transition-all duration-300"
                    />
                  </div>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full pl-12 pr-4 py-4 border-2 border-white/20 rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 text-gray-900 bg-white/90 backdrop-blur-sm transition-all duration-300"
                    />
                  </div>
                </div>
                <a href="/search" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center text-lg">
                  <Search className="w-5 h-5 mr-2" />
                  Search Escorts
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">Why Choose PrivatLux?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Experience the difference with our premium platform designed for discerning clients and elite companions.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 border border-blue-100 hover:border-blue-200">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Verified Profiles</h3>
              <p className="text-gray-600 leading-relaxed">All our escorts go through a rigorous verification process to ensure authenticity, safety, and premium quality standards.</p>
            </div>
            
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-blue-50 hover:from-green-100 hover:to-blue-100 transition-all duration-300 border border-green-100 hover:border-green-200">
              <div className="bg-gradient-to-r from-green-600 to-blue-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Privacy Protection</h3>
              <p className="text-gray-600 leading-relaxed">Your privacy is our absolute priority. Secure, discreet, and confidential interactions with military-grade encryption.</p>
            </div>
            
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 border border-purple-100 hover:border-purple-200">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Premium Experience</h3>
              <p className="text-gray-600 leading-relaxed">Connect with elite companions who provide exceptional, memorable experiences tailored to your preferences.</p>
            </div>
          </div>
        </div>
      </section>

      {/* New Stats Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl font-bold mb-2 text-blue-400 group-hover:text-blue-300 transition-colors">14,462+</div>
              <div className="text-gray-300">Verified Profiles</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 text-green-400 group-hover:text-green-300 transition-colors">98%</div>
              <div className="text-gray-300">Satisfaction Rate</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 text-purple-400 group-hover:text-purple-300 transition-colors">24/7</div>
              <div className="text-gray-300">Support Available</div>
            </div>
            <div className="group">
              <div className="text-4xl font-bold mb-2 text-orange-400 group-hover:text-orange-300 transition-colors">5★</div>
              <div className="text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">PrivatLux</span>
              </div>
              <p className="text-gray-400 leading-relaxed">Premium escort directory connecting you with elite companions across the UK.</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="/search" className="block text-gray-400 hover:text-white transition-colors">Browse Escorts</a>
                <a href="/login" className="block text-gray-400 hover:text-white transition-colors">Login</a>
                <a href="/register" className="block text-gray-400 hover:text-white transition-colors">Register</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="/terms" className="block text-gray-400 hover:text-white transition-colors">Terms & Conditions</a>
                <a href="/adult-content" className="block text-gray-400 hover:text-white transition-colors">Adult Content Warning</a>
                <a href="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <div className="space-y-2">
                <a href="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact Us</a>
                <a href="/help" className="block text-gray-400 hover:text-white transition-colors">Help Center</a>
                <a href="/faq" className="block text-gray-400 hover:text-white transition-colors">FAQ</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 PrivatLux. All rights reserved. Premium escort directory.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}