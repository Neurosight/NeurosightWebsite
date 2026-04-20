// Neurosight — animation primitives (G / H / P / I / D / C / R / E / Pr / Ct picks)
// All hooks use refs + IntersectionObserver to trigger once on first view.

// ─── Primitives ──────────────────────────────────────────────
window.__nsScrollRoot = window.__nsScrollRoot || null;
function useInView(options = {}) {
  const ref = React.useRef(null);
  const [seen, setSeen] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current || seen) return;
    const opts = { threshold: 0.5, ...options, root: window.__nsScrollRoot || null };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        // grace so users register the element before motion starts
        setTimeout(() => setSeen(true), 200);
        io.disconnect();
      }
    }, opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, [seen]);
  return [ref, seen];
}

// G2. Fade-up reveal on scroll ─────────────────────────────────
function Reveal({ children, delay = 0, y = 16, as: Tag = 'div', style = {}, className = '' }) {
  const [ref, seen] = useInView();
  return (
    <Tag ref={ref} className={className} style={{
      ...style,
      opacity: seen ? 1 : 0,
      transform: seen ? 'translateY(0)' : `translateY(${y}px)`,
      transition: `opacity 700ms cubic-bezier(.2,.7,.2,1) ${delay}ms, transform 700ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      willChange: 'opacity, transform',
    }}>{children}</Tag>
  );
}

// H3. Typewriter (one-shot) ───────────────────────────────────
function Typewriter({ text, speed = 32, start = 0, caret = true, style = {} }) {
  const [n, setN] = React.useState(0);
  const [ref, seen] = useInView({ threshold: 0.4 });
  React.useEffect(() => {
    if (!seen) return;
    let i = 0;
    const tick = () => {
      i++;
      setN(i);
      if (i < text.length) setTimeout(tick, speed);
    };
    const t = setTimeout(tick, start);
    return () => clearTimeout(t);
  }, [seen, text]);
  return (
    <span ref={ref} style={style}>
      {text.slice(0, n)}
      {caret && seen && (
        <span style={{
          display: 'inline-block', width: '0.55em', marginLeft: 1,
          borderBottom: '1.5px solid currentColor',
          animation: n < text.length ? 'ns-caret 0.8s steps(2) infinite' : 'ns-caret-fade 1.6s forwards',
          opacity: 0.85,
        }}>&nbsp;</span>
      )}
    </span>
  );
}

// H1. WordKindle — color/gradient ignites left-to-right per line ─
// `color`: any CSS color/gradient — applied via background-clip:text on the bright layer.
function WordKindle({ children, color, delay = 0, durMs = 1430, style = {} }) {
  const [ref, seen] = useInView({ threshold: 0.25 });
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    if (!seen) return;
    let raf; const begin = performance.now() + delay;
    const loop = (t) => {
      if (t < begin) { raf = requestAnimationFrame(loop); return; }
      const k = Math.min(1, (t - begin) / durMs);
      const eased = 1 - Math.pow(1 - k, 3);
      setP(eased);
      if (k < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [seen]);
  const front = -10 + p * 120;
  const isGradient = typeof color === 'string' && /gradient\(/i.test(color);
  const brightLayer = isGradient
    ? {
        backgroundImage: color,
        WebkitBackgroundClip: 'text', backgroundClip: 'text',
        WebkitTextFillColor: 'transparent', color: 'transparent',
      }
    : { color };
  // Edge color: pick a representative tone from the gradient or use the solid color
  const edgeColor = isGradient
    ? (color.match(/oklch\([^)]+\)|#[0-9a-f]{3,8}|rgba?\([^)]+\)/i)?.[0] || '#fff')
    : color;
  return (
    <span ref={ref} style={{
      ...style,
      position: 'relative', display: 'inline-block',
      color: 'oklch(0.42 0.015 95)', // dim base
    }}>
      {children}
      <span aria-hidden style={{
        position: 'absolute', inset: 0,
        ...brightLayer,
        clipPath: `polygon(0 0, ${Math.max(0, front)}% 0, ${Math.max(0, front)}% 100%, 0 100%)`,
      }}>{children}</span>
    </span>
  );
}

// P1 / R1. Counter roll-up ───────────────────────────────────
function Counter({ to, from = 0, duration = 1400, prefix = '', suffix = '', format = (n) => Math.round(n).toString(), start = 0, style = {} }) {
  const [ref, seen] = useInView({ threshold: 0.4 });
  const [v, setV] = React.useState(from);
  React.useEffect(() => {
    if (!seen) return;
    const begin = performance.now() + start;
    let raf;
    const loop = (t) => {
      if (t < begin) { raf = requestAnimationFrame(loop); return; }
      const p = Math.min(1, (t - begin) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setV(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [seen]);
  return <span ref={ref} style={style}>{prefix}{format(v)}{suffix}</span>;
}

// I1. Bar fill on view ───────────────────────────────────────
function BarFill({ pct, color, height = 5, duration = 1100, delay = 0 }) {
  const [ref, seen] = useInView({ threshold: 0.35 });
  return (
    <div ref={ref} style={{
      height, background: 'oklch(0.85 0.01 95 / 0.08)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, bottom: 0,
        width: seen ? `${pct}%` : '0%',
        background: color, boxShadow: `0 0 10px ${color}`,
        transition: `width ${duration}ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }} />
    </div>
  );
}

// E1. Strikethrough wipe ─────────────────────────────────────
function StrikeWipe({ children, delay = 0, duration = 700, style = {} }) {
  const [ref, seen] = useInView({ threshold: 0.4 });
  return (
    <span ref={ref} style={{
      ...style,
      position: 'relative', display: 'inline-block',
    }}>
      {children}
      <span style={{
        position: 'absolute', left: 0, top: '50%', height: 1.5,
        width: seen ? '100%' : '0%',
        background: 'currentColor',
        transition: `width ${duration}ms cubic-bezier(.2,.7,.2,1) ${delay}ms`,
      }} />
    </span>
  );
}

// Pr2. Node pulse on enter ───────────────────────────────────
// If `active` is provided, parent controls the trigger; otherwise auto-triggers on view.
function PulseNode({ color, size = 17, active, children }) {
  const [ref, seen] = useInView({ threshold: 0.6 });
  const fire = active !== undefined ? active : seen;
  return (
    <div ref={ref} style={{
      position: 'absolute', left: 6, top: 4, width: size, height: size,
      background: '#000', border: `1.5px solid ${color}`,
      boxShadow: fire ? `0 0 22px ${color}, 0 0 44px ${color}` : `0 0 14px ${color}`,
      transition: 'box-shadow 600ms ease-out',
    }}>
      {fire && (
        <>
          <span style={{
            position: 'absolute', inset: -1, border: `2px solid ${color}`,
            animation: 'ns-pulse-bold 1.6s ease-out forwards',
          }} />
          <span style={{
            position: 'absolute', inset: -1, border: `1.5px solid ${color}`,
            animation: 'ns-pulse-bold 1.6s ease-out 180ms forwards',
            opacity: 0.7,
          }} />
        </>
      )}
      {children}
    </div>
  );
}

// D3. Rainbow cycle text ─────────────────────────────────────
function RainbowCycle({ children, style = {} }) {
  return (
    <span style={{
      ...style,
      background: 'linear-gradient(95deg, oklch(0.72 0.28 8), oklch(0.78 0.20 320), oklch(0.82 0.18 200), oklch(0.92 0.18 98), oklch(0.72 0.28 8))',
      backgroundSize: '300% 100%',
      WebkitBackgroundClip: 'text', backgroundClip: 'text',
      WebkitTextFillColor: 'transparent', color: 'transparent',
      animation: 'ns-rainbow 8s linear infinite',
    }}>{children}</span>
  );
}

// G1. Scroll scanline ────────────────────────────────────────
function Scanline({ containerRef }) {
  const [pct, setPct] = React.useState(0);
  React.useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const on = () => {
      const h = el.scrollHeight - el.clientHeight;
      setPct(h > 0 ? el.scrollTop / h : 0);
    };
    el.addEventListener('scroll', on, { passive: true });
    on();
    return () => el.removeEventListener('scroll', on);
  }, [containerRef]);
  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, pointerEvents: 'none',
      zIndex: 40, height: '100%',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0,
        top: `${pct * 100}%`, height: 2,
        background: 'linear-gradient(90deg, transparent, oklch(0.82 0.18 200 / 0.9), transparent)',
        boxShadow: '0 0 12px oklch(0.82 0.18 200 / 0.8)',
        transform: 'translateY(-50%)',
        opacity: pct > 0.002 && pct < 0.998 ? 0.7 : 0,
        transition: 'opacity 400ms',
      }} />
    </div>
  );
}

// G3. Tap ripple — neuron firing ─────────────────────────────
function Ripples({ containerRef }) {
  const [ripples, setRipples] = React.useState([]);
  const overlayRef = React.useRef(null);
  React.useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    let id = 0;
    const on = (ev) => {
      const overlay = overlayRef.current;
      if (!overlay) return;
      const rect = overlay.getBoundingClientRect();
      const cx = ev.touches?.[0]?.clientX ?? ev.clientX;
      const cy = ev.touches?.[0]?.clientY ?? ev.clientY;
      if (cx == null || cy == null) return;
      // Account for any CSS transform (scale) on ancestors
      const sx = rect.width && overlay.offsetWidth ? overlay.offsetWidth / rect.width : 1;
      const sy = rect.height && overlay.offsetHeight ? overlay.offsetHeight / rect.height : 1;
      const x = (cx - rect.left) * sx;
      const y = (cy - rect.top) * sy;
      const thisId = ++id;
      const colors = ['oklch(0.82 0.18 200)', 'oklch(0.78 0.20 320)', 'oklch(0.92 0.18 98)', 'oklch(0.72 0.28 8)'];
      const c = colors[thisId % colors.length];
      setRipples(r => [...r, { id: thisId, x, y, c }]);
      setTimeout(() => setRipples(r => r.filter(p => p.id !== thisId)), 500);
    };
    el.addEventListener('pointerdown', on, { passive: true });
    return () => el.removeEventListener('pointerdown', on);
  }, [containerRef]);
  return (
    <div ref={overlayRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 41, overflow: 'hidden' }}>
      {ripples.map(r => (
        <span key={r.id} style={{
          position: 'absolute', left: r.x, top: r.y, width: 0, height: 0,
          border: `1.5px solid ${r.c}`, borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 14px ${r.c}`,
          animation: 'ns-ripple 450ms cubic-bezier(.2,.7,.2,1) forwards',
        }} />
      ))}
    </div>
  );
}

// Group sequencer: wait until all children's container is in view (threshold)
// then reveal each child with `interval` ms staggered fade-up.
function SequentialReveal({ children, interval = 250, threshold = 0.7, y = 12, style = {}, itemStyle = {} }) {
  const ref = React.useRef(null);
  const arr = React.Children.toArray(children);
  const [n, setN] = React.useState(-1); // index of last revealed
  React.useEffect(() => {
    if (!ref.current) return;
    const opts = { threshold, root: window.__nsScrollRoot || null };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        arr.forEach((_, i) => setTimeout(() => setN(v => Math.max(v, i)), i * interval));
        io.disconnect();
      }
    }, opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={style}>
      {arr.map((child, i) => (
        <div key={i} style={{
          ...itemStyle,
          opacity: i <= n ? 1 : 0,
          transform: i <= n ? 'translateY(0)' : `translateY(${y}px)`,
          transition: 'opacity 600ms cubic-bezier(.2,.7,.2,1), transform 600ms cubic-bezier(.2,.7,.2,1)',
          willChange: 'opacity, transform',
        }}>{child}</div>
      ))}
    </div>
  );
}

Object.assign(window, { SequentialReveal });

Object.assign(window, {
  useInView, Reveal, Typewriter, WordKindle, Counter, BarFill, StrikeWipe, PulseNode, RainbowCycle, Scanline, Ripples,
});
