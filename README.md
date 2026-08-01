# Kashi Organization, Inc. Website

A static, self-contained marketing site for **Kashi Organization, Inc.**, a real estate developer and custom-home
builder in the South Bay beach cities of Los Angeles.

## Structure (v3)

The site is organized around the company and its two divisions, per client direction:

```
Kashi Organization, Inc.
  01  Real Estate Development     <- launch focus
  02  Construction Management     <- being expanded
```

It is a **single scrolling page**. The opening is a clean white ground where the Kashi emblem begins small and
centered, grows until it fills most of the screen, and fades back to a semi-transparent watermark, leaving the
two divisions in the foreground as the primary navigation. From there the page flows: Development, Construction
Management, the company, contact.

**Division 01** carries five projects, each a scroll chapter with the client's own story:

| # | Project | Location |
|---|---|---|
| 01 | South of the Pier | Hermosa Beach |
| 02 | The Glass House on the Hill | Redondo Beach |
| 03 | The Modern Farmhouse | Manhattan Beach |
| 04 | The Lockdown House | Manhattan Beach |
| 05 | The Brick House | Palos Verdes Estates |

Ordered as a narrative arc rather than chronologically: origin, craft, distinction, conviction, personal.

## Design & tech

- **Type:** Clash Display (display), General Sans (body), Chivo Mono (labels), all self-hosted woff2.
- **Palette:** white ground, warm near-black ink, bronze accent, near-zero radii, mono technical labels and
  corner-tick detailing.
- **Motion:** [GSAP 3.13](https://gsap.com) (ScrollTrigger, CustomEase) +
  [Lenis](https://lenis.darkroom.engineering) smooth scroll. The emblem bloom, masked reveals, per-chapter
  image parallax, and a nav that appears once the intro is behind you. Every effect has a reduced-motion
  fallback; the intro settles instantly when motion is reduced.
- **No build step.** Plain HTML/CSS/JS. All vendor JS and fonts are **self-hosted** under `assets/`, so the site
  has zero external runtime dependencies, works offline, and deploys to any static host at any path.

## Structure on disk

```
index.html          the entire site
404.html
assets/
  css/   tokens.css · v3.css · fonts.css · brutal-fonts.css · vendor/lenis.css
         (app.css · pages.css · osmo.css · *-v3.css are retained for the /v2/ archive)
  js/    data-v3.js (all v3 content) · v3.js (motion engine) · vendor/ (GSAP, Lenis)
  img/   brand/ (emblem, emblem-lg, lockup) · projects/
  fonts/ self-hosted woff2
v1/     the original navy/gold design, noindexed
v2/     the brutalist design, noindexed, sharing the root assets
```

All v3 copy and data live in **`assets/js/data-v3.js`**. The project chapters, the Construction Management
capabilities and the credentials are rendered from it at runtime.

## Data provenance

Company facts were verified against primary sources: **CSLB #998954** (Class B General Building, active),
California Secretary of State (entity filed **2006**), and the company's own client reviews.

Project specifications were independently re-verified against LA County Assessor records and MLS aggregators.
Two things worth carrying forward:

- **322 Manhattan Avenue (South of the Pier).** Specs are solid (4 bed / 6 bath, 4,477 sq ft, built 2016).
  The **$5.4M figure that circulated earlier is a resale by a later owner in 2022, not Kashi's sale.** Kashi's
  sale of the new build closed **16 March 2017 at $4.8M**. Sale prices are currently not published on the site.
  The architecture credit that is confirmed is the firm, **Tomaro Design Group**, not an individual.
- **The Lockdown House.** The client's document repeated the Glass House URL for this project, so no address or
  public record is published for it. It could not be independently identified, and it has not been guessed.

Any field that could not be sourced is omitted rather than estimated.

### A note on photography

Four of the five projects use the client's own photography:

- **322 Manhattan Avenue** uses its own set under `assets/img/projects/hz/`.
- **The Glass House, The Modern Farmhouse and The Lockdown House** use the eight images embedded in the client's
  Word document, extracted and cropped free of the screenshot chrome they arrived in, under
  `assets/img/projects/kashi/`. These cap out around 1400 x 950 px because they were screen captures rather than
  original files. The originals exist (one capture shows `412SFrancisca_HiRes (10 of 99).jpg`) and are the
  outstanding ask.
- **The Brick House** is the only project still on curated license-free stand-ins. It carries a visible
  "representative imagery" caption and its alt text says so.

Every image is a slug in `data-v3.js`, so replacing one is a single-line change.

## Run locally

```bash
python3 -m http.server 8080     # then open http://127.0.0.1:8080
```

## Deploy

Static. Deploy the repository root to any static host (GitHub Pages, Vercel, Cloudflare Pages, Netlify). No
build command; the output directory is the repo root. A `.nojekyll` file is included so GitHub Pages serves all
asset folders verbatim.
