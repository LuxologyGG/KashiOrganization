/* =============================================================
   KASHI ORGANIZATION - Contact (v3) page behaviour
   1) Seamless display marquee (Osmo css-marquee technique)
   2) Interactive "service region" dots field (GSAP, no InertiaPlugin)
   Guarded: no-ops if elements or gsap are absent; static under
   prefers-reduced-motion; pointer effects only on fine pointers.
   ============================================================= */
(function () {
  "use strict";
  if (!window.gsap) return;

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------- Seamless marquee ---------------- */
  function initMarquee() {
    var marquees = document.querySelectorAll("[data-ct-marquee]");
    if (!marquees.length) return;
    var pxPerSec = 70;

    marquees.forEach(function (mq) {
      var lists = mq.querySelectorAll("[data-ct-marquee-list]");
      // duplicate each list so the strip is seamless
      lists.forEach(function (list) {
        var clone = list.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        mq.appendChild(clone);
      });
      if (reduce) return; // leave static; CSS disables the animation
      mq.querySelectorAll("[data-ct-marquee-list]").forEach(function (list) {
        var w = list.offsetWidth || 1;
        list.style.animationDuration = (w / pxPerSec) + "s";
        list.style.animationPlayState = "paused";
      });
    });

    if (reduce || !("IntersectionObserver" in window)) {
      // no observer: just run them
      marquees.forEach(function (mq) {
        mq.querySelectorAll("[data-ct-marquee-list]").forEach(function (l) {
          if (!reduce) l.style.animationPlayState = "running";
        });
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.querySelectorAll("[data-ct-marquee-list]").forEach(function (l) {
          l.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
        });
      });
    }, { threshold: 0 });
    marquees.forEach(function (mq) { io.observe(mq); });
  }

  /* ---------------- Interactive region dots ---------------- */
  function initRegionDots() {
    var container = document.querySelector("[data-region-dots]");
    if (!container) return;

    var BASE = "#3a3227";
    var ACTIVE = "#c8a05c";
    var threshold = 170;

    var dots = [];
    var centers = [];

    function build() {
      container.innerHTML = "";
      dots = [];
      centers = [];
      var cs = getComputedStyle(container);
      var dotPx = parseFloat(cs.fontSize) || 8;
      var gapPx = dotPx * 2;
      var w = container.clientWidth;
      var h = container.clientHeight;
      if (w <= 0 || h <= 0) return;
      var cols = Math.max(1, Math.floor((w + gapPx) / (dotPx + gapPx)));
      var rows = Math.max(1, Math.floor((h + gapPx) / (dotPx + gapPx)));
      var total = cols * rows;

      // small centred void so the SOUTH BAY label breathes
      var holeC = cols % 2 === 0 ? 6 : 5;
      var holeR = rows % 2 === 0 ? 4 : 5;
      var sC = (cols - holeC) / 2;
      var sR = (rows - holeR) / 2;

      var frag = document.createDocumentFragment();
      for (var i = 0; i < total; i++) {
        var r = Math.floor(i / cols);
        var c = i % cols;
        var d = document.createElement("div");
        d.className = "ct-dot";
        if (r >= sR && r < sR + holeR && c >= sC && c < sC + holeC) {
          d.style.visibility = "hidden";
          d._hole = true;
        } else {
          d._hole = false;
        }
        frag.appendChild(d);
        dots.push(d);
      }
      container.appendChild(frag);

      requestAnimationFrame(function () {
        centers = dots.filter(function (d) { return !d._hole; }).map(function (d) {
          var b = d.getBoundingClientRect();
          return { el: d, x: b.left + b.width / 2, y: b.top + b.height / 2 };
        });
      });
    }

    build();

    var ro;
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(function () { build(); });
      ro.observe(container);
    } else {
      window.addEventListener("resize", build);
    }
    // recompute centres on scroll (positions are viewport-relative)
    window.addEventListener("scroll", function () {
      centers = dots.filter(function (d) { return !d._hole; }).map(function (d) {
        var b = d.getBoundingClientRect();
        return { el: d, x: b.left + b.width / 2, y: b.top + b.height / 2 };
      });
    }, { passive: true });

    if (reduce || !fine) return; // static field is enough

    window.addEventListener("mousemove", function (e) {
      var mx = e.clientX, my = e.clientY;
      requestAnimationFrame(function () {
        for (var i = 0; i < centers.length; i++) {
          var c = centers[i];
          var dist = Math.hypot(c.x - mx, c.y - my);
          var t = Math.max(0, 1 - dist / threshold);
          var col = gsap.utils.interpolate(BASE, ACTIVE, t);
          gsap.set(c.el, { backgroundColor: col });
          if (dist < threshold && !c.el._pushed) {
            c.el._pushed = true;
            var f = (1 - dist / threshold);
            gsap.to(c.el, {
              x: (c.x - mx) * 0.28 * f,
              y: (c.y - my) * 0.28 * f,
              duration: 0.5,
              ease: "power2.out",
              onComplete: function () {
                var el = this.targets()[0];
                gsap.to(el, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1,0.6)" });
                el._pushed = false;
              }
            });
          }
        }
      });
    }, { passive: true });
  }

  function boot() {
    try { initMarquee(); } catch (e) {}
    try { initRegionDots(); } catch (e) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
