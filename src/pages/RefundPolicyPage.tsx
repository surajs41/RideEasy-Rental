
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const RefundPolicyPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Refund Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p>Last Updated: May 2, 2025</p>
              
              <p>
                This Refund Policy outlines the terms and conditions regarding refunds for services 
                provided by RideEasy ("we", "our", or "us"). By using our services, you agree to the 
                terms of this Refund Policy.
              </p>
              
              <h2>1. Booking Cancellations</h2>
              
              <h3>1.1 Cancellation by Customer</h3>
              <p>
                Our cancellation policy is as follows:
              </p>
              <ul>
                <li><strong>More than 48 hours before rental start time:</strong> Full refund, minus a processing fee of ₹100</li>
                <li><strong>24-48 hours before rental start time:</strong> 50% refund of the total booking amount</li>
                <li><strong>Less than 24 hours before rental start time:</strong> No refund</li>
                <li><strong>No-show:</strong> No refund</li>
              </ul>
              
              <h3>1.2 Cancellation by RideEasy</h3>
              <p>
                If RideEasy needs to cancel your booking due to unforeseen circumstances (vehicle damage, 
                maintenance issues, etc.), you will be entitled to:
              </p>
              <ul>
                <li>A full refund of the booking amount, or</li>
                <li>Rebooking for another available vehicle at the same price, or</li>
                <li>A rental credit with an additional 10% value added to your account</li>
              </ul>
              
              <h2>2. Early Returns</h2>
              <p>
                If you return the vehicle before the scheduled end of your rental period:
              </p>
              <ul>
                <li>Returns with more than 24 hours remaining on your rental: 25% refund of the unused portion</li>
                <li>Returns with less than 24 hours remaining on your rental: No refund</li>
              </ul>
              
              <h2>3. Extended Rentals</h2>
              <p>
                If you need to extend your rental period, you must notify us before your scheduled return time. 
                Extended rental charges will be calculated at the standard daily rate.
              </p>
              
              <h2>4. Processing of Refunds</h2>
              <p>
                All approved refunds will be processed to the original payment method used for the booking. 
                Refunds typically take 5-7 business days to appear in your account, depending on your financial institution.
              </p>
              
              <h2>5. Security Deposits</h2>
              <p>
                Security deposits will be refunded within 3-5 business days after the vehicle is returned, subject 
                to inspection for damages, fuel levels, and late returns.
              </p>
              
              <h2>6. Disputes and Exceptions</h2>
              <p>
                If you believe a refund was incorrectly processed or denied, please contact our customer support 
                team at refunds@rideeasy.com within 30 days of the rental end date. We will review each case 
                individually and may make exceptions to this policy at our discretion.
              </p>
              
              <h2>7. Changes to Refund Policy</h2>
              <p>
                We reserve the right to modify this Refund Policy at any time. Changes will be effective immediately 
                upon posting to our website, but will not apply retroactively to bookings made before the changes.
              </p>
              
              <h2>8. Contact Information</h2>
              <p>
                For questions about this Refund Policy or to request a refund, please contact our customer support 
                team at refunds@rideeasy.com or call +91 1234567890.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RefundPolicyPage;
