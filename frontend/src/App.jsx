import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TrendingNow from './components/TrendingNow';
import Collections from './components/Collections';
import Journey from './components/Journey';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
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
