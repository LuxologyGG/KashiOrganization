/* =============================================================
   KASHI ORGANIZATION, Motion engine (v2)
   Lenis + GSAP. First-load-only loader, pixel page transitions,
   hero-scoped "scroll to explore" text cursor. No global cursor,
   no magnetic buttons.
   ============================================================= */
(function () {
  "use strict";
  const R = (window.KASHI && window.KASHI) || {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const IMG = (name) => `assets/img/projects/${name}.jpg`;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  window._rebindCursor = () => {}; // legacy no-op (renderers call it)

  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase);
  CustomEase.create("kashi", "0.16,1,0.3,1");

  /* ---------------- Lenis smooth scroll ---------------- */
  let lenis;
  function initLenis() {
    if (reduce) return;
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    window.lenisRef = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        const t = id.length > 1 ? $(id) : null;
        if (t) { e.preventDefault(); lenis.scrollTo(id, { offset: -70 }); t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); }
      });
    });
  }

  /* ---------------- First-load loader (logo + progress) ---------------- */
  function runLoader(done) {
    const loader = $(".loader");
    if (!loader) { document.body.classList.remove("loading"); done && done(); return; }
    const fill = $(".loader__fill"), count = $(".loader__count b");
    const state = { p: 0 };
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(state, { p: 100, duration: reduce ? 0.2 : 1.7, ease: "power1.inOut",
      onUpdate() { const v = Math.round(state.p); if (fill) fill.style.width = v + "%"; if (count) count.textContent = String(v).padStart(3, "0"); } });
    tl.to(".loader__inner", { y: -16, opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.12");
    tl.to(loader, { yPercent: -100, duration: 0.9, ease: "kashi", onComplete() { loader.remove(); } }, "-=0.15");
    tl.add(() => { document.body.classList.remove("loading"); done && done(); }, "-=0.6");
  }

  /* ---------------- Pixel page transitions ---------------- */
  function initTransitions() {
    const wrap = document.createElement("div"); wrap.className = "transition"; wrap.setAttribute("aria-hidden", "true");
    const panel = document.createElement("div"); panel.className = "transition__panel";
    wrap.appendChild(panel); document.body.appendChild(wrap);
    let pixels = [], ROWS = 1;
    function build() {
      const size = window.innerWidth < 600 ? 24 : 32; // finer than osmo's default
      const cols = Math.ceil(window.innerWidth / size), rows = Math.ceil(window.innerHeight / size);
      ROWS = rows;
      panel.innerHTML = ""; pixels = [];
      // build ROW-major so the pixel array reads top-to-bottom, then left-to-right
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          let col = panel.children[c];
          if (!col) { col = document.createElement("div"); col.className = "transition__col"; panel.appendChild(col); }
          const px = document.createElement("div"); px.className = "transition__pixel"; col.appendChild(px); pixels.push(px);
        }
      }
    }
    build();
    let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(build, 200); });
    // top-to-bottom wipe: delay scales with the pixel's row, plus a little jitter for the dissolve grain
    const SPREAD = 0.5, JITTER = 0.06;
    const rowStagger = (i) => (Math.floor(i / (pixels.length / ROWS)) / ROWS) * SPREAD + Math.random() * JITTER;
    const cover = (cb) => {
      if (reduce) { cb && cb(); return; }
      gsap.set(panel, { opacity: 1 }); gsap.set(pixels, { opacity: 0 });
      gsap.to(pixels, { opacity: 1, duration: 0.07, ease: "none", stagger: rowStagger, onComplete: cb });
    };
    const reveal = () => {
      if (reduce) { gsap.set(panel, { opacity: 0 }); return; }
      gsap.set(panel, { opacity: 1 }); gsap.set(pixels, { opacity: 1 });
      gsap.to(pixels, { opacity: 0, duration: 0.07, ease: "none", stagger: rowStagger, onComplete: () => gsap.set(panel, { opacity: 0 }) });
    };
    // intercept plain, primary-click, same-origin navigations only
    document.addEventListener("click", (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return; // let new-tab/new-window through
      const a = e.target.closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto") || href.startsWith("tel") || a.target === "_blank" || a.hasAttribute("download") || a.hasAttribute("data-no-transition")) return;
      if (a.origin && a.origin !== location.origin) return;
      if (a.href === location.href) { e.preventDefault(); return; } // same-URL: no pointless reload
      e.preventDefault();
      cover(() => { window.location.href = a.href; });
    });
    // bfcache: if the covered page is restored via Back/Forward, clear the panel
    window.addEventListener("pageshow", (e) => { if (e.persisted) gsap.set(panel, { opacity: 0 }); });
    return { reveal, cover };
  }

  /* ---------------- Hero-scoped text cursor ("Scroll to explore") ---------------- */
  function initTextCursor() {
    if (reduce || !fine) return;
    const cur = document.createElement("div");
    cur.className = "cursor"; cur.setAttribute("data-cursor", "");
    cur.innerHTML = '<div class="cursor-bubble"><span data-cursor-text-target class="cursor-bubble__text">Scroll</span></div>';
    document.body.appendChild(cur);
    const target = $("[data-cursor-text-target]", cur);
    const xTo = gsap.quickTo(cur, "x", { duration: 0.4, ease: "power3.out" });
    const yTo = gsap.quickTo(cur, "y", { duration: 0.4, ease: "power3.out" });
    let mx = 0, my = 0;
    const update = () => {
      const el = document.elementFromPoint(mx, my);
      const hov = el && el.closest("[data-cursor-hover]");
      const rect = cur.getBoundingClientRect();
      cur.setAttribute("data-cursor", hov ? (rect.right >= window.innerWidth ? "active-edge" : "active") : "");
      if (hov) { const t = hov.getAttribute("data-cursor-text"); if (t) target.textContent = t; }
    };
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; xTo(mx); yTo(my); requestAnimationFrame(update); });
    window.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
  }

  /* ---------------- Navigation ---------------- */
  function initNav() {
    const nav = $(".nav");
    if (!nav) return;
    let last = 0;
    ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate(self) {
        const y = self.scroll();
        nav.classList.toggle("is-solid", y > 60);
        if (y > last && y > 400 && !document.body.classList.contains("menu-open")) nav.classList.add("is-hidden");
        else nav.classList.remove("is-hidden");
        last = y;
      },
    });
    const toggle = $(".nav__toggle"), menu = $(".menu");
    if (toggle && menu) {
      if (!menu.id) menu.id = "site-menu";
      toggle.setAttribute("aria-controls", menu.id);
      toggle.setAttribute("aria-expanded", "false");
      const inertEls = [$("#main"), $("footer")].filter(Boolean);
      const setOpen = (open) => {
        document.body.classList.toggle("menu-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        inertEls.forEach((el) => { el.inert = open; });
        if (lenis) open ? lenis.stop() : lenis.start();
        if (open) { const first = $("a", menu); first && first.focus(); } else toggle.focus();
      };
      toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("menu-open")));
      $$("a", menu).forEach((a) => a.addEventListener("click", () => setOpen(false)));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) setOpen(false); });
    }
    initNavTheme(nav);
  }
  function initNavTheme(nav) {
    const sections = $$("[data-theme]");
    if (!sections.length) return;
    sections.forEach((sec) => {
      ScrollTrigger.create({ trigger: sec, start: "top 64px", end: "bottom 64px",
        onToggle: (self) => { if (self.isActive) nav.classList.toggle("is-light", sec.dataset.theme === "light"); } });
    });
  }

  /* ---------------- Reveals ---------------- */
  function initReveals() {
    $$('[data-reveal="lines"]').forEach((el) => {
      if (reduce) { gsap.set(el, { opacity: 1 }); return; }
      const run = () => {
        const split = new SplitText(el, { type: "lines", mask: "lines", linesClass: "sl" });
        gsap.set(el, { opacity: 1 });
        gsap.from(split.lines, { yPercent: 118, duration: 1.0, ease: "kashi", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 90%", once: true } });
      };
      document.fonts ? document.fonts.ready.then(run) : run();
    });
    $$('[data-reveal="fade"]').forEach((el) => {
      gsap.fromTo(el, { y: reduce ? 0 : 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "kashi", scrollTrigger: { trigger: el, start: "top 92%", once: true } });
    });
    $$("[data-reveal-group]").forEach((grp) => {
      const items = $$("[data-reveal-item]", grp);
      gsap.fromTo(items, { y: reduce ? 0 : 36, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "kashi", stagger: 0.08, scrollTrigger: { trigger: grp, start: "top 84%", once: true } });
    });
    $$('[data-reveal="clip"]').forEach((el) => {
      gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "kashi", scrollTrigger: { trigger: el, start: "top 88%", once: true } });
    });
    $$(".img-reveal").forEach((el) => {
      const img = el.querySelector("img") || el;
      if (reduce) { gsap.set(el, { clipPath: "none" }); gsap.set(img, { scale: 1 }); return; }
      gsap.set(el, { clipPath: "inset(0 0 100% 0)" });
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top 88%", once: true } })
        .fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.05, ease: "kashi" })
        .fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.3, ease: "kashi" }, 0);
    });
    $$('[data-scramble="scroll"]').forEach((el) => {
      if (reduce) { gsap.set(el, { opacity: 1 }); return; }
      const split = new SplitText(el, { type: "words,chars", wordsClass: "word", charsClass: "char" });
      ScrollTrigger.create({ trigger: el, start: "top 92%", once: true,
        onEnter: () => { gsap.set(el, { opacity: 1 }); gsap.to(split.words, { duration: 1.1, stagger: 0.02, scrambleText: { text: "{original}", chars: "upperCase", speed: 0.95 }, onComplete: () => split.revert() }); } });
    });
    $$("[data-parallax]").forEach((el) => {
      if (reduce) return;
      const sp = parseFloat(el.dataset.parallax) || 0.15;
      gsap.fromTo(el, { yPercent: -sp * 50 }, { yPercent: sp * 50, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
    // draw-on-scroll SVG icons
    $$("[data-draw]").forEach((svg) => {
      const paths = $$("path, line, circle, rect, polyline", svg);
      paths.forEach((p) => { const len = p.getTotalLength ? p.getTotalLength() : 0; if (!len) return; p.style.strokeDasharray = len; p.style.strokeDashoffset = reduce ? 0 : len; });
      if (reduce) return;
      gsap.to(paths, { strokeDashoffset: 0, duration: 1.1, ease: "power2.out", stagger: 0.06, scrollTrigger: { trigger: svg, start: "top 88%", once: true } });
    });
  }

  /* ---------------- Counters ---------------- */
  function initCounters() {
    $$("[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0", 10);
      const pre = el.dataset.prefix || "";
      const plain = el.hasAttribute("data-plain");
      const obj = { v: 0 };
      const fmt = (v) => pre + (dec ? v.toFixed(dec) : plain ? String(Math.round(v)) : Math.round(v).toLocaleString());
      el.textContent = fmt(0);
      gsap.to(obj, { v: target, duration: reduce ? 0.1 : 2, ease: "power2.out", scrollTrigger: { trigger: el, start: "top 90%", once: true }, onUpdate() { el.textContent = fmt(obj.v); } });
    });
  }

  /* ---------------- Marquee ---------------- */
  function initMarquee() {
    $$(".marquee").forEach((m) => {
      const track = $(".marquee__track", m);
      if (!track) return;
      track.innerHTML += track.innerHTML;
      const speed = parseFloat(m.dataset.speed || "60");
      m.style.setProperty("--dur", track.scrollWidth / 2 / speed + "s");
    });
  }

  /* ---------------- Accordion ---------------- */
  function initAccordion() {
    $$(".acc__item").forEach((item) => {
      $(".acc__q", item).addEventListener("click", () => {
        const open = item.classList.contains("open");
        $$(".acc__item", item.closest(".acc")).forEach((i) => i.classList.remove("open"));
        if (!open) item.classList.add("open");
        ScrollTrigger.refresh();
      });
    });
  }

  /* ---------------- Testimonials ---------------- */
  function initTesti() {
    const root = $("[data-testi]");
    if (!root || !R.testimonials) return;
    const q = $("[data-testi-q]", root), who = $("[data-testi-who]", root), sub = $("[data-testi-sub]", root), idx = $("[data-testi-idx]", root);
    let i = 0; const list = R.testimonials;
    function set(n, dir) {
      i = (n + list.length) % list.length; const t = list[i];
      gsap.timeline()
        .to([q, who, sub], { opacity: 0, y: -12 * (dir || 1), duration: 0.3, ease: "power2.in" })
        .add(() => { q.textContent = "“" + t.quote + "”"; who.textContent = t.name; sub.textContent = t.role; if (idx) idx.textContent = String(i + 1).padStart(2, "0") + " / " + String(list.length).padStart(2, "0"); })
        .fromTo([q, who, sub], { opacity: 0, y: 12 * (dir || 1) }, { opacity: 1, y: 0, duration: 0.5, ease: "kashi", stagger: 0.05 });
    }
    set(0);
    $("[data-testi-prev]", root) && $("[data-testi-prev]", root).addEventListener("click", () => set(i - 1, -1));
    $("[data-testi-next]", root) && $("[data-testi-next]", root).addEventListener("click", () => set(i + 1, 1));
  }

  /* ---------------- Hero: cinematic media parallax ---------------- */
  function initHero() {
    const hero = $(".hero");
    if (!hero) return;
    document.body.classList.add("hero-live");
    const media = $(".hero__media img, .hero__media video", hero);
    const isVideo = media && media.tagName === "VIDEO";
    if (isVideo && reduce) { try { media.pause(); media.removeAttribute("autoplay"); } catch (e) {} }
    if (media && !reduce) {
      gsap.to(media, { yPercent: 18, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
      if (isVideo) {
        // the timelapse already provides motion; just pause it off-screen for perf
        ScrollTrigger.create({ trigger: hero, start: "top bottom", end: "bottom top",
          onToggle: (self) => { try { if (self.isActive) { const pr = media.play(); if (pr && pr.catch) pr.catch(() => {}); } else media.pause(); } catch (e) {} } });
      } else {
        const km = gsap.fromTo(media, { scale: 1.06 }, { scale: 1.17, duration: 18, ease: "sine.inOut", repeat: -1, yoyo: true }); // cinemagraph drift
        ScrollTrigger.create({ trigger: hero, start: "top bottom", end: "bottom top", onToggle: (self) => (self.isActive ? km.play() : km.pause()) });
      }
    }
    // full-bleed parallax bands
    $$(".band__media img").forEach((im) => { if (!reduce) gsap.fromTo(im, { yPercent: -12 }, { yPercent: 12, ease: "none", scrollTrigger: { trigger: im.closest(".band"), start: "top bottom", end: "bottom top", scrub: true } }); });
    // fade hero content out as it leaves (fluid handoff to next section)
    const inner = $(".hero__inner", hero);
    if (inner && !reduce) gsap.to(inner, { yPercent: -24, opacity: 0.15, ease: "none", scrollTrigger: { trigger: hero, start: "30% top", end: "bottom top", scrub: true } });
  }

  /* ---------------- CTA emblem: rings draw on, polygons assemble ---------------- */
  function initCtaEmblem() {
    if (reduce) return; // static emblem for reduced motion
    $$("[data-emblem]").forEach((box) => {
      const svg = $("svg", box); if (!svg) return;
      const polys = $$("polygon", svg);
      const rings = $$("circle", svg);
      gsap.set(polys, { opacity: 0, scale: 0.5, transformOrigin: "50% 50%" });
      gsap.set(rings, { strokeDasharray: 1, strokeDashoffset: 1 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: box, start: "top 85%", once: true } });
      tl.to(rings, { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut", stagger: 0.18 }, 0)
        .to(polys, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)", stagger: { each: 0.026, from: "random" } }, 0.25);
    });
  }

  /* ---------------- "Vision meets execution": line drawing → photo scrub ---------------- */
  function initVME() {
    const stage = $("[data-vme]");
    if (!stage) return;
    const photo = $("[data-vme-photo]", stage);
    const seam = $("[data-vme-seam]", stage);
    if (!photo) return;
    if (reduce) { gsap.set(photo, { clipPath: "inset(0 0 0 0)" }); if (seam) gsap.set(seam, { opacity: 0 }); return; }
    // photo starts fully hidden (revealed from the bottom up as you scroll)
    gsap.set(photo, { clipPath: "inset(100% 0 0 0)" });
    gsap.timeline({ scrollTrigger: { trigger: stage, start: "top 78%", end: "bottom 62%", scrub: 0.6 } })
      .fromTo(photo, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", ease: "none" }, 0)
      .fromTo(seam || {}, { top: "100%" }, { top: "0%", ease: "none" }, 0);
  }

  /* =============================================================
     Data-driven renderers
     ============================================================= */
  function cursorAttrs(text) { return `data-cursor-hover data-cursor-text="${text}"`; }

  function renderProjects() {
    const grid = $("[data-projects-grid]");
    if (!grid || !R.projects) return;
    const spans = ["span-7", "span-5", "span-5", "span-7", "span-6", "span-6", "span-8", "span-4"];
    function paint(filter) {
      grid.innerHTML = "";
      const list = R.projects.filter((p) => !filter || filter === "all" || p.style === filter);
      list.forEach((p, n) => {
        const a = document.createElement("a");
        a.href = `project.html?slug=${p.slug}`;
        a.className = `pcard ${spans[n % spans.length]} ${n % 3 === 1 ? "tall" : ""}`;
        a.innerHTML = `
          <span class="pcard__num mono">P/${String(n + 1).padStart(2, "0")}</span>
          <div class="pcard__media"><img src="${IMG(p.cover)}" alt="${p.title}" loading="lazy"></div>
          <div class="pcard__body">
            <div><span class="pcard__tag">${p.tag}</span><h3 class="pcard__title">${p.title}</h3><div class="pcard__loc">${p.city} · ${p.style}${p.year ? " · " + p.year : ""}</div></div>
            <span class="pcard__go" aria-hidden="true">↗</span>
          </div>`;
        grid.appendChild(a);
      });
      const cards = $$(".pcard", grid);
      if (reduce) { gsap.set(cards, { opacity: 1, y: 0 }); return; }
      gsap.set(cards, { opacity: 0, y: 46 });
      ScrollTrigger.batch(cards, { start: "top 94%", onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.8, ease: "kashi", stagger: 0.06, overwrite: true }) });
      ScrollTrigger.refresh();
    }
    const fwrap = $("[data-filters]");
    if (fwrap) {
      const styles = ["all", ...new Set(R.projects.map((p) => p.style))];
      fwrap.innerHTML = styles.map((s, i) => `<button class="filter ${i === 0 ? "is-active" : ""}" data-filter="${s}">${s === "all" ? "All work" : s}</button>`).join("");
      $$(".filter", fwrap).forEach((b) => b.addEventListener("click", () => { $$(".filter", fwrap).forEach((x) => x.classList.remove("is-active")); b.classList.add("is-active"); paint(b.dataset.filter); }));
    }
    paint("all");
  }

  function renderFeatured() {
    const grid = $("[data-featured-grid]");
    if (!grid || !R.projects) return;
    const feat = R.projects.filter((p) => p.feature).slice(0, 3);
    const spans = ["span-8", "span-4", "span-12"];
    feat.forEach((p, n) => {
      const a = document.createElement("a");
      a.href = `project.html?slug=${p.slug}`;
      a.className = `pcard ${spans[n]} ${n === 2 ? "wide" : ""}`;
      a.dataset.revealItem = "";
      a.innerHTML = `
        <span class="pcard__num mono">0${n + 1}</span>
        <div class="pcard__media"><img src="${IMG(p.cover)}" alt="${p.title}" loading="lazy"></div>
        <div class="pcard__body">
          <div><span class="pcard__tag">${p.tag}</span><h3 class="pcard__title">${p.title}</h3><div class="pcard__loc">${p.city} · ${p.style}</div></div>
          <span class="pcard__go">↗</span></div>`;
      grid.appendChild(a);
    });
  }

  function renderProjectDetail() {
    const root = $("[data-project-detail]");
    if (!root || !R.projects) return;
    const slug = new URLSearchParams(location.search).get("slug");
    const p = R.projects.find((x) => x.slug === slug) || R.projects[0];
    document.title = `${p.title}, Kashi Organization`;
    const specRows = Object.entries(p.specs).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
    const gallery = p.gallery.map((g, i) => `<figure class="pd-gitem ${i % 3 === 0 ? "wide" : ""} img-reveal"><img src="${IMG(g)}" alt="${p.style} interior/exterior in the style of ${p.title}" loading="lazy"></figure>`).join("");
    const idx = R.projects.indexOf(p); const next = R.projects[(idx + 1) % R.projects.length];
    root.innerHTML = `
      <header class="pd-hero">
        <div class="pd-hero__media"><img src="${IMG(p.cover)}" alt="${p.title}"></div>
        <div class="wrap pd-hero__inner">
          <a href="projects.html" class="tlink" style="color:var(--paper)"><span class="ar">←</span> All projects</a>
          <span class="pcard__tag" style="margin-top:auto">${p.tag}</span>
          <h1 class="h1 display">${p.title}</h1>
          <div class="pd-hero__meta mono">${p.city} &nbsp;·&nbsp; ${p.style}${p.year ? " &nbsp;·&nbsp; " + p.year : ""} &nbsp;·&nbsp; ${p.photos} frames</div>
        </div>
      </header>
      <section class="section wrap pd-intro">
        <div class="pd-intro__grid">
          <div><span class="eyebrow">Overview</span><p class="lead mt-s" data-reveal="lines">${p.blurb}</p></div>
          <dl class="spec pd-spec">${specRows}</dl>
        </div>
      </section>
      <section class="wrap" style="padding-top:clamp(16px,2vw,26px)"><span class="repnote">Photography from Kashi's own project gallery.</span></section>
      <section class="wrap pd-gallery">${gallery}</section>
      <section class="section wrap">
        <div class="rowline"><span class="eyebrow eyebrow--plain">Next project</span></div>
        <a href="project.html?slug=${next.slug}" class="pd-next">
          <div class="pd-next__media"><img src="${IMG(next.cover)}" alt="${next.title}" loading="lazy"></div>
          <div class="pd-next__body"><span class="pcard__tag">${next.tag}</span><h2 class="h2 display">${next.title}</h2><span class="tlink">View project <span class="ar">→</span></span></div>
        </a>
      </section>`;
  }

  /* ---------------- Contact form ---------------- */
  function initForm() {
    const form = $("[data-contact]");
    if (!form) return;
    const ok = $(".form__ok", form);
    const btnSpan = () => $(".button-070__text", form) || $("button[type=submit] span", form);
    const succeed = () => { form.classList.add("is-sent"); if (ok) { ok.setAttribute("role", "status"); ok.setAttribute("tabindex", "-1"); ok.focus(); } const s = btnSpan(); if (s) s.textContent = "Send inquiry"; form.reset(); };
    const mailtoFallback = () => {
      const g = (n) => (form.querySelector("#" + n) || {}).value || "";
      const body = `Name: ${g("name")}\nEmail: ${g("email")}\nPhone: ${g("phone")}\nType: ${g("type")}\nLocation: ${g("location")}\n\n${g("message")}`;
      window.location.href = `mailto:${form.dataset.mailto || "info@kashiorganization.com"}?subject=${encodeURIComponent("Project inquiry, " + g("name"))}&body=${encodeURIComponent(body)}`;
      succeed();
    };
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true, firstBad = null;
      $$(".field", form).forEach((f) => {
        const input = $("input,textarea,select", f);
        if (!input || !input.hasAttribute("required")) return;
        const msg = $(".field__msg", f);
        let bad = !input.value.trim();
        if (input.type === "email" && input.value && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.value)) bad = true;
        f.classList.toggle("err", bad); input.setAttribute("aria-invalid", String(bad));
        if (msg) { msg.textContent = bad ? (input.dataset.err || "Required") : ""; if (!msg.id) msg.id = input.id + "-msg"; input.setAttribute("aria-describedby", msg.id); }
        if (bad) { valid = false; firstBad = firstBad || input; }
      });
      if (!valid) { firstBad && firstBad.focus(); return; }
      const s = btnSpan(); if (s) s.textContent = "Sending…";
      const endpoint = form.dataset.endpoint;
      if (endpoint) fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } }).then((r) => { if (r.ok) succeed(); else throw 0; }).catch(() => mailtoFallback());
      else setTimeout(mailtoFallback, 300);
    });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    renderFeatured();
    renderProjects();
    renderProjectDetail();
    initLenis();
    initTextCursor();
    initNav();
    initMarquee();
    initHero();
    initCtaEmblem();
    initVME();
    initAccordion();
    initTesti();
    initForm();
    const start = () => { initReveals(); initCounters(); ScrollTrigger.refresh(); };
    document.fonts && document.fonts.ready ? document.fonts.ready.then(start) : start();
    setTimeout(() => ScrollTrigger.refresh(), 800);
    window.__kashiBooted = true;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const T = initTransitions();
    let seen = false; try { seen = sessionStorage.getItem("kashiSeen") === "1"; } catch (e) {}
    if (seen) {
      const loader = $(".loader"); if (loader) loader.remove();
      document.body.classList.remove("loading");
      T.reveal();
      boot();
    } else {
      try { sessionStorage.setItem("kashiSeen", "1"); } catch (e) {}
      runLoader(boot);
    }
  });
})();
