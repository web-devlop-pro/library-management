
// Theme toggle
document.getElementById("themeToggle").addEventListener("click", () => {
  const html = document.documentElement;
  const newTheme = html.getAttribute("data-theme") === "light" ? "dark" : "light";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

// Apply saved theme
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const fineRecords = JSON.parse(localStorage.getItem("fineRecords")) || [];
  const latestPaid = fineRecords.reverse().find(f => f.paid);

  if (latestPaid) {
    document.getElementById("bookName").textContent = latestPaid.bookName || "N/A";
    document.getElementById("takenDate").textContent = latestPaid.takenDate || "-";
    document.getElementById("returnedDate").textContent = latestPaid.returnedDate || "-";
    document.getElementById("fineAmount").textContent = latestPaid.fineAmount || "0";
    document.getElementById("paymentDate").textContent = new Date().toLocaleDateString();
  } else {
    document.getElementById("receiptContent").innerHTML = "<p>No paid fine record found.</p>";
  }
});

// Download PDF
function downloadPDF() {
  const element = document.getElementById("receiptContent");
  const opt = {
    margin:       0.5,
    filename:     `Fine_Receipt_${new Date().toISOString().split("T")[0]}.pdf`,
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
  };
  html2pdf().from(element).set(opt).save();
}
