/* =============================================================
   KASHI ORGANIZATION, v3 motion engine
   Single scrolling page. Opening: the emblem blooms from small
   and centered to nearly full screen while fading back to a
   watermark, then the two divisions rise in front of it.
   Lenis + GSAP, all self-hosted. Reduced motion fully supported.
   ============================================================= */
(function () {
  "use strict";

  var R = window.KASHI || {};
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var IMG = function (name) { return "assets/img/projects/" + name + ".jpg"; };
  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  };

  var hasGSAP = typeof window.gsap !== "undefined";
  if (hasGSAP) {
    gsap.registerPlugin(ScrollTrigger);
    if (window.CustomEase) CustomEase.create("kashi", "0.16,1,0.3,1");
  }

  var ARROW =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
    '<path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var EXTLINK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">' +
    '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/></svg>';

  /* ---------------- Render: project chapters ---------------- */
  function renderChapters() {
    var host = $("#chapters");
    if (!host || !R.development || !R.development.projects) return;

    host.innerHTML = R.development.projects
      .map(function (p, i) {
        var no = String(i + 1).padStart(2, "0");
        var total = String(R.development.projects.length).padStart(2, "0");

        var meta = "";
        if (p.address) meta += "<dt>Address</dt><dd>" + esc(p.address) + "</dd>";
        meta += "<dt>Location</dt><dd>" + esc(p.city) + "</dd>";
        if (p.facts) {
          Object.keys(p.facts).forEach(function (k) {
            meta += "<dt>" + esc(k) + "</dt><dd>" + esc(p.facts[k]) + "</dd>";
          });
        }

        var figure = p.hero
          ? '<figure class="chapter__figure" data-v3="fade">' +
            '<img src="' + IMG(p.hero) + '" alt="' + esc(p.name) + ", " + esc(p.city) +
            '" loading="lazy" decoding="async" data-para>' +
            "</figure>"
          : "";

        var strip = (p.gallery && p.gallery.length)
          ? '<div class="strip" data-v3="fade">' +
            p.gallery.map(function (g, gi) {
              return '<img src="' + IMG(g) + '" alt="' + esc(p.name) + ", view " + (gi + 1) +
                     '" loading="lazy" decoding="async">';
            }).join("") +
            "</div>"
          : "";

        var record = p.recordUrl
          ? '<a class="chapter__record" href="' + esc(p.recordUrl) + '" target="_blank" rel="noopener noreferrer">' +
            "Public property record" + EXTLINK + "</a>"
          : "";

        return (
          '<article class="chapter" id="' + esc(p.slug) + '">' +
            '<div class="chapter__head">' +
              '<div data-v3="rise">' +
                '<span class="chapter__no">' + no + " / " + total + "</span>" +
                '<h3 class="chapter__name">' + esc(p.name) +
                  '<span class="chapter__sub">' + esc(p.subtitle) + "</span>" +
                "</h3>" +
              "</div>" +
              '<dl class="chapter__meta" data-v3="rise">' + meta + "</dl>" +
            "</div>" +
            figure +
            '<div class="chapter__body">' +
              '<p class="chapter__pull" data-v3="rise">' + esc(p.pull) + "</p>" +
              '<div class="chapter__story" data-v3="rise">' +
                p.story.map(function (s) { return "<p>" + esc(s) + "</p>"; }).join("") +
                record +
              "</div>" +
            "</div>" +
            strip +
          "</article>"
        );
      })
      .join("");
  }

  /* ---------------- Render: construction management ---------------- */
  function renderConstruction() {
    var host = $("#cm-cells");
    if (!host || !R.construction) return;
    host.innerHTML = (R.construction.capabilities || [])
      .map(function (c) {
        return (
          '<div class="cm-cell" data-v3="rise">' +
            '<span class="cm-cell__k">' + esc(c.k) + "</span>" +
            '<h3 class="cm-cell__t">' + esc(c.title) + "</h3>" +
            '<p class="cm-cell__c">' + esc(c.copy) + "</p>" +
          "</div>"
        );
      })
      .join("");
  }

  /* ---------------- Render: credentials ---------------- */
  function renderCredentials() {
    var host = $("#creds");
    if (!host || !R.credentials) return;
    host.innerHTML = R.credentials
      .map(function (c) {
        return '<dl class="cred" data-v3="rise"><dt>' + esc(c.label) + "</dt><dd>" + esc(c.detail) + "</dd></dl>";
      })
      .join("");
  }

  /* ---------------- The opening bloom ---------------- */
  function runIntro(done) {
    var mark = $(".intro__mark img");
    var id = $(".intro__id");
    var cards = $$(".division");
    var cue = $(".intro__scroll");
    var rest = getComputedStyle(document.documentElement).getPropertyValue("--mark-op").trim() || "0.055";
    rest = parseFloat(rest) || 0.055;

    document.body.classList.remove("loading");

    // Settle instantly when motion is reduced, GSAP is missing, or we have
    // already played it once this session.
    var seen = false;
    try { seen = sessionStorage.getItem("kashiV3Intro") === "1"; } catch (e) {}

    if (!mark || reduce || !hasGSAP) {
      if (mark) { mark.style.transform = "scale(1)"; mark.style.opacity = rest; }
      if (id) id.style.opacity = 1;
      cards.forEach(function (c) { c.style.opacity = 1; });
      if (cue) cue.style.opacity = 1;
      done && done();
      return;
    }

    document.body.classList.add("intro-lock");

    var fast = seen;
    var tl = gsap.timeline({
      defaults: { ease: window.CustomEase ? "kashi" : "power3.out" },
      onComplete: function () {
        document.body.classList.remove("intro-lock");
        try { sessionStorage.setItem("kashiV3Intro", "1"); } catch (e) {}
        ScrollTrigger.refresh();
        done && done();
      },
    });

    if (fast) {
      // Repeat visit in the same session: settle quickly, no long bloom.
      tl.set(mark, { scale: 1, opacity: rest })
        .to([id].filter(Boolean), { opacity: 1, duration: 0.45 })
        .to(cards, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 }, "-=0.3")
        .to(cue, { opacity: 1, duration: 0.4 }, "-=0.2");
      return;
    }

    // First visit: the full bloom the client asked for.
    // small + centered  ->  grows to fill most of the screen  ->  fades back
    // to a semi-transparent watermark, leaving the divisions in front.
    gsap.set(cards, { y: 18 });
    tl.to(mark, { scale: 0.42, duration: 0.9, ease: "power2.out" })
      .to(mark, { scale: 1, duration: 1.55, ease: "power1.inOut" }, "-=0.25")
      .to(mark, { opacity: rest, duration: 1.15, ease: "power2.inOut" }, "-=1.15")
      .to([id].filter(Boolean), { opacity: 1, duration: 0.7 }, "-=0.55")
      .to(cards, { opacity: 1, y: 0, duration: 0.75, stagger: 0.09 }, "-=0.45")
      .to(cue, { opacity: 1, duration: 0.5 }, "-=0.3");
  }

  /* ---------------- Smooth scroll ---------------- */
  var lenis;
  function initLenis() {
    if (reduce || typeof window.Lenis === "undefined" || !hasGSAP) return;
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    window.lenisRef = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  function initAnchors() {
    $$('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (!id || id.length < 2) return;
        var t = $(id);
        if (!t) return;
        e.preventDefault();
        var y = t.getBoundingClientRect().top + (window.scrollY || window.pageYOffset) - 56;
        if (lenis) lenis.scrollTo(y, { offset: 0 });
        else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
        t.setAttribute("tabindex", "-1");
        t.focus({ preventScroll: true });
      });
    });
  }

  /* ---------------- Scroll behaviour ---------------- */
  function initScroll() {
    var nav = $(".v3nav");
    var intro = $(".intro");
    var mark = $(".intro__mark img");

    if (!hasGSAP) {
      if (nav) nav.style.transform = "none";
      $$("[data-v3]").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
      return;
    }

    // Nav slides in once the intro is behind you.
    // Normalise first: the CSS translateY(-100%) parses as a pixel y, which would
    // otherwise stack with yPercent and leave the bar stuck off-screen.
    if (nav) gsap.set(nav, { y: 0, yPercent: reduce ? 0 : -100 });

    if (nav && intro) {
      if (reduce) {
        nav.classList.add("is-in");
      } else {
        ScrollTrigger.create({
          trigger: intro,
          start: "bottom 80%",
          end: "max", // stay active all the way down, not just across the intro
          onToggle: function (self) {
            gsap.to(nav, { yPercent: self.isActive ? 0 : -100, duration: 0.5, ease: "power3.out" });
            nav.classList.toggle("is-in", self.isActive);
          },
        });
      }
    }

    // The watermark eases away as the content takes over.
    if (mark && intro && !reduce) {
      gsap.to(mark, {
        opacity: 0,
        ease: "none",
        scrollTrigger: { trigger: intro, start: "center center", end: "bottom top", scrub: true },
      });
    }

    if (reduce) {
      $$("[data-v3]").forEach(function (el) { el.style.opacity = 1; el.style.transform = "none"; });
      return;
    }

    $$('[data-v3="rise"]').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
      });
    });
    $$('[data-v3="fade"]').forEach(function (el) {
      gsap.to(el, {
        opacity: 1, duration: 1, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

    // Gentle parallax on each chapter's hero image.
    $$("[data-para]").forEach(function (img) {
      gsap.fromTo(img, { yPercent: -4 }, {
        yPercent: 4, ease: "none",
        scrollTrigger: { trigger: img.parentNode, start: "top bottom", end: "bottom top", scrub: true },
      });
    });

    // Nav link active state per section.
    var links = $$(".v3nav__links a");
    links.forEach(function (a) {
      var sel = a.getAttribute("href");
      if (!sel || sel.charAt(0) !== "#") return;
      var sec = $(sel);
      if (!sec) return;
      ScrollTrigger.create({
        trigger: sec, start: "top 40%", end: "bottom 40%",
        onToggle: function (self) {
          if (self.isActive) {
            links.forEach(function (l) { l.removeAttribute("aria-current"); });
            a.setAttribute("aria-current", "true");
          }
        },
      });
    });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    renderChapters();
    renderConstruction();
    renderCredentials();
    initLenis();
    initAnchors();
    runIntro(function () { ScrollTrigger && ScrollTrigger.refresh(); });
    initScroll();
    window.__kashiBooted = true;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
