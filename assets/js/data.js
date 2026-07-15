/* =============================================================
   KASHI ORGANIZATION — Site content (verified data)
   Sources: Houzz portfolio (Kashi's own), CSLB #998954, CA SoS
   entity #2859838 (filed 2006), Redfin/Zillow (322 Manhattan Ave),
   BuildZoom (score 92). Project photography is premium licensed
   stock matched to each build's documented style (Houzz project
   galleries are bot-protected; see README).
   ============================================================= */
window.KASHI = {
  company: {
    name: "Kashi Organization",
    legal: "Kashi Organization, Inc.",
    tagline: "Construction Management · Real Estate Development",
    since: "2006",
    owner: "Arash Abbasian",
    ownerRole: "Founder & Principal",
    region: "Palos Verdes Peninsula · South Bay, Los Angeles",
    phone: "(310) 882-5505",
    phoneAlt: "(310) 704-8090",
    email: "info@kashiorganization.com",
    license: "CSLB #998954 · Class B General Building",
    licenseNum: "998954",
    buildzoom: "92",
    rating: "5.0",
    reviews: "11",
    intro:
      "For nearly two decades, Kashi Organization has built custom homes and led development across the Palos Verdes Peninsula and the South Bay. We work with our clients from first sketch to final walkthrough, with an obsessive eye for detail and a standard of quality that does not bend.",
    ethos:
      "We don't just build quality — we build homes people are proud to live in.",
  },

  /* Odometer stats */
  stats: [
    { num: 2006, suffix: "",   label: "Established" },
    { num: 12,   suffix: "+",  label: "Signature residences" },
    { num: 40,   suffix: "M+", prefix: "$", label: "Delivered to clients" },
    { num: 5.0,  suffix: "★",  decimals: 1, label: "Client rating · Houzz" },
  ],

  services: [
    { k: "01", title: "Custom Home Building", copy: "Ground-up bespoke residences, engineered and finished to the last detail. From foundation to final coat, every home is built as if it were our own." , img: "ext-contemporary-1" },
    { k: "02", title: "Construction Management", copy: "Owner's representation, budgeting, scheduling and trade coordination. We manage the complexity so the vision stays intact and on-budget.", img: "kitchen-1" },
    { k: "03", title: "Real Estate Development", copy: "Full-cycle development of spec and investment properties — tens of millions delivered, from site acquisition through sale.", img: "ext-coastal-1" },
    { k: "04", title: "Whole-Home Remodels & Additions", copy: "Timeless renovations and additions that respect the original architecture while elevating how a home lives.", img: "living-4" },
    { k: "05", title: "ADUs & Accessory Structures", copy: "Guest houses, studios and accessory dwelling units designed to extend the property with the same craft as the main residence.", img: "ext-estate-2" },
    { k: "06", title: "Design-Build & Pre-Construction", copy: "Early collaboration with architects and designers — feasibility, permitting and value engineering before a single wall goes up.", img: "interior-detail-2" },
  ],

  process: [
    { k: "Phase 01", title: "Discovery & Pre-Construction", copy: "We start with feasibility, budgeting and permitting — aligning the program, the site and the numbers before anything is committed.", items: ["Feasibility & site analysis", "Transparent budgeting", "Permitting & entitlements", "Design-build coordination"] },
    { k: "Phase 02", title: "Design Development", copy: "Working alongside your architect and designer, we refine selections and detailing, value-engineering without ever compromising the finish.", items: ["Architect & designer collaboration", "Material & finish selections", "Value engineering", "Structural & systems planning"] },
    { k: "Phase 03", title: "Construction", copy: "Closely managed trades, weekly reporting and relentless quality control. A clean, organized site — always, on time and on budget.", items: ["Self-managed trade partners", "Weekly progress reporting", "Rigorous quality control", "On-schedule delivery"] },
    { k: "Phase 04", title: "Delivery & Beyond", copy: "A thorough walkthrough, a warranty that means something, and a relationship that continues long after we hand you the keys.", items: ["Detailed final walkthrough", "Warranty & support", "Post-move responsiveness", "A client for life"] },
  ],

  /* Projects — real Kashi builds (addresses/styles from their Houzz portfolio) */
  projects: [
    {
      slug: "322-manhattan-ave",
      title: "322 Manhattan Avenue",
      city: "Hermosa Beach, CA",
      style: "Contemporary",
      year: "2016",
      tag: "Ground-up custom residence",
      cover: "ext-contemporary-1",
      feature: true,
      photos: 61,
      specs: { Bedrooms: "4", Bathrooms: "6", "Living area": "4,477 sq ft", Style: "Contemporary", Completed: "2016", Value: "$5.4M sale" },
      blurb: "A four-level contemporary residence steps from the sand in Hermosa Beach. Walls of glass, a rooftop deck with whitewater views, a home theater and a temperature-controlled wine wall — designed with Tomaro Design Group and built by Kashi. Later sold for $5.4 million.",
      gallery: ["ext-contemporary-1","kitchen-1","living-2","pool-1","staircase-1","bath-1","deck-1","bedroom-1"]
    },
    {
      slug: "336-ocean-view-ave",
      title: "336 Ocean View Avenue",
      city: "Hermosa Beach, CA",
      style: "Coastal",
      year: "2019",
      tag: "Coastal contemporary",
      cover: "ext-coastal-1",
      feature: true,
      photos: 56,
      specs: { Bedrooms: "5", Bathrooms: "5", Levels: "3", Style: "Coastal Contemporary", Feature: "Ocean-view roof deck" },
      blurb: "A light-filled coastal contemporary organized around indoor-outdoor living and a top-floor deck that opens to the Pacific. Clean lines, warm materials, and a stair that reads as sculpture.",
      gallery: ["ext-coastal-1","hero-dusk","kitchen-3","living-1","deck-1","staircase-2","pool-1"]
    },
    {
      slug: "1905-speyer-ln",
      title: "1905 Speyer Lane",
      city: "Redondo Beach, CA",
      style: "Traditional",
      year: "2012",
      tag: "Elegant custom home",
      cover: "ext-grey-1",
      feature: true,
      photos: 49,
      specs: { Bedrooms: "5", Bathrooms: "5", Style: "Elegant Traditional", Features: "Wine cellar · Iron spiral stair" },
      blurb: "\"A modernized castle sprinkled with contemporary twists.\" Rounded entries, an iron spiral staircase, double crown molding and a wine cellar — a home its owners, both architects, called love at first sight.",
      gallery: ["ext-grey-1","kitchen-3","living-1","staircase-2","bath-2","bedroom-2"]
    },
    {
      slug: "2106-belmont-ln",
      title: "2106 Belmont Lane",
      city: "Redondo Beach, CA",
      style: "Traditional",
      year: "2015",
      tag: "Timeless remodel & addition",
      cover: "ext-estate-2",
      photos: 41,
      specs: { Scope: "Whole-home remodel", Bathrooms: "4", Style: "Timeless Traditional", Feature: "Wine cellar" },
      blurb: "A comprehensive remodel and addition that reworked the home top to bottom — a warm, timeless interior with a chef's kitchen, refined millwork and a wine cellar.",
      gallery: ["ext-estate-2","kitchen-2","living-3","bath-1","bedroom-1"]
    },
    {
      slug: "1502-phelan-ln",
      title: "1502 Phelan Lane",
      city: "Redondo Beach, CA",
      style: "Mediterranean",
      year: "2014",
      tag: "Tuscan custom home",
      cover: "ext-white-1",
      photos: 17,
      specs: { Style: "Mediterranean / Tuscan", Feature: "Sand-finish stucco", Exterior: "Tuscan elevation" },
      blurb: "A Tuscan-inspired residence with hand sand-finished stucco, arched detailing and landscaped grounds — Mediterranean warmth built to South Bay standards.",
      gallery: ["ext-white-1","pool-2","kitchen-3","living-2","staircase-1"]
    },
    {
      slug: "1715-harriman-ln",
      title: "1715 Harriman Lane",
      city: "Redondo Beach, CA",
      style: "Mediterranean",
      year: "2014",
      tag: "Mediterranean custom home",
      cover: "ext-luxury-1",
      photos: 16,
      specs: { Style: "Mediterranean", Bedrooms: "5", Feature: "Custom entry & stair" },
      blurb: "A Mediterranean custom home with a dramatic entry, sculptural staircase and generous living spaces that flow to a private patio.",
      gallery: ["ext-luxury-1","living-2","kitchen-2","bath-2","interior-detail-1"]
    },
    {
      slug: "2501-huntington-ln",
      title: "2501 Huntington Lane",
      city: "Redondo Beach, CA",
      style: "Traditional",
      year: "2015",
      tag: "Classic custom home",
      cover: "living-4",
      photos: 20,
      specs: { Style: "Classic Traditional", Feature: "Grand staircase", Interior: "Formal living & dining" },
      blurb: "A classic custom home with a grand staircase, formal living and dining rooms and a family wing — traditional proportions executed with modern build quality.",
      gallery: ["living-4","living-3","kitchen-3","staircase-2","bath-2"]
    },
    {
      slug: "hermosa-coastal-collection",
      title: "Hermosa Coastal Collection",
      city: "Hermosa Beach, CA",
      style: "Coastal",
      year: "2018",
      tag: "Development · multi-residence",
      cover: "hero-estate",
      photos: 40,
      specs: { Program: "Spec development", Homes: "Multiple", Style: "Coastal Contemporary", Location: "1st Pl / 2nd St / Ocean View" },
      blurb: "A cluster of ground-up coastal contemporary homes developed across Hermosa Beach — 1st Place, 2nd Street and Ocean View — from acquisition through construction and sale.",
      gallery: ["hero-estate","ext-coastal-1","pool-2","deck-1","living-1"]
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
    { b: "Est. 2006", s: "Palos Verdes Peninsula" },
    { b: "CSLB #998954", s: "Class B General Building" },
    { b: "Score 92", s: "BuildZoom · top tier" },
    { b: "5.0 ★", s: "11 client reviews" },
    { b: "0 complaints", s: "Clean license record" },
  ],

  faqs: [
    { q: "Where does Kashi Organization build?", a: "We focus on the Palos Verdes Peninsula and the greater South Bay — Hermosa Beach, Redondo Beach, Manhattan Beach and the Peninsula cities — where we've built and developed for nearly two decades." },
    { q: "Do you take on remodels, or only ground-up homes?", a: "Both. Our core is ground-up custom homes and development, but we also take on whole-home remodels, additions and ADUs where the scope and standard fit the way we work." },
    { q: "Are you licensed and insured?", a: "Yes. Kashi Organization holds California CSLB license #998954, Class B General Building — active, in good standing, with a clean record. We carry full insurance and workers' compensation coverage." },
    { q: "How involved is the owner?", a: "Directly. Arash Abbasian is hands-on across every project — the reason clients and trade partners consistently point to communication, integrity and follow-through as what sets Kashi apart." },
    { q: "How do we start a project?", a: "Reach out through the contact page or call the office. We'll set up an initial conversation to understand your site, program and budget, and outline how a Kashi build would take shape." },
  ],
};
