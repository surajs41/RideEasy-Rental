
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-blue-50 to-cyan-50 overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 max-w-xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Discover the <span className="text-cyan-500">Freedom</span> 
              <br />of Two Wheels
            </h1>
            <p className="text-lg text-gray-700">
              Rent high-quality bikes for your adventures, commuting, 
              or leisure. Fast, easy, and affordable.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/bikes" 
                className="bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-6 rounded-md font-medium flex items-center"
              >
                Rent Now <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link 
                to="/about" 
                className="bg-transparent border border-cyan-500 text-cyan-500 hover:bg-cyan-50 py-3 px-6 rounded-md font-medium"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="/lovable-uploads/21b4240a-6007-462e-ade2-ef063adf5e3d.jpg" 
              alt="Red sport motorcycle" 
              className="rounded-lg shadow-xl w-full object-cover h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
