// Replace with your deployed Apps Script Web App URL (ends with /exec)
const API_URL = "https://script.google.com/macros/s/AKfycbxmyr-QU9Ezv_9YA8QjZf_Km5X2OUmTFPti4IzOOQo48uxHJrDK-FKS-T6gFg2A584W/exec";

async function postBooking(payload){
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

async function getBookings(){
  const res = await fetch(API_URL + "?t=" + Date.now());
  if(!res.ok) throw new Error("Failed to fetch");
  return res.json();
}

document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  const status = document.getElementById("formStatus");
  status.textContent = "Submitting…";

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  try{
    await postBooking(payload);
    status.textContent = "Booking submitted ✅";
    form.reset();
    await loadBookings();
  }catch(err){
    console.error(err);
    status.textContent = "Submission failed. Please try again.";
  }
});

document.getElementById("refreshBtn").addEventListener("click", loadBookings);

async function loadBookings(){
  const container = document.getElementById("bookingsList");
  container.innerHTML = "Loading…";
  try{
    const data = await getBookings();
    if(!Array.isArray(data) || data.length === 0){
      container.innerHTML = '<p class="small muted">No bookings yet.</p>';
      return;
    }
    container.innerHTML = "";
    data.slice().reverse().forEach(b => {
      const p = document.createElement("div");
      p.className = "item";
      const date = b["Date"] || "";
      const time = b["Time"] || "";
      const status = b["Status"] || "";
      const name = b["Staff Name"] || "";
      const dept = b["Department"] || "";
      const purpose = b["Purpose"] || "";
      const place = b["Place"] || "";
      p.innerHTML = `<strong>${name}</strong> (${dept}) — ${date} ${time}<br>${place} — ${purpose}<br><span class="small muted">${status}</span>`;
      container.appendChild(p);
    });
  }catch(err){
    console.error(err);
    container.innerHTML = '<p class="small muted">Failed to load bookings.</p>';
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("service-worker.js");
  });
}

window.addEventListener("load", loadBookings);
