"use strict";

// Click a case image to see it enlarged. The arrows (or the arrow keys) step
// through the page's images; click anywhere else or press Esc to close.
// Links (like Next project), decorative images (empty alt) and images marked
// data-no-zoom are left alone.
(() => {
  const images = [...document.querySelectorAll("main img")]
    .filter((img) => img.alt && !img.closest("a") && !img.hasAttribute("data-no-zoom"));
  if (!images.length) return;

  const arrow = (dir, label, path) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `lightbox-arrow lightbox-arrow--${dir}`;
    btn.setAttribute("aria-label", label);
    btn.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
    return btn;
  };

  const box = document.createElement("dialog");
  box.className = "lightbox";
  box.setAttribute("aria-label", "Enlarged image");
  const big = document.createElement("img");
  const prev = arrow("prev", "Previous image", "M15 4 7 12l8 8");
  const next = arrow("next", "Next image", "M9 4l8 8-8 8");
  box.append(prev, big, next);
  document.body.append(box);

  let current = 0;
  const show = (i) => {
    current = (i + images.length) % images.length;
    const img = images[current];
    big.src = img.src; // the full image, not the smaller one srcset picked
    big.alt = img.alt;
  };
  const step = (by) => (e) => { e.stopPropagation(); show(current + by); };
  prev.addEventListener("click", step(-1));
  next.addEventListener("click", step(1));
  prev.hidden = next.hidden = images.length < 2;

  images.forEach((img, i) => {
    img.classList.add("is-zoomable");
    img.tabIndex = 0;
    const open = () => { show(i); box.showModal(); };
    img.addEventListener("click", open);
    img.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
  });

  box.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
  box.addEventListener("click", () => box.close());
})();
