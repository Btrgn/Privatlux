import '../styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from '../contexts/AuthContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from '../components/Navbar'
import Head from 'next/head'

const queryClient = new QueryClient()

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Head>
          <title>PrivatLux - Premium Escort Services</title>
          <meta name="description" content="PrivatLux - The UK's premier platform for high-class escort and massage services" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </Head>
        
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main>
            <Component {...pageProps} />
          </main>
          
          <footer className="bg-dark-800 text-white py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-serif font-semibold mb-4">PrivatLux</h3>
                  <p className="text-gray-300">The UK's premier platform for high-class escort and massage services.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="/escorts" className="hover:text-primary-400">Browse Escorts</a></li>
                    <li><a href="/register" className="hover:text-primary-400">Join Us</a></li>
                    <li><a href="/faq" className="hover:text-primary-400">FAQ</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Legal</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li><a href="/terms" className="hover:text-primary-400">Terms of Service</a></li>
                    <li><a href="/privacy" className="hover:text-primary-400">Privacy Policy</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Contact</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>Email: info@privatlux.co.uk</li>
                    <li>Phone: +44 (0) 20 7946 0958</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; 2024 PrivatLux. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </AuthProvider>
    </QueryClientProvider>
  )
}