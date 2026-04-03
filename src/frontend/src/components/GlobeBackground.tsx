import { useEffect, useRef } from "react";

export default function GlobeBackground() {
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

    // Arc ring config
    const NUM_RINGS = 9;
    const rings = Array.from({ length: NUM_RINGS }, (_, i) => ({
      radiusFactor: 0.22 + i * 0.045, // fraction of orb radius
      tiltX: (Math.random() - 0.5) * Math.PI,
      tiltY: (Math.random() - 0.5) * Math.PI,
      tiltZ: Math.random() * Math.PI,
      speed: 0.18 + Math.random() * 0.32,
      phase: Math.random() * Math.PI * 2,
      segments: 120 + Math.floor(Math.random() * 40),
      arcGap: 0.08 + Math.random() * 0.25, // fraction of arc that is "dark"
      width: 1.0 + Math.random() * 1.4,
    }));

    // Spark particles that live on the surface of the orb
    const NUM_SPARKS = 120;
    const sparks = Array.from({ length: NUM_SPARKS }, () => ({
      theta: Math.random() * Math.PI * 2,
      phi: Math.random() * Math.PI,
      speed: (Math.random() - 0.5) * 0.012,
      phiSpeed: (Math.random() - 0.5) * 0.008,
      size: 1.0 + Math.random() * 2.2,
      alpha: 0.4 + Math.random() * 0.6,
      color: Math.random() < 0.6 ? 0 : 1, // 0=bright red, 1=deep red
    }));

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      const cx = W / 2;
      const cy = H / 2;

      ctx.clearRect(0, 0, W, H);

      // Orb radius: ~28% of the smaller dimension
      const R = Math.min(W, H) * 0.28;

      // ── Core glow ──────────────────────────────────────────────
      // Outer atmosphere halo
      const halo = ctx.createRadialGradient(cx, cy, R * 0.3, cx, cy, R * 2.2);
      halo.addColorStop(0, "rgba(229,9,20,0.07)");
      halo.addColorStop(0.4, "rgba(180,0,15,0.04)");
      halo.addColorStop(1, "rgba(229,9,20,0)");
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Main orb body gradient
      const bodyGrad = ctx.createRadialGradient(
        cx - R * 0.25,
        cy - R * 0.25,
        R * 0.05,
        cx,
        cy,
        R,
      );
      bodyGrad.addColorStop(0, "rgba(255,80,80,0.28)");
      bodyGrad.addColorStop(0.25, "rgba(229,9,20,0.22)");
      bodyGrad.addColorStop(0.55, "rgba(180,0,15,0.14)");
      bodyGrad.addColorStop(0.8, "rgba(140,0,10,0.07)");
      bodyGrad.addColorStop(1, "rgba(100,0,0,0)");
      ctx.fillStyle = bodyGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core pulse
      const pulse = 0.85 + 0.15 * Math.sin(t * 1.8);
      const coreGrad = ctx.createRadialGradient(
        cx,
        cy,
        0,
        cx,
        cy,
        R * 0.55 * pulse,
      );
      coreGrad.addColorStop(0, "rgba(255,100,100,0.55)");
      coreGrad.addColorStop(0.4, "rgba(229,9,20,0.30)");
      coreGrad.addColorStop(0.75, "rgba(180,0,15,0.10)");
      coreGrad.addColorStop(1, "rgba(229,9,20,0)");
      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 0.55 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // ── Electric arc rings ──────────────────────────────────────
      for (let ri = 0; ri < rings.length; ri++) {
        const ring = rings[ri];
        const rr =
          R *
          ring.radiusFactor *
          (0.92 + 0.08 * Math.sin(t * ring.speed + ring.phase));
        const angle = t * ring.speed + ring.phase;

        ctx.save();
        ctx.translate(cx, cy);

        // 3D tilt: rotate around X then Y then Z axes (approximated with canvas transforms)
        // We simulate a 3D ring by drawing an ellipse:
        const tiltX = ring.tiltX + t * ring.speed * 0.07;
        const tiltY = ring.tiltY + t * ring.speed * 0.05;
        const tiltZ = ring.tiltZ + angle;

        // scaleY simulates X-axis tilt (foreshortening)
        const scaleY = Math.abs(Math.sin(tiltX + Math.sin(tiltY) * 0.4));
        const scaleX = 1.0;

        ctx.rotate(tiltZ);
        ctx.scale(scaleX, Math.max(0.08, scaleY));

        // Draw arc ring as a dashed ellipse made of line segments
        const segments = ring.segments;
        const gapFrac = ring.arcGap;
        // Arc gap shifts over time for lightning flicker
        const gapStart = (t * ring.speed * 0.6 + ri * 1.3) % (Math.PI * 2);

        // Brightness flicker
        const flicker = 0.55 + 0.45 * Math.abs(Math.sin(t * 4.5 + ri * 0.9));

        // Color: alternate bright red / deep red per ring
        const isBrightRed = ri % 3 !== 0;
        const baseAlpha = 0.18 * flicker;

        for (let s = 0; s < segments; s++) {
          const a0 = (s / segments) * Math.PI * 2;
          const a1 = ((s + 1) / segments) * Math.PI * 2;

          // Is this segment inside the gap?
          const midA = (a0 + a1) / 2;
          let distFromGap = Math.abs(midA - gapStart);
          if (distFromGap > Math.PI) distFromGap = Math.PI * 2 - distFromGap;
          if (distFromGap < gapFrac * Math.PI) continue;

          const x0 = Math.cos(a0) * rr;
          const y0 = Math.sin(a0) * rr;
          const x1 = Math.cos(a1) * rr;
          const y1 = Math.sin(a1) * rr;

          // Fade at gap edges
          const edgeFade = Math.min(1, (distFromGap - gapFrac * Math.PI) / 0.3);

          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1, y1);
          ctx.lineWidth = ring.width;
          ctx.strokeStyle = isBrightRed
            ? `rgba(229,9,20,${baseAlpha * edgeFade})`
            : `rgba(180,0,15,${baseAlpha * edgeFade})`;
          ctx.shadowBlur = 6;
          ctx.shadowColor = isBrightRed
            ? "rgba(229,9,20,0.6)"
            : "rgba(160,0,10,0.6)";
          ctx.stroke();
        }

        ctx.restore();
      }

      // ── Surface sparks ──────────────────────────────────────────
      for (const sp of sparks) {
        sp.theta += sp.speed;
        sp.phi += sp.phiSpeed;

        // Project sphere point to 2D (simple orthographic)
        const sinPhi = Math.sin(sp.phi);
        const sx = cx + R * sinPhi * Math.cos(sp.theta);
        const sy = cy + R * 0.62 * Math.cos(sp.phi); // slight flatten for 3D feel

        // Depth fade: dimmer when "behind" the sphere
        const depth = 0.3 + 0.7 * (0.5 + 0.5 * Math.cos(sp.phi));

        const baseA =
          sp.alpha * depth * (0.5 + 0.5 * Math.sin(t * 3.5 + sp.theta * 4));

        ctx.beginPath();
        ctx.arc(sx, sy, sp.size, 0, Math.PI * 2);
        ctx.fillStyle =
          sp.color === 0
            ? `rgba(255,60,60,${baseA})`
            : `rgba(229,9,20,${baseA})`;
        ctx.shadowBlur = 6;
        ctx.shadowColor =
          sp.color === 0 ? "rgba(255,50,50,0.8)" : "rgba(229,9,20,0.8)";
        ctx.fill();
      }

      // ── Rim glow (edge highlight) ───────────────────────────────
      const rimGlow = ctx.createRadialGradient(
        cx,
        cy,
        R * 0.82,
        cx,
        cy,
        R * 1.08,
      );
      rimGlow.addColorStop(0, "rgba(229,9,20,0)");
      rimGlow.addColorStop(0.55, "rgba(229,9,20,0.10)");
      rimGlow.addColorStop(0.8, "rgba(180,0,15,0.06)");
      rimGlow.addColorStop(1, "rgba(229,9,20,0)");
      ctx.fillStyle = rimGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, R * 1.08, 0, Math.PI * 2);
      ctx.fill();

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
          opacity: 0.52,
        }}
      />
    </div>
  );
}
