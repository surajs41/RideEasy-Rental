
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BikeDetail from '../components/BikeDetail';
import { bikes } from '../data/bikes';
import { useAuth } from '@/contexts/AuthContext';

const BikeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const bike = bikes.find(b => b.id === id);
  
  if (!bike) {
    return <Navigate to="/bikes" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <a 
              href="/bikes" 
              className="text-brand-blue hover:underline flex items-center"
            >
              ← Back to all bikes
            </a>
          </div>
          
          <BikeDetail bike={bike} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BikeDetailsPage;
