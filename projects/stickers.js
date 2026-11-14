"use strict";

// On phones the stickers wiggle when tapped rather than on hover (see the
// sticker-wiggle rules in styles.css).
(() => {
  const phone = window.matchMedia("(max-width: 640px)");
  const STICKERS = ".research-sticker, .role-sticker, .learning-sticker, .next-up-sticker, .campaign-piece--megaphone";

  document.addEventListener("click", (e) => {
    const sticker = phone.matches && e.target.closest(STICKERS);
    if (!sticker) return;
    sticker.classList.remove("is-wiggling");
    void sticker.offsetWidth; // restart the wiggle on a repeat tap
    sticker.classList.add("is-wiggling");
  });
  document.addEventListener("animationend", (e) => {
    if (e.animationName === "sticker-wiggle") e.target.classList.remove("is-wiggling");
  });
})();
