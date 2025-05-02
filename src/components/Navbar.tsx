
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, BookOpen, LogOut, Settings } from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut: authSignOut, profile } = useAuth();
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
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-brand-orange">
            Ride<span className="text-brand-orange">Easy</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-brand-blue font-medium">Home</Link>
          <Link to="/bikes" className="text-gray-700 hover:text-brand-blue font-medium">Bikes</Link>
          <Link to="/about" className="text-gray-700 hover:text-brand-blue font-medium">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-brand-blue font-medium">Contact</Link>
        </div>

        {/* Search and Auth */}
        <div className="hidden md:flex items-center space-x-4">
          <button onClick={() => navigate('/bikes')} className="relative p-2 rounded-full hover:bg-gray-100">
            <Search size={20} className="text-gray-600" />
          </button>
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 focus:outline-none">
                  {profile?.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.first_name}
                      className="w-9 h-9 rounded-full object-cover border border-gray-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-brand-blue flex items-center justify-center text-white font-semibold cursor-pointer">
                      {profile?.first_name ? profile.first_name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profile?.first_name} {profile?.last_name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/bookings" className="flex items-center cursor-pointer">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>My Bookings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="font-medium text-gray-700">
                Log In
              </Link>
              <Link to="/register" className="bg-cyan-500 hover:bg-cyan-600 text-white px-5 py-2 rounded-md font-medium">
                Sign Up
              </Link>
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
          <Link to="/" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">Home</Link>
          <Link to="/bikes" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">Bikes</Link>
          <Link to="/about" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">About</Link>
          <Link to="/contact" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">Contact</Link>
          
          {user ? (
            <>
              <Link to="/profile" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">My Profile</Link>
              <Link to="/bookings" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">My Bookings</Link>
              <Link to="/settings" className="block py-2 px-4 text-gray-700 hover:bg-gray-100">Settings</Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-2 px-4 pt-2">
              <Link to="/login" className="font-medium text-center py-2">Log In</Link>
              <Link to="/register" className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md font-medium text-center">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
