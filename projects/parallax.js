"use strict";

// Parallax on the way out, on every screen size: as a chapter's content
// scrolls off the top it moves a little slower than the page. Each chapter's
// content moves as one piece, so nothing inside it slides over anything
// else, and it never drifts past the bottom edge of its own chapter, so
// nothing slides into the next chapter or across a sand band's edge.
// Reduced motion skips it.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const SPEED = 0.25; // share of the scroll the content lags behind
  const MAX = 120;
  // The intro moves its text and photo together; chapters move their section.
  const units = [
    ...[...document.querySelectorAll(".case-intro")].map((box) => ({ box, parts: [...box.children] })),
    ...[...document.querySelectorAll(".chapter > section")].map((el) => ({ box: el.parentElement, parts: [el] })),
  ].map((u) => ({ ...u, drift: 0 }));
  if (!units.length) return;

  let queued = false;
  const update = () => {
    queued = false;
    // Read everything first, then write, so the page lays out once.
    const next = units.map(({ box, parts, drift }) => {
      const rects = parts.map((el) => el.getBoundingClientRect());
      const top = Math.min(...rects.map((r) => r.top)) - drift;
      const bottom = Math.max(...rects.map((r) => r.bottom)) - drift;
      const room = box.getBoundingClientRect().bottom - bottom - 8;
      return Math.max(0, Math.min(-top * SPEED, room, MAX));
    });
    units.forEach((u, i) => {
      if (Math.abs(next[i] - u.drift) < 0.5) return;
      u.drift = next[i];
      const value = u.drift ? `0 ${u.drift.toFixed(1)}px` : "";
      u.parts.forEach((el) => { el.style.translate = value; });
    });
  };
  const queue = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(update);
  };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  update();
})();
