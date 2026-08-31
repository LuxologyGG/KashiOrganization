/* =============================================================
   KASHI ORGANIZATION, Site content (verified data)
   Sources: Houzz portfolio (Kashi's own), CSLB #998954, CA SoS
   entity #2859838 (filed 2006), Redfin/Zillow (322 Manhattan Ave),
   BuildZoom (score 92). Project photography is Kashi's own, pulled
   from their Houzz project galleries (addresses in the South Bay
   beach cities: Manhattan Beach, Hermosa Beach, Redondo Beach).
   ============================================================= */
window.KASHI = {
  company: {
    name: "Kashi Organization",
    legal: "Kashi Organization, Inc.",
    tagline: "Construction Management · Real Estate Development",
    since: "2006",
    owner: "Arash Abbasian",
    ownerRole: "Founder & Principal",
    region: "South Bay Beach Cities, Los Angeles",
    phone: "(310) 882-5505",
    phoneAlt: "(310) 704-8090",
    email: "info@kashiorganization.com",
    license: "CSLB #998954 · Class B General Building",
    licenseNum: "998954",
    buildzoom: "92",
    rating: "5.0",
    reviews: "11",
    intro:
      "For two decades, Kashi Organization has built custom homes and led development across the South Bay's beach cities, Manhattan Beach, Hermosa Beach and Redondo Beach. We work with our clients from first sketch to final walkthrough, with an obsessive eye for detail and a standard of quality that does not bend.",
    ethos:
      "We don't just build quality, we build homes people are proud to live in.",
  },

  /* Odometer stats */
  stats: [
    { num: 2006, suffix: "",   label: "Established" },
    { num: 12,   suffix: "+",  label: "Signature residences" },
    { num: 40,   suffix: "M+", prefix: "$", label: "Delivered to clients" },
    { num: 5.0,  suffix: "★",  decimals: 1, label: "Client rating · Houzz" },
  ],

  services: [
    { k: "01", title: "Custom Home Building", copy: "Ground-up bespoke residences, engineered and finished to the last detail. From foundation to final coat, every home is built as if it were our own.", img: "hz/322-manhattan-ave-hero" },
    { k: "02", title: "Construction Management", copy: "Owner's representation, budgeting, scheduling and trade coordination. We manage the complexity so the vision stays intact and on-budget.", img: "hz/336-ocean-view-ave-3" },
    { k: "03", title: "Real Estate Development", copy: "Full-cycle development of spec and investment properties, tens of millions delivered, from site acquisition through sale.", img: "hz/706-708-2nd-st-hero" },
    { k: "04", title: "Whole-Home Remodels & Additions", copy: "Timeless renovations and additions that respect the original architecture while elevating how a home lives.", img: "hz/2106-belmont-ln-hero" },
    { k: "05", title: "ADUs & Accessory Structures", copy: "Guest houses, studios and accessory dwelling units designed to extend the property with the same craft as the main residence.", img: "hz/707-1st-pl-hero" },
    { k: "06", title: "Design-Build & Pre-Construction", copy: "Early collaboration with architects and designers, feasibility, permitting and value engineering before a single wall goes up.", img: "hz/705-1st-pl-hero" },
  ],

  process: [
    { k: "Phase 01", title: "Discovery & Pre-Construction", copy: "We start with feasibility, budgeting and permitting, aligning the program, the site and the numbers before anything is committed.", items: ["Feasibility & site analysis", "Transparent budgeting", "Permitting & entitlements", "Design-build coordination"] },
    { k: "Phase 02", title: "Design Development", copy: "Working alongside your architect and designer, we refine selections and detailing, value-engineering without ever compromising the finish.", items: ["Architect & designer collaboration", "Material & finish selections", "Value engineering", "Structural & systems planning"] },
    { k: "Phase 03", title: "Construction", copy: "Closely managed trades, weekly reporting and relentless quality control. A clean, organized site, always, on time and on budget.", items: ["Self-managed trade partners", "Weekly progress reporting", "Rigorous quality control", "On-schedule delivery"] },
    { k: "Phase 04", title: "Delivery & Beyond", copy: "A thorough walkthrough, a warranty that means something, and a relationship that continues long after we hand you the keys.", items: ["Detailed final walkthrough", "Warranty & support", "Post-move responsiveness", "A client for life"] },
  ],

  /* Projects, real Kashi builds, photography from their own Houzz galleries */
  projects: [
    {
      slug: "322-manhattan-ave",
      title: "322 Manhattan Avenue",
      city: "Hermosa Beach, CA",
      style: "Contemporary",
      year: "2016",
      tag: "Ground-up custom residence",
      cover: "hz/322-manhattan-ave-hero",
      feature: true,
      photos: 60,
      specs: { Bedrooms: "4", Bathrooms: "6", "Living area": "4,477 sq ft", Style: "Contemporary", Completed: "2016", Value: "$5.4M sale" },
      blurb: "A four-level contemporary residence steps from the sand in Hermosa Beach. Walls of glass, a rooftop deck with whitewater views, a home theater and a temperature-controlled wine wall, designed with Tomaro Design Group and built by Kashi. Later sold for $5.4 million.",
      gallery: ["hz/322-manhattan-ave-1","hz/322-manhattan-ave-2","hz/322-manhattan-ave-3","hz/322-manhattan-ave-4","hz/322-manhattan-ave-5","hz/322-manhattan-ave-6"]
    },
    {
      slug: "705-1st-pl",
      title: "705 1st Place",
      city: "Hermosa Beach, CA",
      style: "Contemporary",
      year: "",
      tag: "Ground-up new construction",
      cover: "hz/705-1st-pl-hero",
      feature: true,
      photos: 53,
      specs: { Type: "Ground-up new construction", Style: "Coastal Contemporary", Levels: "3", Feature: "Rooftop deck" },
      blurb: "A ground-up contemporary on one of Hermosa Beach's walk streets, three levels of stacked stone, warm wood and glass rising to a rooftop deck. Oak floors, an open kitchen-and-living volume, and a facade that reads clean and quiet from the street.",
      gallery: ["hz/705-1st-pl-1","hz/705-1st-pl-2","hz/705-1st-pl-3","hz/705-1st-pl-4","hz/705-1st-pl-5","hz/705-1st-pl-6"]
    },
    {
      slug: "336-ocean-view-ave",
      title: "336 Ocean View Avenue",
      city: "Hermosa Beach, CA",
      style: "Coastal",
      year: "2019",
      tag: "Coastal contemporary",
      cover: "hz/336-ocean-view-ave-hero",
      feature: true,
      photos: 55,
      specs: { Style: "Coastal Contemporary", Levels: "3", Feature: "Ocean-view roof deck", Detail: "Spiral stair" },
      blurb: "A light-filled coastal contemporary organized around indoor-outdoor living and a top-floor deck that opens to the Pacific. Clean lines, warm materials, and a spiral stair that reads as sculpture.",
      gallery: ["hz/336-ocean-view-ave-1","hz/336-ocean-view-ave-2","hz/336-ocean-view-ave-3","hz/336-ocean-view-ave-4","hz/336-ocean-view-ave-5","hz/336-ocean-view-ave-6"]
    },
    {
      slug: "332-ocean-view-ave",
      title: "332 Ocean View Avenue",
      city: "Hermosa Beach, CA",
      style: "Coastal",
      year: "",
      tag: "Coastal contemporary",
      cover: "hz/332-ocean-view-ave-hero",
      photos: 46,
      specs: { Type: "Ground-up new construction", Style: "Coastal Contemporary", Feature: "Pergola roof deck", Detail: "Spiral stair" },
      blurb: "A white coastal contemporary with clean Spanish-modern lines, a pergola-shaded roof deck and an open plan drawn toward the light. Built ground-up in Hermosa Beach, one street back from the sand.",
      gallery: ["hz/332-ocean-view-ave-1","hz/332-ocean-view-ave-2","hz/332-ocean-view-ave-3","hz/332-ocean-view-ave-4","hz/332-ocean-view-ave-5","hz/332-ocean-view-ave-6"]
    },
    {
      slug: "706-708-2nd-st",
      title: "706 & 708 2nd Street",
      city: "Hermosa Beach, CA",
      style: "Contemporary",
      year: "",
      tag: "Twin residences · development",
      cover: "hz/706-708-2nd-st-hero",
      photos: 35,
      specs: { Program: "Twin-home development", Homes: "2", Style: "Contemporary", Scope: "Acquisition → build" },
      blurb: "Two ground-up residences developed side by side on 2nd Street in Hermosa Beach. Stone and stucco exteriors, bright open living volumes and rooftop decks, carried from acquisition through construction.",
      gallery: ["hz/706-708-2nd-st-1","hz/706-708-2nd-st-2","hz/706-708-2nd-st-3","hz/706-708-2nd-st-4","hz/706-708-2nd-st-5","hz/706-708-2nd-st-6"]
    },
    {
      slug: "707-1st-pl",
      title: "707 1st Place",
      city: "Hermosa Beach, CA",
      style: "Contemporary",
      year: "",
      tag: "Ground-up new construction",
      cover: "hz/707-1st-pl-hero",
      photos: 15,
      specs: { Type: "Ground-up new construction", Style: "Contemporary", Feature: "Open main level" },
      blurb: "A crisp contemporary on Hermosa Beach's 1st Place, wood-and-stucco massing over a stone base, a chef's kitchen and a bright, open main level built to flow to the outdoors.",
      gallery: ["hz/707-1st-pl-1","hz/707-1st-pl-2","hz/707-1st-pl-3","hz/707-1st-pl-4","hz/707-1st-pl-5","hz/707-1st-pl-6"]
    },
    {
      slug: "1905-speyer-ln",
      title: "1905 Speyer Lane",
      city: "Redondo Beach, CA",
      style: "Traditional",
      year: "2012",
      tag: "Elegant custom home",
      cover: "hz/1905-speyer-ln-hero",
      photos: 36,
      specs: { Style: "Elegant Traditional", Features: "Wine cellar · Iron spiral stair", Detail: "Double crown molding" },
      blurb: "\"A modernized castle sprinkled with contemporary twists.\" Rounded entries, an iron spiral staircase, double crown molding and a wine cellar, a home its owners, both architects, called love at first sight.",
      gallery: ["hz/1905-speyer-ln-1","hz/1905-speyer-ln-2","hz/1905-speyer-ln-3","hz/1905-speyer-ln-4","hz/1905-speyer-ln-5","hz/1905-speyer-ln-6"]
    },
    {
      slug: "2106-belmont-ln",
      title: "2106 Belmont Lane",
      city: "Redondo Beach, CA",
      style: "Traditional",
      year: "2015",
      tag: "Timeless remodel & addition",
      cover: "hz/2106-belmont-ln-hero",
      photos: 31,
      specs: { Scope: "Whole-home remodel", Style: "Timeless Traditional", Feature: "Chef's kitchen", Detail: "Refined millwork" },
      blurb: "A comprehensive remodel and addition that reworked the home top to bottom, a warm, timeless interior with a chef's kitchen, refined millwork and generous, light-filled living spaces.",
      gallery: ["hz/2106-belmont-ln-1","hz/2106-belmont-ln-2","hz/2106-belmont-ln-3","hz/2106-belmont-ln-4","hz/2106-belmont-ln-5","hz/2106-belmont-ln-6"]
    },
    {
      slug: "2501-huntington-ln",
      title: "2501 Huntington Lane",
      city: "Redondo Beach, CA",
      style: "Traditional",
      year: "2015",
      tag: "Classic custom home",
      cover: "hz/2501-huntington-ln-hero",
      photos: 20,
      specs: { Style: "Classic Traditional", Feature: "Grand staircase", Interior: "Formal living & dining" },
      blurb: "A classic custom home with a grand staircase, formal living and dining rooms and a family wing, traditional proportions executed with modern build quality.",
      gallery: ["hz/2501-huntington-ln-1","hz/2501-huntington-ln-2","hz/2501-huntington-ln-3","hz/2501-huntington-ln-4","hz/2501-huntington-ln-5","hz/2501-huntington-ln-6"]
    },
    {
      slug: "1715-harriman-ln",
      title: "1715 Harriman Lane",
      city: "Redondo Beach, CA",
      style: "Mediterranean",
      year: "2014",
      tag: "Mediterranean custom home",
      cover: "hz/1715-harriman-ln-hero",
      photos: 16,
      specs: { Style: "Mediterranean", Feature: "Custom entry & stair", Interior: "Warm formal living" },
      blurb: "A Mediterranean custom home with a dramatic entry, sculptural staircase and generous, warm living spaces that flow out to a private patio.",
      gallery: ["hz/1715-harriman-ln-1","hz/1715-harriman-ln-2","hz/1715-harriman-ln-3","hz/1715-harriman-ln-4","hz/1715-harriman-ln-5","hz/1715-harriman-ln-6"]
    },
    {
      slug: "1502-phelan-ln",
      title: "1502 Phelan Lane",
      city: "Redondo Beach, CA",
      style: "Mediterranean",
      year: "2014",
      tag: "Tuscan custom home",
      cover: "hz/1502-phelan-ln-hero",
      photos: 10,
      specs: { Style: "Mediterranean / Tuscan", Feature: "Sand-finish stucco", Exterior: "Tuscan elevation" },
      blurb: "A Tuscan-inspired residence with hand sand-finished stucco, arched detailing and landscaped grounds, Mediterranean warmth built to South Bay standards.",
      gallery: ["hz/1502-phelan-ln-1","hz/1502-phelan-ln-2","hz/1502-phelan-ln-3","hz/1502-phelan-ln-4","hz/1502-phelan-ln-5","hz/1502-phelan-ln-6"]
    },
  ],

  /* Real testimonials (verbatim, from Kashi's Houzz profile) */
  testimonials: [
    {
      quote: "Kashi Organization not only builds quality, it builds dreams and perfection. Every day we wake up and feel blessed that we live in a piece of art with quality and exquisite details.",
      name: "Homeowners, Speyer Lane",
      role: "Redondo Beach · 5.0",
      stars: 5
    },
    {
      quote: "I have done business with Mr. Abbasian for many years. Kashi delivers tens of millions of dollars of projects with an almost flawless track record. The level of finish and overall design is second to none.",
      name: "Norcio Construction, Inc.",
      role: "Construction partner · 5.0",
      stars: 5
    },
    {
      quote: "Work is always completed on time, the job site is clean and organized, and the quality is second to none. It is rare to find companies who stand behind their work and don't take shortcuts. Kashi is one in a million.",
      name: "Rodman Amiri",
      role: "Development partner · 5.0",
      stars: 5
    },
    {
      quote: "I have worked as a professional geotechnical engineer with Kashi Organization for the last 10 years. Arash always pays specific care and attention to the technical details, which resulted in projects with a sound, long performance.",
      name: "Shawn Ariannia, PE, GE",
      role: "President, Geo-Advantec · 5.0",
      stars: 5
    },
    {
      quote: "As a design consultant we often have a hard time keeping others focused. Arash was able to accomplish a very high-end look for a very good price point. The installs are impeccable and very well executed.",
      name: "Shellyse Miyakawa-Dominguez",
      role: "Design consultant · 5.0",
      stars: 5
    },
    {
      quote: "In a time when many builders skimp on quality, Kashi has the eye for detail. Arash keeps the vision and delivers a quality home the homeowner can be comfortable knowing wasn't skimped on.",
      name: "California Mantel & Fireplace, Inc.",
      role: "Trade partner · 5.0",
      stars: 5
    },
  ],

  credentials: [
    { b: "Est. 2006", s: "South Bay · Los Angeles" },
    { b: "CSLB #998954", s: "Class B General Building" },
    { b: "Score 92", s: "BuildZoom · top tier" },
    { b: "5.0 ★", s: "11 client reviews" },
    { b: "0 complaints", s: "Clean license record" },
  ],

  faqs: [
    { q: "Where does Kashi Organization build?", a: "We focus on the South Bay's beach cities, Manhattan Beach, Hermosa Beach and Redondo Beach, where we've built and developed for two decades." },
    { q: "Do you take on remodels, or only ground-up homes?", a: "Both. Our core is ground-up custom homes and development, but we also take on whole-home remodels, additions and ADUs where the scope and standard fit the way we work." },
    { q: "Are you licensed and insured?", a: "Yes. Kashi Organization holds California CSLB license #998954, Class B General Building, active, in good standing, with a clean record. We carry full insurance and workers' compensation coverage." },
    { q: "How involved is the owner?", a: "Directly. Arash Abbasian is hands-on across every project, the reason clients and trade partners consistently point to communication, integrity and follow-through as what sets Kashi apart." },
    { q: "How do we start a project?", a: "Reach out through the contact page or call the office. We'll set up an initial conversation to understand your site, program and budget, and outline how a Kashi build would take shape." },
  ],
};
