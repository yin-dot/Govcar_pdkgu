document.getElementById('bookingForm').addEventListener('submit', function(e) 
{
  e.preventDefault();

  let name = document.getElementById('staffName').value;
  let department = document.getElementById('department').value;
  let dateTime = document.getElementById('dateTime').value;
  let place = document.getElementById('place').value;
  let purpose = document.getElementById('purpose').value;

  let bookingItem = `<p><strong>${name}</strong> (${department}) → ${place} at ${dateTime} for ${purpose}</p>`;

  document.getElementById('bookingsList').innerHTML += bookingItem;

  document.getElementById('bookingForm').reset();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js");
};

