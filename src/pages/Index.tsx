
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import FeaturedBikes from '../components/FeaturedBikes';
import HowItWorks from '../components/HowItWorks';
import TestimonialsSection from '../components/TestimonialsSection';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { user, profile } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <HeroSection />
        <FeaturedBikes />
        <HowItWorks />
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
