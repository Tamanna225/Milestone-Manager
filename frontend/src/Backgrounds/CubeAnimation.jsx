import React from "react";
import "./CubeStyles.css"; // Import the CSS file for animations and 3D transformations

const CubeAnimation = () => {
  return (
    <div className="flex justify-center items-center bg-black w-full h-[80vh]">
      {/* Outer Cube */}
      <div className="cube relative w-[300px] h-[300px] animate-spin-slow">
        {/* Top Face */}
        <div className="topD absolute top-0 left-0 w-full h-full bg-transparent border-2 border-green-400 transform rotate-x-90 translate-z-[150px]">
          <div className="absolute top-0 left-0 w-full h-full bg-transparent border-2 border-green-400 transform translate-z-[-400px] blur-[30px] shadow-cube"></div>
        </div>

        {/* Outer Cube Faces */}
        <div className="faces absolute top-0 left-0 w-full h-full preserve-3d">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="face absolute top-0 left-0 w-full h-full bg-transparent border-2 border-green-400"
              style={{
                transform: `rotateY(${90 * i}deg) translateZ(150px)`,
              }}
            ></span>
          ))}
        </div>

        {/* Inner Cube */}
        <div className="cube2 relative w-[150px] h-[150px] preserve-3d animate-ping-alt">
          <div className="faces2 absolute top-[35px] left-0 w-[65%] h-[65%] preserve-3d">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="face2 absolute top-[20%] left-[20%] w-[65%] h-[65%] bg-transparent border-2 border-green-400"
                style={{
                  transform: `rotateY(${90 * i}deg) translateZ(62px)`,
                }}
              ></span>
            ))}
          </div>

          {/* Smallest Cube */}
          <div className="cube3 absolute top-[70px] left-[70px] w-[15%] h-[15%] preserve-3d animate-pulse">
            <div className="top3 absolute top-0 left-0 w-full h-full bg-green-400 transform rotate-x-90 translate-z-[14px] shadow-cube"></div>
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="face3 absolute top-0 left-0 w-full h-full bg-green-400 shadow-cube"
                style={{
                  transform: `rotateY(${90 * i}deg) translateZ(14px)`,
                }}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CubeAnimation;
