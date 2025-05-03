import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bike as BikeIcon } from 'lucide-react';
import { Bike } from '../types';

interface BikeCardProps {
  bike: Bike;
}

const BikeCard: React.FC<BikeCardProps> = ({ bike }) => {
  const [imageError, setImageError] = useState(false);
  const bikePlaceholder = 'https://placehold.co/600x400/e2e8f0/475569?text=Bike+Image';
  
  const handleImageError = () => {
    setImageError(true);
  };

  // Try .avif format first, then fall back to .jpg
  const getImageUrl = () => {
    if (imageError) return bikePlaceholder;
    const baseUrl = bike.imageUrl.replace('.jpg', '');
    return `${baseUrl}.avif`;
  };
  
  return (
    <div className="bike-card group">
      <div className="relative overflow-hidden rounded-t-lg h-48 bg-gray-100">
        <img 
          src={getImageUrl()}
          alt={bike.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={handleImageError}
          loading="lazy"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <Link 
              to={`/bikes/${bike.id}`} 
              className="w-full bg-white/90 backdrop-blur-sm text-cyan-800 py-2 px-4 rounded-md font-semibold flex items-center justify-center hover:bg-white transition-colors"
            >
              View Details
            </Link>
          </div>
        </div>
        <div className="absolute top-2 right-2 bg-cyan-500 text-white py-1 px-2 rounded text-sm font-medium shadow-md">
          {bike.type.charAt(0).toUpperCase() + bike.type.slice(1)}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{bike.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{bike.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <BikeIcon size={16} className="text-cyan-500 mr-1" />
            <span className="text-gray-700 font-semibold">₹{bike.pricePerDay}</span>
            <span className="text-gray-500 text-sm">/day</span>
          </div>
          
          <Link 
            to={`/bikes/${bike.id}`} 
            className="text-cyan-600 hover:text-cyan-800 font-medium text-sm flex items-center transition-colors"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
