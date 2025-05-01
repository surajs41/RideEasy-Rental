
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import { Calendar, Plus, Minus, Check, MapPin, ChevronDown, ArrowLeft } from 'lucide-react';
import { Bike } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from 'react-router-dom';

// Add Razorpay TypeScript declaration
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BikeDetailProps {
  bike: Bike;
}

const BikeDetail: React.FC<BikeDetailProps> = ({ bike }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  
  const [days, setDays] = useState(1);
  const [startDate, setStartDate] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [selectedBranch, setSelectedBranch] = useState('pune');
  const [pickupLocation, setPickupLocation] = useState('Main Pune Branch - MG Road');
  const [dropoffLocation, setDropoffLocation] = useState('Main Pune Branch - MG Road');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [paymentId, setPaymentId] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  
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
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book a bike",
        variant: "destructive",
      });
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    
    setShowBookingModal(true);
  };
  
  const branches = [
    { id: 'pune', name: 'Main Pune Branch - MG Road' },
    { id: 'goa', name: 'Goa Branch - Panaji' },
    { id: 'mumbai', name: 'Mumbai Branch - Andheri' },
    { id: 'bangalore', name: 'Bengaluru Branch - Koramangala' },
    { id: 'hyderabad', name: 'Hyderabad Branch - Banjara Hills' }
  ];
  
  const handlePaymentMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const handleBranchChange = (value: string) => {
    const branchId = value;
    setSelectedBranch(branchId);
    const branch = branches.find(b => b.id === branchId);
    if (branch) {
      setPickupLocation(branch.name);
      setDropoffLocation(branch.name);
    }
  };
  
  const initiateRazorpayPayment = () => {
    if (!termsAgreed) {
      toast({
        title: "Terms & Conditions Required",
        description: "Please agree to the terms and conditions before proceeding",
        variant: "destructive",
      });
      return;
    }
    
    const options = {
      key: "rzp_test_9aJidIlkwc3Duj",  // Replace with actual Razorpay key
      amount: totalPayable * 100, // Amount in smallest currency unit (paise for INR)
      currency: "INR",
      name: "RideEasy Rentals",
      description: `${bike.name} Rental for ${days} days`,
      image: "https://example.com/your_logo", // Replace with your logo URL
      handler: function(response: any) {
        // Handle successful payment
        const paymentId = response.razorpay_payment_id;
        setPaymentId(paymentId);
        processBookingConfirmation(paymentId);
      },
      prefill: {
        name: profile ? `${profile.first_name} ${profile.last_name}` : "",
        email: user?.email || "",
        contact: ""  // You can add phone from profile if available
      },
      theme: {
        color: "#2563EB"
      },
      modal: {
        ondismiss: function() {
          console.log("Payment modal closed without completing payment");
        }
      }
    };
    
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };
  
  const processBookingConfirmation = async (paymentId: string) => {
    try {
      // In a real app, this would connect to Supabase and create a booking record
      const bookingDetails = {
        bikeId: bike.id,
        bikeName: bike.name,
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
        days,
        totalAmount: totalPayable,
        paymentId: paymentId,
        pickupLocation,
        dropoffLocation,
        timestamp: new Date().toISOString(),
      };
      
      // Store booking in Supabase
      const { error } = await supabase.from('bookings').insert({
        bike_id: bike.id,
        user_id: user?.id,
        start_date: startDate.toISOString().split('T')[0],
        end_date: endDate.toISOString().split('T')[0],
        total_amount: totalPayable,
        payment_id: paymentId,
        payment_status: 'completed',
        booking_status: 'confirmed'
      });
      
      if (error) throw error;
      
      // Send confirmation email
      await supabase.functions.invoke('send-confirmation', {
        body: {
          name: profile ? `${profile.first_name} ${profile.last_name}` : "User",
          email: user?.email,
          bikeName: bike.name,
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
          totalAmount: totalPayable,
          paymentId: paymentId,
          pickupLocation,
          dropoffLocation,
        }
      });
      
      // Show confirmation and success message
      setBookingConfirmed(true);
      toast({
        title: "Booking Confirmed!",
        description: `Your ${bike.name} is booked for ${days} days.`,
      });
    } catch (error) {
      console.error('Error during booking confirmation:', error);
      toast({
        title: "Error",
        description: "There was an error confirming your booking. Please contact support.",
        variant: "destructive",
      });
    }
  };
  
  const handlePayNow = () => {
    // Load Razorpay script if not already loaded
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        initiateRazorpayPayment();
      };
      document.body.appendChild(script);
    } else {
      initiateRazorpayPayment();
    }
  };
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  const bikePlaceholder = 'https://placehold.co/800x600/e2e8f0/475569?text=Bike+Image';

  const termsAndConditions = `
    <h3>Terms and Conditions for RideEasy Bike Rentals</h3>
    
    <h4>1. Age and License Requirements</h4>
    <p>Renters must be at least 18 years old and possess a valid driving license.</p>
    
    <h4>2. Security Deposit</h4>
    <p>A security deposit of ₹2,000 is required at the time of pickup and will be refunded upon return of the bike in its original condition.</p>
    
    <h4>3. Late Returns</h4>
    <p>Late returns will incur additional charges at the daily rate plus a 20% late fee.</p>
    
    <h4>4. Cancellation Policy</h4>
    <p>- 100% refund if cancelled more than 48 hours before pickup time.</p>
    <p>- 50% refund if cancelled 24-48 hours before pickup time.</p>
    <p>- No refund for cancellations less than 24 hours before pickup time.</p>
    
    <h4>5. Damages and Liability</h4>
    <p>Renters are responsible for any damages to the bike during the rental period. RideEasy provides third-party insurance coverage.</p>
    
    <h4>6. Prohibited Uses</h4>
    <p>Bikes may not be used for racing, off-roading (unless specifically designed for that purpose), or any illegal activities.</p>
    
    <h4>7. Fuel Policy</h4>
    <p>Bikes are provided with a full tank and should be returned with a full tank, or refueling charges will apply.</p>
  `;
  
  return (
    <div className="bg-white rounded-lg shadow-md animate-fade-in">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <Link to="/bikes" className="flex items-center text-cyan-600 hover:text-cyan-800 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          <span className="font-medium">Back to all bikes</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bike Image */}
        <div className="h-80 md:h-full overflow-hidden">
          <div className="relative h-full w-full perspective-1000">
            <img 
              src={bike.imageUrl || bikePlaceholder} 
              alt={bike.name} 
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105 rounded-lg shadow-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = bikePlaceholder;
              }}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>
        
        {/* Bike Details */}
        <div className="p-6">
          <div className="mb-4">
            <span className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm font-medium">
              {bike.type.charAt(0).toUpperCase() + bike.type.slice(1)}
            </span>
          </div>
          
          <h1 className="text-3xl font-bold mb-2 text-gray-800">{bike.name}</h1>
          
          <div className="flex items-center mb-4">
            <span className="text-2xl font-bold text-cyan-600">₹{bike.pricePerDay}</span>
            <span className="text-gray-500 ml-1">/day</span>
          </div>
          
          <p className="text-gray-600 mb-6">{bike.description}</p>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-semibold mb-4">Book This Bike</h3>
            
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
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                </div>
              </div>
              
              {/* Branch Selection */}
              <div>
                <label htmlFor="branch" className="block text-gray-700 font-medium mb-1">
                  Select Branch
                </label>
                <Select
                  value={selectedBranch}
                  onValueChange={handleBranchChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch.id} value={branch.id}>
                        {branch.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold p-2 rounded-full transition-colors duration-300"
                    disabled={days <= 1}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="mx-4 text-xl font-semibold">{days}</span>
                  <button
                    type="button"
                    onClick={handleIncrementDays}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-600 font-bold p-2 rounded-full transition-colors duration-300"
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
                <div className="flex items-center text-gray-700 border border-gray-300 rounded-md px-4 py-2 bg-gray-50">
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
                  <span className="font-bold text-cyan-600">₹{totalPayable.toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-4 rounded-md font-semibold transition-colors duration-300 mt-4 shadow-md hover:shadow-lg transform hover:-translate-y-1 active:translate-y-0"
                onClick={handleBooking}
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Booking Confirmation Modal */}
      {showBookingModal && !bookingConfirmed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full animate-slide-in">
            <h3 className="text-xl font-bold mb-4">Confirm Booking</h3>
            
            <div className="space-y-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Booking Details</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Bike:</span>
                    <span className="font-medium">{bike.name}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium">{days} days</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-600">Pick-up Date:</span>
                    <span className="font-medium">{formatDate(startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Return Date:</span>
                    <span className="font-medium">{formatDate(endDate)}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Pickup & Drop Location</h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  <div className="flex items-start mb-2">
                    <MapPin size={18} className="text-cyan-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Pickup Location</p>
                      <p className="text-gray-600 text-sm">{pickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin size={18} className="text-cyan-500 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Drop-off Location</p>
                      <p className="text-gray-600 text-sm">{dropoffLocation}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Payment Method</h4>
                <div className="bg-gray-50 p-3 rounded-md space-y-2">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="upi" 
                      checked={paymentMethod === 'upi'} 
                      onChange={handlePaymentMethodChange} 
                      className="mr-2"
                    />
                    <span>UPI</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="card" 
                      checked={paymentMethod === 'card'} 
                      onChange={handlePaymentMethodChange} 
                      className="mr-2"
                    />
                    <span>Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="netbanking" 
                      checked={paymentMethod === 'netbanking'} 
                      onChange={handlePaymentMethodChange} 
                      className="mr-2"
                    />
                    <span>Net Banking</span>
                  </label>
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="wallet" 
                      checked={paymentMethod === 'wallet'} 
                      onChange={handlePaymentMethodChange} 
                      className="mr-2"
                    />
                    <span>Wallet</span>
                  </label>
                </div>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Total Amount:</span>
                  <span className="font-bold text-cyan-600">₹{totalPayable.toFixed(2)}</span>
                </div>
              </div>
              
              <div>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={termsAgreed} 
                    onChange={() => setTermsAgreed(!termsAgreed)}
                    className="mr-2"
                  />
                  <span>I agree to the <button 
                    type="button"
                    className="text-cyan-600 underline"
                    onClick={() => setShowTerms(true)}
                  >Terms and Conditions</button></span>
                </label>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button 
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-md font-medium transition-colors"
                onClick={() => setShowBookingModal(false)}
              >
                Cancel
              </button>
              <button 
                className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                  termsAgreed 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handlePayNow}
                disabled={!termsAgreed}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Terms and Conditions Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-auto">
            <h3 className="text-xl font-bold mb-4">Terms and Conditions</h3>
            <div className="prose prose-sm" dangerouslySetInnerHTML={{ __html: termsAndConditions }}></div>
            <div className="mt-6 text-right">
              <button 
                className="bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
                onClick={() => setShowTerms(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Booking Success Modal */}
      {bookingConfirmed && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full animate-scale-in">
            <div className="text-center mb-6">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <Check className="text-green-500" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h3>
              <p className="text-gray-600">Your payment was successful and your booking is confirmed.</p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-md p-4 mb-6 border border-cyan-100">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Bike:</span>
                <span className="font-medium">{bike.name}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{days} days ({formatDate(startDate)} to {formatDate(endDate)})</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Pickup Location:</span>
                <span className="font-medium">{pickupLocation}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Payment ID:</span>
                <span className="font-medium">{paymentId}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-cyan-200 mt-2">
                <span className="font-bold">Total Paid:</span>
                <span className="font-bold text-cyan-600">₹{totalPayable.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                A confirmation email has been sent to your email address with all the booking details.
              </p>
              <div className="flex space-x-3">
                <button 
                  className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 py-2 px-4 rounded-md font-medium transition-colors"
                  onClick={() => navigate('/bookings')}
                >
                  View My Bookings
                </button>
                <button 
                  className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  onClick={() => {
                    setShowBookingModal(false);
                    setBookingConfirmed(false);
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BikeDetail;
