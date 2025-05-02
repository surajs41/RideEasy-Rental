
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TermsOfServicePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
            
            <div className="prose prose-lg max-w-none">
              <p>Last Updated: May 2, 2025</p>
              
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using the RideEasy services, website, and mobile applications 
                (collectively, the "Services"), you agree to be bound by these Terms of Service 
                ("Terms"). If you do not agree to these Terms, please do not use our Services.
              </p>
              
              <h2>2. Eligibility</h2>
              <p>
                To use our Services, you must be at least 18 years old and possess a valid driver's 
                license appropriate for the vehicle you wish to rent. You must also meet our insurance 
                requirements.
              </p>
              
              <h2>3. Account Registration</h2>
              <p>
                You must register an account to use certain features of our Services. You agree to provide 
                accurate, current, and complete information during registration and to update such information 
                to keep it accurate, current, and complete.
              </p>
              
              <h2>4. Rental Terms</h2>
              <p>
                When you rent a vehicle through our Services, you agree to:
              </p>
              <ul>
                <li>Return the vehicle in the same condition as when you received it</li>
                <li>Use the vehicle only for legal purposes</li>
                <li>Not exceed the mileage limits specified in your rental agreement</li>
                <li>Follow all traffic and safety laws while using the vehicle</li>
                <li>Not modify the vehicle in any way</li>
              </ul>
              
              <h2>5. Fees and Payment</h2>
              <p>
                You agree to pay all fees and charges associated with your use of our Services, including 
                rental fees, security deposits, late fees, and any damages or fines incurred during your 
                rental period. We will charge your payment method on file for these amounts.
              </p>
              
              <h2>6. Cancellations and Refunds</h2>
              <p>
                Cancellation and refund policies are as follows:
              </p>
              <ul>
                <li>Cancellations made more than 48 hours before the start of the rental period will receive a full refund</li>
                <li>Cancellations made between 24 and 48 hours before the start of the rental period will receive a 50% refund</li>
                <li>Cancellations made less than 24 hours before the start of the rental period are not eligible for a refund</li>
              </ul>
              
              <h2>7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, RideEasy shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including lost profits, arising 
                out of or related to your use of our Services.
              </p>
              
              <h2>8. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, 
                without regard to its conflict of law provisions.
              </p>
              
              <h2>9. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of changes 
                by updating the date at the top of the Terms and by maintaining a current version of the 
                Terms at our website.
              </p>
              
              <h2>10. Contact</h2>
              <p>
                If you have any questions about these Terms, please contact us at legal@rideeasy.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsOfServicePage;
