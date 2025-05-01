
import React from 'react';
import { Link } from 'react-router-dom';
import { Bike as BikeIcon } from 'lucide-react';
import { Bike } from '../types';

interface BikeCardProps {
  bike: Bike;
}

const BikeCard: React.FC<BikeCardProps> = ({ bike }) => {
  const bikePlaceholder = 'https://placehold.co/600x400/e2e8f0/475569?text=Bike+Image';
  
  return (
    <div className="bike-card group">
      <div className="relative overflow-hidden">
        <img 
          src={bike.imageUrl || bikePlaceholder}
          alt={bike.name}
          className="bike-card-image group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = bikePlaceholder;
          }}
        />
        <div className="absolute top-2 right-2 bg-brand-blue text-white py-1 px-2 rounded text-sm font-medium">
          {bike.type}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{bike.name}</h3>
        <p className="text-gray-600 text-sm mb-3">{bike.description.length > 100 ? `${bike.description.substring(0, 100)}...` : bike.description}</p>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <BikeIcon size={16} className="text-brand-blue mr-1" />
            <span className="text-gray-700 font-semibold">₹{bike.pricePerDay}</span>
            <span className="text-gray-500 text-sm">/day</span>
          </div>
          
          <Link to={`/bikes/${bike.id}`} className="btn-primary py-1 px-3 text-sm">
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BikeCard;
