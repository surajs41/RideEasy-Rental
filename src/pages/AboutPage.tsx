
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const AboutPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">About RideEasy</h1>
              <p className="text-lg text-gray-700">
                Your trusted partner for bike rentals since 2020
              </p>
            </div>
          </div>
        </div>
        
        {/* Our Story */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-gray-700 mb-4">
                  RideEasy was founded with a simple vision: to make quality bikes accessible to everyone, 
                  whether for daily commuting, weekend adventures, or just enjoying the freedom of the open road.
                </p>
                <p className="text-gray-700 mb-4">
                  What started as a small fleet of just 5 bikes in 2020 has grown into a diverse collection 
                  of over 100 bikes across multiple categories, serving thousands of happy riders each year.
                </p>
                <p className="text-gray-700">
                  Our commitment to quality, safety, and customer satisfaction has made us the 
                  preferred choice for bike rentals in the region.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1558981852-426c6c22a060?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Team of mechanics working on motorcycles" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Values */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Safety First</h3>
                <p className="text-gray-600 text-center">
                  All our bikes undergo rigorous safety checks before and after each rental to ensure a safe riding experience.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Quality & Performance</h3>
                <p className="text-gray-600 text-center">
                  We maintain our bikes to the highest standards, ensuring optimal performance for your journey.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2 text-center">Affordability</h3>
                <p className="text-gray-600 text-center">
                  We believe in providing value for money, with competitive pricing and no hidden fees.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Our Team */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="mb-4 overflow-hidden rounded-full mx-auto w-40 h-40">
                  <img 
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="John Doe" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-cyan-600">Founder & CEO</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 overflow-hidden rounded-full mx-auto w-40 h-40">
                  <img 
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="Jane Smith" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Jane Smith</h3>
                <p className="text-cyan-600">Operations Manager</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 overflow-hidden rounded-full mx-auto w-40 h-40">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="Mike Johnson" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Mike Johnson</h3>
                <p className="text-cyan-600">Head Mechanic</p>
              </div>
              
              <div className="text-center">
                <div className="mb-4 overflow-hidden rounded-full mx-auto w-40 h-40">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="Sarah Williams" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold">Sarah Williams</h3>
                <p className="text-cyan-600">Customer Support</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;
