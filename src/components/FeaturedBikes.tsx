
import React from 'react';
import { Link } from 'react-router-dom';
import BikeCard from './BikeCard';
import { bikes } from '../data/bikes';

const FeaturedBikes = () => {
  // Select 4 featured bikes
  const featuredBikes = bikes.slice(0, 4);

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Featured Bikes</h2>
          <Link to="/bikes" className="text-brand-blue hover:underline font-medium flex items-center">
            View All
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBikes.map((bike) => (
            <div key={bike.id} className="animate-fade-in">
              <BikeCard bike={bike} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedBikes;
