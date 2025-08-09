"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  size: number;
}

const AnimatedBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      return Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 20 + Math.random() * 20,
        delay: Math.random() * 10,
        size: 2 + Math.random() * 3,
      }));
    };
    setParticles(generateParticles());
  }, []); // Empty dependency array ensures this runs only once on the client

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/40 dark:bg-primary/20 blur-xl"
          style={{
            width: `${p.size}rem`,
            height: `${p.size}rem`,
            left: `${p.x}%`,
            top: `${p.y}%`,
          }}
          animate={{
            x: [0, (Math.random() - 0.5) * 200, 0],
            y: [0, (Math.random() - 0.5) * 200, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: "mirror",
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
