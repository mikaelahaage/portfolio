"use strict";

// Content slides in from its side and fades in the first time it is scrolled
// into view. Once shown it stays, so scrolling back up (or past it again)
// shows no fade. Whatever is on screen at load is shown straight away, and
// reduced motion skips it. Items that position or move themselves (absolute
// stickers, anything with its own translate) are left alone, and the classes
// come off once the fade is done so each item's own styles apply again.
(() => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  // Side-by-side rows (text beside an image) fade in part by part, so each
  // side can come from its own direction.
  const items = [...document.querySelectorAll(".chapter section > *, .next-up")]
    .flatMap((el) => (el.classList.contains("intern-split") ? [...el.children] : [el]))
    .filter((el) => {
      const css = getComputedStyle(el);
      return css.position !== "absolute" && css.position !== "fixed" && css.translate === "none";
    });
  const done = (e) => {
    if (e.target !== e.currentTarget || e.propertyName !== "translate") return;
    e.target.classList.remove("reveal", "reveal--right", "is-revealed");
    e.target.removeEventListener("transitionend", done);
  };
  const show = (el) => {
    el.addEventListener("transitionend", done);
    el.classList.add("is-revealed");
  };
  // Copy that continues under a carousel (.sambla-copy--after) comes in
  // together with the start of its chapter, not on its own later.
  const followers = new Map();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      show(e.target);
      (followers.get(e.target) || []).forEach(show);
      io.unobserve(e.target);
    });
  // Any part in view counts (a tall item, like the letter feed, may never
  // be 15% visible), a little above the bottom edge.
  }, { rootMargin: "0px 0px -12% 0px" });
  items.forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight) return;
    // Things on the right half come in from the right, the rest from the left.
    if (r.left > innerWidth / 2 - 40) el.classList.add("reveal--right");
    el.classList.add("reveal");
    const leader = el.classList.contains("sambla-copy--after")
      && items.find((other) => other !== el && other.closest("section") === el.closest("section"));
    if (leader && leader.classList.contains("reveal")) {
      followers.set(leader, [...(followers.get(leader) || []), el]);
    } else {
      io.observe(el);
    }
  });
})();
