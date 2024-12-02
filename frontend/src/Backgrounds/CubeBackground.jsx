import React from "react";
import { Noise } from "react-noise";
import "./CubeBackground.css";

const CubeBackground = () => {
  return (
    <div className="cubes-container">
        
      {/* Top-right Cube */}
      <div className="cube-container top-right">
        <div className="cube">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face left"></div>
          <div className="face right"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>

      {/* Middle-left Cube */}
      <div className="cube-container middle-left">
        <div className="cube">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face left"></div>
          <div className="face right"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>

      {/* Bottom-right Cube */}
      <div className="cube-container bottom-right">
        <div className="cube">
          <div className="face front"></div>
          <div className="face back"></div>
          <div className="face left"></div>
          <div className="face right"></div>
          <div className="face top"></div>
          <div className="face bottom"></div>
        </div>
      </div>
    </div>
  );
};

export default CubeBackground;
