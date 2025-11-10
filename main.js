// MAIN.JS
// Dustless Living — Marketing + Portal + Shop
// Sections:
// 1) Navigation & UI
// 2) Visual polish (particles, reveal, parallax)
// 3) Pricing estimator
// 4) Service modal & gallery
// 5) Testimonials, FAQ, Chatbot
// 6) Theme toggle
// 7) Firebase init & helpers
// 8) DOM refs (shop, cart, dashboards)
// 9) Booking / careers / contact forms (+ After Cleaning widget)
// 10) Auth modal & login
// 11) Shop: products, modal, cart, eco points
// 12) Admin & employee dashboards
// 13) Stripe (deposit + shop checkout)
// 14) Checkout return handlers

(() => {
  // Small helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ===============================
  // 1. Navigation & Smooth Scroll
  // ===============================

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 80;
    const y = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top: y, behavior: "smooth" });
  }
  window.scrollToSection = scrollToSection;

  const burger = $("#burger");
  const navMobile = $("#navMobile");

  if (burger && navMobile) {
    burger.addEventListener("click", () => {
      navMobile.classList.toggle("open");
    });
  }

  $$(".nav a, .nav-mobile a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        scrollToSection(href.slice(1));
        if (navMobile) navMobile.classList.remove("open");
      }
    });
  });

  // ===============================
  // 2. Visual Polish
  // ===============================

  // Floating particles
  const particlesLayer = $("#particlesLayer");

  function createParticle() {
    if (!particlesLayer) return;
    const p = document.createElement("div");
    p.classList.add("particle");
    const size = Math.random() * 4 + 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = "-40px";
    p.style.animationDuration = `${10 + Math.random() * 8}s`;
    p.style.opacity = `${0.2 + Math.random() * 0.6}`;
    particlesLayer.appendChild(p);
    setTimeout(() => p.remove(), 18000);
  }

  if (particlesLayer) {
    for (let i = 0; i < 18; i++) createParticle();
    setInterval(createParticle, 700);
  }

  // Scroll reveal
  const revealEls = $$("[data-reveal]");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // Parallax hover
  $$("[data-parallax]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
      card.style.transform = `translateY(-2px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "translateY(0) rotateX(0) rotateY(0)";
    });
  });

  // ===============================
  // 3. Pricing Estimator
  // ===============================

  const messSlider = $("#messSlider");
  const messValue = $("#messValue");
  const addonWindows = $("#addonWindows");
  const addonAppliances = $("#addonAppliances");
  const estimatedPrice = $("#estimatedPrice");

  function calculateBaseEstimate(mess, includeWindows, includeAppliances) {
    const base = 120;
    const levelCost = mess * 10;
    let total = base + levelCost;
    if (includeWindows) total += 20;
    if (includeAppliances) total += 15;
    return total;
  }

  function updateEstimator() {
    if (!messSlider || !estimatedPrice || !messValue) return;
    const mess = Number(messSlider.value || 1);
    const total = calculateBaseEstimate(
      mess,
      !!(addonWindows && addonWindows.checked),
      !!(addonAppliances && addonAppliances.checked)
    );
    messValue.textContent = mess;
    estimatedPrice.textContent = `$${total}`;
  }

  if (messSlider) {
    ["input", "change"].forEach((evt) =>
      messSlider.addEventListener(evt, updateEstimator)
    );
  }
  [addonWindows, addonAppliances].forEach((el) => {
    if (el) el.addEventListener("change", updateEstimator);
  });
  updateEstimator();

  // ===============================
  // 4. Service Modal & Gallery
  // ===============================

  const modal = $("#serviceModal");
  const modalContent = $("#serviceModalContent");

  const serviceDetails = {
    residential: {
      title: "Residential Cleaning",
      body: `
        <ul>
          <li>Thoughtful regular or one-time cleans.</li>
          <li>Kitchen, bathrooms, living areas & bedrooms reset.</li>
          <li>Pet-friendly & student-friendly options.</li>
        </ul>
        <p><strong>Est. Range:</strong> $120 - $220 depending on size & mess.</p>
      `,
    },
    commercial: {
      title: "Commercial & Studio Cleaning",
      body: `
        <ul>
          <li>After-hours or early-morning visits.</li>
          <li>Desks, reception, washrooms & floors maintained.</li>
          <li>Ideal for studios, clinics, salons & small offices.</li>
        </ul>
        <p><strong>Est. Range:</strong> From $140 per visit.</p>
      `,
    },
    deep: {
      title: "Deep Cleaning Reset",
      body: `
        <ul>
          <li>Detailed scrubbing of kitchens & bathrooms.</li>
          <li>Baseboards, doors, fixtures & high-touch areas.</li>
          <li>Perfect before starting recurring service.</li>
        </ul>
        <p><strong>Est. Range:</strong> $180 - $300.</p>
      `,
    },
    move: {
      title: "Move-In / Move-Out Cleaning",
      body: `
        <ul>
          <li>Inside cabinets, fridge & oven (on request).</li>
          <li>Walls spot-cleaned, fixtures detailed.</li>
          <li>Perfect for listings, inspections & key handovers.</li>
        </ul>
        <p><strong>Est. Range:</strong> $200 - $360.</p>
      `,
    },
    addons: {
      title: "Thoughtful Add-Ons",
      body: `
        <ul>
          <li>Interior fridge: +$15 - $25</li>
          <li>Oven detail: +$20 - $30</li>
          <li>Interior windows: from +$20</li>
          <li>Baseboards, walls & extras quoted fairly.</li>
        </ul>
      `,
    },
  };

  function openServiceModal(key) {
    if (!modal || !modalContent) return;
    const svc = serviceDetails[key];
    if (!svc) return;
    modalContent.innerHTML = `
      <h3>${svc.title}</h3>
      ${svc.body}
      <button class="btn" style="margin-top:0.8rem" onclick="scrollToSection('booking')">
        Book Your Fresh Start
      </button>
    `;
    modal.style.display = "flex";
  }
  function closeServiceModal() {
    if (modal) modal.style.display = "none";
  }
  window.openServiceModal = openServiceModal;
  window.closeServiceModal = closeServiceModal;

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeServiceModal();
    });
  }

  // Gallery lightbox
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");

  $$(".gallery-item").forEach((img) => {
    img.addEventListener("click", () => {
      if (!lightbox || !lightboxImg) return;
      lightboxImg.src = img.src;
      lightbox.style.display = "flex";
    });
  });
  function closeLightbox() {
    if (lightbox) lightbox.style.display = "none";
  }
  window.closeLightbox = closeLightbox;

  // ===============================
  // 5. Testimonials, FAQ, Chatbot
  // ===============================

  const testimonials = [
    {
      text:
        "“Coming home after a Dustless clean feels like someone pressed reset on my whole week.”",
      name: "— Sarah M., Hamilton",
    },
    {
      text:
        "“Professional, kind, and meticulous. Our studio has never felt this consistently inviting.”",
      name: "— Local Studio, Burlington",
    },
    {
      text:
        "“We booked a deep clean then joined the Stay Clean Club. Best decision for our busy schedule.”",
      name: "— James R., Stoney Creek",
    },
  ];

  const tText = $("#testimonialText");
  const tName = $("#testimonialName");
  const tDots = $("#testimonialDots");
  let tIndex = 0;

  function updateTestimonial() {
    if (!tText || !tName || !tDots) return;
    const t = testimonials[tIndex];
    tText.textContent = t.text;
    tName.textContent = t.name;
    $$( ":scope > span", tDots).forEach((d, i) => {
      d.classList.toggle("active", i === tIndex);
    });
  }

  function renderTestimonials() {
    if (!tDots) return;
    tDots.innerHTML = "";
    testimonials.forEach((_, i) => {
      const dot = document.createElement("span");
      if (i === tIndex) dot.classList.add("active");
      dot.addEventListener("click", () => {
        tIndex = i;
        updateTestimonial();
      });
      tDots.appendChild(dot);
    });
    updateTestimonial();
  }

  renderTestimonials();
  setInterval(() => {
    tIndex = (tIndex + 1) % testimonials.length;
    updateTestimonial();
  }, 6000);

  // FAQ accordion
  $$(".accordion-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const open = item.classList.contains("open");
      $$(".accordion-item").forEach((i) => i.classList.remove("open"));
      if (!open) item.classList.add("open");
    });
  });

  // Chatbot
  const chatbotToggle = $("#chatbotToggle");
  const chatbotWindow = $("#chatbotWindow");
  const chatbotBody = $("#chatbotBody");
  const chatbotInput = $("#chatbotInput");

  function botSay(text) {
    if (!chatbotBody) return;
    const div = document.createElement("div");
    div.className = "chatbot-msg bot";
    div.textContent = text;
    chatbotBody.appendChild(div);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function userSay(text) {
    if (!chatbotBody) return;
    const div = document.createElement("div");
    div.className = "chatbot-msg user";
    div.textContent = text;
    chatbotBody.appendChild(div);
    chatbotBody.scrollTop = chatbotBody.scrollHeight;
  }

  function estimateFromMessage(msg) {
    const messMatch = msg.match(/(\d{1,2})/);
    const mess = messMatch
      ? Math.min(Math.max(parseInt(messMatch[1], 10), 1), 10)
      : 5;

    let base = 120;
    if (/condo|apartment/i.test(msg)) base = 120;
    if (/townhouse/i.test(msg)) base = 140;
    if (/house|detached|semi/i.test(msg)) base = 160;

    const brMatch = msg.match(/(\d+)\s*bed/i);
    if (brMatch) {
      const br = parseInt(brMatch[1], 10);
      base += (br - 2) * 15;
    }
    const total = base + mess * 10;
    return Math.max(100, Math.round(total / 5) * 5);
  }

  function handleChatbotMessage() {
    if (!chatbotInput) return;
    const text = chatbotInput.value.trim();
    if (!text) return;
    userSay(text);
    chatbotInput.value = "";
    const est = estimateFromMessage(text);
    setTimeout(() => {
      botSay(`A calm estimate for that space is around $${est}.`);
      botSay(
        "For an exact quote, share your details in the booking form and we’ll respond personally."
      );
    }, 400);
  }
  window.handleChatbotMessage = handleChatbotMessage;

  function toggleChatbot(force) {
    if (!chatbotWindow) return;
    const show =
      typeof force === "boolean"
        ? force
        : chatbotWindow.style.display !== "flex";
    chatbotWindow.style.display = show ? "flex" : "none";
    if (show && chatbotBody && chatbotBody.children.length === 0) {
      botSay("Hi! I can help you estimate your clean.");
      botSay(
        "Tell me: home type (condo/house), bedrooms, and mess level (1-10)."
      );
    }
  }
  window.toggleChatbot = toggleChatbot;

  if (chatbotToggle) {
    chatbotToggle.addEventListener("click", () => toggleChatbot());
  }

  if (chatbotInput) {
    chatbotInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleChatbotMessage();
      }
    });
  }

  // ===============================
  // 6. Theme Toggle
  // ===============================

  const themeToggle = $("#themeToggle");
  const themeIcon = $(".theme-icon");

  function applyTheme(mode) {
    if (mode === "dark") {
      document.body.classList.add("dark");
      if (themeIcon) themeIcon.textContent = "🌙";
    } else {
      document.body.classList.remove("dark");
      if (themeIcon) themeIcon.textContent = "☀️";
    }
  }

  applyTheme(localStorage.getItem("dl-theme") || "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = document.body.classList.contains("dark")
        ? "dark"
        : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("dl-theme", next);
    });
  }

  // ===============================
  // 7. Firebase Init & Helpers
  // ===============================

  const firebaseConfig = {
    apiKey: "AIzaSyBc7JKRYcVdzhMkfR1yKb3SBskvziUyPec",
    authDomain: "living-dustless.firebaseapp.com",
    projectId: "living-dustless",
    storageBucket: "living-dustless.appspot.com",
    messagingSenderId: "257617681555",
    appId: "1:257617681555:web:f4fc2f6a86def413098166",
  };

  firebase.initializeApp(firebaseConfig);

  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();

  async function saveToCollection(collection, data) {
    try {
      await db.collection(collection).add({
        ...data,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error(`[${collection}] Firestore error:`, err);
    }
  }

  // ===============================
  // 8. DOM Refs (Shop, Cart, Dashboards)
  // ===============================

  // Shop & cart state
  let products = [];
  let cart = [];
  let currentProduct = null;

  // Shop DOM
  const shopGrid = $("#shopGrid");
  const shopFeaturedRow = $("#shopFeaturedRow");

  // Product modal DOM
  const productModal = $("#productModal");
  const closeProductModalBtn = $("#closeProductModal");
  const productModalImage = $("#productModalImage");
  const productModalName = $("#productModalName");
  const productModalCategory = $("#productModalCategory");
  const productModalDescription = $("#productModalDescription");
  const productModalPrice = $("#productModalPrice");
  const addToCartBtn = $("#addToCartBtn");
  const subscribeSaveBtn = $("#subscribeSaveBtn");

  // Cart DOM
  const cartDrawer = $("#cartDrawer");
  const openCartBtn = $("#openCartBtn");
  const closeCartBtn = $("#closeCartBtn");
  const cartItemsEl = $("#cartItems");
  const cartSubtotalEl = $("#cartSubtotal");
  const cartCountEl = $("#cartCount");
  const checkoutCartBtn = $("#checkoutCartBtn");
  const cartEcoPointsEl = $("#cartEcoPoints");

  // After cleaning widget
  const afterCleanWidget = $("#afterCleanWidget");
  const afterCleanProductsEl = $("#afterCleanProducts");

  // Admin products
  const productForm = $("#productForm");
  const adminProductsList = $("#adminProductsList");
  const cancelEditProductBtn = $("#cancelEditProductBtn");

  // Dashboards & layout
  const employeeDashboard = $("#employeeDashboard");
  const adminDashboard = $("#adminDashboard");
  const employeeWelcome = $("#employeeWelcome");
  const logoutBtnEmp = $("#logoutBtnEmp");
  const logoutBtnAdmin = $("#logoutBtnAdmin");
  const publicSite = $("#publicSite");
  const headerEl = $(".header");
  const footerEl = $(".footer");

  let employeeJobsUnsub = null;
  let adminBookingsUnsub = null;
  let adminJobsUnsub = null;
  let adminEmployeesUnsub = null;
  let adminProductsUnsub = null;

  // ===============================
  // 9. Booking, Careers, Contact, After Cleaning
  // ===============================

  const PROMO_CONFIG = {
    FRESHSTART: {
      label: "Fresh Start – $25 off first deep clean.",
      type: "flat",
      amount: 25,
    },
    STAYCLEAN: {
      label: "Stay Clean Club – 10% off recurring clients.",
      type: "percent",
      amount: 10,
    },
    REFERRELAX: {
      label: "Refer & Relax – $25 off for you and a friend.",
      type: "flat",
      amount: 25,
    },
    MIDWEEK: {
      label: "Midweek Reset – 15% off Tue/Wed bookings.",
      type: "percent",
      amount: 15,
    },
    SEASONAL: {
      label: "Seasonal Bundle – $20 off deep clean + windows.",
      type: "flat",
      amount: 20,
    },
  };

  function applyPromo(code, baseAmount) {
    if (!code) return { total: baseAmount, promo: null };
    const key = code.trim().toUpperCase();
    const cfg = PROMO_CONFIG[key];
    if (!cfg) return { total: baseAmount, promo: null };

    let discount = 0;
    if (cfg.type === "flat") discount = cfg.amount;
    if (cfg.type === "percent") discount = (baseAmount * cfg.amount) / 100;

    const total = Math.max(0, baseAmount - discount);
    return {
      total,
      promo: {
        code: key,
        label: cfg.label,
        discount: Math.round(discount),
      },
    };
  }

  const bookingForm = $("#bookingForm");
  const bookingSuccess = $("#bookingSuccess");
  const bookingPromoNote = $("#bookingPromoNote");
  const bookingPaymentNote = $("#bookingPaymentNote");
  const payDepositBtn = $("#payDepositBtn");
  const paymentStatus = $("#paymentStatus");

  const careersForm = $("#careersForm");
  const careersSuccess = $("#careersSuccess");
  const contactForm = $("#contactForm");
  const contactSuccess = $("#contactSuccess");

  if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (bookingSuccess) bookingSuccess.textContent = "";
      if (bookingPromoNote) bookingPromoNote.textContent = "";
      if (bookingPaymentNote) bookingPaymentNote.textContent = "";
      if (paymentStatus) paymentStatus.textContent = "";
      if (payDepositBtn) payDepositBtn.classList.add("hidden");
      if (afterCleanWidget) afterCleanWidget.classList.add("hidden");

      const formData = Object.fromEntries(new FormData(bookingForm).entries());
      const mess = Number(formData.mess || 5);

      const baseEstimate = calculateBaseEstimate(mess, false, false);
      const promoCode = (formData.promoCode || "").trim().toUpperCase();
      const { total: finalEstimate, promo } = applyPromo(
        promoCode,
        baseEstimate
      );
      const suggestedDeposit = Math.max(
        40,
        Math.round(finalEstimate * 0.2)
      );

      const booking = {
        ...formData,
        mess,
        promoCode: promoCode || null,
        promoLabel: promo ? promo.label : null,
        promoDiscount: promo ? promo.discount : 0,
        estimatedPrice: finalEstimate,
        depositAmount: suggestedDeposit,
        status: "pending",
        depositStatus: "unpaid",
      };

      try {
        const docRef = await db.collection("bookings").add({
          ...booking,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        bookingForm.reset();

        if (bookingSuccess) {
          bookingSuccess.textContent =
            "Thank you. Your request is in — we’ll confirm details by email or text shortly.";
        }

        if (promo && bookingPromoNote) {
          bookingPromoNote.textContent = `Promo applied: ${promo.label} New estimated total: $${finalEstimate}.`;
        }

        if (bookingPaymentNote && payDepositBtn) {
          bookingPaymentNote.textContent =
            "Want to secure your spot early? Place a small, secure deposit below (fully credited toward your clean).";
          payDepositBtn.classList.remove("hidden");
          payDepositBtn.onclick = () =>
            startDepositPayment(docRef.id, suggestedDeposit);
        }

        // Show "Buy After Cleaning" recommendations
        if (afterCleanWidget) {
          renderAfterCleanRecommendations();
          afterCleanWidget.classList.remove("hidden");
        }
      } catch (err) {
        console.error("Booking error:", err);
        if (bookingSuccess) {
          bookingSuccess.textContent =
            "Something went wrong on our side. Please try again or contact us directly.";
        }
      }

      setTimeout(() => {
        if (bookingSuccess) bookingSuccess.textContent = "";
        if (bookingPromoNote) bookingPromoNote.textContent = "";
        if (bookingPaymentNote) bookingPaymentNote.textContent = "";
      }, 9000);
    });
  }

  if (careersForm && careersSuccess) {
    careersForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(careersForm).entries());
      await saveToCollection("applications", data);
      careersForm.reset();
      careersSuccess.textContent =
        "Application received. We’ll reach out if we’re a beautiful fit for each other.";
      setTimeout(() => (careersSuccess.textContent = ""), 8000);
    });
  }

  if (contactForm && contactSuccess) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(contactForm).entries());
      await saveToCollection("contacts", data);
      contactForm.reset();
      contactSuccess.textContent =
        "Message sent. We’ll get back to you shortly.";
      setTimeout(() => (contactSuccess.textContent = ""), 8000);
    });
  }

  // ===============================
  // 10. Auth Modal & Login
  // ===============================

  const authModal = $("#authModal");
  const openLogin = $("#openLogin");
  const openLoginMobile = $("#openLoginMobile");
  const authClose = $("#authClose");
  const loginForm = $("#loginForm");
  const loginStatus = $("#loginStatus");

  function showAuthModal() {
    if (authModal) authModal.style.display = "flex";
  }
  function hideAuthModal() {
    if (authModal) authModal.style.display = "none";
    if (loginStatus) loginStatus.textContent = "";
    if (loginForm) loginForm.reset();
  }

  if (openLogin)
    openLogin.addEventListener("click", (e) => {
      e.preventDefault();
      showAuthModal();
    });

  if (openLoginMobile)
    openLoginMobile.addEventListener("click", (e) => {
      e.preventDefault();
      showAuthModal();
    });

  if (authClose) authClose.addEventListener("click", hideAuthModal);
  if (authModal) {
    authModal.addEventListener("click", (e) => {
      if (e.target === authModal) hideAuthModal();
    });
  }

  if (loginForm && loginStatus) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      loginStatus.textContent = "";
      const email = $("#loginEmail").value.trim();
      const password = $("#loginPassword").value;
      try {
        await auth.signInWithEmailAndPassword(email, password);
        loginStatus.textContent = "Logged in. Loading your dashboard...";
        setTimeout(hideAuthModal, 600);
      } catch (err) {
        console.error("Login error:", err);
        loginStatus.textContent =
          "Login failed. Please check your credentials or contact admin.";
      }
    });
  }

  // ===============================
  // 11. Shop: Products, Modal, Cart, Eco Points
  // ===============================

  // Eco Points
  function getEcoPoints() {
    try {
      const v = localStorage.getItem("dl_eco_points");
      return v ? parseInt(v, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  function addEcoPoints(points) {
    const current = getEcoPoints();
    const next = current + points;
    localStorage.setItem("dl_eco_points", String(next));
    if (cartEcoPointsEl) cartEcoPointsEl.textContent = next;
  }

  // Cart helpers
  function loadCart() {
    try {
      const stored = localStorage.getItem("dl_cart");
      cart = stored ? JSON.parse(stored) : [];
    } catch {
      cart = [];
    }
    renderCart();
  }

  function saveCart() {
    localStorage.setItem("dl_cart", JSON.stringify(cart));
  }

  function clearCart() {
    cart = [];
    saveCart();
    renderCart();
  }

  function addToCart(product, { subscribe = false } = {}) {
    if (!product) return;
    const existing = cart.find(
      (item) => item.id === product.id && item.subscribe === !!subscribe
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        subscribe: !!subscribe,
        quantity: 1,
      });
    }
    saveCart();
    renderCart();
    openCart();
  }

  function removeFromCart(id, subscribe) {
    cart = cart.filter(
      (item) => !(item.id === id && item.subscribe === subscribe)
    );
    saveCart();
    renderCart();
  }

  function renderCart() {
    if (!cartItemsEl || !cartCountEl || !cartSubtotalEl) return;

    cartItemsEl.innerHTML = "";

    if (!cart.length) {
      cartItemsEl.innerHTML =
        '<p class="muted">Your basket is feeling a little empty. Add a refill or a favourite spray to keep that Dustless glow.</p>';
    } else {
      cart.forEach((item) => {
        const lineTotal =
          item.price *
          item.quantity *
          (item.subscribe ? 0.9 : 1); // 10% off subscribe
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `
          <div>
            <div class="cart-item-title">${item.name}</div>
            <div class="cart-item-meta">
              ${item.subscribe ? "Subscribe & Save • " : ""}
              $${item.price.toFixed(2)} × ${item.quantity}
            </div>
          </div>
          <div class="cart-item-actions">
            <div class="cart-item-total">$${lineTotal.toFixed(2)}</div>
            <button class="cart-remove" data-id="${item.id}" data-sub="${
          item.subscribe
        }">Remove</button>
          </div>
        `;
        cartItemsEl.appendChild(row);
      });
    }

    const subtotal = cart.reduce((sum, item) => {
      const line =
        item.price *
        item.quantity *
        (item.subscribe ? 0.9 : 1);
      return sum + line;
    }, 0);

    cartSubtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = count;
    if (cartEcoPointsEl) {
      cartEcoPointsEl.textContent = getEcoPoints();
    }
  }

  function openCart() {
    if (cartDrawer) cartDrawer.classList.remove("hidden");
  }
  function closeCart() {
    if (cartDrawer) cartDrawer.classList.add("hidden");
  }

  if (openCartBtn) openCartBtn.addEventListener("click", openCart);
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);

  if (cartItemsEl) {
    cartItemsEl.addEventListener("click", (e) => {
      const btn = e.target.closest(".cart-remove");
      if (!btn) return;
      const id = btn.dataset.id;
      const sub = btn.dataset.sub === "true";
      removeFromCart(id, sub);
    });
  }

  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", () => {
      if (currentProduct) addToCart(currentProduct, { subscribe: false });
      closeProductModal();
    });
  }
  if (subscribeSaveBtn) {
    subscribeSaveBtn.addEventListener("click", () => {
      if (currentProduct) addToCart(currentProduct, { subscribe: true });
      closeProductModal();
    });
  }

  if (cartDrawer) {
    cartDrawer.addEventListener("click", (e) => {
      if (e.target === cartDrawer) closeCart();
    });
  }

  // Product modal
  function openProductModal(p) {
    if (!productModal) return;
    currentProduct = p;
    if (productModalImage) {
      productModalImage.src = p.imageURL;
      productModalImage.alt = p.name;
    }
    if (productModalName) productModalName.textContent = p.name;
    if (productModalCategory)
      productModalCategory.textContent = p.category || "Eco Clean";
    if (productModalDescription)
      productModalDescription.textContent = p.description || "";
    if (productModalPrice)
      productModalPrice.textContent = `$${Number(p.price).toFixed(2)}`;
    productModal.classList.remove("hidden");
  }

  function closeProductModal() {
    if (!productModal) return;
    currentProduct = null;
    productModal.classList.add("hidden");
  }

  if (closeProductModalBtn)
    closeProductModalBtn.addEventListener("click", closeProductModal);

  if (productModal) {
    productModal.addEventListener("click", (e) => {
      if (e.target === productModal) closeProductModal();
    });
  }

  // Shop grid click
  if (shopGrid) {
    shopGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      if (!card) return;
      const id = card.dataset.id;
      const product = products.find((p) => p.id === id);
      if (product) openProductModal(product);
    });
  }

  // Load products for public Shop + After Cleaning widget
  function loadProducts() {
    if (!db) return;
    db.collection("products")
      .orderBy("featured", "desc")
      .orderBy("name")
      .onSnapshot((snapshot) => {
        products = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        renderShopProducts();
        renderAfterCleanRecommendations();
      });
  }

  function renderShopProducts() {
    if (!shopGrid) return;
    shopGrid.innerHTML = "";
    if (shopFeaturedRow) shopFeaturedRow.innerHTML = "";

    products.forEach((p) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.dataset.id = p.id;
      card.innerHTML = `
        <img src="${p.imageURL}" alt="${p.name}" />
        <div class="product-name">${p.name}</div>
        <div class="product-price">$${Number(p.price).toFixed(2)}</div>
        <div>
          <span class="product-tag">${p.category || "Eco Clean"}</span>
          ${p.featured ? '<span class="product-tag">★ Staff favourite</span>' : ""}
        </div>
        <button class="btn btn-soft btn-sm">View details</button>
      `;
      shopGrid.appendChild(card);

      if (p.featured && shopFeaturedRow) {
        const pill = document.createElement("div");
        pill.className = "pill pill-soft";
        pill.textContent = `${p.name} • $${Number(p.price).toFixed(2)}`;
        shopFeaturedRow.appendChild(pill);
      }
    });
  }

  function renderAfterCleanRecommendations() {
    if (!afterCleanWidget || !afterCleanProductsEl) return;
    const featured = products.filter((p) => p.featured);
    if (!featured.length) {
      afterCleanWidget.classList.add("hidden");
      return;
    }
    afterCleanProductsEl.innerHTML = "";
    featured.slice(0, 3).forEach((p) => {
      const div = document.createElement("div");
      div.className = "after-clean-item";
      div.textContent = `${p.name} • $${Number(p.price).toFixed(2)}`;
      afterCleanProductsEl.appendChild(div);
    });
  }

  loadCart();
  loadProducts();

  // ===============================
  // 12. Admin & Employee Dashboards
  // ===============================

  function showPublicView() {
    document.body.classList.remove("app-mode");
    publicSite && publicSite.classList.remove("hidden");
    headerEl && headerEl.classList.remove("hidden");
    footerEl && footerEl.classList.remove("hidden");
    employeeDashboard && employeeDashboard.classList.add("hidden");
    adminDashboard && adminDashboard.classList.add("hidden");
  }

  function renderEmployeeJobs(docs) {
    const container = $("#employeeJobsList");
    if (!container) return;
    container.innerHTML = "";
    if (!docs.length) {
      container.textContent =
        "No jobs assigned yet. Check back soon or contact admin.";
      return;
    }

    docs.forEach((doc) => {
      const job = doc.data();
      const div = document.createElement("div");
      div.className = "job-card";
      div.innerHTML = `
        <div>
          <strong>${job.clientName || "Client"}</strong>
          <div class="job-meta">
            ${job.address || ""} • ${job.date || ""} ${job.time || ""}
          </div>
          <div class="job-meta">
            Service: ${job.service || job.serviceType || "Cleaning"}
          </div>
          <div class="job-status">Status: ${job.status || "pending"}</div>
        </div>
        <div class="job-actions">
          <button class="btn btn-sm btn-outline" data-status="in-progress">In progress</button>
          <button class="btn btn-sm btn-primary" data-status="completed">Completed</button>
          <div class="job-upload">
            <label>Before photo</label>
            <input type="file" accept="image/*" data-type="before" />
            <label>After photo</label>
            <input type="file" accept="image/*" data-type="after" />
            <button class="btn btn-sm btn-outline">Upload</button>
          </div>
        </div>
      `;

      const [btnIn, btnDone] = div.querySelectorAll("button");
      const uploadBtn = div.querySelector(".job-upload button");
      const beforeInput = div.querySelector('input[data-type="before"]');
      const afterInput = div.querySelector('input[data-type="after"]');

      btnIn.addEventListener("click", () =>
        updateJobStatus(doc.id, "in-progress")
      );
      btnDone.addEventListener("click", () =>
        updateJobStatus(doc.id, "completed")
      );
      uploadBtn.addEventListener("click", () =>
        handleJobUpload(doc.id, beforeInput.files[0], afterInput.files[0])
      );

      container.appendChild(div);
    });
  }

  async function updateJobStatus(jobId, status) {
    try {
      await db.collection("jobs").doc(jobId).update({ status });
    } catch (err) {
      console.error("Update job status error:", err);
      alert("Unable to update job status.");
    }
  }

  async function handleJobUpload(jobId, beforeFile, afterFile) {
    try {
      const updates = {};
      if (beforeFile) {
        const ref = storage
          .ref()
          .child(`jobs/${jobId}/before-${Date.now()}.jpg`);
        await ref.put(beforeFile);
        updates.beforePhotoUrl = await ref.getDownloadURL();
      }
      if (afterFile) {
        const ref = storage
          .ref()
          .child(`jobs/${jobId}/after-${Date.now()}.jpg`);
        await ref.put(afterFile);
        updates.afterPhotoUrl = await ref.getDownloadURL();
      }
      if (Object.keys(updates).length) {
        await db.collection("jobs").doc(jobId).update(updates);
        alert("Photos uploaded.");
      }
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed. Please try again.");
    }
  }

  function renderAdminEmployees(docs) {
    const container = $("#adminEmployees");
    if (!container) return;
    container.innerHTML = "";
    if (!docs.length) {
      container.textContent = "No employees registered yet.";
      return;
    }
    const ul = document.createElement("ul");
    ul.style.fontSize = "0.8rem";
    docs.forEach((doc) => {
      const u = doc.data();
      const li = document.createElement("li");
      li.textContent = `${u.name || u.email} (${u.role || "employee"})`;
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  function renderAdminCompletedJobs(docs) {
    const container = $("#adminCompletedJobs");
    if (!container) return;
    container.innerHTML = "";
    const completed = docs.filter(
      (d) => (d.data().status || "") === "completed"
    );
    if (!completed.length) {
      container.textContent = "No completed jobs logged yet.";
      return;
    }
    completed.slice(0, 6).forEach((doc) => {
      const j = doc.data();
      const div = document.createElement("div");
      div.className = "job-meta";
      div.textContent = `${j.clientName || "Client"} • ${
        j.service || ""
      } • ${j.date || ""} (${j.address || ""})`;
      container.appendChild(div);
    });
  }

  function renderAdminRevenueSummary(bookingsDocs) {
    const container = $("#adminRevenueSummary");
    if (!container) return;
    container.innerHTML = "";
    let totalEst = 0;
    let confirmed = 0;
    let deposits = 0;

    bookingsDocs.forEach((doc) => {
      const b = doc.data();
      if (b.estimatedPrice) totalEst += Number(b.estimatedPrice);
      if (b.status === "confirmed") confirmed++;
      if (b.depositStatus === "paid")
        deposits += Number(b.depositAmount || 0);
    });

    container.innerHTML = `
      <p>Total estimated value of bookings: <strong>$${totalEst.toFixed(
        2
      )}</strong></p>
      <p>Confirmed bookings: <strong>${confirmed}</strong></p>
      <p>Deposits recorded: <strong>$${deposits.toFixed(
        2
      )}</strong></p>
      <p class="dashboard-note">For exact payouts, always verify in Stripe.</p>
    `;
  }

  async function syncBookingToCalendar(bookingId) {
    try {
      const res = await fetch("/api/calendar-create-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Calendar sync failed");
      }
      alert("Added to calendar.");
    } catch (err) {
      console.error("Calendar sync error:", err);
      alert("Could not sync to calendar. Please check function logs.");
    }
  }

  function renderAdminBookings(bookingsDocs, employees) {
    const container = $("#adminBookings");
    if (!container) return;
    container.innerHTML = "";
    if (!bookingsDocs.length) {
      container.textContent = "No bookings yet.";
      return;
    }

    const table = document.createElement("table");
    table.className = "admin-table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>Client</th>
          <th>Service</th>
          <th>Date/Time</th>
          <th>Mess</th>
          <th>Est. $</th>
          <th>Promo</th>
          <th>Deposit</th>
          <th>Status</th>
          <th>Assigned</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = $("tbody", table);

    bookingsDocs.forEach((doc) => {
      const b = doc.data();
      const tr = document.createElement("tr");

      const currentEmp =
        employees.find((e) => e.id === b.assignedTo)?.name ||
        (b.assignedTo ? `ID: ${b.assignedTo}` : "Unassigned");

      const depositLabel =
        b.depositStatus === "paid"
          ? `Paid $${b.depositAmount || ""}`
          : b.depositAmount
          ? `Due $${b.depositAmount}`
          : "—";

      tr.innerHTML = `
        <td>${b.name || ""}</td>
        <td>${b.service || ""}</td>
        <td>${b.date || ""} ${b.time || ""}</td>
        <td>${b.mess || "-"}</td>
        <td>${b.estimatedPrice || "-"}</td>
        <td>${b.promoCode || ""}</td>
        <td>${depositLabel}</td>
        <td><span class="admin-chip">${b.status || "pending"}</span></td>
        <td>${currentEmp}</td>
        <td>
          <select class="assign-select">
            <option value="">Assign</option>
            ${employees
              .map(
                (e) =>
                  `<option value="${e.id}" ${
                    e.id === b.assignedTo ? "selected" : ""
                  }>${e.name}</option>`
              )
              .join("")}
          </select>
          <button class="btn btn-sm btn-outline btn-confirm">Confirm</button>
          <button class="btn btn-sm btn-outline btn-sync" ${
            b.status === "confirmed" ? "" : "disabled"
          }>Sync</button>
        </td>
      `;

      const assignSelect = $(".assign-select", tr);
      const confirmBtn = $(".btn-confirm", tr);
      const syncBtn = $(".btn-sync", tr);

      assignSelect.addEventListener("change", async () => {
        const empId = assignSelect.value;
        if (!empId) return;
        await db.collection("bookings").doc(doc.id).update({ assignedTo: empId });

        await db.collection("jobs").add({
          bookingId: doc.id,
          assignedTo: empId,
          clientName: b.name,
          address: b.address,
          date: b.date,
          time: b.time,
          service: b.service,
          status: "assigned",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });

      confirmBtn.addEventListener("click", async () => {
        try {
          await db
            .collection("bookings")
            .doc(doc.id)
            .update({ status: "confirmed" });
          alert("Booking marked as confirmed.");
        } catch (err) {
          console.error("Confirm booking error:", err);
          alert("Could not update booking.");
        }
      });

      syncBtn.addEventListener("click", () => {
        if (b.status !== "confirmed") {
          alert("Please confirm booking before syncing to calendar.");
          return;
        }
        syncBookingToCalendar(doc.id);
      });

      tbody.appendChild(tr);
    });

    container.appendChild(table);
  }

  function renderAdminProducts(docs) {
    if (!adminProductsList) return;
    if (!docs.length) {
      adminProductsList.innerHTML =
        '<p class="muted">No shop products yet. Add your first spray, scrub, or refill above.</p>';
      return;
    }
    adminProductsList.innerHTML = "";
    docs.forEach((doc) => {
      const p = doc.data();
      const row = document.createElement("div");
      row.className = "admin-product-row";
      row.innerHTML = `
        <div class="admin-product-main">
          <div class="admin-product-name">${p.name}
            <span class="pill pill-soft">${p.category || ""}</span>
          </div>
          <div class="admin-product-meta">
            $${Number(p.price).toFixed(2)} • Stock: ${p.stock ?? "—"}
            ${p.featured ? " • Featured" : ""}
          </div>
        </div>
        <div class="admin-product-actions">
          <button class="btn-text btn-sm" data-edit="${doc.id}">Edit</button>
          <button class="btn-text btn-sm text-danger" data-del="${doc.id}">Delete</button>
        </div>
      `;
      adminProductsList.appendChild(row);
    });
  }

  let adminProductHandlersAttached = false;
  function attachAdminProductHandlers() {
    if (adminProductHandlersAttached || !productForm || !adminProductsList)
      return;
    adminProductHandlersAttached = true;

    productForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = $("#productId").value.trim();
      const data = {
        name: $("#productName").value.trim(),
        category: $("#productCategory").value.trim(),
        price: parseFloat($("#productPrice").value),
        imageURL: $("#productImage").value.trim(),
        description: $("#productDescription").value.trim(),
        stock: parseInt($("#productStock").value || "0", 10),
        featured: $("#productFeatured").checked,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      try {
        if (id) {
          await db.collection("products").doc(id).update(data);
        } else {
          data.createdAt = firebase.firestore.FieldValue.serverTimestamp();
          await db.collection("products").add(data);
        }
        productForm.reset();
        $("#productId").value = "";
      } catch (err) {
        console.error("Error saving product", err);
        alert("Unable to save product. Check your connection or permissions.");
      }
    });

    if (cancelEditProductBtn) {
      cancelEditProductBtn.addEventListener("click", () => {
        productForm.reset();
        $("#productId").value = "";
      });
    }

    adminProductsList.addEventListener("click", async (e) => {
      const editId = e.target.dataset.edit;
      const delId = e.target.dataset.del;
      if (editId) {
        const doc = await db.collection("products").doc(editId).get();
        if (!doc.exists) return;
        const p = doc.data();
        $("#productId").value = doc.id;
        $("#productName").value = p.name || "";
        $("#productCategory").value = p.category || "";
        $("#productPrice").value = p.price || "";
        $("#productImage").value = p.imageURL || "";
        $("#productDescription").value = p.description || "";
        $("#productStock").value = p.stock ?? "";
        $("#productFeatured").checked = !!p.featured;
        productForm.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (delId) {
        if (!confirm("Delete this product?")) return;
        try {
          await db.collection("products").doc(delId).delete();
        } catch (err) {
          console.error(err);
          alert("Unable to delete product.");
        }
      }
    });
  }

  function showEmployeeView(name, uid) {
    document.body.classList.add("app-mode");
    publicSite && publicSite.classList.add("hidden");
    footerEl && footerEl.classList.add("hidden");
    headerEl && headerEl.classList.remove("hidden");
    adminDashboard && adminDashboard.classList.add("hidden");
    employeeDashboard && employeeDashboard.classList.remove("hidden");
    if (employeeWelcome) {
      employeeWelcome.textContent = `Welcome, ${name}.`;
    }

    if (employeeJobsUnsub) employeeJobsUnsub();
    employeeJobsUnsub = db
      .collection("jobs")
      .where("assignedTo", "==", uid)
      .onSnapshot((snap) => {
        renderEmployeeJobs(snap.docs);
      });

    employeeDashboard &&
      employeeDashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showAdminView(name) {
    document.body.classList.add("app-mode");
    publicSite && publicSite.classList.add("hidden");
    footerEl && footerEl.classList.add("hidden");
    headerEl && headerEl.classList.remove("hidden");
    employeeDashboard && employeeDashboard.classList.add("hidden");
    adminDashboard && adminDashboard.classList.remove("hidden");

    if (employeeJobsUnsub) employeeJobsUnsub();
    if (adminBookingsUnsub) adminBookingsUnsub();
    if (adminJobsUnsub) adminJobsUnsub();
    if (adminEmployeesUnsub) adminEmployeesUnsub();
    if (adminProductsUnsub) adminProductsUnsub();

    adminEmployeesUnsub = db
      .collection("users")
      .where("role", "in", ["employee", "admin"])
      .onSnapshot((empSnap) => {
        const employees = empSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        renderAdminEmployees(
          empSnap.docs.filter((d) => d.data().role === "employee")
        );

        // Products for admin management
        attachAdminProductHandlers();
        adminProductsUnsub = db
          .collection("products")
          .orderBy("name")
          .onSnapshot((snap) => {
            renderAdminProducts(snap.docs);
          });

        // Bookings & revenue
        if (adminBookingsUnsub) adminBookingsUnsub();
        adminBookingsUnsub = db
          .collection("bookings")
          .orderBy("createdAt", "desc")
          .onSnapshot((bSnap) => {
            renderAdminBookings(bSnap.docs, employees);
            renderAdminRevenueSummary(bSnap.docs);
          });
      });

    adminJobsUnsub = db.collection("jobs").onSnapshot((snap) => {
      renderAdminCompletedJobs(snap.docs);
    });

    adminDashboard &&
      adminDashboard.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function logout() {
    try {
      await auth.signOut();
      showPublicView();
    } catch (err) {
      console.error("Logout error:", err);
    }
  }

  if (logoutBtnEmp) logoutBtnEmp.addEventListener("click", logout);
  if (logoutBtnAdmin) logoutBtnAdmin.addEventListener("click", logout);

  auth.onAuthStateChanged(async (user) => {
    if (!user) {
      showPublicView();
      return;
    }
    try {
      const userDoc = await db.collection("users").doc(user.uid).get();
      const data = userDoc.data() || {};
      const role = data.role || "employee";
      const name = data.name || user.email || "Team Member";
      if (role === "admin") {
        showAdminView(name);
      } else {
        showEmployeeView(name, user.uid);
      }
    } catch (err) {
      console.error("Error loading user role:", err);
      showPublicView();
    }
  });

  // ===============================
  // 13. Stripe (Deposit + Shop)
  // ===============================

  const STRIPE_PUBLISHABLE_KEY =
    "pk_test_51SRR4wCGoVa5tJgfKPOgH29gweovgM87uDESzEa5d7D4frgxAqWTkhcMnudBDZS893e4eaEy30FevtxUBTqTDSgS00LsCUMty9";

  let stripe = null;
  if (window.Stripe) {
    stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
  }

  async function startDepositPayment(bookingId, depositAmount) {
    if (!stripe) {
      alert("Payment temporarily unavailable. Please contact us directly.");
      return;
    }
    if (!bookingId || !depositAmount || depositAmount <= 0) {
      alert("Missing booking or deposit details.");
      return;
    }
    if (paymentStatus) {
      paymentStatus.textContent = "Redirecting to secure payment...";
    }

    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, depositAmount }),
      });
      const data = await res.json();
      if (!res.ok || !data.sessionId) {
        throw new Error(data.error || "No session id");
      }
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (error && paymentStatus) {
        paymentStatus.textContent =
          "Payment error. Please try again or contact us.";
      }
    } catch (err) {
      console.error("Stripe error:", err);
      if (paymentStatus) {
        paymentStatus.textContent =
          "Failed to start payment. Please try again or contact us.";
      }
    }
  }
  window.startDepositPayment = startDepositPayment;

  async function checkoutCart() {
    if (!stripe) {
      alert("Payment temporarily unavailable. Please contact us directly.");
      return;
    }
    if (!cart.length) return;

    if (checkoutCartBtn) {
      checkoutCartBtn.disabled = true;
      checkoutCartBtn.textContent = "Redirecting...";
    }

    try {
      const res = await fetch("/api/create-shop-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      const data = await res.json();
      if (!res.ok || !data.sessionId) {
        throw new Error(data.error || "Checkout failed");
      }
      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (result.error) {
        alert(result.error.message || "Unable to start checkout.");
      }
    } catch (err) {
      console.error(err);
      alert("Unable to start checkout. Please try again.");
    } finally {
      if (checkoutCartBtn) {
        checkoutCartBtn.disabled = false;
        checkoutCartBtn.textContent = "Checkout Securely";
      }
    }
  }

  if (checkoutCartBtn) {
    checkoutCartBtn.addEventListener("click", checkoutCart);
  }

  // ===============================
  // 14. Checkout Return Handlers
  // ===============================

  (async function handleCheckoutReturn() {
    const params = new URLSearchParams(window.location.search);

    // Deposit flow
    const payment = params.get("payment");
    const bookingId = params.get("bookingId");
    if (payment && bookingId && paymentStatus) {
      try {
        if (payment === "success") {
          await db.collection("bookings").doc(bookingId).update({
            depositStatus: "paid",
          });
          paymentStatus.textContent =
            "Deposit received securely. Thank you — your booking is prioritized, and we’ll confirm shortly.";
        } else if (payment === "cancel") {
          paymentStatus.textContent =
            "Payment canceled. Your booking request is still pending review.";
        }
      } catch (err) {
        console.error("Post-checkout Firestore update error:", err);
      }
    }

    // Shop flow
    const shopStatus = params.get("shop");
    if (shopStatus === "success") {
      addEcoPoints(10);
      clearCart();
      alert(
        "Thank you for choosing our eco-friendly products. Your order is on its way, and you’ve earned Eco Points for caring for your home gently."
      );
    }
    if (shopStatus === "cancelled") {
      // No-op; optional message
    }
  })();
})();