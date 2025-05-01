
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, X, Search } from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';

interface NavbarProps {
  user: {
    firstName: string;
    avatarUrl?: string;
  } | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signOut: authSignOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authSignOut();
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and brand name */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl text-brand-blue font-bold">RideEasy</span>
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex items-center flex-grow max-w-md mx-4">
          <div className="relative w-full">
            <input 
              type="text" 
              placeholder="Search for bikes..." 
              className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-brand-blue transition-colors">Home</Link>
          <Link to="/bikes" className="text-gray-700 hover:text-brand-blue transition-colors">Bikes</Link>
          <Link to="/about" className="text-gray-700 hover:text-brand-blue transition-colors">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-brand-blue transition-colors">Contact</Link>
          
          {user ? (
            <div className="relative group">
              <button className="flex items-center space-x-2">
                {user.avatarUrl ? (
                  <img 
                    src={user.avatarUrl} 
                    alt={user.firstName}
                    className="w-8 h-8 rounded-full object-cover border-2 border-brand-blue"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand-blue flex items-center justify-center text-white">
                    {user.firstName.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 invisible group-hover:visible transition-all opacity-0 group-hover:opacity-100">
                <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Profile</Link>
                <Link to="/bookings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Bookings</Link>
                <button 
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="btn-outline">Log in</Link>
              <Link to="/register" className="btn-primary">Register</Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-3 pb-3">
          {/* Mobile search */}
          <div className="px-4 pb-3 pt-1">
            <div className="relative w-full">
              <input 
                type="text" 
                placeholder="Search for bikes..." 
                className="w-full border border-gray-300 rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          
          <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">Home</Link>
          <Link to="/bikes" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">Bikes</Link>
          <Link to="/about" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">About</Link>
          <Link to="/contact" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">Contact</Link>
          
          {user ? (
            <>
              <Link to="/profile" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">My Profile</Link>
              <Link to="/bookings" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">My Bookings</Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 px-4 pt-2">
              <Link to="/login" className="btn-outline text-center">Log in</Link>
              <Link to="/register" className="btn-primary text-center">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
