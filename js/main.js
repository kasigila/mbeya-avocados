(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Sticky header elevate on scroll (subtle premium effect)
  const header = $(".header");
  const onScrollHeader = () => {
    if (!header) return;
    const scrolled = window.scrollY > 6;
    header.style.boxShadow = scrolled ? "0 14px 34px rgba(14,27,20,.10)" : "none";
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  // Mobile nav toggle
  const toggle = $(".nav__toggle");
  const panel = $("#navPanel");
  if (toggle && panel) {
    toggle.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    // Close panel when tapping outside (mobile)
    document.addEventListener("click", (e) => {
      const isOpen = panel.classList.contains("is-open");
      if (!isOpen) return;
      const target = e.target;
      if (panel.contains(target) || toggle.contains(target)) return;
      panel.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    });
  }

  // Dropdown
  $$(".nav__dropdown").forEach((dd) => {
    const btn = $(".nav__linkBtn", dd);
    const menu = $(".nav__menu", dd);
    if (!btn || !menu) return;

    btn.addEventListener("click", () => {
      const open = dd.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  // Smooth scroll buttons
  $$("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const targetSel = btn.getAttribute("data-scroll");
      const target = targetSel === "body" ? document.body : $(targetSel);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Reveal on scroll
  const revealEls = $$(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => io.observe(el));

  // FAQ accordion
  $$(".faq__q").forEach((q) => {
    q.addEventListener("click", () => {
      const expanded = q.getAttribute("aria-expanded") === "true";
      const answer = q.nextElementSibling;
      const icon = $(".faq__icon", q);

      q.setAttribute("aria-expanded", String(!expanded));
      if (answer) answer.hidden = expanded;
      if (icon) icon.textContent = expanded ? "+" : "–";
    });
  });

  // Prefill messaging
  const form = $("#prefillForm");
  const EMAIL_TO = "info@mbeyaavocados.co.tz";
  const WA_TZ = "255754763558";
  const WA_US = "12698613487";

  function safe(v) {
    return (v || "").toString().trim();
  }

  function buildMessage(data) {
    const lines = [
      "Hello Mbeya Avocados,",
      "",
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
      `Interest: ${data.interest}`,
      "",
      "Message:",
      data.message,
      "",
      "— Sent from mbeyaavocados.co.tz",
    ].filter(Boolean);
    return lines.join("\n");
  }

  function getFormData() {
    if (!form) return null;
    const fd = new FormData(form);
    return {
      name: safe(fd.get("name")),
      email: safe(fd.get("email")),
      phone: safe(fd.get("phone")),
      interest: safe(fd.get("interest")),
      message: safe(fd.get("message")),
    };
  }

  function openEmail(data) {
    const subject = encodeURIComponent(`Mbeya Avocados Inquiry — ${data.interest || "Message"}`);
    const body = encodeURIComponent(buildMessage(data));
    const mailto = `mailto:${EMAIL_TO}?subject=${subject}&body=${body}`;
    window.location.href = mailto;
  }

  function openWhatsApp(data, which) {
    const msg = encodeURIComponent(buildMessage(data));
    const phone = which === "us" ? WA_US : WA_TZ;
    const url = `https://wa.me/${phone}?text=${msg}`;
    window.open(url, "_blank", "noopener");
  }

  // Buttons inside form
  $$("[data-send]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const data = getFormData();
      if (!data) return;

      // Basic validation
      if (!data.name || !data.email || !data.message) {
        alert("Please fill in your name, email, and message.");
        return;
      }

      const mode = btn.getAttribute("data-send");
      if (mode === "email") {
        openEmail(data);
      } else if (mode === "whatsapp") {
        const wa = btn.getAttribute("data-wa") || "tz";
        openWhatsApp(data, wa);
      }
    });
  });

  // WhatsApp chooser modal (mobile sticky)
  const waModal = $("#waModal");
  const openWaBtn = $("[data-open-wa]");
  const closeEls = $$("[data-close-modal]");

  function setModal(open) {
    if (!waModal) return;
    waModal.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (openWaBtn && waModal) {
    openWaBtn.addEventListener("click", () => setModal(true));
  }
  closeEls.forEach((el) => el.addEventListener("click", () => setModal(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setModal(false);
  });

  // Modal choice opens WhatsApp with either:
  // - form message if filled
  // - fallback simple message
  $$("[data-wa-choice]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const which = btn.getAttribute("data-wa-choice") || "tz";
      const data = getFormData();

      if (data && (data.name || data.email || data.message)) {
        // If partially filled, still try — but ensure minimum message exists
        const minimalOk = data.name && data.email && data.message;
        if (!minimalOk) {
          alert("To send a pre-filled WhatsApp message, please fill in your name, email, and message in the form.");
          return;
        }
        openWhatsApp(data, which);
      } else {
        const fallback = encodeURIComponent("Hello Mbeya Avocados, I would like to inquire about partnership / avocados. Please share next steps. — Sent from mbeyaavocados.co.tz");
        const phone = which === "us" ? WA_US : WA_TZ;
        window.open(`https://wa.me/${phone}?text=${fallback}`, "_blank", "noopener");
      }

      setModal(false);
    });
  });
})();
