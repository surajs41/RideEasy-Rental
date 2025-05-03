
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-gray-50 to-cyan-50">
        <div className="w-full max-w-4xl flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden">
          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-white w-full md:w-2/3 p-2 order-2 md:order-1"
          >
            <RegisterForm />
          </motion.div>
          
          {/* Animation Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-gradient-to-br from-brand-orange to-amber-500 hidden md:flex md:w-1/3 items-center justify-center p-8 relative overflow-hidden order-1 md:order-2"
          >
            <div className="relative z-10 text-white text-center">
              <h2 className="text-3xl font-bold mb-6">Join RideEasy!</h2>
              <p className="mb-8 text-amber-50">Create an account to start renting bikes for your adventures.</p>
              
              <div className="flex justify-center">
                <motion.div 
                  animate={{ 
                    rotateY: [0, 360],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 6,
                    ease: "easeInOut"
                  }}
                >
                  <img 
                    src="https://cdn-icons-png.flaticon.com/512/7641/7641402.png" 
                    alt="Motorcycle Registration" 
                    className="w-32 h-32 object-contain" 
                  />
                </motion.div>
              </div>
              
              <p className="mt-12 text-sm text-amber-50">Already have an account?</p>
              <Link to="/login" className="inline-block mt-2 px-6 py-2 bg-white text-brand-orange font-medium rounded-full hover:bg-opacity-90 transition-all duration-300">
                Log In
              </Link>
            </div>
            
            {/* Animated background elements */}
            <motion.div 
              className="absolute top-10 right-10 w-32 h-32 bg-yellow-400 rounded-full opacity-20"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ repeat: Infinity, duration: 8 }}
            />
            <motion.div 
              className="absolute bottom-10 left-10 w-40 h-40 bg-orange-300 rounded-full opacity-20"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{ repeat: Infinity, duration: 10, delay: 1 }}
            />
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;
