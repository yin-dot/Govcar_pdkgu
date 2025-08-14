// ==== CONFIG ====
const API_URL = "https://script.google.com/macros/s/AKfycbwcLW12LSd7qwEam7PgeY0-VY1s3qg1O8d3DayW0avRIo1DVL9JF9yCTWczqXkOl3ir/exec"; // same as in app.js

async function apiGet(action) {
  const res = await fetch(`${API_URL}?action=${encodeURIComponent(action)}&t=${Date.now()}`);
  return res.json();
}

async function apiPost(action, payload) {
  const res = await fetch(`${API_URL}?action=${encodeURIComponent(action)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return res.json();
}

async function loadAdmin() {
  const list = document.getElementById("adminList");
  list.innerHTML = "Loading…";
  try {
    const data = await apiGet("list");
    list.innerHTML = "";
    if (!Array.isArray(data) || data.length === 0) {
      list.innerHTML = '<p class="small muted">No bookings.</p>';
      return;
    }

    data.slice().reverse().forEach(b => {
      const item = document.createElement("div");
      item.className = "item";

      const bookingId = b["Booking ID"] || "";
      const status = b["Status"] || "";
      const driver = b["Driver"] || "";
      const car = b["Car"] || "";

      item.innerHTML = `
        <div><strong>${b["Staff Name"] || ""}</strong> (${b["Department"] || ""}) — ${b["Date"] || ""} ${b["Time"] || ""}</div>
        <div>${b["Place"] || ""} — <em>${b["Purpose"] || ""}</em></div>
        <div class="small muted">Booking ID: ${bookingId} · Status: ${status}</div>
        <div style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
          <input class="drv" placeholder="Driver" value="${driver}" />
          <input class="car" placeholder="Car" value="${car}" />
          <select class="st">
            <option value="Approved" ${status==="Approved"?"selected":""}>Approved</option>
            <option value="Rejected" ${status==="Rejected"?"selected":""}>Rejected</option>
            <option value="Completed" ${status==="Completed"?"selected":""}>Completed</option>
            <option value="Pending" ${status==="Pending"?"selected":""}>Pending</option>
          </select>
          <button class="save">Save</button>
        </div>
      `;

      item.querySelector(".save").addEventListener("click", async () => {
        const adminKey = document.getElementById("adminKey").value.trim();
        if (!adminKey) return alert("Enter admin key");
        const payload = {
          adminKey,
          bookingId,
          driver: item.querySelector(".drv").value.trim(),
          car: item.querySelector(".car").value.trim(),
          status: item.querySelector(".st").value
        };
        const res = await apiPost("approve", payload);
        if (res.ok) {
          alert("Saved");
          loadAdmin();
        } else {
          alert("Failed: " + (res.error || "Unknown error"));
        }
      });

      list.appendChild(item);
    });

  } catch (err) {
    console.error(err);
    list.innerHTML = '<p class="small muted">Failed to load.</p>';
  }
}

function downloadCSV() {
  // just opens the CSV endpoint
  window.open(`${API_URL}?action=csv`, "_blank");
}

window.addEventListener("load", () => {
  document.getElementById("loadBtn").addEventListener("click", loadAdmin);
  document.getElementById("csvBtn").addEventListener("click", downloadCSV);
});
