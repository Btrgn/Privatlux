import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, User, Heart, MessageCircle, Plus, LogOut, Crown } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/escorts', label: 'Browse Escorts', icon: User },
    { href: '/blog', label: 'Blog', icon: null },
    { href: '/faq', label: 'FAQ', icon: null },
  ];

  const userNavLinks = user ? [
    { href: '/favorites', label: 'Favorites', icon: Heart },
    { href: '/messages', label: 'Messages', icon: MessageCircle },
    ...(user.role === 'escort' ? [{ href: '/add-escort', label: 'My Profile', icon: Plus }] : []),
    ...(user.role === 'admin' ? [{ href: '/admin', label: 'Admin', icon: Crown }] : []),
  ] : [];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-2">
              <Crown className="w-8 h-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">
                Privat<span className="text-primary-600">Lux</span>
              </span>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a className={`flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-200 ${
                  router.pathname === link.href ? 'text-primary-600 font-semibold' : ''
                }`}>
                  {link.icon && <link.icon className="w-4 h-4" />}
                  <span>{link.label}</span>
                </a>
              </Link>
            ))}
          </div>

          {/* User Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {loading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                {userNavLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <a className={`flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors duration-200 ${
                      router.pathname === link.href ? 'text-primary-600 font-semibold' : ''
                    }`}>
                      {link.icon && <link.icon className="w-4 h-4" />}
                      <span>{link.label}</span>
                    </a>
                  </Link>
                ))}
                
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200">
                    <User className="w-5 h-5" />
                    <span>{user.firstName}</span>
                  </button>
                  
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link href="/profile">
                      <a className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile Settings</a>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <a className="text-gray-700 hover:text-primary-600 transition-colors duration-200">
                    Login
                  </a>
                </Link>
                <Link href="/register">
                  <a className="btn-primary">
                    Register
                  </a>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a 
                    className={`flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 ${
                      router.pathname === link.href ? 'text-primary-600 font-semibold' : ''
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.icon && <link.icon className="w-4 h-4" />}
                    <span>{link.label}</span>
                  </a>
                </Link>
              ))}

              {user && (
                <>
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    {userNavLinks.map((link) => (
                      <Link key={link.href} href={link.href}>
                        <a 
                          className={`flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 mb-2 ${
                            router.pathname === link.href ? 'text-primary-600 font-semibold' : ''
                          }`}
                          onClick={() => setIsOpen(false)}
                        >
                          {link.icon && <link.icon className="w-4 h-4" />}
                          <span>{link.label}</span>
                        </a>
                      </Link>
                    ))}
                    <Link href="/profile">
                      <a 
                        className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200 mb-2"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </a>
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}

              {!user && !loading && (
                <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col space-y-2">
                  <Link href="/login">
                    <a 
                      className="text-gray-700 hover:text-primary-600 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </a>
                  </Link>
                  <Link href="/register">
                    <a 
                      className="btn-primary inline-block text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Register
                    </a>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}