"use strict";

// Project and illustration data for the landing page (used by main.js).

// The Sambla illustrations that fill the wall, leaving out the near-identical
// colour variants and the piggy bank, which wasn't part of the delivery. The
// Sambla page still shows all of them.
const WALL_ILLUSTRATIONS = [
  { src: "img/sambla/sambla-04.webp", w: 1140, h: 1179 },
  { src: "img/sambla/sambla-05.webp", w: 909, h: 1260 },
  { src: "img/sambla/sambla-06.webp", w: 1394, h: 1600 },
  { src: "img/sambla/sambla-07.webp", w: 1125, h: 1154 },
  { src: "img/sambla/sambla-10.webp", w: 1011, h: 991 },
  { src: "img/sambla/sambla-14.webp", w: 1020, h: 815 },
  { src: "img/sambla/sambla-15.webp", w: 1164, h: 1263 },
  { src: "img/sambla/sambla-16.webp", w: 996, h: 1134 },
  { src: "img/sambla/sambla-17.webp", w: 839, h: 1198 },
  { src: "img/sambla/sambla-19.webp", w: 802, h: 708 },
];

// Titled project cards. On the card wall each sits in the tallest slot of
// its own column, spread evenly across the set. `framed` adds a drop shadow
// (for print work); `bleed` lets the image fill the whole card, with the
// title over it; `phone` (phone screens) keeps the phones large, filling the
// card's width with the bottom cropped.
const PROJECTS = [
  {
    title: "Fjällräven",
    subtitle: "Berghs, Explore",
    href: "projects/fjallraven",
    img: { src: "img/fjallraven/fjallraven-poster.webp", w: 403, h: 581 },
    framed: true,
    blurb: "A student project at Berghs SOC, 2025. We helped Fjällräven take on civil defence and emergency preparedness for young people living alone, through products, graphics and a campaign.",
    // Stickers in the preview's text panel. x/y/size are fractions of the
    // preview's height; x runs from the panel's edge next to the card;
    // rotate (degrees) tilts one.
    previewStickers: [
      { src: "img/fjallraven/stickers/beanie.png", x: 0.586, y: 0.046, size: 0.22 },
      { src: "img/fjallraven/stickers/megaphone.png", x: -0.054, y: 0.605, size: 0.368 },
    ],
  },
  {
    title: "Sambla",
    subtitle: "Internship",
    href: "projects/sambla-intern",
    img: { src: "img/sambla/sambla-monkey.webp", w: 634, h: 571 },
    // Sambla's loop behind the expanded preview.
    previewLoop: "img/sambla/case/loop.webp",
    blurb: "Work from my internship at Sambla.",
  },
  {
    title: "Fjällräven",
    subtitle: "Berghs, Explore",
    href: "projects/fjallraven",
    img: { src: "img/fjallraven/stickers/jacket-straight.webp", w: 400, h: 552 },
    blurb: "A student project at Berghs SOC, 2025. We helped Fjällräven take on civil defence and emergency preparedness for young people living alone, through products, graphics and a campaign.",
    previewStickers: [
      { src: "img/fjallraven/stickers/beanie.png", x: 0.586, y: 0.046, size: 0.22 },
      { src: "img/fjallraven/stickers/megaphone.png", x: -0.054, y: 0.605, size: 0.368 },
    ],
  },
  {
    title: "The Finals",
    subtitle: "XYOU, Berghs",
    href: "projects/thefinals",
    img: { src: "img/thefinals/card-cart.webp", w: 550, h: 846 },
    framed: true,
    blurb: "Exploring how UX principles from fashion and retail can improve store and customization flows in THE FINALS.",
  },
  {
    title: "The Finals",
    subtitle: "XYOU, Berghs",
    href: "projects/thefinals",
    img: { src: "img/thefinals/thefinals-site.webp", w: 1000, h: 899 },
    blurb: "Exploring how UX principles from fashion and retail can improve store and customization flows in THE FINALS.",
  },
  {
    title: "Sambla",
    subtitle: "Internship",
    href: "projects/sambla-intern",
    img: { src: "img/sambla-intern/card-phones.webp", w: 785, h: 1130 },
    phone: true,
    framed: true,
    blurb: "Six weeks in Sambla’s New Adventures team, designing a brand-new mortgage application from first wireframe to developer handoff.",
    // The icon hover loop from Key learning, under the text.
    previewStickers: [
      { src: "img/sambla-intern/icon-hover.webp", x: 0.54, y: 0.57, size: 0.24, rotate: 8 },
    ],
  },
  {
    title: "A som i alfabetet",
    subtitle: "Illustration",
    href: "projects/alfabetet",
    img: { src: "img/alfabetet/poster-card.webp", w: 720, h: 1018 },
    framed: true,
    blurb: "A personal print series where every letter comes with its own animal and plant, as single initial prints or the full alphabet as a poster.",
  },
  {
    title: "Apoteket Hjärtat",
    subtitle: "Livi",
    href: "projects/apoteket",
    img: { src: "img/apoteket/card-phones.webp", w: 800, h: 999 },
    phone: true,
    framed: true,
    blurb: "Livi, an AI-assisted refill subscription in Apoteket Hjärtat’s app that plans ahead of your needs. A two-week course project in innovation, UX and UI.",
  },
  {
    title: "Försvarsmakten",
    subtitle: "För kung och fosterlan",
    href: "projects/forsvarsmakten",
    img: { src: "img/forsvarsmakten/forsvarsmakten-site.webp", w: 911, h: 994 },
    framed: true,
    blurb: "Our degree project for Försvarsmakten: the world’s first gaming army, a digital reserve force on Discord. I took part in the research and designed the campaign site and the Discord server.",
  },
  {
    title: "SaddleScanner",
    subtitle: "UX/UI design",
    href: "projects/sadelscanner",
    img: { src: "img/sadelscanner/sadelscanner-duo.webp", w: 760, h: 1110 },
    phone: true,
    framed: true,
    blurb: "UX/UI design for SaddleScanner’s Hodd, an app for keeping track of your horse’s health, care and journal.",
  },
  // More cards for the same projects. They take turns with the ones above,
  // so phones (where every project is always on the wall) get more swaps.
  {
    title: "Apoteket Hjärtat",
    subtitle: "Livi",
    href: "projects/apoteket",
    img: { src: "img/apoteket/phone-livi.webp", w: 805, h: 1632 },
    phone: true,
    blurb: "Livi, an AI-assisted refill subscription in Apoteket Hjärtat’s app that plans ahead of your needs. A two-week course project in innovation, UX and UI.",
  },
  {
    title: "SaddleScanner",
    subtitle: "UX/UI design",
    href: "projects/sadelscanner",
    img: { src: "img/sadelscanner/sadelscanner-app.webp", w: 380, h: 809 },
    phone: true,
    framed: true,
    blurb: "UX/UI design for SaddleScanner’s Hodd, an app for keeping track of your horse’s health, care and journal.",
  },
  {
    title: "A som i alfabetet",
    subtitle: "Illustration",
    href: "projects/alfabetet",
    img: { src: "img/alfabetet/c-sticker.webp", w: 749, h: 730 },
    // Drawn on white: multiplied so the white takes the card's colour.
    multiply: true,
    blurb: "A personal print series where every letter comes with its own animal and plant, as single initial prints or the full alphabet as a poster.",
  },
  ...[
    { src: "img/sambla/sambla-05.webp", w: 909, h: 1260 },
    { src: "img/sambla/sambla-17.webp", w: 839, h: 1198 },
  ].map((img) => ({
    title: "Sambla",
    subtitle: "Illustrations",
    href: "projects/sambla",
    img,
    previewLoop: "img/sambla/case/loop.webp",
    blurb: "Contributed to Sambla’s rebranding project, developing a new hand-drawn illustration style for the platform and app.",
  })),
];
// The Projects view (the Projects link): one wide card per project, in
// this order, each with the card image named here. `focus` is the point
// (0 = top, 1 = bottom) of the image kept at the middle of the card.
// `top` instead shows the image from its top edge, with a little room above.
// `fit` shows the whole image inside the card (for tall illustrations).
const PROJECT_LIST = [
  { href: "projects/sambla", img: "img/sambla/sambla-05.webp", fit: true },
  { href: "projects/forsvarsmakten", img: "img/forsvarsmakten/forsvarsmakten-site.webp", top: true },
  { href: "projects/thefinals", img: "img/thefinals/thefinals-site.webp", focus: 0.38 },
  { href: "projects/apoteket", img: "img/apoteket/phone-livi.webp" },
  { href: "projects/fjallraven", img: "img/fjallraven/fjallraven-poster.webp", top: true },
  { href: "projects/sambla-intern", img: "img/sambla/sambla-monkey.webp" },
  { href: "projects/alfabetet", img: "img/alfabetet/poster-card.webp", top: true },
  { href: "projects/sadelscanner", img: "img/sadelscanner/sadelscanner-app.webp" },
];
// The untitled illustration cards belong to this project.
const ILLUSTRATION_HREF = "projects/sambla";

// Small versions of the wall's images (about 400px wide), so the wall loads
// fast; the cards pick them through srcset. The preview keeps the full
// image. Made from the originals: image path → [small version, its width].
const THUMBS = {
  "img/alfabetet/c-sticker.webp": ["img/thumbs/alfabetet/c-sticker.webp", 400],
  "img/alfabetet/poster-card.webp": ["img/thumbs/alfabetet/poster-card.webp", 400],
  "img/apoteket/card-phones.webp": ["img/thumbs/apoteket/card-phones.webp", 400],
  "img/apoteket/phone-livi.webp": ["img/thumbs/apoteket/phone-livi.webp", 400],
  "img/fjallraven/fjallraven-poster.webp": ["img/thumbs/fjallraven/fjallraven-poster.webp", 400],
  "img/fjallraven/stickers/jacket-straight.webp": ["img/thumbs/fjallraven/stickers/jacket-straight.webp", 400],
  "img/forsvarsmakten/forsvarsmakten-site.webp": ["img/thumbs/forsvarsmakten/forsvarsmakten-site.webp", 400],
  "img/sadelscanner/sadelscanner-app.webp": ["img/thumbs/sadelscanner/sadelscanner-app.webp", 380],
  "img/sadelscanner/sadelscanner-duo.webp": ["img/thumbs/sadelscanner/sadelscanner-duo.webp", 400],
  "img/sambla-intern/card-phones.webp": ["img/thumbs/sambla-intern/card-phones.webp", 400],
  "img/sambla/sambla-04.webp": ["img/thumbs/sambla/sambla-04.webp", 400],
  "img/sambla/sambla-05.webp": ["img/thumbs/sambla/sambla-05.webp", 400],
  "img/sambla/sambla-06.webp": ["img/thumbs/sambla/sambla-06.webp", 400],
  "img/sambla/sambla-07.webp": ["img/thumbs/sambla/sambla-07.webp", 400],
  "img/sambla/sambla-10.webp": ["img/thumbs/sambla/sambla-10.webp", 400],
  "img/sambla/sambla-14.webp": ["img/thumbs/sambla/sambla-14.webp", 400],
  "img/sambla/sambla-15.webp": ["img/thumbs/sambla/sambla-15.webp", 400],
  "img/sambla/sambla-16.webp": ["img/thumbs/sambla/sambla-16.webp", 400],
  "img/sambla/sambla-17.webp": ["img/thumbs/sambla/sambla-17.webp", 400],
  "img/sambla/sambla-19.webp": ["img/thumbs/sambla/sambla-19.webp", 400],
  "img/thefinals/card-cart.webp": ["img/thumbs/thefinals/card-cart.webp", 400],
  "img/thefinals/thefinals-site.webp": ["img/thumbs/thefinals/thefinals-site.webp", 400],
};
