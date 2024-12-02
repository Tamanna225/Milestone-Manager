import React from "react";
import "./BackgroundEffect.css"; // For custom animations

const BackgroundEffect = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-blue-900 via-black to-blue-800">
      {/* Create multiple cubes */}
      {[...Array(20)].map((_, index) => (
        <div
          key={index}
          className={`absolute w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-400 rounded transform animate-floating cube-${index}`}
        ></div>
      ))}
    </div>
  );
};

export default BackgroundEffect;
