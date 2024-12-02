import React from 'react';

const ConcreteBackground = () => {
  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-transparent to-transparent"></div>
      
      {/* Concrete Background */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/concrete.png')" }}></div>

      {/* Content Section */}
      <div className="relative z-10 flex items-center justify-center h-full text-center text-white p-4">
        <div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Construction Site</h1>
          <p className="text-lg">Building a better future, one project at a time.</p>
        </div>
      </div>
    </div>
  );
};

export default ConcreteBackground;
