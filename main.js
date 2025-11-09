// ===============================
// Smooth Scroll Helper
// ===============================
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: y, behavior: "smooth" });
}

// Nav link smooth scroll
document.querySelectorAll('.nav a, .nav-mobile a').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const id = href.substring(1);
      scrollToSection(id);
      document.getElementById('navMobile').classList.remove('open');
    }
  });
});

// ===============================
// Mobile Nav Toggle
// ===============================
const burger = document.getElementById('burger');
const navMobile = document.getElementById('navMobile');

burger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});

// ===============================
// Floating Particles Background
// ===============================
const particlesLayer = document.getElementById('particlesLayer');

function createParticle() {
  const p = document.createElement('div');
  p.classList.add('particle');
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

setInterval(createParticle, 700);
for (let i = 0; i < 18; i++) createParticle();

// ===============================
// Scroll Reveal
// ===============================
const revealEls = document.querySelectorAll('[data-reveal]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealEls.forEach(el => observer.observe(el));

// ===============================
// Parallax Hover
// ===============================
document.querySelectorAll('[data-parallax]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    card.style.transform = `translateY(-2px) rotateX(${y}deg) rotateY(${x}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
  });
});

// ===============================
// Pricing Estimator
// ===============================
const messSlider = document.getElementById('messSlider');
const messValue = document.getElementById('messValue');
const addonWindows = document.getElementById('addonWindows');
const addonAppliances = document.getElementById('addonAppliances');
const estimatedPrice = document.getElementById('estimatedPrice');

function calcEstimate() {
  const base = 120;
  const mess = Number(messSlider.value || 1);
  const levelCost = mess * 10;
  let total = base + levelCost;
  if (addonWindows.checked) total += 20;
  if (addonAppliances.checked) total += 15;
  estimatedPrice.textContent = `$${total}`;
  messValue.textContent = mess;
}
if (messSlider) {
  ['input', 'change'].forEach(evt =>
    messSlider.addEventListener(evt, calcEstimate)
  );
}
[addonWindows, addonAppliances].forEach(el => {
  el.addEventListener('change', calcEstimate);
});
calcEstimate();

// ===============================
// Service Modal
// ===============================
const modal = document.getElementById('serviceModal');
const modalContent = document.getElementById('serviceModalContent');

const serviceDetails = {
  residential: {
    title: "Residential Cleaning",
    body: `
      <ul>
        <li>Dusting, vacuuming, mopping.</li>
        <li>Kitchen surfaces, sinks, exterior appliances.</li>
        <li>Bathrooms fully sanitized.</li>
        <li>Bedrooms & living areas reset.</li>
      </ul>
      <p><strong>Est. Range:</strong> $120 - $220 depending on size & mess.</p>
    `
  },
  commercial: {
    title: "Commercial Cleaning",
    body: `
      <ul>
        <li>After-hours cleaning to avoid disruption.</li>
        <li>Desks, reception, washrooms, floors.</li>
        <li>Custom schedule: weekly, bi-weekly, monthly.</li>
      </ul>
      <p><strong>Est. Range:</strong> From $140 per visit.</p>
    `
  },
  deep: {
    title: "Deep Cleaning",
    body: `
      <ul>
        <li>Inside cabinets (on request), baseboards, doors & frames.</li>
        <li>Detailed bathroom & kitchen scrubbing.</li>
        <li>Ideal before starting recurring service.</li>
      </ul>
      <p><strong>Est. Range:</strong> $180 - $300.</p>
    `
  },
  move: {
    title: "Move-In / Move-Out",
    body: `
      <ul>
        <li>Inside fridge & oven options.</li>
        <li>Cabinets, closets, fixtures & more.</li>
        <li>Perfect for listings & inspections.</li>
      </ul>
      <p><strong>Est. Range:</strong> $200 - $360.</p>
    `
  },
  addons: {
    title: "Add-Ons",
    body: `
      <ul>
        <li>Interior fridge: +$15 - $25</li>
        <li>Oven detail: +$20 - $30</li>
        <li>Interior windows: from +$20</li>
        <li>Baseboards, walls, extras quoted fairly.</li>
      </ul>
    `
  }
};

function openServiceModal(key) {
  const svc = serviceDetails[key];
  if (!svc) return;
  modalContent.innerHTML = `
    <h3>${svc.title}</h3>
    ${svc.body}
    <button class="btn btn-primary" style="margin-top:0.8rem" onclick="scrollToSection('booking')">
      Request This Service
    </button>
  `;
  modal.style.display = 'flex';
}
function closeServiceModal() {
  modal.style.display = 'none';
}
window.openServiceModal = openServiceModal;
window.closeServiceModal = closeServiceModal;

modal.addEventListener('click', (e) => {
  if (e.target === modal) closeServiceModal();
});

// ===============================
// Gallery Lightbox
// ===============================
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');

document.querySelectorAll('.gallery-item').forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.style.display = 'flex';
  });
});
function closeLightbox() {
  lightbox.style.display = 'none';
}
window.closeLightbox = closeLightbox;

// ===============================
// Testimonials Carousel
// ===============================
const testimonials = [
  {
    text: "“She treated our place like her own. The deep clean before our move-out made the landlord speechless.”",
    name: "— Sarah M., Hamilton"
  },
  {
    text: "“Reliable, detail-oriented, and respectful. Our office has never felt this fresh.”",
    name: "— Local Studio, Burlington"
  },
  {
    text: "“I booked bi-weekly after the first visit. It’s a non-negotiable now.”",
    name: "— James R., Stoney Creek"
  }
];

const tText = document.getElementById('testimonialText');
const tName = document.getElementById('testimonialName');
const tDots = document.getElementById('testimonialDots');
let tIndex = 0;

function renderTestimonials() {
  tDots.innerHTML = '';
  testimonials.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === tIndex) dot.classList.add('active');
    dot.addEventListener('click', () => {
      tIndex = i;
      updateTestimonial();
    });
    tDots.appendChild(dot);
  });
  updateTestimonial();
}
function updateTestimonial() {
  const t = testimonials[tIndex];
  tText.textContent = t.text;
  tName.textContent = t.name;
  [...tDots.children].forEach((d, i) => {
    d.classList.toggle('active', i === tIndex);
  });
}
renderTestimonials();
setInterval(() => {
  tIndex = (tIndex + 1) % testimonials.length;
  updateTestimonial();
}, 6000);

// ===============================
// FAQ Accordion
// ===============================
document.querySelectorAll('.accordion-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const open = item.classList.contains('open');
    document.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('open'));
    if (!open) item.classList.add('open');
  });
});

// ===============================
// Forms: Booking / Careers / Contact
// ===============================
const bookingForm = document.getElementById('bookingForm');
const bookingSuccess = document.getElementById('bookingSuccess');
const bookingPaymentNote = document.getElementById('bookingPaymentNote');
const payDepositBtn = document.getElementById('payDepositBtn');
const paymentStatus = document.getElementById('paymentStatus');

const careersForm = document.getElementById('careersForm');
const careersSuccess = document.getElementById('careersSuccess');
const contactForm = document.getElementById('contactForm');
const contactSuccess = document.getElementById('contactSuccess');

// ===============================
// Dark / Light Mode
// ===============================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');

function applyTheme(mode) {
  if (mode === 'dark') {
    document.body.classList.add('dark');
    themeIcon.textContent = '🌙';
  } else {
    document.body.classList.remove('dark');
    themeIcon.textContent = '☀️';
  }
}
const storedTheme = localStorage.getItem('dl-theme');
applyTheme(storedTheme || 'light');

themeToggle.addEventListener('click', () => {
  const current = document.body.classList.contains('dark') ? 'dark' : 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('dl-theme', next);
});

// ===============================
// Chatbot
// ===============================
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotBody = document.getElementById('chatbotBody');
const chatbotInput = document.getElementById('chatbotInput');

function toggleChatbot(force) {
  const show = typeof force === 'boolean'
    ? force
    : chatbotWindow.style.display !== 'flex';
  chatbotWindow.style.display = show ? 'flex' : 'none';
  if (show && chatbotBody.children.length === 0) {
    botSay("Hi! I can help estimate your cleaning cost.");
    botSay("Tell me: home type (condo/house), bedrooms, and mess level (1-10).");
  }
}
chatbotToggle.addEventListener('click', () => toggleChatbot());

function botSay(text) {
  const div = document.createElement('div');
  div.className = 'chatbot-msg bot';
  div.textContent = text;
  chatbotBody.appendChild(div);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}
function userSay(text) {
  const div = document.createElement('div');
  div.className = 'chatbot-msg user';
  div.textContent = text;
  chatbotBody.appendChild(div);
  chatbotBody.scrollTop = chatbotBody.scrollHeight;
}
function estimateFromMessage(msg) {
  const messMatch = msg.match(/(\d{1,2})/);
  const mess = messMatch ? Math.min(Math.max(parseInt(messMatch[1], 10), 1), 10) : 5;
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
  const text = chatbotInput.value.trim();
  if (!text) return;
  userSay(text);
  chatbotInput.value = '';
  const est = estimateFromMessage(text);
  setTimeout(() => {
    botSay(`Based on that, a rough estimate is around $${est}.`);
    botSay(`Want a firm quote? Use the booking form so we can confirm details.`);
  }, 500);
}
window.handleChatbotMessage = handleChatbotMessage;
window.toggleChatbot = toggleChatbot;

chatbotInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    handleChatbotMessage();
  }
});

// ===============================
// Firebase Init (Auth + Firestore + Storage)
// ===============================

// IMPORTANT: Replace with your real Firebase config (from Firebase console).
// Keep this public config; secrets (Stripe key, Calendar credentials) go server-side.
const firebaseConfig = {
  apiKey: "AIzaSyBc7JKRYcVdzhMkfR1yKb3SBskvziUyPec",
    authDomain: "living-dustless.firebaseapp.com",
    projectId: "living-dustless",
    storageBucket: "living-dustless.appspot.com",
    messagingSenderId: "257617681555",
    appId: "1:257617681555:web:f4fc2f6a86def413098166"
  };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ===============================
// Generic Firestore helper
// ===============================
async function saveToBackend(collection, data) {
  try {
    await db.collection(collection).add({
      ...data,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  } catch (err) {
    console.error(`[${collection}] Firestore error:`, err);
  }
}

// ===============================
// Public Forms -> Firestore
// ===============================
if (bookingForm) {
  bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    bookingSuccess.textContent = "";
    bookingPaymentNote.textContent = "";
    paymentStatus.textContent = "";
    payDepositBtn.classList.add('hidden');

    const formData = Object.fromEntries(new FormData(bookingForm).entries());
    const mess = Number(formData.mess || 5);
    const estBase = 120 + mess * 10;
    const booking = {
      ...formData,
      mess: mess,
      status: "pending",
      estimatedPrice: estBase,
      depositStatus: "unpaid"
    };

    try {
      const docRef = await db.collection('bookings').add({
        ...booking,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });

      bookingForm.reset();
      bookingSuccess.textContent = "Thank you! We’ll confirm your booking shortly via email or phone.";
      bookingPaymentNote.textContent = "To secure your slot faster, you can pay a small deposit.";
      payDepositBtn.classList.remove('hidden');
      payDepositBtn.onclick = () =>
        startDepositPayment(docRef.id, booking.estimatedPrice || 120);

      // Ask backend to create a tentative calendar event after confirmation later
      // Final event is triggered when admin marks status = 'confirmed' (see admin section).

    } catch (err) {
      console.error("Booking error:", err);
      bookingSuccess.textContent = "Something went wrong. Please try again or contact us.";
    }

    setTimeout(() => {
      bookingSuccess.textContent = "";
      bookingPaymentNote.textContent = "";
    }, 9000);
  });
}

if (careersForm) {
  careersForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(careersForm).entries());
    await saveToBackend('applications', data);
    careersForm.reset();
    careersSuccess.textContent = "Application received. We’ll reach out if you’re a good match.";
    setTimeout(() => careersSuccess.textContent = "", 8000);
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(contactForm).entries());
    await saveToBackend('contacts', data);
    contactForm.reset();
    contactSuccess.textContent = "Message sent. We’ll get back to you shortly.";
    setTimeout(() => contactSuccess.textContent = "", 8000);
  });
}

// ===============================
// Auth Modal Logic
// ===============================
const authModal = document.getElementById('authModal');
const openLogin = document.getElementById('openLogin');
const openLoginMobile = document.getElementById('openLoginMobile');
const authClose = document.getElementById('authClose');
const loginForm = document.getElementById('loginForm');
const loginStatus = document.getElementById('loginStatus');

function showAuthModal() {
  authModal.style.display = 'flex';
}
function hideAuthModal() {
  authModal.style.display = 'none';
  loginStatus.textContent = '';
  loginForm.reset();
}

if (openLogin) openLogin.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(); });
if (openLoginMobile) openLoginMobile.addEventListener('click', (e) => { e.preventDefault(); showAuthModal(); });
if (authClose) authClose.addEventListener('click', hideAuthModal);
if (authModal) {
  authModal.addEventListener('click', (e) => {
    if (e.target === authModal) hideAuthModal();
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    loginStatus.textContent = "";
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    try {
      const cred = await auth.signInWithEmailAndPassword(email, password);
      loginStatus.textContent = "Logged in. Loading your dashboard...";
      setTimeout(() => {
        hideAuthModal();
      }, 800);
    } catch (err) {
      console.error("Login error:", err);
      loginStatus.textContent = "Invalid login. Please try again or contact admin.";
    }
  });
}

// ===============================
// Role-Based Dashboards (Firestore users/{uid}.role)
// ===============================
const employeeDashboard = document.getElementById('employeeDashboard');
const adminDashboard = document.getElementById('adminDashboard');
const employeeWelcome = document.getElementById('employeeWelcome');
const logoutBtnEmp = document.getElementById('logoutBtnEmp');
const logoutBtnAdmin = document.getElementById('logoutBtnAdmin');
const publicSite = document.getElementById('publicSite');
const headerEl = document.querySelector('.header');
const footerEl = document.querySelector('.footer');

let employeeJobsUnsub = null;
let adminBookingsUnsub = null;
let adminJobsUnsub = null;
let adminEmployeesUnsub = null;

// Render helpers

function renderEmployeeJobs(docs) {
  const container = document.getElementById('employeeJobsList');
  container.innerHTML = "";
  if (!docs.length) {
    container.textContent = "No jobs assigned yet.";
    return;
  }
  docs.forEach(doc => {
    const job = doc.data();
    const div = document.createElement('div');
    div.className = 'job-card';
    div.innerHTML = `
      <div>
        <strong>${job.clientName || 'Client'}</strong>
        <div class="job-meta">
          ${job.address || ''} • ${job.date || ''} ${job.time || ''}
        </div>
        <div class="job-meta">
          Service: ${job.service || job.serviceType || 'Cleaning'}
        </div>
        <div class="job-status">Status: ${job.status || 'pending'}</div>
      </div>
      <div class="job-actions">
        <button class="btn btn-sm btn-outline" data-status="in-progress">In Progress</button>
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
    const [btnIn, btnDone] = div.querySelectorAll('button');
    const uploadBtn = div.querySelector('.job-upload button');
    const beforeInput = div.querySelector('input[data-type="before"]');
    const afterInput = div.querySelector('input[data-type="after"]');

    btnIn.addEventListener('click', () => updateJobStatus(doc.id, "in-progress"));
    btnDone.addEventListener('click', () => updateJobStatus(doc.id, "completed"));
    uploadBtn.addEventListener('click', () => {
      handleJobUpload(doc.id, beforeInput.files[0], afterInput.files[0]);
    });

    container.appendChild(div);
  });
}

async function updateJobStatus(jobId, status) {
  try {
    await db.collection('jobs').doc(jobId).update({ status });
  } catch (err) {
    console.error("Update job status error:", err);
  }
}

async function handleJobUpload(jobId, beforeFile, afterFile) {
  try {
    const updates = {};
    if (beforeFile) {
      const ref = storage.ref().child(`jobs/${jobId}/before-${Date.now()}.jpg`);
      await ref.put(beforeFile);
      updates.beforePhotoUrl = await ref.getDownloadURL();
    }
    if (afterFile) {
      const ref = storage.ref().child(`jobs/${jobId}/after-${Date.now()}.jpg`);
      await ref.put(afterFile);
      updates.afterPhotoUrl = await ref.getDownloadURL();
    }
    if (Object.keys(updates).length) {
      await db.collection('jobs').doc(jobId).update(updates);
      alert("Photos uploaded.");
    }
  } catch (err) {
    console.error("Upload error:", err);
    alert("Upload failed. Try again.");
  }
}

// Admin render

function renderAdminBookings(docs, employees) {
  const container = document.getElementById('adminBookings');
  container.innerHTML = "";
  if (!docs.length) {
    container.textContent = "No bookings yet.";
    return;
  }
  const table = document.createElement('table');
  table.className = 'admin-table';
  table.innerHTML = `
    <thead>
      <tr>
        <th>Client</th>
        <th>Service</th>
        <th>Date/Time</th>
        <th>Mess</th>
        <th>Est. $</th>
        <th>Status</th>
        <th>Assigned</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  const tbody = table.querySelector('tbody');

  docs.forEach(doc => {
    const b = doc.data();
    const tr = document.createElement('tr');
    const currentEmp = (employees.find(e => e.id === b.assignedTo)?.name) || (b.assignedTo ? 'ID:' + b.assignedTo : 'Unassigned');
    tr.innerHTML = `
      <td>${b.name || ''}</td>
      <td>${b.service || ''}</td>
      <td>${b.date || ''} ${b.time || ''}</td>
      <td>${b.mess || '-'}</td>
      <td>${b.estimatedPrice || '-'}</td>
      <td><span class="admin-chip">${b.status || 'pending'}</span></td>
      <td>${currentEmp}</td>
      <td>
        <select class="assign-select">
          <option value="">Assign</option>
          ${employees.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
        </select>
        <button class="btn btn-sm btn-outline btn-confirm">Confirm</button>
      </td>
    `;
    const assignSelect = tr.querySelector('.assign-select');
    const confirmBtn = tr.querySelector('.btn-confirm');

    assignSelect.addEventListener('change', async () => {
      const empId = assignSelect.value;
      if (!empId) return;
      await db.collection('bookings').doc(doc.id).update({ assignedTo: empId });
      // Also create/update a job record for employees
      await db.collection('jobs').add({
        bookingId: doc.id,
        assignedTo: empId,
        clientName: b.name,
        address: b.address,
        date: b.date,
        time: b.time,
        service: b.service,
        status: 'assigned'
      });
    });

    confirmBtn.addEventListener('click', async () => {
      try {
        await db.collection('bookings').doc(doc.id).update({ status: 'confirmed' });
        // Trigger Calendar event via backend call
        await fetch('/api/calendar-create-event', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bookingId: doc.id })
        });
        alert("Booking confirmed & calendar updated (if configured).");
      } catch (err) {
        console.error("Confirm booking error:", err);
        alert("Booking confirmed, but calendar sync may have failed. Check logs.");
      }
    });

    tbody.appendChild(tr);
  });

  container.appendChild(table);
}

function renderAdminEmployees(docs) {
  const container = document.getElementById('adminEmployees');
  container.innerHTML = "";
  if (!docs.length) {
    container.textContent = "No employees registered.";
    return;
  }
  const ul = document.createElement('ul');
  ul.style.fontSize = '0.8rem';
  docs.forEach(doc => {
    const u = doc.data();
    const li = document.createElement('li');
    li.textContent = `${u.name || u.email} (${u.role || 'employee'})`;
    ul.appendChild(li);
  });
  container.appendChild(ul);
}

function renderAdminCompletedJobs(docs) {
  const container = document.getElementById('adminCompletedJobs');
  container.innerHTML = "";
  const completed = docs.filter(d => (d.data().status || '') === 'completed');
  if (!completed.length) {
    container.textContent = "No completed jobs yet.";
    return;
  }
  completed.slice(0, 6).forEach(doc => {
    const j = doc.data();
    const div = document.createElement('div');
    div.className = 'job-meta';
    div.textContent = `${j.clientName || 'Client'} • ${j.service || ''} • ${j.date || ''} (${j.address || ''})`;
    container.appendChild(div);
  });
}

function renderAdminRevenueSummary(bookingsDocs) {
  const container = document.getElementById('adminRevenueSummary');
  container.innerHTML = "";
  let totalEst = 0;
  let confirmed = 0;
  let deposits = 0;

  bookingsDocs.forEach(doc => {
    const b = doc.data();
    if (b.estimatedPrice) totalEst += Number(b.estimatedPrice);
    if (b.status === 'confirmed') confirmed++;
    if (b.depositStatus === 'paid') deposits += Number(b.depositAmount || 0);
  });

  container.innerHTML = `
    <p>Total estimated value of bookings: <strong>$${totalEst.toFixed(2)}</strong></p>
    <p>Confirmed bookings: <strong>${confirmed}</strong></p>
    <p>Deposits collected: <strong>$${deposits.toFixed(2)}</strong></p>
    <p class="dashboard-note">For exact revenue, use Stripe/PayPal dashboard.</p>
  `;
}

// ===============================
// Auth State Listener
// ===============================
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    showPublicView();
    return;
  }

  try {
    const userDoc = await db.collection('users').doc(user.uid).get();
    const data = userDoc.data() || {};
    const role = data.role || 'employee';
    const name = data.name || user.email;

    if (role === 'admin') {
      showAdminView(name);
    } else {
      showEmployeeView(name, user.uid);
    }
  } catch (err) {
    console.error("Error loading user role:", err);
    showPublicView();
  }
});

function showPublicView() {
  // show marketing site
  if (publicSite) publicSite.classList.remove('hidden');
  if (headerEl) headerEl.classList.remove('hidden');
  if (footerEl) footerEl.classList.remove('hidden');

  // hide dashboards
  if (employeeDashboard) employeeDashboard.classList.add('hidden');
  if (adminDashboard) adminDashboard.classList.add('hidden');
}

function showEmployeeView(name, uid) {
  // hide marketing site
  if (publicSite) publicSite.classList.add('hidden');
  if (footerEl) footerEl.classList.add('hidden');
  // keep header for branding + logout
  if (headerEl) headerEl.classList.remove('hidden');

  // show employee dashboard
  if (employeeWelcome) {
    employeeWelcome.textContent = `Welcome, ${name}.`;
  }
  if (employeeDashboard) employeeDashboard.classList.remove('hidden');
  if (adminDashboard) adminDashboard.classList.add('hidden');

  // subscribe to this employee's jobs
  if (employeeJobsUnsub) employeeJobsUnsub();
  employeeJobsUnsub = db.collection('jobs')
    .where('assignedTo', '==', uid)
    .onSnapshot(snap => {
      renderEmployeeJobs(snap.docs);
    });

  // scroll into view so it feels like a new app
  if (employeeDashboard) {
    employeeDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function showAdminView(name) {
  // hide marketing site
  if (publicSite) publicSite.classList.add('hidden');
  if (footerEl) footerEl.classList.add('hidden');
  if (headerEl) headerEl.classList.remove('hidden');

  // show admin dashboard
  if (employeeDashboard) employeeDashboard.classList.add('hidden');
  if (adminDashboard) adminDashboard.classList.remove('hidden');

  if (adminDashboard) {
    adminDashboard.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // clear previous listeners
  if (employeeJobsUnsub) employeeJobsUnsub();
  if (adminBookingsUnsub) adminBookingsUnsub();
  if (adminJobsUnsub) adminJobsUnsub();
  if (adminEmployeesUnsub) adminEmployeesUnsub();

  // watch employees
  adminEmployeesUnsub = db.collection('users')
    .where('role', '==', 'employee')
    .onSnapshot(empSnap => {
      const employees = empSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      renderAdminEmployees(empSnap.docs);

      // watch bookings with current employees list
      if (adminBookingsUnsub) adminBookingsUnsub();
      adminBookingsUnsub = db.collection('bookings')
        .orderBy('createdAt', 'desc')
        .onSnapshot(bSnap => {
          renderAdminBookings(bSnap.docs, employees);
          renderAdminRevenueSummary(bSnap.docs);
        });
    });

  // watch jobs for completed list
  adminJobsUnsub = db.collection('jobs')
    .onSnapshot(snap => {
      renderAdminCompletedJobs(snap.docs);
    });
}

// ===============================
// Logout Buttons
// ===============================
async function logout() {
  try {
    await auth.signOut();
    showPublicView();
  } catch (err) {
    console.error("Logout error:", err);
  }
}
if (logoutBtnEmp) logoutBtnEmp.addEventListener('click', logout);
if (logoutBtnAdmin) logoutBtnAdmin.addEventListener('click', logout);

// ===============================
// Stripe Deposit Integration (Front-end)
// ===============================

// IMPORTANT:
// - You MUST create a backend endpoint `/api/create-checkout-session`
//   that uses your Stripe SECRET key to create a Checkout Session.
// - Here we only call that endpoint and redirect with the publishable key.

let stripe = null;
if (window.Stripe) {
  // Replace with your Stripe publishable key
  stripe = Stripe("pk_test_51SRR4wCGoVa5tJgfKPOgH29gweovgM87uDESzEa5d7D4frgxAqWTkhcMnudBDZS893e4eaEy30FevtxUBTqTDSgS00LsCUMty9");
}

async function startDepositPayment(bookingId, estimatedPrice) {
  if (!stripe) {
    alert("Payment temporarily unavailable. Please contact us.");
    return;
  }
  paymentStatus.textContent = "Redirecting to secure payment...";
  try {
    const depositAmount = Math.round((estimatedPrice || 120) * 0.2); // 20% deposit
    const res = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bookingId, depositAmount })
    });
    const data = await res.json();
    if (!data.sessionId) {
      throw new Error("No session id");
    }
    const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
    if (error) {
      paymentStatus.textContent = "Payment error. Please try again or contact us.";
    }
  } catch (err) {
    console.error("Stripe error:", err);
    paymentStatus.textContent = "Failed to start payment. Please try again.";
  }
}
window.startDepositPayment = startDepositPayment;

// Optional: handle success/cancel via URL parameters
(function handleCheckoutReturn() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('payment') === 'success') {
    paymentStatus.textContent = "Deposit received. Thank you! A receipt has been sent to your email.";
  } else if (params.get('payment') === 'cancel') {
    paymentStatus.textContent = "Payment canceled. Your booking is still pending.";
  }
})();