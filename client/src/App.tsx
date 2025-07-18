import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';

// Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import EscortsPage from './pages/EscortsPage';
import EscortDetailPage from './pages/EscortDetailPage';
import MemberDashboard from './pages/member/MemberDashboard';
import EscortDashboard from './pages/escort/EscortDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import PricingPage from './pages/PricingPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsPage from './pages/legal/TermsPage';
import NotFoundPage from './pages/NotFoundPage';

// Styles
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <Router>
            <GlobalStyles />
            <div className="App">
              <Header />
              <main>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/escorts" element={<EscortsPage />} />
                  <Route path="/escorts/:id" element={<EscortDetailPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />

                  {/* Protected Member Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute requiredRole="member">
                      <MemberDashboard />
                    </ProtectedRoute>
                  } />

                  {/* Protected Escort Routes */}
                  <Route path="/escort/*" element={
                    <ProtectedRoute requiredRole="escort">
                      <EscortDashboard />
                    </ProtectedRoute>
                  } />

                  {/* Protected Admin Routes */}
                  <Route path="/admin/*" element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } />

                  {/* 404 */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: theme.colors.background.secondary,
                  color: theme.colors.text.primary,
                  border: `1px solid ${theme.colors.primary.main}`,
                },
              }}
            />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
