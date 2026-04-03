import { useEffect, useRef } from "react";

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    // Aurora wave layers
    const waves = [
      { amplitude: 80, frequency: 0.002, speed: 0.3, yOffset: 0.3, color: "rgba(229,9,20,0.15)" },
      { amplitude: 100, frequency: 0.0015, speed: 0.2, yOffset: 0.4, color: "rgba(180,0,15,0.12)" },
      { amplitude: 120, frequency: 0.0018, speed: 0.25, yOffset: 0.5, color: "rgba(229,9,20,0.08)" },
      { amplitude: 90, frequency: 0.0022, speed: 0.35, yOffset: 0.6, color: "rgba(140,0,10,0.1)" },
    ];

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      // Draw aurora waves
      for (const wave of waves) {
        ctx.beginPath();
        
        for (let x = 0; x <= W; x += 2) {
          const y = 
            H * wave.yOffset + 
            Math.sin(x * wave.frequency + t * wave.speed) * wave.amplitude +
            Math.sin(x * wave.frequency * 0.5 + t * wave.speed * 0.7) * wave.amplitude * 0.5;
          
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        
        // Complete the shape
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        
        // Fill with gradient
        const gradient = ctx.createLinearGradient(0, H * wave.yOffset - wave.amplitude, 0, H);
        gradient.addColorStop(0, wave.color);
        gradient.addColorStop(1, "rgba(0,0,0,0)");
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Add glow on top edge
        ctx.strokeStyle = wave.color.replace(/[\d.]+\)$/, "0.3)");
        ctx.lineWidth = 2;
        ctx.filter = "blur(8px)";
        ctx.stroke();
        ctx.filter = "none";
      }

      t += 0.016;
      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
          opacity: 0.5,
        }}
      />
    </div>
  );
}
