
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { Calendar, Plus, Minus, Check } from 'lucide-react';
import { Bike } from '../types';

interface BikeDetailProps {
  bike: Bike;
}

const BikeDetail: React.FC<BikeDetailProps> = ({ bike }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [days, setDays] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  
  // Calculate end date based on start date and days
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + days);
  
  // Format dates for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  
  const handleIncrementDays = () => {
    setDays(days + 1);
  };
  
  const handleDecrementDays = () => {
    if (days > 1) {
      setDays(days - 1);
    }
  };
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = new Date(e.target.value);
    setStartDate(newStartDate);
  };
  
  const totalAmount = bike.pricePerDay * days;
  const taxAmount = totalAmount * 0.18; // 18% tax
  const totalPayable = totalAmount + taxAmount;
  
  const handleBooking = () => {
    // Check if user is logged in
    const userJson = localStorage.getItem('rideEasyUser');
    if (!userJson) {
      toast({
        title: "Login Required",
        description: "Please log in to book a bike",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    setShowBookingModal(true);
  };
  
  const confirmBooking = () => {
    // In a real app, this would connect to Supabase
    // and create a booking record
    const bookingDetails = {
      bikeId: bike.id,
      bikeName: bike.name,
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      days,
      totalAmount: totalPayable,
      timestamp: new Date().toISOString(),
    };
    
    // Store booking in localStorage for demo
    const bookingsJson = localStorage.getItem('rideEasyBookings');
    const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];
    bookings.push(bookingDetails);
    localStorage.setItem('rideEasyBookings', JSON.stringify(bookings));
    
    // Close modal and show success message
    setShowBookingModal(false);
    toast({
      title: "Booking Confirmed!",
      description: `Your ${bike.name} is booked for ${days} days.`,
    });
    
    // Navigate to bookings page
    navigate('/bookings');
  };
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  const bikePlaceholder = 'https://placehold.co/800x600/e2e8f0/475569?text=Bike+Image';
  
  return (
    <div className="bg-white rounded-lg shadow-md animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bike Image */}
        <div className="h-80 md:h-full overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-tr-none">
          <img 
            src={bike.imageUrl || bikePlaceholder} 
            alt={bike.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = bikePlaceholder;
            }}
          />
        </div>
        
        {/* Bike Details */}
        <div className="p-6">
          <div className="mb-4">
            <span className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm font-medium">
              {bike.type.charAt(0).toUpperCase() + bike.type.slice(1)}
            </span>
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{bike.name}</h1>
          
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-brand-blue">₹{bike.pricePerDay}</span>
            <span className="text-gray-500 ml-1">/day</span>
          </div>
          
          <p className="text-gray-600 mb-6">{bike.description}</p>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold mb-4">Book This Bike</h3>
            
            <div className="flex flex-col space-y-4">
              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-gray-700 font-medium mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    min={today}
                    value={startDate.toISOString().split('T')[0]}
                    onChange={handleStartDateChange}
                    className="input-field pl-10"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>
              </div>
              
              {/* Number of Days */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Number of Days
                </label>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={handleDecrementDays}
                    className="counter-btn"
                    disabled={days <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="mx-4 text-xl font-semibold">{days}</span>
                  <button
                    type="button"
                    onClick={handleIncrementDays}
                    className="counter-btn"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              
              {/* Return Date (Calculated) */}
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Return Date
                </label>
                <div className="input-field flex items-center text-gray-700">
                  {formatDate(endDate)}
                </div>
              </div>
              
              {/* Price Calculation */}
              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Base Price (₹{bike.pricePerDay} × {days} days)</span>
                  <span className="font-semibold">₹{totalAmount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Tax (18%)</span>
                  <span className="font-semibold">₹{taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-brand-blue">₹{totalPayable.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                className="btn-primary mt-4"
                onClick={handleBooking}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full animate-slide-in">
            <h3 className="text-xl font-bold mb-4">Confirm Booking</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="font-medium">Bike:</span>
                <span>{bike.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Duration:</span>
                <span>{days} days</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Pick-up Date:</span>
                <span>{formatDate(startDate)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Return Date:</span>
                <span>{formatDate(endDate)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="font-bold">Total Amount:</span>
                <span className="font-bold">₹{totalPayable.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-green-50 rounded-md mb-6">
              <Check className="text-green-500 mr-2" size={18} />
              <p className="text-sm text-green-700">
                A confirmation email will be sent to your registered email address with all booking details.
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button 
                className="btn-outline flex-1" 
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary flex-1" 
                onClick={confirmBooking}
              >
                Confirm & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BikeDetail;
