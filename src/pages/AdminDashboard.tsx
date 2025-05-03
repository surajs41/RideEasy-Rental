import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Bike as BikeIcon, BookOpen, Settings, LogOut } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState('users');
  const [admin, setAdmin] = useState<{ firstName: string; role: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for demonstration
  const users = [
    { id: 'user-1', firstName: 'John', lastName: 'Doe', email: 'john@example.com', licenseNumber: 'DL12345678' },
    { id: 'user-2', firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', licenseNumber: 'DL87654321' },
    { id: 'user-3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@example.com', licenseNumber: 'DL55667788' },
  ];
  
  useEffect(() => {
    // Check if admin is logged in
    const checkAdminAuth = () => {
      const userJson = localStorage.getItem('rideEasyUser');
      if (userJson) {
        try {
          const userData = JSON.parse(userJson);
          if (userData.role === 'admin') {
            setAdmin(userData);
          }
        } catch (error) {
          console.error("Error parsing admin user data:", error);
        }
      }
      setIsLoading(false);
    };
    
    checkAdminAuth();
  }, []);
  
  const handleLogout = () => {
    localStorage.removeItem('rideEasyUser');
    
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the admin account.",
    });
    
    window.location.href = '/login';
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }
  
  // Redirect to login if not admin
  if (admin === null) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-brand-dark-blue text-white">
        <div className="p-6">
          <h2 className="text-xl font-bold">RideEasy Admin</h2>
        </div>
        
        <nav className="mt-6">
          <div 
            className={`flex items-center px-6 py-3 cursor-pointer hover:bg-brand-blue/20 ${activeSection === 'users' ? 'bg-brand-blue/30 border-l-4 border-white' : ''}`}
            onClick={() => setActiveSection('users')}
          >
            <User size={20} />
            <span className="ml-3">Users</span>
          </div>
          
          <div 
            className={`flex items-center px-6 py-3 cursor-pointer hover:bg-brand-blue/20 ${activeSection === 'bikes' ? 'bg-brand-blue/30 border-l-4 border-white' : ''}`}
            onClick={() => setActiveSection('bikes')}
          >
            <BikeIcon size={20} />
            <span className="ml-3">Bikes</span>
          </div>
          
          <div 
            className={`flex items-center px-6 py-3 cursor-pointer hover:bg-brand-blue/20 ${activeSection === 'bookings' ? 'bg-brand-blue/30 border-l-4 border-white' : ''}`}
            onClick={() => setActiveSection('bookings')}
          >
            <BookOpen size={20} />
            <span className="ml-3">Bookings</span>
          </div>
          
          <div 
            className={`flex items-center px-6 py-3 cursor-pointer hover:bg-brand-blue/20 ${activeSection === 'settings' ? 'bg-brand-blue/30 border-l-4 border-white' : ''}`}
            onClick={() => setActiveSection('settings')}
          >
            <Settings size={20} />
            <span className="ml-3">Settings</span>
          </div>
          
          <div 
            className="flex items-center px-6 py-3 cursor-pointer hover:bg-brand-blue/20 mt-8 text-red-300 hover:text-red-200"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="ml-3">Logout</span>
          </div>
        </nav>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              {activeSection === 'users' && 'User Management'}
              {activeSection === 'bikes' && 'Bike Management'}
              {activeSection === 'bookings' && 'Booking Management'}
              {activeSection === 'settings' && 'Settings'}
            </h1>
            
            <div className="flex items-center">
              <span className="mr-2">Welcome, {admin.firstName}</span>
              <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center text-white">
                {admin.firstName.charAt(0)}
              </div>
            </div>
          </div>
          
          {/* Dashboard content based on active section */}
          {activeSection === 'users' && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {user.licenseNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button className="text-brand-blue hover:text-brand-dark-blue mr-3">View</button>
                        <button className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {activeSection === 'bikes' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">Manage bikes, add new bikes, update details, etc.</p>
              <p className="mt-4 text-gray-500">Coming soon...</p>
            </div>
          )}
          
          {activeSection === 'bookings' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">View and manage bookings, check payment status, etc.</p>
              <p className="mt-4 text-gray-500">Coming soon...</p>
            </div>
          )}
          
          {activeSection === 'settings' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-600">Configure system settings, manage admin access, etc.</p>
              <p className="mt-4 text-gray-500">Coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
