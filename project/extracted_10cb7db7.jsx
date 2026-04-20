// Neurosight mobile site — rainbow neon on black
// Single scroll, single file, single source of truth

const LOGO_DARK = (typeof window !== 'undefined' && window.__resources && window.__resources.logoDark) || 'logo-dark.png'; // yellow logo for dark bg

// Tweakable state — populated by TweaksPanel / host
window.__nsTweaks = window.__nsTweaks || {};
const useTweaks = () => {
  const [t, setT] = React.useState(window.__nsTweaks);
  React.useEffect(() => {
    const h = (e) => {
      if (e.detail) setT({ ...e.detail });
    };
    window.addEventListener('__ns_tweaks', h);
    return () => window.removeEventListener('__ns_tweaks', h);
  }, []);
  return t;
};

// Reusable section header tag: [ 0N / LABEL ]
const SectionTag = ({ n, label, color = 'var(--ns-cyan)' }) => (
  <div style={{
    fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 2.5,
    color, marginBottom: 20, fontWeight: 700,
  }}>
    <span style={{ opacity: 0.5 }}>[</span> {n} / {label} <span style={{ opacity: 0.5 }}>]</span>
  </div>
);

// ────────────────────────────────────────────────
// Sticky mini-nav
// ────────────────────────────────────────────────
const TopNav = () => {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      padding: '10px 18px',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: 'oklch(0.06 0.01 280 / 0.75)',
      backdropFilter: 'blur(14px) saturate(140%)',
      WebkitBackdropFilter: 'blur(14px) saturate(140%)',
      borderBottom: '1px solid oklch(0.85 0.01 95 / 0.08)',
    }}>
      <img src={LOGO_DARK} alt="Neurosight" style={{ height: 36, display: 'block' }} />
      <a href="#contact" style={{
        fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 1.8,
        color: 'var(--ns-white)', textDecoration: 'none',
        padding: '8px 12px',
        border: '1px solid oklch(0.85 0.01 95 / 0.25)',
      }}>
        GET IN TOUCH
      </a>
    </div>
  );
};

// ────────────────────────────────────────────────
// Hero
// ────────────────────────────────────────────────
// Auto-scrolling marquee for the trusted-by client list
const ClientsMarquee = ({ clients }) => {
  // Split roughly in half so both rows stay populated
  const mid = Math.ceil(clients.length / 2);
  const a = clients.slice(0, mid);
  const b = clients.slice(mid);
  // Palette for the accent dot — cycles through brand colors
  const dots = ['oklch(0.82 0.18 200)', 'oklch(0.78 0.20 320)', 'oklch(0.92 0.18 98)', 'oklch(0.72 0.26 8)'];
  const Row = ({ items, speed, reverse }) => {
    // Duplicate content so the loop is seamless
    const doubled = [...items, ...items];
    return (
      <div style={{
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 10,
        maskImage: 'linear-gradient(90deg, transparent, black 14%, black 86%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 14%, black 86%, transparent)',
      }}>
        <div
          className="ns-marquee-track"
          style={{
            display: 'inline-flex', whiteSpace: 'nowrap', gap: 10,
            animation: `${reverse ? 'ns-marquee-rev' : 'ns-marquee'} ${speed}s linear infinite`,
            willChange: 'transform',
          }}
        >
          {doubled.map((c, i) => (
            <span key={`${c}-${i}`} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 12px',
              border: '1px solid oklch(0.85 0.01 95 / 0.14)',
              background: 'oklch(0.1 0.01 280 / 0.5)',
              fontFamily: 'var(--ns-display)', fontSize: 12, fontWeight: 500,
              letterSpacing: 0.3,
              color: 'oklch(0.92 0.01 95 / 0.82)',
              flexShrink: 0,
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: dots[i % dots.length],
                boxShadow: `0 0 8px ${dots[i % dots.length]}`,
              }} />
              {c}
            </span>
          ))}
        </div>
      </div>
    );
  };
  return (
    <div
      onMouseEnter={e => e.currentTarget.classList.add('paused')}
      onMouseLeave={e => e.currentTarget.classList.remove('paused')}
      style={{ position: 'relative' }}
    >
      <Row items={a} speed={38} reverse={false} />
      <Row items={b.length ? b : a} speed={26} reverse={true} />
    </div>
  );
};

const Hero = () => {
  const tw = useTweaks();
  const clients = tw.clients || ['Grant Thornton', 'Virgin Media O2', 'Cognizant', 'Worldpay', 'NHS', 'Sellafield', 'Amey', 'Autotrader', 'Forvis Mazars', 'Welsh Water', 'Fieldfisher', 'Merseyrail', 'Womble Bond Dickinson'];
  // Sequential reveal: typewriter → kindle lines → trusted-by block.
  // Typewriter ≈ 920ms → kindle starts at 1100ms; last kindle ends ~3480ms;
  // +250ms pause → trusted-by fades in at ~3730ms.
  const [showTrust, setShowTrust] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShowTrust(true), 2750);
    return () => clearTimeout(t);
  }, []);
  const KINDLE_OFFSET = 900;
  return (
  <section style={{ position: 'relative', padding: '60px 22px 84px', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', top: -160, left: -140, width: 380, height: 380,
      background: 'radial-gradient(circle, oklch(0.68 0.28 8 / 0.55), transparent 65%)',
      filter: 'blur(24px)', pointerEvents: 'none',
    }} />
    <div style={{
      position: 'absolute', top: 40, right: -180, width: 400, height: 400,
      background: 'radial-gradient(circle, oklch(0.78 0.18 200 / 0.5), transparent 65%)',
      filter: 'blur(24px)', pointerEvents: 'none',
    }} />
    <div style={{
      position: 'absolute', bottom: -160, left: '15%', width: 320, height: 320,
      background: 'radial-gradient(circle, oklch(0.78 0.20 280 / 0.4), transparent 65%)',
      filter: 'blur(24px)', pointerEvents: 'none',
    }} />

    <div style={{ position: 'relative', zIndex: 2 }}>
      <div style={{
        fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 2.5,
        color: 'var(--ns-cyan)', marginBottom: 22, fontWeight: 700,
      }}>
        <Typewriter text={tw.heroEyebrow ? `[ ${tw.heroEyebrow} ]` : '[ NEXT-GEN PRE-HIRE ASSESSMENT ]'} speed={28} />
      </div>

      <h1 style={{
        fontFamily: 'var(--ns-display)',
        fontSize: 52, lineHeight: 0.94, letterSpacing: -2,
        fontWeight: 500, margin: 0,
        color: 'var(--ns-white)',
      }}>
        <WordKindle delay={0 + KINDLE_OFFSET} durMs={1300} color={`linear-gradient(95deg, ${tw.accent === 'cyan' ? 'oklch(0.82 0.18 200)' : tw.accent === 'purple' ? 'oklch(0.78 0.20 320)' : tw.accent === 'yellow' ? 'oklch(0.92 0.18 98)' : 'oklch(0.78 0.26 8)'}, oklch(0.78 0.20 320))`}>Faster.</WordKindle>
        <br />
        <WordKindle delay={350 + KINDLE_OFFSET} durMs={1300} color="linear-gradient(95deg, oklch(0.78 0.20 320), oklch(0.82 0.18 200))">Fairer.</WordKindle>
        <br />
        <WordKindle delay={670 + KINDLE_OFFSET} durMs={1430} color="oklch(0.92 0.18 98)">More accurate.</WordKindle>
      </h1>

      <p style={{
        fontFamily: 'var(--ns-body)', fontSize: 16.5, lineHeight: 1.5,
        color: 'oklch(0.92 0.01 95 / 0.9)',
        margin: '28px 0 0', maxWidth: 340,
        textWrap: 'pretty',
      }}>
        Our online pre-hire assessments identify genuine talent without bias — in <span style={{ color: 'var(--ns-white)', fontWeight: 500 }}>3 to 5 minutes</span>. Fully resilient to AI.
      </p>

      <div style={{ display: 'flex', gap: 10, marginTop: 36, flexWrap: 'wrap' }}>
        <a href="#contact" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '15px 22px',
          background: 'var(--ns-yellow)', color: '#000',
          fontFamily: 'var(--ns-display)', fontWeight: 600, fontSize: 13,
          letterSpacing: 0.8, textDecoration: 'none',
          boxShadow: '0 0 40px oklch(0.92 0.18 98 / 0.4)',
        }}>
          {tw.ctaLabel || 'BOOK A DEMO'}
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>

      {/* trusted-by micro row */}
      <div style={{
        marginTop: 54, paddingTop: 20,
        borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)',
        opacity: showTrust ? 1 : 0,
        transform: showTrust ? 'translateY(0)' : 'translateY(8px)',
        transition: 'opacity 700ms ease-out, transform 700ms cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{
          fontFamily: 'var(--ns-mono)', fontSize: 9, letterSpacing: 2,
          color: 'oklch(0.92 0.01 95 / 0.88)', marginBottom: 14, fontWeight: 700,
        }}>TRUSTED BY</div>
        <div style={{
          opacity: showTrust ? 1 : 0,
          transition: 'opacity 800ms ease-out 250ms',
        }}>
          <ClientsMarquee clients={clients} />
        </div>
      </div>
    </div>

    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, height: 1,
      background: 'linear-gradient(90deg, transparent, oklch(0.82 0.18 200 / 0.6), transparent)',
    }} />
  </section>
  );
};

// ────────────────────────────────────────────────
// Problem — AI has broken hiring
// ────────────────────────────────────────────────
const Problem = () => (
  <section style={{ position: 'relative', padding: '80px 22px 64px', borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)' }}>
    <SectionTag n="01" label="THE PROBLEM" color="oklch(0.72 0.26 8)" />

    <h2 style={{
      fontFamily: 'var(--ns-display)', fontSize: 34, lineHeight: 1.02,
      letterSpacing: -1.2, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
    }}>
      Conventional online assessment has <span style={{ color: 'oklch(0.72 0.26 8)' }}>lost its integrity</span>.
    </h2>

    <p style={{
      fontFamily: 'var(--ns-body)', fontSize: 15, lineHeight: 1.55,
      color: 'oklch(0.92 0.01 95 / 0.85)', margin: '20px 0 32px',
    }}>
      A candidate points a smartphone at their laptop. ChatGPT does the rest. Every major online psychometric test is now compromised — and <span style={{ color: 'var(--ns-white)' }}>over 50% of candidates admit using AI tools</span> to complete applications.
    </p>

    {/* Big AI stat */}
    <div style={{
      padding: '24px 20px', marginBottom: 28,
      border: '1px solid oklch(0.72 0.26 8 / 0.35)',
      background: 'linear-gradient(135deg, oklch(0.3 0.1 8 / 0.25), transparent)',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 1,
        background: 'oklch(0.72 0.26 8)', boxShadow: '0 0 14px oklch(0.72 0.26 8)',
      }} />
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
        <div style={{
          fontFamily: 'var(--ns-display)', fontSize: 56, fontWeight: 500,
          color: 'oklch(0.78 0.26 8)', letterSpacing: -2.5, lineHeight: 0.9,
          textShadow: '0 0 24px oklch(0.72 0.26 8 / 0.6)',
          minWidth: 128, flexShrink: 0,
          fontVariantNumeric: 'tabular-nums',
        }}><Counter to={50} duration={1300} suffix="%+" /></div>
        <div style={{
          fontFamily: 'var(--ns-body)', fontSize: 13, lineHeight: 1.35,
          color: 'oklch(0.9 0.01 95 / 0.85)',
          alignSelf: 'flex-end',
        }}>of candidates admit using AI tools to complete job applications and online assessments.</div>
      </div>
    </div>

    <h3 style={{
      fontFamily: 'var(--ns-display)', fontSize: 20, fontWeight: 500,
      letterSpacing: -0.4, lineHeight: 1.2,
      color: 'var(--ns-white)', margin: '8px 0 18px',
    }}>
      The limitations of conventional psychometric tests
    </h3>

    <SequentialReveal
      interval={250}
      threshold={0.85}
      style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'oklch(0.85 0.01 95 / 0.08)' }}
    >
      {[
        ['INACCURATE', 'Fail to predict real-world job performance'],
        ['TIME CONSUMING', '30–50 anxiety-inducing minutes for candidates'],
        ['BIASED', 'One-size-fits-all algorithms harm diversity and neurodiversity'],
        ['VULNERABLE TO AI', 'Trivially defeated by candidates using AI apps like ChatGPT to photo their laptop screen'],
      ].map(([tag, desc], i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'baseline', gap: 16,
          padding: '18px 0', background: '#000',
        }}>
          <div style={{
            fontFamily: 'var(--ns-mono)', fontSize: 10, color: 'oklch(0.72 0.26 8)',
            minWidth: 28,
          }}>0{i+1}</div>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: 'var(--ns-display)', fontSize: 15, fontWeight: 600,
              color: 'var(--ns-white)', letterSpacing: 0.5, marginBottom: 4,
            }}>{tag}</div>
            <div style={{
              fontFamily: 'var(--ns-body)', fontSize: 13.5, lineHeight: 1.4,
              color: 'oklch(0.92 0.01 95 / 0.82)',
            }}>{desc}</div>
          </div>
        </div>
      ))}
    </SequentialReveal>
  </section>
);

// ────────────────────────────────────────────────
// Solution — measure HOW, not what
// ────────────────────────────────────────────────
const CognitionBars = ({ rows }) => {
  const ref = React.useRef(null);
  const [armed, setArmed] = React.useState(rows.map(() => false));
  React.useEffect(() => {
    if (!ref.current) return;
    const root = window.__nsScrollRoot || null;
    // Watch many thresholds so the callback re-fires as the element scrolls through view.
    const opts = { threshold: [0, 0.25, 0.5, 0.75, 1], root };
    const io = new IntersectionObserver((entries) => {
      const e = entries[entries.length - 1];
      if (!e) return;
      const rootRect = root ? root.getBoundingClientRect() : { top: 0, bottom: window.innerHeight };
      const r = e.boundingClientRect;
      // require BOTH top and bottom inside the scrolling viewport
      if (r.top >= rootRect.top - 2 && r.bottom <= rootRect.bottom + 2) {
        rows.forEach((_, i) => {
          setTimeout(() => {
            setArmed(prev => { const n = prev.slice(); n[i] = true; return n; });
          }, i * 300);
        });
        io.disconnect();
      }
    }, opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      padding: 20, marginBottom: 28,
      border: '1px solid oklch(0.85 0.01 95 / 0.1)',
      background: 'linear-gradient(180deg, transparent, oklch(0.82 0.18 200 / 0.05))',
    }}>
      {rows.map((x, i) => (
        <div key={i} style={{ marginBottom: i < rows.length - 1 ? 14 : 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
            <div>
              <span style={{
                fontFamily: 'var(--ns-mono)', fontSize: 9, letterSpacing: 1.5,
                color: x.c, marginRight: 10, fontWeight: 700,
              }}>{x.l}</span>
              <span style={{
                fontFamily: 'var(--ns-body)', fontSize: 13, fontWeight: 700,
                color: 'var(--ns-white)',
              }}>{x.t}</span>
            </div>
          </div>
          <div style={{
            height: 5, background: 'oklch(0.85 0.01 95 / 0.08)', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0,
              width: armed[i] ? `${x.v}%` : '0%',
              background: x.c, boxShadow: `0 0 10px ${x.c}`,
              transition: 'width 1100ms cubic-bezier(.2,.7,.2,1)',
            }} />
          </div>
          <div style={{
            fontFamily: 'var(--ns-mono)', fontSize: 9.5, letterSpacing: 0.5,
            color: 'oklch(0.92 0.01 95 / 0.85)', marginTop: 5, fontWeight: 500,
          }}>› {x.tag}</div>
        </div>
      ))}
    </div>
  );
};

const Solution = () => (
  <section style={{ position: 'relative', padding: '80px 22px 64px', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', top: -100, right: -120, width: 340, height: 340,
      background: 'radial-gradient(circle, oklch(0.82 0.18 200 / 0.38), transparent 65%)',
      filter: 'blur(24px)', pointerEvents: 'none',
    }} />
    <div style={{ position: 'relative', zIndex: 2 }}>
      <SectionTag n="02" label="THE INSIGHT LAYER" />

      <h2 style={{
        fontFamily: 'var(--ns-display)', fontSize: 34, lineHeight: 1.02,
        letterSpacing: -1.2, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
      }}>
        We measure{' '}
        <span style={{
          background: 'linear-gradient(95deg, oklch(0.82 0.18 200), oklch(0.78 0.20 280))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>how</span>
        {' '}people think —<br/>not just the answer.
      </h2>

      <p style={{
        fontFamily: 'var(--ns-body)', fontSize: 15, lineHeight: 1.55,
        color: 'oklch(0.92 0.01 95 / 0.85)', margin: '20px 0 32px',
      }}>
        Conventional assessments only score the answers. We use neuroscience to analyse <em style={{ fontStyle: 'normal', color: 'var(--ns-white)' }}>how</em> people arrive at their decisions — in real time. This insight layer builds full AI resilience, and is dramatically more predictive of real-world performance.
      </p>

      {/* deep-layer visual */}
      <CognitionBars
        rows={[
          { l: 'SURFACE', t: 'The answer given', v: 35, c: 'oklch(0.92 0.01 95 / 0.85)', tag: 'Conventional tests stop here' },
          { l: 'PATH', t: 'How decisions were made', v: 70, c: 'oklch(0.82 0.18 200)', tag: 'Building full resilience to AI use' },
          { l: 'COGNITION', t: 'How they think and feel', v: 100, c: 'oklch(0.78 0.20 320)', tag: 'The Neurosight difference' },
        ]}
      />

      <div style={{ display: 'grid', gap: 12 }}>
        {[
          { t: '3–5 min', s: 'Candidate completion time', c: 'var(--ns-cyan)' },
          { t: '3–6×', s: 'Higher validity than conventional tests', c: 'oklch(0.78 0.20 320)' },
          { t: 'AI-proof', s: 'Cannot be fooled by ChatGPT or LLMs', c: 'var(--ns-yellow)' },
        ].map((x, i) => (
          <div key={i} style={{
            padding: '20px 18px',
            border: '1px solid oklch(0.85 0.01 95 / 0.12)',
            background: 'linear-gradient(135deg, oklch(0.3 0.01 95 / 0.2), transparent)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: 2, height: '100%',
              background: x.c, boxShadow: `0 0 12px ${x.c}`,
            }} />
            <div style={{
              fontFamily: 'var(--ns-display)', fontSize: 30, fontWeight: 500,
              color: x.c, letterSpacing: -0.8, lineHeight: 1,
            }}>{x.t}</div>
            <div style={{
              fontFamily: 'var(--ns-body)', fontSize: 13, marginTop: 8,
              color: 'oklch(0.92 0.01 95 / 0.85)',
            }}>{x.s}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Diversity — everyone is unique
// ────────────────────────────────────────────────
const Diversity = () => (
  <section style={{ position: 'relative', padding: '80px 22px 64px', overflow: 'hidden', borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)' }}>
    <div style={{
      position: 'absolute', top: -120, left: -100, width: 320, height: 320,
      background: 'radial-gradient(circle, oklch(0.78 0.20 280 / 0.4), transparent 65%)',
      filter: 'blur(24px)', pointerEvents: 'none',
    }} />
    <div style={{ position: 'relative', zIndex: 2 }}>
      <SectionTag n="03" label="DIVERSITY & NEURODIVERSITY" color="oklch(0.78 0.20 320)" />

      <h2 style={{
        fontFamily: 'var(--ns-display)', fontSize: 34, lineHeight: 1.02,
        letterSpacing: -1.2, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
      }}>
        Everyone is <RainbowCycle>unique</RainbowCycle>.
        <span style={{ display: 'block', height: 10 }} />
        <span style={{
          background: 'linear-gradient(95deg, oklch(0.78 0.20 320), oklch(0.82 0.18 200))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>Their scoring algorithm should be, too.</span>
      </h2>

      <p style={{
        fontFamily: 'var(--ns-body)', fontSize: 15, lineHeight: 1.55,
        color: 'oklch(0.92 0.01 95 / 0.85)', margin: '20px 0 32px',
      }}>
        Most tests apply one-size-fits-all algorithms to every candidate — harming diversity and excluding neurodivergent talent. Our neuroscience-powered scoring responds dynamically to individual differences, eliminating bias at the source.
      </p>

      <div style={{
        padding: '22px 20px',
        border: '1px solid oklch(0.78 0.20 320 / 0.35)',
        background: 'linear-gradient(135deg, oklch(0.35 0.12 320 / 0.15), transparent)',
      }}>
        <div style={{
          fontFamily: 'var(--ns-mono)', fontSize: 9.5, letterSpacing: 1.5,
          color: 'oklch(0.78 0.20 320)', marginBottom: 10,
        }}>BIAS ELIMINATED ACROSS</div>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8,
        }}>
          {['Ethnicity', 'Gender', 'Socio-economic status', 'Disability', 'Neurodiversity'].map((x, i) => (
            <Reveal key={x} as="span" delay={i * 70} y={6} style={{
              padding: '6px 10px',
              border: '1px solid oklch(0.85 0.01 95 / 0.18)',
              fontFamily: 'var(--ns-body)', fontSize: 12,
              color: 'var(--ns-white)',
            }}>{x}</Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// Comparison table
// ────────────────────────────────────────────────
const Compare = () => {
  const rows = [
    ['Completion time', '30–50 min', '3–5 min'],
    ['Observed validity', '0.1–0.2', '0.4–0.6'],
    ['Predicts job performance', <>No or<br/>weakly</>, <>Yes and<br/>strongly</>],
    ['Fully AI-resistant', 'No', 'Yes'],
    ['Neurodiverse-friendly', 'No', 'Yes'],
    ['Candidate drop-out rate', '20%', '<1%'],
  ];
  return (
    <section style={{ padding: '80px 22px 64px', borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)' }}>
      <SectionTag n="04" label="HEAD-TO-HEAD" />

      <h2 style={{
        fontFamily: 'var(--ns-display)', fontSize: 34, lineHeight: 1.02,
        letterSpacing: -1.2, fontWeight: 500, margin: '0 0 32px', color: 'var(--ns-white)',
      }}>
        The difference,<br/>measured.
      </h2>

      <div style={{ border: '1px solid oklch(0.85 0.01 95 / 0.12)' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr',
          borderBottom: '1px solid oklch(0.85 0.01 95 / 0.12)',
        }}>
          <div style={{ padding: '14px 12px', fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 1.5, color: 'oklch(0.9 0.01 95 / 0.85)', fontWeight: 700 }}>METRIC</div>
          <div style={{ padding: '14px 12px', fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 1.5, color: 'oklch(0.9 0.01 95 / 0.85)', fontWeight: 700, borderLeft: '1px solid oklch(0.85 0.01 95 / 0.12)', whiteSpace: 'pre-line', lineHeight: 1.2 }}>{'CONVENTIONAL\nONLINE TEST'}</div>
          <div style={{ padding: '14px 12px', fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 1.5, color: 'var(--ns-yellow)', fontWeight: 700, borderLeft: '1px solid oklch(0.85 0.01 95 / 0.12)', background: 'oklch(0.92 0.18 98 / 0.10)', whiteSpace: 'pre-line', lineHeight: 1.2 }}>{'NEUROSIGHT\nASSESSMENT'}</div>
        </div>

        {rows.map((r, i) => (
          <Reveal key={i} delay={i * 60} y={8} style={{
            display: 'grid', gridTemplateColumns: '1.3fr 1fr 1fr',
            borderBottom: i < rows.length - 1 ? '1px solid oklch(0.85 0.01 95 / 0.08)' : 'none',
          }}>
            <div style={{
              padding: '14px 12px', fontFamily: 'var(--ns-body)', fontSize: 13,
              color: 'var(--ns-white)', lineHeight: 1.3,
            }}>{r[0]}</div>
            <div style={{
              padding: '14px 12px', fontFamily: 'var(--ns-display)', fontSize: 13,
              color: 'oklch(0.72 0.22 8 / 0.9)', borderLeft: '1px solid oklch(0.85 0.01 95 / 0.08)',
              lineHeight: 1.3, fontWeight: 500,
            }}>{r[1]}</div>
            <div style={{
              padding: '14px 12px', fontFamily: 'var(--ns-display)', fontSize: 13,
              color: 'oklch(0.82 0.18 200)', borderLeft: '1px solid oklch(0.85 0.01 95 / 0.08)',
              lineHeight: 1.3, background: 'oklch(0.92 0.18 98 / 0.03)', fontWeight: 500,
            }}>{r[2]}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Results — the showstopper
// ────────────────────────────────────────────────
const Results = () => {
  const stats = [
    { n: 96, suf: '%', l: 'New hires rated "excellent" or "good"', c: 'oklch(0.82 0.18 200)' },
    { n: 130, suf: '%', l: 'Increase in neurodiverse hires', c: 'oklch(0.78 0.20 320)' },
    { n: 70, suf: '%', l: 'Reduction in year-one attrition', c: 'var(--ns-yellow)' },
    { n: '3–6×', suf: '', l: 'Higher validity than conventional tests', c: 'oklch(0.72 0.24 8)' },
    { n: 99, suf: '%', l: 'Candidate completion rate', c: 'oklch(0.82 0.18 200)' },
    { n: 70, suf: '', pre: '+', l: 'Candidate NPS', c: 'oklch(0.78 0.20 280)' },
    { n: 70, suf: '%', l: 'Increase in female representation at offer', c: 'var(--ns-yellow)' },
    { n: 64, suf: '%', l: 'Improvement in BAME pass rates', c: 'oklch(0.72 0.24 8)' },
  ];
  return (
    <section style={{ position: 'relative', padding: '80px 22px 72px', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, oklch(0.68 0.28 8 / 0.18), transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        <SectionTag n="05" label="REAL-WORLD OUTCOMES" color="var(--ns-yellow)" />

        <h2 style={{
          fontFamily: 'var(--ns-display)', fontSize: 34, lineHeight: 1.02,
          letterSpacing: -1.2, fontWeight: 500, margin: '0 0 12px', color: 'var(--ns-white)',
        }}>
          What our customers see.
        </h2>
        <p style={{
          fontFamily: 'var(--ns-body)', fontSize: 14, lineHeight: 1.5,
          color: 'oklch(0.92 0.01 95 / 0.82)', margin: '0 0 36px',
        }}>
          Outcome highlights from Grant Thornton, Virgin Media O2, Sellafield, the NHS and others.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'oklch(0.85 0.01 95 / 0.1)', border: '1px solid oklch(0.85 0.01 95 / 0.1)' }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: '#000', padding: '24px 14px',
              minHeight: 140, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                fontFamily: 'var(--ns-display)', fontSize: 42, fontWeight: 500,
                color: s.c, letterSpacing: -2, lineHeight: 0.95,
                textShadow: `0 0 24px ${s.c}`,
              }}>{typeof s.n === 'number' ? <Counter to={s.n} duration={1300} prefix={s.pre || ''} suffix={s.suf || ''} start={i * 80} /> : s.n}</div>
              <div style={{
                fontFamily: 'var(--ns-body)', fontSize: 11.5, lineHeight: 1.35,
                color: 'oklch(0.92 0.01 95 / 0.9)', marginTop: 14,
              }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Candidate experience
// ────────────────────────────────────────────────
// 06 — Candidate Experience
// ────────────────────────────────────────────────
// Rotates through verbs of appreciation for the hero line
const PRAISE_WORDS = [
  { verb: 'Appreciated', color: 'oklch(0.82 0.18 200)' },   // cyan
  { verb: 'Loved',       color: 'oklch(0.78 0.20 320)' },   // purple
  { verb: 'Praised',     color: 'oklch(0.92 0.18 98)' },    // yellow
  { verb: 'Recommended', color: 'oklch(0.82 0.18 200)' },   // cyan
  { verb: 'Championed',  color: 'oklch(0.78 0.20 320)' },   // purple
];

const RotatingPraise = () => {
  const [ref, seen] = useInView({ threshold: 0.5 });
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (!seen) return;
    const t = setInterval(() => setI(v => (v + 1) % PRAISE_WORDS.length), 1600);
    return () => clearInterval(t);
  }, [seen]);
  const w = PRAISE_WORDS[i];
  // Widest word sets container width so layout doesn't jump
  const widest = PRAISE_WORDS.reduce((a, b) => (a.verb.length > b.verb.length ? a : b)).verb;
  return (
    <span ref={ref} style={{ display: 'block' }}>
      <span style={{
        position: 'relative', display: 'inline-block',
        verticalAlign: 'baseline',
      }}>
        {/* invisible sizer */}
        <span aria-hidden style={{ visibility: 'hidden', whiteSpace: 'nowrap' }}>{widest}</span>
        {/* stacked words */}
        {PRAISE_WORDS.map((p, idx) => (
          <span key={p.verb} style={{
            position: 'absolute', left: 0, top: 0,
            color: p.color,
            whiteSpace: 'nowrap',
            transition: 'opacity 520ms cubic-bezier(.2,.8,.2,1), transform 520ms cubic-bezier(.2,.8,.2,1), filter 520ms',
            opacity: idx === i ? 1 : 0,
            transform: idx === i ? 'translateY(0)' : (idx === (i - 1 + PRAISE_WORDS.length) % PRAISE_WORDS.length ? 'translateY(-12px)' : 'translateY(12px)'),
            filter: idx === i ? 'blur(0)' : 'blur(6px)',
            textShadow: idx === i ? `0 0 24px ${p.color}50` : 'none',
          }}>{p.verb}</span>
        ))}
      </span>
      <span style={{ color: 'var(--ns-white)' }}><br/>by candidates.</span>
    </span>
  );
};

const CandidateExp = () => (
  <section style={{ position: 'relative', padding: '80px 22px 64px', borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)', overflow: 'hidden' }}>
    {/* ambient cyan wash */}
    <div style={{
      position: 'absolute', top: '30%', left: '-40%', width: 500, height: 500,
      background: 'radial-gradient(circle, oklch(0.82 0.18 200 / 0.18), transparent 60%)',
      pointerEvents: 'none', zIndex: 0,
    }} />

    <div style={{ position: 'relative', zIndex: 1 }}>
      <SectionTag n="06" label="CANDIDATE EXPERIENCE" color="oklch(0.82 0.18 200)" />

      <h2 style={{
        fontFamily: 'var(--ns-display)', fontSize: 34, lineHeight: 1.02,
        letterSpacing: -1.2, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
      }}>
        Brand-aligned.<br/>
        <RotatingPraise />
      </h2>

      <p style={{
        fontFamily: 'var(--ns-body)', fontSize: 15, lineHeight: 1.55,
        color: 'oklch(0.92 0.01 95 / 0.85)', margin: '20px 0 32px',
      }}>
        Conventional tests are time consuming and anxiety-inducing. Our online assessments are 3–5 minutes, fully aligned to your brand, and leave a lasting positive impression — protecting your talent pipeline, and your reputation.
      </p>

      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
        background: 'oklch(0.85 0.01 95 / 0.1)', border: '1px solid oklch(0.85 0.01 95 / 0.1)',
      }}>
        <div style={{ background: '#000', padding: '22px 16px' }}>
          <div style={{ fontFamily: 'var(--ns-mono)', fontSize: 9, letterSpacing: 1.5, color: 'oklch(0.92 0.01 95 / 0.68)', marginBottom: 8 }}>
            DROP-OUT RATE
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'var(--ns-display)', fontSize: 24, fontWeight: 500, color: 'oklch(0.72 0.24 8)', opacity: 0.6 }}><StrikeWipe>20–30%</StrikeWipe></span>
          </div>
          <div style={{
            fontFamily: 'var(--ns-display)', fontSize: 32, fontWeight: 500,
            color: 'var(--ns-cyan)', letterSpacing: -1, marginTop: 4,
            textShadow: '0 0 20px oklch(0.82 0.18 200 / 0.6)',
          }}>&lt;1%</div>
        </div>
        <div style={{ background: '#000', padding: '22px 16px' }}>
          <div style={{ fontFamily: 'var(--ns-mono)', fontSize: 9, letterSpacing: 1.5, color: 'oklch(0.92 0.01 95 / 0.68)', marginBottom: 8 }}>
            COMPLETION TIME
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'var(--ns-display)', fontSize: 24, fontWeight: 500, color: 'oklch(0.72 0.24 8)', opacity: 0.6 }}><StrikeWipe delay={120}>30–50m</StrikeWipe></span>
          </div>
          <div style={{
            fontFamily: 'var(--ns-display)', fontSize: 32, fontWeight: 500,
            color: 'var(--ns-yellow)', letterSpacing: -1, marginTop: 4,
            textShadow: '0 0 20px oklch(0.92 0.18 98 / 0.5)',
          }}>3–5m</div>
        </div>
      </div>
    </div>
  </section>
);

// ────────────────────────────────────────────────
// How it works — 3 stages
// ────────────────────────────────────────────────
const Stages = ({ steps }) => {
  const containerRef = React.useRef(null);
  const [active, setActive] = React.useState(() => steps.map(() => false));

  React.useEffect(() => {
    if (!containerRef.current) return;
    const opts = { threshold: 0.85, root: window.__nsScrollRoot || null };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        // Sequentially light up at 0.2s intervals, then disconnect (one-time)
        steps.forEach((_, i) => {
          setTimeout(() => {
            setActive(prev => { const next = prev.slice(); next[i] = true; return next; });
          }, i * 200);
        });
        io.disconnect();
      }
    }, opts);
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      {steps.map((s, i) => (
        <div key={i} style={{ position: 'relative', paddingLeft: 44, marginBottom: i < steps.length - 1 ? 36 : 0 }}>
          <PulseNode color={s.c} size={22} active={active[i]} />
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 1.5,
              color: s.c,
            }}>STAGE {s.n}</span>
            <span style={{
              fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 1,
              color: 'oklch(0.92 0.01 95 / 0.65)',
            }}>{s.time}</span>
          </div>
          <div style={{
            fontFamily: 'var(--ns-display)', fontSize: 20, fontWeight: 500,
            color: 'var(--ns-white)', letterSpacing: -0.5, marginBottom: 8,
          }}>{s.t}</div>
          <div style={{
            fontFamily: 'var(--ns-body)', fontSize: 14, lineHeight: 1.5,
            color: 'oklch(0.92 0.01 95 / 0.85)',
          }}>{s.d}</div>
        </div>
      ))}
    </div>
  );
};

const HowItWorks = () => {
  const steps = [
    {
      n: '01',
      t: 'Realistic job preview',
      time: '5 min',
      d: 'An immersive, interactive preview. Prevents a flood of AI-generated auto-apply applications. Encourages the right candidates to apply — with confidence.',
      c: 'oklch(0.82 0.18 200)',
    },
    {
      n: '02',
      t: 'Bespoke Neurosight assessment',
      time: '3–5 min',
      d: 'Brand-aligned, fully AI-resilient psychometric assessment tuned to your specific drivers of success. Detailed insight reports or a single progression score.',
      c: 'oklch(0.78 0.20 320)',
    },
    {
      n: '03',
      t: 'Live interview stage',
      time: '10–40 min',
      d: 'Interviews, assessment exercises, or in-person assessment centres — now focused only on the candidates with genuine potential.',
      c: 'var(--ns-yellow)',
    },
  ];
  return (
    <section id="how" style={{ padding: '80px 22px 64px', borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)' }}>
      <SectionTag n="07" label="THE PROCESS" />

      <h2 style={{
        fontFamily: 'var(--ns-display)', fontSize: 34, lineHeight: 1.02,
        letterSpacing: -1.2, fontWeight: 500, margin: '0 0 36px', color: 'var(--ns-white)',
      }}>
        End-to-end hiring,<br/>fit for the age of AI.
      </h2>

      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute', left: 14, top: 20, bottom: 20, width: 1,
          background: 'linear-gradient(to bottom, oklch(0.82 0.18 200 / 0.6), oklch(0.78 0.20 320 / 0.6), oklch(0.92 0.18 98 / 0.6))',
        }} />

        <Stages steps={steps} />
      </div>
    </section>
  );
};

// ────────────────────────────────────────────────
// Contact
// ────────────────────────────────────────────────
const Contact = () => {
  const [sent, setSent] = React.useState(false);
  return (
    <section id="contact" style={{ position: 'relative', padding: '88px 22px 64px', overflow: 'hidden', borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)' }}>
      <div style={{
        position: 'absolute', top: -140, left: '-20%', width: 420, height: 420,
        background: 'radial-gradient(circle, oklch(0.92 0.18 98 / 0.22), transparent 65%)',
        filter: 'blur(24px)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: -140, right: '-20%', width: 380, height: 380,
        background: 'radial-gradient(circle, oklch(0.68 0.28 8 / 0.35), transparent 65%)',
        filter: 'blur(24px)', pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', zIndex: 2 }}>
        <SectionTag n="08" label="CONTACT" color="var(--ns-yellow)" />

        <h2 style={{
          fontFamily: 'var(--ns-display)', fontSize: 42, lineHeight: 0.96,
          letterSpacing: -1.6, fontWeight: 500, margin: 0, color: 'var(--ns-white)',
        }}>
          Let's fix
          <br />
          <span style={{
            background: 'linear-gradient(95deg, oklch(0.92 0.18 98), oklch(0.78 0.20 320), oklch(0.82 0.18 200))',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>your hiring.</span>
        </h2>
        <p style={{
          fontFamily: 'var(--ns-body)', fontSize: 15, lineHeight: 1.5,
          color: 'oklch(0.92 0.01 95 / 0.86)', margin: '20px 0 32px',
        }}>
          Book a 30-minute walkthrough. See a live, bespoke assessment built for your sector.
        </p>

        {!sent ? (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input required type="text" placeholder="Your name" style={inputStyle} />
            <input required type="email" placeholder="Work email" style={inputStyle} />
            <input required type="text" placeholder="Company" style={inputStyle} />
            <textarea placeholder="What are you hiring for?" rows={3} style={{ ...inputStyle, resize: 'none', fontFamily: 'var(--ns-body)' }} />
            <button type="submit" style={{
              marginTop: 4, padding: '16px 22px',
              background: 'var(--ns-yellow)', color: '#000',
              fontFamily: 'var(--ns-display)', fontWeight: 600, fontSize: 13,
              letterSpacing: 0.8, border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 0 40px oklch(0.92 0.18 98 / 0.4)',
            }}>
              REQUEST A DEMO
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </form>
        ) : (
          <div style={{
            padding: '28px 22px',
            border: '1px solid var(--ns-yellow)',
            background: 'oklch(0.92 0.18 98 / 0.06)',
            fontFamily: 'var(--ns-display)', fontSize: 16,
            color: 'var(--ns-white)', lineHeight: 1.4,
            position: 'relative', overflow: 'hidden',
          }}>
            <span style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: 'linear-gradient(115deg, transparent 30%, oklch(0.82 0.18 200 / 0.5) 50%, oklch(0.92 0.18 98 / 0.5) 60%, transparent 80%)',
              animation: 'ns-flash 1100ms ease-out forwards',
            }} />
            <div style={{ fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 2, color: 'var(--ns-yellow)', marginBottom: 8 }}>
              ✓ TRANSMISSION RECEIVED
            </div>
            Thanks. We'll be in touch within one working day.
          </div>
        )}

        <div style={{
          marginTop: 44, paddingTop: 28,
          borderTop: '1px solid oklch(0.85 0.01 95 / 0.1)',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {[
            ['EMAIL', 'contact@neurosight.io', 'mailto:contact@neurosight.io'],
            ['OFFICE', 'Neurosight Ltd\n45-47 Clerkenwell Green\nLondon EC1R 0EB', null],
          ].map(([k, v, href]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <div style={{
                fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 2,
                color: 'oklch(0.92 0.01 95 / 0.7)', minWidth: 52, flexShrink: 0,
              }}>{k}</div>
              {href ? (
                <a href={href} style={{
                  fontFamily: 'var(--ns-display)', fontSize: 15, fontWeight: 500,
                  color: 'var(--ns-white)', textDecoration: 'none',
                  borderBottom: '1px solid oklch(0.85 0.01 95 / 0.25)',
                }}>{v}</a>
              ) : (
                <div style={{
                  fontFamily: 'var(--ns-display)', fontSize: 14, fontWeight: 500,
                  color: 'var(--ns-white)', whiteSpace: 'pre-line', lineHeight: 1.45,
                }}>{v}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const inputStyle = {
  padding: '15px 16px',
  background: 'oklch(0.2 0.01 95 / 0.4)',
  border: '1px solid oklch(0.85 0.01 95 / 0.15)',
  color: 'var(--ns-white)',
  fontFamily: 'var(--ns-body)', fontSize: 15,
  outline: 'none',
  borderRadius: 0,
  WebkitAppearance: 'none',
};

// ────────────────────────────────────────────────
// Footer
// ────────────────────────────────────────────────
const Footer = () => (
  <footer style={{
    padding: '44px 22px 36px',
    borderTop: '1px solid oklch(0.85 0.01 95 / 0.08)',
    display: 'flex', flexDirection: 'column', gap: 24,
  }}>
    <div style={{
      display: 'flex', flexWrap: 'wrap', gap: '10px 18px',
      fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 1.5,
      color: 'oklch(0.92 0.01 95 / 0.72)',
    }}>
      <a href="#" style={footerLink}>PRIVACY</a>
      <a href="#" style={footerLink}>TERMS</a>
      <a href="#" style={footerLink}>SECURITY</a>
      <a href="#" style={footerLink}>LINKEDIN</a>
    </div>
    <div style={{
      fontFamily: 'var(--ns-mono)', fontSize: 9, letterSpacing: 1,
      color: 'oklch(0.92 0.01 95 / 0.55)', lineHeight: 1.6,
    }}>
      © 2026 NEUROSIGHT LTD<br/>
      45-47 CLERKENWELL GREEN, LONDON EC1R 0EB
    </div>
  </footer>
);

const footerLink = {
  color: 'inherit', textDecoration: 'none',
};

// ────────────────────────────────────────────────
// Site root
// ────────────────────────────────────────────────
const NeurosightSite = () => (
  <div style={{
    background: '#000',
    color: 'var(--ns-white)',
    minHeight: '100%',
    fontFamily: 'var(--ns-body)',
  }}>
    <TopNav />
    <Hero />
    <Problem />
    <Solution />
    <Diversity />
    <Compare />
    <Results />
    <CandidateExp />
    <HowItWorks />
    <Contact />
    <Footer />
  </div>
);

Object.assign(window, { NeurosightSite });
