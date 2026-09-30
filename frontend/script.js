/**
 * Student Tech Hub - Interactive Frontend Logic & Feature Suite
 * Pure Vanilla JavaScript (No heavy frameworks, modular, high performance)
 */

// ==========================================================================
// 1. Backend Configuration & Dual-Host Auto-Fallback
// ==========================================================================
let activeApiHost = window.location.hostname === "localhost" ? "http://localhost:8000" : "http://127.0.0.1:8000";
const API_BASE_URL = activeApiHost; // Constant safeguard against reference errors

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${activeApiHost}${endpoint}`, options);
    return res;
  } catch (err) {
    // If request failed, attempt alternate host automatically (localhost <-> 127.0.0.1)
    const alternateHost = activeApiHost.includes("localhost")
      ? "http://127.0.0.1:8000"
      : "http://localhost:8000";
    try {
      const altRes = await fetch(`${alternateHost}${endpoint}`, options);
      activeApiHost = alternateHost; // Switch to the responsive host!
      return altRes;
    } catch {
      throw err;
    }
  }
}

// ==========================================================================
// 2. Application State & Storage
// ==========================================================================
let allEvents = [];
let activeCategory = "all";
let searchQuery = "";
let savedEventIds = JSON.parse(localStorage.getItem("sth_saved_events") || "[]");
let soundEnabled = localStorage.getItem("sth_sound") === "true";
let countdownInterval = null;

// ==========================================================================
// 3. Futuristic Web Audio API Sound Synthesizer
// ==========================================================================
let audioCtx = null;

function playTechTone(type = "click") {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === "click") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.06);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.start(now);
      osc.stop(now + 0.06);
    } else if (type === "success") {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
      osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (type === "refresh") {
      osc.type = "sine";
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  } catch (e) {
    // Gracefully ignore audio context limitations
  }
}

// ==========================================================================
// 4. Floating Toast Notification System
// ==========================================================================
function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast-item toast-${type}`;
  
  const icon = type === "success" ? "✅" : type === "error" ? "⚠️" : "⚡";
  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// ==========================================================================
// 5. DOM References
// ==========================================================================
const statusPulse = document.getElementById("status-pulse");
const statusLabel = document.getElementById("status-label");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const themeIcon = document.getElementById("theme-icon");
const soundToggleBtn = document.getElementById("sound-toggle-btn");
const soundIcon = document.getElementById("sound-icon");

const loadEventsBtn = document.getElementById("load-events-btn");
const heroLoadBtn = document.getElementById("hero-load-btn");
const emptyStateLoadBtn = document.getElementById("empty-state-load-btn");
const eventsContainer = document.getElementById("events-container");
const categoryPillsContainer = document.getElementById("category-pills");
const searchInput = document.getElementById("event-search-input");
const searchClearBtn = document.getElementById("search-clear-btn");
const savedCountBadge = document.getElementById("saved-count");
const metricEventsCount = document.getElementById("metric-events-count");

const registrationForm = document.getElementById("registration-form");
const studentNameInput = document.getElementById("student-name");
const studentEmailInput = document.getElementById("student-email");
const eventSelect = document.getElementById("event-select");
const submitBtn = document.getElementById("submit-btn");
const alertBox = document.getElementById("alert-box");

// Digital Tech Pass Elements
const techPass = document.getElementById("tech-pass");
const passName = document.getElementById("pass-name");
const passEmail = document.getElementById("pass-email");
const passEvent = document.getElementById("pass-event");
const passId = document.getElementById("pass-id");
const registerAnotherBtn = document.getElementById("register-another-btn");

// ==========================================================================
// 6. Theme & Sound Management
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem("sth_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  if (themeIcon) themeIcon.textContent = savedTheme === "dark" ? "☀️" : "🌙";
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    playTechTone("click");
    const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("sth_theme", newTheme);
    if (themeIcon) themeIcon.textContent = newTheme === "dark" ? "☀️" : "🌙";
    showToast(`Switched to ${newTheme.toUpperCase()} theme`, "info");
  });
}

function initSound() {
  if (soundIcon) soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
}

if (soundToggleBtn) {
  soundToggleBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    localStorage.setItem("sth_sound", soundEnabled ? "true" : "false");
    if (soundIcon) soundIcon.textContent = soundEnabled ? "🔊" : "🔇";
    if (soundEnabled) playTechTone("click");
    showToast(soundEnabled ? "Audio Effects Enabled" : "Audio Muted", "info");
  });
}

// ==========================================================================
// 7. Backend Health Check
// ==========================================================================
async function checkBackendHealth() {
  try {
    const res = await apiFetch(`/`, { method: "GET" });
    if (res.ok) {
      statusPulse.className = "status-pulse online";
      statusLabel.textContent = "Backend: Connected (8000)";
    } else {
      throw new Error(`HTTP ${res.status}`);
    }
  } catch (err) {
    statusPulse.className = "status-pulse offline";
    statusLabel.textContent = "Backend: Offline";
  }
}

// ==========================================================================
// 8. Fetch Events from FastAPI (Fixed Refresh Button Logic)
// ==========================================================================
async function fetchEvents(isUserRefresh = false) {
  if (isUserRefresh) {
    playTechTone("refresh");
    const icon = loadEventsBtn ? loadEventsBtn.querySelector(".btn-icon") : null;
    if (icon) icon.classList.add("spinning");
  }

  setLoadingState(true);

  try {
    const response = await apiFetch(`/api/events`);
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    allEvents = data.events || [];

    // Update Dropdowns, Badges, and Countdown
    updateEventDropdown(allEvents);
    updateSavedCountBadge();
    initCountdownTimer(allEvents);

    if (metricEventsCount) {
      metricEventsCount.textContent = allEvents.length;
    }

    // Render Event Cards
    renderEvents();

    // Set Online Status
    statusPulse.className = "status-pulse online";
    statusLabel.textContent = "Backend: Connected (8000)";

    if (isUserRefresh) {
      showToast(`Refreshed ${allEvents.length} events from FastAPI!`, "success");
    }
  } catch (error) {
    console.error("Error fetching events:", error);
    renderErrorState(error.message);
    statusPulse.className = "status-pulse offline";
    statusLabel.textContent = "Backend: Offline";
    showToast("Could not reach FastAPI server on port 8000", "error");
  } finally {
    setLoadingState(false);
    const icon = loadEventsBtn ? loadEventsBtn.querySelector(".btn-icon") : null;
    if (icon) icon.classList.remove("spinning");
  }
}
window.fetchEvents = fetchEvents;

function setLoadingState(isLoading) {
  if (isLoading) {
    if (loadEventsBtn) loadEventsBtn.disabled = true;
    if (heroLoadBtn) heroLoadBtn.disabled = true;
    eventsContainer.innerHTML = `
      <div class="empty-state">
        <div class="spinner"></div>
        <h3>Fetching live schedule...</h3>
        <p>Connecting to FastAPI backend server...</p>
      </div>
    `;
  } else {
    if (loadEventsBtn) loadEventsBtn.disabled = false;
    if (heroLoadBtn) heroLoadBtn.disabled = false;
  }
}

function renderErrorState(errorMessage) {
  eventsContainer.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">⚠️</div>
      <h3 style="color: var(--accent-rose);">FastAPI Backend Offline</h3>
      <p style="margin-bottom: 0.8rem;">Could not reach <code>${activeApiHost}/api/events</code>.</p>
      <div style="background: rgba(0,0,0,0.3); padding: 0.75rem 1rem; border-radius: var(--radius-sm); font-family: var(--font-mono); margin: 0 auto 1.25rem; max-width: 440px; font-size: 0.85rem;">
        python -m uvicorn main:app --reload
      </div>
      <button class="btn btn-primary" onclick="window.fetchEvents(true)">
        <span>🔄 Click to Retry Connection</span>
      </button>
    </div>
  `;
}

// ==========================================================================
// 9. Render Event Cards & Bookmarks
// ==========================================================================
function renderEvents() {
  if (!allEvents || allEvents.length === 0) {
    eventsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>No Events Available</h3>
        <p>There are currently no events loaded from the server.</p>
      </div>
    `;
    return;
  }

  // Filter by category (including Saved) and search keyword
  const filtered = allEvents.filter((ev) => {
    let matchesCategory = true;
    if (activeCategory === "saved") {
      matchesCategory = savedEventIds.includes(ev.id);
    } else if (activeCategory !== "all") {
      matchesCategory = ev.category && ev.category.toLowerCase().includes(activeCategory.toLowerCase());
    }

    const term = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (ev.title && ev.title.toLowerCase().includes(term)) ||
      (ev.description && ev.description.toLowerCase().includes(term)) ||
      (ev.speaker && ev.speaker.toLowerCase().includes(term)) ||
      (ev.location && ev.location.toLowerCase().includes(term));

    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    const isSavedFilter = activeCategory === "saved";
    eventsContainer.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">${isSavedFilter ? "⭐" : "🔍"}</div>
        <h3>${isSavedFilter ? "No Saved Events Yet" : "No Matching Events Found"}</h3>
        <p>${
          isSavedFilter
            ? "Click the ⭐ Bookmark button on any workshop to save it here for quick access."
            : `No workshops match <strong>"${escapeHtml(searchQuery)}"</strong> in category <strong>"${escapeHtml(activeCategory)}"</strong>.`
        }</p>
        <button class="btn btn-secondary btn-sm" onclick="window.resetFilters()">View All Events</button>
      </div>
    `;
    return;
  }

  eventsContainer.innerHTML = filtered
    .map((ev) => {
      const icon = ev.icon || "💻";
      const badge = ev.badge ? `<span class="event-highlight-tag">${escapeHtml(ev.badge)}</span>` : "";
      const seatsText = ev.seats_left ? `🔥 ${ev.seats_left} seats left` : "Open RSVP";
      const isSaved = savedEventIds.includes(ev.id);

      return `
        <article class="event-card" data-event-id="${ev.id}">
          <div class="event-card-header">
            <span class="event-track-badge">
              <span>${icon}</span>
              <span>${escapeHtml(ev.category || "General")}</span>
            </span>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              ${badge}
              <span class="pill" style="font-size: 0.72rem; padding: 0.2rem 0.5rem;">${seatsText}</span>
              <button 
                class="btn-bookmark ${isSaved ? "saved" : ""}" 
                onclick="window.toggleBookmark(${ev.id})"
                title="${isSaved ? "Remove Bookmark" : "Save Workshop"}"
              >
                ${isSaved ? "⭐ Saved" : "☆ Save"}
              </button>
            </div>
          </div>

          <h3 class="event-title">${escapeHtml(ev.title)}</h3>

          <div class="event-meta-grid">
            <span class="event-meta-item">📅 <strong>${escapeHtml(ev.date)}</strong></span>
            <span class="event-meta-item">⏰ ${escapeHtml(ev.time)}</span>
            <span class="event-meta-item">📍 ${escapeHtml(ev.location)}</span>
          </div>

          <p class="event-desc">${escapeHtml(ev.description)}</p>

          <div class="event-card-footer">
            <div class="event-speaker-info">
              Mentor: <strong>${escapeHtml(ev.speaker || "Guest Instructor")}</strong>
            </div>

            <div class="event-actions">
              <button 
                class="btn btn-outline btn-sm" 
                type="button" 
                onclick="window.downloadCalendarFile(${ev.id})"
                title="Download .ics calendar reminder"
              >
                📅 Calendar
              </button>
              <button 
                class="btn btn-primary btn-sm" 
                type="button" 
                onclick="window.quickRegister(${ev.id}, '${escapeHtml(ev.title)}')"
              >
                ⚡ Quick RSVP
              </button>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

// Bookmark toggler
window.toggleBookmark = function (eventId) {
  playTechTone("click");
  const idx = savedEventIds.indexOf(eventId);
  const ev = allEvents.find((e) => e.id === eventId);
  const title = ev ? ev.title : "Event";

  if (idx > -1) {
    savedEventIds.splice(idx, 1);
    showToast(`Removed from saved bookmarks`, "info");
  } else {
    savedEventIds.push(eventId);
    showToast(`Saved "${title}" to your bookmarks!`, "success");
  }

  localStorage.setItem("sth_saved_events", JSON.stringify(savedEventIds));
  updateSavedCountBadge();
  renderEvents();
};

function updateSavedCountBadge() {
  if (savedCountBadge) {
    savedCountBadge.textContent = savedEventIds.length;
  }
}

// ==========================================================================
// 10. Live Countdown Timer Widget
// ==========================================================================
function initCountdownTimer(events) {
  if (!events || events.length === 0) return;

  const eventNameElem = document.getElementById("countdown-event-name");
  const cdDays = document.getElementById("cd-days");
  const cdHours = document.getElementById("cd-hours");
  const cdMins = document.getElementById("cd-mins");
  const cdSecs = document.getElementById("cd-secs");

  // Pick first event
  const nextEvent = events[0];
  if (eventNameElem) {
    eventNameElem.textContent = `${nextEvent.title} (${nextEvent.date})`;
  }

  if (countdownInterval) clearInterval(countdownInterval);

  // Set target date for next workshop
  const targetDate = new Date(`${nextEvent.date}T16:00:00`).getTime();

  function update() {
    const now = new Date().getTime();
    let diff = targetDate - now;

    if (diff < 0) {
      diff = 4 * 24 * 60 * 60 * 1000 + 18 * 60 * 60 * 1000; // Simulated active countdown
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const s = Math.floor((diff % (1000 * 60)) / 1000);

    if (cdDays) cdDays.textContent = String(d).padStart(2, "0");
    if (cdHours) cdHours.textContent = String(h).padStart(2, "0");
    if (cdMins) cdMins.textContent = String(m).padStart(2, "0");
    if (cdSecs) cdSecs.textContent = String(s).padStart(2, "0");
  }

  update();
  countdownInterval = setInterval(update, 1000);
}

// ==========================================================================
// 11. Quick RSVP & Calendar (.ics) Export
// ==========================================================================
function updateEventDropdown(events) {
  if (!eventSelect) return;
  const currentVal = eventSelect.value;

  eventSelect.innerHTML = `<option value="">General Community Membership</option>`;
  events.forEach((ev) => {
    const opt = document.createElement("option");
    opt.value = ev.id;
    opt.textContent = `${ev.title} (${ev.date})`;
    eventSelect.appendChild(opt);
  });

  if (currentVal) eventSelect.value = currentVal;
}

window.quickRegister = function (eventId, eventTitle) {
  playTechTone("click");
  if (eventSelect) eventSelect.value = eventId;

  const regSection = document.getElementById("registration-section");
  if (regSection) regSection.scrollIntoView({ behavior: "smooth" });

  const regCard = document.querySelector(".registration-card");
  if (regCard) {
    regCard.style.boxShadow = "0 0 35px rgba(99, 102, 241, 0.6)";
    setTimeout(() => (regCard.style.boxShadow = ""), 1200);
  }

  showAlert(`Selected <strong>${escapeHtml(eventTitle)}</strong>! Enter your name and email to RSVP.`, "success");
  if (studentNameInput) studentNameInput.focus();
};

window.downloadCalendarFile = function (eventId) {
  playTechTone("click");
  const ev = allEvents.find((e) => e.id === eventId);
  if (!ev) return;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Student Tech Hub//Event Schedule//EN",
    "BEGIN:VEVENT",
    `SUMMARY:${ev.title}`,
    `DESCRIPTION:${ev.description} - Speaker: ${ev.speaker}`,
    `LOCATION:${ev.location}`,
    `DTSTART;VALUE=DATE:${ev.date.replace(/-/g, "")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `${ev.title.toLowerCase().replace(/\s+/g, "_")}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast("Downloaded .ics Calendar Invite!", "success");
};

// ==========================================================================
// 12. Filter & Search Controls
// ==========================================================================
if (categoryPillsContainer) {
  categoryPillsContainer.addEventListener("click", (e) => {
    const pill = e.target.closest(".pill");
    if (!pill) return;

    playTechTone("click");
    document.querySelectorAll(".pill").forEach((p) => {
      p.classList.remove("active");
      p.setAttribute("aria-selected", "false");
    });
    pill.classList.add("active");
    pill.setAttribute("aria-selected", "true");

    activeCategory = pill.dataset.category || "all";
    renderEvents();
  });
}

if (searchInput) {
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    if (searchClearBtn) searchClearBtn.style.display = searchQuery ? "block" : "none";
    renderEvents();
  });
}

if (searchClearBtn) {
  searchClearBtn.addEventListener("click", () => {
    playTechTone("click");
    searchInput.value = "";
    searchQuery = "";
    searchClearBtn.style.display = "none";
    renderEvents();
    searchInput.focus();
  });
}

window.resetFilters = function () {
  activeCategory = "all";
  searchQuery = "";
  if (searchInput) searchInput.value = "";
  if (searchClearBtn) searchClearBtn.style.display = "none";

  document.querySelectorAll(".pill").forEach((p) => {
    p.classList.toggle("active", p.dataset.category === "all");
  });

  renderEvents();
};

// ==========================================================================
// 13. Registration Form Submission & Confetti Celebration
// ==========================================================================
if (registrationForm) {
  registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = studentNameInput.value.trim();
    const email = studentEmailInput.value.trim();
    const eventIdVal = eventSelect.value ? parseInt(eventSelect.value, 10) : null;

    if (!name) {
      showAlert("Please enter your full name.", "error");
      studentNameInput.focus();
      return;
    }

    if (!email || !email.includes("@") || !email.includes(".")) {
      showAlert("Please enter a valid email address.", "error");
      studentEmailInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-text").textContent = "Registering with FastAPI...";

    try {
      const payload = { name: name, email: email, event_id: eventIdVal };

      const response = await apiFetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        const errDetail = result.detail || "Registration failed on server.";
        throw new Error(typeof errDetail === "string" ? errDetail : JSON.stringify(errDetail));
      }

      playTechTone("success");
      launchConfetti();
      displayTechPass(result.data, name, email, eventIdVal);
      showAlert(`🎉 <strong>Registration Complete!</strong> Your student pass has been generated below.`, "success");
      registrationForm.style.display = "none";
      showToast("🎉 Verified Campus Tech Pass Issued!", "success");
    } catch (error) {
      console.error("Registration error:", error);
      showAlert(`<strong>Error:</strong> ${escapeHtml(error.message || "Failed to register. Is FastAPI running?")}`, "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.querySelector(".btn-text").textContent = "Complete Registration";
    }
  });
}

function displayTechPass(data, name, email, eventId) {
  const chosenEvent = allEvents.find((ev) => ev.id === eventId);
  const eventTitle = chosenEvent ? chosenEvent.title : "All-Access Campus Tech Hub";

  passName.textContent = name;
  passEmail.textContent = email;
  passEvent.textContent = eventTitle;

  const regCodeNum = String(data.id || 1).padStart(4, "0");
  passId.textContent = `#STH-2026-${regCodeNum}`;

  techPass.style.display = "block";
}

if (registerAnotherBtn) {
  registerAnotherBtn.addEventListener("click", () => {
    playTechTone("click");
    registrationForm.reset();
    registrationForm.style.display = "block";
    techPass.style.display = "none";
    alertBox.style.display = "none";
    studentNameInput.focus();
  });
}

// Native Canvas Confetti Cannon
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#6366f1", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.45,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -12 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: 1,
      rotation: Math.random() * 360,
    });
  }

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.alpha -= 0.012;

      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (alive) {
      requestAnimationFrame(frame);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  requestAnimationFrame(frame);
}

// Helpers
function showAlert(message, type = "success") {
  alertBox.className = `alert alert-${type}`;
  alertBox.innerHTML = message;
  alertBox.style.display = "block";
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ==========================================================================
// 14. Event Listeners & Startup
// ==========================================================================
if (loadEventsBtn) {
  loadEventsBtn.addEventListener("click", () => fetchEvents(true));
}

if (heroLoadBtn) {
  heroLoadBtn.addEventListener("click", () => {
    fetchEvents(true);
    const evSection = document.getElementById("events-section");
    if (evSection) evSection.scrollIntoView({ behavior: "smooth" });
  });
}

if (emptyStateLoadBtn) {
  emptyStateLoadBtn.addEventListener("click", () => fetchEvents(true));
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSound();
  checkBackendHealth();
  updateSavedCountBadge();
  fetchEvents();
  initParticleCanvas();
  init3DCardTilt();
});

// ==========================================================================
// 15. 3D Particle Network Canvas
// ==========================================================================
function initParticleCanvas() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener("resize", () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // Detect if dark or light — pick neon color
  function getNeonColor() {
    return document.documentElement.getAttribute("data-theme") === "light"
      ? "0, 168, 122"
      : "0, 255, 180";
  }

  const PARTICLE_COUNT = 60;
  const CONNECTION_DIST = 150;

  // 3D Particle objects (project from z depth onto 2D canvas)
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    z: Math.random() * 600 + 100,       // depth
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    vz: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 2 + 1,
  }));

  let mouseX = W / 2;
  let mouseY = H / 2;
  document.addEventListener("mousemove", (e) => { mouseX = e.clientX; mouseY = e.clientY; });

  function project(x, y, z) {
    const fov = 500;
    const scale = fov / (fov + z);
    return {
      px: (x - W / 2) * scale + W / 2,
      py: (y - H / 2) * scale + H / 2,
      scale,
    };
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    const neon = getNeonColor();

    // Gentle mouse parallax offset
    const dx = (mouseX - W / 2) / W;
    const dy = (mouseY - H / 2) / H;

    particles.forEach((p) => {
      p.x += p.vx + dx * 0.3;
      p.y += p.vy + dy * 0.3;
      p.z += p.vz;

      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      if (p.z < 50 || p.z > 700) p.vz *= -1;

      const { px, py, scale } = project(p.x, p.y, p.z);
      const alpha = 0.15 + scale * 0.65;
      const radius = p.r * scale * 1.5;

      ctx.beginPath();
      ctx.arc(px, py, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${neon}, ${alpha})`;
      ctx.fill();
    });

    // Draw connection lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dist3D = Math.sqrt(
          (a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2
        );

        if (dist3D < CONNECTION_DIST * 2) {
          const pa = project(a.x, a.y, a.z);
          const pb = project(b.x, b.y, b.z);
          const alpha = (1 - dist3D / (CONNECTION_DIST * 2)) * 0.18;

          ctx.beginPath();
          ctx.moveTo(pa.px, pa.py);
          ctx.lineTo(pb.px, pb.py);
          ctx.strokeStyle = `rgba(${neon}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(frame);
  }

  frame();
}

// ==========================================================================
// 16. Live 3D Mouse-Tilt on Event Cards
// ==========================================================================
function init3DCardTilt() {
  function applyTilt(el) {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((e.clientY - cy) / rect.height) * -14; // vertical tilt
      const ry = ((e.clientX - cx) / rect.width)  *  14; // horizontal tilt
      el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  }

  // Apply to existing cards
  document.querySelectorAll(".event-card").forEach(applyTilt);

  // Watch for new cards added by JavaScript rendering
  const observer = new MutationObserver(() => {
    document.querySelectorAll(".event-card:not([data-tilt])").forEach((el) => {
      el.setAttribute("data-tilt", "1");
      applyTilt(el);
    });
  });

  const feed = document.getElementById("events-container");
  if (feed) observer.observe(feed, { childList: true });
}

