import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Bike, Download, FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { bikes } from '../data/bikes';
import { jsPDF } from 'jspdf';

const BookingsList = () => {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  
  React.useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (!error && data) {
        setBookings(data);
      } else {
        setBookings([]);
      }
      setLoading(false);
    };
    fetchBookings();
  }, [user]);

  const getBikeDetails = (bikeId: string) => bikes.find(b => b.id === bikeId);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  const formatDateWithTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ' at ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const generateInvoicePDF = (booking: any, bike: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Add RideEasy logo at the top center
    const logoImg = new Image();
    logoImg.src = '/images/bikes/RideEasy.png';
    doc.addImage(logoImg, 'PNG', (pageWidth - 60) / 2, y, 60, 30);
    y += 38;

    // Title and confirmation
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(24, 54, 104); // Dark blue
    doc.text('RideEasy Bike Rental Invoice', pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(34, 197, 94); // Green
    doc.text('Booking Confirmation: Confirmed', pageWidth / 2, y, { align: 'center' });
    y += 12;
    doc.setTextColor(24, 54, 104);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice No: ${booking.booking_id || booking.id || 'N/A'}`, 20, y);
    y += 7;
    doc.text(`Invoice Date: ${formatDateWithTime(booking.created_at)}`, 20, y);
    y += 7;
    doc.text('GSTIN: 27AAECR1234F1ZV', 20, y);
    y += 10;

    // Customer Info
    doc.setDrawColor(173, 216, 230); // Light blue
    doc.setLineWidth(0.5);
    doc.roundedRect(15, y, pageWidth - 30, 16, 3, 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(24, 54, 104);
    doc.text('Customer Information', 20, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Name: ${booking.customer_name || booking.name || 'N/A'}`, 20, y + 12);
    doc.text(`Email: ${booking.customer_email || booking.email || 'N/A'}`, 125, y + 14);
    y += 20;

    // Bike Details
    doc.roundedRect(15, y, pageWidth - 30, 16, 3, 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(24, 54, 104);
    doc.text('Bike Details', 20, y + 6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Bike Model: ${bike?.name || 'N/A'}`, 20, y + 12);
    doc.text(`Type: ${bike?.type || 'N/A'}`, 125, y + 14);
    y += 20;
// Rental Info
doc.roundedRect(15, y, pageWidth - 30, 28, 3, 3);
doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(24, 54, 104);
doc.text('Rental Information', 20, y + 7);

doc.setFont('helvetica', 'normal');
doc.setTextColor(0, 0, 0);
doc.text(`Pickup Location: ${booking.pickup_location || 'N/A'}`, 20, y + 14);
doc.text(`Pickup Date: ${formatDate(booking.start_date)}`, 20, y + 21);
doc.text(`Return Date: ${formatDate(booking.end_date)}`, 125, y + 14);  // moved right
doc.text(`Duration: ${booking.days || 'N/A'} Day(s)`, 125, y + 21);     // moved right
y += 34;

// Payment Info
doc.roundedRect(15, y, pageWidth - 30, 28, 3, 3);
doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(24, 54, 104);
doc.text('Payment Information', 20, y + 7);

doc.setFont('helvetica', 'normal');
doc.setTextColor(0, 0, 0);
doc.text(`Method: ${booking.payment_method || 'N/A'}`, 20, y + 14);
doc.text(`Base Amount: ₹${(bike.pricePerDay * (booking.days || booking.totalDays || 1)).toFixed(2)}`, 20, y + 21);

const taxAmount = (bike.pricePerDay * (booking.days || booking.totalDays || 1)) * 0.18;
doc.text(`GST (18%): ₹${taxAmount.toFixed(2)}`, 125, y + 14);  // moved right

doc.setFont('helvetica', 'bold');
doc.setTextColor(34, 197, 94);
doc.text(`Total Paid: ₹${booking.total_amount?.toFixed(2) || booking.totalAmount?.toFixed(2)}`, 125, y + 21);  // moved right
y += 34;

// Additional Info
doc.roundedRect(15, y, pageWidth - 30, 20, 3, 3);
doc.setFont('helvetica', 'bold');
doc.setFontSize(12);
doc.setTextColor(24, 54, 104);
doc.text('Additional Information', 20, y + 7);

doc.setFont('helvetica', 'normal');
doc.setTextColor(0, 0, 0);
doc.text('Invoice will be sent to your email.', 20, y + 14);
doc.text('You can also download the invoice from your dashboard.', 88, y + 14);  // moved right
y += 30;


    // Thank you and support
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(34, 197, 94);
    doc.text('Thank You for Riding with RideEasy!', pageWidth / 2, y, { align: 'center' });
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(24, 54, 104);
    doc.text('For any assistance, call +91-9356681781', pageWidth / 2, y, { align: 'center' });
    y += 6;
    doc.text('www.rideeasy.in', pageWidth / 2, y, { align: 'center' });
    y += 34;
    doc.setTextColor(150, 150, 150);
    doc.text('© 2025 RideEasy Rentals. All rights reserved.', pageWidth / 2, y, { align: 'center' });

    doc.save(`RideEasy_Invoice_${booking.booking_id || booking.id || 'N/A'}.pdf`);
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowInvoiceModal(true);
  };

  if (loading) {
    return <div className="text-center py-8">Loading bookings...</div>;
  }

  if (!bookings || bookings.length === 0) {
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
      {bookings.map((booking: any, index: number) => {
        const bike = getBikeDetails(booking.bike_id);
        return (
          <div key={booking.id || index} className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="bg-brand-blue text-white py-3 px-4 flex justify-between items-center">
              <h3 className="font-semibold">Booking #{index + 1}</h3>
              <span className="bg-white text-brand-blue text-sm font-bold py-1 px-3 rounded-full">
                {booking.booking_status || 'Confirmed'}
              </span>
            </div>
            <div className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h4 className="text-lg font-bold mb-2 md:mb-0">{bike ? bike.name : booking.bike_id}</h4>
                <div className="text-brand-blue font-bold">₹{booking.total_amount?.toFixed(2)}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar size={18} className="text-gray-500 mr-2 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Rental Period</p>
                    <p className="font-medium">{booking.start_date} - {booking.end_date}</p>
                    <p className="text-sm text-gray-600">({booking.days} days)</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock size={18} className="text-gray-500 mr-2 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Booking Date</p>
                    <p className="font-medium">
                      {new Date(booking.created_at).toLocaleDateString('en-GB', {
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
                    <p className="font-medium">{booking.pickup_location || 'RideEasy Main Center'}</p>
                    <p className="text-sm text-gray-600">123 Bike Street, Mumbai</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Bike size={18} className="text-gray-500 mr-2 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bike</p>
                    <p className="font-medium">{bike ? bike.name : booking.bike_id}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-2">
                <button className="btn-outline py-1 text-sm flex items-center" onClick={() => generateInvoicePDF(booking, bike)}>
                  <Download size={16} className="mr-1" />
                  Download Receipt
                </button>
                <button className="btn-primary py-1 text-sm flex items-center" onClick={() => handleViewDetails(booking)}>
                  <FileText size={16} className="mr-1" />
                  View Details
                </button>
              </div>
            </div>
          </div>
        );
      })}
      {/* Invoice Modal */}
      {showInvoiceModal && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full animate-scale-in flex flex-col max-h-[90vh]">
            <div className="text-center mb-6 overflow-y-auto flex-1">
              <CheckCircle size={64} className="mx-auto text-green-500 mb-2" />
              <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600">Your payment was successful and your booking is confirmed.</p>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-md p-5 mb-6 border border-cyan-100">
                <h4 className="font-semibold text-lg text-center mb-4 text-cyan-800">Booking Invoice</h4>
                <div className="text-left text-gray-700 space-y-2">
                  <div><span className="font-semibold">Booking ID:</span> {selectedBooking.booking_id || selectedBooking.id}</div>
                  <div><span className="font-semibold">Bike:</span> {getBikeDetails(selectedBooking.bike_id)?.name || selectedBooking.bike_id}</div>
                  <div><span className="font-semibold">Duration:</span> {selectedBooking.days || selectedBooking.totalDays || '-'} days ({formatDate(selectedBooking.start_date)} to {formatDate(selectedBooking.end_date)})</div>
                  <div><span className="font-semibold">Customer:</span> {profile ? `${profile.first_name} ${profile.last_name}` : 'User'}</div>
                  <div><span className="font-semibold">Email:</span> {user?.email || ''}</div>
                  <div><span className="font-semibold">Pickup Location:</span> {selectedBooking.pickup_location || 'RideEasy Main Center'}</div>
                  <div><span className="font-semibold">Payment Method:</span> {selectedBooking.payment_method || '-'}</div>
                  <div><span className="font-semibold">Booking Date:</span> {formatDateWithTime(selectedBooking.created_at)}</div>
                  <div><span className="font-semibold">Total Paid:</span> ₹{selectedBooking.total_amount?.toFixed(2) || selectedBooking.totalAmount?.toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2 border-t border-gray-100 bg-white sticky bottom-0 z-10">
              <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center" onClick={() => { generateInvoicePDF(selectedBooking, getBikeDetails(selectedBooking.bike_id)); }}>
                <Download size={18} className="mr-2" />
                Download Invoice
              </button>
              <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-4 rounded-md font-medium transition-colors" onClick={() => setShowInvoiceModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsList;
