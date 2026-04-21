// Aurora — WebGL fragment shader, cursor-reactive, restrained intensity.
// Full-viewport canvas that mounts behind the hero. Falls back to CSS gradient.

function Aurora({ intensity = 1.0, style = {} }) {
  const canvasRef = React.useRef(null);
  const mouse = React.useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false })
             || canvas.getContext('experimental-webgl');
    if (!gl) return; // fallback to CSS gradient

    const vs = `
      attribute vec2 a_pos;
      void main(){ gl_Position = vec4(a_pos, 0.0, 1.0); }
    `;
    const fs = `
      precision highp float;
      uniform vec2 u_res;
      uniform float u_time;
      uniform vec2 u_mouse;
      uniform float u_intensity;

      // Simplex-ish noise (cheap)
      vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
      vec2 mod289(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
      vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
      float snoise(vec2 v){
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                           -0.577350269189626, 0.024390243902439);
        vec2 i = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0*fract(p*C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314*(a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x*x0.x + h.x*x0.y;
        g.yz = a0.yz*x12.xz + h.yz*x12.yw;
        return 130.0*dot(m, g);
      }

      // Brand palette (approximate oklch → sRGB)
      vec3 cYellow = vec3(0.99, 0.86, 0.22);
      vec3 cCyan   = vec3(0.25, 0.82, 0.96);
      vec3 cPurple = vec3(0.56, 0.32, 0.92);
      vec3 cMagenta= vec3(0.92, 0.30, 0.70);
      vec3 cOrange = vec3(0.98, 0.55, 0.25);

      void main(){
        vec2 uv = gl_FragCoord.xy / u_res.xy;
        vec2 p = uv;
        p.x *= u_res.x / u_res.y;

        float t = u_time * 0.06;

        // cursor warp: subtle, smooth displacement. No singularity at the pointer.
        // Tight radius so it's a local effect, not a screen-wide warp.
        vec2 m = u_mouse;
        m.x *= u_res.x / u_res.y;
        vec2 d = p - m;
        float md = length(d);
        float infl = exp(-md * md * 9.0);           // tight gaussian radius
        vec2 warp = -d * infl * 0.35;

        vec2 q = p + warp;
        float n1 = snoise(q * 1.3 + vec2(t, t*0.7));
        float n2 = snoise(q * 2.1 + vec2(-t*0.8, t*0.5) + n1*0.6);
        float n3 = snoise(q * 0.7 + vec2(t*0.3, -t*0.4));

        // Stratified bands of aurora
        float band = smoothstep(0.1, 0.95, n1*0.6 + n2*0.4);
        float band2= smoothstep(0.2, 0.85, n2*0.5 + n3*0.5);

        // Vertical falloff — aurora mostly in the upper 2/3
        float vfall = smoothstep(1.05, 0.15, uv.y) * 0.9 + 0.1;

        // Base near black
        vec3 col = vec3(0.02, 0.02, 0.03);

        // Three tinted layers blended by noise
        float w1 = band * vfall;
        float w2 = band2 * vfall * 0.9;
        float w3 = smoothstep(0.3, 1.0, n3) * 0.6;

        vec3 mix1 = mix(cPurple, cCyan,    0.5 + 0.5*sin(t*1.6 + n1*2.0));
        vec3 mix2 = mix(cMagenta, cYellow, 0.5 + 0.5*cos(t*1.2 + n2*2.0));
        vec3 mix3 = mix(cOrange, cPurple,  0.5 + 0.5*sin(t*0.8 + n3*1.5));

        col += mix1 * w1 * 0.40;
        col += mix2 * w2 * 0.28;
        col += mix3 * w3 * 0.18;

        // Wispy clouds — soft, slow, low-frequency haze.
        // Two octaves of cheap noise + vertical drift, edged softly so it
        // reads as streaky vapour rather than adding solid bands.
        float ct = u_time * 0.05;
        // Stretched horizontally so the wisps look like streaks, not blobs.
        vec2 cq = vec2(q.x * 0.55, q.y * 1.4);
        cq.x += ct * 1.4;
        cq.y += ct * 0.35;
        float cloudA = snoise(cq);
        float cloudB = snoise(cq * 2.3 + vec2(-ct * 1.6, ct * 0.8) + cloudA * 0.6);
        float cloudC = snoise(cq * 4.5 + vec2(ct * 2.0, -ct * 0.5));
        float cloud  = smoothstep(-0.05, 0.95, cloudA * 0.5 + cloudB * 0.35 + cloudC * 0.15);

        // A second, thinner, slower layer for depth.
        vec2 cq2 = vec2(q.x * 0.3, q.y * 2.2) + vec2(-ct * 2.2, ct * 0.6);
        float cloud2 = smoothstep(0.05, 0.95, snoise(cq2) * 0.55 + snoise(cq2 * 2.1) * 0.45);

        vec3 cloudTint = mix(vec3(0.78, 0.80, 0.92), mix1, 0.25);
        col += cloudTint * cloud  * vfall * 0.22;
        col += cloudTint * cloud2 * vfall * 0.14;

        // Dark, curling "veins" — negative noise carves thin dark streaks so
        // the aurora isn't perfectly smooth. Keeps it from feeling plasticky.
        float vein = smoothstep(0.2, 0.55, abs(snoise(q * 2.8 + vec2(ct * 1.8, -ct * 0.9))));
        col *= mix(0.82, 1.0, vein);

        // Cursor bloom: soft, focused halo — slightly brighter near pointer,
        // tighter radius so it stays a local effect rather than washing the screen.
        float bloom = exp(-md * md * 5.6) * 0.32;
        col += mix1 * bloom;
        // A tiny extra core lift right at the pointer for a hint of extra luminance.
        float core = exp(-md * md * 24.0) * 0.14;
        col += mix(cCyan, cYellow, 0.5) * core;

        // Subtle grain
        float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898,78.233)))*43758.5453);
        col += (g - 0.5) * 0.015;

        // Vignette
        float vig = smoothstep(1.4, 0.2, length((uv-0.5)*vec2(1.3,1.0)));
        col *= 0.6 + 0.4*vig;

        col *= u_intensity;

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compile = (type, src) => {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn('shader err', gl.getShaderInfoLog(sh));
      }
      return sh;
    };
    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uInt = gl.getUniformLocation(prog, 'u_intensity');

    const resize = () => {
      // Render at 0.5× the logical resolution and upscale via CSS.
      // Aurora is a soft, noisy field so the downsample is imperceptible
      // but GPU load drops roughly (0.5)² = 25% of previous cost.
      const scale = 0.5;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * scale;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.current.tx = (e.clientX - r.left) / r.width;
      mouse.current.ty = 1.0 - (e.clientY - r.top) / r.height;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    const start = performance.now();
    let raf;
    let running = true; // set false when off-screen or tab hidden
    const render = (now) => {
      if (!running) { raf = null; return; }

      // ease mouse
      mouse.current.x += (mouse.current.tx - mouse.current.x) * 0.12;
      mouse.current.y += (mouse.current.ty - mouse.current.y) * 0.12;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.current.x, mouse.current.y);
      gl.uniform1f(uInt, intensity);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    // Pause when the canvas scrolls off-screen.
    const io = new IntersectionObserver(([e]) => {
      const onscreen = e.isIntersecting;
      if (onscreen && !running) {
        running = true;
        if (raf == null) raf = requestAnimationFrame(render);
      } else if (!onscreen && running) {
        running = false;
      }
    }, { threshold: 0 });
    io.observe(canvas);

    // Pause when the tab is hidden.
    const onVis = () => {
      if (document.hidden) {
        running = false;
      } else if (!running) {
        running = true;
        if (raf == null) raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      if (raf != null) cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        display: 'block', pointerEvents: 'none',
        // CSS fallback if WebGL fails
        background:
          'radial-gradient(ellipse at 30% 20%, oklch(0.35 0.22 280 / 0.7), transparent 55%),' +
          'radial-gradient(ellipse at 75% 40%, oklch(0.45 0.22 200 / 0.5), transparent 60%),' +
          'radial-gradient(ellipse at 50% 85%, oklch(0.35 0.22 320 / 0.4), transparent 65%),' +
          '#050508',
        ...style,
      }}
    />
  );
}

window.Aurora = Aurora;
