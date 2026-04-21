// Desktop sections: Results (4x2 grid), Candidate Experience, Process, Contact, Footer.

// Inject glitch-repair keyframes once.
if (typeof document !== 'undefined' && !document.getElementById('ns-glitch-fix-css')) {
  const s = document.createElement('style');
  s.id = 'ns-glitch-fix-css';
  s.textContent = `
    @keyframes nsGlitchShift {
      0%, 100% { transform: translate(0,0); }
      10% { transform: translate(-5px, 2px) skewX(-2deg); }
      20% { transform: translate(5px, -2px) skewX(2deg); }
      30% { transform: translate(-3px, 4px); }
      40% { transform: translate(3px, -4px) skewX(-1deg); }
      50% { transform: translate(-5px, 0); }
      60% { transform: translate(5px, 2px) skewX(1.5deg); }
      70% { transform: translate(-2px, -3px); }
      80% { transform: translate(2px, 3px) skewX(-1deg); }
      90% { transform: translate(0, -2px); }
    }
    @keyframes nsGlitchClip {
      0%   { clip-path: inset(0 0 85% 0); }
      15%  { clip-path: inset(10% 0 60% 0); }
      30%  { clip-path: inset(55% 0 10% 0); }
      45%  { clip-path: inset(20% 0 55% 0); }
      60%  { clip-path: inset(70% 0 5% 0); }
      75%  { clip-path: inset(35% 0 35% 0); }
      90%  { clip-path: inset(5% 0 70% 0); }
      100% { clip-path: inset(0 0 0 0); }
    }
    .ns-glitch-host { position: relative; display: inline-block; }
    .ns-glitch-host.is-hidden .ns-glitch-main,
    .ns-glitch-host.is-hidden .ns-glitch-ghost { opacity: 0; }
    .ns-glitch-host.is-glitching .ns-glitch-main {
      animation: nsGlitchShift 180ms steps(5,end) infinite;
    }
    .ns-glitch-host .ns-glitch-ghost {
      position: absolute; inset: 0; pointer-events: none;
      opacity: 0; mix-blend-mode: screen;
    }
    .ns-glitch-host.is-glitching .ns-glitch-ghost { opacity: 1; }
    .ns-glitch-host.is-glitching .ns-glitch-ghost.ns-glitch-cyan {
      color: oklch(0.82 0.18 200); transform: translate(-7px, 0);
      animation: nsGlitchClip 220ms steps(5,end) infinite;
      filter: drop-shadow(0 0 8px oklch(0.82 0.18 200 / 0.8));
    }
    .ns-glitch-host.is-glitching .ns-glitch-ghost.ns-glitch-magenta {
      color: oklch(0.72 0.24 8); transform: translate(7px, 0);
      animation: nsGlitchClip 260ms steps(5,end) infinite reverse;
      filter: drop-shadow(0 0 8px oklch(0.72 0.24 8 / 0.8));
    }
    .ns-glitch-host .ns-glitch-scan {
      position: absolute; inset: 0; pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        transparent 0,
        transparent 2px,
        oklch(0.92 0.01 95 / 0.18) 2px,
        oklch(0.92 0.01 95 / 0.18) 3px
      );
      opacity: 0; transition: opacity 100ms;
      mix-blend-mode: overlay;
    }
    .ns-glitch-host.is-glitching .ns-glitch-scan { opacity: 1; }
  `;
  document.head.appendChild(s);
}

// GlitchFix: renders `children` with an RGB-split, torn-clip glitch that resolves
// into a clean word once in view. Fires once. Re-runs on hover for delight.
// ScaffoldFix — option 3: construction scaffolding draw-on.
// Each letter is assembled from straight structural segments (beams + diagonal
// braces) drawn in sequence via stroke-dashoffset, evoking a framework being
// erected. The glyphs are hand-authored — they intentionally look constructed,
// not typographic.
if (typeof document !== 'undefined' && !document.getElementById('ns-scaffold-fix-css')) {
  const s = document.createElement('style');
  s.id = 'ns-scaffold-fix-css';
  s.textContent = `
    .ns-scaffold-host {
      position: relative; display: inline-block;
      vertical-align: baseline; line-height: 1;
    }
    .ns-scaffold-host .ns-scaffold-sizer {
      visibility: hidden; white-space: nowrap;
    }
    .ns-scaffold-host .ns-scaffold-real {
      position: absolute; left: 0; top: 0; white-space: nowrap;
      opacity: 0; transform: translateY(4px);
      transition: opacity 520ms ease-out, transform 520ms ease-out;
      pointer-events: none;
    }
    .ns-scaffold-host.is-done .ns-scaffold-real {
      opacity: 1; transform: translateY(0);
    }
    .ns-scaffold-host svg.ns-scaffold-svg {
      position: absolute; left: 0; top: 0;
      width: 100%; height: 100%; overflow: visible;
    }
    .ns-scaffold-host .ns-scaffold-seg {
      stroke: oklch(0.92 0.18 98);
      stroke-width: 6;
      stroke-linecap: round;
      fill: none;
      stroke-dasharray: var(--len);
      stroke-dashoffset: var(--len);
      filter: drop-shadow(0 0 8px oklch(0.92 0.18 98 / 0.65));
      opacity: 0;
    }
    .ns-scaffold-host.is-drawing .ns-scaffold-seg,
    .ns-scaffold-host.is-filling .ns-scaffold-seg {
      opacity: 1;
      animation: nsScaffoldDraw 520ms cubic-bezier(.5,.05,.2,1) both;
      animation-delay: var(--d);
    }
    .ns-scaffold-host.is-done .ns-scaffold-seg {
      opacity: 0;
      transition: opacity 420ms ease-out;
    }
    @keyframes nsScaffoldDraw {
      from { stroke-dashoffset: var(--len); }
      to   { stroke-dashoffset: 0; }
    }
    /* Bolt / joint heads at segment endpoints */
    .ns-scaffold-host .ns-scaffold-bolt {
      fill: oklch(0.92 0.18 98);
      opacity: 0;
      filter: drop-shadow(0 0 4px oklch(0.92 0.18 98 / 0.9));
      transform-origin: center;
    }
    .ns-scaffold-host.is-drawing .ns-scaffold-bolt,
    .ns-scaffold-host.is-filling .ns-scaffold-bolt {
      animation: nsScaffoldBolt 280ms ease-out both;
      animation-delay: var(--d);
    }
    .ns-scaffold-host.is-done .ns-scaffold-bolt {
      opacity: 0;
      transition: opacity 320ms ease-out;
    }
    @keyframes nsScaffoldBolt {
      0% { opacity: 0; transform: scale(0.2); }
      60% { opacity: 1; transform: scale(1.3); }
      100% { opacity: 0.9; transform: scale(1); }
    }
    /* Diagonal braces — thinner, dashed, secondary aesthetic */
    .ns-scaffold-host .ns-scaffold-brace {
      stroke: oklch(0.82 0.18 200);
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-dasharray: 4 5;
      fill: none;
      opacity: 0;
      filter: drop-shadow(0 0 4px oklch(0.82 0.18 200 / 0.7));
    }
    .ns-scaffold-host.is-drawing .ns-scaffold-brace,
    .ns-scaffold-host.is-filling .ns-scaffold-brace,
    .ns-scaffold-host.is-done .ns-scaffold-brace {
      animation: nsScaffoldBrace 400ms ease-out both;
      animation-delay: var(--d);
    }
    @keyframes nsScaffoldBrace {
      from { opacity: 0; }
      to { opacity: 0.75; }
    }
    /* Final settling: braces fade, main segments stay as the word */
    .ns-scaffold-host.is-done .ns-scaffold-brace {
      animation: nsScaffoldBraceOut 500ms ease-out 100ms forwards;
    }
    @keyframes nsScaffoldBraceOut {
      from { opacity: 0.75; }
      to { opacity: 0; }
    }
  `;
  document.head.appendChild(s);
}

// Hand-authored 'fix' built from beams. Coordinate system is per-letter in a
// 100-wide × 140-tall box; the word has 3 letters laid out horizontally.
// Each segment has: [x1,y1,x2,y2] and a draw-delay (ms).
// Total word viewBox: 0 0 340 160
const SCAFFOLD_GLYPHS = (() => {
  // F: vertical spine + top bar + middle bar (3 beams)
  const F = {
    ox: 0,
    segs: [
      { x1: 10, y1: 10, x2: 10, y2: 140, d: 0 },   // spine
      { x1: 10, y1: 10, x2: 80, y2: 10,  d: 120 }, // top bar
      { x1: 10, y1: 68, x2: 62, y2: 68,  d: 240 }, // mid bar
    ],
    braces: [
      // diagonal trusses in the two "boxes" the F leaves open
      { x1: 10, y1: 10, x2: 80, y2: 68,  d: 340 },
      { x1: 10, y1: 68, x2: 62, y2: 140, d: 400 },
    ],
    bolts: [
      { cx: 10, cy: 10,  d: 60 },  { cx: 80, cy: 10,  d: 180 },
      { cx: 10, cy: 68,  d: 280 }, { cx: 62, cy: 68,  d: 320 },
      { cx: 10, cy: 140, d: 120 },
    ],
  };
  // I: top cap + vertical spine + bottom cap
  const I = {
    ox: 110,
    segs: [
      { x1: 10, y1: 10,  x2: 60, y2: 10,  d: 360 }, // top cap
      { x1: 35, y1: 10,  x2: 35, y2: 140, d: 420 }, // spine
      { x1: 10, y1: 140, x2: 60, y2: 140, d: 560 }, // bottom cap
    ],
    braces: [
      { x1: 10, y1: 10,  x2: 60, y2: 140, d: 640 },
      { x1: 60, y1: 10,  x2: 10, y2: 140, d: 700 },
    ],
    bolts: [
      { cx: 10, cy: 10,  d: 400 }, { cx: 60, cy: 10,  d: 400 },
      { cx: 35, cy: 75,  d: 500 },
      { cx: 10, cy: 140, d: 600 }, { cx: 60, cy: 140, d: 600 },
    ],
  };
  // X: two diagonals
  const X = {
    ox: 200,
    segs: [
      { x1: 10, y1: 10,  x2: 90, y2: 140, d: 720 }, // \ diagonal
      { x1: 90, y1: 10,  x2: 10, y2: 140, d: 860 }, // / diagonal
    ],
    braces: [
      // short horizontal truss through the middle
      { x1: 20, y1: 75, x2: 80, y2: 75, d: 980 },
    ],
    bolts: [
      { cx: 10, cy: 10,  d: 760 }, { cx: 90, cy: 10,  d: 900 },
      { cx: 50, cy: 75,  d: 1000 },
      { cx: 10, cy: 140, d: 820 }, { cx: 90, cy: 140, d: 940 },
    ],
  };
  return [F, I, X];
})();

const ScaffoldFix = () => {
  const hostRef = React.useRef(null);
  const sizerRef = React.useRef(null);
  const [box, setBox] = React.useState({ w: 0, h: 0 });
  const [phase, setPhase] = React.useState('hidden'); // hidden → drawing → filling → done
  const started = React.useRef(false);

  React.useLayoutEffect(() => {
    if (!sizerRef.current) return;
    const measure = () => {
      const r = sizerRef.current.getBoundingClientRect();
      setBox({ w: r.width, h: r.height });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(sizerRef.current);
    return () => ro.disconnect();
  }, []);

  React.useEffect(() => {
    if (!hostRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio >= 0.9 && !started.current) {
        started.current = true;
        setTimeout(() => setPhase('drawing'), 400);
        // drawing runs ~1200ms total; hold for a beat, then settle
        setTimeout(() => setPhase('done'), 400 + 1400);
        io.disconnect();
      }
    }, { threshold: [0, 0.5, 0.9, 1] });
    io.observe(hostRef.current);
    return () => io.disconnect();
  }, []);

  const cls = `ns-scaffold-host${
    phase === 'drawing' ? ' is-drawing' :
    phase === 'filling' ? ' is-filling' :
    phase === 'done' ? ' is-done' : ''
  }`;

  // Compute segment length for stroke-dash animation.
  const segLen = (s) => Math.hypot(s.x2 - s.x1, s.y2 - s.y1) + 2;

  return (
    <span ref={hostRef} className={cls}>
      <span className="ns-scaffold-sizer" ref={sizerRef}>fix</span>
      <span className="ns-scaffold-real" aria-hidden={phase !== 'done'}>fix</span>
      {box.w > 0 && (
        <svg
          className="ns-scaffold-svg"
          viewBox="0 0 300 160"
          preserveAspectRatio="xMinYMid meet"
          aria-hidden
        >
          {SCAFFOLD_GLYPHS.map((g, gi) => (
            <g key={gi} transform={`translate(${g.ox}, 10)`}>
              {g.braces.map((b, i) => (
                <line
                  key={`b${i}`}
                  className="ns-scaffold-brace"
                  x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
                  style={{ '--d': `${b.d}ms` }}
                />
              ))}
              {g.segs.map((s, i) => {
                const L = segLen(s);
                return (
                  <line
                    key={`s${i}`}
                    className="ns-scaffold-seg"
                    x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                    style={{ '--len': L, '--d': `${s.d}ms` }}
                  />
                );
              })}
              {g.bolts.map((bo, i) => (
                <circle
                  key={`bo${i}`}
                  className="ns-scaffold-bolt"
                  cx={bo.cx} cy={bo.cy} r="4"
                  style={{ '--d': `${bo.d}ms` }}
                />
              ))}
            </g>
          ))}
        </svg>
      )}
    </span>
  );
};

// GlitchFix — option 2 (set aside). Swap back by changing `<ScaffoldFix>` in the contact heading.
const GlitchFix = ({ children }) => {
  const ref = React.useRef(null);
  const [phase, setPhase] = React.useState('hidden'); // 'hidden' -> 'glitching' -> 'settled'
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio >= 0.9 && phase === 'hidden') {
        // 200ms delay where word is invisible, THEN glitch kicks in
        setTimeout(() => setPhase('glitching'), 200);
        setTimeout(() => setPhase('settled'), 200 + 900);
        io.disconnect();
      }
    }, { threshold: [0, 0.5, 0.9, 1] });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [phase]);
  const onHover = () => {
    if (phase !== 'settled') return;
    setPhase('glitching');
    setTimeout(() => setPhase('settled'), 520);
  };
  const cls = `ns-glitch-host${phase === 'hidden' ? ' is-hidden' : ''}${phase === 'glitching' ? ' is-glitching' : ''}`;
  return (
    <span ref={ref} className={cls} onMouseEnter={onHover}>
      <span className="ns-glitch-ghost ns-glitch-cyan" aria-hidden>{children}</span>
      <span className="ns-glitch-ghost ns-glitch-magenta" aria-hidden>{children}</span>
      <span className="ns-glitch-main">{children}</span>
      <span className="ns-glitch-scan" aria-hidden />
    </span>
  );
};

// Rotating praise verbs — ported from mobile for the candidate-experience hero line.
const PRAISE_WORDS_D = [
  { verb: 'Appreciated', color: 'oklch(0.82 0.18 200)' },
  { verb: 'Praised',     color: 'oklch(0.92 0.18 98)' },
  { verb: 'Recommended', color: 'oklch(0.82 0.18 200)' },
  { verb: 'Championed',  color: 'oklch(0.78 0.20 320)' },
];
const RotatingPraise = () => {
  const [ref, seen] = useInView({ threshold: 0.5 });
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (!seen) return;
    const t = setInterval(() => setI(v => (v + 1) % PRAISE_WORDS_D.length), 1800);
    return () => clearInterval(t);
  }, [seen]);
  const widest = PRAISE_WORDS_D.reduce((a, b) => (a.verb.length > b.verb.length ? a : b)).verb;
  return (
    <span ref={ref} style={{ display: 'block' }}>
      <span style={{ position: 'relative', display: 'inline-block', verticalAlign: 'baseline' }}>
        <span aria-hidden style={{ visibility: 'hidden', whiteSpace: 'nowrap' }}>{widest}</span>
        {PRAISE_WORDS_D.map((p, idx) => (
          <span key={p.verb} style={{
            position: 'absolute', left: 0, top: 0,
            color: p.color, whiteSpace: 'nowrap',
            transition: 'opacity 520ms cubic-bezier(.2,.8,.2,1), transform 520ms cubic-bezier(.2,.8,.2,1), filter 520ms',
            opacity: idx === i ? 1 : 0,
            transform: idx === i ? 'translateY(0)' : (idx === (i - 1 + PRAISE_WORDS_D.length) % PRAISE_WORDS_D.length ? 'translateY(-14px)' : 'translateY(14px)'),
            filter: idx === i ? 'blur(0)' : 'blur(6px)',
            textShadow: idx === i ? `0 0 30px ${p.color}60` : 'none',
          }}>{p.verb}</span>
        ))}
      </span>
      <span style={{ color: 'var(--ns-white)' }}><br/>by candidates.</span>
    </span>
  );
};
window.RotatingPraise = RotatingPraise;


// ═══════════════════════════════════════════════
// 05 — RESULTS  (big 4x2 grid, the showstopper)
// ═══════════════════════════════════════════════
const DResults = () => {
  const stats = [
    { n: 96,   suf: '%', l: 'New hires rated "excellent" or "good"',         c: 'oklch(0.82 0.18 200)' },
    { n: 130,  suf: '%', l: 'Increase in neurodiverse hires',                 c: 'oklch(0.78 0.20 320)' },
    { n: 70,   suf: '%', l: 'Reduction in year-one attrition',                c: 'oklch(0.80 0.19 155)' },
    { n: '3–6×', suf: '', l: 'Higher observed validity than conventional',    c: 'var(--ns-yellow)' },
    { n: 99,   suf: '%', l: 'Candidate completion rate',                      c: 'oklch(0.72 0.18 240)' },
    { n: 70,   suf: '', pre: '+', l: 'Candidate NPS',                         c: 'oklch(0.80 0.19 155)' },
    { n: 70,   suf: '%', l: 'Increase in female representation at offer',     c: 'oklch(0.78 0.20 320)' },
    { n: 64,   suf: '%', l: 'Improvement in BAME pass rates',                 c: 'oklch(0.82 0.18 200)' },
  ];

  const [fired, setFired] = React.useState(() => new Set());
  const gateRef = React.useRef(null);
  const triggered = React.useRef(false);

  React.useEffect(() => {
    if (!gateRef.current) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (triggered.current) return;
        if (e.isIntersecting && e.intersectionRatio >= 0.6) {
          triggered.current = true;
          stats.forEach((_, i) => {
            // Reading-order stagger, pairs per row: 250ms per column, 500ms per row
            const col = i % 4; const row = Math.floor(i / 4);
            setTimeout(() => {
              setFired((prev) => { const next = new Set(prev); next.add(i); return next; });
            }, row * 600 + col * 150);
          });
        }
      });
    }, { threshold: [0, 0.3, 0.6, 0.9] });
    io.observe(gateRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="results" style={{
      position: 'relative', padding: '90px 32px 84px', overflow: 'hidden',
      borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)',
    }}>
      <style>{`
        @keyframes ns-stat-pulse {
          0%   { text-shadow: 0 0 14px var(--pulse-c); transform: scale(1); }
          40%  { text-shadow: 0 0 64px var(--pulse-c), 0 0 28px var(--pulse-c); transform: scale(1.05); }
          100% { text-shadow: 0 0 18px var(--pulse-c); transform: scale(1); }
        }
      `}</style>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'transparent',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', left: '50%', top: '30%', transform: 'translateX(-50%)',
        width: 1000, height: 400,
        background: 'radial-gradient(ellipse, oklch(0.92 0.18 98 / 0.10), transparent 60%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: MAX_W, margin: '0 auto', position: 'relative' }}>
        <div style={{ textAlign: 'center', marginBottom: 70 }}>
          <DSectionHeader n="05" label="REAL-WORLD OUTCOMES" color="var(--ns-yellow)" />
          <h2 style={{
            fontFamily: 'var(--ns-display)', fontSize: 80, lineHeight: 0.96,
            letterSpacing: -3, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
          }}>
            What our customers see.
          </h2>
          <p style={{
            fontFamily: 'var(--ns-body)', fontSize: 19, lineHeight: 1.5,
            color: 'oklch(0.92 0.01 95 / 0.82)',
            margin: '24px auto 0', maxWidth: 620,
          }}>
            Outcome highlights from Grant Thornton, Virgin Media O2, Sellafield, the NHS and others.
          </p>
        </div>

        <div ref={gateRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: 'oklch(0.85 0.01 95 / 0.1)',
          border: '1px solid oklch(0.85 0.01 95 / 0.1)',
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: '#000', padding: '40px 28px',
              minHeight: 220,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              alignItems: 'center', textAlign: 'center',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: 2,
                background: s.c, opacity: fired.has(i) ? 0.6 : 0,
                boxShadow: `0 0 14px ${s.c}`,
                transition: 'opacity 500ms',
              }} />
              <div style={{
                fontFamily: 'var(--ns-display)', fontSize: 64, fontWeight: 500,
                color: s.c, letterSpacing: -3, lineHeight: 0.92,
                textShadow: `0 0 14px ${s.c}`,
                animation: fired.has(i) ? 'ns-stat-pulse 900ms cubic-bezier(.2,.7,.2,1) forwards' : 'none',
                '--pulse-c': s.c,
              }}>
                {(s.pre || '') + s.n + (s.suf || '')}
              </div>
              <div style={{
                fontFamily: 'var(--ns-body)', fontSize: 14, lineHeight: 1.4,
                color: 'oklch(0.92 0.01 95 / 0.9)', marginTop: 20,
              }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════
// 06 — CANDIDATE EXPERIENCE
// ═══════════════════════════════════════════════
const DCandidateExp = () => {
  const left = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      <DSectionHeader n="06" label="CANDIDATE EXPERIENCE" color="oklch(0.82 0.18 200)" />
      <h2 style={{
        fontFamily: 'var(--ns-display)', fontSize: 64, lineHeight: 0.98,
        letterSpacing: -2.5, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
      }}>
        Fully brand-aligned.<br/>
        <RotatingPraise />
      </h2>
      <div style={{ marginTop: 'auto' }}>
        <p style={{
          fontFamily: 'var(--ns-body)', fontSize: 19, lineHeight: 1.55,
          color: 'oklch(0.92 0.01 95 / 0.85)', margin: '32px 0 20px', maxWidth: 520,
        }}>
          Conventional tests are time consuming and anxiety-inducing.
        </p>
        <p style={{
          fontFamily: 'var(--ns-body)', fontSize: 19, lineHeight: 1.55,
          color: 'oklch(0.92 0.01 95 / 0.85)', margin: 0, maxWidth: 520,
        }}>
          Our online assessments are 3–5 minutes, fully aligned to your brand, and leave a lasting positive impression — protecting your talent pipeline, and your reputation.
        </p>
      </div>
    </div>
  );

  const right = (
    <div style={{
      display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
      gridTemplateRows: '1fr 1fr',
      background: 'oklch(0.85 0.01 95 / 0.12)', border: '1px solid oklch(0.85 0.01 95 / 0.12)',
      flex: 1, alignSelf: 'stretch',
    }}>
      <div style={{ background: '#000', padding: '36px 28px', minHeight: 220, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: 2,
          background: 'var(--ns-cyan)', opacity: 0.6,
          boxShadow: '0 0 14px var(--ns-cyan)',
        }} />
        <div style={{
          fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 2,
          color: 'oklch(0.92 0.01 95 / 0.7)', marginBottom: 14, fontWeight: 700,
        }}>DROP-OUT RATE</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--ns-display)', fontSize: 34, fontWeight: 500, color: 'oklch(0.72 0.24 8)', opacity: 0.55 }}>
            <StrikeWipe>20–30%</StrikeWipe>
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--ns-display)', fontSize: 72, fontWeight: 500,
          color: 'var(--ns-cyan)', letterSpacing: -3, lineHeight: 1, marginTop: 10,
          textShadow: '0 0 30px oklch(0.82 0.18 200 / 0.6)',
        }}>&lt;1%</div>
      </div>
      <div style={{ background: '#000', padding: '36px 28px', minHeight: 220, position: 'relative', overflow: 'hidden' }}>
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: 2,
          background: 'var(--ns-yellow)', opacity: 0.6,
          boxShadow: '0 0 14px var(--ns-yellow)',
        }} />
        <div style={{
          fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 2,
          color: 'oklch(0.92 0.01 95 / 0.7)', marginBottom: 14, fontWeight: 700,
        }}>COMPLETION TIME</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--ns-display)', fontSize: 34, fontWeight: 500, color: 'oklch(0.72 0.24 8)', opacity: 0.55 }}>
            <StrikeWipe delay={120}>30–50m</StrikeWipe>
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--ns-display)', fontSize: 72, fontWeight: 500,
          color: 'var(--ns-yellow)', letterSpacing: -3, lineHeight: 1, marginTop: 10,
          textShadow: '0 0 30px oklch(0.92 0.18 98 / 0.5)',
        }}>3–5m</div>
      </div>
      <div style={{
        background: '#000', padding: '36px 28px', minHeight: 200, gridColumn: 'span 2',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div aria-hidden style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: 2,
          background: 'oklch(0.80 0.19 155)', opacity: 0.6,
          boxShadow: '0 0 14px oklch(0.80 0.19 155)',
        }} />
        <div style={{
          fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 2,
          color: 'oklch(0.92 0.01 95 / 0.7)', marginBottom: 14, fontWeight: 700,
        }}>CANDIDATE NPS</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20 }}>
          <div style={{
            fontFamily: 'var(--ns-display)', fontSize: 96, fontWeight: 500,
            color: 'oklch(0.80 0.19 155)', letterSpacing: -4, lineHeight: 0.9,
            textShadow: '0 0 28px oklch(0.80 0.19 155 / 0.55)',
            fontVariantNumeric: 'tabular-nums',
          }}><Counter to={70} duration={2800} prefix="+" /></div>
          <div style={{ flex: 1, maxWidth: 300 }}>
            <div style={{
              fontFamily: 'var(--ns-body)', fontSize: 14, lineHeight: 1.4,
              color: 'oklch(0.92 0.01 95 / 0.85)',
            }}>
              Candidates consistently rate Neurosight assessments as a highlight of the application experience.
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="candidate" style={{
      position: 'relative', padding: '140px 32px', overflow: 'hidden',
      borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)',
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '-10%', width: 600, height: 600,
        background: 'radial-gradient(circle, oklch(0.82 0.18 200 / 0.14), transparent 60%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />
      <div style={{
        maxWidth: MAX_W, margin: '0 auto', position: 'relative',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'stretch',
      }}>
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>{left}</div>
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>{right}</div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════
// 07 — PROCESS (Stages)
// ═══════════════════════════════════════════════
const DProcess = () => {
  const steps = [
    { n: '01', t: 'Realistic job preview', time: '5 min',
      d: 'An immersive, interactive preview. Prevents a flood of AI-generated auto-apply applications. Encourages the right candidates to apply.',
      c: 'oklch(0.82 0.18 200)' },
    { n: '02', t: 'Bespoke Neurosight assessment', time: '3–5 min',
      d: 'Brand-aligned, fully AI-resilient psychometric assessment tuned to your specific drivers of success — empowering efficient screening.',
      c: 'oklch(0.78 0.20 320)' },
    { n: '03', t: 'Live interview stage', time: '10–40 min',
      d: 'Interviews, assessment exercises, or in-person assessment centres — now focused only on the candidates with genuine potential.',
      c: 'var(--ns-yellow)' },
  ];

  const ref = React.useRef(null);
  const [active, setActive] = React.useState(steps.map(() => false));
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => {
      // Fire only once the whole rail (all 3 boxes) is fully in viewport,
      // then wait 500ms before starting the sequential reveal.
      if (e.intersectionRatio >= 0.99) {
        steps.forEach((_, i) => {
          setTimeout(() => setActive(prev => { const n = prev.slice(); n[i] = true; return n; }), 100 + i * 500);
        });
        io.disconnect();
      }
    }, { threshold: [0, 0.5, 0.9, 0.99, 1] });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section id="process" style={{
      position: 'relative', padding: '90px 32px 140px', borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: MAX_W, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <h2 style={{
            fontFamily: 'var(--ns-display)', fontSize: 80, lineHeight: 0.96,
            letterSpacing: -3, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
          }}>
            End-to-end hiring,<br/>fit for the <span style={{
              background: 'linear-gradient(95deg, oklch(0.82 0.18 200), oklch(0.78 0.20 320), oklch(0.92 0.18 98))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text', color: 'transparent',
            }}>age of AI</span>.
          </h2>
        </div>

        {/* Horizontal stage rail */}
        <div ref={ref} style={{
          position: 'relative',
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
          background: 'oklch(0.85 0.01 95 / 0.12)',
          border: '1px solid oklch(0.85 0.01 95 / 0.14)',
        }}>
          {/* Connecting rail on top */}
          <div style={{
            position: 'absolute', left: 0, right: 0, top: 0, height: 2,
            background: 'linear-gradient(90deg, oklch(0.82 0.18 200), oklch(0.78 0.20 320), oklch(0.92 0.18 98))',
            boxShadow: '0 0 18px oklch(0.82 0.18 200 / 0.5)',
            opacity: 0.75,
          }} />
          {steps.map((s, i) => (
            <div key={i} style={{
              background: '#000', padding: '44px 32px 40px',
              display: 'flex', flexDirection: 'column', gap: 18,
              position: 'relative',
              opacity: active[i] ? 1 : 0.25,
              transform: active[i] ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 600ms cubic-bezier(.2,.8,.2,1), transform 600ms cubic-bezier(.2,.8,.2,1)',
            }}>
              {/* Top accent bar reveal — slides in from left as the step activates */}
              <div aria-hidden style={{
                position: 'absolute', left: 0, top: 0, height: 2,
                width: active[i] ? '100%' : '0%',
                background: s.c,
                boxShadow: active[i] ? `0 0 14px ${s.c}` : 'none',
                transition: 'width 520ms cubic-bezier(.2,.8,.2,1), box-shadow 520ms',
                zIndex: 1,
              }} />
              {/* Big step number */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div style={{
                  fontFamily: 'var(--ns-display)', fontSize: 72, fontWeight: 500,
                  color: s.c, letterSpacing: -3, lineHeight: 0.9,
                  textShadow: active[i] ? `0 0 28px ${s.c}` : 'none',
                  transform: active[i] ? 'scale(1)' : 'scale(0.88)',
                  transformOrigin: 'left bottom',
                  transition: 'text-shadow 600ms, transform 600ms cubic-bezier(.2,1.2,.3,1)',
                }}>{s.n}</div>
                <div style={{
                  fontFamily: 'var(--ns-mono)', fontSize: 11, letterSpacing: 1.8,
                  color: 'oklch(0.92 0.01 95 / 0.7)', fontWeight: 700,
                  padding: '5px 10px', border: '1px solid oklch(0.85 0.01 95 / 0.2)',
                  opacity: active[i] ? 1 : 0,
                  transform: active[i] ? 'translateY(0)' : 'translateY(-6px)',
                  transition: 'opacity 500ms 120ms, transform 500ms 120ms cubic-bezier(.2,.8,.2,1)',
                }}>{s.time}</div>
              </div>
              <div style={{
                fontFamily: 'var(--ns-display)', fontSize: 24, fontWeight: 500,
                color: 'var(--ns-white)', letterSpacing: -0.6, lineHeight: 1.15,
                opacity: active[i] ? 1 : 0,
                transform: active[i] ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 520ms 160ms, transform 520ms 160ms cubic-bezier(.2,.8,.2,1)',
              }}>{s.t}</div>
              <div style={{
                fontFamily: 'var(--ns-body)', fontSize: 15, lineHeight: 1.5,
                color: 'oklch(0.92 0.01 95 / 0.82)',
                opacity: active[i] ? 1 : 0,
                transform: active[i] ? 'translateY(0)' : 'translateY(8px)',
                transition: 'opacity 520ms 220ms, transform 520ms 220ms cubic-bezier(.2,.8,.2,1)',
              }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════
// 08 — CONTACT
// ═══════════════════════════════════════════════
const FREE_EMAIL_DOMAINS_D = new Set([
  'gmail.com','googlemail.com','hotmail.com','hotmail.co.uk','hotmail.fr',
  'outlook.com','outlook.co.uk','live.com','live.co.uk','msn.com',
  'yahoo.com','yahoo.co.uk','ymail.com','rocketmail.com','icloud.com','me.com','mac.com',
  'aol.com','aim.com','proton.me','protonmail.com','pm.me','gmx.com','gmx.de','mail.com',
  'zoho.com','yandex.com','yandex.ru','fastmail.com','tutanota.com',
  'qq.com','163.com','126.com','sina.com',
]);

const dInputStyle = {
  padding: '17px 18px',
  background: 'oklch(0.12 0.02 280 / 0.4)',
  backdropFilter: 'blur(10px)',
  border: '1px solid oklch(0.85 0.01 95 / 0.18)',
  color: 'var(--ns-white)',
  fontFamily: 'var(--ns-body)', fontSize: 15,
  outline: 'none', borderRadius: 0,
  WebkitAppearance: 'none',
};

const DContact = () => {
  const [sent, setSent] = React.useState(false);
  const [name, setName] = React.useState('');
  const [nameErr, setNameErr] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [emailErr, setEmailErr] = React.useState('');

  const validateName = (v) => {
    const val = (v || '').trim();
    if (!val) return 'Please enter your name.';
    return '';
  };

  const validate = (v) => {
    const val = (v || '').trim().toLowerCase();
    if (!val) return 'Please enter your work email.';
    const m = val.match(/^[^\s@]+@([^\s@]+\.[^\s@]+)$/);
    if (!m) return 'Please enter a valid email address.';
    if (FREE_EMAIL_DOMAINS_D.has(m[1])) return 'Please use your work email (no personal addresses).';
    return '';
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const nErr = validateName(name);
    const err = validate(email);
    setNameErr(nErr);
    setEmailErr(err);
    if (!nErr && !err) setSent(true);
  };

  return (
    <section id="contact" style={{
      position: 'relative', padding: '140px 32px 80px',
      borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%', width: 600, height: 600,
        background: 'radial-gradient(circle, oklch(0.92 0.18 98 / 0.18), transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', right: '-5%', width: 600, height: 600,
        background: 'radial-gradient(circle, oklch(0.68 0.28 8 / 0.25), transparent 65%)',
        filter: 'blur(50px)', pointerEvents: 'none',
      }} />

      <div style={{
        maxWidth: MAX_W, margin: '0 auto', position: 'relative',
        display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 100, alignItems: 'start',
      }}>
        <div>
          <DSectionHeader n="08" label="CONTACT" color="var(--ns-yellow)" />
          <h2 style={{
            fontFamily: 'var(--ns-display)', fontSize: 96, lineHeight: 0.94,
            letterSpacing: -4, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
          }}>
            Let's <ScaffoldFix /><br/>
            <span style={{
              background: 'linear-gradient(95deg, oklch(0.92 0.18 98), oklch(0.78 0.20 320), oklch(0.82 0.18 200))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>your hiring</span><span style={{ color: 'var(--ns-white)' }}>.</span>
          </h2>
          <p style={{
            fontFamily: 'var(--ns-body)', fontSize: 19, lineHeight: 1.5,
            color: 'oklch(0.92 0.01 95 / 0.86)', margin: '36px 0 0', maxWidth: 500,
          }}>
            Book a 30-minute walkthrough. See a live, bespoke assessment built for your sector.
          </p>

          {/* Contact details */}
          <div style={{
            marginTop: 56, paddingTop: 36,
            borderTop: '1px solid oklch(0.85 0.01 95 / 0.1)',
            display: 'flex', flexDirection: 'column', gap: 22,
          }}>
            {[
              ['EMAIL', 'contact@neurosight.io', 'mailto:contact@neurosight.io'],
              ['OFFICE', 'Neurosight Ltd\n45-47 Clerkenwell Green\nLondon EC1R 0EB', null],
            ].map(([k, v, href]) => (
              <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
                <div style={{
                  fontFamily: 'var(--ns-mono)', fontSize: 11, letterSpacing: 2,
                  color: 'oklch(0.92 0.01 95 / 0.72)', minWidth: 70, flexShrink: 0, fontWeight: 700,
                }}>{k}</div>
                {href ? (
                  <a href={href} style={{
                    fontFamily: 'var(--ns-display)', fontSize: 18, fontWeight: 500,
                    color: 'var(--ns-white)', textDecoration: 'none',
                    borderBottom: '1px solid oklch(0.85 0.01 95 / 0.3)',
                  }}>{v}</a>
                ) : (
                  <div style={{
                    fontFamily: 'var(--ns-display)', fontSize: 16, fontWeight: 500,
                    color: 'var(--ns-white)', whiteSpace: 'pre-line', lineHeight: 1.5,
                  }}>{v}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <div style={{ paddingTop: 50 }}>
          {!sent ? (
            <form onSubmit={onSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input
                required type="text" placeholder="Your name"
                value={name}
                onChange={(e) => { setName(e.target.value); if (nameErr) setNameErr(''); }}
                onBlur={(e) => setNameErr(validateName(e.target.value))}
                style={{
                  ...dInputStyle,
                  boxShadow: nameErr ? '0 0 0 1px oklch(0.68 0.24 25 / 0.6)' : 'none',
                }}
              />
              {nameErr && (
                <div style={{
                  fontFamily: 'var(--ns-mono)', fontSize: 11, letterSpacing: 0.4,
                  color: 'oklch(0.72 0.22 30)', marginTop: -8, marginBottom: 2,
                }}>{nameErr}</div>
              )}
              <input
                required type="email" placeholder="Work email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailErr) setEmailErr(''); }}
                onBlur={(e) => setEmailErr(validate(e.target.value))}
                style={{
                  ...dInputStyle,
                  boxShadow: emailErr ? '0 0 0 1px oklch(0.68 0.24 25 / 0.6)' : 'none',
                }}
              />
              {emailErr && (
                <div style={{
                  fontFamily: 'var(--ns-mono)', fontSize: 11, letterSpacing: 0.4,
                  color: 'oklch(0.72 0.22 30)', marginTop: -8, marginBottom: 2,
                }}>{emailErr}</div>
              )}
              <textarea placeholder="What are you hiring for?" rows={4} style={{ ...dInputStyle, resize: 'none', fontFamily: 'var(--ns-body)' }} />
              <button type="submit" style={{
                marginTop: 10, padding: '20px 26px',
                background: 'var(--ns-yellow)', color: '#000',
                fontFamily: 'var(--ns-display)', fontWeight: 600, fontSize: 14,
                letterSpacing: 1, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                boxShadow: '0 0 50px oklch(0.92 0.18 98 / 0.4)',
              }}>
                REQUEST A DEMO
                <svg width="16" height="11" viewBox="0 0 14 10" fill="none">
                  <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          ) : (
            <div style={{
              padding: '40px 30px',
              border: '1px solid var(--ns-yellow)',
              background: 'oklch(0.92 0.18 98 / 0.06)',
              fontFamily: 'var(--ns-display)', fontSize: 20,
              color: 'var(--ns-white)', lineHeight: 1.4,
              position: 'relative', overflow: 'hidden',
            }}>
              <span style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'linear-gradient(115deg, transparent 30%, oklch(0.82 0.18 200 / 0.5) 50%, oklch(0.92 0.18 98 / 0.5) 60%, transparent 80%)',
                animation: 'ns-flash 1100ms ease-out forwards',
              }} />
              <div style={{ fontFamily: 'var(--ns-mono)', fontSize: 11, letterSpacing: 2, color: 'var(--ns-yellow)', marginBottom: 10, fontWeight: 700 }}>
                ✓ TRANSMISSION RECEIVED
              </div>
              Thanks. We'll be in touch within one working day.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════
// FOOTER
// ═══════════════════════════════════════════════
const DFooter = () => (
  <footer style={{
    padding: '56px 32px 44px',
    borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)',
  }}>
    <div style={{
      maxWidth: MAX_W, margin: '0 auto',
      display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between',
      alignItems: 'center', gap: 28,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
        <img src={(window.__resources && window.__resources.logoDark) || 'logo-dark.png'}
             alt="Neurosight" style={{ height: 28, display: 'block', opacity: 0.8 }} />
        <div style={{
          fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 1.2,
          color: 'oklch(0.92 0.01 95 / 0.55)', lineHeight: 1.6,
        }}>
          © 2026 NEUROSIGHT LTD · 45-47 CLERKENWELL GREEN, LONDON EC1R 0EB
        </div>
      </div>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: '10px 26px',
        fontFamily: 'var(--ns-mono)', fontSize: 11, letterSpacing: 1.8,
        color: 'oklch(0.92 0.01 95 / 0.75)', fontWeight: 600,
      }}>
        <a href="https://neurosight.io/Content/Privacypolicyv101.10.21.pdf" target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'none' }}>PRIVACY</a>
        <a href="https://www.linkedin.com/company/neurosight/" target="_blank" rel="noopener" style={{ color: 'inherit', textDecoration: 'none' }}>LINKEDIN</a>
      </div>
    </div>
  </footer>
);

Object.assign(window, { DResults, DCandidateExp, DProcess, DContact, DFooter });
