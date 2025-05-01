
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const LoginForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    email: '',
    password: ''
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
      password: ''
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Admin login check
    if (isAdmin) {
      if (formData.email === 'admin@bike.in' && formData.password === 'admin@123') {
        const adminUser = {
          id: 'admin-123',
          firstName: 'Admin',
          lastName: 'User',
          email: 'admin@bike.in',
          role: 'admin'
        };
        
        localStorage.setItem('rideEasyUser', JSON.stringify(adminUser));
        
        toast({
          title: "Admin login successful",
          description: "Welcome to the admin dashboard.",
        });
        
        navigate('/admin');
        return;
      } else {
        toast({
          title: "Admin login failed",
          description: "Invalid admin credentials.",
          variant: "destructive"
        });
        return;
      }
    }
    
    // In a real app, this would be replaced with Supabase auth
    // For demo, we'll simulate a successful login
    const mockUser = {
      id: 'user-123',
      firstName: 'John',
      lastName: 'Doe',
      email: formData.email,
      address: '123 Main St, Mumbai',
      drivingLicenseNumber: 'DL12345678',
      dateOfBirth: '1990-01-01',
      role: 'user'
    };
    
    localStorage.setItem('rideEasyUser', JSON.stringify(mockUser));
    
    toast({
      title: "Login successful!",
      description: "Welcome back to RideEasy.",
    });
    
    navigate('/');
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
        
        <button type="submit" className="w-full btn-primary">
          {isAdmin ? "Admin Login" : "Log In"}
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
