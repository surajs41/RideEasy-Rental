
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-r from-brand-blue to-brand-dark-blue text-white py-16 md:py-24">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in">
            Ride with Freedom, Experience the Thrill
          </h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Discover the best bikes for rent in your city. Easy booking, affordable rates, and hassle-free experience.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/bikes" className="btn-secondary flex items-center justify-center">
              Browse Bikes
              <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link to="/about" className="bg-white text-brand-blue hover:bg-gray-100 py-2 px-4 rounded-md font-semibold transition-colors duration-300 flex items-center justify-center">
              Learn More
            </Link>
          </div>
          
          <div className="mt-10 bg-white rounded-lg shadow-lg p-4 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Search for bikes by name, type or location..." 
                className="pl-10 pr-4 py-3 border-none rounded-md w-full focus:outline-none focus:ring-2 focus:ring-brand-blue bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
