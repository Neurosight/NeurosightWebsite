import React from 'react';
import ReactDOM from 'react-dom/client';

import { NeurosightSite } from '../site.jsx';
import { DNav, DHero, DBookCTA } from '../desktop/site-shell.jsx';
import { DProblem, DInsight, DDiversity, DCompare } from '../desktop/sections-a.jsx';
import { DResults, DCandidateExp, DProcess, DContact, DFooter } from '../desktop/sections-b.jsx';

// ═══════════════════════════════════════════════════════════
// Tweaks: editable defaults (shared across mobile + desktop)
// ═══════════════════════════════════════════════════════════
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "clients": [
    "Grant Thornton",
    "Virgin Media O2",
    "Cognizant",
    "Worldpay",
    "NHS",
    "Sellafield",
    "Amey",
    "Autotrader Group",
    "Nuclear Decommissioning Authority",
    "Forvis Mazars",
    "Welsh Water",
    "Fieldfisher",
    "Merseyrail",
    "Womble Bond Dickinson",
    "DLA Piper",
    "UK National Nuclear Laboratory",
    "VWV",
    "HCR"
  ],
  "heroEyebrow": "NEXT-GEN PRE-HIRE ASSESSMENT",
  "ctaLabel": "BOOK A DEMO",
  "accent": "yellow",
  "layout": "A"
}/*EDITMODE-END*/;

window.__nsTweaks = { ...TWEAK_DEFAULTS };
function applyTweaks(t) {
  window.__nsTweaks = { ...window.__nsTweaks, ...t };
  window.dispatchEvent(new CustomEvent('__ns_tweaks', { detail: window.__nsTweaks }));
}
applyTweaks(TWEAK_DEFAULTS);

// ═══════════════════════════════════════════════════════════
// Viewport hook — swap between mobile + desktop trees
// ═══════════════════════════════════════════════════════════
const useIsDesktop = () => {
  const getValue = () => typeof window !== 'undefined' && window.matchMedia('(min-width: 900px)').matches;
  const [isDesktop, setIsDesktop] = React.useState(getValue);
  React.useEffect(() => {
    const mql = window.matchMedia('(min-width: 900px)');
    const h = () => setIsDesktop(mql.matches);
    mql.addEventListener ? mql.addEventListener('change', h) : mql.addListener(h);
    return () => {
      mql.removeEventListener ? mql.removeEventListener('change', h) : mql.removeListener(h);
    };
  }, []);
  return isDesktop;
};

// ═══════════════════════════════════════════════════════════
// Tweaks panel (shared UI)
// ═══════════════════════════════════════════════════════════
const lbl = {
  fontFamily: 'JetBrains Mono, monospace', fontSize: 9, letterSpacing: 1.5,
  color: 'oklch(0.85 0.01 95 / 0.6)', textTransform: 'uppercase', display: 'block',
};
const inp = {
  width: '100%', padding: '9px 11px', marginTop: 6,
  background: 'oklch(0.18 0.01 280 / 0.7)', border: '1px solid oklch(0.85 0.01 95 / 0.15)',
  color: 'oklch(0.97 0.008 95)', fontFamily: 'Inter, system-ui', fontSize: 12,
  outline: 'none', borderRadius: 0, boxSizing: 'border-box',
};
const rmBtn = {
  width: 28, height: 28, flexShrink: 0,
  background: 'transparent', border: '1px solid oklch(0.72 0.26 8 / 0.5)',
  color: 'oklch(0.72 0.26 8)', cursor: 'pointer', fontSize: 16, lineHeight: 1,
  fontFamily: 'system-ui', borderRadius: 0,
};
const addBtn = {
  padding: '0 12px', height: 32,
  background: 'oklch(0.92 0.18 98)', border: 'none', color: '#000',
  fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: 1.5,
  cursor: 'pointer', borderRadius: 0, fontWeight: 600,
};

const TweaksPanel = ({ visible, state, setState, isDesktop }) => {
  if (!visible) return null;
  const [newClient, setNewClient] = React.useState('');
  const update = (patch) => {
    const next = { ...state, ...patch };
    setState(next);
    applyTweaks(patch);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };
  const addClient = () => {
    const v = newClient.trim();
    if (!v) return;
    update({ clients: [...state.clients, v] });
    setNewClient('');
  };
  const removeClient = (i) => {
    const next = state.clients.slice();
    next.splice(i, 1);
    update({ clients: next });
  };
  return (
    <div style={{
      position: 'fixed', right: 24, bottom: 24, width: 320, maxHeight: '80vh',
      background: 'oklch(0.06 0.02 280 / 0.95)', backdropFilter: 'blur(18px)',
      border: '1px solid oklch(0.92 0.18 98 / 0.4)',
      boxShadow: '0 0 50px oklch(0.92 0.18 98 / 0.2), 0 20px 40px rgba(0,0,0,0.5)',
      color: 'var(--ns-white)', fontFamily: 'var(--ns-body)',
      zIndex: 10000, overflow: 'auto',
    }}>
      <div style={{
        padding: '14px 18px', borderBottom: '1px solid oklch(0.85 0.01 95 / 0.15)',
        fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 2,
        color: 'var(--ns-yellow)', fontWeight: 700,
        position: 'sticky', top: 0, background: 'oklch(0.06 0.02 280 / 0.95)', zIndex: 2,
      }}>[ TWEAKS ] · {isDesktop ? 'DESKTOP' : 'MOBILE'}</div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {isDesktop && (
          <div>
            <label style={lbl}>Layout variant</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {[['A', 'Classic'], ['B', 'Centered']].map(([k, l]) => (
                <button key={k} onClick={() => update({ layout: k })} style={{
                  flex: 1, padding: '10px 0',
                  border: state.layout === k ? '1.5px solid var(--ns-yellow)' : '1px solid oklch(0.85 0.01 95 / 0.2)',
                  background: state.layout === k ? 'oklch(0.92 0.18 98 / 0.12)' : 'transparent',
                  color: state.layout === k ? 'var(--ns-yellow)' : 'var(--ns-white)',
                  fontFamily: 'var(--ns-mono)', fontSize: 10, letterSpacing: 1.5,
                  cursor: 'pointer', borderRadius: 0, fontWeight: 700,
                }}>{k} · {l.toUpperCase()}</button>
              ))}
            </div>
          </div>
        )}
        <div>
          <label style={lbl}>Hero eyebrow</label>
          <input value={state.heroEyebrow} onChange={(e) => update({ heroEyebrow: e.target.value })} style={inp} />
        </div>
        <div>
          <label style={lbl}>Primary CTA label</label>
          <input value={state.ctaLabel} onChange={(e) => update({ ctaLabel: e.target.value })} style={inp} />
        </div>
        <div>
          <label style={lbl}>Accent tint</label>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            {[
              ['magenta', 'oklch(0.72 0.28 8)'],
              ['cyan',    'oklch(0.82 0.18 200)'],
              ['purple',  'oklch(0.78 0.20 320)'],
              ['yellow',  'oklch(0.92 0.18 98)'],
            ].map(([k, c]) => (
              <button key={k} onClick={() => update({ accent: k })} style={{
                flex: 1, height: 30,
                border: state.accent === k ? '1.5px solid var(--ns-white)' : '1px solid oklch(0.85 0.01 95 / 0.2)',
                background: c, cursor: 'pointer', borderRadius: 0,
              }} title={k} />
            ))}
          </div>
        </div>
        <div>
          <label style={lbl}>Trusted-by clients ({state.clients.length})</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6, maxHeight: 220, overflow: 'auto' }}>
            {state.clients.map((c, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <input value={c} onChange={(e) => {
                  const next = state.clients.slice();
                  next[i] = e.target.value;
                  update({ clients: next });
                }} style={{ ...inp, flex: 1 }} />
                <button onClick={() => removeClient(i)} style={rmBtn} title="remove">×</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
            <input placeholder="Add client…" value={newClient}
              onChange={(e) => setNewClient(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addClient(); }}
              style={{ ...inp, flex: 1 }} />
            <button onClick={addClient} style={addBtn}>+ ADD</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// Mobile scroll hint
// ═══════════════════════════════════════════════════════════
const ScrollHint = ({ containerRef }) => {
  const [show, setShow] = React.useState(false);
  const dismissed = React.useRef(false);
  React.useEffect(() => {
    const t = setTimeout(() => { if (!dismissed.current) setShow(true); }, 5000);
    return () => clearTimeout(t);
  }, []);
  React.useEffect(() => {
    const el = containerRef?.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop > 10) {
        dismissed.current = true;
        setShow(false);
        el.removeEventListener('scroll', onScroll);
      }
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [containerRef]);
  return (
    <div aria-hidden style={{
      position: 'absolute', left: 0, right: 0, bottom: 18,
      display: 'flex', justifyContent: 'center', pointerEvents: 'none',
      zIndex: 45,
      opacity: show ? 1 : 0,
      transition: 'opacity 600ms ease-out',
    }}>
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        animation: show ? 'ns-bob 1.4s ease-in-out infinite' : 'none',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 11, letterSpacing: 2.5, fontWeight: 700,
        color: 'oklch(0.92 0.18 98)',
        textShadow: '0 0 10px oklch(0.92 0.18 98 / 0.7)',
      }}>
        <span>SCROLL</span>
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none" style={{
          filter: 'drop-shadow(0 0 8px oklch(0.92 0.18 98 / 0.8))',
        }}>
          <path d="M1 1l10 10L21 1" stroke="oklch(0.92 0.18 98)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// Mobile tree — full-viewport, single scroll container
// ═══════════════════════════════════════════════════════════
const MobileApp = () => {
  const scrollRef = React.useRef(null);
  React.useLayoutEffect(() => { window.__nsScrollRoot = scrollRef.current; }, []);
  return (
    <div style={{ position: 'fixed', inset: 0, background: '#000', overflow: 'hidden' }}>
      <div ref={scrollRef} className="phone-scroll" style={{
        position: 'absolute', inset: 0, background: '#000',
        overflowY: 'auto', overflowX: 'hidden',
        WebkitOverflowScrolling: 'touch',
      }}>
        <NeurosightSite />
      </div>
      <ScrollHint containerRef={scrollRef} />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
// Desktop tree — regular page flow
// ═══════════════════════════════════════════════════════════
const DesktopApp = ({ tweaks }) => {
  const layout = tweaks.layout || 'A';
  return (
    <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
      <DNav />
      <DBookCTA />
      <DHero />
      {layout === 'A' ? (
        <>
          <DProblem />
          <DInsight />
          <DDiversity />
          <DCompare />
        </>
      ) : (
        <div className="layout-b">
          <DProblem />
          <DInsight />
          <DDiversity />
          <DCompare />
        </div>
      )}
      <DResults />
      <DCandidateExp />
      <DProcess />
      <DContact />
      <DFooter />
    </div>
  );
};

// Layout B flip rule (injected once)
(function() {
  if (document.getElementById('ns-layout-b-css')) return;
  const s = document.createElement('style');
  s.id = 'ns-layout-b-css';
  s.textContent = `
    .layout-b section > div > div:first-child { order: 2 !important; }
    .layout-b section > div > div:last-child  { order: 1 !important; }
  `;
  document.head.appendChild(s);
})();

// ═══════════════════════════════════════════════════════════
// App root
// ═══════════════════════════════════════════════════════════
const App = () => {
  const [editing, setEditing] = React.useState(false);
  const [state, setState] = React.useState(TWEAK_DEFAULTS);
  const [tweaks, setTweaks] = React.useState(window.__nsTweaks);
  const isDesktop = useIsDesktop();

  // Listen for tweak changes so DesktopApp re-renders on layout switch etc.
  React.useEffect(() => {
    const h = (e) => { if (e.detail) setTweaks({ ...e.detail }); };
    window.addEventListener('__ns_tweaks', h);
    return () => window.removeEventListener('__ns_tweaks', h);
  }, []);

  // Edit-mode plumbing
  React.useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || !e.data.type) return;
      if (e.data.type === '__activate_edit_mode') setEditing(true);
      else if (e.data.type === '__deactivate_edit_mode') setEditing(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  return (
    <>
      {isDesktop ? <DesktopApp tweaks={tweaks} /> : <MobileApp />}
      <TweaksPanel visible={editing} state={state} setState={setState} isDesktop={isDesktop} />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
