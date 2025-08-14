# Driver Booking System — Pure Frontend (PWA) + Google Sheets

This is a zero-backend starter: the site is a PWA and talks to **Google Sheets** through **Apps Script Web App**.

## 1) Setup Google Sheet
Create a sheet with headers in row 1:
```
Timestamp | Staff Name | Department | Date | Time | Place | Purpose | Status | Driver | Car
```

## 2) Apps Script Web API
In the sheet, go to **Extensions → Apps Script** and paste:
```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(),
    data.staffName,
    data.department,
    data.date,
    data.time,
    data.place,
    data.purpose,
    "Pending",
    "",
    ""
  ]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = SpreadsheetApp.getActive().getActiveSheet();
  var rows = sheet.getDataRange().getValues();
  var headers = rows.shift();
  var data = rows.map(r => {
    var o = {};
    headers.forEach((h,i) => o[h] = r[i]);
    return o;
  });
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}
```
Deploy → **Web app** → Execute as **Me**, Who has access: **Anyone** → Copy URL (ends with `/exec`).

## 3) Connect Frontend
Open `app.js` and set:
```
const API_URL = "PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE";
```
Then open `index.html` (or deploy).

## 4) PWA (Installable)
`manifest.json` + `service-worker.js` included. Host on HTTPS (Netlify/GitHub Pages), then on mobile choose “Add to Home Screen”.

## 5) Deploy
- **Netlify**: drag-drop this folder.
- **GitHub Pages**: push and enable Pages.

## 6) Troubleshooting
- If CORS appears, confirm you used the **Web app** deployment and `/exec` URL.
- Re-deploy Apps Script after any script changes.
