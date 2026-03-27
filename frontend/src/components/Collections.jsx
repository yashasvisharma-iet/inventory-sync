import React from 'react';

const Collections = () => {
  return (
    <section className="py-24 bg-white" id="collections">
      <div className="container-custom max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 font-bold leading-tight">
            The Atelier<br/>Collections
          </h2>
          <p className="text-gray-500 text-sm md:text-base italic font-serif">
            Curated craft, tailored for grace
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative w-full h-24 md:h-32 overflow-hidden group cursor-pointer bg-gray-100">
            <img src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="For the modern bride" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <h3 className="text-white tracking-[3px] md:tracking-[5px] text-xs md:text-sm font-semibold uppercase">FOR THE MODERN BRIDE</h3>
            </div>
          </div>
          
          <div className="relative w-full h-24 md:h-32 overflow-hidden group cursor-pointer bg-gray-100">
            <img src="https://images.unsplash.com/photo-1583391733958-d25e07fac04f?q=80&w=1200&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="A touch of elegance" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <h3 className="text-white tracking-[3px] md:tracking-[5px] text-xs md:text-sm font-semibold uppercase">A TOUCH OF ELEGANCE</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[400px]">
            <div className="relative w-full h-full overflow-hidden group cursor-pointer bg-gray-100">
              <img src="https://images.unsplash.com/photo-1599643478524-fb524419de0f?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Accessories" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-white font-serif tracking-widest text-2xl filter drop-shadow-md">Accessories</h3>
              </div>
            </div>
            
            <div className="relative w-full h-full overflow-hidden group cursor-pointer bg-gray-100">
              <img src="https://images.unsplash.com/photo-1620242502804-d5397441bbcb?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Suits" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <h3 className="text-white font-serif tracking-widest text-2xl filter drop-shadow-md">Suits</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collections;
