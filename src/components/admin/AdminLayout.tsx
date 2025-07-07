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
  X,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useHideChatElements } from '@/hooks/useHideChatElements';
import DashboardOverview from './DashboardOverview';
import UsersManagement from './UsersManagement';
import BikesManagement from './BikesManagement';
import AdminBookingsList from './AdminBookingsList';
import { useNotificationContext } from '@/contexts/NotificationContext';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const { notifications, markAsRead, fetchNotifications } = useNotificationContext();
  const [notifOpen, setNotifOpen] = useState(false);

  // Hide chat elements (sliding contact buttons, chatbots, etc.) on admin pages
  useHideChatElements();

  // Fetch admin notifications (admin user_id can be 'admin' or from auth context)
  React.useEffect(() => {
    fetchNotifications('admin');
  }, []);

  const unreadCount = notifications.filter(n => !n.is_read).length;

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
  ];

  // Helper for notification color
  const getNotifColor = (notif) => {
    if (notif.status === 'approved' || notif.type === 'payment') return 'bg-green-100 border-green-400';
    if (notif.status === 'rejected') return 'bg-red-100 border-red-400';
    if (notif.type === 'offer' || notif.status === 'info') return 'bg-yellow-100 border-yellow-400';
    return 'bg-gray-50 border-gray-200';
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'users':
        return <UsersManagement />;
      case 'bikes':
        return <BikesManagement />;
      case 'bookings':
        return <AdminBookingsList />;
      
      default:
        return children;
    }
  };

  return (
    <div className="relative flex h-screen bg-gray-100">
      {/* Sidebar Toggle (Hamburger) */}
      <button
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-md transition-all duration-300"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        {isSidebarOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="fixed md:relative w-64 h-screen bg-[#181F2A] text-white shadow-xl z-40 flex flex-col"
            style={{ left: 0, top: 0 }}
          >
            {/* Logo Area */}
            <div className="flex items-center justify-center h-24 mb-4">
              <img src="/images/bikes/RideEasy.png" alt="RideEasy Logo" className="h-20 w-auto drop-shadow-lg" />
            </div>
            <div className="px-6 pb-2">
              <span className="text-2xl font-extrabold tracking-tight font-sans">RideEasy Admin</span>
              <div className="text-xs text-gray-400 font-medium mt-1">Dashboard</div>
            </div>
            <nav className="mt-8 flex-1 flex flex-col gap-1 px-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center w-full px-5 py-3 rounded-xl font-semibold text-base transition-all duration-150 gap-3
                    ${activeSection === item.id
                      ? 'bg-[#232B3E] text-[#FF4B4B] border-l-4 border-[#FF4B4B]'
                      : 'text-gray-200 hover:bg-[#232B3E] hover:text-white'}
                  `}
                >
                  <item.icon size={22} />
                  <span>{item.label}</span>
                </button>
              ))}
              <div className="flex-1" />
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-5 py-3 rounded-xl font-semibold text-base text-white bg-[#FF4B4B] hover:bg-[#e03a3a] transition-all gap-3 mb-6"
              >
                <LogOut size={22} />
                <span>Logout</span>
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div
        className={`flex-1 overflow-auto h-full ${!isSidebarOpen ? 'pl-16' : ''}`}
        style={{ minWidth: 0, marginTop: 0 }}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold capitalize">
              {menuItems.find(item => item.id === activeSection)?.label}
            </h1>
            {/* Admin Notification Bell */}
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
                <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg z-50 border overflow-hidden">
                  <div className="p-3 border-b font-semibold text-gray-700 flex justify-between items-center">
                    Notifications
                    <button className="text-xs text-blue-500 hover:underline" onClick={() => setNotifOpen(false)}>Close</button>
                  </div>
                  <div className="max-h-96 overflow-y-auto divide-y">
                    {notifications.length === 0 && (
                      <div className="p-4 text-gray-500 text-center">No notifications yet.</div>
                    )}
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className={`w-full text-left px-4 py-3 border-l-4 ${getNotifColor(notif)} hover:bg-blue-50 transition flex flex-col ${notif.is_read ? 'opacity-70' : ''}`}
                      >
                        <span className="text-sm font-medium flex items-center gap-2">
                          {notif.status === 'approved' || notif.type === 'payment' ? '✅' : notif.status === 'rejected' ? '❌' : notif.type === 'offer' ? '🔥' : '🟡'}
                          {notif.message}
                        </span>
                        <span className="text-xs text-gray-400 mt-1">{new Date(notif.timestamp).toLocaleString()}</span>
                        {/* Example action buttons for booking requests */}
                        {notif.type === 'booking' && notif.status === 'info' && (
                          <div className="mt-2 flex gap-2">
                            <button className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600">Approve</button>
                            <button className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">Reject</button>
                            <button className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600">View</button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout; 