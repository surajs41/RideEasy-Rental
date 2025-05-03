
import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import LoginForm from '../components/LoginForm';
import { motion } from 'framer-motion';

const LoginPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-gray-50 to-cyan-50">
        <div className="w-full max-w-4xl flex flex-col md:flex-row shadow-2xl rounded-3xl overflow-hidden">
          {/* Animation Side */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="bg-gradient-to-br from-brand-blue to-cyan-600 hidden md:flex md:w-1/2 items-center justify-center p-8 relative overflow-hidden"
          >
            <div className="relative z-10 text-white text-center">
              <h2 className="text-3xl font-bold mb-6">Welcome Back!</h2>
              <p className="mb-8 text-blue-100">Login to access your RideEasy account and start your journey.</p>
              
              <div className="flex justify-center">
                <motion.div 
                  animate={{ 
                    y: [0, -15, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "easeInOut"
                  }}
                >
                  <img 
                    src="https://cdn.iconscout.com/icon/free/png-256/free-motorcycle-2022208-1703756.png" 
                    alt="Motorcycle" 
                    className="w-32 h-32 object-contain" 
                  />
                </motion.div>
              </div>
              
              <p className="mt-12 text-sm text-blue-100">Don't have an account?</p>
              <Link to="/register" className="inline-block mt-2 px-6 py-2 bg-white text-brand-blue font-medium rounded-full hover:bg-opacity-90 transition-all duration-300">
                Sign Up
              </Link>
            </div>
            
            {/* Animated background elements */}
            <motion.div 
              className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full opacity-20"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{ repeat: Infinity, duration: 8 }}
            />
            <motion.div 
              className="absolute bottom-10 right-10 w-40 h-40 bg-cyan-300 rounded-full opacity-20"
              animate={{
                scale: [1, 1.3, 1],
              }}
              transition={{ repeat: Infinity, duration: 10, delay: 1 }}
            />
            <motion.div 
              className="absolute top-1/2 right-5 w-20 h-20 bg-blue-300 rounded-full opacity-30"
              animate={{
                scale: [1, 1.5, 1],
              }}
              transition={{ repeat: Infinity, duration: 7 }}
            />
          </motion.div>
          
          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white w-full md:w-1/2 p-2"
          >
            <LoginForm />
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LoginPage;
