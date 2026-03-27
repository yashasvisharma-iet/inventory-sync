import React from 'react';

const Journey = () => {
  return (
    <section className="py-24 bg-[#fdfaf6]">
      <div className="container-custom max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gray-500 uppercase tracking-widest text-xs md:text-sm mb-4 font-semibold">@aap_ki_pooja</p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 font-bold leading-tight">
            Follow our<br/>Journey
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="aspect-square bg-gray-200 overflow-hidden cursor-pointer group">
            <img 
              src="https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?q=80&w=600&auto=format&fit=crop&grayscale=true" 
              alt="Journey 1" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
          <div className="aspect-square bg-brand-cream flex items-center justify-center p-8 text-center cursor-pointer group border border-gray-100">
            <p className="font-serif text-lg text-gray-800 leading-relaxed italic">
              "Elegance is not about being noticed, it's about being remembered."
            </p>
          </div>
          <div className="aspect-square bg-gray-200 overflow-hidden cursor-pointer group">
            <img 
              src="https://images.unsplash.com/photo-1599643478524-fb524419de0f?q=80&w=600&auto=format&fit=crop" 
              alt="Journey 2" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
          <div className="aspect-square bg-gray-200 overflow-hidden cursor-pointer group">
            <img 
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop" 
              alt="Journey 3" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale hover:grayscale-0 transition-all"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Journey;
