(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
  var themeToggle = document.querySelector(".theme-toggle");
  var toTopBtn = document.querySelector(".to-top-btn");
  var mobile = document.querySelector(".nav-mobile");
  var navLinks = document.querySelectorAll('.nav-desktop a[href^="#"], .nav-mobile a[href^="#"]');

  if (toggle && mobile) {
    toggle.addEventListener("click", function () {
      mobile.classList.toggle("open");
      var open = mobile.classList.contains("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.textContent = open ? "✕" : "☰";
    });

    mobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        mobile.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "☰";
      });
    });
  }

  var sections = [];
  navLinks.forEach(function (a) {
    var id = a.getAttribute("href");
    if (id && id.charAt(0) === "#") {
      var el = document.querySelector(id);
      if (el) sections.push({ id: id, el: el });
    }
  });

  function setActive() {
    var y = window.scrollY + (header ? header.offsetHeight : 0) + 40;
    var current = sections[0] && sections[0].id;
    sections.forEach(function (s) {
      var top = s.el.offsetTop;
      if (top <= y) current = s.id;
    });
    navLinks.forEach(function (a) {
      if (a.getAttribute("href") === current) a.classList.add("active");
      else a.classList.remove("active");
    });
  }

  window.addEventListener("scroll", setActive, { passive: true });
  setActive();

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    // when light theme is active, pick the preferred light palette variant (2)
    if (theme === "light") document.documentElement.setAttribute("data-light-variant", "2");
    else document.documentElement.removeAttribute("data-light-variant");
    if (themeToggle) themeToggle.textContent = theme === "light" ? "◑" : "◐";
  }

  var savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var current = document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
      var next = current === "light" ? "dark" : "light";
      applyTheme(next);
      localStorage.setItem("theme", next);
    });
  }

  var copyEmailBtn = document.querySelector(".copy-email-btn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", function () {
      var email = copyEmailBtn.getAttribute("data-email");
      navigator.clipboard.writeText(email).then(function () {
        var original = copyEmailBtn.textContent;
        copyEmailBtn.textContent = "Copied";
        setTimeout(function () {
          copyEmailBtn.textContent = original;
        }, 1200);
      });
    });
  }

  function toggleToTop() {
    if (!toTopBtn) return;
    if (window.scrollY > 500) toTopBtn.classList.add("visible");
    else toTopBtn.classList.remove("visible");
  }

  if (toTopBtn) {
    toTopBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  window.addEventListener("scroll", toggleToTop, { passive: true });
  toggleToTop();

  var searchInput = document.getElementById("project-search");
  var chips = document.querySelectorAll(".chip");
  var cards = document.querySelectorAll("#project-grid .project-card");
  var emptyMessage = document.getElementById("project-empty");
  var activeFilter = "all";

  function applyProjectFilter() {
    var query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    var visible = 0;
    cards.forEach(function (card) {
      var tags = (card.getAttribute("data-tags") || "").toLowerCase();
      var text = card.textContent.toLowerCase();
      var matchFilter = activeFilter === "all" || tags.indexOf(activeFilter) > -1;
      var matchQuery = !query || text.indexOf(query) > -1 || tags.indexOf(query) > -1;
      var show = matchFilter && matchQuery;
      card.classList.toggle("is-hidden", !show);
      if (show) visible += 1;
    });
    if (emptyMessage) emptyMessage.hidden = visible !== 0;
  }

  chips.forEach(function (chip) {
    chip.addEventListener("click", function () {
      chips.forEach(function (c) { c.classList.remove("active"); });
      chip.classList.add("active");
      activeFilter = chip.getAttribute("data-filter") || "all";
      applyProjectFilter();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", applyProjectFilter);
  }
  applyProjectFilter();

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add("visible");
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    observer.observe(el);
  });
})();

/* -- Typewriter for hero heading -- */
(function () {
  var el = document.getElementById("type");
  var aria = document.getElementById("type-aria");
  if (!el) return;

  var phrases = [
    "Jay Patel",
    "jay.dev",
    "Software Developer",
    "AI & ML enthusiast",
    "Competitive programmer",
    "Building reliable systems"
  ];

  var typingSpeed = 90; // ms per char
  var deletingSpeed = 45;
  var pauseAfterDefault = 1400;
  var pauseAfterName = 2000;
  var idx = 0, pos = 0, deleting = false;

  function tick() {
    var current = phrases[idx];
    if (!deleting) {
      pos++;
      el.textContent = current.slice(0, pos);
      if (aria) aria.textContent = el.textContent;
      if (pos === current.length) {
        deleting = true;
        // longer pause for the name to let it sit a bit
        var pause = idx === 0 ? pauseAfterName : pauseAfterDefault;
        setTimeout(tick, pause);
        return;
      }
      setTimeout(tick, typingSpeed);
    } else {
      pos--;
      el.textContent = current.slice(0, pos);
      if (aria) aria.textContent = el.textContent;
      if (pos === 0) {
        deleting = false;
        idx = (idx + 1) % phrases.length;
        setTimeout(tick, 350);
        return;
      }
      setTimeout(tick, deletingSpeed);
    }
  }

  // start slightly delayed so page load feels smooth
  setTimeout(tick, 700);
})();

/* -- Brand typewriter (header) -- */
// header brand typing removed per request; brand is static

/* -- Inject animated SVG blobs into the page -- */
(function injectBlobs() {
  try {
    var container = document.createElement('div');
    container.className = 'bg-blobs';
    container.innerHTML = '\n<svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">\n  <defs>\n    <linearGradient id="g1" x1="0%" x2="100%">\n      <stop offset="0%" stop-color="#7c3aed"/>\n      <stop offset="50%" stop-color="#06b6d4"/>\n      <stop offset="100%" stop-color="#0ea5e9"/>\n    </linearGradient>\n    <linearGradient id="g2" x1="0%" x2="100%">\n      <stop offset="0%" stop-color="#ff7a59"/>\n      <stop offset="100%" stop-color="#ffd194"/>\n    </linearGradient>\n  </defs>\n  <g fill="none" fill-rule="evenodd">\n    <circle cx="180" cy="160" r="220" fill="url(#g1)" fill-opacity="0.85" />\n    <circle cx="620" cy="420" r="260" fill="url(#g2)" fill-opacity="0.78" />\n    <circle cx="420" cy="220" r="180" fill="url(#g1)" fill-opacity="0.5" />\n  </g>\n</svg>';
    document.body.insertBefore(container, document.body.firstChild);
  } catch (e) {
    // fail silently
  }
})();

/* -- Auto-calculate experience years based on a start date -- */
(function () {
  try {
    var el = document.getElementById('exp-years');
    if (!el) return;
    var start = el.getAttribute('data-exp-start') || el.dataset.expStart;
    if (!start) return;
    var startDate = new Date(start);
    if (isNaN(startDate)) return;
    var now = new Date();
    var years = now.getFullYear() - startDate.getFullYear();
    // adjust if anniversary hasn't occurred yet this year
    var m = now.getMonth() - startDate.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < startDate.getDate())) years--;
    var text = '';
    if (years <= 0) text = '<1 year';
    else text = years + '+ years';
    el.textContent = text;
  } catch (e) {
    // ignore errors
  }
})();

/* -- Progressive image loader (data-src / data-srcset) -- */
(function () {
  var imgs = [].slice.call(document.querySelectorAll('img[data-src], img[data-srcset]'));
  if (!imgs.length) return;

  var io = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var img = entry.target;
      if (img.dataset.src) img.src = img.dataset.src;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.classList.add('img-lazy');
      img.addEventListener('load', function () { img.classList.add('loaded'); });
      obs.unobserve(img);
    });
  }, { rootMargin: '200px 0px', threshold: 0.01 });

  imgs.forEach(function (i) { io.observe(i); });
})();
