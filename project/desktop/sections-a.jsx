// Desktop sections: Problem, Insight, Diversity, Compare.

// Externally-triggered counter — fires once `trigger` flips true, after an optional delay.
const ControlledCounter = ({ to, from = 0, duration = 1400, prefix = '', suffix = '', delay = 0, trigger }) => {
  const [v, setV] = React.useState(from);
  React.useEffect(() => {
    if (!trigger) return;
    const begin = performance.now() + delay;
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
  }, [trigger]);
  return <span>{prefix}{Math.round(v)}{suffix}</span>;
};


// ═══════════════════════════════════════════════
// 01 — PROBLEM
// ═══════════════════════════════════════════════
const DProblem = () => {
  const items = [
    ['INACCURATE',        'Fail to predict real-world job performance'],
    ['TIME CONSUMING',    '30–50 anxiety-inducing minutes for candidates'],
    ['BIASED',            'One-size-fits-all algorithms harm diversity and neurodiversity'],
    ['VULNERABLE TO AI',  'Easily beaten by mobile AI apps — photo the laptop screen, and get the answer'],
  ];
  const listRef = React.useRef(null);
  const statRef = React.useRef(null);
  const [statFired, setStatFired] = React.useState(false);
  const [pulsing, setPulsing] = React.useState(() => items.map(() => false));
  const firedRef = React.useRef(false);

  // 50% stat counter — fires only once its box is FULLY in view, with a 200ms delay.
  React.useEffect(() => {
    if (!statRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.intersectionRatio >= 0.99) { setStatFired(true); io.disconnect(); }
    }, { threshold: [0, 0.5, 0.9, 0.99, 1] });
    io.observe(statRef.current);
    return () => io.disconnect();
  }, []);

  // Table pulses + line-drawing — start ~400ms AFTER the 50% counter finishes
  // (200ms delay + 1400ms roll-up + 400ms pause = 2000ms after statFired).
  React.useEffect(() => {
    if (!statFired || firedRef.current || !listRef.current) return;
    // Also require the list to actually be on-screen (user might scroll past).
    const listObs = new IntersectionObserver(([e]) => {
      if (!e || firedRef.current) return;
      if (e.intersectionRatio > 0.5) {
        firedRef.current = true;
        const baseDelay = 200 + 2800 + 450; // counter delay + duration + pause
        items.forEach((_, i) => {
          setTimeout(() => {
            setPulsing(p => { const n = p.slice(); n[i] = true; return n; });
            setTimeout(() => setPulsing(p => { const n = p.slice(); n[i] = false; return n; }), 900);
          }, baseDelay + i * 350);
        });
        listObs.disconnect();
      }
    }, { threshold: [0, 0.5, 0.9, 1] });
    listObs.observe(listRef.current);
    return () => listObs.disconnect();
  }, [statFired]);

  const left = (
    <div>
      <DSectionHeader n="01" label="THE PROBLEM" color="oklch(0.72 0.26 8)" />
      <h2 style={{
        fontFamily: 'var(--ns-display)', fontSize: 64, lineHeight: 0.98,
        letterSpacing: -2.5, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
        marginLeft: -3,
      }}>
        Conventional hiring has{' '}
        <span style={{
          background: 'linear-gradient(95deg, oklch(0.68 0.22 45), oklch(0.62 0.28 25), oklch(0.58 0.26 18))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>lost integrity</span>.
      </h2>
      <p style={{
        fontFamily: 'var(--ns-body)', fontSize: 19, lineHeight: 1.55,
        color: 'oklch(0.92 0.01 95 / 0.85)', margin: '32px 0 0', maxWidth: 520,
      }}>
        A candidate snaps a photo of their laptop screen. ChatGPT does the rest. Every major psychometric test is now compromised.
      </p>

      {/* Big AI stat */}
      <div ref={statRef} style={{
        marginTop: 44, padding: '32px 30px',
        background: 'linear-gradient(135deg, oklch(0.3 0.1 8 / 0.10), transparent)',
        position: 'relative', overflow: 'hidden', maxWidth: 560,
      }}>
        {/* Stroke drawn as four absolute divs to match the limitations box exactly
            (CSS borders round fractional widths — absolute bars render true 1.5px). */}
        {(() => {
          const stroke = 'oklch(0.78 0.26 8)';
          const thickness = 1.5;
          const glow = '0 0 6px oklch(0.72 0.26 8 / 0.55)';
          const sides = [
            { left: 0, right: 0, top: 0, height: thickness },
            { right: 0, top: 0, bottom: 0, width: thickness },
            { left: 0, right: 0, bottom: 0, height: thickness },
            { left: 0, top: 0, bottom: 0, width: thickness },
          ];
          return sides.map((s, i) => (
            <div key={i} aria-hidden style={{
              position: 'absolute',
              background: stroke,
              boxShadow: glow,
              pointerEvents: 'none',
              ...s,
            }} />
          ));
        })()}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
          <div style={{
            fontFamily: 'var(--ns-display)', fontSize: 88, fontWeight: 500,
            color: 'oklch(0.78 0.26 8)', letterSpacing: -3.5, lineHeight: 0.88,
            textShadow: '0 0 30px oklch(0.72 0.26 8 / 0.6)',
            fontVariantNumeric: 'tabular-nums',
          }}><ControlledCounter to={50} duration={2800} suffix="%+" trigger={statFired} delay={200} /></div>
          <div style={{
            fontFamily: 'var(--ns-body)', fontSize: 15, lineHeight: 1.4,
            color: 'oklch(0.9 0.01 95 / 0.85)',
            alignSelf: 'flex-end', maxWidth: 260,
          }}>of candidates admit using AI tools to complete job applications and online assessments.</div>
        </div>
      </div>
    </div>
  );

  const right = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h3 style={{
        fontFamily: 'var(--ns-display)', fontSize: 24, fontWeight: 500,
        letterSpacing: -0.4, lineHeight: 1.2,
        color: 'var(--ns-white)', margin: '0 0 24px',
      }}>
        The limitations of conventional psychometric tests
      </h3>
      <div ref={listRef} style={{
        flex: 1,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        background: 'linear-gradient(135deg, oklch(0.3 0.1 8 / 0.10), transparent)',
        padding: '4px 28px',
        position: 'relative',
        border: '1.5px solid oklch(0.78 0.26 8)',
        boxShadow: '0 0 6px oklch(0.72 0.26 8 / 0.55)',
      }}>
        {items.map(([tag, desc], i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'baseline', gap: 22,
            padding: '24px 0', background: 'transparent',
          }}>
            <div style={{
              fontFamily: 'var(--ns-mono)', fontSize: 15, color: 'oklch(0.72 0.26 8)',
              minWidth: 40, fontWeight: 700,
              position: 'relative',
            }}>
              <span style={{
                position: 'relative', display: 'inline-block',
                animation: pulsing[i] ? 'ns-num-glow 900ms cubic-bezier(.18,.7,.25,1) forwards' : 'none',
              }}>
                <span aria-hidden="true" style={{
                  position: 'absolute',
                  left: '50%', top: '50%',
                  width: 26, height: 26,
                  transform: 'translate(-50%, -50%) scale(0.4)',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, oklch(0.72 0.26 8 / 0.85) 0%, oklch(0.72 0.26 8 / 0.35) 45%, transparent 70%)',
                  opacity: 0, pointerEvents: 'none',
                  animation: pulsing[i] ? 'ns-num-halo 900ms cubic-bezier(.18,.7,.25,1) forwards' : 'none',
                }} />
                <span style={{ position: 'relative' }}>0{i+1}</span>
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'var(--ns-display)', fontSize: 17, fontWeight: 600,
                color: 'var(--ns-white)', letterSpacing: 0.5, marginBottom: 6,
              }}>{tag}</div>
              <div style={{
                fontFamily: 'var(--ns-body)', fontSize: 15, lineHeight: 1.45,
                color: 'oklch(0.92 0.01 95 / 0.82)',
              }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return <DTwoCol id="problem" flip={false} left={left} right={right} dividerTop={false} />;
};

// ═══════════════════════════════════════════════
// 02 — INSIGHT (Solution)
// ═══════════════════════════════════════════════
const DInsightBars = ({ rows }) => {
  const ref = React.useRef(null);
  const [armed, setArmed] = React.useState(rows.map(() => false));
  const firedRef = React.useRef(false);
  React.useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      if (!e || firedRef.current) return;
      // Only fire once the whole panel is fully in view.
      if (e.intersectionRatio >= 0.99) {
        firedRef.current = true;
        const START_DELAY = 1600; // wait 1.6s after fully entering view
        rows.forEach((_, i) => {
          setTimeout(
            () => setArmed(prev => { const n = prev.slice(); n[i] = true; return n; }),
            START_DELAY + i * 350,
          );
        });
        io.disconnect();
      }
    }, { threshold: [0, 0.5, 0.9, 0.99, 1] });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      padding: 32,
      border: '1.5px solid var(--ns-cyan)',
      boxShadow: '0 0 6px oklch(0.82 0.18 200 / 0.55)',
      background: 'linear-gradient(180deg, transparent, oklch(0.82 0.18 200 / 0.05))',
    }}>
      {rows.map((x, i) => (
        <div key={i} style={{ marginBottom: i < rows.length - 1 ? 24 : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
            <div>
              <span style={{
                fontFamily: 'var(--ns-mono)', fontSize: 14, letterSpacing: 1.8,
                color: x.c, marginRight: 14, fontWeight: 700,
              }}>{x.l}</span>
              <span style={{
                fontFamily: 'var(--ns-body)', fontSize: 16, fontWeight: 600,
                color: 'var(--ns-white)',
              }}>{x.t}</span>
            </div>
          </div>
          <div style={{
            height: 7, background: 'oklch(0.85 0.01 95 / 0.08)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: armed[i] ? `${x.v}%` : '0%',
              background: x.c, boxShadow: `0 0 14px ${x.c}`,
              transition: 'width 1200ms cubic-bezier(.2,.7,.2,1)',
            }} />
          </div>
          <div style={{
            fontFamily: 'var(--ns-mono)', fontSize: 11, letterSpacing: 0.6,
            color: 'oklch(0.92 0.01 95 / 0.85)', marginTop: 8, fontWeight: 500,
          }}>› {x.tag}</div>
        </div>
      ))}
    </div>
  );
};

const DInsight = () => {
  const bars = [
    { l: 'SURFACE',   t: 'The answer given',        v: 35,  c: 'oklch(0.92 0.01 95 / 0.85)', tag: 'Conventional tests stop here' },
    { l: 'PATH',      t: 'How decisions were made', v: 70,  c: 'oklch(0.82 0.18 200)',       tag: 'Building full resilience to AI use' },
    { l: 'COGNITION', t: 'How they think and feel', v: 100, c: 'oklch(0.78 0.20 320)',       tag: 'The Neurosight difference' },
  ];
  const pills = [
    { t: '3–5 min', s: 'Candidate completion time',                           c: 'var(--ns-cyan)' },
    { t: '3–6×',    s: 'Higher observed validity than conventional tests',    c: 'oklch(0.78 0.20 320)' },
    { t: 'AI-proof',s: 'Cannot be fooled by ChatGPT or LLMs',                 c: 'var(--ns-yellow)' },
  ];

  const left = (
    <div>
      <DSectionHeader n="02" label="THE INSIGHT LAYER" />
      <h2 style={{
        fontFamily: 'var(--ns-display)', fontSize: 64, lineHeight: 0.98,
        letterSpacing: -2.5, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
        marginLeft: -3,
      }}>
        We measure{' '}
        <span style={{
          background: 'linear-gradient(95deg, oklch(0.82 0.18 200), oklch(0.78 0.20 280))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>how</span>
        {' '}people think —<br/>not just the answer.
      </h2>
      <p style={{
        fontFamily: 'var(--ns-body)', fontSize: 19, lineHeight: 1.55,
        color: 'oklch(0.92 0.01 95 / 0.85)', margin: '32px 0 20px', maxWidth: 520,
      }}>
        Conventional assessments only score the answers. We use neuroscience to analyse <em style={{ fontStyle: 'normal', color: 'var(--ns-white)' }}>how</em> people arrive at their decisions — in real time.
      </p>
      <p style={{
        fontFamily: 'var(--ns-body)', fontSize: 19, lineHeight: 1.55,
        color: 'oklch(0.92 0.01 95 / 0.85)', margin: '0 0 0', maxWidth: 520,
      }}>
        This insight builds full AI resilience, and empowers market-leading predictive accuracy.
      </p>
    </div>
  );

  const right = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, height: '100%' }}>
      <DInsightBars rows={bars} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginTop: 'auto' }}>
        {pills.map((x, i) => (
          <div key={i} style={{
            padding: '22px 18px',
            border: '1px solid oklch(0.85 0.01 95 / 0.12)',
            background: 'linear-gradient(135deg, oklch(0.3 0.01 95 / 0.2), transparent)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: 2, height: '100%',
              background: x.c, boxShadow: `0 0 14px ${x.c}`,
            }} />
            <div style={{
              fontFamily: 'var(--ns-display)', fontSize: 30, fontWeight: 500,
              color: x.c, letterSpacing: -0.8, lineHeight: 1,
            }}>{x.t}</div>
            <div style={{
              fontFamily: 'var(--ns-body)', fontSize: 12.5, marginTop: 10,
              color: 'oklch(0.92 0.01 95 / 0.85)', lineHeight: 1.4,
            }}>{x.s}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="insight" style={{ position: 'relative', padding: '140px 32px', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '20%', right: '-10%', width: 560, height: 560,
        background: 'radial-gradient(circle, oklch(0.82 0.18 200 / 0.22), transparent 65%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', top: '-10%', left: '-5%', width: 500, height: 500,
        background: 'radial-gradient(circle, oklch(0.78 0.20 320 / 0.15), transparent 65%)',
        filter: 'blur(40px)', pointerEvents: 'none',
      }} />
      <div style={{
        maxWidth: MAX_W, margin: '0 auto', position: 'relative',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'stretch',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', order: 2 }}>{left}</div>
        <div style={{ display: 'flex', flexDirection: 'column', order: 1 }}>{right}</div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════
// 03 — DIVERSITY
// ═══════════════════════════════════════════════
const DDiversity = () => {
  const ref = React.useRef(null);
  const triggerRef = React.useRef(null); // 4th list item — fires when fully in view (first 4 visible)
  const [run, setRun] = React.useState(false);
  React.useEffect(() => {
    if (!triggerRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      // Fire once the 4th item is fully in the viewport (i.e. first 4 are visible).
      if (e.intersectionRatio >= 0.99) { setRun(true); io.disconnect(); }
    }, { threshold: [0, 0.5, 0.9, 0.99, 1] });
    io.observe(triggerRef.current);
    return () => io.disconnect();
  }, []);

  const demos = [
    {
      label: 'Ethnicity',
      color: 'oklch(0.82 0.18 200)',
      // Interlocking silhouettes of overlapping profile heads
      svg: (
        <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="26" cy="28" r="10" />
          <path d="M8 64 C 8 50 18 44 26 44 C 34 44 44 50 44 64" />
          <circle cx="52" cy="34" r="9" opacity="0.65" />
          <path d="M34 64 C 34 52 43 47 52 47 C 60 47 70 52 70 64" opacity="0.65" />
        </svg>
      ),
    },
    {
      label: 'Gender',
      color: 'oklch(0.78 0.20 320)',
      // Circle + triangle / Venn-like (non-binary inclusive glyph)
      svg: (
        <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="32" cy="40" r="18" />
          <circle cx="48" cy="40" r="18" opacity="0.7" />
          <line x1="40" y1="12" x2="40" y2="68" opacity="0.5" />
        </svg>
      ),
    },
    {
      label: 'Socio-economic status',
      color: 'oklch(0.92 0.18 98)',
      // Ascending steps / ladder of access — uneven bars converging to equal line
      svg: (
        <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="10" y="52" width="12" height="18" />
          <rect x="26" y="40" width="12" height="30" opacity="0.8" />
          <rect x="42" y="28" width="12" height="42" opacity="0.65" />
          <rect x="58" y="16" width="12" height="54" opacity="0.5" />
          <line x1="6" y1="12" x2="74" y2="12" strokeDasharray="3 3" opacity="0.7" />
        </svg>
      ),
    },
    {
      label: 'Disability',
      color: 'oklch(0.80 0.19 155)',
      // Abstract accessibility: person with outstretched arms in circle
      svg: (
        <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="40" cy="40" r="30" opacity="0.4" />
          <circle cx="40" cy="24" r="5" />
          <line x1="40" y1="29" x2="40" y2="52" />
          <line x1="26" y1="38" x2="54" y2="38" />
          <line x1="40" y1="52" x2="30" y2="64" />
          <line x1="40" y1="52" x2="50" y2="64" />
        </svg>
      ),
    },
    {
      label: 'Neurodiversity',
      color: 'oklch(0.72 0.18 240)',
      // Stylised brain with diverse pathways
      svg: (
        <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M26 20 C 14 22 10 36 16 44 C 10 52 16 64 28 62 C 32 68 46 68 50 62 C 62 64 68 52 62 44 C 68 36 64 22 52 20 C 48 14 32 14 26 20 Z" />
          <path d="M40 20 L 40 62" opacity="0.45" />
          <path d="M28 34 C 34 32 38 36 40 40 C 42 44 46 48 52 46" opacity="0.75" />
          <path d="M30 50 C 34 48 40 50 40 40" opacity="0.6" />
        </svg>
      ),
    },
  ];

  const left = (
    <div ref={ref} style={{
      border: '1px solid oklch(0.78 0.20 320 / 0.35)',
      background: 'linear-gradient(180deg, oklch(0.12 0.06 320 / 0.35), transparent)',
      padding: '36px 34px', position: 'relative', overflow: 'hidden',
      flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--ns-mono)', fontSize: 11, letterSpacing: 2,
        color: 'oklch(0.78 0.20 320)', marginBottom: 28, fontWeight: 800,
      }}>ADVERSE IMPACT ELIMINATED ACROSS</div>

      <ul style={{
        listStyle: 'none', padding: 0, margin: 0,
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        {demos.map((d, i) => (
          <li key={d.label} ref={i === 3 ? triggerRef : null} style={{
            display: 'grid',
            gridTemplateColumns: '68px 1fr',
            alignItems: 'center',
            gap: 20,
            padding: '18px 4px',
            borderTop: i === 0 ? 'none' : '1px solid oklch(0.85 0.01 95 / 0.08)',
            opacity: run ? 1 : 0,
            transform: run ? 'translateX(0)' : 'translateX(-16px)',
            transition: `opacity 520ms ease-out ${i * 200}ms, transform 520ms cubic-bezier(.2,.8,.2,1) ${i * 200}ms`,
          }}>
            <div style={{
              width: 56, height: 56,
              display: 'grid', placeItems: 'center',
              color: d.color,
              filter: `drop-shadow(0 0 8px ${d.color})`,
            }}>
              {d.svg}
            </div>
            <div style={{
              fontFamily: 'var(--ns-display)', fontSize: 22, fontWeight: 500,
              letterSpacing: -0.4, color: 'var(--ns-white)',
            }}>{d.label}</div>
          </li>
        ))}
      </ul>
    </div>
  );

  const right = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      <DSectionHeader n="03" label="DIVERSITY & NEURODIVERSITY" color="oklch(0.78 0.20 320)" />
      <h2 style={{
        fontFamily: 'var(--ns-display)', fontSize: 64, lineHeight: 0.98,
        letterSpacing: -2.5, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
        marginLeft: -3,
      }}>
        Everyone is <RainbowCycle>unique</RainbowCycle>.
        <span style={{ display: 'block', height: 12 }} />
        <span style={{ color: 'var(--ns-white)' }}>Their scoring algorithm should be, too.</span>
      </h2>
      <div style={{ marginTop: 'auto' }}>
        <p style={{
          fontFamily: 'var(--ns-body)', fontSize: 19, lineHeight: 1.55,
          color: 'oklch(0.92 0.01 95 / 0.85)', margin: '32px 0 20px', maxWidth: 520,
        }}>
          Most tests apply one-size-fits-all algorithms to every candidate — harming diversity and excluding neurodivergent talent.
        </p>
        <p style={{
          fontFamily: 'var(--ns-body)', fontSize: 19, lineHeight: 1.55,
          color: 'oklch(0.92 0.01 95 / 0.85)', margin: '0', maxWidth: 520,
        }}>
          Our neuroscience-powered scoring responds dynamically to individual differences, eliminating bias and empowering neurodiversity.
        </p>
      </div>
    </div>
  );

  return (
    <section id="diversity" style={{
      position: 'relative', padding: '140px 32px',
      borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)',
      overflow: 'hidden',
    }}>
      <div style={{
        maxWidth: MAX_W, margin: '0 auto', position: 'relative',
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'stretch',
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', order: 1, minWidth: 0 }}>{right}</div>
        <div style={{ display: 'flex', flexDirection: 'column', order: 2, minWidth: 0 }}>{left}</div>
      </div>
    </section>
  );
};

// ═══════════════════════════════════════════════
// 04 — COMPARE  (two-col: copy left, table right)
// ═══════════════════════════════════════════════
const DCompare = () => {
  const rows = [
    ['Completion time',           '30–50 min', '3–5 min'],
    ['Observed validity',         '0.1–0.2',   '0.4–0.6'],
    ['Predicts job performance',  'No or weakly',  'Yes and strongly'],
    ['Fully AI-resistant',        'No',        'Yes'],
    ['Neurodiverse-friendly',     'No',        'Yes'],
    ['Candidate drop-out rate',   '20%',       '<1%'],
  ];

  const tableRef = React.useRef(null);
  const triggerRef = React.useRef(null); // 4th metric row — fires when fully in view
  const [nsRevealed, setNsRevealed] = React.useState(() => rows.map(() => false));
  const firedRef = React.useRef(false);
  React.useEffect(() => {
    if (!triggerRef.current) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e || firedRef.current) return;
      // Fire once the 4th row is fully in the viewport (i.e. first 4 metrics are visible).
      if (e.intersectionRatio >= 0.99) {
        firedRef.current = true;
        rows.forEach((_, i) => {
          setTimeout(() => setNsRevealed(prev => { const n = prev.slice(); n[i] = true; return n; }), i * 200);
        });
        io.disconnect();
      }
    }, { threshold: [0, 0.5, 0.9, 0.99, 1] });
    io.observe(triggerRef.current);
    return () => io.disconnect();
  }, []);

  const valueCell = {
    padding: '20px 20px', fontFamily: 'var(--ns-body)', fontSize: 15,
    lineHeight: 1.3, fontWeight: 500,
    display: 'flex', alignItems: 'center',
  };

  const left = (
    <div>
      <DSectionHeader n="04" label="HEAD-TO-HEAD" />
      <h2 style={{
        fontFamily: 'var(--ns-display)', fontSize: 64, lineHeight: 0.98,
        letterSpacing: -2.5, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
        marginLeft: -3,
      }}>
        The difference,<br/><span style={{
          background: 'linear-gradient(95deg, oklch(0.72 0.24 8), oklch(0.82 0.18 200))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', color: 'transparent',
        }}>measured</span>.
      </h2>
      <p style={{
        fontFamily: 'var(--ns-body)', fontSize: 19, lineHeight: 1.55,
        color: 'oklch(0.92 0.01 95 / 0.85)', margin: '32px 0 0', maxWidth: 480,
      }}>
        The metrics that really matter, side-by-side against the psychometric testing status quo.
      </p>
    </div>
  );

  const right = (
    <div ref={tableRef} style={{ border: '1px solid oklch(0.85 0.01 95 / 0.14)' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 1fr)',
        borderBottom: '1px solid oklch(0.85 0.01 95 / 0.14)',
      }}>
        <div style={{ padding: '18px 20px', fontFamily: 'var(--ns-mono)', fontSize: 12, letterSpacing: 1.8, color: 'oklch(0.9 0.01 95 / 0.85)', fontWeight: 700 }}>METRIC</div>
        <div style={{ padding: '18px 20px', fontFamily: 'var(--ns-mono)', fontSize: 12, letterSpacing: 1.8, color: 'oklch(0.9 0.01 95 / 0.85)', fontWeight: 700, borderLeft: '1px solid oklch(0.85 0.01 95 / 0.14)', lineHeight: 1.3 }}>CONVENTIONAL<br/>ONLINE TEST</div>
        <div style={{ padding: '18px 20px', fontFamily: 'var(--ns-mono)', fontSize: 12, letterSpacing: 1.8, color: 'var(--ns-yellow)', fontWeight: 700, borderLeft: '1px solid oklch(0.85 0.01 95 / 0.14)', background: 'oklch(0.92 0.18 98 / 0.10)', lineHeight: 1.3 }}>NEUROSIGHT<br/>ASSESSMENT</div>
      </div>
      {rows.map((r, i) => (
        <div key={i} ref={i === 3 ? triggerRef : null} style={{
          display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr) minmax(0, 1fr)',
          borderBottom: i < rows.length - 1 ? '1px solid oklch(0.85 0.01 95 / 0.08)' : 'none',
        }}>
          <div style={{ ...valueCell, color: 'var(--ns-white)' }}>{r[0]}</div>
          <div style={{ ...valueCell, color: 'oklch(0.72 0.22 8 / 0.9)', borderLeft: '1px solid oklch(0.85 0.01 95 / 0.08)' }}>{r[1]}</div>
          <div style={{
            ...valueCell,
            color: 'oklch(0.82 0.18 200)',
            borderLeft: '1px solid oklch(0.85 0.01 95 / 0.08)',
            background: 'oklch(0.92 0.18 98 / 0.04)',
            opacity: nsRevealed[i] ? 1 : 0,
            transform: nsRevealed[i] ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 380ms ease-out, transform 380ms cubic-bezier(.2,.8,.2,1)',
            fontWeight: 600,
          }}>{r[2]}</div>
        </div>
      ))}
    </div>
  );

  return <DTwoCol id="compare" flip={true} left={left} right={right} />;
};

Object.assign(window, { DProblem, DInsight, DDiversity, DCompare });
