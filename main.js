// main.js
// Dustless Living - Marketing Site + Portal

(() => {
  const body = document.body;

  // ===============================
  // 1. Navigation & Smooth Scroll
  // ===============================

  const clearHash = () => {
    if (window.history?.replaceState) {
      const cleanUrl = `${window.location.pathname}${window.location.search}`;
      window.history.replaceState(null, "", cleanUrl);
    } else {
      window.location.hash = "";
    }
  };

  const setBookingOpen = (isOpen) => {
    body.classList.toggle("booking-open", isOpen);
    if (!isOpen) {
      clearHash();
    }
  };

  function scrollToSection(id, { updateHash = true } = {}) {
    const el = document.getElementById(id);
    if (!el) {
      if (updateHash) {
        window.location.href = `index.html#${id}`;
      }
      return;
    }
    if (updateHash) {
      if (window.history?.replaceState) {
        window.history.replaceState(null, "", `#${id}`);
      } else {
        window.location.hash = id;
      }
    } else {
      clearHash();
    }
    const scrollToTarget = () => {
      const headerOffset = 80;
      const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    };
    if (window.matchMedia("(max-width: 768px)").matches) {
      const isHiddenDesktopSection = el.classList.contains("desktop-only");
      if (isHiddenDesktopSection) {
        document
          .querySelectorAll(".desktop-only.mobile-reveal")
          .forEach((section) => section.classList.remove("mobile-reveal"));
        el.classList.add("mobile-reveal");
      }
      requestAnimationFrame(() => requestAnimationFrame(scrollToTarget));
      if (typeof window.resizeContactMap === "function") {
        if (el.id === "serviceArea" || el.querySelector("#contactMap")) {
          requestAnimationFrame(() =>
            requestAnimationFrame(() => window.resizeContactMap())
          );
        }
      }
      return;
    }
    scrollToTarget();
  }
  window.scrollToSection = scrollToSection;
  window.scrollToSectionNoHash = (id) =>
    scrollToSection(id, { updateHash: false });

  const handleTargetScroll = (trigger, targetId) => {
    if (!targetId) return;
    if (targetId === "bookingForm") {
      setBookingOpen(true);
    } else {
      setBookingOpen(false);
    }
    scrollToSection(targetId, { updateHash: false });
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-scroll-target], a[href^=\"#\"]");
    if (!trigger) return;
    const dataTarget = trigger.getAttribute("data-scroll-target");
    const href = trigger.getAttribute("href");
    if (!dataTarget && href === "#") return;
    const targetId =
      dataTarget || (href && href.startsWith("#") ? href.slice(1) : "");
    if (!targetId) return;
    event.preventDefault();
    handleTargetScroll(trigger, targetId);
  });

  if (window.location.hash) {
    const initialTarget = window.location.hash.slice(1);
    if (initialTarget) {
      handleTargetScroll(document.body, initialTarget);
    }
  }

  const burger = document.getElementById("burger");
  const navMobile = document.getElementById("navMobile");
  const navClose = document.getElementById("navClose");

  const setNavState = (open) => {
    if (!navMobile) return;
    navMobile.classList.toggle("open", open);
    navMobile.setAttribute("aria-hidden", open ? "false" : "true");
    if (burger) burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("nav-open", open);
  };

  if (navMobile && !navMobile.classList.contains("open")) {
    navMobile.setAttribute("aria-hidden", "true");
  }

  if (burger && navMobile) {
    burger.addEventListener("click", () => {
      const isOpen = navMobile.classList.contains("open");
      setNavState(!isOpen);
    });
  }

  if (navClose) {
    navClose.addEventListener("click", () => setNavState(false));
  }

  if (navMobile) {
    navMobile.addEventListener("click", (event) => {
      if (event.target === navMobile) setNavState(false);
    });
  }

  document.querySelectorAll(".nav a, .nav-mobile a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const id = href.substring(1);
        scrollToSection(id);
        if (navMobile) setNavState(false);
      } else if (navMobile && link.closest(".nav-mobile")) {
        setNavState(false);
      }
    });
  });

  // Hero video polish (light motion backdrop)
  const heroVideo = document.querySelector("[data-hero-video]");
  if (heroVideo) {
    const setHeroPlayback = () => {
      heroVideo.defaultPlaybackRate = 0.55;
      heroVideo.playbackRate = 0.55;
    };
    ["loadedmetadata", "loadeddata", "play"].forEach((evt) =>
      heroVideo.addEventListener(evt, setHeroPlayback, { passive: true })
    );
    setHeroPlayback();
  }

  // ===============================
  // 2. Visual Polish (Particles, Reveal, Parallax)
  // ===============================

  const particlesLayer = document.getElementById("particlesLayer");

  // Soft floating dust particles
  const createParticle = () => {
    if (!particlesLayer) return;
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 3 + 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = `-20px`;
    p.style.animationDuration = `${12 + Math.random() * 10}s`;
    p.style.opacity = `${0.15 + Math.random() * 0.4}`;
    particlesLayer.appendChild(p);
    setTimeout(() => p.remove(), 20000);
  };

  if (particlesLayer) {
    for (let i = 0; i < 12; i++) createParticle();
    setInterval(createParticle, 1600);
  }

  // Reveal animation handling so sections are visible once in view
  const revealElements = document.querySelectorAll("[data-reveal], .reveal");
  if (revealElements.length) {
    const markVisible = (el) => {
      if (!el.classList.contains("visible")) {
        requestAnimationFrame(() => el.classList.add("visible"));
      }
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              markVisible(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.15,
          rootMargin: "0px 0px -10% 0px",
        }
      );
      revealElements.forEach((el) => observer.observe(el));
    } else {
      revealElements.forEach(markVisible);
    }

    window.addEventListener("load", () => {
      revealElements.forEach(markVisible);
    });
  }

  // Soft parallax on elements marked with data-parallax
  const parallaxItems = document.querySelectorAll("[data-parallax]");
  if (parallaxItems.length) {
    let ticking = false;

    const updateParallax = () => {
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const viewportCenter = window.innerHeight / 2;
        const distance = (center - viewportCenter) / window.innerHeight;
        const clamped = Math.max(Math.min(distance, 0.4), -0.4);
        item.style.setProperty("--parallax-offset", clamped.toFixed(3));
      });
      ticking = false;
    };

    const requestParallaxUpdate = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };

    updateParallax();
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
    window.addEventListener("resize", requestParallaxUpdate);
  }

  // Hero background parallax
  const heroSection = document.querySelector(".hero");
  const heroVideoBg = document.querySelector(".hero-background-video");
  if (heroSection && heroVideoBg) {
    let heroTicking = false;
    const updateHeroParallax = () => {
      const rect = heroSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const progress = rect.top / viewportHeight;
      const offset = Math.max(Math.min(progress * 20, 12), -12);
      heroVideoBg.style.setProperty("--hero-parallax", `${offset.toFixed(2)}px`);
      heroTicking = false;
    };

    const requestHeroUpdate = () => {
      if (!heroTicking) {
        heroTicking = true;
        window.requestAnimationFrame(updateHeroParallax);
      }
    };

    updateHeroParallax();
    window.addEventListener("scroll", requestHeroUpdate, { passive: true });
    window.addEventListener("resize", requestHeroUpdate);
  }

  // Scroll motion utility
  const scrollMotionEls = document.querySelectorAll(".scroll-motion");
  if (scrollMotionEls.length) {
    let scrollMotionTicking = false;

    const updateScrollMotion = () => {
      scrollMotionEls.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight || 1;
        const center = rect.top + rect.height / 2;
        const distance = (center - viewportHeight / 2) / viewportHeight;
        const offset = Math.max(Math.min(distance * 30, 12), -12);
        el.style.setProperty("--scroll-motion", `${offset.toFixed(2)}px`);
      });
      scrollMotionTicking = false;
    };

    const requestScrollMotionUpdate = () => {
      if (!scrollMotionTicking) {
        scrollMotionTicking = true;
        window.requestAnimationFrame(updateScrollMotion);
      }
    };

    updateScrollMotion();
    window.addEventListener("scroll", requestScrollMotionUpdate, {
      passive: true,
    });
    window.addEventListener("resize", requestScrollMotionUpdate);
  }

  // ===============================
  // 3. Theme Toggle (Light / Dark)
  // ===============================

  const THEME_STORAGE_KEY = "dustless_theme";
  const themeToggle = document.getElementById("themeToggle");

  const storage = {
    get() {
      try {
        return localStorage.getItem(THEME_STORAGE_KEY);
      } catch (err) {
        console.warn("Theme storage unavailable", err);
        return null;
      }
    },
    set(value) {
      try {
        localStorage.setItem(THEME_STORAGE_KEY, value);
      } catch {
        /* ignore */
      }
    },
    remove() {
      try {
        localStorage.removeItem(THEME_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    },
  };

  let currentTheme = null;

  const applyTheme = (mode) => {
    currentTheme = mode === "dark" ? "dark" : "light";
    body.classList.toggle("dark", currentTheme === "dark");
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", currentTheme === "dark");
    }
  };

  applyTheme("light");
  storage.remove();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      storage.set(nextTheme);
    });
  }


  // ===============================
  // 4. Chat Widget Toggle
  // ===============================

  const chatbot = document.getElementById("chatbot");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const chatbotToggleBtn = document.getElementById("chatbotToggle");

  const setChatbotState = (open) => {
    if (!chatbot) return;
    chatbot.classList.toggle("open", open);
    if (chatbotWindow) {
      chatbotWindow.setAttribute("aria-hidden", open ? "false" : "true");
    }
    if (chatbotToggleBtn) {
      chatbotToggleBtn.setAttribute("aria-expanded", open ? "true" : "false");
    }
  };

  const handleChatToggle = (forceState) => {
    if (!chatbot) return;
    const open =
      typeof forceState === "boolean"
        ? forceState
        : !chatbot.classList.contains("open");
    setChatbotState(open);
  };

  window.toggleChatbot = handleChatToggle;

  if (chatbotToggleBtn) {
    chatbotToggleBtn.addEventListener("click", () => handleChatToggle());
  }

  // ===============================
  // 5. Service Details Modal
  // ===============================

  const serviceDetails = {
    residential: {
      title: "Residential Cleaning",
      intro:
        "Weekly, bi-weekly, monthly, or seasonal service that keeps your home consistently fresh.",
      subcopy:
        "Handled by a consistent team with eco-friendly products, low-moisture steam, and low-scent finishing.",
      bullets: [
        "Beds made and play areas reset as requested",
        "Kitchen, bath, and main living areas detailed with gentle products",
        "Steam touch-ups for grout and textiles when needed",
        "Care notes or photos after the first visit if requested",
      ],
      note: "Kid-safe and pet-conscious products are standard. Happy to use your preferred supplies.",
      bestFor: "busy households",
      typicalTime: "2–4 hrs",
    },
    commercial: {
      title: "Commercial & Studio Care",
      intro:
        "After-hours or early-morning cleaning for boutiques, studios, clinics, and private offices.",
      subcopy:
        "Discreet service with careful detailing and fragrance-aware products.",
      bullets: [
        "Reception, display, and waiting areas reset and polished",
        "Treatment rooms sanitized, linens refreshed, amenities restocked",
        "Floors, mirrors, and touchpoints cleaned without residue",
        "Back-of-house areas tidied for a smooth open",
      ],
      note: "Need retail folding or inventory notes? Add them to your visit notes.",
      bestFor: "small teams & studios",
      typicalTime: "1.5–3 hrs",
    },
    deep: {
      title: "Deep Cleaning Reset",
      intro:
        "A detailed clean that lifts buildup, polishes fixtures, and reaches what routine visits miss.",
      subcopy:
        "Ideal before move-ins, renovations, or seasonal resets.",
      bullets: [
        "Stove, hood, backsplash, and kitchen finishes degreased",
        "Grout, fixtures, glass, and chrome detailed by hand",
        "Doors, trim, vents, and baseboards wiped clean",
        "Interior fridge or oven detailing by request",
      ],
      note: "Low-moisture steam and specialty tools used where safe for your surfaces.",
      bestFor: "seasonal deep resets",
      typicalTime: "3–5 hrs",
    },
    move: {
      title: "Move-In / Move-Out",
      intro:
        "Move-ready detailing that refreshes drawers, closets, vents, and appliances before keys change hands.",
      subcopy:
        "Trusted by landlords, renters, and Realtors preparing listings.",
      bullets: [
        "Cabinets, closets, drawers, and shelving vacuumed and wiped",
        "Appliance interiors, gaskets, and glass detailed",
        "Walls, trim, switches, and vents dusted or spot-cleaned",
        "Floors reset for inspections or staging",
      ],
      note: "Need proof-of-clean photos or key handoff support? Add it to your notes.",
      bestFor: "transitions & staging",
      typicalTime: "4–6 hrs",
    },
    airbnb: {
      title: "Airbnb / Short-Term Rental",
      intro:
        "Fast turnovers that keep listings guest-ready between stays.",
      subcopy:
        "Ideal for hosts who need reliable resets and tidy staging.",
      bullets: [
        "High-touch points sanitized between guests",
        "Beds made, linens refreshed, and surfaces reset",
        "Kitchen and bath polished for the next arrival",
        "Quick photo-ready finishing touches",
      ],
      note: "Share check-in windows and host notes so we match your turnover flow.",
      bestFor: "short-term rentals",
      typicalTime: "1–2.5 hrs",
    },
    addons: {
      title: "Add-Ons & Specialty Care",
      intro:
        "Add focused care to any visit: steam sanitizing, interior appliances, fabric care, and low-scent touch-ups.",
      subcopy:
        "Great for allergy-sensitive homes and high-touch studios. Professional carpet extraction coming soon.",
      bullets: [
        "Steam detailing on grout, upholstery, or pet zones",
        "Interior fridge, oven, and cabinet refreshes",
        "Fragrance-free cleaning available on request",
      ],
      note: "Ask about carpet cleaning if you have high-traffic halls or studio rugs.",
      bestFor: "targeted refreshes",
      typicalTime: "0.5–2 hrs per add-on",
    },
  };

  const serviceModal = document.getElementById("serviceModal");
  const serviceModalContent = document.getElementById("serviceModalContent");

  const openServiceModal = (key) => {
    if (!serviceModal || !serviceModalContent) return;
    const service = serviceDetails[key];
    if (!service) return;

    const bulletsMarkup = service.bullets
      ? `<ul class="modal-list">${service.bullets
          .map((item) => `<li>${item}</li>`)
          .join("")}</ul>`
      : "";

    const metaLines = [];
    if (service.bestFor) {
      metaLines.push(
        `<p class="modal-meta-line"><span class="modal-meta-label">Best for:</span> ${service.bestFor}</p>`
      );
    }
    if (service.typicalTime) {
      metaLines.push(
        `<p class="modal-meta-line"><span class="modal-meta-label">Typical time:</span> ${service.typicalTime}</p>`
      );
    }
    const metaMarkup = metaLines.length
      ? `<div class="modal-meta">${metaLines.join("")}</div>`
      : "";

    serviceModalContent.innerHTML = `
      <h3>${service.title}</h3>
      ${metaMarkup}
      <p>${service.intro}</p>
      ${service.subcopy ? `<p class="muted">${service.subcopy}</p>` : ""}
      ${bulletsMarkup}
      ${service.note ? `<p class="modal-note">${service.note}</p>` : ""}
    `;

    serviceModal.classList.add("is-visible");
    serviceModal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  };

  const closeServiceModal = () => {
    if (!serviceModal) return;
    serviceModal.classList.remove("is-visible");
    serviceModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  };

  window.openServiceModal = openServiceModal;
  window.closeServiceModal = closeServiceModal;

  if (serviceModal) {
    serviceModal.addEventListener("click", (event) => {
      if (event.target === serviceModal) {
        closeServiceModal();
      }
    });
  }

  // ===============================
  // 7. Testimonials Carousel
  // ===============================

  const testimonialsData = [
    {
      text:
        "I was overwhelmed by the renovation mess and embarrassed to show anyone. Antonette made it easy and didn’t judge.",
      name: "Alyssa, West Harbour (Hamilton)",
      service: "3-bedroom condo · Deep Clean Reset + Laundry Fold",
    },
    {
      text:
        "We were exhausted with the twins. She handled the bathrooms and floors so I could breathe again.",
      name: "Priya, Orchard Community (Burlington)",
      service: "Townhome · Maintenance Cleaning",
    },
    {
      text:
        "I was behind on everything and didn’t know where to start. She reset the loft without making me feel messy.",
      name: "Marcus, Locke Street (Hamilton)",
      service: "Loft space · Artful Reset",
    },
    {
      text:
        "We were under a deadline moving Mom in. She handled the deep clean so we could focus on the move.",
      name: "Danielle, Waterdown",
      service: "Bungalow · Pre-move Deep Clean",
    },
    {
      text:
        "Turnovers are tight and I don’t have time to redo anything. She gets it guest-ready without stress.",
      name: "Emily, Downtown Burlington Host",
      service: "Airbnb studio · Weekly Turnover",
    },
    {
      text:
        "We have pet fur everywhere and it was getting embarrassing. She got it under control fast.",
      name: "Sam & Jordan, Stoney Creek",
      service: "Split-level home · Pet-hair Focus Clean",
    },
    {
      text:
        "After ER shifts, I’m spent. Coming home to a clean kitchen is real relief.",
      name: "Dr. Nguyen, Crown Point (Hamilton)",
      service: "Detached home · Weekly Reset",
    },
    {
      text:
        "Guests were arriving fast and I was stressed. She handled the condo before they got here.",
      name: "Colin, Lakeshore Rd. (Burlington)",
      service: "Lakeshore condo · Seasonal Refresh",
    },
    {
      text:
        "I needed a discreet evening clean before client meetings. She handled it without disrupting our work.",
      name: "Rachel, Gore Park (Hamilton)",
      service: "Law office · After-hours Care",
    },
    {
      text:
        "After big family dinners we’re wiped out. She resets the house so we can rest the next day.",
      name: "The Martins, Ancaster",
      service: "Family home · Post-event Reset",
    },
    {
      text:
        "I was anxious about products with our baby. She checked labels before touching the nursery.",
      name: "Lina, Aldershot (Burlington)",
      service: "Semi-detached · Fragrance-free Clean",
    },
    {
      text:
        "My studio gets sweaty and I was stressed before classes. She handled floors and props without harsh smells.",
      name: "Jess, James North (Hamilton)",
      service: "Pilates studio · Nightly Studio Reset",
    },
    {
      text:
        "Move-out was a deadline and I was exhausted. She handled my daughter’s rental without the drama.",
      name: "Sandra, Westdale (Hamilton)",
      service: "Student rental · Move-out Detail",
    },
    {
      text:
        "After events the shop is a mess and we’re on the clock. She resets it before opening.",
      name: "Omar, Village Square (Burlington)",
      service: "Retail shop · After-hours Reset",
    },
    {
      text:
        "Client visits pop up fast and the studio gets chaotic. She resets it so we’re ready.",
      name: "Nadia, King Street (Hamilton)",
      service: "Creative agency · Commercial Reset",
    },
    {
      text:
        "By Friday I don’t want to think about chores. She keeps the bungalow in shape and even flags little issues.",
      name: "Graham, Mount Hope (Hamilton)",
      service: "Bungalow · Weekly Maintenance Clean",
    },
  ];

  const testimonialTextEl = document.getElementById("testimonialText");
  const testimonialNameEl = document.getElementById("testimonialName");
  const testimonialServiceEl = document.getElementById("testimonialService");
  const testimonialLocationEl = document.getElementById("testimonialLocation");
  const testimonialDotsEl = document.getElementById("testimonialDots");

  if (
    testimonialTextEl &&
    testimonialNameEl &&
    testimonialServiceEl &&
    testimonialLocationEl &&
    testimonialDotsEl &&
    testimonialsData.length
  ) {
    let testimonialIndex = 0;
    let testimonialTimer = null;

    const renderTestimonial = (index) => {
      const item = testimonialsData[index];
      testimonialTextEl.textContent = `“${item.text}”`;
      const [namePart, ...locationParts] = item.name.split(",");
      const locationLabel = locationParts.join(",").trim();
      testimonialNameEl.textContent = (namePart || "").trim();
      testimonialLocationEl.textContent = locationLabel;
      testimonialLocationEl.style.display = locationLabel ? "block" : "none";
      testimonialServiceEl.textContent = item.service || "";
      testimonialDotsEl.querySelectorAll("button").forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === index);
        dot.setAttribute("aria-current", dotIndex === index ? "true" : "false");
      });
      testimonialIndex = index;
    };

    testimonialsData.forEach((_, idx) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "testimonial-dot";
      dot.setAttribute(
        "aria-label",
        `Show testimonial ${idx + 1} of ${testimonialsData.length}`
      );
      dot.addEventListener("click", () => {
        renderTestimonial(idx);
        restartTestimonials();
      });
      testimonialDotsEl.appendChild(dot);
    });

    const startTestimonials = () => {
      testimonialTimer = window.setInterval(() => {
        const nextIndex = (testimonialIndex + 1) % testimonialsData.length;
        renderTestimonial(nextIndex);
      }, 6000);
    };

    const restartTestimonials = () => {
      if (testimonialTimer) window.clearInterval(testimonialTimer);
      startTestimonials();
    };

    renderTestimonial(0);
    startTestimonials();
  }

  // ===============================
  // 7. Accordion controls
  // ===============================

  const accordions = document.querySelectorAll("[data-accordion]");
  accordions.forEach((accordion, accordionIndex) => {
    const accordionId = accordion.getAttribute("id") || `accordion-${accordionIndex + 1}`;
    const accordionItems = accordion.querySelectorAll(".accordion-item");
    accordionItems.forEach((item, itemIndex) => {
      const header = item.querySelector(".accordion-header");
      const body = item.querySelector(".accordion-body");
      if (!header || !body) return;
      if (!body.id) {
        body.id = `${accordionId}-item-${itemIndex + 1}`;
      }
      header.setAttribute("type", "button");
      header.setAttribute("aria-controls", body.id);
      header.setAttribute("aria-expanded", item.classList.contains("open") ? "true" : "false");
      body.setAttribute("role", "region");
      body.setAttribute("aria-hidden", item.classList.contains("open") ? "false" : "true");
    });

    accordion.addEventListener("click", (event) => {
      const header = event.target.closest(".accordion-header");
      if (!header) return;
      const item = header.closest(".accordion-item");
      if (!item) return;

      const isOpen = item.classList.contains("open");
      accordion
        .querySelectorAll(".accordion-item.open")
        .forEach((openItem) => {
          if (openItem !== item) openItem.classList.remove("open");
        });

      item.classList.toggle("open", !isOpen);
      accordionItems.forEach((accordionItem) => {
        const itemHeader = accordionItem.querySelector(".accordion-header");
        const itemBody = accordionItem.querySelector(".accordion-body");
        const isItemOpen = accordionItem.classList.contains("open");
        if (itemHeader) {
          itemHeader.setAttribute("aria-expanded", isItemOpen ? "true" : "false");
        }
        if (itemBody) {
          itemBody.setAttribute("aria-hidden", isItemOpen ? "false" : "true");
        }
      });
    });
  });

  // ===============================
  // Visit dropdown controls
  // ===============================

  const visitDetails = document.querySelectorAll(
    ".standard-visit-grid details[data-visit-card]"
  );

  if (visitDetails.length) {
    visitDetails.forEach((detail) => {
      detail.addEventListener("toggle", () => {
        if (!detail.open) return;
        visitDetails.forEach((other) => {
          if (other !== detail && other.open) {
            other.removeAttribute("open");
          }
        });
      });
    });
  }

  // ===============================
  // 8. SmartQuote wizard
  // ===============================

  const FORM_ENDPOINT = "https://formspree.io/f/xlgdjnzn";
    const wizardForm = document.getElementById("smartquoteForm");
    if (wizardForm) {
      const extrasLabelMap = {
        windows: "Windows (interior)",
        baseboards: "Baseboards",
        spotWalls: "Spot clean walls / doors",
        dishes: "Dishes",
        changeBedding: "Change bedding",
        petHair: "Pet hair focus",
        fragranceFree: "Fragrance-free / allergy friendly",
        petSafeProducts: "Pet-safe products only",
        fragranceSensitive: "Fragrance-sensitive / low-odor",
      };
      const normalizeExtras = (values) =>
        values.map((value) => extrasLabelMap[value] || value);
      const steps = Array.from(wizardForm.querySelectorAll(".wizard-step"));
      const progressFill = document.getElementById("wizardProgressFill");
      const stepLabel = document.getElementById("wizardStepLabel");
    const stepTitle = document.getElementById("wizardStepTitle");
    const backBtn = document.getElementById("wizardBackBtn");
    const nextBtn = document.getElementById("wizardNextBtn");
    const reviewBackLink = document.getElementById("reviewBackLink");
    const thankYouCard = document.getElementById("smartquoteThankYou");
    const summaryTarget = document.getElementById("smartquoteSummary");
    const errorTarget = document.getElementById("smartquoteError");
    const mediaOptions = Array.from(
      wizardForm.querySelectorAll('input[name="mediaOption"]')
    );
    const photoUploadSection = document.getElementById("photoUploadSection");
    const videoUploadSection = document.getElementById("videoUploadSection");
    const descriptionSection = document.getElementById("descriptionSection");
    const inPersonSection = document.getElementById("inPersonSection");
    const describeSection = document.getElementById("describeSection");
    const photoRoomUploads = document.getElementById("photoRoomUploads");
    const conditionSlider = document.getElementById("conditionLevel");
    const conditionValue = document.getElementById("conditionValue");
    const roomCountInputs = Array.from(
      wizardForm.querySelectorAll("[data-room-count]")
    );
    const commonAreaInputs = Array.from(
      wizardForm.querySelectorAll('input[name="commonAreas"]')
    );
    const commonAreaOther = wizardForm.querySelector("#commonAreaOther");
    const contactPreferenceInputs = Array.from(
      wizardForm.querySelectorAll('input[name="contactPreference"]')
    );
    const contactPreferenceField = wizardForm.querySelector(
      "[data-contact-preference]"
    );
    const termsAgree = wizardForm.querySelector("#termsAgree");
    const termsAgreeError = document.getElementById("termsAgreeError");
    const privacyConsent = wizardForm.querySelector("#privacyConsent");
    const privacyConsentError = document.getElementById("privacyConsentError");

    if (steps.length) {
      const defaultNextLabel =
        nextBtn?.textContent?.trim() || "Next step";
      let currentStepIndex = -1;
      let hasSubmitted = false;
      let isSubmitting = false;

      const escapeText = (value) => {
        if (value === null || value === undefined) return "";
        return String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      };

      const formatDateValue = (value) => {
        if (!value) return "";
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
          return value;
        }
        return parsed.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      };

      const setError = (message) => {
        if (!errorTarget) return;
        errorTarget.textContent = message || "";
      };

      const setTermsError = (message) => {
        if (!termsAgreeError) return;
        termsAgreeError.textContent = message || "";
        const field = termsAgreeError.closest(".field");
        if (field) {
          field.classList.toggle("has-error", Boolean(message));
        }
        if (termsAgree) {
          termsAgree.setAttribute("aria-invalid", message ? "true" : "false");
        }
      };

      const isTermsAccepted = () => !termsAgree || termsAgree.checked;

      const setPrivacyError = (message) => {
        if (!privacyConsentError) return;
        privacyConsentError.textContent = message || "";
        const field = privacyConsentError.closest(".field");
        if (field) {
          field.classList.toggle("has-error", Boolean(message));
        }
        if (privacyConsent) {
          privacyConsent.setAttribute("aria-invalid", message ? "true" : "false");
        }
      };

      const isPrivacyConsented = () => !privacyConsent || privacyConsent.checked;

      const setSubmittingState = (submitting) => {
        isSubmitting = submitting;
        if (nextBtn) {
          nextBtn.disabled = submitting;
          if (submitting) {
            nextBtn.textContent = "Sending...";
          } else {
            refreshNavigation();
          }
          nextBtn.setAttribute("aria-busy", submitting ? "true" : "false");
        }
        if (backBtn) {
          backBtn.disabled = submitting || currentStepIndex === 0 || hasSubmitted;
        }
        if (reviewBackLink) {
          reviewBackLink.disabled = submitting;
        }
      };

      const collectSmartQuoteData = () => {
        const getValue = (name) =>
          wizardForm.elements[name]?.value?.trim?.() || "";
        const getChecked = (name) =>
          wizardForm.querySelector(`input[name="${name}"]:checked`)?.value || "";
        const isChecked = (name) =>
          Boolean(wizardForm.querySelector(`input[name="${name}"]:checked`));
        const commonAreas = Array.from(
          wizardForm.querySelectorAll('input[name="commonAreas"]:checked')
        ).map((input) => input.value);
        const extras = Array.from(
          wizardForm.querySelectorAll('input[name="extras"]:checked')
        ).map((input) => input.value);
        const normalizedExtras = normalizeExtras(extras);
        const contactPreference = Array.from(
          wizardForm.querySelectorAll('input[name="contactPreference"]:checked')
        ).map((input) => input.value);
        const otherCommonArea = commonAreaOther?.value?.trim() || "";
        if (otherCommonArea) {
          commonAreas.push(otherCommonArea);
        }

        return {
          name: getValue("name"),
          email: getValue("email"),
          phone: getValue("phone"),
          contactPreference: contactPreference.join(", "),
          marketingConsent: isChecked("marketing_consent") ? "Yes" : "No",
          privacyConsent: isChecked("privacy_consent") ? "Yes" : "No",
          address: getValue("address"),
          homeType: getValue("homeType"),
          serviceType: getValue("serviceType"),
          preferredDate: formatDateValue(getValue("preferredDate")),
          urgency: getChecked("urgency"),
          bedrooms: getValue("bedrooms"),
          fullBaths: getValue("fullBaths"),
          halfBaths: getValue("halfBaths"),
          commonAreas: commonAreas.join(", "),
          commonAreaOther: otherCommonArea,
          livingLength: getChecked("livingLength"),
          mediaOption: getChecked("mediaOption"),
          mediaDescription: getValue("mediaDescription"),
          conditionLevel: getValue("conditionLevel"),
          extras: normalizedExtras.join(", "),
          hasPets: getChecked("hasPets"),
          hasKids: getChecked("hasKids"),
          referral_code: getValue("referral_code"),
          quote_notes: getValue("quote_notes"),
        };
      };

      const buildSummaryMessage = (data) => {
        const lines = [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone}`,
          `Contact preference: ${data.contactPreference}`,
          `Marketing consent: ${data.marketingConsent}`,
          `Privacy consent: ${data.privacyConsent}`,
          `Address: ${data.address}`,
          `Space type: ${data.homeType}`,
          `Service type: ${data.serviceType}`,
          `Preferred date: ${data.preferredDate}`,
          `Urgency: ${data.urgency}`,
          `Bedrooms: ${data.bedrooms}`,
          `Full bathrooms: ${data.fullBaths}`,
          `Half bathrooms: ${data.halfBaths}`,
          `Common areas: ${data.commonAreas}`,
          `How long here: ${data.livingLength}`,
          `Media option: ${data.mediaOption}`,
          `Media description: ${data.mediaDescription}`,
          `Condition level: ${data.conditionLevel}`,
          `Extras: ${data.extras}`,
          `Pets on site: ${data.hasPets}`,
          `Kids/guests on site: ${data.hasKids}`,
          `Referral code: ${data.referral_code}`,
          `Notes: ${data.quote_notes}`,
          "Accurate pricing requires photos/videos of the space or a brief in-person visit.",
        ];

        return lines.filter((line) => !line.endsWith(": ")).join("\n");
      };

      const updateSummary = () => {
        if (!summaryTarget) return;
        const populate = (label, rawValue) => {
          if (
            rawValue === null ||
            rawValue === undefined ||
            (typeof rawValue === "string" && rawValue.trim() === "")
          ) {
            return null;
          }
          return `<p><strong>${label}:</strong> ${escapeText(rawValue)}</p>`;
        };

        const summaryParts = [];
        summaryParts.push(populate("Name", wizardForm.elements.name?.value));
        summaryParts.push(populate("Email", wizardForm.elements.email?.value));
        summaryParts.push(populate("Phone", wizardForm.elements.phone?.value));
        const contactPrefs = Array.from(
          wizardForm.querySelectorAll('input[name="contactPreference"]:checked')
        ).map((input) => input.value);
        if (contactPrefs.length) {
          summaryParts.push(
            `<p><strong>Contact preference:</strong> ${escapeText(
              contactPrefs.join(", ")
            )}</p>`
          );
        }
        summaryParts.push(
          `<p><strong>Marketing consent:</strong> ${
            wizardForm.querySelector('input[name="marketing_consent"]:checked')
              ? "Yes"
              : "No"
          }</p>`
        );
        summaryParts.push(
          `<p><strong>Privacy consent:</strong> ${
            wizardForm.querySelector('input[name="privacy_consent"]:checked')
              ? "Yes"
              : "No"
          }</p>`
        );
        summaryParts.push(
          populate("Address", wizardForm.elements.address?.value)
        );
        summaryParts.push(
          populate("Space type", wizardForm.elements.homeType?.value)
        );
        summaryParts.push(
          populate(
            "Preferred date",
            formatDateValue(wizardForm.elements.preferredDate?.value)
          )
        );
        summaryParts.push(
          populate(
            "Urgency",
            wizardForm.querySelector('input[name="urgency"]:checked')?.value
          )
        );
        summaryParts.push(
          populate("Bedrooms", wizardForm.elements.bedrooms?.value)
        );
        summaryParts.push(
          populate("Full bathrooms", wizardForm.elements.fullBaths?.value)
        );
        summaryParts.push(
          populate("Half bathrooms", wizardForm.elements.halfBaths?.value)
        );
        summaryParts.push(
          populate(
            "How long here",
            wizardForm.querySelector('input[name="livingLength"]:checked')?.value
          )
        );
        const mediaSelection = wizardForm.querySelector(
          'input[name="mediaOption"]:checked'
        )?.value;
        const mediaLabelMap = {
          photos: "Photos per room",
          video: "Walkthrough video",
          "in-person": "In-person check for estimate",
          describe: "Skip — describe in detail",
        };
        summaryParts.push(
          populate("Media option", mediaLabelMap[mediaSelection] || mediaSelection)
        );
        summaryParts.push(
          populate("Condition level", wizardForm.elements.conditionLevel?.value)
        );
        const commonAreas = Array.from(
          wizardForm.querySelectorAll('input[name="commonAreas"]:checked')
        ).map((input) => input.value);
        if (commonAreas.length) {
          summaryParts.push(
            `<p><strong>Common areas:</strong> ${escapeText(
              commonAreas.join(", ")
            )}</p>`
          );
        }
        const extras = Array.from(
          wizardForm.querySelectorAll('input[name="extras"]:checked')
        ).map((input) => input.value);
        if (extras.length) {
          const normalizedExtras = normalizeExtras(extras);
          summaryParts.push(
            `<p><strong>Extras:</strong> ${escapeText(
              normalizedExtras.slice(0, 5).join(", ")
            )}${normalizedExtras.length > 5 ? "..." : ""}</p>`
          );
        }
        summaryParts.push(
          populate("Referral code", wizardForm.elements.referral_code?.value)
        );
        summaryParts.push(
          populate("Notes", wizardForm.elements.quote_notes?.value)
        );

        const filtered = summaryParts.filter(Boolean);
        if (!filtered.length) {
          summaryTarget.innerHTML =
            '<p class="muted">I’ll summarize your details here when you reach this step.</p>';
        } else {
          summaryTarget.innerHTML = filtered.join("");
        }
      };

      const updateMediaVisibility = () => {
        const selected =
          wizardForm.querySelector('input[name="mediaOption"]:checked')?.value ||
          "photos";
        if (photoUploadSection) {
          photoUploadSection.classList.toggle(
            "hidden",
            selected !== "photos"
          );
        }
        if (videoUploadSection) {
          videoUploadSection.classList.toggle(
            "hidden",
            selected !== "video"
          );
        }
        if (inPersonSection) {
          inPersonSection.classList.toggle(
            "hidden",
            selected !== "in-person"
          );
        }
        if (describeSection) {
          describeSection.classList.toggle(
            "hidden",
            selected !== "describe"
          );
        }
      };

      const buildRoomUploads = () => {
        if (!photoRoomUploads) return;
        const rooms = [];
        const toNumber = (value) => {
          const parsed = Number.parseInt(value, 10);
          return Number.isNaN(parsed) ? 0 : parsed;
        };
        const addNumbered = (label, count) => {
          for (let i = 1; i <= count; i += 1) {
            rooms.push(`${label} ${i}`);
          }
        };
        addNumbered("Bedroom", toNumber(wizardForm.elements.bedrooms?.value));
        addNumbered(
          "Full bath",
          toNumber(wizardForm.elements.fullBaths?.value)
        );
        addNumbered(
          "Half bath",
          toNumber(wizardForm.elements.halfBaths?.value)
        );
        const commonAreas = commonAreaInputs
          .filter((input) => input.checked)
          .map((input) => input.value);
        rooms.push(...commonAreas);
        const otherValue = commonAreaOther?.value?.trim();
        if (otherValue) {
          rooms.push(otherValue);
        }

        if (!rooms.length) {
          photoRoomUploads.innerHTML =
            '<p class="muted">Add rooms and common areas to create upload slots.</p>';
          return;
        }

        photoRoomUploads.innerHTML = rooms
          .map(
            (room, idx) => `
              <div class="room-upload">
                <h4>${escapeText(room)}</h4>
                <label class="field">
                  <span>Photos (optional)</span>
                  <input
                    type="file"
                    id="roomPhoto${idx}"
                    name="roomPhoto${idx}"
                    accept="image/*"
                    multiple
                  />
                </label>
                <label class="field">
                  <span>Notes for this area</span>
                  <textarea
                    name="roomNote${idx}"
                    rows="2"
                    placeholder="Optional notes for this area"
                  ></textarea>
                </label>
              </div>
            `
          )
          .join("");
      };

      if (mediaOptions.length) {
        mediaOptions.forEach((option) => {
          option.addEventListener("change", updateMediaVisibility);
        });
        updateMediaVisibility();
      }

      if (roomCountInputs.length || commonAreaInputs.length || commonAreaOther) {
        const handleRoomChange = () => {
          buildRoomUploads();
        };
        roomCountInputs.forEach((input) => {
          input.addEventListener("input", handleRoomChange);
          input.addEventListener("change", handleRoomChange);
        });
        commonAreaInputs.forEach((input) => {
          input.addEventListener("change", handleRoomChange);
        });
        if (commonAreaOther) {
          commonAreaOther.addEventListener("input", handleRoomChange);
        }
        buildRoomUploads();
      }

      if (conditionSlider && conditionValue) {
        const syncConditionValue = () => {
          conditionValue.textContent = conditionSlider.value;
        };
        conditionSlider.addEventListener("input", syncConditionValue);
        conditionSlider.addEventListener("change", syncConditionValue);
        syncConditionValue();
      }

      if (contactPreferenceInputs.length && contactPreferenceField) {
        const errorEl = contactPreferenceField.querySelector(".field-error");
        contactPreferenceInputs.forEach((input) => {
          input.addEventListener("change", () => {
            const hasPreference = contactPreferenceInputs.some(
              (item) => item.checked
            );
            if (hasPreference) {
              contactPreferenceField.classList.remove("has-error");
              if (errorEl) errorEl.textContent = "";
            }
          });
        });
      }

      if (termsAgree) {
        termsAgree.addEventListener("change", () => {
          setTermsError("");
          refreshNavigation();
        });
      }

      if (privacyConsent) {
        privacyConsent.addEventListener("change", () => {
          setPrivacyError("");
          refreshNavigation();
        });
      }

      const updateProgress = (index) => {
        if (!progressFill) return;
        const ratio =
          steps.length > 1
            ? index / (steps.length - 1)
            : index === 0
            ? 0
            : 1;
        progressFill.style.width = `${(ratio * 100).toFixed(2)}%`;
      };

      const refreshNavigation = () => {
        if (backBtn) {
          backBtn.disabled = currentStepIndex === 0 || hasSubmitted;
        }
        if (nextBtn) {
          if (currentStepIndex === steps.length - 1) {
            nextBtn.textContent = "Submit request";
            nextBtn.disabled = hasSubmitted || isSubmitting || !isTermsAccepted();
          } else {
            nextBtn.textContent = defaultNextLabel;
            nextBtn.disabled = hasSubmitted || isSubmitting;
          }
        }
      };

      const goToStep = (targetIndex) => {
        const nextIndex = Math.min(
          Math.max(targetIndex, 0),
          steps.length - 1
        );
        if (nextIndex === currentStepIndex) return;
        currentStepIndex = nextIndex;
        setTermsError("");
        steps.forEach((step, idx) =>
          step.classList.toggle("active", idx === currentStepIndex)
        );
        if (stepLabel) {
          stepLabel.textContent = `Step ${currentStepIndex + 1} of ${steps.length}`;
        }
        if (stepTitle) {
          stepTitle.textContent =
            steps[currentStepIndex].dataset.title ||
            steps[currentStepIndex].querySelector("h3")?.textContent ||
            "";
        }
        updateProgress(currentStepIndex);
        refreshNavigation();
        if (currentStepIndex === steps.length - 1) {
          updateSummary();
        }
      };

      const validateCurrentStep = () => {
        const activeStep = steps[currentStepIndex];
        if (!activeStep) return true;
        
        // Check Terms
        if (activeStep.contains(termsAgree) && !isTermsAccepted()) {
          setTermsError("Please agree to the Terms & Conditions to continue.");
          termsAgree?.focus();
          return false;
        }
        setTermsError("");
        
        // Check Privacy Consent
        if (activeStep.contains(privacyConsent) && !isPrivacyConsented()) {
          setPrivacyError("Please consent to the Privacy Policy to continue.");
          privacyConsent?.focus();
          return false;
        }
        setPrivacyError("");
        
        // Check all required fields in the active step
        const requiredFields = activeStep.querySelectorAll("[required]");
        for (const field of requiredFields) {
          // Skip terms and privacy checkboxes as they're handled above
          if (field.id === "termsAgree" || field.id === "privacyConsent") continue;
          
          // Get the field container
          const fieldContainer = field.closest(".field");
          if (!fieldContainer) continue;
          
          const errorEl = fieldContainer.querySelector(".field-error");
          let isValid = true;
          let errorMsg = "";
          
          if (field.type === "checkbox") {
            // Checkbox validation
            if (!field.checked) {
              isValid = false;
              errorMsg = "This field is required.";
            }
          } else if (field.type === "email") {
            // Email validation
            if (!field.value.trim()) {
              isValid = false;
              errorMsg = "Email is required.";
            } else if (!field.validity.valid) {
              isValid = false;
              errorMsg = "Please enter a valid email address.";
            }
          } else if (field.type === "tel") {
            // Phone validation
            if (!field.value.trim()) {
              isValid = false;
              errorMsg = "Phone number is required.";
            }
          } else if (field.tagName === "SELECT") {
            // Select validation
            if (!field.value) {
              isValid = false;
              errorMsg = "Please select an option.";
            }
          } else if (field.tagName === "TEXTAREA") {
            // Textarea validation
            if (!field.value.trim()) {
              isValid = false;
              errorMsg = "This field is required.";
            }
          } else {
            // Text input validation
            if (!field.value.trim()) {
              isValid = false;
              errorMsg = "This field is required.";
            }
          }
          
          if (!isValid) {
            fieldContainer.classList.add("has-error");
            if (errorEl) {
              errorEl.textContent = errorMsg;
            }
            field.focus();
            return false;
          } else {
            fieldContainer.classList.remove("has-error");
            if (errorEl) {
              errorEl.textContent = "";
            }
          }
        }
        
        // Check contact preference if in this step
        const contactPrefField = activeStep.querySelector(
          "[data-contact-preference]"
        );
        if (contactPrefField) {
          const contactChecks = Array.from(
            contactPrefField.querySelectorAll(
              'input[name="contactPreference"]'
            )
          );
          const hasPreference = contactChecks.some((input) => input.checked);
          const errorEl = contactPrefField.querySelector(".field-error");
          if (!hasPreference) {
            contactPrefField.classList.add("has-error");
            if (errorEl) {
              errorEl.textContent = "Please choose at least one contact method.";
            }
            contactChecks[0]?.focus();
            return false;
          }
          contactPrefField.classList.remove("has-error");
          if (errorEl) errorEl.textContent = "";
        }
        return true;
      };

      const handleBack = () => {
        if (currentStepIndex === 0 || hasSubmitted) return;
        goToStep(currentStepIndex - 1);
      };

      const handleFormSubmit = () => {
        const submit = async () => {
          if (hasSubmitted || isSubmitting) return;
          if (!isTermsAccepted()) {
            setTermsError("Please agree to the Terms & Conditions to continue.");
            return;
          }
          if (!isPrivacyConsented()) {
            setPrivacyError("Please consent to the Privacy Policy to continue.");
            return;
          }
          if (!wizardForm.checkValidity()) {
            wizardForm.reportValidity();
            return;
          }
          const emailInput = wizardForm.elements.email;
          if (emailInput && !emailInput.checkValidity()) {
            emailInput.reportValidity();
            emailInput.focus();
            return;
          }
          if (wizardForm.elements._gotcha?.value) {
            return;
          }

          setError("");
          setSubmittingState(true);

          const submitPayload = async (formData) => {
            const response = await fetch(FORM_ENDPOINT, {
              method: "POST",
              headers: {
                Accept: "application/json",
              },
              body: formData,
            });
            if (response.ok) {
              return { ok: true, status: response.status };
            }
            let message = "";
            try {
              const data = await response.json();
              if (Array.isArray(data?.errors)) {
                message = data.errors.map((item) => item.message).join(" ");
              }
            } catch {
              try {
                message = await response.text();
              } catch {
                /* ignore */
              }
            }
            return { ok: false, message, status: response.status };
          };

          try {
            const data = collectSmartQuoteData();
            const summaryMessage = buildSummaryMessage(data);
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
              formData.append(key, value);
            });
            formData.append("_replyto", data.email);
            formData.append("summary_message", summaryMessage);
            formData.append("message", summaryMessage);

            const result = await submitPayload(formData);
            if (!result.ok) {
              const fallbackMessage = result.message?.trim();
              if (result.status === 403) {
                throw new Error(
                  "Formspree blocked the request (403). Verify this form allows your domain or that you are testing from the live site."
                );
              }
              if (!fallbackMessage) {
                throw new Error("submit_failed");
              }
              throw new Error(fallbackMessage);
            }

            hasSubmitted = true;
            wizardForm.reset();
            updateMediaVisibility();
            buildRoomUploads();
            goToStep(0);
            wizardForm.hidden = true;
            wizardForm.setAttribute("aria-hidden", "true");
            if (thankYouCard) {
              thankYouCard.removeAttribute("hidden");
              thankYouCard.scrollIntoView({ behavior: "smooth" });
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : "";
            setError(
              message
                ? `Sorry - ${message}`
                : "Sorry - something went wrong sending your request. Please try again."
            );
          } finally {
            setSubmittingState(false);
          }
        };

        submit();
      };

      const handleNext = async () => {
        if (hasSubmitted) return;
        if (!validateCurrentStep()) return;
        if (currentStepIndex === steps.length - 1) {
          if (!isTermsAccepted()) {
            setTermsError("Please agree to the Terms & Conditions to continue.");
            return;
          }
          if (!isPrivacyConsented()) {
            setPrivacyError("Please consent to the Privacy Policy to continue.");
            return;
          }
          await handleFormSubmit();
          return;
        }
        goToStep(currentStepIndex + 1);
      };

      goToStep(0);
      wizardForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (currentStepIndex === steps.length - 1) {
          handleFormSubmit();
        } else {
          handleNext();
        }
      });
      if (backBtn) {
        backBtn.addEventListener("click", (event) => {
          event.preventDefault();
          handleBack();
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener("click", (event) => {
          event.preventDefault();
          handleNext();
        });
      }
      if (reviewBackLink) {
        reviewBackLink.addEventListener("click", (event) => {
          event.preventDefault();
          handleBack();
        });
      }
    }
  }

  // ===============================
  // 20. Cookie Consent Banner
  // ===============================

  function initCookieConsent() {
    const cookieBanner = document.getElementById("cookieConsent");
    const acceptButton = document.getElementById("acceptCookies");

    if (!cookieBanner) return;

    // Check if user has already accepted cookies
    const cookieAccepted = localStorage.getItem("dustless-cookies-accepted");

    if (cookieAccepted === "true") {
      cookieBanner.classList.add("hidden");
      return;
    }

    // Show cookie banner
    cookieBanner.classList.remove("hidden");
    cookieBanner.style.display = "block";

    // Handle accept button
    if (acceptButton) {
      acceptButton.addEventListener("click", () => {
        localStorage.setItem("dustless-cookies-accepted", "true");
        cookieBanner.classList.add("hidden");
      });
    }

    // Close banner when clicking Learn More (user will see privacy policy)
    const learnMoreLinks = cookieBanner.querySelectorAll("a");
    learnMoreLinks.forEach((link) => {
      link.addEventListener("click", () => {
        localStorage.setItem("dustless-cookies-accepted", "true");
        cookieBanner.classList.add("hidden");
      });
    });
  }

  // Initialize cookie consent when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCookieConsent);
  } else {
    initCookieConsent();
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (navMobile?.classList.contains("open")) {
      setNavState(false);
    }
    if (chatbot?.classList.contains("open")) {
      handleChatToggle(false);
    }
    if (serviceModal?.classList.contains("is-visible")) {
      closeServiceModal();
    }
  });
})();
