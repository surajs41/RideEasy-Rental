
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProfileInfo from '../components/ProfileInfo';
import BookingsList from '../components/BookingsList';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = React.useState('profile');
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
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
