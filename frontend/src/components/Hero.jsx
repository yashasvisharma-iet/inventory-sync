import React from 'react';

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 w-full h-full z-[-1]">
        <div 
          className="absolute inset-0 bg-cover bg-[center_20%]"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1920&auto=format&fit=crop')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent md:bg-gradient-to-r md:from-[#fdfaf6]/90 md:via-[#fdfaf6]/40 md:to-transparent"></div>
      </div>
      
      <div className="container-custom relative z-10 w-full">
        <div className="max-w-xl md:-mt-10">
          <p className="text-brand-gold text-sm tracking-[3px] uppercase mb-4 font-semibold">
            NEW ARRIVALS 2024
          </p>
          <h1 className="font-serif text-brand-red text-5xl md:text-7xl leading-tight mb-6">
            The Crochet<br />Chronicles
          </h1>
          <p className="text-gray-600 text-lg mb-10 max-w-md">
            Weaving a modern aesthetic with timeless tradition. 
            Our pieces are more than just garments—they are heirlooms for the soul.
          </p>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            <button className="btn-primary">
              SHOP NEW ARRIVALS
            </button>
            <a href="#lookbook" className="text-brand-gold font-serif text-sm tracking-[2px] border-b border-brand-gold pb-1 hover:text-brand-red hover:border-brand-red transition-colors">
              VIEW LOOKBOOK
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
