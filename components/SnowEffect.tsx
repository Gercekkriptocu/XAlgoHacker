
import React, { useEffect, useRef } from 'react';

const SnowEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const particles: { x: number; y: number; r: number; d: number; s: number }[] = [];
    const mp = 150; // max particles

    for (let i = 0; i < mp; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1, // size
        d: Math.random() * mp, // density
        s: Math.random() * 1 + 0.5 // speed
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Matrix-style snow is white with a hint of green glow
      ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
      ctx.shadowBlur = 5;
      ctx.shadowColor = "#00FF41";
      
      ctx.beginPath();
      for (let i = 0; i < mp; i++) {
        const p = particles[i];
        ctx.moveTo(p.x, p.y);
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2, true);
      }
      ctx.fill();
      update();
      animationFrameId = requestAnimationFrame(draw);
    };

    let angle = 0;
    const update = () => {
      angle += 0.01;
      for (let i = 0; i < mp; i++) {
        const p = particles[i];
        // Updating X and Y coordinates
        p.y += p.s + Math.cos(angle + p.d) + 1;
        p.x += Math.sin(angle) * 1.5;

        // Sending flakes back from the top when it exits
        if (p.x > canvas.width + 5 || p.x < -5 || p.y > canvas.height) {
          if (i % 3 > 0) { // 66.67% of the flakes
            particles[i] = { x: Math.random() * canvas.width, y: -10, r: p.r, d: p.d, s: p.s };
          } else {
            // If the flake is exiting from the right
            if (Math.sin(angle) > 0) {
              particles[i] = { x: -5, y: Math.random() * canvas.height, r: p.r, d: p.d, s: p.s };
            } else {
              particles[i] = { x: canvas.width + 5, y: Math.random() * canvas.height, r: p.r, d: p.d, s: p.s };
            }
          }
        }
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[60] opacity-40"
    />
  );
};

export default SnowEffect;
