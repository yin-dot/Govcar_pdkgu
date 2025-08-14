// ==== CONFIG ====
const API_URL = "https://script.google.com/macros/s/AKfycbwcLW12LSd7qwEam7PgeY0-VY1s3qg1O8d3DayW0avRIo1DVL9JF9yCTWczqXkOl3ir/exec"; // <-- paste your Apps Script Web App URL

// ==== STAFF BOOKING PAGE ====
async function apiPost(action, payload) {
  const res = await fetch(`${API_URL}?action=${encodeURIComponent(action)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

async function apiGet(action) {
  const res = await fetch(`${API_URL}?action=${encodeURIComponent(action)}&t=${Date.now()}`);
  return res.json();
}

async function submitBooking(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const status = document.getElementById("formStatus");
  status.textContent = "Submitting…";

  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());

  try {
    const result = await apiPost("book", payload);
    if (result.ok) {
      status.textContent = "Booking submitted ✅ (Calendar event created)";
      form.reset();
      await loadBookings();
    } else {
      status.textContent = "Failed: " + (result.error || "Unknown error");
    }
  } catch (err) {
    status.textContent = "Submission failed. Please try again.";
    console.error(err);
  }
}

async function loadBookings() {
  const container = document.getElementById("bookingsList");
  if (!container) return;
  container.innerHTML = "Loading…";
  try {
    const data = await apiGet("list");
    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = '<p class="small muted">No bookings yet.</p>';
      return;
    }
    container.innerHTML = "";
    data.slice().reverse().forEach(b => {
      const el = document.createElement("div");
      el.className = "item";
      el.innerHTML = `
        <strong>${b["Staff Name"] || ""}</strong> (${b["Department"] || ""})<br>
        ${b["Date"] || ""} ${b["Time"] || ""} — ${b["Place"] || ""}<br>
        <em>${b["Purpose"] || ""}</em><br>
        <span class="small muted">Status: ${b["Status"] || ""} · Driver: ${b["Driver"] || "-"} · Car: ${b["Car"] || "-"}</span>
      `;
      container.appendChild(el);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p class="small muted">Failed to load bookings.</p>';
  }
}

function initStaffPage() {
  const form = document.getElementById("bookingForm");
  if (form) form.addEventListener("submit", submitBooking);
  const refreshBtn = document.getElementById("refreshBtn");
  if (refreshBtn) refreshBtn.addEventListener("click", loadBookings);
  loadBookings();
}

// ==== PWA Service Worker ====
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

window.addEventListener("load", initStaffPage);
