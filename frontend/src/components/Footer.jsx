import React from 'react';
import { ArrowRight } from 'lucide-react';
import { FaInstagram, FaFacebook, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-brand-red text-white/90 pt-20 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          
          {/* Brand Column */}
          <div className="md:col-span-4 lg:col-span-5">
            <h2 className="font-serif text-2xl md:text-3xl font-bold tracking-[3px] mb-6 text-white text-left">
              AAP KI POOJA
            </h2>
            <p className="text-white/80 text-sm leading-relaxed mb-8 max-w-sm">
              Redefining modern aesthetics with timeless tradition. Our pieces are more than garments—they are heirlooms for the soul.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-red transition-colors text-brand-gold">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-red transition-colors text-brand-gold">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-brand-red transition-colors text-brand-gold">
                <FaEnvelope size={18} />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-6">CUSTOMER CARE</h4>
            <ul className="flex flex-col gap-4">
              <li><a href="#" className="text-white/80 hover:text-white text-sm transition-colors">Order Tracking</a></li>
              <li><a href="#" className="text-white/80 hover:text-white text-sm transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="text-white/80 hover:text-white text-sm transition-colors">Return & Exchange</a></li>
              <li><a href="#" className="text-white/80 hover:text-white text-sm transition-colors">FAQs</a></li>
            </ul>
          </div>

          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-6">EXPLORE</h4>
            <ul className="flex flex-col gap-4 mb-10">
              <li><a href="#" className="text-white/80 hover:text-white text-sm transition-colors">Our Story</a></li>
              <li><a href="#" className="text-white/80 hover:text-white text-sm transition-colors">Craftsmanship</a></li>
              <li><a href="#" className="text-white/80 hover:text-white text-sm transition-colors">Bespoke Service</a></li>
              <li><a href="#" className="text-white/80 hover:text-white text-sm transition-colors">Sustainability</a></li>
            </ul>
            
            <h4 className="text-brand-gold text-xs font-semibold tracking-widest uppercase mb-6">NEWSLETTER</h4>
            <p className="text-white/80 text-sm mb-4">Subscribe for exclusive drops and updates.</p>
            <form className="relative max-w-sm">
              <input 
                type="email" 
                placeholder="Email address" 
                className="w-full bg-transparent border-b border-white/30 py-3 pr-10 text-white placeholder:text-white/50 focus:outline-none focus:border-white transition-colors text-sm"
              />
              <button 
                type="submit" 
                className="absolute right-0 top-1/2 -translate-y-1/2 text-brand-gold hover:text-white transition-colors p-2"
                aria-label="Subscribe"
              >
                <ArrowRight size={18} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/50 text-xs tracking-wider uppercase">
            © 2024 AAP KI POOJA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-white/50 hover:text-white text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-white/50 hover:text-white text-xs transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
