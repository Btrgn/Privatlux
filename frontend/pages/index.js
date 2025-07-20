import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>PrivatLux - Premium Escort Directory UK</title>
        <meta name="description" content="Discover premium escort services in the UK." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Simple Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">
                Privat<span className="text-blue-600">Lux</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <a href="/search" className="text-gray-700 hover:text-blue-600">Browse Escorts</a>
              <a href="/login" className="text-gray-700 hover:text-blue-600">Login</a>
              <a href="/register" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Register</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to PrivatLux
          </h1>
          <p className="text-xl mb-8">
            Discover premium escort services across the UK.
          </p>
          <a href="/search" className="bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100">
            Search Escorts
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose PrivatLux?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-3">Verified Profiles</h3>
              <p className="text-gray-600">All our escorts go through verification.</p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-3">Privacy Protection</h3>
              <p className="text-gray-600">Your privacy is our priority.</p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-semibold mb-3">Premium Experience</h3>
              <p className="text-gray-600">Connect with elite companions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">&copy; 2024 PrivatLux. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}