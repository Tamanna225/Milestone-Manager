import React from 'react';

const RevolvingCubes = () => {
  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center overflow-hidden relative">
      {/* Cube 1 (Left, Smaller) */}
      <div className="absolute left-20 top-1/4 animate-spin-slow">
        <div className="w-12 h-12 bg-blue-500 transform rotate-45"></div>
      </div>

      {/* Cube 2 (Left, Larger) */}
      <div className="absolute left-28 bottom-1/3 animate-spin-fast">
        <div className="w-16 h-16 bg-red-500 transform rotate-45"></div>
      </div>

      {/* Cube 3 (Right, Medium) */}
      <div className="absolute right-20 top-1/3 animate-spin-medium">
        <div className="w-14 h-14 bg-green-500 transform rotate-45"></div>
      </div>
    </div>
  );
};

export default RevolvingCubes;
