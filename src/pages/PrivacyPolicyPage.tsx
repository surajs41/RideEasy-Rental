
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const PrivacyPolicyPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            
            <div className="prose prose-lg max-w-none">
              <p>Last Updated: May 2, 2025</p>
              
              <p>
                RideEasy ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our website, 
                mobile application, and services (collectively, the "Services").
              </p>
              
              <h2>1. Information We Collect</h2>
              
              <h3>Personal Information</h3>
              <p>
                We may collect personal information that you provide directly to us, including but not limited to:
              </p>
              <ul>
                <li>Name, email address, phone number, and postal address</li>
                <li>Driver's license information</li>
                <li>Payment information</li>
                <li>Account preferences and settings</li>
                <li>Communications you send to us</li>
              </ul>
              
              <h3>Usage Information</h3>
              <p>
                We automatically collect certain information about your device and how you interact with our Services, 
                including:
              </p>
              <ul>
                <li>IP address and device identifiers</li>
                <li>Browser type and operating system</li>
                <li>Pages you visit on our Services</li>
                <li>Time and date of your visits</li>
                <li>Location information (if enabled)</li>
              </ul>
              
              <h2>2. How We Use Your Information</h2>
              <p>
                We may use the information we collect for various purposes, including:
              </p>
              <ul>
                <li>Providing, maintaining, and improving our Services</li>
                <li>Processing and completing transactions</li>
                <li>Communicating with you about our Services</li>
                <li>Responding to your inquiries and support requests</li>
                <li>Personalizing your experience</li>
                <li>Protecting against fraud and unauthorized transactions</li>
                <li>Complying with legal obligations</li>
              </ul>
              
              <h2>3. How We Share Your Information</h2>
              <p>
                We may share your information in the following circumstances:
              </p>
              <ul>
                <li>With service providers who perform services on our behalf</li>
                <li>With business partners for joint marketing efforts or co-branded services</li>
                <li>In connection with a business transaction such as a merger or acquisition</li>
                <li>When required by law or to protect our rights</li>
              </ul>
              
              <h2>4. Your Choices</h2>
              <p>
                You have several choices regarding the use of your information:
              </p>
              <ul>
                <li>You can update your account information through your account settings</li>
                <li>You can opt out of marketing communications</li>
                <li>You can choose whether to enable location services</li>
                <li>You can request access to, correction of, or deletion of your personal information</li>
              </ul>
              
              <h2>5. Data Security</h2>
              <p>
                We implement appropriate security measures to protect your information. However, no method of 
                transmission or storage is 100% secure, and we cannot guarantee absolute security.
              </p>
              
              <h2>6. Children's Privacy</h2>
              <p>
                Our Services are not intended for individuals under the age of 18. We do not knowingly collect 
                personal information from children under 18.
              </p>
              
              <h2>7. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last Updated" date.
              </p>
              
              <h2>8. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at privacy@rideeasy.com.
              </p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
