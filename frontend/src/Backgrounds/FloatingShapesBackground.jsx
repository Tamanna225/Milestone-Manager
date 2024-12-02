import React from "react";
import "./FloatingShapesBackground.css"; // For custom animations

const FloatingShapesBackground = () => {
  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Floating shapes */}
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className={`shape absolute bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl shadow-2xl`}
        ></div>
      ))}
    </div>
  );
};

export default FloatingShapesBackground;
