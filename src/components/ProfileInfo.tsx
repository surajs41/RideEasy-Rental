
import React, { useState, useEffect } from 'react';
import { Camera, Edit, Check, X } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { updateUserProfile, uploadAvatar } from '@/lib/auth';

const ProfileInfo = () => {
  const { toast } = useToast();
  const { profile } = useAuth();
  
  const [editing, setEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editedData, setEditedData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    driving_license_number: '',
    date_of_birth: '',
    avatar_url: '',
  });
  
  // Set initial data when profile is loaded
  useEffect(() => {
    if (profile) {
      setEditedData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        address: profile.address || '',
        driving_license_number: profile.driving_license_number || '',
        date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : '',
        avatar_url: profile.avatar_url || '',
      });
    }
  }, [profile]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedData({
      ...editedData,
      [name]: value
    });
  };
  
  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile({
        first_name: editedData.first_name,
        last_name: editedData.last_name,
        address: editedData.address,
        date_of_birth: editedData.date_of_birth,
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      setEditing(false);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      
      toast({
        title: "Update Failed",
        description: error.message || "There was a problem updating your profile.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelEdit = () => {
    if (profile) {
      setEditedData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        address: profile.address || '',
        driving_license_number: profile.driving_license_number || '',
        date_of_birth: profile.date_of_birth ? new Date(profile.date_of_birth).toISOString().split('T')[0] : '',
        avatar_url: profile.avatar_url || '',
      });
    }
    setEditing(false);
  };
  
  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      try {
        // Upload to Supabase Storage
        const avatarUrl = await uploadAvatar(file);
        
        setEditedData({
          ...editedData,
          avatar_url: avatarUrl,
        });
        
        toast({
          title: "Avatar Updated",
          description: "Your profile photo has been updated.",
        });
      } catch (error: any) {
        console.error("Error uploading avatar:", error);
        
        toast({
          title: "Upload Failed",
          description: error.message || "There was a problem uploading your photo.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  if (!profile) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
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
              disabled={isLoading}
            >
              <X size={18} className="mr-1" />
              Cancel
            </button>
            <button 
              onClick={handleSaveProfile}
              className="flex items-center px-3 py-1 text-green-600 border border-green-600 rounded hover:bg-green-50 relative"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="opacity-0">
                    <Check size={18} className="mr-1" />
                    Save
                  </span>
                  <span className="absolute inset-0 flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                </>
              ) : (
                <>
                  <Check size={18} className="mr-1" />
                  Save
                </>
              )}
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
              {editedData.avatar_url ? (
                <img 
                  src={editedData.avatar_url}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-400">
                  {editedData.first_name?.charAt(0)}{editedData.last_name?.charAt(0)}
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
            {profile.first_name} {profile.last_name}
          </h3>
          <p className="text-gray-600 text-center">{profile.email}</p>
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
                  name="first_name"
                  value={editedData.first_name}
                  onChange={handleInputChange}
                  className="input-field"
                />
              ) : (
                <div className="input-field bg-gray-50">{editedData.first_name}</div>
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
                  name="last_name"
                  value={editedData.last_name}
                  onChange={handleInputChange}
                  className="input-field"
                />
              ) : (
                <div className="input-field bg-gray-50">{editedData.last_name}</div>
              )}
            </div>
            
            {/* Email */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <div className="input-field bg-gray-50 text-gray-500">{editedData.email}</div>
            </div>
            
            {/* Date of Birth */}
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Date of Birth
              </label>
              {editing ? (
                <input
                  type="date"
                  name="date_of_birth"
                  value={editedData.date_of_birth}
                  onChange={handleInputChange}
                  className="input-field"
                />
              ) : (
                <div className="input-field bg-gray-50">
                  {editedData.date_of_birth ? new Date(editedData.date_of_birth).toLocaleDateString() : ''}
                </div>
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
                <div className="input-field bg-gray-50 min-h-[80px]">{editedData.address}</div>
              )}
            </div>
            
            {/* Driving License */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 font-medium mb-1">
                Driving License Number
              </label>
              <div className="input-field bg-gray-50 text-gray-500">{editedData.driving_license_number}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
