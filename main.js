"use strict";

// Project and illustration data lives in data.js.

// Card heights as multiples of the column width, cycling per column.
const PATTERN = [
  [1.07, 1.54],
  [1.61, 1.00],
  [1.07, 1.54],
  [1.37, 1.23],
];

const ILLUSTRATION_PROJECT = PROJECTS.findIndex((p) => p.href === ILLUSTRATION_HREF);

const track = document.getElementById("wall-track");
const phone = window.matchMedia("(max-width: 640px)");
const wall = document.getElementById("projects");
const images = WALL_ILLUSTRATIONS;
let colW = 200; // the wall's column width, for picking card image sizes

/* ---------- Card wall ---------- */

// small: a wall card, which loads the small version (THUMBS in data.js) when
// that's sharp enough. src stays the full image either way: the wall tells
// images apart by it, and the preview shows it.
function makeImg(item, small = false) {
  const img = document.createElement("img");
  // loading, sizes and srcset go before src: setting src starts the download.
  img.loading = "lazy";
  img.decoding = "async";
  img.alt = "";
  if (item.w && item.h) { img.width = item.w; img.height = item.h; }
  const thumb = small && THUMBS[item.src];
  if (thumb) {
    const [thumbSrc, thumbW] = thumb;
    img.sizes = `auto, ${Math.round(colW)}px`;
    img.srcset = item.w > thumbW * 1.2 ? `${thumbSrc} ${thumbW}w, ${item.src} ${item.w}w` : `${thumbSrc} ${thumbW}w`;
  }
  img.src = item.src;
  return img;
}

function makeProjectCard(project) {
  const card = document.createElement("a");
  card.className = "card card--project" + (project.bleed ? " card--bleed" : "");
  card.href = project.href;
  card.dataset.project = PROJECTS.indexOf(project);

  const media = document.createElement("span");
  media.className = "card-media" + (project.framed ? " card-media--framed" : "")
    + (project.multiply ? " card-media--multiply" : "")
    + (project.phone ? " card-media--phone" : "");
  media.appendChild(makeImg(project.img, true));

  const text = document.createElement("span");
  text.className = "card-text";
  const title = document.createElement("span");
  title.className = "card-title";
  title.textContent = project.title;
  const sub = document.createElement("span");
  sub.className = "card-sub";
  sub.textContent = project.subtitle;
  text.append(title, sub);

  card.append(media, text);
  return card;
}

// Plain illustration cards link to their project for mouse users only;
// keyboard and screen reader users get the titled project card instead.
function makeImageCard(item) {
  const card = document.createElement(item ? "a" : "div");
  card.className = "card";
  if (item) {
    card.href = ILLUSTRATION_HREF;
    card.dataset.project = ILLUSTRATION_PROJECT;
    card.tabIndex = -1;
    card.setAttribute("aria-hidden", "true");
    card.appendChild(makeImg(item, true));
  }
  return card;
}

// A project can have several cards (same href); they take turns, so each
// project counts once when filling the wall.
const PROJECT_KEYS = [...new Set(PROJECTS.map((p) => p.href))];
const variantsOf = (href) => PROJECTS.filter((p) => p.href === href);

// Slots that hold a project, as "column:slot" keys. Every project gets a
// slot when the wall has room: first the tallest slot of columns spread
// evenly across the wall, then other slots spread the same way.
// Illustrations fill the rest.
const tallestSlot = (ratios) => ratios.indexOf(Math.max(...ratios));
const spread = (k, length) => Array.from({ length: k }, (_, j) => Math.floor(((j + 0.5) * length) / k));

function projectSlots(columns) {
  const tall = columns.map((ratios, c) => `${c}:${tallestSlot(ratios)}`);
  const rest = columns.flatMap((ratios, c) =>
    ratios.map((_, slot) => `${c}:${slot}`).filter((key) => !tall.includes(key)));
  const n = Math.min(PROJECT_KEYS.length, tall.length + rest.length);
  const nTall = Math.min(n, tall.length);
  return new Set([
    ...spread(nTall, tall.length).map((k) => tall[k]),
    ...spread(n - nTall, rest.length).map((k) => rest[k]),
  ]);
}

const pick = (list) => list[Math.floor(Math.random() * list.length)];
const shuffled = (list) =>
  list.map((v) => [Math.random(), v]).sort((a, b) => a[0] - b[0]).map(([, v]) => v);

// A still wall inside white side margins (the wall's padding): as many
// columns as fit, widened slightly so they fill the width exactly. Projects
// and illustrations start in random order; card swaps (below) bring in the
// rest over time.
// The Projects link (#projects) swaps the wall for a still list, one wide
// card per project; any other link brings the wall back.
const listView = () => location.hash === "#projects";

function buildWall() {
  // The wall's distance from the top of the page lets the CSS size the cards
  // so both rows fit on the first screen.
  document.documentElement.classList.toggle("list-view", listView());
  wall.style.setProperty("--wall-top", wall.getBoundingClientRect().top + window.scrollY + "px");
  wall.classList.toggle("is-list", listView());
  if (listView()) {
    buildList();
    return;
  }

  // Measure the CSS column width (without last build's override).
  wall.style.removeProperty("--col-w");
  const probe = document.createElement("div");
  probe.className = "wall-col";
  probe.style.visibility = "hidden";
  track.replaceChildren(probe);
  const gap = parseFloat(getComputedStyle(probe).marginRight) || 0;
  const step = probe.offsetWidth + gap;

  const cs = getComputedStyle(wall);
  const avail = wall.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  // Rounding the count up makes columns a touch narrower (never taller).
  // Phones get two columns, four cards tall.
  const columnCount = phone.matches ? 2 : Math.max(1, Math.ceil((avail + gap) / step));
  colW = (avail - (columnCount - 1) * gap) / columnCount;
  wall.style.setProperty("--col-w", `${colW}px`);
  const columns = Array.from({ length: columnCount }, (_, c) => phone.matches
    ? [...PATTERN[c % PATTERN.length], ...PATTERN[(c + 2) % PATTERN.length]]
    : PATTERN[c % PATTERN.length]);

  const slots = projectSlots(columns);
  const projects = shuffled(PROJECT_KEYS);
  const illustrations = shuffled(images);
  let p = 0;
  let i = 0;
  // Some illustrations are also a project's card image; each image shows
  // only once on the wall.
  const used = new Set();
  const nextProject = () => {
    const variants = variantsOf(projects[p++]);
    const fresh = variants.filter((v) => !used.has(v.img.src));
    const project = pick(fresh.length ? fresh : variants);
    used.add(project.img.src);
    return project;
  };
  const nextIllustration = () => {
    if (!illustrations.length) return null;
    for (let tries = 0; tries < illustrations.length; tries++) {
      const item = illustrations[i++ % illustrations.length];
      if (!used.has(item.src)) { used.add(item.src); return item; }
    }
    return illustrations[i++ % illustrations.length];
  };

  const set = document.createElement("div");
  set.className = "wall-set";
  for (let c = 0; c < columnCount; c++) {
    const col = document.createElement("div");
    col.className = "wall-col";
    columns[c].forEach((ratio, slot) => {
      const card = slots.has(`${c}:${slot}`)
        ? makeProjectCard(nextProject())
        : makeImageCard(nextIllustration());
      card.style.setProperty("--r", ratio);
      col.appendChild(card);
    });
    set.appendChild(col);
  }
  track.replaceChildren(set);
}

// The list: PROJECT_LIST's order and images, each project's title,
// subtitle and description beside its image. Nothing swaps here.
function buildList() {
  const list = document.createElement("div");
  list.className = "project-list";
  PROJECT_LIST.forEach(({ href, img, focus, top, fit }, i) => {
    const project = variantsOf(href).find((p) => p.img.src === img) || variantsOf(href)[0];
    const item = document.createElement("a");
    item.className = "list-card";
    item.href = project.href;
    item.style.setProperty("--i", i);

    const media = document.createElement("span");
    media.className = "list-card-media"
      + (project.multiply ? " card-media--multiply" : "")
      + (project.phone ? " list-card-media--phone" : "")
      + (top ? " list-card-media--top" : "")
      + (fit ? " list-card-media--fit" : "");
    const image = makeImg(project.img);
    if (focus !== undefined) image.style.setProperty("--focus", focus);
    media.appendChild(image);

    const text = document.createElement("span");
    text.className = "list-card-text";
    const title = document.createElement("span");
    title.className = "list-card-title";
    title.textContent = project.title;
    const sub = document.createElement("span");
    sub.className = "list-card-sub";
    sub.textContent = project.subtitle;
    const blurb = document.createElement("span");
    blurb.className = "list-card-blurb";
    blurb.textContent = project.blurb || "";
    text.append(title, sub, blurb);

    item.append(media, text);
    list.appendChild(item);
  });
  track.replaceChildren(list);
}

function debounce(fn, ms) {
  let t;
  return () => { clearTimeout(t); t = setTimeout(fn, ms); };
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

buildWall();
// Only a change of width rebuilds (and reshuffles) the wall. On phones the
// address bar slides in and out when the scroll direction changes, which
// changes the height and fires resize; the cards are sized with svh, so that
// needs nothing.
let wallWidth = window.innerWidth;
window.addEventListener("resize", debounce(() => {
  if (window.innerWidth === wallWidth) return;
  wallWidth = window.innerWidth;
  buildWall();
}, 200));
// The list starts right under the header's line, so the Projects link shows
// it from the top of the page rather than jumping down to it.
const showListFromTop = () => window.scrollTo({ top: 0, behavior: "instant" });
document.addEventListener("click", (e) => {
  const link = e.target.closest && e.target.closest('a[href="#projects"]');
  if (!link) return;
  e.preventDefault();
  if (!listView()) history.pushState(null, "", "#projects");
  buildWall();
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "instant" : "smooth" });
});
window.addEventListener("hashchange", () => {
  buildWall();
  if (listView()) showListFromTop();
});
window.addEventListener("popstate", buildWall);
if (listView()) window.addEventListener("load", showListFromTop, { once: true });

/* ---------- Card preview ---------- */

// Clicking a card lifts a larger copy over the wall (both rows tall). It
// first grows out of the card, then widens toward the roomier side of the
// screen to show a short description of the project. Once open it is a link
// to the project itself; a click anywhere else closes it.
const PREVIEW_GROW_MS = 380;
const PREVIEW_MARGIN = 16;
const PREVIEW_STACKED_HOLD_MS = 500;
// Room beside a stacked preview for its arrows.
const PREVIEW_ARROW_SPACE = 40;

const veil = document.createElement("div");
veil.className = "card-preview-veil";
// Mouse-only extra (the cards themselves are the keyboard and screen reader
// route), so it stays out of the tab order and the accessibility tree.
const preview = document.createElement("a");
preview.className = "card-preview";
preview.tabIndex = -1;
preview.setAttribute("aria-hidden", "true");
preview.innerHTML = `
  <span class="card-preview-close">×</span>
  <img class="card-preview-loop" alt="" hidden>
  <div class="card-preview-card">
    <div class="card-preview-media"><img alt=""></div>
    <div class="card-preview-label">
      <p class="card-preview-title"></p>
      <p class="card-preview-sub"></p>
    </div>
  </div>
  <div class="card-preview-info">
    <div class="card-preview-stickers"></div>
    <p class="card-preview-info-title"></p>
    <p class="card-preview-blurb"></p>
    <div class="card-preview-ctas">
      <p class="card-preview-cta">View project →</p>
    </div>
  </div>`;
// Arrows beside a click-opened preview step through the projects.
const arrows = [-1, 1].map((dir) => {
  const arrow = document.createElement("span");
  arrow.className = "card-preview-arrow";
  arrow.dataset.dir = dir;
  arrow.setAttribute("aria-hidden", "true");
  arrow.innerHTML = `<svg viewBox="0 0 12 24" width="12" height="24"><path d="${dir < 0 ? "M10 2 2 12l8 10" : "M2 2l8 10-8 10"}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  arrow.addEventListener("click", () => stepPreview(dir));
  return arrow;
});
document.body.append(veil, preview, ...arrows);
const previewCardPart = preview.querySelector(".card-preview-card");
const previewInfo = preview.querySelector(".card-preview-info");

let expandTimer = null;
let shownCard = null;
let shownProject = null;

// Sizes and positions for the hovered card: the card part (portrait, both
// wall rows tall, centered on the card) and the full box once widened.
// Cards on the left half widen to the right, and the other way round.
// Too narrow to widen (phones), the preview stays card-sized, centered on
// the card, and its image fades over to the description instead.
function previewLayout(card) {
  const w = wall.getBoundingClientRect();
  const c = card.getBoundingClientRect();
  const m = PREVIEW_MARGIN;
  let top = Math.max(w.top, m);
  let height = Math.min(w.bottom, window.innerHeight - m) - top;
  let cardW = Math.min(height * 0.8, window.innerWidth - 2 * m);
  let infoW = Math.max(0, Math.min(height * 0.92, window.innerWidth - 2 * m - cardW));
  const stacked = infoW < cardW * 0.6;
  if (stacked) {
    cardW = Math.min(cardW, window.innerWidth - 2 * PREVIEW_ARROW_SPACE);
    const h = Math.min(height, cardW * 1.45);
    top = Math.min(Math.max(c.top + c.height / 2 - h / 2, top), top + height - h);
    height = h;
    infoW = 0;
  }
  const fullW = cardW + infoW;
  const center = c.left + c.width / 2;
  const toRight = center < window.innerWidth / 2;

  let boxLeft;
  let cardLeft;
  if (toRight) {
    boxLeft = Math.min(Math.max(center - cardW / 2, m), window.innerWidth - m - fullW);
    cardLeft = boxLeft;
  } else {
    const boxRight = Math.max(Math.min(center + cardW / 2, window.innerWidth - m), m + fullW);
    boxLeft = boxRight - fullW;
    cardLeft = boxRight - cardW;
  }
  if (stacked) boxLeft = cardLeft = (window.innerWidth - cardW) / 2;
  return { top, height, cardW, infoW, fullW, toRight, boxLeft, cardLeft, stacked };
}

// Fills the preview with a project and the image to show; isProjectCard is
// false for illustration cards, which skip the project card's styling.
function fillPreview(project, src, isProjectCard) {
  shownProject = project;
  preview.href = project.href;
  preview.querySelector(".card-preview-media img").src = src;
  preview.querySelector(".card-preview-media").classList.toggle(
    "card-preview-media--framed", Boolean(project.framed) && isProjectCard);
  preview.querySelector(".card-preview-media").classList.toggle(
    "card-media--multiply", Boolean(project.multiply) && isProjectCard);
  previewCardPart.classList.toggle("card-preview-card--bleed", Boolean(project.bleed) && isProjectCard);
  preview.querySelector(".card-preview-title").textContent = project.title;
  preview.querySelector(".card-preview-sub").textContent = project.subtitle;
  preview.querySelector(".card-preview-info-title").textContent = project.title;
  preview.querySelector(".card-preview-blurb").textContent = project.blurb || "";
  const loop = preview.querySelector(".card-preview-loop");
  loop.hidden = !project.previewLoop;
  if (project.previewLoop) loop.src = project.previewLoop;
  preview.querySelector(".card-preview-stickers").replaceChildren(
    ...(project.previewStickers || []).map(({ src, x, y, size, rotate = 0 }) => {
      const sticker = document.createElement("img");
      sticker.className = "card-preview-sticker";
      sticker.src = src;
      sticker.alt = "";
      sticker.style.cssText = `--x: ${x}; --y: ${y}; --size: ${size}; rotate: ${rotate}deg`;
      return sticker;
    }),
  );
}

function showPreview(card) {
  const project = PROJECTS[card.dataset.project];
  const img = card.querySelector("img");
  if (!project || !img) return;

  fillPreview(project, img.getAttribute("src"), card.classList.contains("card--project"));
  shownCard = card;

  const L = previewLayout(card);
  clearTimeout(expandTimer);
  preview.classList.remove("is-expanded");
  preview.classList.toggle("to-left", !L.toRight);
  preview.classList.toggle("is-stacked", L.stacked);
  // It has a close button, and the veil takes clicks outside it (they only
  // close it).
  preview.classList.add("has-close");
  veil.classList.add("takes-clicks");
  preview.style.setProperty("--ph", `${L.height}px`);
  preview.style.setProperty("--pw", `${L.fullW}px`);
  previewCardPart.style.width = `${L.cardW}px`;
  previewInfo.style.width = `${L.stacked ? L.cardW : L.infoW}px`;
  // Start collapsed to just the card part.
  Object.assign(preview.style, {
    top: `${L.top}px`, height: `${L.height}px`, left: `${L.cardLeft}px`, width: `${L.cardW}px`,
  });
  preview.classList.add("is-open");
  veil.classList.add("is-open");
  arrows.forEach((arrow) => {
    const dir = Number(arrow.dataset.dir);
    const x = dir < 0 ? L.boxLeft - PREVIEW_ARROW_SPACE / 2 : L.boxLeft + L.fullW + PREVIEW_ARROW_SPACE / 2;
    arrow.style.left = `${Math.min(Math.max(x, PREVIEW_ARROW_SPACE / 2), window.innerWidth - PREVIEW_ARROW_SPACE / 2)}px`;
    arrow.style.top = `${L.top + L.height / 2}px`;
    arrow.classList.add("is-open");
  });

  const expand = () => {
    preview.classList.add("is-expanded");
    Object.assign(preview.style, { left: `${L.boxLeft}px`, width: `${L.fullW}px` });
  };
  if (reducedMotion.matches) { expand(); return; }

  // 1. Grow out of the card into the card part.
  const from = card.getBoundingClientRect();
  const to = preview.getBoundingClientRect();
  const dx = from.left + from.width / 2 - (to.left + to.width / 2);
  const dy = from.top + from.height / 2 - (to.top + to.height / 2);
  preview.animate(
    [
      { transform: `translate(${dx}px, ${dy}px) scale(${from.width / to.width}, ${from.height / to.height})`, opacity: 0.4 },
      { transform: "none", opacity: 1 },
    ],
    { duration: PREVIEW_GROW_MS, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
  );
  // 2. Then widen to reveal the description (a CSS transition), or, stacked,
  // show the image a moment and fade over to the description.
  expandTimer = setTimeout(expand, PREVIEW_GROW_MS + (L.stacked ? PREVIEW_STACKED_HOLD_MS : 0));
}

// The arrows (or a swipe) of a click-opened preview step through the
// projects, one card each: the one on the wall when it's showing, otherwise
// its first card. Stacked, each shows its image a moment before fading over
// to the text.
function stepPreview(dir) {
  if (!shownProject) return;
  const i = PROJECT_KEYS.indexOf(shownProject.href);
  const href = PROJECT_KEYS[(i + dir + PROJECT_KEYS.length) % PROJECT_KEYS.length];
  const onWall = [...track.querySelectorAll(".card--project")]
    .find((c) => PROJECTS[c.dataset.project].href === href);
  const project = onWall ? PROJECTS[onWall.dataset.project] : variantsOf(href)[0];
  const img = onWall && onWall.querySelector("img");
  fillPreview(project, img ? img.getAttribute("src") : project.img.src, true);
  if (!reducedMotion.matches) {
    preview.animate(
      [{ transform: `translateX(${dir * 24}px)`, opacity: 0.4 }, { transform: "none", opacity: 1 }],
      { duration: 260, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" },
    );
  }
  if (preview.classList.contains("is-stacked")) {
    clearTimeout(expandTimer);
    preview.classList.remove("is-expanded");
    expandTimer = setTimeout(() => preview.classList.add("is-expanded"), PREVIEW_STACKED_HOLD_MS);
  }
}

function hidePreview() {
  clearTimeout(expandTimer);
  shownCard = null;
  shownProject = null;
  preview.classList.remove("is-open", "is-expanded");
  veil.classList.remove("is-open");
  arrows.forEach((arrow) => arrow.classList.remove("is-open"));
}

// The preview is one link to the project.
preview.addEventListener("click", (e) => {
  if (e.target.closest(".card-preview-close")) {
    e.preventDefault();
    hidePreview();
    return;
  }
  // A swipe isn't a click on the project.
  if (swiped) {
    e.preventDefault();
    swiped = false;
  }
});

const previewCard = (el) => el && el.closest && el.closest(".card[data-project]");

// The first click on a card opens its preview, a click on the preview opens
// the project and a click anywhere else closes it.
track.addEventListener("click", (e) => {
  const card = previewCard(e.target);
  if (!card) return;
  e.preventDefault();
  if (card !== shownCard) showPreview(card);
});
veil.addEventListener("click", hidePreview);
// Swiping the click-opened preview sideways steps to the next or previous
// project.
let swipeStart = null;
let swiped = false;
preview.addEventListener("pointerdown", (e) => {
  swipeStart = { x: e.clientX, y: e.clientY };
  swiped = false;
});
preview.addEventListener("pointerup", (e) => {
  if (!swipeStart) return;
  const dx = e.clientX - swipeStart.x;
  const dy = e.clientY - swipeStart.y;
  swipeStart = null;
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    swiped = true;
    stepPreview(dx < 0 ? 1 : -1);
  }
});
preview.addEventListener("dragstart", (e) => e.preventDefault());
window.addEventListener("scroll", () => { if (shownCard) hidePreview(); }, { passive: true });
window.addEventListener("resize", hidePreview);

/* ---------- Card swaps ---------- */

// Every couple of seconds one random card on screen fades over to a project
// or illustration (the same kind) that isn't showing, so the wall slowly
// cycles through all the work. Held while the pointer is on the wall or a
// preview is open; off with reduced motion.
const SWAP_EVERY_MS = 2200;
// Phones show only part of the wall at a time, so cards change faster.
const PHONE_SWAP_EVERY_MS = 1600;
const SWAP_FADE_MS = 450;

// Images on their way in (loading, or the old card still fading out) count
// as shown, and a card already being swapped out isn't picked again.
const incoming = new Set();
const leaving = new WeakSet();

function swapRandomCard() {
  if (reducedMotion.matches || document.hidden || shownCard || wall.matches(":hover")) return;

  const cards = [...track.querySelectorAll(".card[data-project]")];
  const isProject = (card) => card.classList.contains("card--project");
  const shownKeys = new Set(cards.filter(isProject).map((c) => PROJECTS[c.dataset.project].href));
  const hiddenKeys = PROJECT_KEYS.filter((k) => !shownKeys.has(k));
  // Every image on the wall, from both kinds of card: the same picture never
  // shows twice at once (some illustrations are also a project's card).
  const shownImages = new Set([...cards.map((c) => c.querySelector("img").getAttribute("src")), ...incoming]);
  const spareImages = images.filter((img) => !shownImages.has(img.src));
  // A project card gives way to a project not on the wall (when they don't
  // all fit), otherwise to another card of the same project, so every
  // project stays on the wall.
  const nextProjects = (card) => {
    const unseen = (list) => list.filter((p) => !shownImages.has(p.img.src));
    if (hiddenKeys.length) return unseen(variantsOf(pick(hiddenKeys)));
    const current = PROJECTS[card.dataset.project];
    return unseen(variantsOf(current.href).filter((p) => p !== current));
  };

  const candidates = cards.filter((card) => {
    const r = card.getBoundingClientRect();
    const onScreen = r.right > 0 && r.left < window.innerWidth && r.bottom > 0 && r.top < window.innerHeight;
    return onScreen && !leaving.has(card) && (isProject(card) ? nextProjects(card).length : spareImages.length);
  });
  if (!candidates.length) return;

  const card = pick(candidates);
  const next = isProject(card) ? makeProjectCard(pick(nextProjects(card))) : makeImageCard(pick(spareImages));
  const img = next.querySelector("img");
  const src = img.getAttribute("src");
  incoming.add(src);
  leaving.add(card);
  next.style.setProperty("--r", card.style.getPropertyValue("--r"));
  // The new card isn't on the page yet, where a lazy image would wait: load
  // and decode it first, so it fades in whole instead of popping in after.
  img.loading = "eager";
  img.decode().catch(() => {}).then(() => {
    // The wall may have been rebuilt meanwhile.
    if (!card.isConnected) { incoming.delete(src); return; }
    card.animate([{ opacity: 1 }, { opacity: 0 }], { duration: SWAP_FADE_MS, easing: "ease", fill: "forwards" })
      .onfinish = () => {
        card.replaceWith(next);
        incoming.delete(src);
        next.animate([{ opacity: 0 }, { opacity: 1 }], { duration: SWAP_FADE_MS, easing: "ease" });
      };
  });
}
const scheduleSwap = () => setTimeout(() => {
  swapRandomCard();
  scheduleSwap();
}, phone.matches ? PHONE_SWAP_EVERY_MS : SWAP_EVERY_MS);
scheduleSwap();

/* ---------- Intro ---------- */

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function runIntro() {
  const root = document.documentElement;
  if (!root.classList.contains("intro")) return;
  window.scrollTo(0, 0);

  // Wait for the real font so the name doesn't swap typeface while fading in.
  await Promise.race([document.fonts.ready, wait(1500)]);

  const steps = [
    ["intro--name", 900],    // name fades in where it rests
    ["intro--ball", 500],    // ball pops in
    ["intro--line", 1300],   // ball stretches into the line while the page fades in (--line-dur)
  ];
  for (const [cls, ms] of steps) {
    root.classList.add(cls);
    await wait(ms);
  }
  root.classList.remove("intro", ...steps.map(([cls]) => cls));
}

runIntro();

/* ---------- Projects view header ---------- */

// Like the project pages' header: it slides away while scrolling down and
// returns when scrolling up (or on hover, see .project-header.is-hidden).
{
  const header = document.querySelector(".projects-header");
  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (y > lastY + 4 && y > header.offsetHeight) header.classList.add("is-hidden");
    else if (y < lastY - 4) header.classList.remove("is-hidden");
    lastY = y;
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
}
