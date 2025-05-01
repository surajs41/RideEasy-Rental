
import React from 'react';
import { Search, Calendar, Bike } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: <Search size={36} className="text-brand-blue" />,
      title: "Choose Your Bike",
      description: "Browse through our collection of bikes and select one that fits your needs and preferences."
    },
    {
      icon: <Calendar size={36} className="text-brand-blue" />,
      title: "Book Your Dates",
      description: "Select your rental period and complete the booking process with our secure payment gateway."
    },
    {
      icon: <Bike size={36} className="text-brand-blue" />,
      title: "Enjoy Your Ride",
      description: "Pick up your bike from our convenient location and enjoy the freedom of the open road."
    }
  ];

  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">How RideEasy Works</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Renting a bike with RideEasy is quick and easy. Follow these simple steps to get on the road in no time.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="bg-gray-50 border border-gray-100 rounded-lg p-6 text-center animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="w-16 h-16 bg-brand-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
