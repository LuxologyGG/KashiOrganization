/* =============================================================
   KASHI ORGANIZATION — Motion engine
   Lenis + GSAP (ScrollTrigger, SplitText, ScrambleText, Inertia)
   ============================================================= */
(function () {
  "use strict";
  const R = (window.KASHI && window.KASHI) || {};
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const IMG = (name) => `assets/img/projects/${name}.jpg`;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, InertiaPlugin, CustomEase);
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
    // anchor links
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -70 }); }
      });
    });
  }

  /* ---------------- Preloader ---------------- */
  function initLoader(done) {
    const loader = $(".loader");
    if (!loader) { document.body.classList.remove("loading"); done && done(); return; }
    const fill = $(".loader__fill"), count = $(".loader__count b");
    const state = { p: 0 };
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(state, {
      p: 100, duration: reduce ? 0.2 : 1.9, ease: "power1.inOut",
      onUpdate() { const v = Math.round(state.p); if (fill) fill.style.width = v + "%"; if (count) count.textContent = String(v).padStart(3, "0"); },
    });
    tl.to(".loader__inner", { y: -16, opacity: 0, duration: 0.5, ease: "power2.in" }, "+=0.15");
    tl.to(loader, { yPercent: -100, duration: 0.9, ease: "kashi", onComplete() { loader.remove(); } }, "-=0.15");
    tl.add(() => { document.body.classList.remove("loading"); done && done(); }, "-=0.6");
  }

  /* ---------------- Custom cursor ---------------- */
  function initCursor() {
    if (reduce || window.matchMedia("(hover: none)").matches || window.innerWidth < 900) return;
    const cur = document.createElement("div");
    cur.className = "cursor";
    cur.innerHTML = '<div class="cursor__ring"></div><div class="cursor__dot"></div><div class="cursor__label">View</div>';
    document.body.appendChild(cur);
    const ring = $(".cursor__ring", cur), dot = $(".cursor__dot", cur), label = $(".cursor__label", cur);
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; label.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; });
    gsap.ticker.add(() => { rx += (mx - rx) * 0.16; ry += (my - ry) * 0.16; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; });
    const bind = () => {
      $$("a, button, .btn, .nav__link, input, textarea, [data-cursor]").forEach((el) => {
        if (el._cur) return; el._cur = 1;
        el.addEventListener("mouseenter", () => { cur.classList.add("is-hover"); if (el.dataset.cursor === "view") { cur.classList.add("is-view"); label.textContent = el.dataset.cursorLabel || "View"; } });
        el.addEventListener("mouseleave", () => { cur.classList.remove("is-hover", "is-view"); });
      });
    };
    bind(); window._rebindCursor = bind;
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
      const setOpen = (open) => {
        document.body.classList.toggle("menu-open", open);
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        if (lenis) open ? lenis.stop() : lenis.start();
        if (open) { const first = $("a", menu); first && first.focus(); }
        else toggle.focus();
      };
      toggle.addEventListener("click", () => setOpen(!document.body.classList.contains("menu-open")));
      $$("a", menu).forEach((a) => a.addEventListener("click", () => setOpen(false)));
      document.addEventListener("keydown", (e) => { if (e.key === "Escape" && document.body.classList.contains("menu-open")) setOpen(false); });
    }
    initNavTheme(nav);
  }

  // Toggle .nav.is-light when a light-ground section sits under the fixed header
  function initNavTheme(nav) {
    const sections = $$("[data-theme]");
    if (!sections.length) return;
    sections.forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec, start: "top 64px", end: "bottom 64px",
        onToggle: (self) => { if (self.isActive) nav.classList.toggle("is-light", sec.dataset.theme === "light"); },
      });
    });
  }

  /* ---------------- Reveals ---------------- */
  function initReveals() {
    // line reveals via SplitText masked lines
    $$('[data-reveal="lines"]').forEach((el) => {
      if (reduce) return;
      const run = () => {
        const split = new SplitText(el, { type: "lines", mask: "lines", linesClass: "sl" });
        gsap.set(el, { opacity: 1 });
        gsap.from(split.lines, {
          yPercent: 118, duration: 1.05, ease: "kashi", stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      };
      document.fonts ? document.fonts.ready.then(run) : run();
    });
    // fade / rise
    $$('[data-reveal="fade"]').forEach((el) => {
      gsap.fromTo(el, { y: reduce ? 0 : 34, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "kashi", scrollTrigger: { trigger: el, start: "top 90%", once: true } });
    });
    // grouped stagger
    $$("[data-reveal-group]").forEach((grp) => {
      const items = $$("[data-reveal-item]", grp);
      gsap.fromTo(items, { y: reduce ? 0 : 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "kashi", stagger: 0.09, scrollTrigger: { trigger: grp, start: "top 82%", once: true } });
    });
    // clip reveal
    $$('[data-reveal="clip"]').forEach((el) => {
      gsap.fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.1, ease: "kashi", scrollTrigger: { trigger: el, start: "top 86%", once: true } });
    });
    // image reveal — one clean clip-path wipe + subtle settle scale
    $$(".img-reveal").forEach((el) => {
      const img = el.querySelector("img") || el;
      if (reduce) { gsap.set(el, { clipPath: "none" }); gsap.set(img, { scale: 1 }); return; }
      gsap.set(el, { clipPath: "inset(0 0 100% 0)" });
      gsap.timeline({ scrollTrigger: { trigger: el, start: "top 86%", once: true } })
        .fromTo(el, { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.05, ease: "kashi" })
        .fromTo(img, { scale: 1.14 }, { scale: 1, duration: 1.3, ease: "kashi" }, 0);
    });
    // scramble (Vaulk-style per-char) — resolves INTO the real text
    $$('[data-scramble="scroll"]').forEach((el) => {
      if (reduce) { gsap.set(el, { opacity: 1 }); return; }
      const split = new SplitText(el, { type: "words,chars", wordsClass: "word", charsClass: "char" });
      ScrollTrigger.create({
        trigger: el, start: "top 90%", once: true,
        onEnter: () => {
          gsap.set(el, { opacity: 1 });
          gsap.to(split.words, {
            duration: 1.2, stagger: 0.02,
            scrambleText: { text: "{original}", chars: "upperCase", speed: 0.95 },
            onComplete: () => split.revert(),
          });
        },
      });
    });
    // parallax
    $$("[data-parallax]").forEach((el) => {
      if (reduce) return;
      const sp = parseFloat(el.dataset.parallax) || 0.15;
      gsap.fromTo(el, { yPercent: -sp * 50 }, { yPercent: sp * 50, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }

  /* ---------------- Counters / odometer ---------------- */
  function initCounters() {
    $$("[data-count]").forEach((el) => {
      const target = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || "0", 10);
      const pre = el.dataset.prefix || "", suf = "";
      const obj = { v: 0 };
      const plain = el.hasAttribute("data-plain");
      const fmt = (v) => pre + (dec ? v.toFixed(dec) : plain ? String(Math.round(v)) : Math.round(v).toLocaleString());
      el.textContent = fmt(0);
      gsap.to(obj, {
        v: target, duration: reduce ? 0.1 : 2, ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onUpdate() { el.textContent = fmt(obj.v); },
      });
    });
  }

  /* ---------------- Marquee (seamless) ---------------- */
  function initMarquee() {
    $$(".marquee").forEach((m) => {
      const track = $(".marquee__track", m);
      if (!track) return;
      track.innerHTML += track.innerHTML; // duplicate for seamless loop
      const speed = parseFloat(m.dataset.speed || "60"); // px/s
      const w = track.scrollWidth / 2;
      m.style.setProperty("--dur", w / speed + "s");
    });
  }

  /* ---------------- Magnetic ---------------- */
  function initMagnetic() {
    if (reduce || window.innerWidth < 900) return;
    $$("[data-magnetic]").forEach((el) => {
      const str = parseFloat(el.dataset.magnetic) || 0.3;
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * str, y: (e.clientY - r.top - r.height / 2) * str, duration: 0.5, ease: "power3.out" });
      });
      el.addEventListener("mouseleave", () => gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1,0.4)" }));
    });
  }

  /* ---------------- Interactive dots grid (osmo/InertiaPlugin) ---------------- */
  function initDots() {
    if (reduce || window.matchMedia("(hover: none)").matches) return;
    $$("[data-dots]").forEach((container) => {
      const base = getComputedStyle(container).getPropertyValue("--dot-base").trim() || "#26405a";
      const active = getComputedStyle(container).getPropertyValue("--dot-active").trim() || "#c1922f";
      const threshold = 170, maxSpeed = 4500;
      let dots = [], centers = [], inView = false, dirty = true;
      function build() {
        container.innerHTML = "";
        dots = []; centers = [];
        const dotPx = parseFloat(getComputedStyle(container).fontSize) || 4;
        const gap = dotPx * 3;
        const cols = Math.floor((container.clientWidth + gap) / (dotPx + gap));
        const rows = Math.floor((container.clientHeight + gap) / (dotPx + gap));
        for (let i = 0; i < cols * rows; i++) {
          const d = document.createElement("div"); d.className = "dot";
          gsap.set(d, { x: 0, y: 0, backgroundColor: base }); d._i = false;
          container.appendChild(d); dots.push(d);
        }
        container.style.setProperty("--cols", cols);
        dirty = true; recenter();
      }
      function recenter() {
        if (!dirty) return; dirty = false;
        requestAnimationFrame(() => {
          centers = dots.map((d) => { const r = d.getBoundingClientRect(); return { el: d, x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
        });
      }
      build();
      window.addEventListener("resize", build);
      // recompute viewport-space centers whenever the page scrolls (they move with scroll)
      const markDirty = () => { dirty = true; if (inView) recenter(); };
      (window.lenisRef ? window.lenisRef.on("scroll", markDirty) : window.addEventListener("scroll", markDirty, { passive: true }));
      ScrollTrigger.create({ trigger: container.closest("section") || container, start: "top bottom", end: "bottom top",
        onToggle: (self) => { inView = self.isActive; if (inView) { dirty = true; recenter(); } } });
      setTimeout(() => { dirty = true; recenter(); }, 400); // after loader releases layout

      let lt = 0, lx = 0, ly = 0, raf = 0;
      window.addEventListener("mousemove", (e) => {
        if (!inView || !centers.length) return;
        if (raf) return;
        const cx = e.clientX, cy = e.clientY;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const now = performance.now(), dt = now - lt || 16;
          const sp = Math.min(Math.hypot(cx - lx, cy - ly) / dt * 1000, maxSpeed);
          lt = now; lx = cx; ly = cy;
          for (const c of centers) {
            const dist = Math.hypot(c.x - cx, c.y - cy);
            if (dist < threshold) {
              const el = c.el;
              if (!el._i) { el._i = true; gsap.to(el, { backgroundColor: active, duration: 0.2, onComplete: () => gsap.to(el, { backgroundColor: base, duration: 1.4, onComplete: () => (el._i = false) }) }); }
              if (sp > 90) { const push = (threshold - dist) / threshold; const ang = Math.atan2(c.y - cy, c.x - cx); gsap.to(el, { inertia: { x: Math.cos(ang) * push * 16, y: Math.sin(ang) * push * 16 } }); gsap.to(el, { x: 0, y: 0, duration: 1.2, ease: "elastic.out(1,0.5)", delay: 0.05 }); }
            }
          }
        });
      }, { passive: true });
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

  /* ---------------- Testimonials slider ---------------- */
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

  /* ---------------- Hero media parallax ---------------- */
  function initHero() {
    const hero = $(".hero");
    if (!hero) return;
    document.body.classList.add("hero-live");
    const media = $(".hero__media img, .hero__media video", hero);
    if (media && !reduce) gsap.to(media, { yPercent: 16, scale: 1.14, ease: "none", scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true } });
  }

  /* =============================================================
     Data-driven renderers
     ============================================================= */
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
        a.dataset.cursor = "view"; a.dataset.cursorLabel = "View";
        a.innerHTML = `
          <span class="pcard__num mono">P/${String(n + 1).padStart(2, "0")}</span>
          <div class="pcard__media"><img src="${IMG(p.cover)}" alt="${p.title}" loading="lazy"></div>
          <div class="pcard__body">
            <div><span class="pcard__tag">${p.tag}</span><h3 class="pcard__title">${p.title}</h3><div class="pcard__loc">${p.city} · ${p.style} · ${p.year}</div></div>
            <span class="pcard__go" aria-hidden="true">↗</span>
          </div>`;
        grid.appendChild(a);
      });
      window._rebindCursor && window._rebindCursor();
      const cards = $$(".pcard", grid);
      if (reduce) { gsap.set(cards, { opacity: 1, y: 0 }); return; }
      gsap.set(cards, { opacity: 0, y: 46 });
      ScrollTrigger.batch(cards, { start: "top 92%", onEnter: (b) => gsap.to(b, { opacity: 1, y: 0, duration: 0.8, ease: "kashi", stagger: 0.06, overwrite: true }) });
      ScrollTrigger.refresh();
    }
    // filters
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
      a.dataset.revealItem = ""; a.dataset.cursor = "view";
      a.innerHTML = `
        <span class="pcard__num mono">0${n + 1}</span>
        <div class="pcard__media"><img src="${IMG(p.cover)}" alt="${p.title}" loading="lazy"></div>
        <div class="pcard__body">
          <div><span class="pcard__tag">${p.tag}</span><h3 class="pcard__title">${p.title}</h3><div class="pcard__loc">${p.city} · ${p.style}</div></div>
          <span class="pcard__go">↗</span></div>`;
      grid.appendChild(a);
    });
    window._rebindCursor && window._rebindCursor();
  }

  function renderProjectDetail() {
    const root = $("[data-project-detail]");
    if (!root || !R.projects) return;
    const slug = new URLSearchParams(location.search).get("slug");
    const p = R.projects.find((x) => x.slug === slug) || R.projects[0];
    document.title = `${p.title} — Kashi Organization`;
    const specRows = Object.entries(p.specs).map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");
    const gallery = p.gallery.map((g, i) => `<figure class="pd-gitem ${i % 3 === 0 ? "wide" : ""} img-reveal"><img src="${IMG(g)}" alt="${p.style} interior/exterior in the style of ${p.title}" loading="lazy"></figure>`).join("");
    // next project
    const idx = R.projects.indexOf(p); const next = R.projects[(idx + 1) % R.projects.length];
    root.innerHTML = `
      <header class="pd-hero">
        <div class="pd-hero__media"><img src="${IMG(p.cover)}" alt="${p.title}"></div>
        <div class="wrap pd-hero__inner">
          <a href="projects.html" class="tlink" style="color:var(--paper)"><span class="ar">←</span> All projects</a>
          <span class="pcard__tag" style="margin-top:auto">${p.tag}</span>
          <h1 class="h1 display">${p.title}</h1>
          <div class="pd-hero__meta mono">${p.city} &nbsp;·&nbsp; ${p.style} &nbsp;·&nbsp; ${p.year} &nbsp;·&nbsp; ${p.photos} frames</div>
        </div>
      </header>
      <section class="section wrap pd-intro">
        <div class="pd-intro__grid">
          <div><span class="eyebrow">Overview</span><p class="lead mt-s" data-reveal="lines">${p.blurb}</p></div>
          <dl class="spec pd-spec">${specRows}</dl>
        </div>
      </section>
      <section class="wrap" style="padding-top:clamp(16px,2vw,26px)"><span class="repnote">Photography representative of Kashi's work — project details are documented</span></section>
      <section class="wrap pd-gallery">${gallery}</section>
      <section class="section wrap">
        <div class="rowline"><span class="eyebrow eyebrow--plain">Next project</span></div>
        <a href="project.html?slug=${next.slug}" class="pd-next" data-cursor="view">
          <div class="pd-next__media"><img src="${IMG(next.cover)}" alt="${next.title}" loading="lazy"></div>
          <div class="pd-next__body"><span class="pcard__tag">${next.tag}</span><h2 class="h2 display">${next.title}</h2><span class="tlink">View project <span class="ar">→</span></span></div>
        </a>
      </section>`;
    window._rebindCursor && window._rebindCursor();
  }

  /* ---------------- Contact form ---------------- */
  function initForm() {
    const form = $("[data-contact]");
    if (!form) return;
    const ok = $(".form__ok", form);
    const btnSpan = () => { const b = $("button[type=submit] span", form); return b; };
    const succeed = () => {
      form.classList.add("is-sent");
      if (ok) { ok.setAttribute("role", "status"); ok.setAttribute("tabindex", "-1"); ok.focus(); }
      const s = btnSpan(); if (s) s.textContent = "Send inquiry";
      form.reset();
    };
    const mailtoFallback = () => {
      const g = (n) => (form.querySelector("#" + n) || {}).value || "";
      const body = `Name: ${g("name")}\nEmail: ${g("email")}\nPhone: ${g("phone")}\nType: ${g("type")}\nLocation: ${g("location")}\n\n${g("message")}`;
      const href = `mailto:${form.dataset.mailto || "info@kashiorganization.com"}?subject=${encodeURIComponent("Project inquiry — " + g("name"))}&body=${encodeURIComponent(body)}`;
      window.location.href = href;
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
        f.classList.toggle("err", bad);
        input.setAttribute("aria-invalid", String(bad));
        if (msg) { msg.textContent = bad ? (input.dataset.err || "Required") : ""; if (!msg.id) msg.id = input.id + "-msg"; input.setAttribute("aria-describedby", msg.id); }
        if (bad) { valid = false; firstBad = firstBad || input; }
      });
      if (!valid) { firstBad && firstBad.focus(); return; }
      const s = btnSpan(); if (s) s.textContent = "Sending…";
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
          .then((r) => { if (r.ok) succeed(); else throw new Error("bad status"); })
          .catch(() => mailtoFallback());
      } else {
        // No backend wired — open the visitor's mail client so the lead is never lost.
        setTimeout(mailtoFallback, 300);
      }
    });
  }

  /* ---------------- Boot ---------------- */
  function boot() {
    // render data first (so reveals see the DOM)
    renderFeatured();
    renderProjects();
    renderProjectDetail();
    initLenis();
    initCursor();
    initNav();
    initMarquee();
    initHero();
    initDots();
    initAccordion();
    initTesti();
    initForm();
    initMagnetic();
    // reveals + counters after fonts to avoid line-split reflow
    const start = () => { initReveals(); initCounters(); ScrollTrigger.refresh(); };
    document.fonts && document.fonts.ready ? document.fonts.ready.then(start) : start();
    setTimeout(() => ScrollTrigger.refresh(), 800);
    window.__kashiBooted = true;
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLoader(boot);
  });
})();
