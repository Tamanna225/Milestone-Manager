import React from "react";
import "./Planet.css"; // For custom keyframes and additional styles

const Planet = () => {
  return (
    <div className="flex items-center justify-center m-6">
      <div className="relative w-64 h-64 rounded-full shadow-[5px_-3px_10px_3px_#5e90f1]">
        {/* Night Layer */}
        <div
          className="absolute w-full h-full rounded-full z-10"
          style={{
            backgroundImage:
              "url('https://www.solarsystemscope.com/textures/download/2k_earth_nightmap.jpg')",
            backgroundSize: "200%",
            animation: "rotate-night 80s linear infinite",
          }}
        ></div>

        {/* Day Layer */}
        <div
          className="absolute w-full h-full rounded-full z-20"
          style={{
            backgroundImage:
              "url('https://www.solarsystemscope.com/textures/download/2k_earth_daymap.jpg')",
            backgroundSize: "200%",
            boxShadow: "5px 0 20px 10px #040615 inset",
            borderLeft: "1px solid black",
            marginLeft: "28px",
            animation: "rotate-day 80s linear infinite",
          }}
        ></div>

        {/* Clouds Layer */}
        <div
          className="absolute w-full h-full rounded-full z-30 opacity-45"
          style={{
            backgroundImage:
              "url('https://www.solarsystemscope.com/textures/download/2k_earth_clouds.jpg')",
            backgroundSize: "200%",
            boxShadow:
              "5px 0 20px 10px #040615 inset, -9px 0px 20px 10px #5e90f1 inset",
            marginLeft: "25px",
            animation: "rotate-day 50s linear infinite, spin-clouds 100s ease infinite",
          }}
        ></div>

        {/* Inner Shadow */}
        <div
          className="absolute w-full h-full rounded-full z-40"
          style={{
            boxShadow:
              "-5px 0 10px 1px #152b57 inset, 5px 0 10px 1px #040615 inset",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Planet;
