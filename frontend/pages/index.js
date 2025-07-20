import Head from 'next/head';

export default function Home() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>PrivatLux - Welcome!</h1>
      <p>Your website is working correctly!</p>
      <div style={{ marginTop: '2rem' }}>
        <a href="/search" style={{ margin: '0 1rem', color: 'blue', textDecoration: 'underline' }}>
          Search
        </a>
        <a href="/login" style={{ margin: '0 1rem', color: 'blue', textDecoration: 'underline' }}>
          Login
        </a>
        <a href="/register" style={{ margin: '0 1rem', color: 'blue', textDecoration: 'underline' }}>
          Register
        </a>
      </div>
    </div>
  );
}