import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate from react-router-dom v6

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(null); // Define state for isAdmin

  const navigate = useNavigate(); // Initialize useNavigate for redirection

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost/backend/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      setLoading(false);

      if (result.success) {
        // If password is admin password, navigate to /true/:userId
        if (result.isAdmin) {
          navigate(`/true/${result.userId}`);
        } else {
          navigate(`/false/${result.userId}`);
        }
        alert('Login successful');
      } else {
        setError(result.message); // Display error message
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again.');
      console.error(error);
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
          <Flag className="h-8 w-8 text-purple-600 mr-2" />
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-700 to-blue-400">
            Milestone Manager
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-gray-300">
              Email
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="bg-gray-700 text-gray-100 border-gray-600 focus:border-purple-600 pl-10 w-full py-2 rounded-md"
                placeholder="Enter your email"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="bg-gray-700 text-gray-100 border-gray-600 focus:border-blue-500 pl-10 w-full py-2 rounded-md"
                placeholder="Enter your password"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500 rounded"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-300">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm text-blue-400 hover:underline">
              Forgot password?
            </a>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            className={`w-full bg-gradient-to-r from-purple-700 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-400 hover:underline">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
