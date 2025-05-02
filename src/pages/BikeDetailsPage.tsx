
import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BikeDetail from '../components/BikeDetail';
import { bikes } from '../data/bikes';
import { useAuth } from '@/contexts/AuthContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51RJpq0H9Jc33ALyLbvLbwlz3XPYOaF10dTvI6KnZqjRxpOgh2OwYFb60BDs0LEKeo9s8LSa0Jx3QGj9sxdiTc7oQ00aMCtIzp0');

const BikeDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  const bike = bikes.find(b => b.id === id);
  
  if (!bike) {
    return <Navigate to="/bikes" replace />;
  }
  
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="container mx-auto px-4">
          <Elements stripe={stripePromise}>
            <BikeDetail bike={bike} />
          </Elements>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BikeDetailsPage;
