import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Bike, 
  Calendar, 
  Settings, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import DashboardOverview from './DashboardOverview';
import UsersManagement from './UsersManagement';
import BikesManagement from './BikesManagement';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('rideEasyUser');
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin account.",
    });
    navigate('/login');
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'bikes', label: 'Bikes', icon: Bike },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'users':
        return <UsersManagement />;
      case 'bikes':
        return <BikesManagement />;
      case 'bookings':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">View and manage bookings, check payment status, etc.</p>
            <p className="mt-4 text-gray-500">Coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-gray-600">Configure system settings, manage admin access, etc.</p>
            <p className="mt-4 text-gray-500">Coming soon...</p>
          </div>
        );
      default:
        return children;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile Sidebar Toggle */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed md:relative w-64 h-screen bg-brand-dark-blue text-white z-40"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold">RideEasy Admin</h2>
            </div>

            <nav className="mt-6">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center w-full px-6 py-3 transition-all ${
                    activeSection === item.id
                      ? 'bg-brand-blue/30 border-l-4 border-white'
                      : 'hover:bg-brand-blue/20'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="ml-3">{item.label}</span>
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-6 py-3 mt-8 text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-all"
              >
                <LogOut size={20} />
                <span className="ml-3">Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold capitalize">
              {menuItems.find(item => item.id === activeSection)?.label}
            </h1>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 