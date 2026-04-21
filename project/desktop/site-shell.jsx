// Desktop site — Neurosight, rebuilt for 1280+ widescreen.
// Composition: centered hero over full-bleed aurora shader, then
// alternating two-column sections (copy ⇄ visual), reworked stats grid,
// diversity, candidate experience, stages, contact. A/B layout via Tweaks.

// Access Tweaks state — kept local so component file is self-sufficient
const useTweaks = () => {
  const [t, setT] = React.useState(window.__nsTweaks || {});
  React.useEffect(() => {
    const h = (e) => { if (e.detail) setT({ ...e.detail }); };
    window.addEventListener('__ns_tweaks', h);
    // also pick up current state on mount in case tweaks loaded after this
    setT({ ...(window.__nsTweaks || {}) });
    return () => window.removeEventListener('__ns_tweaks', h);
  }, []);
  return t;
};

const NS_ACCENTS = {
  magenta: 'oklch(0.72 0.28 8)',
  cyan:    'oklch(0.82 0.18 200)',
  purple:  'oklch(0.78 0.20 320)',
  yellow:  'oklch(0.92 0.18 98)',
};

const MAX_W = 1280;

// ═══════════════════════════════════════════════
// Navigation bar
// ═══════════════════════════════════════════════
const DNav = () => {
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const hideTimerRef = React.useRef(null);
  const navRef = React.useRef(null);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const clearHide = () => {
    if (hideTimerRef.current) { clearTimeout(hideTimerRef.current); hideTimerRef.current = null; }
  };
  const scheduleHide = () => {
    clearHide();
    hideTimerRef.current = setTimeout(() => setMenuOpen(false), 2000);
  };

  const links = [
    ['Problem',   '#problem'],
    ['Insight',   '#insight'],
    ['Diversity', '#diversity'],
    ['Results',   '#results'],
    ['Contact',   '#contact'],
  ];
  return (
    <nav
      ref={navRef}
      onMouseEnter={() => { if (menuOpen) clearHide(); }}
      onMouseLeave={() => { if (menuOpen) scheduleHide(); }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: scrolled ? '8px 28px' : '12px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: menuOpen ? 'oklch(0.04 0.01 280 / 0.72)' : 'transparent',
        backdropFilter: menuOpen ? 'blur(18px) saturate(150%)' : 'none',
        WebkitBackdropFilter: menuOpen ? 'blur(18px) saturate(150%)' : 'none',
        borderBottom: menuOpen ? '1px solid oklch(0.85 0.01 95 / 0.08)' : '1px solid transparent',
        transition: 'padding 280ms, background 280ms, border-color 280ms, backdrop-filter 280ms',
      }}
    >
      {/* LEFT: hamburger + (animated) nav links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <button
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onMouseEnter={() => { clearHide(); setMenuOpen(true); }}
          onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          style={{
            display: 'inline-flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            gap: 5, width: 38, height: 38, padding: 0,
            background: 'transparent', border: 'none',
            cursor: 'pointer',
          }}
        >
          <span style={{
            display: 'block', width: 18, height: 1.5, background: 'var(--ns-white)',
          }} />
          <span style={{
            display: 'block', width: 18, height: 1.5, background: 'var(--ns-white)',
          }} />
          <span style={{
            display: 'block', width: 18, height: 1.5, background: 'var(--ns-white)',
          }} />
        </button>
        <div style={{
          display: 'flex', gap: 4,
          opacity: menuOpen ? 1 : 0,
          transform: menuOpen ? 'translateX(0)' : 'translateX(-10px)',
          pointerEvents: menuOpen ? 'auto' : 'none',
          transition: 'opacity 280ms ease-out, transform 280ms ease-out',
        }}>
          {links.map(([l, h]) => (
            <a key={l} href={h} style={{
              fontFamily: 'var(--ns-mono)', fontSize: 11, letterSpacing: 1.8,
              color: 'oklch(0.92 0.01 95 / 0.72)', textDecoration: 'none',
              padding: '8px 14px', textTransform: 'uppercase',
              transition: 'color 180ms',
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--ns-white)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'oklch(0.92 0.01 95 / 0.72)'}
            >{l}</a>
          ))}
        </div>
      </div>

      {/* RIGHT: spacer (logo intentionally removed) */}
      <div aria-hidden style={{ width: 1, height: 1 }} />
    </nav>
  );
};

// ═══════════════════════════════════════════════
// HERO — full-bleed aurora with centered type
// ═══════════════════════════════════════════════
const DHero = () => {
  const tw = useTweaks();
  const clients = tw.clients || ['Grant Thornton', 'Virgin Media O2', 'Cognizant', 'Worldpay', 'NHS', 'Sellafield', 'Amey', 'Autotrader', 'Forvis Mazars', 'Welsh Water', 'Fieldfisher', 'Merseyrail', 'Womble Bond Dickinson'];
  const [showTrust, setShowTrust] = React.useState(false);
  const [showScroll, setShowScroll] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShowTrust(true), 2600);
    const s = setTimeout(() => setShowScroll(true), 6250);
    const onScroll = () => { if (window.scrollY > 40) setShowScroll(false); };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { clearTimeout(t); clearTimeout(s); window.removeEventListener('scroll', onScroll); };
  }, []);
  const KINDLE_OFFSET = 375;
  const accent = NS_ACCENTS[tw.accent] || NS_ACCENTS.yellow;

  return (
    <section style={{
      position: 'relative', minHeight: '100vh',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
      overflow: 'hidden', padding: '54px 32px 140px',
    }}>
      {/* Aurora shader — full-bleed, cursor reactive */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Aurora intensity={1.0} />
      </div>

      {/* Soft vignette / readability layer */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background:
          'radial-gradient(ellipse 60% 50% at 50% 55%, rgba(0,0,0,0.55), transparent 70%),' +
          'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 20%, transparent 70%, rgba(0,0,0,0.9) 100%)',
      }} />

      {/* Center content */}
      <div style={{
        position: 'relative', zIndex: 2, width: '100%', maxWidth: 1080,
        textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          marginBottom: 36,
          animation: 'ns-brand-fade 900ms ease-out both',
          display: 'inline-flex', justifyContent: 'center',
          filter: 'drop-shadow(0 0 24px oklch(0.92 0.18 98 / 0.35))',
        }}>
          <img
            src={(window.__resources && window.__resources.logoDark) || 'logo-dark.png'}
            alt="Neurosight"
            style={{ height: 58, display: 'block' }}
          />
        </div>

        <h1 style={{
          fontFamily: 'var(--ns-display)',
          fontSize: 'clamp(64px, 9vw, 140px)', lineHeight: 0.94, letterSpacing: -4,
          fontWeight: 500, margin: 0, color: 'var(--ns-white)',
        }}>
          <WordKindle delay={0 + KINDLE_OFFSET} durMs={1268}
            color={`linear-gradient(95deg, ${accent}, oklch(0.78 0.20 320))`}>Faster.</WordKindle>
          <span style={{ color: 'oklch(0.92 0.01 95 / 0.35)' }}> </span>
          <WordKindle delay={810 + KINDLE_OFFSET} durMs={1268}
            color="linear-gradient(95deg, oklch(0.78 0.20 320), oklch(0.82 0.18 200))">Fairer.</WordKindle>
          <br />
          <WordKindle delay={1620 + KINDLE_OFFSET} durMs={1394} color="oklch(0.92 0.18 98)">More accurate.</WordKindle>
        </h1>

        <p style={{
          fontFamily: 'var(--ns-body)', fontSize: 22, lineHeight: 1.45,
          color: 'oklch(0.97 0.01 95 / 0.88)',
          margin: '38px 0 0', maxWidth: 640,
          textWrap: 'pretty',
          textShadow: '0 1px 20px rgba(0,0,0,0.4)',
        }}>
          Online pre-hire assessments that identify genuine talent without bias — in <span style={{ color: 'var(--ns-white)', fontWeight: 500 }}>3 to 5 minutes</span>. Fully resilient to AI.
        </p>

        <div style={{ display: 'flex', gap: 14, marginTop: 44, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#contact" style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '18px 28px',
            background: 'var(--ns-yellow)', color: '#000',
            fontFamily: 'var(--ns-display)', fontWeight: 600, fontSize: 14,
            letterSpacing: 1, textDecoration: 'none',
            boxShadow: '0 0 60px oklch(0.92 0.18 98 / 0.5)',
            transition: 'transform 180ms, box-shadow 180ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 80px oklch(0.92 0.18 98 / 0.65)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 0 60px oklch(0.92 0.18 98 / 0.5)';
          }}
          >
            {tw.ctaLabel || 'BOOK A DEMO'}
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
              <path d="M1 5h12m0 0L9 1m4 4L9 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Scroll cue — sits below the CTA. marginTop clamps down on shorter
            viewports so the arrow never collides with the Trusted By marquee
            pinned at bottom:10vh. Below ~700px tall, stops shrinking. */}
        <div aria-hidden className="ns-scroll-cue" style={{
          marginTop: 'clamp(8px, calc(100vh - 840px), 36px)',
          opacity: showScroll ? 1 : 0,
          transform: `translateY(${showScroll ? 0 : 8}px)`,
          transition: 'opacity 600ms ease-out, transform 600ms cubic-bezier(.2,.8,.2,1)',
          pointerEvents: 'none',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        }}>
          <span style={{
            fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 3,
            color: 'var(--ns-yellow)', textTransform: 'uppercase', fontWeight: 700,
          }}>SCROLL</span>
          <svg width="22" height="28" viewBox="0 0 22 28" fill="none" style={{ animation: 'ns-scroll-bob 1.6s ease-in-out infinite' }}>
            <path d="M11 2v22m0 0l-8-8m8 8l8-8" stroke="var(--ns-yellow)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Trusted by — absolutely pinned near the bottom of the hero. */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: '10vh', zIndex: 2,
        padding: 0,
        opacity: showTrust ? 1 : 0,
        transform: showTrust ? 'translateY(0)' : 'translateY(12px)',
        transition: 'opacity 800ms ease-out, transform 800ms cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{
          textAlign: 'center',
          fontFamily: 'var(--ns-mono)', fontSize: 13, letterSpacing: 3,
          color: 'oklch(0.82 0.18 200 / 0.85)', marginBottom: 18, fontWeight: 700,
        }}>TRUSTED BY</div>
        <DClientsMarquee clients={clients} />
      </div>
    </section>
  );
};

// Single-row desktop marquee with many logos, wide masks.
const DClientsMarquee = ({ clients }) => {
  const dots = ['oklch(0.82 0.18 200)', 'oklch(0.78 0.20 320)', 'oklch(0.92 0.18 98)', 'oklch(0.72 0.26 8)'];
  const doubled = [...clients, ...clients, ...clients];
  return (
    <div
      onMouseEnter={e => e.currentTarget.classList.add('paused')}
      onMouseLeave={e => e.currentTarget.classList.remove('paused')}
      style={{
        position: 'relative', overflow: 'hidden',
        maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div className="ns-marquee-track" style={{
        display: 'inline-flex', whiteSpace: 'nowrap', gap: 14,
        animation: 'ns-marquee 80s linear infinite',
        willChange: 'transform',
      }}>
        {doubled.map((c, i) => (
          <span key={`${c}-${i}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '9px 16px',
            border: '1px solid oklch(0.85 0.01 95 / 0.14)',
            background: 'oklch(0.06 0.01 280 / 0.55)',
            backdropFilter: 'blur(8px)',
            fontFamily: 'var(--ns-display)', fontSize: 14, fontWeight: 500,
            letterSpacing: 0.3,
            color: 'oklch(0.97 0.01 95 / 0.9)',
            flexShrink: 0,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: dots[i % dots.length],
              boxShadow: `0 0 10px ${dots[i % dots.length]}`,
            }} />
            {c}
          </span>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════
// Shared section scaffolding
// ═══════════════════════════════════════════════
const DSectionHeader = ({ n, label, color = 'var(--ns-cyan)' }) => (
  <div style={{
    fontFamily: 'var(--ns-mono)', fontSize: 12, letterSpacing: 3,
    color, marginBottom: 28, fontWeight: 700,
  }}>
    {label}
  </div>
);

// Two-column section helper. `flip` puts visual on the left.
const DTwoCol = ({ id, flip, left, right, dividerTop = true, bg }) => (
  <section id={id} style={{
    position: 'relative',
    padding: '140px 32px',
    borderTop: dividerTop ? '1px solid oklch(0.85 0.01 95 / 0.08)' : 'none',
    background: bg || 'transparent',
    overflow: 'hidden',
  }}>
    <div style={{
      maxWidth: MAX_W, margin: '0 auto',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80,
      alignItems: 'stretch',
    }}>
      <div style={{ order: flip ? 2 : 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>{left}</div>
      <div style={{ order: flip ? 1 : 2, minWidth: 0, display: 'flex', flexDirection: 'column' }}>{right}</div>
    </div>
  </section>
);

Object.assign(window, { DNav, DHero, DSectionHeader, DTwoCol, NS_ACCENTS, MAX_W });
