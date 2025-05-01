
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { signUp } from '@/lib/auth';

const RegisterForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    drivingLicenseNumber: '',
    dateOfBirth: '',
  });
  
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    drivingLicenseNumber: '',
    dateOfBirth: '',
    general: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const newErrors = { ...errors };
    let isValid = true;
    
    // First Name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      isValid = false;
    }
    
    // Last Name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      isValid = false;
    }
    
    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }
    
    // Confirm Password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    
    // Address validation
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    
    // Driving License validation
    if (!formData.drivingLicenseNumber.trim()) {
      newErrors.drivingLicenseNumber = 'Driving license number is required';
      isValid = false;
    }
    
    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Register with Supabase
      await signUp({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        drivingLicenseNumber: formData.drivingLicenseNumber,
        dateOfBirth: formData.dateOfBirth,
      });
      
      toast({
        title: "Registration Successful!",
        description: "Your RideEasy account has been created.",
      });
      
      // Send confirmation email
      try {
        await supabase.functions.invoke("send-confirmation", {
          body: {
            name: formData.firstName,
            email: formData.email
          }
        });
      } catch (emailError) {
        console.error("Failed to send confirmation email:", emailError);
      }
      
      navigate('/login');
    } catch (error: any) {
      console.error("Registration error:", error);
      setErrors({
        ...errors,
        general: error.message || 'Registration failed. Please try again.'
      });
      
      toast({
        title: "Registration failed",
        description: error.message || "Please check your information and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl animate-fade-in">
      <h2 className="text-2xl font-bold text-center mb-6">Create Your RideEasy Account</h2>
      
      {errors.general && (
        <div className="p-3 mb-4 bg-red-50 text-red-600 border border-red-200 rounded">
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">
              First Name*
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="input-field"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
          </div>
          
          {/* Last Name */}
          <div>
            <label htmlFor="lastName" className="block text-gray-700 font-medium mb-1">
              Last Name*
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="input-field"
              value={formData.lastName}
              onChange={handleInputChange}
            />
            {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
          </div>
        </div>
        
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
            Email*
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="input-field"
            value={formData.email}
            onChange={handleInputChange}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password*
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className="input-field pr-10"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          
          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
              Confirm Password*
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                className="input-field pr-10"
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>
        
        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
            Address*
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            className="input-field"
            value={formData.address}
            onChange={handleInputChange}
          />
          {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Driving License */}
          <div>
            <label htmlFor="drivingLicenseNumber" className="block text-gray-700 font-medium mb-1">
              Driving License Number*
            </label>
            <input
              type="text"
              id="drivingLicenseNumber"
              name="drivingLicenseNumber"
              className="input-field"
              value={formData.drivingLicenseNumber}
              onChange={handleInputChange}
            />
            {errors.drivingLicenseNumber && <p className="text-red-500 text-sm mt-1">{errors.drivingLicenseNumber}</p>}
          </div>
          
          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-gray-700 font-medium mb-1">
              Date of Birth*
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              className="input-field"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              max={new Date(new Date().setFullYear(new Date().getFullYear() - 18)).toISOString().split('T')[0]}
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>
        </div>
        
        {/* Photo Upload - Placeholder for now */}
        <div>
          <label htmlFor="photo" className="block text-gray-700 font-medium mb-1">
            Profile Photo (Optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <input 
              type="file" 
              id="photo"
              name="photo"
              accept="image/*"
              className="hidden"
            />
            <label htmlFor="photo" className="cursor-pointer btn-outline inline-block">
              Upload a Photo
            </label>
            <p className="text-sm text-gray-500 mt-2">JPEG, PNG or GIF, Max 2MB</p>
          </div>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit" 
            className="w-full btn-primary relative"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="opacity-0">Create Account</span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account? {" "}
          <a href="/login" className="text-brand-blue hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
