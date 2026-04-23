// Desktop site — Neurosight, rebuilt for 1280+ widescreen.
// Composition: centered hero over full-bleed aurora shader, then
// alternating two-column sections (copy ⇄ visual), reworked stats grid,
// diversity, candidate experience, stages, contact. A/B layout via Tweaks.
import React from 'react';
import { Aurora } from './aurora.jsx';
import { WordKindle } from '../animations.jsx';

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

export const NS_ACCENTS = {
  magenta: 'oklch(0.72 0.28 8)',
  cyan:    'oklch(0.82 0.18 200)',
  purple:  'oklch(0.78 0.20 320)',
  yellow:  'oklch(0.92 0.18 98)',
};

export const MAX_W = 1280;

// ═══════════════════════════════════════════════
// Navigation bar
// ═══════════════════════════════════════════════
export const DNav = () => {
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
// Book a Demo — compact pill pinned to the top-right corner,
// top-aligned with the hamburger lines. Fades out on scroll.
// ═══════════════════════════════════════════════
export const DBookCTA = () => {
  const tw = useTweaks();
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => { if (window.scrollY > 320) setScrolled(true); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const label = tw.ctaLabel || 'BOOK A DEMO';

  return (
    <a href="#contact" style={{
      position: 'fixed', top: 24, right: 28, zIndex: 102,
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '8px 14px',
      background: 'var(--ns-yellow)', color: '#000',
      fontFamily: 'var(--ns-display)', fontWeight: 600,
      fontSize: 11, letterSpacing: 0.8,
      textDecoration: 'none',
      boxShadow: '0 0 28px oklch(0.92 0.18 98 / 0.35)',
      opacity: scrolled ? 0 : 1,
      transform: scrolled ? 'translateY(-8px)' : 'translateY(0)',
      pointerEvents: scrolled ? 'none' : 'auto',
      transition: 'opacity 420ms ease, transform 420ms cubic-bezier(.2,.8,.2,1), box-shadow 200ms',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 6px 48px oklch(0.92 0.18 98 / 0.55)'; }}
    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 0 28px oklch(0.92 0.18 98 / 0.35)'; }}
    >
      {label}
      <svg width="10" height="12" viewBox="0 0 10 14" fill="none" style={{ flexShrink: 0 }}>
        <path d="M5 1v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </a>
  );
};

// ═══════════════════════════════════════════════
// HERO — full-bleed aurora with centered type
// ═══════════════════════════════════════════════
export const DHero = () => {
  const tw = useTweaks();
  const clients = tw.clients || ['Grant Thornton', 'Virgin Media O2', 'Cognizant', 'Worldpay', 'NHS', 'Sellafield', 'Amey', 'Autotrader', 'Forvis Mazars', 'Welsh Water', 'Fieldfisher', 'Merseyrail', 'Womble Bond Dickinson'];
  const [showTrust, setShowTrust] = React.useState(false);
  const [showScroll, setShowScroll] = React.useState(false);
  const [scrollTop, setScrollTop] = React.useState(null);
  const anchorRef = React.useRef(null);
  const trustRef = React.useRef(null);
  const sectionRef = React.useRef(null);
  const [minH, setMinH] = React.useState('100vh');
  const [trustBottom, setTrustBottom] = React.useState(null);
  const [scrollBottom, setScrollBottom] = React.useState(null);
  React.useEffect(() => {
    const measure = () => {
      const anchor = anchorRef.current, trust = trustRef.current, sec = sectionRef.current;
      if (!anchor || !trust || !sec) return;
      const secR = sec.getBoundingClientRect();
      const anchorR = anchor.getBoundingClientRect();
      const trustH = trust.offsetHeight;
      const winH = window.innerHeight;
      const anchorBottomInSec = anchorR.bottom - secR.top;
      const spaceBelowAnchor = winH - anchorBottomInSec;
      const idealGap = (spaceBelowAnchor - trustH) / 2;
      if (idealGap >= 18) {
        setMinH('100vh');
        setTrustBottom(idealGap);
        setScrollBottom(Math.max(2, idealGap / 2 - 6));
      } else {
        const padBelow = 24;
        const needed = anchorBottomInSec + 18 + trustH + padBelow;
        setMinH(`${Math.ceil(Math.max(winH, needed))}px`);
        setTrustBottom(padBelow);
        setScrollBottom(Math.max(4, padBelow / 2 - 8));
      }
      const trustTop = anchorBottomInSec + Math.max(18, idealGap);
      const mid = (anchorBottomInSec + trustTop) / 2;
      setScrollTop(mid);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (sectionRef.current) ro.observe(sectionRef.current);
    window.addEventListener('resize', measure);
    const id = setTimeout(measure, 100);
    const id2 = setTimeout(measure, 2700); // after trust fades in
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); clearTimeout(id); clearTimeout(id2); };
  }, []);
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
    <section ref={sectionRef} style={{
      position: 'relative', minHeight: minH,
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center',
      overflow: 'hidden', padding: '54px 32px 140px',
    }}>
      {/* Aurora shader — full-bleed, cursor reactive */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        <Aurora intensity={1.05} />
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
          marginBottom: 30,
          animation: 'ns-brand-fade 900ms ease-out both',
          display: 'inline-flex', justifyContent: 'center',
          filter: 'drop-shadow(0 0 24px oklch(0.92 0.18 98 / 0.35))',
        }}>
          <img
            src={(window.__resources && window.__resources.logoDark) || '/logo-dark.png'}
            alt="Neurosight"
            style={{ height: 58, display: 'block' }}
          />
        </div>

        <h1 style={{
          fontFamily: 'var(--ns-display)',
          fontSize: 'clamp(56px, min(9vw, 13.5vh), 140px)', lineHeight: 0.94, letterSpacing: -4,
          fontWeight: 500, margin: 0, color: 'var(--ns-white)',
          filter: 'drop-shadow(0 2px 30px rgba(0,0,0,0.55))',
        }}>
          <WordKindle delay={0 + KINDLE_OFFSET} durMs={1268}
            color={`linear-gradient(95deg, oklch(0.92 0.20 200), oklch(0.88 0.24 320))`}>Faster.</WordKindle>
          <span style={{ color: 'oklch(0.92 0.01 95 / 0.35)' }}> </span>
          <WordKindle delay={810 + KINDLE_OFFSET} durMs={1268}
            color="linear-gradient(95deg, oklch(0.88 0.24 320), oklch(0.92 0.20 200))">Fairer.</WordKindle>
          <br />
          <WordKindle delay={1620 + KINDLE_OFFSET} durMs={1394} color="oklch(0.96 0.20 98)">More accurate.</WordKindle>
        </h1>

        <p ref={anchorRef} style={{
          fontFamily: 'var(--ns-body)', fontSize: 'clamp(16px, min(1.7vw, 2.25vh), 22px)', lineHeight: 1.45,
          color: 'oklch(0.97 0.01 95 / 0.88)',
          margin: '30px 0 0', maxWidth: 640,
          textWrap: 'pretty',
          textShadow: '0 1px 20px rgba(0,0,0,0.4)',
        }}>
          Online pre-hire assessments that identify genuine talent<br />without bias — in <span style={{ color: 'var(--ns-white)', fontWeight: 500 }}>3 to 5 minutes</span>. Fully resilient to AI.
        </p>

      </div>

      {/* Scroll cue — inline pill sitting midway between Trusted By and window bottom */}
      <div aria-hidden className="ns-scroll-cue" style={{
        position: 'absolute', left: 0, right: 0,
        bottom: scrollBottom != null ? scrollBottom : '1.5vh',
        zIndex: 2,
        opacity: showScroll && scrollBottom != null ? 1 : 0,
        transform: `translateY(${showScroll ? 0 : 6}px)`,
        transition: 'opacity 600ms ease-out, transform 600ms cubic-bezier(.2,.8,.2,1)',
        pointerEvents: 'none',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 14,
          fontFamily: 'var(--ns-mono)', fontSize: 12, letterSpacing: 3,
          color: 'var(--ns-yellow)', textTransform: 'uppercase', fontWeight: 700,
        }}>
          <div style={{ display: 'inline-flex', gap: 4, animation: 'ns-scroll-bob 1.6s ease-in-out infinite' }}>
            <svg width="22" height="8" viewBox="0 0 22 8" fill="none">
              <path d="M2 2l9 4 9-4" stroke="var(--ns-yellow)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
            </svg>
            <svg width="22" height="8" viewBox="0 0 22 8" fill="none">
              <path d="M2 2l9 4 9-4" stroke="var(--ns-yellow)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span>SCROLL</span>
          <div style={{ display: 'inline-flex', gap: 4, animation: 'ns-scroll-bob 1.6s ease-in-out infinite' }}>
            <svg width="22" height="8" viewBox="0 0 22 8" fill="none">
              <path d="M2 2l9 4 9-4" stroke="var(--ns-yellow)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <svg width="22" height="8" viewBox="0 0 22 8" fill="none">
              <path d="M2 2l9 4 9-4" stroke="var(--ns-yellow)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Trusted by — absolutely pinned; vertically centered between CTA and window bottom on tall viewports. */}
      <div ref={trustRef} style={{
        position: 'absolute', left: 0, right: 0,
        bottom: trustBottom != null ? trustBottom : '5vh',
        zIndex: 2,
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

// Dual-row desktop marquee — two lines in opposite directions, larger chips.
const DClientsMarquee = ({ clients }) => {
  const dots = ['oklch(0.82 0.18 200)', 'oklch(0.78 0.20 320)', 'oklch(0.92 0.18 98)', 'oklch(0.72 0.26 8)'];
  // Split clients into two lines so each row has distinct logos.
  const mid = Math.ceil(clients.length / 2);
  const rowA = clients.slice(0, mid);
  const rowB = clients.slice(mid);
  const doubledA = [...rowA, ...rowA, ...rowA];
  const doubledB = [...rowB, ...rowB, ...rowB];

  const chip = (c, i) => (
    <span key={`${c}-${i}`} style={{
      display: 'inline-flex', alignItems: 'center', gap: 9,
      padding: '9px 16px',
      border: '1px solid oklch(0.85 0.01 95 / 0.14)',
      background: 'oklch(0.06 0.01 280 / 0.55)',
      backdropFilter: 'blur(8px)',
      fontFamily: 'var(--ns-display)', fontSize: 13, fontWeight: 500,
      letterSpacing: 0.3,
      color: 'oklch(0.97 0.01 95 / 0.92)',
      flexShrink: 0,
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: '50%',
        background: dots[i % dots.length],
        boxShadow: `0 0 8px ${dots[i % dots.length]}`,
      }} />
      {c}
    </span>
  );

  const row = (items, reverse) => (
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
        display: 'inline-flex', whiteSpace: 'nowrap', gap: 24,
        animation: `ns-marquee 90s linear infinite ${reverse ? 'reverse' : ''}`,
        willChange: 'transform',
      }}>
        {items.map(chip)}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {row(doubledA, false)}
      {row(doubledB, true)}
    </div>
  );
};

// ═══════════════════════════════════════════════
// Shared section scaffolding
// ═══════════════════════════════════════════════
export const DSectionHeader = ({ n, label, color = 'var(--ns-cyan)' }) => (
  <div style={{
    fontFamily: 'var(--ns-mono)', fontSize: 12, letterSpacing: 3,
    color, marginBottom: 28, fontWeight: 700,
  }}>
    {label}
  </div>
);

// Two-column section helper. `flip` puts visual on the left.
export const DTwoCol = ({ id, flip, left, right, dividerTop = true, bg }) => (
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

