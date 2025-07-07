import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'react-toastify';
import { jsPDF } from 'jspdf';

const AdminBookingsList = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bikes, setBikes] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching bookings:', error);
        toast.error('Failed to load bookings');
      } else {
        setBookings(data || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  // Manual refresh function
  const refreshBookings = () => {
    fetchBookings();
  };

  useEffect(() => {
    fetchBookings();
    const channel = supabase
      .channel('admin-bookings-realtime')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'bookings' 
        }, 
        (payload) => {
          console.log('Admin real-time update received:', payload);
          // Immediately update the bookings list
          if (payload.eventType === 'INSERT') {
            setBookings(prev => [payload.new, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setBookings(prev => prev.map(booking => 
              booking.booking_id === payload.new.booking_id ? payload.new : booking
            ));
          } else if (payload.eventType === 'DELETE') {
            setBookings(prev => prev.filter(booking => 
              booking.booking_id !== payload.old.booking_id
            ));
          }
        }
      )
      .subscribe((status) => {
        console.log('Admin subscription status:', status);
      });
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    supabase.from('bikes').select('*').then(({ data }) => setBikes(data || []));
  }, []);

  useEffect(() => {
    supabase.from('profiles').select('*').then(({ data }) => setProfiles(data || []));
  }, []);

  useEffect(() => {
    if (!loading && bookings.length > 0) {
      bookings.forEach(booking => {
        if (booking.status === 'confirmed') toast.success('Your booking was approved!');
        if (booking.status === 'rejected') toast.error('Sorry, your booking was rejected.');
      });
    }
  }, [bookings, loading]);

  const getBikeName = (bikeId: string) => bikes.find(b => b.id === bikeId)?.name || bikeId;

  const getBikeDetails = (bikeId: string, bikes: any[]) => bikes.find(b => b.id === bikeId);

  const getUserName = (userId: string) => {
    const user = profiles.find((p) => p.id === userId);
    if (!user) return userId; // fallback to ID if not found
    return `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || userId;
  };

  const generateInvoicePDF = (booking: any, bike: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;
    const logoImg = new Image();
    logoImg.src = '/images/bikes/RideEasy.png';
    doc.addImage(logoImg, 'PNG', (pageWidth - 60) / 2, y, 60, 30);
    y += 38;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(24, 54, 104);
    doc.text('RideEasy Bike Rental Invoice', pageWidth / 2, y, { align: 'center' });
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(34, 197, 94);
    doc.text('Booking Confirmation: ' + (booking.status === 'confirmed' ? 'Confirmed' : booking.status), pageWidth / 2, y, { align: 'center' });
    y += 12;
    doc.setTextColor(24, 54, 104);
    doc.setFont('helvetica', 'normal');
    doc.text(`Invoice No: ${booking.booking_id || booking.id || 'N/A'}`, 20, y);
    y += 7;
    doc.text(`Invoice Date: ${new Date(booking.created_at).toLocaleString()}`, 20, y);
    y += 7;
    doc.text('GSTIN: 27AAECR1234F1ZV', 20, y);
    y += 10;
    doc.setDrawColor(173, 216, 230);
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
    doc.roundedRect(15, y, pageWidth - 30, 28, 3, 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(24, 54, 104);
    doc.text('Rental Information', 20, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Pickup Location: ${booking.pickup_location || 'N/A'}`, 20, y + 14);
    doc.text(`Pickup Date: ${booking.start_date}`, 20, y + 21);
    doc.text(`Return Date: ${booking.end_date}`, 125, y + 14);
    doc.text(`Duration: ${booking.days || 'N/A'} Day(s)`, 125, y + 21);
    y += 34;
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
    doc.text(`GST (18%): ₹${taxAmount.toFixed(2)}`, 125, y + 14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(34, 197, 94);
    doc.text(`Total Paid: ₹${booking.total_amount?.toFixed(2) || booking.totalAmount?.toFixed(2)}`, 125, y + 21);
    y += 34;
    doc.roundedRect(15, y, pageWidth - 30, 20, 3, 3);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(24, 54, 104);
    doc.text('Additional Information', 20, y + 7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text('Invoice will be sent to your email.', 20, y + 14);
    doc.text('You can also download the invoice from your dashboard.', 88, y + 14);
    y += 30;
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

  if (loading) return <div>Loading bookings...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4 z-50 relative">
        <h2 className="text-2xl font-bold text-gray-800">All Bookings (Admin)</h2>
        <button 
          onClick={refreshBookings}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-lg text-sm">
          <thead className="sticky top-0 z-10 bg-gradient-to-r from-red-100 to-white">
            <tr className="">
              <th className="px-4 py-3 text-left">User Name</th>
              <th className="px-4 py-3 text-left">Bike ID</th>
              <th className="px-4 py-3 text-left">Bike Name</th>
              <th className="px-4 py-3 text-left">Start</th>
              <th className="px-4 py-3 text-left">End</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Time</th>
              <th className="px-4 py-3 text-left">Receipt</th>
              <th className="px-4 py-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody className="animate-fade-in">
            {bookings.map((b, idx) => (
              <tr
                key={b.booking_id || b.id}
                className={
                  `${idx % 2 === 0 ? "bg-gray-50" : "bg-white"} transition hover:bg-red-50/80 duration-200 group`
                }
              >
                <td className="px-4 py-3 truncate max-w-[120px]">{getUserName(b.user_id)}</td>
                <td className="px-4 py-3 truncate max-w-[120px]">{b.bike_id}</td>
                <td className="px-4 py-3">{getBikeDetails(b.bike_id, bikes)?.name || b.bike_id}</td>
                <td className="px-4 py-3">{new Date(b.start_date).toLocaleDateString()}</td>
                <td className="px-4 py-3">{new Date(b.end_date).toLocaleDateString()}</td>
                <td className="px-4 py-3 font-semibold text-blue-600">₹{b.total_amount}</td>
                <td className="px-4 py-3">{b.payment_status}</td>
                <td className="px-4 py-3">
                  {b.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-lg shadow hover:bg-green-600 transition disabled:opacity-50"
                        disabled={b._actionTaken}
                        onClick={async () => {
                          const { error } = await (supabase as any)
                            .from('bookings')
                            .update({ status: 'confirmed' } as any)
                            .eq('booking_id', b.booking_id);
                          if (error) {
                            toast.error('Failed to update booking: ' + error.message);
                            return;
                          }
                          toast.success('Booking confirmed!');
                        }}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded-lg shadow hover:bg-red-600 transition disabled:opacity-50"
                        disabled={b._actionTaken}
                        onClick={async () => {
                          const { error } = await (supabase as any)
                            .from('bookings')
                            .update({ status: 'rejected' } as any)
                            .eq('booking_id', b.booking_id);
                          if (error) {
                            toast.error('Failed to update booking: ' + error.message);
                            return;
                          }
                          toast.info('Booking rejected.');
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  ) : (
                    <span className={
                      b.status === 'confirmed' ? 'bg-green-100 text-green-700 px-2 py-1 rounded font-semibold' :
                      b.status === 'rejected' ? 'bg-red-100 text-red-700 px-2 py-1 rounded font-semibold' :
                      b.status === 'cancelled' ? 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold' :
                      'bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold'
                    }>
                      {b.status === 'confirmed' ? 'Confirmed' :
                      b.status === 'rejected' ? 'Rejected' :
                      b.status === 'cancelled' ? 'Cancelled' :
                      b.status?.charAt(0).toUpperCase() + b.status?.slice(1)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">{new Date(b.created_at).toLocaleString()}</td>
                <td className="px-4 py-3">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded-lg shadow hover:bg-blue-600 transition"
                    onClick={() => generateInvoicePDF(b, getBikeDetails(b.bike_id, bikes))}
                  >
                    Download
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button
                    className="bg-white text-black border border-blue-500 px-3 py-1 rounded-lg shadow-md hover:bg-blue-50 transition"
                    onClick={() => { setSelectedBooking(b); }}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* View Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full animate-scale-in flex flex-col max-h-[90vh]">
            <div className="text-center mb-6 overflow-y-auto flex-1">
              <svg className="mx-auto text-green-500 mb-2 animate-tick" width="64" height="64" viewBox="0 0 52 52">
                <circle className="tick-circle" cx="26" cy="26" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
                <path className="tick-check" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M14 27l7 7 16-16" />
              </svg>
              <style>{`
                .animate-tick .tick-check {
                  stroke-dasharray: 48;
                  stroke-dashoffset: 48;
                  animation: tick-draw 0.7s ease forwards;
                }
                @keyframes tick-draw {
                  to { stroke-dashoffset: 0; }
                }
              `}</style>
              <h2 className="text-2xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600">Your payment was successful and your booking is confirmed.</p>
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-md p-5 mb-6 border border-cyan-100">
                <h4 className="font-semibold text-lg text-center mb-4 text-cyan-800">Booking Invoice</h4>
                <div className="text-left text-gray-700 space-y-2">
                  <div><span className="font-semibold">Booking ID:</span> {selectedBooking.booking_id || selectedBooking.id}</div>
                  <div><span className="font-semibold">Bike:</span> {getBikeDetails(selectedBooking.bike_id, bikes)?.name || selectedBooking.bike_id}</div>
                  <div><span className="font-semibold">Duration:</span> {selectedBooking.days || selectedBooking.totalDays || '-'} days ({selectedBooking.start_date} to {selectedBooking.end_date})</div>
                  <div><span className="font-semibold">Customer:</span> {selectedBooking.customer_name || selectedBooking.name || 'User'}</div>
                  <div><span className="font-semibold">Email:</span> {selectedBooking.customer_email || selectedBooking.email || ''}</div>
                  <div><span className="font-semibold">Pickup Location:</span> {selectedBooking.pickup_location || 'RideEasy Main Center'}</div>
                  <div><span className="font-semibold">Payment Method:</span> {selectedBooking.payment_method || '-'}</div>
                  <div><span className="font-semibold">Booking Date:</span> {new Date(selectedBooking.created_at).toLocaleString()}</div>
                  <div><span className="font-semibold">Total Paid:</span> ₹{selectedBooking.total_amount?.toFixed(2) || selectedBooking.totalAmount?.toFixed(2)}</div>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-2 border-t border-gray-100 bg-white sticky bottom-0 z-10">
              <button className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center" onClick={() => { generateInvoicePDF(selectedBooking, getBikeDetails(selectedBooking.bike_id, bikes)); }}>
                Download Invoice
              </button>
              <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white py-3 px-4 rounded-md font-medium transition-colors" onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple text download for demo
function downloadReceipt(booking: any) {
  const text = `Booking Receipt\nBooking ID: ${booking.booking_id}\nUser ID: ${booking.user_id}\nBike ID: ${booking.bike_id}\nTotal: ₹${booking.total_amount}`;
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `booking_${booking.booking_id}_receipt.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default AdminBookingsList;
