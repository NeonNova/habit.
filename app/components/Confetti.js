import React, { useEffect, useRef } from 'react';

const Confetti = ({ generationDuration = 5000, mainColor = '#2d539e' }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isGenerating = true;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = [
      mainColor,
      "#608ede",
      "#4f7ac8",
      "#3e66b3",
      "#2d539e",
      "#1a3a85",
      "#08216c",
      "#000953"
    ];

    class Particle {
      constructor() {
        this.reset();
        this.form = Math.round(Math.random()); // 0 or 1 for rect or ellipse
        this.step = 0;
        this.grab = 0;
        this.grabFactor = Math.random() * 0.04 - 0.02;
        this.multFactor = Math.random() * 0.07 + 0.01;
        this.grabAngle = 0;
        this.grabSpeed = 0.05;
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * -100 - 20;
        this.velocityX = Math.random() * 12 - 6;
        this.velocityY = Math.random() * 12 - 10;
        this.friction = Math.random() * 0.015 + 0.98;
        this.size = Math.round(Math.random() * 10 + 5);
        this.halfSize = this.size / 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.velocityY += 0.1; // Gravity
        this.velocityX += this.grab;
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;
        this.x += this.velocityX;
        this.y += this.velocityY;

        this.grab = this.grabFactor + Math.cos(this.grabAngle) * this.multFactor;
        this.grabAngle += this.grabSpeed;

        if (this.y > canvas.height || this.x < 0 || this.x > canvas.width) {
          if (isGenerating) {
            this.reset();
          } else {
            return false; // Remove particle if it's out of bounds and not generating
          }
        }
        return true;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.velocityX * 2);
        ctx.scale(1, 0.5 + Math.sin(this.velocityY * 20) * 0.5);
        ctx.fillStyle = this.color;
        if (this.form === 0) {
          ctx.fillRect(-this.halfSize, -this.halfSize, this.size, this.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function createParticles() {
      if (isGenerating && particles.length < 500) {
        for (let i = 0; i < 50; i++) {
          particles.push(new Particle());
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      createParticles();
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].update()) {
          particles[i].draw();
        } else {
          particles.splice(i, 1);
        }
      }
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    animateParticles();

    // Stop generating new particles after the specified duration
    setTimeout(() => {
      isGenerating = false;
    }, generationDuration);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [generationDuration, mainColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    />
  );
};

export default Confetti;