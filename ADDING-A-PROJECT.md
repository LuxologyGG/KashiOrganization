# Adding a project

Every project on the site comes from one file: **`assets/js/data-v3.js`**. Nothing else needs to change. Add an
entry there and a new chapter appears on the page, numbered and ordered automatically.

## The short version

1. Drop the photos into `assets/img/projects/kashi/`.
2. Copy an existing block in `data-v3.js`, change the fields, point it at those photos.
3. Save. The site picks it up.

## The block

```js
{
  slug:     "the-project-name",          // lowercase, hyphens, no spaces
  name:     "The Project Name",
  subtitle: "A Line That Sets It Up",
  city:     "Manhattan Beach, CA",
  address:  "123 Example Street",        // leave "" to hide the address
  recordUrl: "https://www.redfin.com/...",  // leave "" to hide the link

  hero:    "kashi/project-exterior",     // filename without .jpg
  gallery: ["kashi/project-kitchen", "kashi/project-stair"],

  facts: { Bedrooms: "4", Bathrooms: "4.5", "Living area": "3,200 sq ft", Completed: "2024" },

  story: [
    "First paragraph.",
    "Second paragraph.",
    "As many as you want."
  ],
  pull: "The one line worth pulling out large.",
},
```

**Order on the page** is simply the order of the blocks in the list. Move a block up, it moves up on the site.

**Photos:** file names have no `.jpg` in the data, just the path from `assets/img/projects/`. So a file at
`assets/img/projects/kashi/project-exterior.jpg` is written as `kashi/project-exterior`.

**Anything you leave out is simply not shown.** No address, no record link, no specs, no problem. That is how
The Lockdown House currently runs.

## Parking a project instead of deleting it

The Brick House is parked at the bottom of the file under `parked: [ ... ]`. It is off the site but not lost.
Moving that block back into `projects: [ ... ]` brings it back exactly as it was.

## Who does it

Either works:

- **Send it over.** Photos plus the story and the address, and it goes up. Fastest, and the facts get checked
  against county records the same way the current five were.
- **Do it directly.** The file is plain text and the block above is the whole pattern. Worth noting: it is a
  code file, so a stray comma or quote will stop the projects from loading. If you edit it yourself, load the
  page afterwards to confirm the projects still appear.

If this becomes a regular thing, the better answer is a small admin page where projects are added through a
form with no code involved. That is a bigger build, worth doing once there is a steady flow of new work.
