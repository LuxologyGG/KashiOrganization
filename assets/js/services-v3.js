/* =============================================================
   KASHI · services.html v3 - interactive hover-preview index
   Builds the two-column index (left list + sticky image stage)
   and the <768 stacked cards from window.KASHI.services.
   Hover / focus a row → cross-fade its image into the stage
   (subtle scale, adapted from osmo image-to-background-zoom),
   dim the other rows, reveal the copy over a progressive blur.
   Degrades gracefully: no gsap → static; reduced-motion → no tweens.
   ============================================================= */
(function () {
  "use strict";
  if (!window.gsap) return;
  var K = window.KASHI;
  if (!K || !Array.isArray(K.services) || !K.services.length) return;
  var mount = document.getElementById("svc-panel");
  if (!mount) return;

  var reduce = false;
  try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}
  var gsap = window.gsap;
  var IMG = function (n) { return "assets/img/projects/" + n + ".jpg"; };
  var esc = function (s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  };
  var S = K.services;
  var total = String(S.length).padStart(2, "0");

  /* ---------------- Build markup ---------------- */
  var rowsHTML = S.map(function (s, i) {
    return '<button class="svc-row' + (i === 0 ? " is-active" : "") + '" type="button" ' +
      'data-i="' + i + '" aria-pressed="' + (i === 0 ? "true" : "false") + '">' +
      '<span class="svc-row__k mono">' + esc(s.k) + '</span>' +
      '<span class="svc-row__title">' + esc(s.title) + '</span>' +
      '<span class="svc-row__go" aria-hidden="true">&#8594;</span>' +
      '</button>';
  }).join("");

  var imgsHTML = S.map(function (s, i) {
    return '<img class="svc-img' + (i === 0 ? " is-active" : "") + '" data-i="' + i + '" ' +
      'src="' + IMG(s.img) + '" alt="' + esc(s.title) + ', a representative Kashi Organization project" ' +
      (i === 0 ? "" : 'loading="lazy" ') + 'decoding="async">';
  }).join("");

  var blurHTML = '<div class="svc-blur" aria-hidden="true">' +
    "12345".split("").map(function (n) { return '<div class="svc-blur__l is--' + n + '"></div>'; }).join("") +
    "</div>";

  var panelHTML =
    '<div class="svc-panel">' +
      '<div class="svc-list">' + rowsHTML + '</div>' +
      '<div class="svc-stage">' +
        '<div class="svc-stage__frame">' +
          '<div class="svc-imgs">' + imgsHTML + '</div>' +
          '<div class="svc-stage__scrim"></div>' +
          blurHTML +
          '<div class="svc-cap" aria-live="polite">' +
            '<span class="svc-cap__k">Service <b data-cap-k>' + esc(S[0].k) + '</b> / ' + total + '</span>' +
            '<h3 class="svc-cap__title" data-cap-title>' + esc(S[0].title) + '</h3>' +
            '<p class="svc-cap__copy" data-cap-copy>' + esc(S[0].copy) + '</p>' +
          '</div>' +
          '<span class="corner-frame"></span>' +
        '</div>' +
      '</div>' +
    '</div>';

  var cardsHTML = '<div class="svc-cards">' + S.map(function (s) {
    return '<article class="svc-card">' +
      '<div class="svc-card__media"><span class="svc-card__k">' + esc(s.k) + '</span>' +
      '<img src="' + IMG(s.img) + '" alt="' + esc(s.title) + ', a representative Kashi Organization project" loading="lazy" decoding="async"></div>' +
      '<div class="svc-card__body">' +
      '<h3 class="svc-card__title">' + esc(s.title) + '</h3>' +
      '<p class="svc-card__copy">' + esc(s.copy) + '</p>' +
      '</div></article>';
  }).join("") + '</div>';

  mount.innerHTML = panelHTML + cardsHTML;

  /* ---------------- Wire the interaction ---------------- */
  var list = mount.querySelector(".svc-list");
  var rows = Array.prototype.slice.call(mount.querySelectorAll(".svc-row"));
  var imgs = Array.prototype.slice.call(mount.querySelectorAll(".svc-img"));
  var frame = mount.querySelector(".svc-stage__frame");
  var capK = mount.querySelector("[data-cap-k]");
  var capT = mount.querySelector("[data-cap-title]");
  var capC = mount.querySelector("[data-cap-copy]");
  var current = 0;

  function paintCaption() {
    var s = S[current];
    if (capK) capK.textContent = s.k;
    if (capT) capT.textContent = s.title;
    if (capC) capC.textContent = s.copy;
  }

  function show(i) {
    if (i === current || i < 0 || i >= S.length) return;
    var prevImg = imgs[current], nextImg = imgs[i];
    current = i;

    rows.forEach(function (r, idx) {
      var on = idx === i;
      r.classList.toggle("is-active", on);
      r.setAttribute("aria-pressed", on ? "true" : "false");
    });

    if (reduce) {
      imgs.forEach(function (im, idx) { im.classList.toggle("is-active", idx === i); });
      paintCaption();
      return;
    }

    // cross-fade images with a subtle zoom on the incoming frame
    if (nextImg) {
      nextImg.classList.add("is-active");
      gsap.fromTo(nextImg, { opacity: 0, scale: 1.07 }, { opacity: 1, scale: 1, duration: 0.85, ease: "kashi", overwrite: "auto" });
    }
    if (prevImg && prevImg !== nextImg) {
      gsap.to(prevImg, { opacity: 0, duration: 0.6, ease: "kashi", overwrite: "auto",
        onComplete: function () { prevImg.classList.remove("is-active"); } });
    }

    // caption swap
    var cap = mount.querySelector(".svc-cap");
    if (cap) {
      gsap.timeline()
        .to(cap, { opacity: 0, y: 8, duration: 0.2, ease: "power2.in" })
        .add(paintCaption)
        .fromTo(cap, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45, ease: "kashi" });
    } else {
      paintCaption();
    }
  }

  function engage() { if (list) list.classList.add("is-engaged"); }

  rows.forEach(function (r) {
    var i = parseInt(r.getAttribute("data-i"), 10) || 0;
    r.addEventListener("mouseenter", function () { engage(); show(i); });
    r.addEventListener("focus", function () { engage(); show(i); });
    r.addEventListener("click", function () { engage(); show(i); });
  });
  if (list) {
    list.addEventListener("mouseleave", function () { list.classList.remove("is-engaged"); });
  }

  /* subtle pointer parallax on the active image (desktop, motion-ok) */
  var fine = false;
  try { fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches; } catch (e) {}
  if (frame && !reduce && fine) {
    var xTo = gsap.quickTo(".svc-imgs", "xPercent", { duration: 0.6, ease: "power3.out" });
    var yTo = gsap.quickTo(".svc-imgs", "yPercent", { duration: 0.6, ease: "power3.out" });
    frame.addEventListener("mousemove", function (e) {
      var b = frame.getBoundingClientRect();
      var dx = (e.clientX - b.left) / b.width - 0.5;
      var dy = (e.clientY - b.top) / b.height - 0.5;
      xTo(dx * -2.4); yTo(dy * -2.4);
    });
    frame.addEventListener("mouseleave", function () { xTo(0); yTo(0); });
  }

  /* stage intro reveal (self-managed; visible by default if this never runs) */
  if (!reduce && window.ScrollTrigger) {
    gsap.from(frame, {
      clipPath: "inset(0 0 100% 0)", duration: 1.1, ease: "kashi",
      scrollTrigger: { trigger: frame, start: "top 88%", once: true }
    });
  }

  paintCaption();
})();
