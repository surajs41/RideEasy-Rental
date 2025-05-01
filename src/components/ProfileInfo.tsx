
import React, { useState } from 'react';
import { Camera, Edit, Check, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const ProfileInfo = () => {
  const { toast } = useToast();
  const userJson = localStorage.getItem('rideEasyUser');
  const initialUserData = userJson ? JSON.parse(userJson) : null;
  
  const [userData, setUserData] = useState({
    firstName: initialUserData?.firstName || '',
    lastName: initialUserData?.lastName || '',
    email: initialUserData?.email || '',
    address: initialUserData?.address || '',
    drivingLicenseNumber: initialUserData?.drivingLicenseNumber || '',
    dateOfBirth: initialUserData?.dateOfBirth || '',
    avatarUrl: initialUserData?.avatarUrl || '',
  });
  
  const [editing, setEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...userData });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value
    });
  };
  
  const handleSaveProfile = () => {
    setUserData(editedData);
    
    // In a real app, this would connect to Supabase to update the user data
    // For demo, we'll update localStorage
    if (initialUserData) {
      const updatedUser = {
        ...initialUserData,
        firstName: editedData.firstName,
        lastName: editedData.lastName,
        address: editedData.address,
        dateOfBirth: editedData.dateOfBirth,
        avatarUrl: editedData.avatarUrl,
      };
      localStorage.setItem('rideEasyUser', JSON.stringify(updatedUser));
    }
    
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    
    setEditing(false);
  };
  
  const handleCancelEdit = () => {
    setEditedData(userData);
    setEditing(false);
  };
  
  const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to Supabase storage
      // For demo, we'll use local URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData({
          ...editedData,
          avatarUrl: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
    }
  };
  
  if (!initialUserData) {
    return (
      <div className="text-center p-8">
        <p>Please log in to view your profile.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-4xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Personal Information</h2>
        
        {editing ? (
          <div className="flex space-x-2">
            <button 
              onClick={handleCancelEdit}
              className="flex items-center px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-50"
            >
              <X size={18} className="mr-1" />
              Cancel
            </button>
            <button 
              onClick={handleSaveProfile}
              className="flex items-center px-3 py-1 text-green-600 border border-green-600 rounded hover:bg-green-50"
            >
              <Check size={18} className="mr-1" />
              Save
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setEditing(true)}
            className="flex items-center px-3 py-1 text-brand-blue border border-brand-blue rounded hover:bg-blue-50"
          >
            <Edit size={18} className="mr-1" />
            Edit Profile
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Avatar & Name */}
        <div className="md:col-span-1 flex flex-col items-center">
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-brand-blue">
              {editedData.avatarUrl ? (
                <img 
                  src={editedData.avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                  {userData.firstName?.charAt(0)}{userData.lastName?.charAt(0)}
                </div>
              )}
            </div>
            
            {editing && (
              <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-brand-blue text-white p-2 rounded-full cursor-pointer hover:bg-brand-dark-blue">
                <Camera size={18} />
                <input 
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUploadAvatar}
                />
              </label>
            )}
          </div>
          
          <h3 className="text-xl font-bold text-center">
            {userData.firstName} {userData.lastName}
          </h3>
          <p className="text-gray-600 text-center">{userData.email}</p>
        </div>
        
        {/* Profile Fields */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                First Name
              </label>
              {editing ? (
                <input
                  type="text"
                  name="firstName"
                  value={editedData.firstName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              ) : (
                <div className="input-field bg-gray-50">{userData.firstName}</div>
              )}
            </div>
            
            {/* Last Name */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Last Name
              </label>
              {editing ? (
                <input
                  type="text"
                  name="lastName"
                  value={editedData.lastName}
                  onChange={handleInputChange}
                  className="input-field"
                />
              ) : (
                <div className="input-field bg-gray-50">{userData.lastName}</div>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <div className="input-field bg-gray-50 text-gray-500">{userData.email}</div>
            </div>
            
            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Date of Birth
              </label>
              {editing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editedData.dateOfBirth}
                  onChange={handleInputChange}
                  className="input-field"
                />
              ) : (
                <div className="input-field bg-gray-50">{userData.dateOfBirth}</div>
              )}
            </div>
            
            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Address
              </label>
              {editing ? (
                <textarea
                  name="address"
                  value={editedData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-field"
                />
              ) : (
                <div className="input-field bg-gray-50 min-h-[80px]">{userData.address}</div>
              )}
            </div>
            
            {/* Driving License */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Driving License Number
              </label>
              <div className="input-field bg-gray-50 text-gray-500">{userData.drivingLicenseNumber}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
