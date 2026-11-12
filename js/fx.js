function fx() {
  const q = (s) => [...document.querySelectorAll(s)];
  let p = document.createElement("div");
  p.id = "prog";
  document.body.appendChild(p);
  if (window.__fp) removeEventListener("scroll", window.__fp);
  window.__fp = () => {
    p.style.width =
      (scrollY /
        Math.max(1, document.documentElement.scrollHeight - innerHeight)) *
        100 +
      "%";
  };
  addEventListener("scroll", window.__fp, { passive: true });
  window.__fp();
  q(".hero,.sh,.auth .art").forEach((el) => {
    for (let i = 0; i < 22; i++) {
      const s = document.createElement("span"),
        z = 2 + Math.random() * 6;
      s.className = "pt";
      s.style.cssText = `left:${Math.random() * 100}%;width:${z}px;height:${z}px;animation-duration:${8 + Math.random() * 12}s;animation-delay:-${Math.random() * 14}s`;
      el.appendChild(s);
    }
  });
  q(".btn").forEach((b) => {
    b.addEventListener("click", (e) => {
      const r = b.getBoundingClientRect(),
        s = Math.max(r.width, r.height),
        d = document.createElement("span");
      d.className = "ripple";
      d.style.cssText = `width:${s}px;height:${s}px;left:${e.clientX - r.left - s / 2}px;top:${e.clientY - r.top - s / 2}px`;
      b.appendChild(d);
      setTimeout(() => d.remove(), 700);
    });
    b.addEventListener("mousemove", (e) => {
      const r = b.getBoundingClientRect();
      b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.18}px ${(e.clientY - r.top - r.height / 2) * 0.28}px`;
    });
    b.addEventListener("mouseleave", () => (b.style.translate = ""));
  });
  q(".card").forEach((c) => {
    c.addEventListener("mousemove", (e) => {
      const r = c.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width,
        y = (e.clientY - r.top) / r.height;
      c.style.setProperty("--ry", (x - 0.5) * 8 + "deg");
      c.style.setProperty("--rx", (0.5 - y) * 8 + "deg");
      c.style.setProperty("--mx", x * 100 + "%");
      c.style.setProperty("--my", y * 100 + "%");
    });
    c.addEventListener("mouseleave", () => {
      c.style.setProperty("--rx", "0deg");
      c.style.setProperty("--ry", "0deg");
    });
  });
  const o = new IntersectionObserver(
    (e) =>
      e.forEach((x) => {
        if (x.isIntersecting) {
          x.target.classList.add("in");
          o.unobserve(x.target);
        }
      }),
    { threshold: 0.3 },
  );
  q(".head").forEach((h) => o.observe(h));
}
