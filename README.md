# Kashi Organization — Website

A design-forward marketing site for **Kashi Organization, Inc.**, a custom-home
builder and real-estate developer on the Palos Verdes Peninsula (South Bay, Los
Angeles). Built as a fully static, self-contained site with award-grade motion.

**Live pages:** Home · Projects · Project detail · Services · About · Contact

## Design & tech

- **Design language** adapted from Vaulk (vaulk.com, Awwwards Site-of-the-Day by
  LEOLEO): HUD corner-tick detailing, mono technical labels, fluid `vw` spacing off
  an 8px / 1440px reference, near-zero radii, ambient technical grid — re-skinned
  to Kashi's brand: deep navy, antique gold and warm bone, sampled from the lion
  emblem, with an elegant **Fraunces** serif display, **Inter** body, **Chivo Mono**
  labels.
- **Motion:** [GSAP 3.13](https://gsap.com) (ScrollTrigger, SplitText,
  ScrambleText, Inertia, Flip, CustomEase) + [Lenis](https://lenis.darkroom.engineering)
  smooth scroll. Preloader, masked line reveals, per-character scramble, seamless
  marquee, custom cursor, interactive dot-grid, number odometers, parallax,
  magnetic buttons, sticky process steps.
- **No build step.** Plain HTML/CSS/JS. All vendor JS and fonts are **self-hosted**
  under `assets/` — the site has zero external runtime dependencies and works
  offline. Deploys to any static host at any path (relative URLs throughout).

## Structure

```
index.html  projects.html  project.html  services.html  about.html  contact.html  404.html
assets/
  css/    tokens.css · app.css · pages.css · fonts.css · vendor/lenis.css
  js/     data.js (all content) · app.js (motion engine) · vendor/ (GSAP, Lenis)
  fonts/  self-hosted woff2 (Fraunces / Inter / Chivo Mono)
  img/    brand/ (kashi-emblem.png, kashi-lockup.png) · projects/ (photography)
```

All site copy and data live in **`assets/js/data.js`** (company facts, projects,
testimonials, services, process, FAQ). The projects grid and project-detail pages
are rendered from that data; the rest is authored in the page HTML.

## Data provenance

Company facts were independently verified against primary sources: **CSLB #998954**
(Class B General Building, active, zero complaints), CA Secretary of State (entity
filed **2006**), Redfin/Zillow (flagship **322 Manhattan Ave** — built 2016, 4,477
sq ft, sold $5.4M), and BuildZoom (score 92). Testimonials are the company's own
5.0-rated Houzz reviews. Location is framed as the **Palos Verdes Peninsula / South
Bay** (records split across Palos Verdes Estates, Rolling Hills and Redondo Beach).

### A note on photography

Kashi's real project galleries live on Houzz, which is protected by an
anti-bot challenge (PerimeterX) that blocks automated access. Rather than ship
broken hotlinks, the site uses **premium, license-free architectural photography
(Unsplash) curated to match each documented build's real style and location**
(contemporary, coastal, traditional, Mediterranean). Every image is self-hosted in
`assets/img/projects/` and mapped to a project in `data.js`, so swapping in Kashi's
actual photos later is a one-line change per image. The two brand logos are the
real Kashi emblem (`kashi-emblem.png`, used in the nav/loader) and the full lockup
(`kashi-lockup.png`, used in the footer).

## Run locally

```bash
python3 -m http.server 8080     # then open http://127.0.0.1:8080
```

## Deploy

Static — deploy the repository root to any static host (GitHub Pages, Vercel,
Cloudflare Pages, Netlify). No build command; output directory is the repo root.
A `.nojekyll` file is included so GitHub Pages serves all asset folders verbatim.
