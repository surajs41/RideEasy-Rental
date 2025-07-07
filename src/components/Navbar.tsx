import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, BookOpen, LogOut, Settings, Bell } from 'lucide-react';
import { useToast } from "../hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationContext } from '@/contexts/NotificationContext';
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
  const { notifications, markAsRead, fetchNotifications } = useNotificationContext();
  const [notifOpen, setNotifOpen] = useState(false);

  // Fetch notifications when user logs in
  React.useEffect(() => {
    if (user) fetchNotifications(user.id);
  }, [user]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

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

  // Helper for notification color
  const getNotifColor = (notif) => {
    if (notif.status === 'approved' || notif.type === 'payment') return 'bg-green-100 border-green-400';
    if (notif.status === 'rejected') return 'bg-red-100 border-red-400';
    if (notif.type === 'offer' || notif.status === 'info') return 'bg-yellow-100 border-yellow-400';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src="/images/bikes/RideEasy.png" alt="RideEasy Logo" className="h-20 mx-auto" style={{ maxWidth: '300px' }} />
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
          {/* Notification Bell */}
          {user && (
            <div className="relative">
              <button
                className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none"
                onClick={() => setNotifOpen((v) => !v)}
              >
                <Bell size={22} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 border overflow-hidden">
                  <div className="p-3 border-b font-semibold text-gray-700 flex justify-between items-center">
                    Notifications
                    <button className="text-xs text-blue-500 hover:underline" onClick={() => setNotifOpen(false)}>Close</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto divide-y">
                    {notifications.length === 0 && (
                      <div className="p-4 text-gray-500 text-center">No notifications yet.</div>
                    )}
                    {notifications.map((notif) => (
                      <button
                        key={notif.id}
                        className={`w-full text-left px-4 py-3 border-l-4 ${getNotifColor(notif)} hover:bg-blue-50 transition flex flex-col ${notif.is_read ? 'opacity-70' : ''}`}
                        onClick={() => markAsRead(notif.id)}
                      >
                        <span className="text-sm font-medium flex items-center gap-2">
                          {notif.status === 'approved' || notif.type === 'payment' ? '✅' : notif.status === 'rejected' ? '❌' : notif.type === 'offer' ? '🔥' : '🟡'}
                          {notif.message}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">{new Date(notif.timestamp).toLocaleString()}</span>
                        {/* Example: clickable for booking details */}
                        {notif.type === 'booking' && (
                          <span className="text-xs text-blue-600 underline cursor-pointer mt-1">View Booking Details</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
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
