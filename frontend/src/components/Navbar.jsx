import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 h-20 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="container-custom h-full flex items-center justify-between">
        
        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-gray-900 flex-1 text-left"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Desktop Links (Left) */}
        <nav className="hidden md:flex gap-8 flex-1">
          <a href="#new-arrivals" className="text-sm uppercase tracking-wider font-medium relative group">
            New Arrivals
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-red transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#collections" className="text-sm uppercase tracking-wider font-medium relative group">
            Collections
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-red transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#about" className="text-sm uppercase tracking-wider font-medium relative group">
            About
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-red transition-all duration-300 group-hover:w-full"></span>
          </a>
        </nav>

        {/* Logo (Center) */}
        <div className="flex-1 flex justify-center">
          <a href="/" className="font-serif text-brand-red text-xl md:text-2xl font-bold tracking-widest whitespace-nowrap">
            AAP KI POOJA
          </a>
        </div>

        {/* Icons (Right) */}
        <div className="flex gap-4 flex-1 justify-end">
          <button className="text-gray-900 hover:text-brand-red transition-colors"><Search size={20} /></button>
          <button className="hidden md:flex text-gray-900 hover:text-brand-red transition-colors"><User size={20} /></button>
          <button className="text-gray-900 hover:text-brand-red transition-colors"><ShoppingBag size={20} /></button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`md:hidden absolute top-20 left-0 w-full bg-white shadow-lg flex flex-col px-[5%] py-4 transition-all duration-300 origin-top ${isMobileMenuOpen ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 pointer-events-none'}`}>
        <a href="#new-arrivals" className="py-4 border-b border-gray-100 uppercase text-sm font-medium tracking-wide" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</a>
        <a href="#collections" className="py-4 border-b border-gray-100 uppercase text-sm font-medium tracking-wide" onClick={() => setIsMobileMenuOpen(false)}>Collections</a>
        <a href="#about" className="py-4 border-b border-gray-100 uppercase text-sm font-medium tracking-wide" onClick={() => setIsMobileMenuOpen(false)}>About</a>
        <a href="#contact" className="py-4 uppercase text-sm font-medium tracking-wide" onClick={() => setIsMobileMenuOpen(false)}>Contact Us</a>
      </div>
    </header>
  );
};

export default Navbar;
