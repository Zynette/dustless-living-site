// main.js
// Dustless Living - Marketing Site + Portal

(() => {
  const body = document.body;

  // ===============================
  // 1. Navigation & Smooth Scroll
  // ===============================

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) {
      window.location.href = `index.html#${id}`;
      return;
    }
    const headerOffset = 80;
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
  window.scrollToSection = scrollToSection;

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
  const prefersDark = window.matchMedia
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

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

  const storedPreference = storage.get();
  if (storedPreference === "dark" || storedPreference === "light") {
    applyTheme(storedPreference);
  } else if (prefersDark && typeof prefersDark.matches === "boolean") {
    applyTheme(prefersDark.matches ? "dark" : "light");
  } else {
    applyTheme("light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
      storage.set(nextTheme);
    });
  }

  if (prefersDark) {
    const handleSchemeChange = (event) => {
      const saved = storage.get();
      if (saved === "dark" || saved === "light") return;
      applyTheme(event.matches ? "dark" : "light");
    };
    if (typeof prefersDark.addEventListener === "function") {
      prefersDark.addEventListener("change", handleSchemeChange);
    } else if (typeof prefersDark.addListener === "function") {
      prefersDark.addListener(handleSchemeChange);
    }
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
        "Weekly, bi-weekly, monthly, or seasonal visits that keep Hamilton and Burlington homes balanced between deep cleans.",
      subcopy:
        "Handled by the same familiar pair using eco-friendly kits, low-moisture steam tools, and low-scent finishing sprays.",
      bullets: [
        "Laundry fold, bed styling, and toy-zone resets as requested",
        "Kitchen, bath, and common-area detailing with gentle products",
        "Steam touch-ups for grout or textiles when needed",
        "Photos or care notes sent after every first visit",
      ],
      note: "Kid-safe and pet-conscious supplies are standard. Have your own favourites? We will happily use them.",
      bestFor: "busy households",
      typicalTime: "2–4 hrs",
    },
    commercial: {
      title: "Commercial & Studio Care",
      intro:
        "After-hours or early morning resets for boutiques, salons, treatment studios, and private offices.",
      subcopy:
        "Discreet service across Hamilton, Burlington, and surrounding hubs with steam-friendly detailing and fragrance-aware cleaners.",
      bullets: [
        "Reception, display, and waiting areas polished and styled",
        "Treatment rooms sanitized, linens refreshed, amenities restocked",
        "Floors, mirrors, and touchpoints refreshed without residue",
        "Light admin zones tidied so teams can start fresh",
      ],
      note: "Need retail folding, laundry drop, or inventory notes? Add them to your visit instructions.",
      bestFor: "small teams & studios",
      typicalTime: "1.5–3 hrs",
    },
    deep: {
      title: "Deep Cleaning Reset",
      intro:
        "A meticulous scrub that lifts buildup, polishes fixtures, and slows down in the corners regular cleans can miss.",
      subcopy:
        "Perfect before move-ins, renovations, or seasonal resets across Hamilton and Burlington homes.",
      bullets: [
        "Degreased stove, hood, backsplash, and difficult kitchen finishes",
        "Hand-detailed grout, fixtures, glass, and chrome",
        "Doors, trim, vents, and baseboards wiped clean",
        "Interior fridge or oven detailing available by request",
      ],
      note: "Low-moisture steam and speciality tools are included where safe for your surfaces.",
      bestFor: "seasonal deep resets",
      typicalTime: "3–5 hrs",
    },
    move: {
      title: "Move-In / Move-Out",
      intro:
        "Realtor-ready detailing that clears every drawer, closet, vent, and appliance before keys change hands.",
      subcopy:
        "Trusted by landlords, renters, and Realtors preparing listings around Hamilton and Burlington.",
      bullets: [
        "Cabinets, closets, drawers, and shelving vacuumed and wiped",
        "Appliance interiors, gaskets, and glass revived",
        "Walls, trim, switches, and vents dusted or spot-cleaned",
        "Floors reset for inspection photos or staging day",
      ],
      note: "Need proof-of-clean photos or key hand-off support? Add it to your SmartQuote notes.",
      bestFor: "transitions & staging",
      typicalTime: "4–6 hrs",
    },
    airbnb: {
      title: "Airbnb / Short-Term Rental",
      intro:
        "Fast resets that keep listings guest-ready with steam sanitization between stays.",
      subcopy:
        "Ideal for hosts who need consistent turnovers, tidy staging, and confident reviews.",
      bullets: [
        "High-touch points steam-sanitized between guests",
        "Beds styled, linens refreshed, and surfaces reset",
        "Kitchen and bath polished for next arrival",
        "Quick photo-ready finishing touches",
      ],
      note: "Share your check-in window and any host notes so I can match your turnover flow.",
      bestFor: "short-term rentals",
      typicalTime: "1–2.5 hrs",
    },
    addons: {
      title: "Add-Ons & Specialty Care",
      intro:
        "Layer extra care onto any visit: steam sanitizing, interior appliances, fabric care, and scent-aware touch-ups.",
      subcopy:
        "Ideal for allergy-sensitive homes and high-touch studios. Professional carpet extraction with a commercial machine launches soon.",
      bullets: [
        "Steam detailing on grout, toys, upholstery, or pet zones",
        "Interior fridge, oven, and cabinet refreshes",
        "Laundry folding, linen changes, and delicate glass polishing",
        "Stone sealing, stainless care, or fragrance-free cleaning",
      ],
      note: "Ask about upcoming carpet cleaning if you have high-traffic hallways or studio rugs.",
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
      <p class="modal-label">Hamilton &amp; Burlington Service</p>
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
        "After ER shifts, I’m spent. Coming home to a clean kitchen and folded laundry is real relief.",
      name: "Dr. Nguyen, Crown Point (Hamilton)",
      service: "Detached home · Weekly Reset + Laundry Fold",
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
  accordions.forEach((accordion) => {
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

  const wizardForm = document.getElementById("smartquoteForm");
  if (wizardForm) {
    const steps = Array.from(wizardForm.querySelectorAll(".wizard-step"));
    const progressFill = document.getElementById("wizardProgressFill");
    const stepLabel = document.getElementById("wizardStepLabel");
    const stepTitle = document.getElementById("wizardStepTitle");
    const backBtn = document.getElementById("wizardBackBtn");
    const nextBtn = document.getElementById("wizardNextBtn");
    const reviewBackLink = document.getElementById("reviewBackLink");
    const thankYouCard = document.getElementById("smartquoteThankYou");
    const summaryTarget = document.getElementById("smartquoteSummary");
    const mediaOptions = Array.from(
      wizardForm.querySelectorAll('input[name="mediaOption"]')
    );
    const photoUploadSection = document.getElementById("photoUploadSection");
    const videoUploadSection = document.getElementById("videoUploadSection");
    const descriptionSection = document.getElementById("descriptionSection");
    const inPersonSection = document.getElementById("inPersonSection");
    const photoRoomUploads = document.getElementById("photoRoomUploads");
    const roomCountInputs = Array.from(
      wizardForm.querySelectorAll("[data-room-count]")
    );
    const commonAreaInputs = Array.from(
      wizardForm.querySelectorAll('input[name="commonAreas"]')
    );
    const commonAreaOther = wizardForm.querySelector("#commonAreaOther");

    if (steps.length) {
      const defaultNextLabel =
        nextBtn?.textContent?.trim() || "Next step";
      let currentStepIndex = -1;
      let hasSubmitted = false;

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
          description: "Description only",
          "in-person": "In-person check for estimate",
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
          summaryParts.push(
            `<p><strong>Extras:</strong> ${escapeText(
              extras.slice(0, 5).join(", ")
            )}${extras.length > 5 ? "..." : ""}</p>`
          );
        }
        summaryParts.push(
          populate("Referral code", wizardForm.elements.referral_code?.value)
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
        if (descriptionSection) {
          descriptionSection.classList.toggle(
            "hidden",
            selected !== "description"
          );
        }
        if (inPersonSection) {
          inPersonSection.classList.toggle(
            "hidden",
            selected !== "in-person"
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
          } else {
            nextBtn.textContent = defaultNextLabel;
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
        const invalidField = activeStep.querySelector(
          "input:invalid, select:invalid, textarea:invalid"
        );
        if (invalidField) {
          invalidField.reportValidity();
          invalidField.focus();
          return false;
        }
        return true;
      };

      const handleBack = () => {
        if (currentStepIndex === 0 || hasSubmitted) return;
        goToStep(currentStepIndex - 1);
      };

      const handleFormSubmit = () => {
        if (hasSubmitted) return;
        if (!wizardForm.checkValidity()) {
          wizardForm.reportValidity();
          return;
        }
        hasSubmitted = true;
        wizardForm.hidden = true;
        wizardForm.setAttribute("aria-hidden", "true");
        if (backBtn) backBtn.disabled = true;
        if (nextBtn) nextBtn.disabled = true;
        if (reviewBackLink) reviewBackLink.disabled = true;
        if (thankYouCard) {
          thankYouCard.removeAttribute("hidden");
          thankYouCard.scrollIntoView({ behavior: "smooth" });
        }
      };

      const handleNext = () => {
        if (hasSubmitted) return;
        if (!validateCurrentStep()) return;
        if (currentStepIndex === steps.length - 1) {
          handleFormSubmit();
          return;
        }
        goToStep(currentStepIndex + 1);
      };

      goToStep(0);
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
