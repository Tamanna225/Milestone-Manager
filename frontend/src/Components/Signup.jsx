import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Signup = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    non_admin_password: '',
    agreeTerms: false,
  });
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setResponseMessage('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost/backend/signup.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (response.ok) { // Check if the response is successful
        setResponseMessage(data.message);
        // Redirect to /login after a short delay to show the success message
        setTimeout(() => {
          navigate('/login');
        }, 2000); // 2-second delay
      } else {
        setResponseMessage(data.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setResponseMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-black/50 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700"
      >
        <div className="flex items-center justify-center mb-8">
          <Flag className="h-8 w-8 text-blue-400 mr-2" />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-500">
            Milestone Manager
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-gray-300">Username</label>
            <div className="relative">
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="w-full bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 pl-10 rounded-md py-2"
                placeholder="Choose a username"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-300">Email</label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 pl-10 rounded-md py-2"
                placeholder="Enter your email"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-gray-300">Password</label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 pl-10 rounded-md py-2"
                placeholder="Create a password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 pl-10 rounded-md py-2"
                placeholder="Confirm your password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="nonAdminPassword" className="text-gray-300">Non-admin Password</label>
            <div className="relative">
              <input
                id="non_admin_password"
                name="non_admin_password"
                type="password"
                required
                value={formData.non_admin_password}
                onChange={handleChange}
                className="w-full bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 pl-10 rounded-md py-2"
                placeholder="Create a non-admin password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="agreeTerms"
              name="agreeTerms"
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="text-blue-500 focus:ring-blue-500 h-4 w-4"
            />
            <label htmlFor="agreeTerms" className="text-sm text-gray-300">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-700 to-blue-500 hover:from-blue-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        {responseMessage && (
          <p className="mt-4 text-center text-gray-300">{responseMessage}</p>
        )}

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{' '}
          <a href="/login" className="text-blue-400 hover:underline">Log in</a>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
