import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { signIn } from '@/lib/auth';

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
    general: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {
      email: '',
      password: '',
      general: ''
    };
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Admin login check
      if (isAdmin) {
        if (formData.email === 'admin@bike.in' && formData.password === 'admin@123') {
          // For demo admin login
          localStorage.setItem('rideEasyUser', JSON.stringify({
            id: 'admin-123',
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@bike.in',
            role: 'admin'
          }));
          
          toast({
            title: "Admin login successful",
            description: "Welcome to the admin dashboard.",
          });
          
          // Use direct window.location.href navigation to ensure full page reload
          window.location.href = '/admin';
          return;
        } else {
          toast({
            title: "Admin login failed",
            description: "Invalid admin credentials.",
            variant: "destructive"
          });
        }
      } else {
        // Regular user login with Supabase
        const { session } = await signIn(formData.email, formData.password);
        
        if (session) {
          toast({
            title: "Login successful!",
            description: "Welcome back to RideEasy.",
          });
          navigate(from);
        }
      }
    } catch (error: any) {
      console.error("Login error:", error);
      setErrors({
        ...errors,
        general: error.message || 'Login failed. Please try again.'
      });
      
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6">Log in to RideEasy</h2>
      
      {/* User/Admin toggle */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-200 rounded-full p-1 flex">
          <button
            className={`px-4 py-2 rounded-full transition-all ${!isAdmin ? 'bg-white shadow-sm text-brand-blue font-medium' : 'text-gray-500'}`}
            onClick={() => setIsAdmin(false)}
          >
            User Login
          </button>
          <button
            className={`px-4 py-2 rounded-full transition-all ${isAdmin ? 'bg-white shadow-sm text-brand-blue font-medium' : 'text-gray-500'}`}
            onClick={() => setIsAdmin(true)}
          >
            Admin Login
          </button>
        </div>
      </div>
      
      {errors.general && (
        <div className="p-3 mb-4 bg-red-50 text-red-600 border border-red-200 rounded">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={isAdmin ? "admin@bike.in" : "your@email.com"}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              className="input-field pr-10"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={isAdmin ? "admin@123" : "••••••••"}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        
        <button 
          type="submit" 
          className="w-full btn-primary relative"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="opacity-0">{isAdmin ? "Admin Login" : "Log In"}</span>
              <span className="absolute inset-0 flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            </>
          ) : (
            isAdmin ? "Admin Login" : "Log In"
          )}
        </button>
      </form>
      
      {!isAdmin && (
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account? {" "}
            <a href="/register" className="text-brand-blue hover:underline">
              Register
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
