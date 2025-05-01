
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BikeDetail from '../components/BikeDetail';
import { bikes } from '../data/bikes';

const BikeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<{ firstName: string; avatarUrl?: string } | null>(null);
  
  useEffect(() => {
    // In a real app, this would check Supabase auth session
    const userJson = localStorage.getItem('rideEasyUser');
    if (userJson) {
      const userData = JSON.parse(userJson);
      setUser({
        firstName: userData.firstName,
        avatarUrl: userData.avatarUrl,
      });
    }
  }, []);
  
  const bike = bikes.find(b => b.id === id);
  
  if (!bike) {
    return <Navigate to="/bikes" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      
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
