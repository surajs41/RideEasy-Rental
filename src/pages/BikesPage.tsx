
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BikeCard from '../components/BikeCard';
import { bikes } from '../data/bikes';
import { Search, Filter } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const BikesPage = () => {
  const { user } = useAuth();
  const [filteredBikes, setFilteredBikes] = useState(bikes);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  
  useEffect(() => {
    // Filter bikes based on search term and selected type
    const filtered = bikes.filter(bike => {
      const matchesSearch = bike.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           bike.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || bike.type === selectedType;
      return matchesSearch && matchesType;
    });
    
    setFilteredBikes(filtered);
  }, [searchTerm, selectedType]);
  
  const bikeTypes = ['all', 'scooter', 'commuter', 'electric', 'touring', 'sports', 'adventure'];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">Available Bikes</h1>
            
            <div className="w-full md:w-auto flex items-center">
              <div className="relative flex-grow md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search bikes..." 
                  className="pl-10 pr-4 py-2 border rounded-md w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="mb-8 border-b pb-4">
            <div className="flex items-center mb-3">
              <Filter size={18} className="text-gray-700 mr-2" />
              <h3 className="font-medium">Filter by Type</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {bikeTypes.map(type => (
                <button
                  key={type}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedType === type 
                      ? 'bg-brand-blue text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          
          {filteredBikes.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No bikes found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBikes.map((bike) => (
                <BikeCard key={bike.id} bike={bike} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BikesPage;
