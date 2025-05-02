
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>
            
            <div className="mt-8">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium">
                    What documents do I need to rent a bike?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    To rent a bike from RideEasy, you'll need a valid government-issued photo ID, a valid driver's license appropriate for the vehicle you want to rent, and a credit or debit card for the security deposit. International customers should bring their passport and international driving permit along with their original driver's license.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-lg font-medium">
                    Is there a security deposit required?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes, we require a security deposit for all rentals. The amount varies depending on the type of bike you're renting. For scooters, the deposit is typically ₹2,000, for standard motorcycles ₹5,000, and for premium motorcycles ₹10,000. The deposit will be refunded when you return the bike in the same condition as when you received it.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-lg font-medium">
                    What is your cancellation policy?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Our cancellation policy allows for a full refund (minus a small processing fee) if you cancel more than 48 hours before your rental start time. Cancellations between 24-48 hours receive a 50% refund, and cancellations less than 24 hours before the rental start time are not eligible for a refund. Please see our Refund Policy page for more details.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-lg font-medium">
                    Do you provide helmets?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes, we provide DOT-certified helmets with all our rentals at no extra charge. We have different sizes available, but if you prefer to use your own helmet, you're welcome to do so.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-lg font-medium">
                    What happens if the bike breaks down?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    In the rare event of a breakdown, please contact our 24/7 customer support line immediately. We'll arrange for assistance to come to your location. If the breakdown is due to a mechanical failure (not caused by the renter), we'll provide a replacement vehicle if available or refund the unused portion of your rental.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-6">
                  <AccordionTrigger className="text-lg font-medium">
                    What if I return the bike late?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Late returns will incur additional charges. If you know you'll be late, please contact us as soon as possible. We charge an hourly rate for late returns up to 3 hours, after which you'll be charged for an additional day. Excessive lateness without communication may result in the bike being reported as stolen.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-7">
                  <AccordionTrigger className="text-lg font-medium">
                    Is fuel included in the rental price?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    We provide vehicles with a full tank of fuel, and we expect them to be returned with a full tank. If the bike is returned with less fuel than when it was rented, we'll charge a refueling fee plus the cost of the missing fuel.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-8">
                  <AccordionTrigger className="text-lg font-medium">
                    Can I take the bike out of the city?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes, you can take our bikes to other cities and states, but you must inform us of your travel plans in advance. Some premium motorcycles may have geographical restrictions. Additional charges may apply for long-distance travel.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-9">
                  <AccordionTrigger className="text-lg font-medium">
                    What is your minimum rental period?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Our minimum rental period is 4 hours for all vehicles. However, we offer better rates for full-day rentals and multi-day bookings.
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-10">
                  <AccordionTrigger className="text-lg font-medium">
                    Do you offer insurance?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    Yes, basic third-party insurance is included with all rentals as required by law. We also offer optional comprehensive insurance packages that cover damage to the vehicle for an additional fee. We strongly recommend taking this additional coverage for your peace of mind.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-4">Still have questions?</h3>
              <p className="mb-4">Our customer support team is available to help you.</p>
              <a href="/contact" className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-6 rounded-md font-medium transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FAQPage;
