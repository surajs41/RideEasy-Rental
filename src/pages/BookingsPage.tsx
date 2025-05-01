
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingsList from '../components/BookingsList';

const BookingsPage = () => {
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
  
  // Redirect to login if not authenticated
  if (user === null) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={user} />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
          
          <BookingsList />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingsPage;
