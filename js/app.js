const $ = (s, r = document) => r.querySelector(s),
  $$ = (s, r = document) => [...r.querySelectorAll(s)];
const toast = (m) => {
  let t =
    $(".toast") ||
    document.body.appendChild(
      Object.assign(document.createElement("div"), { className: "toast" }),
    );
  t.textContent = m;
  t.classList.add("show");
  clearTimeout(t.h);
  t.h = setTimeout(() => t.classList.remove("show"), 3200);
};
const auth = document.body.dataset.page === "auth",
  light = document.body.dataset.nav === "light";
$("#nav").outerHTML =
  `<header class="nav ${light ? "light" : ""}" id="nav"><div class="wrap"><a class="logo" href="index.html"><i></i>Roamly</a><nav id="primary-navigation" aria-label="Main navigation">${auth ? '<a href="index.html">Back to Roamly</a>' : '<a href="index.html#destinations">Destinations</a><a href="index.html#stays">Stays</a><a href="support.html">Support</a><a href="signin.html">Sign in</a><a class="btn sm sun" href="signup.html">Create account</a>'}</nav><button class="menu-toggle" type="button" aria-label="Open navigation" aria-controls="primary-navigation" aria-expanded="false"><span></span><span></span><span></span></button></div></header>`;
const ft = $("#foot");
if (ft)
  ft.outerHTML = `<footer><div class="wrap"><div class="cols"><div><a class="logo" href="index.html" style="color:#fff"><i></i>Roamly</a><p style="margin-top:12px;max-width:30ch">Stays, experiences and trip planning in one calm place.</p><div class="sub"><input placeholder="you@email.com" aria-label="Email"><button class="btn sm sun" onclick="toast('Subscribed. Welcome aboard!')">Subscribe</button></div></div>${[
    ["Destinations", "Lisbon", "Kyoto", "Copenhagen", "Vancouver"],
    ["Stays", "Guesthouses", "Boutique hotels", "Apartments", "Villas"],
    ["Experiences", "Food walks", "Day trips", "Culture", "Outdoors"],
    ["Company", "About us", "Careers", "Press", "Impact"],
    ["Support", "Help center", "Cancellation policy", "Safety", "Contact desk"],
  ]
    .map(
      (c) =>
        `<div><h4>${c[0]}</h4>${c
          .slice(1)
          .map(
            (x) =>
              `<a href="${x == "Contact desk" || x == "Help center" ? "support.html" : "#"}">${x}</a>`,
          )
          .join("")}</div>`,
    )
    .join(
      "",
    )}</div><div class="copy"><span>© 2026 Roamly. Prototype for demonstration.</span><span>Privacy · Terms · Cookies</span></div></div></footer>`;
const nav = $("#nav"),
  sync = () => nav.classList.toggle("solid", scrollY > 40 || !light);
addEventListener("scroll", sync, { passive: true });
sync();
const menuButton = $(".menu-toggle", nav);
const primaryNavigation = $("#primary-navigation", nav);
const mobileNavigation = matchMedia("(max-width: 900px)");
let isMobileNavigation = !mobileNavigation.matches;
const setMenuOpen = (isOpen) => {
  if (!mobileNavigation.matches) return;
  primaryNavigation.hidden = !isOpen;
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation",
  );
  nav.classList.toggle("menu-open", isOpen);
};
const syncMenuToViewport = () => {
  const isMobile = mobileNavigation.matches;
  if (isMobile === isMobileNavigation) return;
  isMobileNavigation = isMobile;
  primaryNavigation.hidden = isMobile;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open navigation");
  nav.classList.remove("menu-open");
};
menuButton.addEventListener("click", () => {
  setMenuOpen(primaryNavigation.hidden);
});
primaryNavigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenuOpen(false);
});
document.addEventListener("pointerdown", (event) => {
  if (
    mobileNavigation.matches &&
    !primaryNavigation.hidden &&
    !primaryNavigation.contains(event.target) &&
    !menuButton.contains(event.target)
  ) {
    setMenuOpen(false);
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !primaryNavigation.hidden) {
    setMenuOpen(false);
    menuButton.focus();
  }
});
mobileNavigation.addEventListener("change", syncMenuToViewport);
addEventListener("resize", syncMenuToViewport, { passive: true });
syncMenuToViewport();
$$("[data-split]").forEach((h) => {
  h.innerHTML = h.textContent
    .trim()
    .split(" ")
    .map(
      (w, i) => `<span style="animation-delay:${0.15 * i}s">${w}&nbsp;</span>`,
    )
    .join("");
});
const io = new IntersectionObserver(
  (e) =>
    e.forEach((x) => {
      if (x.isIntersecting) {
        x.target.classList.add("in");
        io.unobserve(x.target);
      }
    }),
  { threshold: 0.12 },
);
$$(".rv").forEach((el, i) => {
  el.style.transitionDelay = (i % 4) * 90 + "ms";
  io.observe(el);
});
const bg = $(".hero .bg");
if (bg)
  addEventListener(
    "scroll",
    () => {
      bg.style.translate = `0 ${scrollY * 0.2}px`;
    },
    { passive: true },
  );
$("#search")?.addEventListener("submit", (e) => {
  e.preventDefault();
  toast(`Searching stays in ${$("#dest").value || "any destination"}…`);
});
$$("[data-toast]").forEach((b) =>
  b.addEventListener("click", (e) => {
    e.preventDefault();
    toast(b.dataset.toast);
  }),
);
const rules = {
  email: (v) =>
    /^\S+@\S+\.\S+$/.test(v) || "Enter a valid email like you@example.com.",
  password: (v) => v.length >= 1 || "Enter your password.",
  newpass: (v) =>
    (v.length >= 8 && /\d/.test(v) && /[a-zA-Z]/.test(v)) ||
    "Use at least 8 characters, including a letter and a number.",
  name: (v) => v.trim().length > 1 || "Enter your full name.",
  req: (v) => v.trim().length > 2 || "This field is required.",
};
$$("form[data-form]").forEach((fm) =>
  fm.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    $$("[data-rule]", fm).forEach((i) => {
      const r = i.parentElement;
      let m = $(".err", r);
      if (!m) {
        m = Object.assign(document.createElement("div"), { className: "err" });
        r.append(m);
      }
      const res = rules[i.dataset.rule](i.value);
      r.classList.toggle("bad", res !== true);
      m.textContent = res === true ? "" : res;
      if (res !== true) ok = false;
    });
    if (!ok) return;
    const b = $("button[type=submit]", fm),
      t = b.textContent;
    b.textContent = "Please wait…";
    b.disabled = true;
    setTimeout(() => {
      if (fm.dataset.next) location.href = fm.dataset.next;
      else {
        toast(fm.dataset.msg || "Done!");
        b.textContent = t;
        b.disabled = false;
        fm.reset();
      }
    }, 1100);
  }),
);
$$(".eye").forEach((b) =>
  b.addEventListener("click", () => {
    const i = b.previousElementSibling;
    i.type = i.type == "password" ? "text" : "password";
    b.textContent = i.type == "password" ? "Show" : "Hide";
  }),
);
const helpInput = $("#kb");
const helpEntries = $$("[data-help-entry]");
const helpEmpty = $("#help-empty");
const filterHelpEntries = () => {
  const terms = helpInput.value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
  let matches = 0;
  helpEntries.forEach((entry) => {
    const searchableText =
      `${entry.textContent} ${entry.dataset.helpKeywords || ""}`.toLowerCase();
    const isMatch = terms.every((term) => searchableText.includes(term));
    entry.hidden = !isMatch;
    if (isMatch) matches++;
  });
  if (helpEmpty) helpEmpty.hidden = matches !== 0;
  return matches;
};
if (helpInput && helpEntries.length) {
  helpInput.addEventListener("input", filterHelpEntries);
  $("#help-search").addEventListener("submit", (e) => {
    e.preventDefault();
    const matches = filterHelpEntries();
    $("#knowledge-base").scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
    toast(
      matches
        ? `${matches} help ${matches === 1 ? "topic" : "topics"} found.`
        : "No matching help topics. Try another search.",
    );
  });
}
$$(".chip").forEach((chip) =>
  chip.addEventListener("click", () => {
    if (!helpInput) return;
    helpInput.value = chip.dataset.helpTopic || chip.textContent.trim();
    helpInput.dispatchEvent(new Event("input", { bubbles: true }));
    helpInput.focus();
    $("#knowledge-base")?.scrollIntoView({
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }),
);
const fileInput = $("#file");
const fileName = $("#fname");
const defaultFileLabel = fileName?.textContent.trim();
if (fileInput && fileName) {
  fileInput.addEventListener("change", () => {
    const files = [...fileInput.files];
    const invalidFile = files.find(
      (file) =>
        !/\.(pdf|jpe?g|png)$/i.test(file.name) || file.size > 10 * 1024 * 1024,
    );
    if (invalidFile) {
      fileInput.value = "";
      fileInput.setAttribute("aria-invalid", "true");
      fileName.textContent =
        invalidFile.size > 10 * 1024 * 1024
          ? `${invalidFile.name} is larger than the 10 MB limit.`
          : `${invalidFile.name} has an unsupported file type.`;
      toast(fileName.textContent);
      return;
    }
    fileInput.removeAttribute("aria-invalid");
    fileName.textContent = files.length
      ? files.map((file) => file.name).join(", ")
      : defaultFileLabel;
  });
  fileInput.form.addEventListener("reset", () => {
    requestAnimationFrame(() => {
      fileName.textContent = defaultFileLabel;
      fileInput.removeAttribute("aria-invalid");
    });
  });
}
const rs = $("#resend");
if (rs) {
  let n = 60,
    t;
  const go = () => {
    n = 60;
    rs.disabled = true;
    t = setInterval(() => {
      rs.textContent = `Resend link in ${--n}s`;
      if (n <= 0) {
        clearInterval(t);
        rs.disabled = false;
        rs.textContent = "Resend link";
      }
    }, 1000);
  };
  go();
  rs.addEventListener("click", () => {
    toast("A new link is on its way.");
    go();
  });
}
