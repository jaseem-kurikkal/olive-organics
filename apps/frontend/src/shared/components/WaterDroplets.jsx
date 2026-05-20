import React, { useEffect, useRef } from 'react';

const WaterDroplets = ({ color = '#93ba75', count = 20 }) => {
  const containerRef = useRef(null);

  const droplets = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    width: `${3 + Math.random() * 6}px`,
    height: `${5 + Math.random() * 10}px`,
    duration: `${15 + Math.random() * 15}s`,
    delay: `${Math.random() * 12}s`,
    opacity: 0.06 + Math.random() * 0.12,
  }));

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-10 overflow-hidden"
    >
      {droplets.map((drop) => (
        <div
          key={drop.id}
          className="absolute top-0 water-droplet"
          style={{
            left: drop.left,
            width: drop.width,
            height: drop.height,
            '--duration': drop.duration,
            '--delay': drop.delay,
            background: `radial-gradient(ellipse at 30% 25%, rgba(255,255,255,0.9), ${color}55 40%, ${color}22 70%, transparent)`,
            boxShadow: `inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.2), 0 2px 8px ${color}33`,
            filter: 'blur(0.3px)',
            opacity: drop.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default WaterDroplets;
