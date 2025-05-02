import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, profile, logout } = useAuth();
  
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        
        <Link to="/" className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
          RideEasy
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/bikes" className="text-gray-700 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors">
            Bikes
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors">
            Contact
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="text-gray-700 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors">
                {profile?.first_name || 'Profile'}
              </Link>
              <Link to="/bookings" className="text-gray-700 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors">
                Bookings
              </Link>
              <button 
                onClick={logout} 
                className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-gray-700 hover:text-cyan-600 dark:text-gray-300 dark:hover:text-cyan-400 transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md transition-colors">
                Register
              </Link>
            </div>
          )}

          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
