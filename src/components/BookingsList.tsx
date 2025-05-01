
import React from 'react';
import { Calendar, Clock, MapPin, Bike } from 'lucide-react';

const BookingsList = () => {
  // In a real app, this would fetch from Supabase
  // For demo, we'll retrieve from localStorage
  const bookingsJson = localStorage.getItem('rideEasyBookings');
  const bookings = bookingsJson ? JSON.parse(bookingsJson) : [];
  
  if (bookings.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-8 text-center animate-fade-in">
        <div className="text-5xl text-gray-300 mx-auto mb-4">🛵</div>
        <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
        <p className="text-gray-600 mb-6">You haven't made any bike bookings yet.</p>
        <a href="/bikes" className="btn-primary">
          Explore Bikes
        </a>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      {bookings.map((booking: any, index: number) => (
        <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="bg-brand-blue text-white py-3 px-4 flex justify-between items-center">
            <h3 className="font-semibold">Booking #{index + 1}</h3>
            <span className="bg-white text-brand-blue text-sm font-bold py-1 px-3 rounded-full">
              Confirmed
            </span>
          </div>
          
          <div className="p-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
              <h4 className="text-lg font-bold mb-2 md:mb-0">{booking.bikeName}</h4>
              <div className="text-brand-blue font-bold">₹{booking.totalAmount.toFixed(2)}</div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Calendar size={18} className="text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Rental Period</p>
                  <p className="font-medium">{booking.startDate} - {booking.endDate}</p>
                  <p className="text-sm text-gray-600">({booking.days} days)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock size={18} className="text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Booking Date</p>
                  <p className="font-medium">
                    {new Date(booking.timestamp).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin size={18} className="text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Pickup Location</p>
                  <p className="font-medium">RideEasy Main Center</p>
                  <p className="text-sm text-gray-600">123 Bike Street, Mumbai</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Bike size={18} className="text-gray-500 mr-2 mt-1" />
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bike ID</p>
                  <p className="font-medium">{booking.bikeId}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
              <button className="btn-outline py-1 text-sm">
                Download Receipt
              </button>
              <button className="btn-primary py-1 text-sm">
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BookingsList;
