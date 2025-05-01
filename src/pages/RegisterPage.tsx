
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar user={null} />
      
      <div className="flex-grow flex items-center justify-center px-4 py-12 bg-gray-50">
        <RegisterForm />
      </div>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;
