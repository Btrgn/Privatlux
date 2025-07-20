import Head from 'next/head';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <Head>
        <title>PrivatLux - Premium Escort Directory UK</title>
        <meta name="description" content="Discover premium escort services in the UK." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Navigation */}
      <nav style={{ backgroundColor: 'white', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '1rem 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
              Privat<span style={{ color: '#2563eb' }}>Lux</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="/search" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>Browse Escorts</a>
            <a href="/login" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500' }}>Login</a>
            <a href="/register" style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '600' }}>Register</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ backgroundColor: '#2563eb', color: 'white', padding: '5rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Welcome to PrivatLux
          </h1>
          <p style={{ fontSize: '1.25rem', marginBottom: '2rem', opacity: '0.9' }}>
            Discover premium escort services across the UK.
          </p>
          <a href="/search" style={{ backgroundColor: 'white', color: '#2563eb', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: '600', display: 'inline-block' }}>
            Search Escorts
          </a>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '4rem 0', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '1rem' }}>Why Choose PrivatLux?</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>Verified Profiles</h3>
              <p style={{ color: '#6b7280' }}>All our escorts go through verification.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>Privacy Protection</h3>
              <p style={{ color: '#6b7280' }}>Your privacy is our priority.</p>
            </div>
            <div style={{ textAlign: 'center', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>Premium Experience</h3>
              <p style={{ color: '#6b7280' }}>Connect with elite companions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: '#1f2937', color: 'white', padding: '2rem 0', textAlign: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <p style={{ color: '#9ca3af' }}>&copy; 2024 PrivatLux. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}