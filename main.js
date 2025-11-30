// main.js
// Dustless Living — Marketing Site + Portal + Shop

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

  if (burger && navMobile) {
    burger.addEventListener("click", () => {
      navMobile.classList.toggle("open");
    });
  }

  document.querySelectorAll(".nav a, .nav-mobile a").forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#")) {
        e.preventDefault();
        const id = href.substring(1);
        scrollToSection(id);
        if (navMobile) navMobile.classList.remove("open");
      }
    });
  });

  // ===============================
  // 2. Visual Polish (Particles, Reveal, Parallax)
  // ===============================

  const particlesLayer = document.getElementById("particlesLayer");

  function createParticle() {
    if (!particlesLayer) return;
    const p = document.createElement("div");
    p.className = "particle";
    const size = Math.random() * 4 + 2;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.left = `${Math.random() * 100}%`;
    p.style.bottom = `-40px`;
    p.style.animationDuration = `${10 + Math.random() * 8}s`;
    p.style.opacity = `${0.2 + Math.random() * 0.6}`;
    particlesLayer.appendChild(p);
    setTimeout(() => p.remove(), 18000);
  }

  if (particlesLayer) {
    for (let i = 0; i < 18; i++) createParticle();
    setInterval(createParticle, 700);
  }

  const revealEls = document.querySelectorAll("[data-reveal]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        } else {
          entry.target.classList.remove("visible");
        }
      });
    },
    { threshold: 0.18 }
  );
  revealEls.forEach((el) => observer.observe(el));

  document.querySelectorAll("[data-parallax]").forEach((card) => {
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
  // 2b. Before / After Slider
  // ===============================

  const beforeAfterSlider = document.getElementById("beforeAfterSlider");
  const beforeAfterAfterImg = document.getElementById("beforeAfterAfterImg");

  if (beforeAfterSlider && beforeAfterAfterImg) {
    const updateBA = () => {
      const v = Number(beforeAfterSlider.value || 50);
      // Reveal more of "after" as slider moves right
      beforeAfterAfterImg.style.clipPath = `inset(0 ${100 - v}% 0 0)`;
    };
    beforeAfterSlider.addEventListener("input", updateBA);
    updateBA();
  }

  // ===============================
  // 3. Pricing Estimator
  // ===============================

  const messSlider = document.getElementById("messSlider");
  const messValue = document.getElementById("messValue");
  const addonWindows = document.getElementById("addonWindows");
  const addonAppliances = document.getElementById("addonAppliances");
  const estimatedPrice = document.getElementById("estimatedPrice");

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
      addonWindows?.checked,
      addonAppliances?.checked
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
    if (!el) return;
    el.addEventListener("change", updateEstimator);
  });
  updateEstimator();

    // ===============================
  // 3b. SmartQuote Wizard (quote.html)
  // ===============================

  const smartquoteForm = document.getElementById("smartquoteForm");

  if (smartquoteForm) {
    const wizardSteps = Array.from(
      smartquoteForm.querySelectorAll(".wizard-step")
    );
    const wizardNextBtn = document.getElementById("wizardNextBtn");
    const wizardBackBtn = document.getElementById("wizardBackBtn");
    const wizardStepLabelEl = document.getElementById("wizardStepLabel");
    const wizardStepTitleEl = document.getElementById("wizardStepTitle");
    const wizardProgressFill = document.getElementById("wizardProgressFill");
    const thankYouPanel = document.getElementById("smartquoteThankYou");
    const summaryEl = document.getElementById("smartquoteSummary");
    const reviewBackLink = document.getElementById("reviewBackLink");
    const conditionSlider = document.getElementById("conditionLevel");
    const conditionValue = document.getElementById("conditionValue");
    const photoRoomUploads = document.getElementById("photoRoomUploads");
    const photoUploadSection = document.getElementById("photoUploadSection");
    const videoUploadSection = document.getElementById("videoUploadSection");
    const descriptionSection = document.getElementById("descriptionSection");
    const walkthroughVideoInput = document.getElementById("walkthroughVideo");
    const mediaDescriptionInput = document.getElementById("mediaDescription");
    const roomCountInputs =
      smartquoteForm.querySelectorAll("[data-room-count]");
    const commonAreaInputs =
      smartquoteForm.querySelectorAll("input[name='commonAreas']");
    const commonAreaOtherInput =
      document.getElementById("commonAreaOther") || null;
    const wizardProgress =
      smartquoteForm.closest(".smartquote-card")?.querySelector(
        ".wizard-progress"
      ) || null;
    let currentStep = 1;
    const totalSteps = wizardSteps.length;
    let lastRoomSignature = "";

    function updateConditionLabel() {
      if (conditionSlider && conditionValue) {
        conditionValue.textContent = conditionSlider.value;
      }
    }
    if (conditionSlider) {
      conditionSlider.addEventListener("input", updateConditionLabel);
      updateConditionLabel();
    }

    function findFieldWrapper(input) {
      return (
        input.closest(".field") ||
        input.closest(".toggle-field") ||
        input.closest("fieldset")
      );
    }

    function setFieldError(input, message) {
      const wrapper = findFieldWrapper(input);
      if (!wrapper) return;
      const errorEl = wrapper.querySelector(".field-error");
      if (errorEl) errorEl.textContent = message || "";
      wrapper.classList.toggle("has-error", Boolean(message));
    }

    function validateRadioGroup(name) {
      const radios = Array.from(
        smartquoteForm.querySelectorAll(`input[name="${name}"]`)
      );
      if (!radios.length) return true;
      const isValid = radios.some((radio) => radio.checked);
      setFieldError(radios[0], isValid ? "" : "Select an option");
      return isValid;
    }

    function validateField(input) {
      if (!input || input.disabled || !input.hasAttribute("required")) {
        return true;
      }
      if (input.type === "radio") return validateRadioGroup(input.name);
      let isValid = true;
      let message = "";
      const value = (input.value || "").trim();
      if (input.type === "email") {
        isValid = value.length > 0 && input.checkValidity();
        message = isValid ? "" : "Enter a valid email";
      } else if (input.type === "file") {
        isValid = input.files && input.files.length > 0;
      } else {
        isValid = value.length > 0;
      }
      if (!isValid && !message) message = "This field is required";
      setFieldError(input, message);
      return isValid;
    }

    function getStepEl(step) {
      return wizardSteps.find(
        (el) => Number(el.dataset.step) === Number(step)
      );
    }

    function validateStep(step) {
      const stepEl = getStepEl(step);
      if (!stepEl) return true;
      let isValid = true;
      const requiredElements = stepEl.querySelectorAll("[required]");
      const handledRadioGroups = new Set();
      requiredElements.forEach((input) => {
        if (input.type === "radio") {
          if (handledRadioGroups.has(input.name)) return;
          handledRadioGroups.add(input.name);
          if (!validateRadioGroup(input.name)) isValid = false;
        } else if (!validateField(input)) {
          isValid = false;
        }
      });
      return isValid;
    }

    function updateControls() {
      if (wizardBackBtn) wizardBackBtn.disabled = currentStep === 1;
      if (wizardNextBtn) {
        wizardNextBtn.textContent =
          currentStep === totalSteps ? "Submit for Smart Quote" : "Next step";
      }
    }

    function updateProgressMeta() {
      if (wizardStepLabelEl) {
        wizardStepLabelEl.textContent = `Step ${currentStep} of ${totalSteps}`;
      }
      const active = getStepEl(currentStep);
      if (wizardStepTitleEl) {
        wizardStepTitleEl.textContent =
          active?.dataset.title || `Step ${currentStep}`;
      }
      if (wizardProgressFill) {
        const progress =
          totalSteps <= 1 ? 100 : ((currentStep - 1) / (totalSteps - 1)) * 100;
        wizardProgressFill.style.width = `${progress}%`;
      }
    }

    function setStep(step) {
      currentStep = Math.min(Math.max(step, 1), totalSteps);
      wizardSteps.forEach((el) => {
        el.classList.toggle(
          "active",
          Number(el.dataset.step) === Number(currentStep)
        );
      });
      updateProgressMeta();
      updateControls();
      if (currentStep === 3) renderPhotoUploads();
      if (currentStep === totalSteps) populateSummary();
    }

    function updateMediaSections(value) {
      if (!value) return;
      const showingPhotos = value === "photos";
      const showingVideo = value === "video";
      if (photoUploadSection)
        photoUploadSection.classList.toggle("hidden", !showingPhotos);
      if (videoUploadSection)
        videoUploadSection.classList.toggle("hidden", !showingVideo);
      if (descriptionSection)
        descriptionSection.classList.toggle("hidden", value !== "description");
      if (walkthroughVideoInput)
        walkthroughVideoInput.required = showingVideo;
      if (mediaDescriptionInput) {
        mediaDescriptionInput.required = value === "description";
        if (value !== "description") setFieldError(mediaDescriptionInput, "");
      }
      if (value === "photos") renderPhotoUploads();
    }

    function getCommonAreas() {
      const values = [];
      commonAreaInputs.forEach((input) => {
        if (input.type === "hidden" && input.value) {
          values.push(input.value);
        } else if (input.checked) {
          values.push(input.value);
        }
      });
      const other = (commonAreaOtherInput?.value || "").trim();
      if (other) values.push(other);
      return [...new Set(values)];
    }

    function buildRoomSignature() {
      const bedroomCount =
        Number(document.getElementById("bedroomCount")?.value) || 0;
      const fullBaths =
        Number(document.getElementById("fullBathCount")?.value) || 0;
      const halfBaths =
        Number(document.getElementById("halfBathCount")?.value) || 0;
      return JSON.stringify({
        bedrooms: bedroomCount,
        fullBaths,
        halfBaths,
        areas: getCommonAreas().sort(),
      });
    }

    function buildRoomList() {
      const rooms = [];
      const bedrooms =
        Number(document.getElementById("bedroomCount")?.value) || 0;
      const fullBaths =
        Number(document.getElementById("fullBathCount")?.value) || 0;
      const halfBaths =
        Number(document.getElementById("halfBathCount")?.value) || 0;
      for (let i = 1; i <= bedrooms; i++) rooms.push(`Bedroom ${i}`);
      for (let i = 1; i <= fullBaths; i++) rooms.push(`Full bathroom ${i}`);
      for (let i = 1; i <= halfBaths; i++) rooms.push(`Half bathroom ${i}`);
      getCommonAreas().forEach((area) => {
        if (!rooms.includes(area)) rooms.push(area);
      });
      return rooms;
    }

    function renderPhotoUploads(force = false) {
      if (!photoRoomUploads) return;
      const signature = buildRoomSignature();
      if (!force && signature === lastRoomSignature) return;
      lastRoomSignature = signature;
      const rooms = buildRoomList();
      photoRoomUploads.innerHTML = "";
      if (!rooms.length) {
        photoRoomUploads.innerHTML =
          '<p class="muted">Add bedrooms or select common areas above to unlock photo uploads.</p>';
        return;
      }
      rooms.forEach((room, index) => {
        const slug = `${room
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")}-${index}`;
        const wrapper = document.createElement("div");
        wrapper.className = "room-upload";
        wrapper.dataset.roomName = room;
        wrapper.innerHTML = `
          <h4>${room}</h4>
          <div class="field">
            <label for="clutter-${slug}">Clutter level</label>
            <select id="clutter-${slug}" class="room-clutter-select" data-room="${room}">
              <option value="Tidy">Tidy</option>
              <option value="Some items">Some items</option>
              <option value="Messy">Messy</option>
              <option value="Very messy">Very messy</option>
            </select>
          </div>
          <div class="field">
            <label for="photo-${slug}">Room photo</label>
            <input type="file" id="photo-${slug}" class="room-photo-input" name="roomPhotos" data-room="${room}" accept="image/*" />
          </div>
          <p class="room-tip">Stand at the doorway and capture as much of the room and floor as possible.</p>
        `;
        photoRoomUploads.appendChild(wrapper);
      });
    }

    function formatDate(date) {
      if (!date) return "No date selected";
      const parsed = new Date(date);
      if (Number.isNaN(parsed.getTime())) return date;
      return parsed.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    const extrasLabels = {
      insideFridge: "Inside fridge",
      insideOven: "Inside oven",
      insideCabinets: "Inside cabinets",
      degreaseStove: "Heavy stove degrease",
      windows: "Interior windows",
      baseboards: "Baseboards",
      spotWalls: "Spot clean walls/doors",
      laundryFold: "Laundry folding",
      dishes: "Dishes",
      changeBedding: "Change bedding",
      petHair: "Pet hair focus",
      fragranceFree: "Fragrance-free products",
    };

    function formatExtras(extras) {
      if (!extras.length) return "No extras selected";
      return extras.map((key) => extrasLabels[key] || key).join(", ");
    }

    function formatMediaSummary(data) {
      if (data.mediaChoice === "video") {
        const fileName = data.mediaFiles[0]?.fileName || "Video pending";
        return `Walkthrough video: ${fileName}`;
      }
      if (data.mediaChoice === "description") {
        const snippet =
          data.mediaFiles[0]?.content?.slice(0, 120) || "Description coming";
        return `Will describe: ${snippet}`;
      }
      const uploadedCount = data.mediaFiles.filter(
        (item) => item.fileName
      ).length;
      return `Room photos selected (${uploadedCount} of ${data.mediaFiles.length})`;
    }

    function collectSmartquoteData() {
      const fd = new FormData(smartquoteForm);
      const extras = Array.from(
        smartquoteForm.querySelectorAll("input[name='extras']:checked")
      ).map((input) => input.value);
      const mediaChoice = fd.get("mediaOption") || "photos";
      const roomUploads = Array.from(
        photoRoomUploads?.querySelectorAll(".room-upload") || []
      ).map((section) => {
        const room = section.dataset.roomName;
        const fileInput = section.querySelector(".room-photo-input");
        const clutterSelect = section.querySelector(".room-clutter-select");
        const file = fileInput?.files?.[0] || null;
        return {
          room,
          fileName: file?.name || "",
          file,
          clutter: clutterSelect?.value || "Tidy",
        };
      });

      let mediaDetails = roomUploads;
      if (mediaChoice === "video") {
        const videoFile = walkthroughVideoInput?.files?.[0] || null;
        mediaDetails = videoFile
          ? [{ fileName: videoFile.name, file: videoFile, type: "video" }]
          : [];
      }
      if (mediaChoice === "description") {
        const content = (mediaDescriptionInput?.value || "").trim();
        mediaDetails = content ? [{ type: "text", content }] : [];
      }

      return {
        basicInfo: {
          name: (fd.get("name") || "").trim(),
          email: (fd.get("email") || "").trim(),
          phone: (fd.get("phone") || "").trim(),
          address: (fd.get("address") || "").trim(),
          homeType: fd.get("homeType") || "",
          preferredDate: fd.get("preferredDate") || "",
          urgency: fd.get("urgency") || "",
        },
        homeDetails: {
          livingLength: fd.get("livingLength") || "",
          commonAreas: getCommonAreas(),
          otherNotes: (commonAreaOtherInput?.value || "").trim(),
        },
        rooms: {
          bedrooms: Number(fd.get("bedrooms") || 0),
          fullBaths: Number(fd.get("fullBaths") || 0),
          halfBaths: Number(fd.get("halfBaths") || 0),
        },
        mediaChoice,
        mediaFiles: mediaDetails,
        condition: Number(fd.get("conditionLevel") || 1),
        extras,
        hasPets: fd.get("hasPets") === "yes",
        hasKids: fd.get("hasKids") === "yes",
        submittedAt: new Date().toISOString(),
      };
    }

    function populateSummary() {
      if (!summaryEl) return;
      const data = collectSmartquoteData();
      const urgencyMap = {
        today: "Today / Tomorrow",
        week: "This Week",
        flexible: "Flexible",
      };
      summaryEl.innerHTML = `
        <div class="review-block">
          <h4>Contact & address</h4>
          <ul>
            <li>${data.basicInfo.name || "Name pending"}</li>
            <li>${data.basicInfo.email || "Email pending"}</li>
            <li>${data.basicInfo.phone || "No phone provided"}</li>
            <li>${data.basicInfo.address || "Address pending"}</li>
            <li>Home type: ${data.basicInfo.homeType || "–"}</li>
            <li>Preferred date: ${formatDate(data.basicInfo.preferredDate)}</li>
            <li>Urgency: ${urgencyMap[data.basicInfo.urgency] || "Flexible"}</li>
          </ul>
        </div>
        <div class="review-block">
          <h4>Home & rooms</h4>
          <ul>
            <li>${data.rooms.bedrooms} bedrooms</li>
            <li>${data.rooms.fullBaths} full bath(s), ${
              data.rooms.halfBaths
            } half bath(s)</li>
            <li>Common areas: ${
              data.homeDetails.commonAreas.join(", ") || "Kitchen"
            }</li>
            <li>Lived in: ${data.homeDetails.livingLength || "Not shared"}</li>
            ${
              data.homeDetails.otherNotes
                ? `<li>Other: ${data.homeDetails.otherNotes}</li>`
                : ""
            }
          </ul>
        </div>
        <div class="review-block">
          <h4>Media & condition</h4>
          <ul>
            <li>${formatMediaSummary(data)}</li>
            <li>Condition: ${data.condition}/10</li>
            <li>Extras: ${formatExtras(data.extras)}</li>
            <li>Pets at home: ${data.hasPets ? "Yes" : "No"}</li>
            <li>Kids at home: ${data.hasKids ? "Yes" : "No"}</li>
          </ul>
        </div>
      `;
    }

    wizardNextBtn?.addEventListener("click", () => {
      if (currentStep === totalSteps) {
        smartquoteForm.requestSubmit();
        return;
      }
      if (validateStep(currentStep)) {
        setStep(currentStep + 1);
      }
    });

    wizardBackBtn?.addEventListener("click", () => {
      setStep(currentStep - 1);
    });

    reviewBackLink?.addEventListener("click", () => {
      setStep(totalSteps - 1);
    });

    smartquoteForm.addEventListener("change", (event) => {
      const target = event.target;
      if (
        !(
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement ||
          target instanceof HTMLSelectElement
        )
      )
        return;
      if (target.name === "mediaOption") {
        updateMediaSections(target.value);
      }
      if (target.hasAttribute("required")) validateField(target);
    });

    smartquoteForm.addEventListener("input", (event) => {
      const target = event.target;
      if (
        !(
          target instanceof HTMLInputElement ||
          target instanceof HTMLTextAreaElement
        )
      )
        return;
      if (target === mediaDescriptionInput && target.hasAttribute("required")) {
        validateField(target);
      }
    });

    roomCountInputs.forEach((input) => {
      input.addEventListener("input", () => {
        lastRoomSignature = "";
        renderPhotoUploads(true);
      });
    });

    commonAreaInputs.forEach((input) => {
      if (input.type !== "checkbox") return;
      input.addEventListener("change", () => {
        lastRoomSignature = "";
        renderPhotoUploads(true);
      });
    });

    commonAreaOtherInput?.addEventListener("input", () => {
      lastRoomSignature = "";
      renderPhotoUploads(true);
    });

    renderPhotoUploads(true);
    updateMediaSections(
      smartquoteForm.querySelector("input[name='mediaOption']:checked")?.value ||
        "photos"
    );
    setStep(1);

    smartquoteForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!validateStep(totalSteps)) {
        setStep(currentStep);
        return;
      }
      const payload = collectSmartquoteData();
      console.log("SmartQuote submission", payload);
      try {
        await saveToCollection("smartquoteLeads", {
          ...payload.basicInfo,
          homeDetails: payload.homeDetails,
          rooms: payload.rooms,
          conditionLevel: payload.condition,
          extras: payload.extras,
          mediaChoice: payload.mediaChoice,
          submittedAt: payload.submittedAt,
          source: "smartquoteWizard",
        });
      } catch (err) {
        console.warn("SmartQuote save skipped:", err);
      }
      smartquoteForm.classList.add("hidden");
      wizardProgress?.classList.add("hidden");
      if (thankYouPanel) thankYouPanel.hidden = false;
    });
  }

  // ===============================
  // 4. Service Modal & Gallery Lightbox
  // ===============================

  const serviceModalBackdrop = document.getElementById("serviceModal");
  const serviceModalContent = document.getElementById("serviceModalContent");

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
          <li>Ideal for listings, inspections & key handovers.</li>
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
    if (!serviceModalBackdrop || !serviceModalContent) return;
    const svc = serviceDetails[key];
    if (!svc) return;
    serviceModalContent.innerHTML = `
      <h3>${svc.title}</h3>
      ${svc.body}
      <button class="btn btn-primary" style="margin-top:0.8rem" onclick="scrollToSection('booking')">
        Book Your Fresh Start
      </button>
    `;
    serviceModalBackdrop.style.display = "flex";
  }

  function closeServiceModal() {
    if (serviceModalBackdrop) serviceModalBackdrop.style.display = "none";
  }

  window.openServiceModal = openServiceModal;
  window.closeServiceModal = closeServiceModal;

  if (serviceModalBackdrop) {
    serviceModalBackdrop.addEventListener("click", (e) => {
      if (e.target === serviceModalBackdrop) closeServiceModal();
    });
  }

  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");

  document.querySelectorAll(".gallery-item").forEach((img) => {
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

  const tText = document.getElementById("testimonialText");
  const tName = document.getElementById("testimonialName");
  const tDots = document.getElementById("testimonialDots");
  let tIndex = 0;

  function renderTestimonialsDots() {
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
  }

  function updateTestimonial() {
    if (!tText || !tName || !tDots) return;
    const t = testimonials[tIndex];
    tText.textContent = t.text;
    tName.textContent = t.name;
    [...tDots.children].forEach((d, i) => {
      d.classList.toggle("active", i === tIndex);
    });
  }

  if (tText && tName && tDots) {
    renderTestimonialsDots();
    updateTestimonial();
    setInterval(() => {
      tIndex = (tIndex + 1) % testimonials.length;
      updateTestimonial();
    }, 6000);
  }

  document.querySelectorAll(".accordion-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const open = item.classList.contains("open");
      document
        .querySelectorAll(".accordion-item")
        .forEach((i) => i.classList.remove("open"));
      if (!open) item.classList.add("open");
    });
  });

  const chatbotToggle = document.getElementById("chatbotToggle");
  const chatbotWindow = document.getElementById("chatbotWindow");
  const chatbotLeadForm = document.getElementById("chatbotLeadForm");
  const chatbotLeadStatus = document.getElementById("chatbotLeadStatus");

  function setChatbotStatus(message = "", type = "") {
    if (!chatbotLeadStatus) return;
    chatbotLeadStatus.textContent = message;
    chatbotLeadStatus.classList.remove("success", "error");
    if (type) chatbotLeadStatus.classList.add(type);
  }

  function toggleChatbot(force) {
    if (!chatbotWindow) return;
    const show =
      typeof force === "boolean"
        ? force
        : chatbotWindow.style.display !== "flex";
    chatbotWindow.style.display = show ? "flex" : "none";
    if (show) {
      setChatbotStatus("", "");
    }
  }
  window.toggleChatbot = toggleChatbot;

  if (chatbotToggle) {
    chatbotToggle.addEventListener("click", () => toggleChatbot());
  }

  // ===============================
  // 6. Theme Toggle (Dark / Light)
  // ===============================

  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = document.querySelector(".theme-icon");

  function applyTheme(mode) {
    if (mode === "dark") {
      body.classList.add("dark");
      if (themeIcon) themeIcon.textContent = "🌙";
    } else {
      body.classList.remove("dark");
      if (themeIcon) themeIcon.textContent = "☀️";
    }
  }

  const storedTheme = localStorage.getItem("dl-theme");
  applyTheme(storedTheme || "light");

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = body.classList.contains("dark") ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem("dl-theme", next);
    });
  }

  // ===============================
  // 7. Firebase Init
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

  function initChatbotLeadForm() {
    if (!chatbotLeadForm || chatbotLeadForm.dataset.bound === "true") return;

    chatbotLeadForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(chatbotLeadForm);
      const name = (formData.get("name") || "").trim();
      const email = (formData.get("email") || "").trim();
      const phone = (formData.get("phone") || "").trim();
      const service = (formData.get("service") || "General clean").trim();
      const timeline = (formData.get("timeline") || "Flexible").trim();
      const notes = (formData.get("notes") || "").trim();

      if (!email) {
        setChatbotStatus(
          "Please include an email so I can follow up.",
          "error"
        );
        return;
      }

      try {
        setChatbotStatus("Sending...", "");
        await db.collection("leads").add({
          name,
          email,
          phone,
          serviceType: service,
          timeline,
          notes,
          source: "leadWidget",
          status: "new",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        setChatbotStatus("Thanks! I’ll reply within 12 hours.", "success");
        chatbotLeadForm.reset();
      } catch (err) {
        console.error("Lead capture error:", err);
        setChatbotStatus(
          "Something went wrong. Email dustlessliving@gmail.com instead.",
          "error"
        );
      }
    });

    chatbotLeadForm.dataset.bound = "true";
  }
  initChatbotLeadForm();

  /**
   * DUSTLESS ASSISTANT – Firestore Data Model (reference only)
   *
   * leads (collection "leads")
   * {
   *   name,                // string
   *   email,               // string
   *   phone,               // string
   *   address,             // optional
   *   serviceType,         // e.g. "Residential", "Move-Out"
   *   source,              // "quoteForm" | "contactForm" | "manual"
   *   conditionLevel,      // 1–10 (number, optional)
   *   pets,                // string/enum (optional)
   *   locationArea,        // "hamilton" | "burlington" | etc.
   *   addOns,              // array of strings
   *   estimateTotal,       // number
   *   estimateDeposit,     // number
   *   estimateHoursMin,    // number
   *   estimateHoursMax,    // number
   *   status,              // "new" | "quoted" | "converted" | "lost"
   *   notes,               // free text from you
   *   createdAt            // serverTimestamp
   * }
   *
   * clients (collection "clients")
   * {
   *   name,
   *   email,
   *   phone,
   *   address,
   *   notes,
   *   source,              // "bookingForm" | "convertedLead" | etc.
   *   status,              // "active" | "prospect" | "inactive"
   *   lastBookingId,       // Firestore doc id (optional)
   *   lastBookingDate,     // string / ISO date (optional)
   *   createdAt
   * }
   *
   * bookings (collection "bookings") – already in use
   * {
   *   name, email, phone, address,
   *   date, time,
   *   service, mess,
   *   promoCode, promoLabel, promoDiscount,
   *   estimatedPrice, depositAmount,
   *   status,              // "pending" | "confirmed" | "completed" | "cancelled"
   *   depositStatus,       // "unpaid" | "pending" | "paid"
   *   photoUrls: [],
   *   assignedTo,          // employee user id
   *   createdAt
   * }
   *
   * jobs (collection "jobs") – already in use
   * {
   *   bookingId,
   *   assignedTo,
   *   clientName,
   *   address,
   *   date, time,
   *   service,
   *   status,              // "assigned" | "in-progress" | "completed"
   *   beforePhotoUrl,
   *   afterPhotoUrl,
   *   createdAt
   * }
   */

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
  // 8. Shop + Cart + After-Clean Widget
  // ===============================

  const shopGrid = document.getElementById("shopGrid");
  const shopFeaturedRow = document.getElementById("shopFeaturedRow");

  const afterCleanWidget = document.getElementById("afterCleanWidget");
  const afterCleanProductsEl = document.getElementById("afterCleanProducts");

  const productModalBackdrop = document.getElementById("productModal");
  const productModalImage = document.getElementById("productModalImage");
  const productModalName = document.getElementById("productModalName");
  const productModalCategory = document.getElementById("productModalCategory");
  const productModalDescription = document.getElementById(
    "productModalDescription"
  );
  const productModalPrice = document.getElementById("productModalPrice");
  const addToCartBtn = document.getElementById("addToCartBtn");
  const subscribeSaveBtn = document.getElementById("subscribeSaveBtn");
  const closeProductModalBtn = document.getElementById("closeProductModal");

  const cartDrawer = document.getElementById("cartDrawer");
  const openCartBtn = document.getElementById("openCartBtn");
  const openCartHeaderBtn = document.getElementById("openCartHeader");
  const closeCartBtn = document.getElementById("closeCartBtn");
  const cartItemsEl = document.getElementById("cartItems");
  const cartSubtotalEl = document.getElementById("cartSubtotal");
  const cartCountEl = document.getElementById("cartCount");
  const headerCartCount = document.getElementById("headerCartCount");
  const headerChatToggle = document.getElementById("headerChatToggle");
  const messMeterSlider = document.getElementById("messMeterSlider");
  const messMeterValue = document.getElementById("messMeterValue");
  const messMeterMessage = document.getElementById("messMeterMessage");
  const decorBubblesContainer = document.getElementById("decorBubbles");
  const checkoutCartBtn = document.getElementById("checkoutCartBtn");
  const cartEcoPointsEl = document.getElementById("cartEcoPoints");

  let products = [];
  let cart = [];
  let currentProduct = null;

  function renderShopProducts() {
    if (!shopGrid) return;
    shopGrid.innerHTML = "";
    if (shopFeaturedRow) shopFeaturedRow.innerHTML = "";

    products.forEach((p) => {
      const card = document.createElement("div");
      card.className = "product-card";
      card.dataset.id = p.id;
          card.innerHTML = `
      <img
        src="${p.imageURL || "/images/og-image.jpg"}"
        alt="${p.name}"
        onerror="this.src='/images/og-image.jpg'; this.onerror=null;"
      />
      <div class="product-name">${p.name}</div>
        <div class="product-price">$${Number(p.price).toFixed(2)}</div>
        <div>
          <span class="product-tag">${p.category || "Eco Clean"}</span>
          ${p.featured ? '<span class="product-tag">★ Staff favourite</span>' : ""}
        </div>
        <button class="btn btn-soft btn-sm product-quick-view">View details</button>
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
    if (!afterCleanWidget || !afterCleanProductsEl || !products.length) return;
    const featured = products.filter((p) => p.featured);
    const picks = (featured.length ? featured : products).slice(0, 3);

    afterCleanProductsEl.innerHTML = "";
    picks.forEach((p) => {
      const div = document.createElement("div");
      div.className = "after-clean-item";
      div.innerHTML = `
        <div class="after-clean-title">${p.name}</div>
        <div class="after-clean-price">$${Number(p.price).toFixed(2)}</div>
        <button class="link-btn" data-product-id="${p.id}">Add to cart</button>
      `;
      afterCleanProductsEl.appendChild(div);
    });

    afterCleanWidget.classList.remove("hidden");

    afterCleanProductsEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-product-id]");
      if (!btn) return;
      const id = btn.dataset.productId;
      const product = products.find((p) => p.id === id);
      if (product) addToCart(product, { subscribe: false });
    });
  }

  function openProductModal(p) {
    if (
      !productModalBackdrop ||
      !productModalImage ||
      !productModalName ||
      !productModalCategory ||
      !productModalDescription ||
      !productModalPrice
    )
      return;

    currentProduct = p;
    productModalImage.src = p.imageURL || "/images/og-image.jpg";
    productModalImage.alt = p.name;
    productModalName.textContent = p.name;
    productModalCategory.textContent = p.category || "Eco Clean";
    productModalDescription.textContent = p.description || "";
    productModalPrice.textContent = `$${Number(p.price).toFixed(2)}`;
    productModalBackdrop.classList.remove("hidden");
    productModalBackdrop.style.display = "flex";
  }

  function closeProductModal() {
    currentProduct = null;
    if (productModalBackdrop) {
      productModalBackdrop.classList.add("hidden");
      productModalBackdrop.style.display = "none";
    }
  }

  if (closeProductModalBtn) {
    closeProductModalBtn.addEventListener("click", closeProductModal);
  }
  if (productModalBackdrop) {
    productModalBackdrop.addEventListener("click", (e) => {
      if (e.target === productModalBackdrop) closeProductModal();
    });
  }

  if (shopGrid && productModalBackdrop) {
    shopGrid.addEventListener("click", (e) => {
      const card = e.target.closest(".product-card");
      if (!card) return;
      const id = card.dataset.id;
      const product = products.find((p) => p.id === id);
      if (product) openProductModal(product);
    });
  }

  function getEcoPoints() {
    try {
      const v = localStorage.getItem("dl_eco_points");
      return v ? parseInt(v, 10) || 0 : 0;
    } catch {
      return 0;
    }
  }

  function setEcoPointsDisplay() {
    if (cartEcoPointsEl) {
      cartEcoPointsEl.textContent = getEcoPoints();
    }
  }

  function addEcoPoints(points) {
    const current = getEcoPoints();
    const next = current + points;
    localStorage.setItem("dl_eco_points", String(next));
    setEcoPointsDisplay();
  }

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

  function renderCart() {
    if (!cartItemsEl || !cartSubtotalEl || !cartCountEl) return;
    cartItemsEl.innerHTML = "";

    if (!cart.length) {
      cartItemsEl.innerHTML =
        '<p class="muted">Your basket is feeling a little empty. Add a refill or a favourite spray to keep that Dustless glow.</p>';
    } else {
      cart.forEach((item) => {
        const lineTotal =
          item.price *
          item.quantity *
          (item.subscribe ? 0.9 : 1); // 10% off subs
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
    if (headerCartCount) headerCartCount.textContent = count;
    setEcoPointsDisplay();
  }

  function updateMessMeterMessage(value) {
    const v = Number(value);
    if (messMeterValue) messMeterValue.textContent = v;
    if (!messMeterMessage) return;
    if (v <= 3) {
      messMeterMessage.textContent =
        "Just a light reset. A standard clean might be plenty.";
    } else if (v <= 6) {
      messMeterMessage.textContent =
        "Lived-in and loved. Deep Clean Reset recommended.";
    } else if (v <= 8) {
      messMeterMessage.textContent =
        "We’ll focus on grease, grout, and baseboards for you.";
    } else {
      messMeterMessage.textContent =
        "No judgment. Deep clean + add-ons will help you breathe again.";
    }
  }

  function addToCart(product, opts = {}) {
    if (!product) return;
    const subscribe = !!opts.subscribe;
    const existing = cart.find(
      (item) => item.id === product.id && item.subscribe === subscribe
    );
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        subscribe,
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

  function openCart() {
    if (cartDrawer) cartDrawer.classList.remove("hidden");
  }

  function closeCart() {
    if (cartDrawer) cartDrawer.classList.add("hidden");
  }

  if (openCartBtn) openCartBtn.addEventListener("click", openCart);
  if (openCartHeaderBtn) openCartHeaderBtn.addEventListener("click", openCart);
  if (headerChatToggle) {
    headerChatToggle.addEventListener("click", () => toggleChatbot());
  }
  if (closeCartBtn) closeCartBtn.addEventListener("click", closeCart);
  if (messMeterSlider) {
    updateMessMeterMessage(messMeterSlider.value);
    messMeterSlider.addEventListener("input", (e) =>
      updateMessMeterMessage(e.target.value)
    );
  }

  // Decorative bubbles
  if (decorBubblesContainer) {
    const bubbleCount = 14;
    const bubbles = [];
    let canvasHeight = document.documentElement.scrollHeight;

    const updateCanvasSize = () => {
      canvasHeight = document.documentElement.scrollHeight;
    };
    window.addEventListener("resize", updateCanvasSize);

    function createBubble(idx) {
      const bubble = document.createElement("div");
      bubble.className = "decor-bubble";
      const size = 40 + Math.random() * 80;
      bubble.style.width = `${size}px`;
      bubble.style.height = `${size}px`;
      const hue = 150 + Math.random() * 40;
      bubble.style.background = `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.8), hsla(${hue}, 60%, 80%, 0.5))`;
      bubble.style.left = `${Math.random() * 100}%`;
      const yPos = Math.random() * canvasHeight;
      bubble.dataset.y = yPos;
      bubble.style.top = `${yPos}px`;
      bubble.dataset.vx = (Math.random() - 0.5) * 0.08;
      bubble.dataset.vy = (Math.random() - 0.5) * 0.12;
      bubble.dataset.floatOffset = Math.random() * 360;
      bubble.dataset.floatSpeed = 7000 + Math.random() * 4000;
      bubble.style.pointerEvents = "auto";
      bubble.addEventListener("click", () => popBubble(idx));
      decorBubblesContainer.appendChild(bubble);
      bubbles[idx] = bubble;
    }

    function popBubble(idx) {
      const bubble = bubbles[idx];
      if (!bubble) return;
      bubble.classList.add("popping");
      bubble.addEventListener(
        "animationend",
        () => {
          bubble.remove();
          setTimeout(() => createBubble(idx), 800);
        },
        { once: true }
      );
    }

    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY + window.scrollY;
    });

    function animateBubbles() {
      const now = Date.now();
      bubbles.forEach((bubble) => {
        if (!bubble) return;
        const rect = bubble.getBoundingClientRect();
        const currentY = parseFloat(bubble.dataset.y);
        const floatOffset = parseFloat(bubble.dataset.floatOffset);
        const vx = parseFloat(bubble.dataset.vx);
        const vy = parseFloat(bubble.dataset.vy);
        const floatSpeed = parseFloat(bubble.dataset.floatSpeed);
        const floatY =
          Math.sin(now / floatSpeed + floatOffset) * 6 + currentY + vy * 0.3;
        let floatLeftPercent =
          parseFloat(bubble.style.left) +
          vx * 0.4 +
          Math.cos(now / (floatSpeed + 800) + floatOffset) * 0.15;

        if (floatLeftPercent < -5) floatLeftPercent = 105;
        if (floatLeftPercent > 105) floatLeftPercent = -5;

        bubble.style.top = `${floatY}px`;
        bubble.style.left = `${floatLeftPercent}%`;
        bubble.dataset.y = floatY;

        if (floatY < -120 || floatY > canvasHeight + 120) {
          const resetY = Math.random() * canvasHeight;
          bubble.dataset.y = resetY;
          bubble.style.top = `${resetY}px`;
        }

        const centerX = rect.left + rect.width / 2;
        const centerY = floatY;
        const dx = centerX - mouseX;
        const dy = centerY - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 160) {
          const repel = (160 - dist) / 160;
          bubble.style.transform = `translate(${
            dx * repel * 0.02
          }px, ${dy * repel * 0.02}px)`;
        } else {
          bubble.style.transform = "";
        }
      });
      requestAnimationFrame(animateBubbles);
    }

    for (let i = 0; i < bubbleCount; i++) createBubble(i);
    requestAnimationFrame(animateBubbles);
  }

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

  async function checkoutCart() {
    if (!cart.length) return;
    if (!stripe) {
      alert("Payment temporarily unavailable. Please contact us directly.");
      return;
    }
    checkoutCartBtn.disabled = true;
    checkoutCartBtn.textContent = "Redirecting...";

    try {
      const res = await fetch("/api/create-shop-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });
      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });
      if (error) {
        alert(error.message || "Unable to start checkout.");
      }
    } catch (err) {
      console.error("Shop checkout error:", err);
      alert("Unable to start checkout. Please try again.");
    } finally {
      checkoutCartBtn.disabled = false;
      checkoutCartBtn.textContent = "Checkout Securely";
    }
  }

  if (checkoutCartBtn) {
    checkoutCartBtn.addEventListener("click", checkoutCart);
  }
  
  // DUSTLESS ASSISTANT: Products listener
  let productsListener = null;

  function loadProducts() {
    // Only require Firestore; specific UI bits are checked inside the render functions
    if (!db) return;

    if (productsListener) {
      productsListener();
      productsListener = null;
    }

        productsListener = db
      .collection("products")
      // Single-field orderBy → no composite index required
      .orderBy("featured", "desc")
      .onSnapshot(
        (snapshot) => {
          products = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Optional: sort again in JS so featured items stay on top,
          // and within each group they’re alphabetical by name
          products.sort((a, b) => {
            const fa = a.featured ? 1 : 0;
            const fb = b.featured ? 1 : 0;

            // keep featured=true above featured=false
            if (fa !== fb) return fb - fa;

            const nameA = (a.name || "").toLowerCase();
            const nameB = (b.name || "").toLowerCase();
            if (nameA < nameB) return -1;
            if (nameA > nameB) return 1;
            return 0;
          });

          renderShopProducts();
          renderAfterCleanRecommendations();
        },
        (err) => {
          console.error("Error listening to products:", err);
        }
      );
  }

  loadProducts();
  loadCart();

  // ===============================
  // 9. Promos & Booking / Careers / Contact
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

  const bookingForm = document.getElementById("bookingForm");
  const bookingSuccess = document.getElementById("bookingSuccess");
  const bookingPromoNote = document.getElementById("bookingPromoNote");
  const bookingPaymentNote = document.getElementById("bookingPaymentNote");
  const payDepositBtn = document.getElementById("payDepositBtn");
  const paymentStatus = document.getElementById("paymentStatus");

  const careersForm = document.getElementById("careersForm");
  const careersSuccess = document.getElementById("careersSuccess");
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");
  const bookingPhotosInput = document.getElementById("bookingPhotos");
  const careersResumeInput = document.getElementById("resumeFile");

    if (bookingForm) {
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (bookingSuccess) bookingSuccess.textContent = "";
      if (bookingPromoNote) bookingPromoNote.textContent = "";
      if (bookingPaymentNote) bookingPaymentNote.textContent = "";
      if (paymentStatus) paymentStatus.textContent = "";
      if (payDepositBtn) payDepositBtn.classList.add("hidden");

      const fd = new FormData(bookingForm);
      const formData = Object.fromEntries(fd.entries());
      const mess = Number(formData.mess || 5);

      // Optional: reuse add-on names if you add checkboxes later
      const includeWindows = fd.get("addonWindows") !== null;
      const includeAppliances = fd.get("addonAppliances") !== null;

      const baseEstimate = calculateBaseEstimate(
        mess,
        includeWindows,
        includeAppliances
      );

      const promoCode = (formData.promoCode || "").trim().toUpperCase();
      const { total: finalEstimate, promo } = applyPromo(
        promoCode,
        baseEstimate
      );
      const suggestedDeposit = Math.max(
        40,
        Math.round(finalEstimate * 0.2)
      );

      // Upload up to 3 photos if provided
      let photoUrls = [];
      if (bookingPhotosInput && bookingPhotosInput.files.length) {
        const files = Array.from(bookingPhotosInput.files).slice(0, 3);
        for (const file of files) {
          try {
            const ref = storage
              .ref()
              .child(`booking-photos/${Date.now()}-${file.name}`);
            await ref.put(file);
            const url = await ref.getDownloadURL();
            photoUrls.push(url);
          } catch (err) {
            console.error("Booking photo upload error:", err);
          }
        }
      }

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
        photoUrls,
        addonWindows: includeWindows,
        addonAppliances: includeAppliances,
      };

      try {
        const docRef = await db.collection("bookings").add({
          ...booking,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        bookingForm.reset();

                // DUSTLESS ASSISTANT: ensure client exists/updated
        try {
          await saveToCollection("clients", {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            notes: formData.notes || "",
            source: "bookingForm",
            status: "active",
            lastBookingId: docRef.id,
            lastBookingDate: formData.date || "",
          });
        } catch (clientErr) {
          console.error("Client save error:", clientErr);
          // Non-blocking: booking still succeeds even if this fails
        }

        if (bookingSuccess) {
          bookingSuccess.textContent =
            "Thank you. Your request is in — we’ll confirm details by email or text shortly.";
        }

        if (promo && bookingPromoNote) {
          bookingPromoNote.textContent = `Promo applied: ${promo.label} New estimated total: $${finalEstimate}.`;
        }

        if (bookingPaymentNote && payDepositBtn) {
          bookingPaymentNote.textContent =
            "Want to secure your spot early? You can place a small, secure deposit below (fully credited toward your clean).";
          payDepositBtn.classList.remove("hidden");
          payDepositBtn.onclick = () =>
            startDepositPayment(docRef.id, suggestedDeposit);
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

  if (contactForm && contactSuccess) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(contactForm).entries());
      await saveToCollection("contacts", data);

      // DUSTLESS ASSISTANT: also treat this as a soft lead
      await saveToCollection("leads", {
        name: data.name || "",
        email: data.email || "",
        phone: data.phone || "",
        notes: data.message || data.notes || "",
        source: "contactForm",
        status: "new",
      });

      contactForm.reset();
      contactSuccess.textContent =
        "Message sent. We’ll get back to you shortly.";
      setTimeout(() => (contactSuccess.textContent = ""), 8000);
    });
  }

  if (careersForm && careersSuccess) {
    careersForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      careersSuccess.textContent = "";

      const fd = new FormData(careersForm);
      const resumeFile = careersResumeInput?.files?.[0] || null;
      const entries = [...fd.entries()].filter(
        ([key]) => key !== "resumeFile"
      );
      const data = Object.fromEntries(entries);

      let resumeUrl = "";
      if (resumeFile) {
        try {
          const ref = storage
            .ref()
            .child(`careers-resumes/${Date.now()}-${resumeFile.name}`);
          await ref.put(resumeFile);
          resumeUrl = await ref.getDownloadURL();
        } catch (err) {
          console.error("Resume upload error:", err);
        }
      }

      try {
        await saveToCollection("careers", {
          ...data,
          resumeUrl,
          status: "new",
          source: "careersForm",
        });
        careersForm.reset();
        careersSuccess.textContent =
          "Application received. We’ll be in touch within a few days.";
      } catch (err) {
        console.error("Careers submission error:", err);
        careersSuccess.textContent =
          "We couldn’t save your application right now. Please try again soon.";
      }
      setTimeout(() => {
        careersSuccess.textContent = "";
      }, 8000);
    });
  }

  // ===============================
  // 10. Auth Modal & Role-Based Dashboards
  // ===============================

  const authModal = document.getElementById("authModal");
  const openLogin = document.getElementById("openLogin");
  const openLoginMobile = document.getElementById("openLoginMobile");
  const authClose = document.getElementById("authClose");
  const loginForm = document.getElementById("loginForm");
  const loginStatus = document.getElementById("loginStatus");

  const publicSite = document.getElementById("publicSite");
  const headerEl = document.querySelector(".header");
  const footerEl = document.querySelector(".footer");
  const appLabel = document.getElementById("appLabel");

  const employeeDashboard = document.getElementById("employeeDashboard");
  const adminDashboard = document.getElementById("adminDashboard");
  const employeeWelcome = document.getElementById("employeeWelcome");
  const logoutBtnEmp = document.getElementById("logoutBtnEmp");
  const logoutBtnAdmin = document.getElementById("logoutBtnAdmin");

  const adminEmployeesEl = document.getElementById("adminEmployees");
  const adminBookingsEl = document.getElementById("adminBookings");
  const adminCompletedJobsEl = document.getElementById("adminCompletedJobs");
  const adminRevenueSummaryEl = document.getElementById(
    "adminRevenueSummary"
  );
  // DUSTLESS ASSISTANT: new admin panels
  const adminLeadsEl = document.getElementById("adminLeads");
  const adminClientsEl = document.getElementById("adminClients");

  const productForm = document.getElementById("productForm");
  const adminProductsList = document.getElementById("adminProductsList");
  const cancelEditProductBtn = document.getElementById(
    "cancelEditProductBtn"
  );

  let employeeJobsUnsub = null;
  let adminBookingsUnsub = null;
  let adminJobsUnsub = null;
  let adminEmployeesUnsub = null;
  let adminProductsUnsub = null;
  // DUSTLESS ASSISTANT: live listeners
  let adminLeadsUnsub = null;
  let adminClientsUnsub = null;
  // DUSTLESS ASSISTANT: guard so we only bind product form events once
  let productFormBound = false;

  function showPublicView() {
    body.classList.remove("app-mode");
    if (publicSite) publicSite.classList.remove("hidden");
    if (headerEl) headerEl.classList.remove("hidden");
    if (footerEl) footerEl.classList.remove("hidden");
    if (employeeDashboard) employeeDashboard.classList.add("hidden");
    if (adminDashboard) adminDashboard.classList.add("hidden");
    if (appLabel) appLabel.style.display = "none";
  }

  function showEmployeeView(name, uid) {
    body.classList.add("app-mode");
    if (publicSite) publicSite.classList.add("hidden");
    if (footerEl) footerEl.classList.add("hidden");
    if (employeeDashboard) employeeDashboard.classList.remove("hidden");
    if (adminDashboard) adminDashboard.classList.add("hidden");
    if (headerEl) headerEl.classList.remove("hidden");
    if (appLabel) appLabel.style.display = "inline-flex";
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

    employeeDashboard?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function showAdminView(name) {
    body.classList.add("app-mode");
    if (publicSite) publicSite.classList.add("hidden");
    if (footerEl) footerEl.classList.add("hidden");
    if (adminDashboard) adminDashboard.classList.remove("hidden");
    if (employeeDashboard) employeeDashboard.classList.add("hidden");
    if (headerEl) headerEl.classList.remove("hidden");
    if (appLabel) appLabel.style.display = "inline-flex";

    if (employeeJobsUnsub) employeeJobsUnsub();
    if (adminBookingsUnsub) adminBookingsUnsub();
    if (adminJobsUnsub) adminJobsUnsub();
    if (adminEmployeesUnsub) adminEmployeesUnsub();
    if (adminProductsUnsub) adminProductsUnsub();
    if (adminLeadsUnsub) adminLeadsUnsub();
    if (adminClientsUnsub) adminClientsUnsub();

    adminEmployeesUnsub = db
      .collection("users")
      .where("role", "in", ["employee", "admin"])
      .onSnapshot((empSnap) => {
        const employees = empSnap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        renderAdminEmployees(
          employees.filter((u) => u.role === "employee")
        );

        if (adminBookingsUnsub) adminBookingsUnsub();
        adminBookingsUnsub = db
          .collection("bookings")
          .orderBy("createdAt", "desc")
          .onSnapshot((bSnap) => {
            renderAdminBookings(bSnap.docs, employees);
            renderAdminRevenueSummary(bSnap.docs);
          });
      });

          // DUSTLESS ASSISTANT: live leads list (all sources)
    adminLeadsUnsub = db
      .collection("leads")
      .orderBy("createdAt", "desc")
      .onSnapshot((leadSnap) => {
        renderAdminLeads(leadSnap.docs);
      });

    // DUSTLESS ASSISTANT: clients list
    adminClientsUnsub = db
      .collection("clients")
      .orderBy("createdAt", "desc")
      .onSnapshot((clientSnap) => {
        renderAdminClients(clientSnap.docs);
      });

    adminJobsUnsub = db.collection("jobs").onSnapshot((snap) => {
      renderAdminCompletedJobs(snap.docs);
    });

    if (!adminProductsUnsub) {
      adminProductsUnsub = db
        .collection("products")
        .orderBy("name")
        .onSnapshot((snap) => {
          renderAdminProducts(snap.docs);
        });
    }

    initAdminProductsForm();
    loadCart();
    adminDashboard?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function hideAuthModal() {
  if (authModal) authModal.classList.add("hidden");
  if (loginForm) loginForm.reset();
  if (loginStatus) loginStatus.textContent = "";
}

function logout() {
  auth.signOut().then(() => {
    showPublicView();
    if (authModal) authModal.classList.add("hidden");
  }).catch((err) => {
    console.error("Logout error:", err);
  });
}

  function renderEmployeeJobs(docs) {
    const container = document.getElementById("employeeJobsList");
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

      const [btnIn, btnDone] = div.querySelectorAll(".job-actions button");
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

  function renderAdminEmployees(employeeUsers) {
    if (!adminEmployeesEl) return;
    adminEmployeesEl.innerHTML = "";
    if (!employeeUsers.length) {
      adminEmployeesEl.textContent = "No employees registered yet.";
      return;
    }
    const ul = document.createElement("ul");
    ul.style.fontSize = "0.8rem";
    employeeUsers.forEach((u) => {
      const li = document.createElement("li");
      li.textContent = `${u.name || u.email} (${u.role || "employee"})`;
      ul.appendChild(li);
    });
    adminEmployeesEl.appendChild(ul);
  }

    // DUSTLESS ASSISTANT: Admin leads table
  function renderAdminLeads(leadDocs) {
    if (!adminLeadsEl) return;
    adminLeadsEl.innerHTML = "";

    if (!leadDocs.length) {
      adminLeadsEl.textContent =
        "No leads yet. When someone submits the quote or contact form, they’ll appear here.";
      return;
    }

    const table = document.createElement("table");
    table.className = "admin-table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>Name</th>
          <th>Service</th>
          <th>Area</th>
          <th>Mess</th>
          <th>Est. $</th>
          <th>Status</th>
          <th>Source</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    leadDocs.forEach((doc) => {
      const l = doc.data();
      const tr = document.createElement("tr");

      const status = l.status || "new";
      const mess = l.conditionLevel ?? l.condition ?? "-";
      const area = l.locationArea || l.location || "";
      const estimate = l.estimateTotal || "-";

      tr.innerHTML = `
        <td>${l.name || l.fullName || ""}</td>
        <td>${l.serviceType || l.service || ""}</td>
        <td>${area}</td>
        <td>${mess}</td>
        <td>${estimate}</td>
        <td><span class="admin-chip">${status}</span></td>
        <td>${l.source || "quoteForm"}</td>
        <td>
          <button class="btn btn-sm btn-outline lead-quoted">Quoted</button>
          <button class="btn btn-sm btn-outline lead-convert">Convert</button>
          <button class="btn btn-sm btn-outline lead-lost">Lost</button>
        </td>
      `;

      const btnQuoted = tr.querySelector(".lead-quoted");
      const btnConvert = tr.querySelector(".lead-convert");
      const btnLost = tr.querySelector(".lead-lost");

      btnQuoted.addEventListener("click", () =>
        updateLeadStatus(doc.id, "quoted")
      );
      btnLost.addEventListener("click", () =>
        updateLeadStatus(doc.id, "lost")
      );
      btnConvert.addEventListener("click", () =>
        convertLeadToClient(doc.id, l)
      );

      tbody.appendChild(tr);
    });

    adminLeadsEl.appendChild(table);
  }

  // DUSTLESS ASSISTANT: Admin clients table
  function renderAdminClients(clientDocs) {
    if (!adminClientsEl) return;
    adminClientsEl.innerHTML = "";

    if (!clientDocs.length) {
      adminClientsEl.textContent =
        "No clients recorded yet. When bookings are created or leads are converted, clients will appear here.";
      return;
    }

    const table = document.createElement("table");
    table.className = "admin-table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th>Address</th>
          <th>Status</th>
          <th>Source</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    clientDocs.forEach((doc) => {
      const c = doc.data();
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${c.name || ""}</td>
        <td>
          ${c.email || ""}<br />
          <span class="muted">${c.phone || ""}</span>
        </td>
        <td>${c.address || ""}</td>
        <td><span class="admin-chip">${c.status || "active"}</span></td>
        <td>${c.source || ""}</td>
        <td>${c.notes || ""}</td>
      `;

      tbody.appendChild(tr);
    });

    adminClientsEl.appendChild(table);
  }

  // DUSTLESS ASSISTANT: Lead / client helpers
  async function updateLeadStatus(leadId, status) {
    try {
      await db.collection("leads").doc(leadId).update({ status });
    } catch (err) {
      console.error("Update lead status error:", err);
      alert("Unable to update lead status.");
    }
  }

  async function convertLeadToClient(leadId, leadData) {
    try {
      await db.collection("clients").add({
        name: leadData.name || leadData.fullName || "",
        email: leadData.email || "",
        phone: leadData.phone || "",
        address: leadData.address || "",
        notes: leadData.notes || "",
        source: "convertedLead",
        status: "active",
        fromLeadId: leadId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await updateLeadStatus(leadId, "converted");
    } catch (err) {
      console.error("Convert lead error:", err);
      alert("Unable to convert lead.");
    }
  }

  function renderAdminCompletedJobs(docs) {
    if (!adminCompletedJobsEl) return;
    adminCompletedJobsEl.innerHTML = "";
    const completed = docs.filter(
      (d) => (d.data().status || "") === "completed"
    );
    if (!completed.length) {
      adminCompletedJobsEl.textContent = "No completed jobs logged yet.";
      return;
    }
    completed.slice(0, 6).forEach((doc) => {
      const j = doc.data();
      const div = document.createElement("div");
      div.className = "job-meta";
      div.textContent = `${j.clientName || "Client"} • ${
        j.service || ""
      } • ${j.date || ""} (${j.address || ""})`;
      adminCompletedJobsEl.appendChild(div);
    });
  }

  function renderAdminRevenueSummary(bookingsDocs) {
    if (!adminRevenueSummaryEl) return;
    adminRevenueSummaryEl.innerHTML = "";
    let totalEst = 0;
    let confirmed = 0;
    let deposits = 0;

    bookingsDocs.forEach((doc) => {
      const b = doc.data();
      if (b.estimatedPrice) totalEst += Number(b.estimatedPrice);
      if (b.status === "confirmed") confirmed++;
      if (b.depositStatus === "paid") {
        deposits += Number(b.depositAmount || 0);
      }
    });

    adminRevenueSummaryEl.innerHTML = `
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
    if (!adminBookingsEl) return;
    adminBookingsEl.innerHTML = "";
    if (!bookingsDocs.length) {
      adminBookingsEl.textContent = "No bookings yet.";
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
    const tbody = table.querySelector("tbody");

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
              .filter((e) => e.role === "employee")
              .map(
                (e) =>
                  `<option value="${e.id}" ${
                    e.id === b.assignedTo ? "selected" : ""
                  }>${e.name || e.email}</option>`
              )
              .join("")}
          </select>
          <button class="btn btn-sm btn-outline btn-confirm">Confirm</button>
          <button class="btn btn-sm btn-outline btn-sync" ${
            b.status === "confirmed" ? "" : "disabled"
          }>Sync</button>
        </td>
      `;

      const assignSelect = tr.querySelector(".assign-select");
      const confirmBtn = tr.querySelector(".btn-confirm");
      const syncBtn = tr.querySelector(".btn-sync");

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

    adminBookingsEl.appendChild(table);
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
            ${p.category ? `<span class="pill pill-soft">${p.category}</span>` : ""}
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

  function initAdminProductsForm() {
    if (!productForm || productFormBound) return;
    productFormBound = true;

    productForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("productId").value.trim();
      const data = {
        name: document.getElementById("productName").value.trim(),
        category: document.getElementById("productCategory").value.trim(),
        price: parseFloat(
          document.getElementById("productPrice").value || "0"
        ),
        imageURL: document.getElementById("productImage").value.trim(),
        description: document
          .getElementById("productDescription")
          .value.trim(),
        stock: parseInt(
          document.getElementById("productStock").value || "0",
          10
        ),
        featured: document.getElementById("productFeatured").checked,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      try {
        if (id) {
          await db.collection("products").doc(id).update(data);
        } else {
          data.createdAt =
            firebase.firestore.FieldValue.serverTimestamp();
          await db.collection("products").add(data);
        }
        productForm.reset();
        document.getElementById("productId").value = "";
      } catch (err) {
        console.error("Error saving product", err);
        alert(
          "Unable to save product. Check your connection or Firestore rules."
        );
      }
    });

    if (cancelEditProductBtn) {
      cancelEditProductBtn.addEventListener("click", () => {
        productForm.reset();
        document.getElementById("productId").value = "";
      });
    }

    if (adminProductsList) {
      adminProductsList.addEventListener("click", async (e) => {
        const editId = e.target.dataset.edit;
        const delId = e.target.dataset.del;
        if (editId) {
          const doc = await db.collection("products").doc(editId).get();
          if (!doc.exists) return;
          const p = doc.data();
          document.getElementById("productId").value = doc.id;
          document.getElementById("productName").value = p.name || "";
          document.getElementById("productCategory").value =
            p.category || "";
          document.getElementById("productPrice").value =
            p.price || "";
          document.getElementById("productImage").value =
            p.imageURL || "";
          document.getElementById("productDescription").value =
            p.description || "";
          document.getElementById("productStock").value =
            p.stock ?? "";
          document.getElementById("productFeatured").checked =
            !!p.featured;
          productForm.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
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
  }

  function showAuthModal() {
    if (authModal) authModal.style.display = "flex";
  }

  function hideAuthModal() {
    if (authModal) authModal.style.display = "none";
    if (loginStatus) loginStatus.textContent = "";
    if (loginForm) loginForm.reset();
  }

  if (openLogin) {
    openLogin.addEventListener("click", (e) => {
      e.preventDefault();
      showAuthModal();
    });
  }
  if (openLoginMobile) {
    openLoginMobile.addEventListener("click", (e) => {
      e.preventDefault();
      showAuthModal();
    });
  }
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
      const email = document.getElementById("loginEmail").value.trim();
      const password =
        document.getElementById("loginPassword").value;
      try {
        await auth.signInWithEmailAndPassword(email, password);
        loginStatus.textContent =
          "Logged in. Loading your dashboard...";
        setTimeout(hideAuthModal, 600);
      } catch (err) {
        console.error("Login error:", err);
        loginStatus.textContent =
          "Login failed. Please check your credentials or contact admin.";
      }
    });
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
  if (user) {
    try {
      const userDoc = await db.collection("users").doc(user.uid).get();
      const userData = userDoc.data();
      const role = userData?.role || "user";

      if (role === "admin") {
        showAdminView(userData?.name || "Admin");
        hideAuthModal();
      } else if (role === "employee") {
        showEmployeeView(userData?.name || "Employee", user.uid);
        hideAuthModal();
      } else {
        showPublicView();
        logout();
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
      showPublicView();
    }
  } else {
    showPublicView();
  }
});

    // ===============================
  // 10b. DUSTLESS ASSISTANT – Automation Hooks (email / Zapier)
  // ===============================

  /**
   * scheduleReminderForBooking
   * Called after a deposit is paid.
   * Later you can plug this into:
   *  - a serverless function that creates a 24h-reminder email
   *  - or Zapier/Make watching Firestore "bookings" where status == confirmed
   */
  function scheduleReminderForBooking(bookingId) {
    // TODO: Implement via:
    // - Firestore "tasks" collection processed by a scheduled Cloud Function
    // - or Zapier/Make scenario watching Firestore for new confirmed bookings
    console.debug("[Automation] scheduleReminderForBooking", bookingId);
  }

  /**
   * scheduleReviewRequestForBooking
   * Trigger a thank-you + review request after job completion.
   * You can call this from the admin when you mark a booking/job as completed.
   */
  function scheduleReviewRequestForBooking(bookingId) {
    // TODO: Implement via:
    // - Scheduled function 24–48h after 'completed'
    // - Email provider (SendGrid, MailerSend, etc.)
    console.debug("[Automation] scheduleReviewRequestForBooking", bookingId);
  }
    function scheduleLeadFollowUp(leadId) {
    // TODO: watch Firestore "leads" where status == "new" for > 2 days
    console.debug("[Automation] scheduleLeadFollowUp", leadId);
  }

  // ===============================
  // 11. Stripe (Deposits & Shop)
  // ===============================

  let stripe = null;
  if (window.Stripe) {
    stripe = Stripe(
      "pk_test_51SRR4wCGoVa5tJgfKPOgH29gweovgM87uDESzEa5d7D4frgxAqWTkhcMnudBDZS893e4eaEy30FevtxUBTqTDSgS00LsCUMty9"
    );
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

  // ===============================
  // 12. Handle Checkout Return (Deposits)
  // ===============================

  (async function handleCheckoutReturn() {
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    const bookingId = params.get("bookingId");

    if (!payment || !bookingId || !paymentStatus) return;

    try {
            if (payment === "success") {
        await db.collection("bookings").doc(bookingId).update({
          depositStatus: "paid",
          status: "confirmed",
        });

        // DUSTLESS ASSISTANT: hooks for reminders + calendar + thank-you
        scheduleReminderForBooking(bookingId);
        scheduleReviewRequestForBooking(bookingId);
        syncBookingToCalendar(bookingId);

        paymentStatus.textContent =
          "Deposit received securely. Thank you — your booking is confirmed and we’ll follow up with details.";
      } else if (payment === "cancel") {
        paymentStatus.textContent =
          "Payment canceled. Your booking request is still pending review.";
      }
    } catch (err) {
      console.error("Post-checkout Firestore update error:", err);
    }
  })();

  // ===============================
// DUSTLESS ASSISTANT – Public shop bootstrap
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  // Only load products on pages that have any shop-related element
  if (shopGrid || shopFeaturedRow || afterCleanWidget) {
    loadProducts();
  }
});

})();
