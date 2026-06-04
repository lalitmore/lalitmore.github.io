/* =============================================================
   render.js  —  Builds the page from window.SITE_CONTENT
   -------------------------------------------------------------
   You should not need to edit this file. All content lives in
   content.js. This file just turns that data into HTML safely.

   Security note: every piece of text is inserted with
   textContent (never innerHTML), so nothing in content.js can
   inject scripts. Only the tiny **bold** helper builds elements,
   and it also uses text nodes — never raw HTML.
   ============================================================= */
(function () {
  "use strict";

  var C = window.SITE_CONTENT;
  if (!C) {
    console.error("content.js did not load — SITE_CONTENT is missing.");
    return;
  }

  /* ---- tiny helpers ---- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }
  function $(id) { return document.getElementById(id); }

  // Render text that may contain **bold** segments, safely (no innerHTML).
  function richText(parent, text) {
    var parts = String(text).split("**");
    parts.forEach(function (part, i) {
      if (part === "") return;
      if (i % 2 === 1) {
        parent.appendChild(el("b", null, part));
      } else {
        parent.appendChild(document.createTextNode(part));
      }
    });
  }

  /* ---- Identity / nav / footer ---- */
  document.title = C.name + " // CS + Data Science";
  $("nav-name").textContent = C.name;
  $("nav-set").textContent = "SET #" + C.setNumber;
  $("nav-status-text").textContent = C.status;
  $("foot-name").textContent = C.name;
  $("foot-year").textContent = new Date().getFullYear();

  /* ---- Hero ---- */
  $("hero-eyebrow").textContent = C.eyebrow;
  var nameParts = C.name.trim().split(/\s+/);
  $("hero-name1").textContent = nameParts[0] || C.name;
  $("hero-name2").textContent = (nameParts.slice(1).join(" ") || "") + ".";

  var sub = $("hero-sub");
  sub.appendChild(el("b", null, C.role));
  sub.appendChild(document.createTextNode(" " + C.tagline));

  $("hero-resume").href = C.resumeUrl;
  $("contact-resume").href = C.resumeUrl;
  $("contact-email").href = "mailto:" + C.email;

  var statsWrap = $("hero-stats");
  (C.stats || []).forEach(function (s) {
    var block = el("div");
    block.appendChild(el("div", "stat-val", s.val));
    block.appendChild(el("div", "stat-lab", s.lab));
    statsWrap.appendChild(block);
  });

  /* ---- Social links ---- */
  var socialWrap = $("social-links");
  var socialMap = [
    { key: "github", label: "GitHub ↗" },
    { key: "linkedin", label: "LinkedIn ↗" }
  ];
  socialMap.forEach(function (s) {
    if (C.socials && C.socials[s.key]) {
      var a = el("a", "social-link", s.label);
      a.href = C.socials[s.key];
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      socialWrap.appendChild(a);
    }
  });
  var mail = el("a", "social-link", "Email ↗");
  mail.href = "mailto:" + C.email;
  socialWrap.appendChild(mail);

  /* ---- Projects ---- */
  var grid = $("proj-grid");
  (C.projects || []).forEach(function (p) {
    var card = el("article", "proj-card");
    card.setAttribute("data-cat", p.category);

    // Roof
    var roof = el("div", "card-roof roof-" + (p.color || "blue"));
    var roofTop = el("div", "roof-top");
    roofTop.appendChild(el("span", "card-set-num", p.setNum));
    roofTop.appendChild(el("span", "card-badge", p.badge));
    roof.appendChild(roofTop);
    var studs = el("div", "card-studs-row");
    for (var i = 0; i < 5; i++) studs.appendChild(el("div", "card-stud"));
    roof.appendChild(studs);
    card.appendChild(roof);

    // Body
    var body = el("div", "card-body");
    body.appendChild(el("h3", "card-title", p.title));
    body.appendChild(el("p", "card-desc", p.desc));

    var metrics = el("div", "card-metrics");
    (p.metrics || []).forEach(function (m) {
      var mb = el("div");
      mb.appendChild(el("div", "metric-val", m.val));
      mb.appendChild(el("div", "metric-lab", m.lab));
      metrics.appendChild(mb);
    });
    body.appendChild(metrics);

    var tags = el("div", "card-tags");
    (p.tags || []).forEach(function (t) { tags.appendChild(el("span", "tag", t)); });
    body.appendChild(tags);

    var actions = el("div", "card-actions");
    (p.links || []).forEach(function (lnk) {
      var a = el("a", "card-btn" + (lnk.primary ? " primary" : ""), lnk.label);
      a.href = lnk.url || "#";
      if (a.href && lnk.url && lnk.url !== "#") { a.target = "_blank"; a.rel = "noopener noreferrer"; }
      actions.appendChild(a);
    });
    body.appendChild(actions);

    card.appendChild(body);
    card.setAttribute("data-reveal", "");
    grid.appendChild(card);
  });

  /* ---- Skills ---- */
  var skillsGrid = $("skills-grid");
  (C.skills || []).forEach(function (sk) {
    var brick = el("div", "skill-brick");
    brick.setAttribute("data-reveal", "");

    var roof = el("div", "skill-roof roof-" + (sk.color || "red"));
    roof.appendChild(el("span", "skill-roof-label", sk.label));
    var studs = el("div", "skill-studs");
    for (var i = 0; i < 3; i++) studs.appendChild(el("div", "skill-stud"));
    roof.appendChild(studs);
    brick.appendChild(roof);

    var ul = el("ul", "skill-list");
    (sk.items || []).forEach(function (item) {
      var li = el("li");
      li.appendChild(el("span", "dot"));
      li.appendChild(document.createTextNode(item));
      ul.appendChild(li);
    });
    brick.appendChild(ul);
    skillsGrid.appendChild(brick);
  });

  /* ---- About ---- */
  var aboutText = $("about-text");
  (C.about && C.about.paragraphs || []).forEach(function (para) {
    var p = el("p");
    richText(p, para);
    aboutText.appendChild(p);
  });

  var specRows = $("spec-rows");
  (C.about && C.about.specs || []).forEach(function (row) {
    var r = el("div", "spec-row");
    r.appendChild(el("span", "spec-key", row.key));
    var val = el("span", "spec-val");
    if (row.highlight) {
      val.appendChild(el("span", "open", "● " + row.val));
    } else {
      val.textContent = row.val;
    }
    r.appendChild(val);
    specRows.appendChild(r);
  });

  /* =========================================================
     INTERACTIONS
     ========================================================= */

  // Scroll reveal (respects reduced-motion via CSS)
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var delay = parseInt(entry.target.getAttribute("data-delay") || "0", 10);
        setTimeout(function () { entry.target.classList.add("in"); }, delay);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll("[data-reveal]").forEach(function (node, i) {
    node.setAttribute("data-delay", String((i % 4) * 80));
    io.observe(node);
  });

  // Project filter
  document.querySelectorAll(".filter").forEach(function (btn) {
    btn.addEventListener("click", function () {
      document.querySelectorAll(".filter").forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      var cat = btn.getAttribute("data-filter");
      document.querySelectorAll(".proj-card").forEach(function (card) {
        var show = cat === "all" || card.getAttribute("data-cat") === cat;
        card.classList.toggle("hide", !show);
      });
    });
  });

  // Mobile nav
  var menuBtn = $("menu-btn");
  var mobileNav = $("mobile-nav");
  function closeMobile() {
    mobileNav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.textContent = "☰";
  }
  menuBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    var open = mobileNav.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "✕" : "☰";
  });
  mobileNav.querySelectorAll("[data-close]").forEach(function (a) {
    a.addEventListener("click", closeMobile);
  });
  document.addEventListener("click", function (e) {
    if (!mobileNav.contains(e.target) && e.target !== menuBtn) closeMobile();
  });
})();
