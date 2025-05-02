
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '@/contexts/AuthContext';

const SettingsPage = () => {
  const { profile } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Account Settings</h1>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Preferences</h2>
            <p className="text-gray-500 mb-6">Manage your account settings and preferences</p>
            
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Notifications</h3>
                <p className="text-sm text-gray-500 mb-4">Manage how you receive notifications</p>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="emailNotifications" 
                    className="rounded text-cyan-500 focus:ring-cyan-500 mr-2" 
                    defaultChecked 
                  />
                  <label htmlFor="emailNotifications" className="text-sm">
                    Email notifications
                  </label>
                </div>
              </div>
              
              <div className="border-b pb-4">
                <h3 className="font-medium mb-2">Language</h3>
                <p className="text-sm text-gray-500 mb-4">Choose your preferred language</p>
                <select className="rounded border-gray-300 text-sm focus:border-cyan-500 focus:ring-cyan-500 w-full md:w-1/3">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-500 mb-4">Irreversible and destructive actions</p>
                <button className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-md text-sm font-medium">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
