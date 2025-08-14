document.getElementById("bookingForm").addEventListener("submit", function(e) {
    e.preventDefault();

    fetch("YOUR_GOOGLE_APPS_SCRIPT_WEBAPP_URL", {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            staffName: document.getElementById("staffName").value,
            department: document.getElementById("department").value,
            date: document.getElementById("date").value,
            time: document.getElementById("time").value,
            place: document.getElementById("place").value,
            purpose: document.getElementById("purpose").value
        })
    }).then(() => {
        alert("Booking submitted!");
    }).catch(err => {
        alert("Error: " + err);
    });
});

