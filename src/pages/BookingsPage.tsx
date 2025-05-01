
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BookingsList from '../components/BookingsList';
import { useAuth } from '@/contexts/AuthContext';

const BookingsPage = () => {
  const { user } = useAuth();
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
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
