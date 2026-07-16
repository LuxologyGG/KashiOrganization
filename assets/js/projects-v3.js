/* =============================================================
   KASHI ORGANIZATION - projects.html signature
   Cinematic horizontal-scroll reel of all projects.
   - Builds panels from window.KASHI.projects (app.js renderProjects
     targets the removed grid, so we own this section).
   - Desktop (>=992px): pin + horizontal scrub via ScrollTrigger.
   - Reduced motion on desktop: native horizontal scroll (no pin).
   - Tablet / mobile: CSS vertical stack (no JS transform, no trap).
   ============================================================= */
(function () {
  "use strict";

  var mount = document.querySelector("[data-reel-track]");
  if (!mount) return;

  var K = window.KASHI || {};
  var projects = (K.projects || []).filter(Boolean);
  if (!projects.length) return;

  var IMG = function (name) { return "assets/img/projects/" + name + ".jpg"; };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  var pad = function (n) { return String(n).padStart(2, "0"); };
  var total = projects.length;

  /* ---------------- Hero film-strip (image-forward masthead) ---------------- */
  var strip = document.querySelector("[data-proj-strip]");
  if (strip) {
    var cells = projects.map(function (p) {
      return '<span class="pj-strip__cell"><img src="' + esc(IMG(p.cover)) + '" alt="" loading="lazy" decoding="async"></span>';
    }).join("");
    strip.innerHTML = cells + cells; // duplicate for a seamless loop
  }

  /* ---------------- Pixel shoreline wave (hero background) ----------------
     A chunky golden-hour pixel ocean rendered on a 2D canvas. The waterline
     undulates with a few travelling sines and slowly washes up and down (tide),
     so the whole field of pixels rises over and recedes from the scrolling
     film-strip beneath it. Translucent below the crest, so the photos read as
     though they are submerged within the surf. */
  (function initWave() {
    var cv = document.querySelector("[data-pj-wave]");
    if (!cv) return;
    var host = cv.closest(".pj-hero") || cv.parentNode;
    var ctx = cv.getContext("2d");
    if (!ctx) return;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var CELL = 15;                 // chunky pixel size (css px)
    var W = 0, H = 0, cols = 0, rows = 0, noise = null;

    // golden-hour shoreline palette (brand tokens): deep ink water -> bronze ->
    // gold -> warm crest -> bone spray.
    var DEEP  = [15, 14, 11];
    var MID   = [78, 57, 29];
    var SHAL  = [161, 124, 69];
    var CREST = [214, 178, 112];
    var FOAM  = [239, 233, 221];
    function mix(a, b, t) {
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    }

    // ---- Pixel-art beach props (drawn on the same chunky grid) ----
    // Chars map to colours; '.' is transparent. These rest at the tideline so
    // the moving waterline visibly covers and reveals them -> reads as a beach.
    var INK = [20, 18, 14];  // keyline outline, near --ink
    var SPAL = {
      o: [173, 132, 72],   // umbrella gold stripe (--gold)
      x: [239, 233, 221],  // umbrella cream stripe (--paper)
      p: [120, 90, 42],    // pole / finial (--gold-deep)
      s: [227, 138, 78],   // starfish coral (pops against the gold surf)
      S: [190, 104, 58],   // starfish shade
      c: [237, 229, 216],  // shell bone
      C: [201, 176, 148],  // shell shade
      d: [224, 176, 162]   // shell blush
    };
    var UMBRELLA = ["....p....", "...oxo...", "..xoxox..", ".oxoxoxo.", "xoxoxoxox",
                    "....p....", "....p....", "....p....", "....p....", "....p....", "...ppp..."];
    var STARFISH = ["...s...", "..sss..", "s.sss.s", "sssssss", ".sSSSs.", ".ss.ss.", ".s...s."];
    var SCALLOP  = ["..ccc..", ".ccccc.", "ccccccc", "cCcCcCc", ".c.c.c."];
    var SPIRAL   = [".ccc..", "cddcc.", "cdCdc.", "cddc..", ".cc...", "..c..."];
    var CLAM     = [".ccc.", "ccccc", "cCcCc", ".c.c."];
    var SP = 15, objects = [];

    function drawCell(x, y, rgb, a, sz) {
      ctx.globalAlpha = a;
      ctx.fillStyle = "rgb(" + (rgb[0] | 0) + "," + (rgb[1] | 0) + "," + (rgb[2] | 0) + ")";
      ctx.fillRect(x, y, sz - 0.6, sz - 0.6);         // hair gap -> pixel-grid read
    }

    function size() {
      W = host.clientWidth;
      H = host.clientHeight;
      if (!W || !H) return;
      cv.width = W; cv.height = H;               // dpr 1 -> naturally chunky + cheap
      cols = Math.ceil(W / CELL) + 1;
      rows = Math.ceil(H / CELL) + 1;
      noise = new Float32Array(cols * rows);     // static per-cell grain for foam
      for (var i = 0; i < noise.length; i++) noise[i] = Math.random();

      // place the beach props along the tideline (fx = centre, fy = base, of W/H)
      SP = W < 640 ? 10 : (W < 1024 ? 13 : 16);
      var pool = W < 640
        ? [{ s: UMBRELLA, fx: 0.70, fy: 0.79 }, { s: STARFISH, fx: 0.26, fy: 0.83 }, { s: SCALLOP, fx: 0.52, fy: 0.855 }]
        : [{ s: UMBRELLA, fx: 0.71, fy: 0.785 }, { s: STARFISH, fx: 0.205, fy: 0.805 },
           { s: SCALLOP, fx: 0.375, fy: 0.83 }, { s: SPIRAL, fx: 0.86, fy: 0.82 }, { s: CLAM, fx: 0.53, fy: 0.84 }];
      objects = pool.map(function (o) {
        var rws = o.s.length, cls = o.s[0].length;
        return { s: o.s, left: Math.round(o.fx * W - cls * SP / 2), top: Math.round(o.fy * H - rws * SP) };
      });
    }

    // waterline y for a given column centre (lower value = higher up the page)
    function levelAt(cx, t) {
      var base = H * 0.75;
      var tide = Math.sin(t * 0.0004) * H * 0.05;                     // wash up/down (~16s)
      var w1 = Math.sin(cx * 0.017 + t * 0.0015) * CELL * 1.1;
      var w2 = Math.sin(cx * 0.006 - t * 0.0009 + 1.3) * CELL * 1.6;
      var w3 = Math.sin(cx * 0.034 + t * 0.0022) * CELL * 0.6;
      return base + tide + w1 + w2 + w3;
    }

    function paint(x, y, rgb, a) { drawCell(x, y, rgb, a, CELL); }

    // Beach props: a dark keyline lifts each prop off the busy surf; emerged
    // pixels stay bright/dry, and pixels below the local waterline blend toward
    // the shallows so the tide reads as washing over them.
    function drawSprites(t) {
      for (var i = 0; i < objects.length; i++) {
        var o = objects[i], sp = o.s, r, c, rowStr, ch, px, py, line, sub;
        // pass 1: dilated dark silhouette -> a clean "sticker" outline that
        // fades as the pixel goes underwater, so submerged props dissolve
        for (r = 0; r < sp.length; r++) {
          rowStr = sp[r];
          for (c = 0; c < rowStr.length; c++) {
            if (!SPAL[rowStr.charAt(c)]) continue;
            px = o.left + c * SP; py = o.top + r * SP;
            sub = (py + SP * 0.5) - levelAt(px + SP * 0.5, t);
            drawCell(px - 2, py - 2, INK, sub < 0 ? 0.9 : Math.max(0.32, 0.9 - sub / (SP * 3.5)), SP + 3);
          }
        }
        // pass 2: colour, washed by the tide
        for (r = 0; r < sp.length; r++) {
          rowStr = sp[r];
          for (c = 0; c < rowStr.length; c++) {
            ch = rowStr.charAt(c);
            var col = SPAL[ch];
            if (!col) continue;
            px = o.left + c * SP; py = o.top + r * SP;
            sub = (py + SP * 0.5) - levelAt(px + SP * 0.5, t);   // >0 underwater
            if (sub < 0) {
              drawCell(px, py, col, 1, SP - 1.2);            // dry / above the surf
            } else {
              var wet = Math.min(0.6, sub / (SP * 4));        // deeper -> more washed out
              drawCell(px, py, mix(col, SHAL, 0.3 + wet), 0.86, SP - 1.2);
              if (sub < SP * 1.2) drawCell(px, py, FOAM, 0.26, SP - 1.2); // foam at the wash line
            }
          }
        }
      }
    }

    function frame(t) {
      if (!W || !H) return;
      ctx.clearRect(0, 0, W, H);
      for (var c = 0; c < cols; c++) {
        var cx = c * CELL;
        var line = levelAt(cx + CELL * 0.5, t);
        for (var r = 0; r < rows; r++) {
          var cy = r * CELL;
          var nz = noise[c * rows + r];
          var depth = (cy + CELL) - line;            // >0 underwater
          if (depth <= 0) {
            // above the surf: sparse spray that rises and recedes near the crest
            if (-depth < CELL * 1.7) {
              var spray = 0.5 + 0.5 * Math.sin(t * 0.004 + nz * 30 + cx * 0.05);
              if (nz > 0.9 - spray * 0.12) paint(cx, cy, FOAM, 0.32 + 0.32 * spray);
            }
            continue;
          }
          if (depth < CELL * 1.3) {                   // foam crest band
            paint(cx, cy, mix(CREST, FOAM, nz * 0.6), 0.9);
            continue;
          }
          // underwater: colour + opacity ramp with depth (photos glow through the shallows)
          var k = Math.min(1, depth / (H * 0.4));
          var col = k < 0.5 ? mix(SHAL, MID, k / 0.5) : mix(MID, DEEP, (k - 0.5) / 0.5);
          var sh = Math.sin(t * 0.003 + cx * 0.04 + cy * 0.06 + nz * 12);
          if (sh > 0.82) col = mix(col, CREST, 0.22);  // drifting caustic sparkle
          paint(cx, cy, col, 0.42 + 0.5 * k);
        }
      }
      drawSprites(t);   // beach props on top, washed by the tide
    }

    var raf = 0, running = false, t0 = 0;
    function loop(now) { raf = requestAnimationFrame(loop); frame(now - t0); }
    function play() {
      if (running || reduceMotion) return;
      running = true;
      t0 = (window.performance && performance.now) ? performance.now() : 0;
      raf = requestAnimationFrame(loop);
    }
    function pause() { running = false; cancelAnimationFrame(raf); }

    size();

    var rz;
    window.addEventListener("resize", function () {
      clearTimeout(rz);
      rz = setTimeout(function () { size(); if (reduceMotion) frame(4200); }, 160);
    });

    if (reduceMotion) { frame(4200); return; }          // one static frame

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (ents) {
        ents.forEach(function (en) { en.isIntersecting ? play() : pause(); });
      }, { threshold: 0.01 }).observe(host);
    } else {
      play();
    }
  })();

  /* ---------------- Build panels ---------------- */
  var frag = document.createDocumentFragment();

  projects.forEach(function (p, i) {
    var panel = document.createElement("article");
    panel.className = "reel-panel" + (i === 0 ? " is-lead" : "");
    panel.setAttribute("data-reel-panel", "");

    var idx = pad(i + 1);
    var cityStyle = [p.city, p.style].filter(Boolean).join(" <i>·</i> ");
    var href = "project.html?slug=" + encodeURIComponent(p.slug || "");
    var alt = esc(p.title) + (p.tag ? ", " + esc(p.tag) : "") + ", built by Kashi Organization";

    panel.innerHTML =
      '<div class="reel-panel__media">' +
        '<img class="reel-panel__img" data-reel-img src="' + esc(IMG(p.cover)) + '" alt="' + alt + '" loading="' + (i < 2 ? "eager" : "lazy") + '" decoding="async">' +
      '</div>' +
      '<div class="reel-panel__scrim"></div>' +
      '<div class="reel-panel__ticks" aria-hidden="true"><span class="tl"></span><span class="tr"></span><span class="bl"></span><span class="br"></span></div>' +
      '<div class="reel-panel__index" aria-hidden="true"><b>' + idx + '</b> / ' + pad(total) + '</div>' +
      '<div class="reel-panel__inner">' +
        (p.tag ? '<span class="reel-panel__tag">' + esc(p.tag) + '</span>' : "") +
        '<h3 class="reel-panel__title">' + esc(p.title) + '</h3>' +
        (cityStyle ? '<p class="reel-panel__meta">' + cityStyle + '</p>' : "") +
        '<a class="reel-link" href="' + href + '" aria-label="View project: ' + esc(p.title) + '">' +
          '<span>View project</span><span class="reel-link__arrow" aria-hidden="true">&rarr;</span>' +
        '</a>' +
      '</div>';

    frag.appendChild(panel);
  });

  // trailing spacer so the final panel can rest fully in view at reel end
  var end = document.createElement("div");
  end.className = "reel__end";
  end.setAttribute("aria-hidden", "true");
  frag.appendChild(end);

  mount.innerHTML = "";
  mount.appendChild(frag);

  var panels = Array.prototype.slice.call(mount.querySelectorAll("[data-reel-panel]"));

  /* ---------------- Enhance (GSAP optional) ---------------- */
  if (!window.gsap) return;
  var gsap = window.gsap;
  var ST = window.ScrollTrigger;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var reel = document.querySelector("[data-reel]");
  var viewport = document.querySelector(".reel__viewport");
  var track = mount;
  var fillEl = document.querySelector("[data-reel-fill]");
  var countEl = document.querySelector("[data-reel-index]");

  var lastIdx = -1;
  function setHud(progress) {
    progress = Math.max(0, Math.min(1, progress));
    if (fillEl) fillEl.style.transform = "scaleX(" + progress.toFixed(4) + ")";
    if (countEl) {
      var i = Math.min(total, Math.round(progress * (total - 1)) + 1);
      if (i !== lastIdx) { countEl.textContent = pad(i); lastIdx = i; }
    }
  }
  setHud(0);

  if (!ST) return;

  var mm = gsap.matchMedia();

  /* -------- Desktop: pinned horizontal scrub -------- */
  mm.add("(min-width: 992px)", function () {
    // Reduced motion → native horizontal scroll, no pin/trap.
    if (reduce) {
      if (reel) reel.classList.add("is-native");
      setHud(0);
      return;
    }

    var getAmount = function () {
      return Math.max(0, track.scrollWidth - viewport.clientWidth);
    };

    var tween = gsap.to(track, {
      x: function () { return -getAmount(); },
      ease: "none",
      scrollTrigger: {
        trigger: reel,
        start: "top 8%",
        end: function () { return "+=" + getAmount(); },
        pin: true,
        pinSpacing: true,
        scrub: 1,
        invalidateOnRefresh: true,
        anticipatePin: 1,
        onUpdate: function (self) { setHud(self.progress); },
        onRefresh: function (self) { setHud(self.progress); }
      }
    });

    // Per-panel image parallax, driven by the horizontal container tween.
    var imgTweens = panels.map(function (panel) {
      var img = panel.querySelector("[data-reel-img]");
      if (!img) return null;
      return gsap.fromTo(
        img,
        { xPercent: -6 },
        {
          xPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tween,
            start: "left right",
            end: "right left",
            scrub: true,
            invalidateOnRefresh: true
          }
        }
      );
    });

    // a11y: focusing a "View project" link in an off-screen panel scrolls that
    // panel into the pinned reel, so keyboard users never focus invisible content.
    var st = tween.scrollTrigger;
    function onFocusIn(e) {
      var link = e.target && e.target.closest && e.target.closest(".reel-link");
      if (!link) return;
      var panel = link.closest("[data-reel-panel]");
      if (!panel || !st) return;
      var amount = getAmount();
      if (amount <= 0) return;
      var prog = Math.max(0, Math.min(1, panel.offsetLeft / amount));
      st.scroll(st.start + prog * (st.end - st.start));
    }
    track.addEventListener("focusin", onFocusIn);

    ST.refresh();

    return function () {
      track.removeEventListener("focusin", onFocusIn);
      if (tween.scrollTrigger) tween.scrollTrigger.kill();
      tween.kill();
      imgTweens.forEach(function (t) { if (t && t.scrollTrigger) t.scrollTrigger.kill(); if (t) t.kill(); });
      gsap.set(track, { clearProps: "transform" });
      panels.forEach(function (panel) {
        var img = panel.querySelector("[data-reel-img]");
        if (img) gsap.set(img, { clearProps: "transform" });
      });
      setHud(0);
    };
  });

  /* Keep measurements honest once hero imagery decodes. */
  function refreshSoon() { if (ST) ST.refresh(); }
  window.addEventListener("load", refreshSoon);
  var eager = mount.querySelectorAll('img[loading="eager"]');
  Array.prototype.forEach.call(eager, function (img) {
    if (!img.complete) img.addEventListener("load", refreshSoon, { once: true });
  });
  setTimeout(refreshSoon, 900);
  setTimeout(refreshSoon, 2000);
})();
