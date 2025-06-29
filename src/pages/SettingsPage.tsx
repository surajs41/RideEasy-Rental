import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Moon, Sun, Globe, Trash2, Save, Loader2 } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { supabase } from '@/integrations/supabase/client';

// Language options
const LANGUAGES = [
  { id: 'en', name: 'English', flag: '🇬🇧' },
  { id: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { id: 'mr', name: 'मराठी', flag: '🇮🇳' },
];

// Theme options
const THEMES = [
  { id: 'light', icon: <Sun className="h-5 w-5" /> },
  { id: 'dark', icon: <Moon className="h-5 w-5" /> },
  { id: 'system', icon: <Globe className="h-5 w-5" /> },
];

const SettingsPage = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [currentTheme, setCurrentTheme] = useState('light');
  
  // Settings state
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    darkMode: false,
    autoSave: true,
    twoFactorAuth: false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Simulating loading state for better UX
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Handle settings change
  const handleSettingChange = (setting: string) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    
    // Show feedback to user
    toast({
      title: "Setting updated",
      description: `${setting.charAt(0).toUpperCase() + setting.slice(1)} has been ${!settings[setting as keyof typeof settings] ? 'enabled' : 'disabled'}.`,
    });
  };

  // Handle language change
  const handleLanguageChange = (languageId: string) => {
    setCurrentLanguage(languageId);
    
    // Show feedback to user
    const language = LANGUAGES.find(lang => lang.id === languageId);
    toast({
      title: "Language changed",
      description: `Application language set to ${language?.name}.`,
    });
    
    // In a real app, you'd update language throughout the app
    // document.documentElement.lang = languageId;
  };

  // Handle theme change
  const handleThemeChange = (themeId: string) => {
    setCurrentTheme(themeId);
    
    toast({
      title: "Theme updated",
      description: `Theme set to ${themeId}.`,
    });
    
    // In a real app, you'd use a theme provider
    // document.documentElement.classList.toggle('dark', themeId === 'dark');
  };

  // Handle delete account
  const handleDeleteAccount = () => {
    setShowDeleteConfirm(true);
  };

  const deleteUser = async () => {
    setIsDeleting(true);
    try {
      const session = await supabase.auth.getSession();
      const accessToken = session.data.session?.access_token;
      if (!accessToken) throw new Error('Not authenticated');
      const res = await fetch('/api/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete account');
      await supabase.auth.signOut();
      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted.',
      });
      window.location.href = '/';
    } catch (error: any) {
      toast({
        title: 'Delete Failed',
        description: error.message || 'There was a problem deleting your account.',
        variant: 'destructive',
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-8 bg-gradient-to-b from-gray-50 to-gray-100 animate-fade-in">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-brand-orange">
            Account Settings
          </h1>
          <p className="text-gray-600 mb-8">Customize your RideEasy experience</p>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-brand-blue" />
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-8">
              {/* Notifications Panel */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:shadow-xl border border-gray-100 w-full">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Bell className="h-5 w-5 text-brand-blue mr-2" />
                    <h2 className="text-xl font-semibold">Notifications</h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Control how you receive notifications</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email notifications</p>
                        <p className="text-sm text-gray-500">Get updates via email</p>
                      </div>
                      <Switch 
                        checked={settings.emailNotifications} 
                        onCheckedChange={() => handleSettingChange('emailNotifications')} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS notifications</p>
                        <p className="text-sm text-gray-500">Get updates via text message</p>
                      </div>
                      <Switch 
                        checked={settings.smsNotifications} 
                        onCheckedChange={() => handleSettingChange('smsNotifications')} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Marketing emails</p>
                        <p className="text-sm text-gray-500">Receive promotional emails</p>
                      </div>
                      <Switch 
                        checked={settings.marketingEmails} 
                        onCheckedChange={() => handleSettingChange('marketingEmails')} 
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Language Panel */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:shadow-xl border border-gray-100 w-full">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Globe className="h-5 w-5 text-brand-blue mr-2" />
                    <h2 className="text-xl font-semibold">Language</h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Choose your preferred language</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {LANGUAGES.map((language) => (
                      <button
                        key={language.id}
                        onClick={() => handleLanguageChange(language.id)}
                        className={`flex items-center justify-center p-3 rounded-md transition-all ${
                          currentLanguage === language.id
                            ? 'bg-brand-blue text-white scale-105'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        <span className="text-xl mr-2">{language.flag}</span>
                        <span>{language.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Theme Panel */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:shadow-xl border border-gray-100 w-full">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <Sun className="h-5 w-5 text-brand-blue mr-2" />
                    <h2 className="text-xl font-semibold">Appearance</h2>
                  </div>
                  <p className="text-sm text-gray-500 mb-4">Customize the look and feel</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeChange(theme.id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-md transition-all ${
                          currentTheme === theme.id
                            ? 'bg-brand-blue text-white scale-105'
                            : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                      >
                        {theme.icon}
                        <span className="mt-2 capitalize">{theme.id}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* Security Panel */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:shadow-xl border border-gray-100 w-full">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Security</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-factor authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security</p>
                      </div>
                      <Switch 
                        checked={settings.twoFactorAuth} 
                        onCheckedChange={() => handleSettingChange('twoFactorAuth')} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-save data</p>
                        <p className="text-sm text-gray-500">Save your progress automatically</p>
                      </div>
                      <Switch 
                        checked={settings.autoSave} 
                        onCheckedChange={() => handleSettingChange('autoSave')} 
                      />
                    </div>
                  </div>
                </div>
              </div>
              {/* Danger Zone Panel */}
              <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all hover:shadow-xl border border-red-100 w-full">
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
                  <p className="text-sm text-gray-500 mb-4">Irreversible and destructive actions</p>
                  <div className="border border-red-200 rounded-md p-4 bg-red-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-700">Delete Account</p>
                        <p className="text-sm text-red-500">Permanently delete your account and all data</p>
                      </div>
                      <Button 
                        variant="destructive" 
                        onClick={handleDeleteAccount}
                        className="bg-white text-red-600 border border-red-600 hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Delete Account
                      </Button>
                    </div>
                  </div>
                  {/* Confirmation Dialog */}
                  {showDeleteConfirm && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
                      <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <h4 className="text-lg font-bold text-red-600 mb-2">Delete Account?</h4>
                        <p className="mb-4 text-gray-700">Are you sure you want to permanently delete your account? This action cannot be undone.</p>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(false)}
                            disabled={isDeleting}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={deleteUser}
                            disabled={isDeleting}
                          >
                            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SettingsPage;
