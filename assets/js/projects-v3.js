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

    function size() {
      W = host.clientWidth;
      H = host.clientHeight;
      if (!W || !H) return;
      cv.width = W; cv.height = H;               // dpr 1 -> naturally chunky + cheap
      cols = Math.ceil(W / CELL) + 1;
      rows = Math.ceil(H / CELL) + 1;
      noise = new Float32Array(cols * rows);     // static per-cell grain for foam
      for (var i = 0; i < noise.length; i++) noise[i] = Math.random();
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

    function paint(x, y, rgb, a) {
      ctx.globalAlpha = a;
      ctx.fillStyle = "rgb(" + (rgb[0] | 0) + "," + (rgb[1] | 0) + "," + (rgb[2] | 0) + ")";
      ctx.fillRect(x, y, CELL - 0.6, CELL - 0.6);   // hair gap -> pixel-grid read
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
