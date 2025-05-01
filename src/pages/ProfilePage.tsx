
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileInfo from '../components/ProfileInfo';
import BookingsList from '../components/BookingsList';

const ProfilePage = () => {
  const [user, setUser] = useState<{ firstName: string; avatarUrl?: string } | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  
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
          <h1 className="text-3xl font-bold mb-8">My Account</h1>
          
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="flex border-b overflow-x-auto">
              <button
                className={`px-6 py-3 font-medium text-sm hover:bg-gray-50 transition-colors ${
                  activeTab === 'profile' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Personal Information
              </button>
              <button
                className={`px-6 py-3 font-medium text-sm hover:bg-gray-50 transition-colors ${
                  activeTab === 'bookings' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-gray-600'
                }`}
                onClick={() => setActiveTab('bookings')}
              >
                My Bookings
              </button>
            </div>
          </div>
          
          {activeTab === 'profile' ? <ProfileInfo /> : <BookingsList />}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProfilePage;
