/* ============================================================
   历史考点研究 · 网页版  |  交互脚本
   ============================================================ */
(function () {
  "use strict";

  /* ---------- 主题切换 ---------- */
  const root = document.documentElement;
  const themeBtn = document.getElementById("themeBtn");
  const savedTheme = localStorage.getItem("hist8-theme");
  if (savedTheme) root.setAttribute("data-theme", savedTheme);
  function syncThemeIcon() {
    if (themeBtn) themeBtn.textContent = root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
  }
  syncThemeIcon();
  themeBtn && themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("hist8-theme", next);
    syncThemeIcon();
  });

  /* ---------- 阅读进度条 + 返回顶部 ---------- */
  const progress = document.getElementById("progress");
  const toTop = document.getElementById("toTop");
  function onScroll() {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
    if (toTop) toTop.classList.toggle("show", window.scrollY > 600);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
  toTop && toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- 移动端侧栏 ---------- */
  const sidebar = document.getElementById("sidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const menuBtn = document.getElementById("menuBtn");
  function closeSidebar() {
    sidebar && sidebar.classList.remove("open");
    backdrop && backdrop.classList.remove("show");
  }
  menuBtn && menuBtn.addEventListener("click", () => {
    const open = sidebar.classList.toggle("open");
    backdrop && backdrop.classList.toggle("show", open);
  });
  backdrop && backdrop.addEventListener("click", closeSidebar);

  /* ---------- 目录树展开/折叠 ---------- */
  document.querySelectorAll(".toc-unit > button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const unit = btn.parentElement;
      const open = unit.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });
  // 目录链接点击：移动端自动关闭侧栏 + 展开所属单元
  document.querySelectorAll(".toc-sub a").forEach((a) => {
    a.addEventListener("click", () => {
      closeSidebar();
      const unit = a.closest(".toc-unit");
      if (unit) unit.classList.add("open");
    });
  });

  /* ---------- ScrollSpy：高亮当前小节 ---------- */
  const tocLinks = Array.from(document.querySelectorAll(".toc-sub a"));
  const sections = tocLinks
    .map((a) => {
      const id = a.getAttribute("href");
      return id && id.startsWith("#") ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  function activate(id) {
    tocLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + id));
  }
  if ("IntersectionObserver" in window && sections.length) {
    let visible = new Map();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) visible.set(e.target.id, e.intersectionRatio);
          else visible.delete(e.target.id);
        });
        if (visible.size) {
          let best = null, bestTop = Infinity;
          visible.forEach((_, id) => {
            const top = document.getElementById(id).getBoundingClientRect().top;
            if (Math.abs(top) < Math.abs(bestTop)) { bestTop = top; best = id; }
          });
          if (best) activate(best);
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- 时间轴交互 ---------- */
  document.querySelectorAll(".timeline").forEach((tl) => {
    const detail = tl.querySelector(".tl-detail");
    const items = tl.querySelectorAll(".tl-item");
    items.forEach((item) => {
      const show = () => {
        items.forEach((i) => i.classList.remove("active"));
        item.classList.add("active");
        if (detail) {
          const year = item.dataset.year || "";
          const name = item.dataset.name || "";
          const desc = item.dataset.desc || "";
          detail.innerHTML = desc
            ? "<b>" + year + "　" + name + "</b><br>" + desc
            : "<b>" + year + "　" + name + "</b>";
        }
      };
      item.addEventListener("click", show);
      item.addEventListener("mouseenter", show);
      item.addEventListener("focus", show);
      item.setAttribute("tabindex", "0");
    });
    if (items.length) items[0].click();
  });

  /* ---------- 知识结构图：点击折叠子树 ---------- */
  document.querySelectorAll(".ktree .k-node").forEach((node) => {
    node.addEventListener("click", () => {
      const li = node.closest("li");
      if (li && li.querySelector(":scope > ul")) li.classList.toggle("collapsed");
    });
    node.setAttribute("tabindex", "0");
  });

  /* ---------- 全文搜索 ---------- */
  const input = document.getElementById("searchInput");
  const resultsBox = document.getElementById("searchResults");
  if (input && resultsBox) {
    // 构建搜索索引（以 .section 为单位）
    const index = Array.from(document.querySelectorAll(".section")).map((sec) => {
      const text = sec.textContent.replace(/\s+/g, " ").trim();
      return {
        id: sec.id,
        title: (sec.dataset.title || sec.querySelector("h3,h4,h2")?.textContent || sec.id).trim(),
        text,
      };
    });

    let debounce = null;
    input.addEventListener("input", () => {
      clearTimeout(debounce);
      debounce = setTimeout(() => runSearch(input.value.trim()), 180);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { resultsBox.innerHTML = ""; input.blur(); }
      if (e.key === "Enter") {
        const first = resultsBox.querySelector("button");
        if (first) first.click();
      }
    });
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-box")) resultsBox.innerHTML = "";
    });

    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    function runSearch(q) {
      resultsBox.innerHTML = "";
      if (!q || q.length < 1) return;
      const hits = [];
      const lower = q.toLowerCase();
      for (const item of index) {
        const pos = item.text.toLowerCase().indexOf(lower);
        if (pos === -1) continue;
        const start = Math.max(0, pos - 30);
        const end = Math.min(item.text.length, pos + q.length + 55);
        const ctx = (start > 0 ? "…" : "") + item.text.slice(start, end) + (end < item.text.length ? "…" : "");
        hits.push({ item, ctx });
        if (hits.length >= 12) break;
      }
      if (!hits.length) {
        resultsBox.innerHTML = '<button disabled style="cursor:default"><span class="s-title">未找到相关内容</span></button>';
        return;
      }
      hits.forEach(({ item, ctx }) => {
        const b = document.createElement("button");
        const safeTitle = escapeHtml(item.title);
        const safeCtx = escapeHtml(ctx);
        const re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "gi");
        b.innerHTML =
          '<span class="s-title">' + safeTitle + "</span>" +
          '<span class="s-context">' + safeCtx.replace(re, "<mark>$1</mark>") + "</span>";
        b.addEventListener("click", () => {
          resultsBox.innerHTML = "";
          const el = document.getElementById(item.id);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
            activate(item.id);
            // 闪一下目标块
            el.animate(
              [{ background: "var(--primary-soft)" }, { background: "transparent" }],
              { duration: 1400, easing: "ease-out" }
            );
          }
        });
        resultsBox.appendChild(b);
      });
    }
  }

  /* ---------- 折叠面板：全开/全关 ---------- */
  const expandAll = document.getElementById("expandAllBtn");
  expandAll && expandAll.addEventListener("click", () => {
    const all = Array.from(document.querySelectorAll("details.collapse, details.quiz"));
    const anyClosed = all.some((d) => !d.open);
    all.forEach((d) => (d.open = anyClosed));
    expandAll.textContent = anyClosed ? "全部收起 🗂" : "全部展开 📂";
  });

  /* ---------- 页脚年份 ---------- */
  const yEl = document.getElementById("year");
  if (yEl) yEl.textContent = new Date().getFullYear();
})();
