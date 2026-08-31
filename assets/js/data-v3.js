/* =============================================================
   KASHI ORGANIZATION, Site content (v3, division-led single page)

   STRUCTURE (per client direction, Arash, email):
     Kashi Organization, Inc.
       01 Real Estate Development   <- launch focus
       02 Construction Management   <- developed later

   PROJECT STORIES are the client's own words, supplied in
   "Structure.docx" via his broker. They have been lightly edited
   ONLY to remove em dashes (standing client rule) and to break
   into paragraphs. No claims were added.

   PROVENANCE: specs come from public property records, verified
   independently. Any field we could not source is omitted rather
   than guessed. `recordUrl` is the client-supplied public listing.

   HOUSE RULES: no em dashes anywhere. Images are slugs so a real
   photo swap is a one-line change.
   ============================================================= */
window.KASHI = {
  company: {
    name: "Kashi Organization",
    legal: "Kashi Organization, Inc.",
    tagline: "Real Estate Development · Construction Management",
    since: "2006",
    owner: "Arash Abbasian",
    ownerRole: "Founder & Principal",
    region: "South Bay Beach Cities, Los Angeles",
    phone: "(310) 882-5505",
    phoneAlt: "(310) 704-8090",
    email: "info@kashiorganization.com",
    license: "CSLB #998954 · Class B General Building",
    licenseNum: "998954",
    rating: "5.0",
    reviews: "11",
    intro:
      "Kashi Organization develops and builds custom homes across the South Bay beach cities of Los Angeles. Two divisions, one standard: we take on the projects other builders talk themselves out of, and we finish them properly.",
    ethos:
      "We don't just build quality, we build homes people are proud to live in.",
  },

  /* ---- The two divisions that organize the whole site ---- */
  divisions: [
    {
      id: "development",
      k: "01",
      name: "Real Estate Development",
      lede: "Full-cycle development of custom residences across the beach cities. Site acquisition through sale, with the design conviction to do something different on every lot.",
      status: "active",
      cta: "See the work",
    },
    {
      id: "construction",
      k: "02",
      name: "Construction Management",
      lede: "Owner's representation, budgeting, scheduling and trade coordination for clients building their own home. We manage the complexity so the vision stays intact.",
      status: "soon",
      cta: "Start a conversation",
    },
  ],

  development: {
    eyebrow: "Division 01",
    title: "Real Estate Development",
    lede: "Every one of these started as a lot other people walked past. Each one has a story, told here by the person who built it.",
    /* Narrative order: origin, craft, distinction, conviction, personal. */
    projects: [
      {
        slug: "glass-house-on-the-hill",
        name: "The Glass House on the Hill",
        subtitle: "Built for the Beach Life",
        city: "Redondo Beach, CA",
        address: "412 S Francisca Avenue",
        recordUrl:
          "https://www.redfin.com/CA/Redondo-Beach/412-S-Francisca-Ave-90277/home/7705110",
        hero: "kashi/glass-house-exterior",
        gallery: [
          "kashi/glass-house-staircase",
          "kashi/glass-house-hall",
        ],
        facts: { Bedrooms: "6", Bathrooms: "7.5", "Living area": "4,850 sq ft", Completed: "2025" },
        story: [
          "Some projects demand more from you: more time, more precision, more nerve. This one had all of that.",
          "Built as a spec home on a steep hillside lot, the vision was bold from the start: a modern sanctuary wrapped in glass, with panoramic ocean views and a sense of openness so immersive it would feel like living inside an aquarium. Floor-to-ceiling glass on all levels blurs every line between indoors and out. Sunrise to sunset, you are surrounded by the Pacific.",
          "It took time, longer than we expected. Not because of delays, but because every detail mattered. The floating staircase had to feel effortless, and the master shower had to be something that made people stop mid-tour and just say, “Wow.” The Fleetwood window and door package alone required months of lead time, followed by a meticulous installation process to ensure every panel aligned perfectly: flush, clean, and seamless.",
          "Even the demolition had its moment. As we brought down the final three-story wing of the original 100-year-old house, I stood there with one eye on the excavator and one eye on the neighboring property, quietly hoping the hill didn't decide to make the day more interesting. It didn't. But that tension? That stayed with me.",
          "In the end, the right buyers walked in and instantly connected. You can always tell when someone falls in love with a space. It's in their eyes, their silence, the way they don't want to leave. They're a wonderful family, full of warmth and appreciation for the craft that went into every corner of the house. Seeing people like that make it their home, that's the most rewarding part of building.",
        ],
        pull: "Some projects demand more from you: more time, more precision, more nerve.",
      },

      {
        slug: "south-of-the-pier",
        name: "South of the Pier",
        subtitle: "Built Before Its Time",
        city: "Hermosa Beach, CA",
        address: "322 Manhattan Avenue",
        recordUrl:
          "https://www.redfin.com/CA/Hermosa-Beach/322-Manhattan-Ave-90254/home/6717774",
        hero: "hz/322-manhattan-ave-hero",
        gallery: [
          "hz/322-manhattan-ave-1",
          "hz/322-manhattan-ave-2",
          "hz/322-manhattan-ave-3",
          "hz/322-manhattan-ave-4",
          "hz/322-manhattan-ave-5",
          "hz/322-manhattan-ave-6",
        ],
        facts: { Bedrooms: "4", Bathrooms: "6", "Living area": "4,477 sq ft", Completed: "2016", Architecture: "Tomaro Design Group" },
        story: [
          "This was our first build south of the Hermosa Pier, and we knew it had to set a tone.",
          "The location was just two blocks from the beach, with incredible light, ocean breeze, and long views. Most people didn't see the area as ready for a project of this scale, but we saw the potential. So we brought in architect Louie Tomaro, whose work needs no introduction in the South Bay, and together we created something that hadn't been done in that pocket before: a four-story modern home with clean lines, open-air living, and a full-height glass elevator that quietly anchored the space.",
          "It was a risk. But it paid off. This house raised the bar for what's possible in the neighborhood. Other developers followed, and the area evolved.",
          "We're proud of what this home started. It didn't just capture the views, it helped change the view of what the south side of Hermosa could be.",
        ],
        pull: "It didn't just capture the views, it helped change the view of what the south side of Hermosa could be.",
      },

      {
        slug: "lockdown-house",
        name: "The Lockdown House",
        subtitle: "Designed with Breathing Room",
        city: "Manhattan Beach, CA",
        address: "",
        recordUrl: "",
        hero: "kashi/lockdown-exterior",
        gallery: [
          "kashi/lockdown-living",
        ],
        facts: {},
        story: [
          "Some decisions you make on instinct. This home was one of them.",
          "Most builders in Manhattan Beach would have squeezed five bedrooms into this footprint. We chose four. Why? Because space matters more than count. We wanted every bedroom to feel intentional, not just livable, but generous. And that meant fewer rooms, more light, more air, and more privacy. Each suite has its own bathroom. No compromises.",
          "One of our favorite design moments lives under the floating staircase: a full-height glass wine room that became a centerpiece of the main floor. Every element of this house was shaped by the idea of clarity and openness, from the flow of the spaces to the clean material palette.",
          "And then came the unexpected: we hit the market the week before the world shut down for COVID. Timing couldn't have been worse. But quality finds its audience. Even in the middle of global uncertainty, the house attracted real interest, because people could feel the difference in how it was built.",
          "That's the kind of decision that stays with you. In a market that often prioritizes square footage over experience, we built this home with breathing room, and that made all the difference.",
        ],
        pull: "In a market that often prioritizes square footage over experience, we built this home with breathing room.",
      },

      {
        slug: "modern-farmhouse",
        name: "The Modern Farmhouse",
        subtitle: "A Modern Classic on the Corner",
        city: "Manhattan Beach, CA",
        address: "1801 6th Street",
        recordUrl:
          "https://www.redfin.com/CA/Manhattan-Beach/1801-6th-St-90266/home/6702431",
        hero: "kashi/farmhouse-exterior",
        gallery: [
          "kashi/farmhouse-entry",
          "kashi/farmhouse-dining",
        ],
        facts: { Bedrooms: "4", Bathrooms: "4.5", "Living area": "3,219 sq ft", Completed: "2018", Lot: "Corner lot" },
        story: [
          "In a neighborhood full of predictable builds, we chose a different path.",
          "On this bright corner lot in Manhattan Beach, most developers would have gone with what sells: a beach plantation-style home with siding and decorative shutters. We didn't. Instead, we created a modern French farmhouse, clean, warm, and refined, but completely different from anything else in the area. Designed not to blend in, but to stand out for the right reasons.",
          "Light floods every inch of this home. The floating staircase draws you upward through airy, open volumes. A large interior window between the downstairs office and the main living areas became one of our favorite design moves, creating a visual connection without sacrificing privacy.",
          "And the classic Dutch door at the front entry? It offered the perfect touch of charm and openness to welcome light and life into the space.",
          "When the right buyer came along, the design found its match. A global executive relocating from Mexico, they instantly understood the balance of familiarity and distinction, the blend of softness, structure, and elegance that this home offered.",
          "This project reminded us: sometimes what makes a home special isn't just the space, it's the decision to do something different.",
        ],
        pull: "Designed not to blend in, but to stand out for the right reasons.",
      },
    ],

    /* Parked at the client's request ("delete the brick house for now").
       Kept intact so restoring it is a matter of moving it back into
       projects[] above. */
    parked: [
      {
        slug: "brick-house",
        name: "The Brick House",
        subtitle: "Built for the View That Has It All",
        city: "Palos Verdes Estates, CA",
        address: "2245 Via La Brea",
        recordUrl:
          "https://www.redfin.com/CA/Palos-Verdes-Estates/2245-Via-La-Brea-90274/home/7726753",
        hero: "hero-estate",
        gallery: [
          "pool-1",
          "pool-2",
          "bedroom-1",
          "interior-detail-2",
          "ext-modern-1",
        ],
        imageNote: "Representative imagery. Photography of this home to follow.",
        facts: { Bedrooms: "4", Bathrooms: "4.5", "Living area": "4,155 sq ft", Lot: "11,100 sq ft", Completed: "2020" },
        story: [
          "Some lots are rare. This one is unreal.",
          "We waited three years for it to hit the market. Checking, hoping, watching. The moment it did, we bought it within minutes. No hesitation. Because we knew there wasn't another piece of land like it, probably not anywhere.",
          "From a single vantage point, you can see the ocean, the mountains, the sunset, white water, beach, Queen's Necklace, downtown LA, the Hollywood sign, LAX air traffic, SoFi Stadium, and Point Dume. It doesn't seem possible, until you're standing on the balcony, unable to pull yourself away. The view doesn't just draw you in, it pulls you through the house.",
          "That's what shaped everything. We designed a 48-foot sliding glass wall that opens completely to the horizon. Inside, the home is clean, open, bright, modern without being cold, expansive without feeling excessive.",
          "And outside? We broke from the norm. In a neighborhood filled with stucco and PV stone, we clad the entire house in white brick. Not just any brick: custom Arto brick, molded for this project. The entrance is finished in vertical cedar siding, softening the approach and adding warmth against the texture of the masonry.",
          "This wasn't built as a spec. It was built for us. Every decision was personal. Every detail was intentional. And every time we walk through that front door and catch the view again, we know exactly why we waited.",
        ],
        pull: "This wasn't built as a spec. It was built for us. Every decision was personal.",
      },
    ],
  },

  construction: {
    eyebrow: "Division 02",
    title: "Construction Management",
    /* Per client: this section is just "Under Construction" for now. The
       capability copy is kept below so it can be switched back on later. */
    status: "Under Construction",
    lede: "For owners building their own home, we run the project the same way we run our own developments: closely managed trades, transparent budgets, and a clean site.",
    capabilities: [
      { k: "01", title: "Owner's representation", copy: "We sit on your side of the table, managing the architect, the trades and the schedule against your budget." },
      { k: "02", title: "Pre-construction & budgeting", copy: "Feasibility, transparent budgeting, permitting and value engineering before a wall goes up." },
      { k: "03", title: "Trade coordination", copy: "Self-managed trade partners, weekly reporting and rigorous quality control from foundation to final coat." },
      { k: "04", title: "Delivery & warranty", copy: "A thorough final walkthrough, a warranty that means something, and responsiveness long after the keys change hands." },
    ],
  },

  credentials: [
    { label: "Licensed", detail: "CSLB #998954, Class B General Building, active" },
    { label: "Established", detail: "Incorporated in California, 2006" },
    { label: "Rated", detail: "5.0 across the company's own client reviews" },
    { label: "Region", detail: "South Bay beach cities, Los Angeles" },
  ],
};
