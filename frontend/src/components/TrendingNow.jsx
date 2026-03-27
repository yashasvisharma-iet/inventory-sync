import React from 'react';
import { ArrowRight, ShoppingCart } from 'lucide-react';

const products = [
  {
    id: 1,
    name: "Yara Crimson Lehenga Set",
    price: "₹14,999",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600&auto=format&fit=crop",
    tag: "HANDCRAFTED IN LKO"
  },
  {
    id: 2,
    name: "Meher Emerald Saree",
    price: "₹8,499",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop",
    tag: "BESTSELLER"
  },
  {
    id: 3,
    name: "Noor Pearl Choker",
    price: "₹3,999",
    image: "https://images.unsplash.com/photo-1599643478524-fb524419de0f?q=80&w=600&auto=format&fit=crop",
    tag: "NEW ARRIVAL"
  },
  {
    id: 4,
    name: "Zoya Velvet Kurta Set",
    price: "₹6,299",
    image: "https://images.unsplash.com/photo-1583391733958-d25e07fac04f?q=80&w=600&auto=format&fit=crop"
  }
];

const TrendingNow = () => {
  return (
    <section className="py-20 bg-brand-cream" id="new-arrivals">
      <div className="container-custom">
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-md">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-2 font-bold leading-tight">
              Trending<br/>Now
            </h2>
            <div className="w-24 h-[2px] bg-brand-gold mt-4"></div>
          </div>
          <a href="/shop" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest font-medium hover:text-brand-red transition-colors">
            See All <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {products.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {item.tag && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-3 py-1 text-[10px] font-semibold tracking-widest uppercase">
                    {item.tag}
                  </div>
                )}
                {/* Add to cart overlay */}
                <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 bg-gradient-to-t from-black/60 to-transparent">
                  <button className="w-full justify-center bg-white text-gray-900 py-3 text-sm font-medium tracking-wider uppercase hover:bg-brand-red hover:text-white transition-colors flex items-center gap-2">
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                </div>
              </div>
              <div>
                <h3 className="font-serif text-lg text-gray-900 mb-1">{item.name}</h3>
                <p className="text-sm font-semibold text-brand-gold">{item.price}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-center md:hidden">
          <a href="/shop" className="flex items-center gap-2 text-sm uppercase tracking-[2px] font-medium hover:text-brand-red transition-colors border-b border-gray-900 pb-1">
            See All <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
