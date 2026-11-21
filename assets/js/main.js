// Omkar Mahajan — Personal Record
// Small, dependency-free interaction layer.

(function () {
  "use strict";

  /* ---------- Nav scroll state ---------- */
  var nav = document.getElementById("site-nav");
  var onScroll = function () {
    if (window.scrollY > 12) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  };
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("mobile-menu");

  function closeMenu() {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
    document.body.style.overflow = "";
  }
  function openMenu() {
    toggle.setAttribute("aria-expanded", "true");
    menu.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }
  toggle.addEventListener("click", function () {
    var isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (isOpen) { closeMenu(); } else { openMenu(); }
  });
  menu.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- Smooth scroll for in-page links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", id);
    });
  });

  /* ---------- Scroll-reveal ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && revealEls.length) {
    var groups = {};
    revealEls.forEach(function (el) {
      var parent = el.closest("section") || el.closest("header") || document.body;
      var key = parent;
      if (!groups[key]) groups[key] = [];
      groups[key].push(el);
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var siblings = groups[entry.target.closest("section") || entry.target.closest("header") || document.body] || [entry.target];
            var index = siblings.indexOf(entry.target);
            var delay = Math.max(index, 0) * 90;
            setTimeout(function () {
              entry.target.classList.add("is-visible");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Contact form (Netlify Forms AJAX) ---------- */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);

      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      })
        .then(function (response) {
          if (response.ok) {
            status.textContent = "Message sent — thank you for reaching out.";
            form.reset();
          } else {
            status.textContent = "Something went wrong. Please email directly instead.";
          }
        })
        .catch(function () {
          status.textContent = "Something went wrong. Please email directly instead.";
        });
    });
  }
})();
