import React, { useEffect, useMemo, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrendingNow from './components/TrendingNow';
import Collections from './components/Collections';
import Journey from './components/Journey';
import Footer from './components/Footer';

function IntegrationStatus() {
  const backendBaseUrl = useMemo(
    () => (import.meta.env.VITE_BACKEND_BASE_URL || 'http://localhost:4000').replace(/\/$/, ''),
    []
  );
  const [status, setStatus] = useState({ loading: true, error: null, data: null });

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const [healthRes, configRes] = await Promise.all([
          fetch(`${backendBaseUrl}/health`),
          fetch(`${backendBaseUrl}/shopify/config-status`)
        ]);

        if (!healthRes.ok) {
          throw new Error(`Health check failed (${healthRes.status})`);
        }
        if (!configRes.ok) {
          throw new Error(`Shopify config check failed (${configRes.status})`);
        }

        const health = await healthRes.json();
        const shopifyConfig = await configRes.json();

        if (!cancelled) {
          setStatus({
            loading: false,
            error: null,
            data: { health, shopifyConfig }
          });
        }
      } catch (error) {
        if (!cancelled) {
          setStatus({ loading: false, error: error.message, data: null });
        }
      }
    }

    loadStatus();
    return () => {
      cancelled = true;
    };
  }, [backendBaseUrl]);

  const containerClass =
    'mx-auto my-8 w-[92%] max-w-6xl rounded-xl border px-5 py-4 text-sm shadow-sm';

  if (status.loading) {
    return (
      <section className={`${containerClass} border-slate-200 bg-slate-50 text-slate-700`}>
        Checking middleware connection...
      </section>
    );
  }

  if (status.error) {
    return (
      <section className={`${containerClass} border-red-200 bg-red-50 text-red-700`}>
        Backend connection failed: {status.error}. Check VITE_BACKEND_BASE_URL and ensure ngrok points to a
        running backend.
      </section>
    );
  }

  const { shopifyConfig } = status.data;
  return (
    <section className={`${containerClass} border-emerald-200 bg-emerald-50 text-emerald-800`}>
      Backend connected at <span className="font-semibold">{backendBaseUrl}</span>. Shopify configured:{' '}
      <span className="font-semibold">{shopifyConfig?.ok ? 'Yes' : 'No'}</span>.
      {!shopifyConfig?.ok && shopifyConfig?.missing?.length ? (
        <span> Missing: {shopifyConfig.missing.join(', ')}.</span>
      ) : null}
    </section>
  );
}

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <IntegrationStatus />
        <Hero />
        <TrendingNow />
        <Collections />
        <Journey />
      </main>
      <Footer />
    </div>
  );
}

export default App;
