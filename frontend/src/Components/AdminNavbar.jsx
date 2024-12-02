import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Bell, Menu, X } from 'lucide-react';
import { FaUserCircle } from 'react-icons/fa'; // Import the user icon

export default function AdminNavbar() {
  const { userId, id } = useParams(); // Get userId and id from route params
  const navigate = useNavigate(); // Navigate to different routes
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    // Perform logout logic here if needed
    navigate('/Login'); // Redirect to Login page
  };

  return (
    <nav className="bg-black text-white z-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={`/true/${userId}`} className="flex-shrink-0">
              <span className="text-xl font-bold">Dashboard</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to={`/admin/inventory/${userId}/${id}`}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-900"
                >
                  Inventory
                </Link>
                <Link
                  to={`/admin/budget/${userId}/${id}`}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-900"
                >
                  Budget
                </Link>
                <Link
                  to={`/admin/GeoTagPics/${userId}/${id}`}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-900"
                >
                  GeoTaggedPics
                </Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {/* Sign out button on larger screens */}
            <button
              onClick={handleLogout}
              className="text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-900"
            >
              Sign out
            </button>

            {/* Notifications and Profile buttons */}
            <button className="relative bg-transparent border-none text-white p-2">
              <Bell className="h-5 w-5" />
              <span className="sr-only">View notifications</span>
              <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></div>
            </button>
            <button
              onClick={() => navigate(`/profile/${userId}`)}
              className="ml-3 relative bg-transparent border-none text-white p-2"
            >
              <FaUserCircle className="h-8 w-8 text-gray-700" />
            </button>
          </div>
          <div className="md:hidden">
            <button
              className="bg-transparent border-none text-white p-2"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
              <span className="sr-only">Toggle main menu</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed inset-y-0 left-0 w-64 bg-black z-50 transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            to={`/true/${userId}`}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900"
          >
            Dashboard
          </Link>
          <Link
            to={`/admin/inventory/${userId}/${id}`}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900"
          >
            Inventory
          </Link>
          <Link
            to={`/admin/budget/${userId}/${id}`}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900"
          >
            Budget
          </Link>
          <Link
            to={`/admin/GeoTagPics/${userId}/${id}`}
            className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-900"
          >
            GeoTaggedPics
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <FaUserCircle className="h-8 w-8 text-gray-700" />
            </div>
            
            
          </div>
          <div className="mt-3 px-2 space-y-1">
            <button
              onClick={() => navigate(`/profile/${userId}`)}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Profile
            </button>
            <button
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium"
            >
              Sign out
            </button>
          </div>
          <div className="pt-4 px-3">
            <button
              onClick={toggleMobileMenu}
              className="text-white text-center w-full py-2 border-t border-gray-700"
            >
              Close Menu
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
