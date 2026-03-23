(function () {
  var header = document.querySelector(".site-header");
  var toggle = document.querySelector(".nav-toggle");
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
