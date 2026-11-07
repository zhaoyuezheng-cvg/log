/* 八上历史知识清单 · 网页版 — interactions */
(function () {
  "use strict";

  /* ---------- mobile drawer ---------- */
  var sidebar = document.querySelector(".sidebar");
  var mask = document.querySelector(".side-mask");
  var menuBtn = document.querySelector(".menu-btn");
  function closeNav() {
    if (!sidebar) return;
    sidebar.classList.remove("open");
    if (mask) mask.classList.remove("show");
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      if (mask) mask.classList.toggle("show");
    });
  }
  if (mask) mask.addEventListener("click", closeNav);

  /* ---------- scroll progress ---------- */
  var progress = document.getElementById("progress");
  function updateProgress() {
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
    var bt = document.querySelector(".back-top");
    if (bt) bt.classList.toggle("show", h.scrollTop > 500);
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  /* ---------- back to top ---------- */
  var backTop = document.querySelector(".back-top");
  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- sidebar unit expand / collapse ---------- */
  document.querySelectorAll(".nav-unit").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var group = btn.closest(".nav-group");
      if (group) group.classList.toggle("open");
    });
  });

  /* ---------- nav link click: smooth scroll + close drawer ---------- */
  document.querySelectorAll(".nav-kd a, .nav-unit .u-title").forEach(function (a) {
    a.addEventListener("click", function () {
      closeNav();
    });
  });

  /* ---------- scrollspy ---------- */
  var kdSections = Array.prototype.slice.call(document.querySelectorAll(".kd[id]"));
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-kd a"));
  function activate(id) {
    navLinks.forEach(function (l) {
      var on = l.getAttribute("href") === "#" + id;
      l.classList.toggle("active", on);
      if (on) {
        var grp = l.closest(".nav-group");
        if (grp) grp.classList.add("open");
      }
    });
  }
  if ("IntersectionObserver" in window && kdSections.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) activate(en.target.id);
        });
      },
      { rootMargin: "-12% 0px -72% 0px", threshold: 0 }
    );
    kdSections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- accordion (核心素养) ---------- */
  document.querySelectorAll(".acc-head").forEach(function (head) {
    head.addEventListener("click", function () {
      head.closest(".acc").classList.toggle("open");
    });
  });

  /* ---------- search ---------- */
  var searchInput = document.getElementById("siteSearch");
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      var q = searchInput.value.trim();
      var units = document.querySelectorAll(".unit");
      if (!q) {
        document.querySelectorAll(".kd.search-hidden").forEach(function (el) {
          el.classList.remove("search-hidden");
        });
        units.forEach(function (u) { u.style.display = ""; });
        return;
      }
      var lower = q.toLowerCase();
      units.forEach(function (unit) {
        var any = false;
        unit.querySelectorAll(".kd").forEach(function (kd) {
          var hit = kd.textContent.toLowerCase().indexOf(lower) !== -1;
          kd.classList.toggle("search-hidden", !hit);
          if (hit) any = true;
        });
        unit.style.display = any ? "" : "none";
      });
    });
  }

  /* ---------- theme toggle ---------- */
  var themeBtn = document.querySelector(".theme-toggle");
  var stored = null;
  try { stored = localStorage.getItem("lsk-theme"); } catch (e) {}
  if (stored === "dark") document.body.classList.add("dark");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      document.body.classList.toggle("dark");
      var dark = document.body.classList.contains("dark");
      themeBtn.textContent = dark ? "☀️ 切换浅色模式" : "🌙 切换深色模式";
      try { localStorage.setItem("lsk-theme", dark ? "dark" : "light"); } catch (e) {}
    });
    if (document.body.classList.contains("dark")) {
      themeBtn.textContent = "☀️ 切换浅色模式";
    }
  }

  /* ---------- open first unit by default ---------- */
  var first = document.querySelector(".nav-group");
  if (first && window.innerWidth > 920) first.classList.add("open");
})();
