function displayFines() {
  const fineContainer = document.getElementById("fineContainer");
  const fineRecords = JSON.parse(localStorage.getItem("fineRecords")) || [];

  fineContainer.innerHTML = "";

  if (fineRecords.length === 0) {
    fineContainer.innerHTML = "<p>No fine records available.</p>";
    return;
  }

  const updatedFines = fineRecords.map((fine, index) => {
    if (!fine.paid) {
      const today = new Date();
      const dueDate = new Date(fine.dueDate);
      const diffTime = today - dueDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        fine.fineAmount = diffDays * 10; // ₹10 per day
        fine.returnedDate = today.toDateString();
      } else {
        fine.fineAmount = 0;
        fine.returnedDate = "Not yet returned";
      }
    }
    return fine;
  });

  localStorage.setItem("fineRecords", JSON.stringify(updatedFines));

  updatedFines.forEach((fine, index) => {
    const fineEl = document.createElement("div");
    fineEl.className = "fine-record";
    fineEl.innerHTML = `
      <p><strong>📘 Book:</strong> ${fine.bookName}</p>
      <p>📅 Taken: ${fine.takenDate} | Due: ${fine.dueDate} | Returned: ${fine.returnedDate}</p>
      <p>💰 Fine: ₹${fine.fineAmount}</p>
      <p>Status: ${fine.paid ? '✅ Paid' : '❌ Unpaid'}</p>
      ${fine.paid ? '' : `<button onclick="payFine(${index})">💳 Pay Fine</button>`}
    `;
    fineContainer.appendChild(fineEl);
  });
}

function clearFines() {
  const confirmClear = confirm("Are you sure you want to clear all fine history?");
  if (confirmClear) {
    localStorage.removeItem("fineRecords");
    displayFines();
  }
}

function payFine(index) {
  const fineRecords = JSON.parse(localStorage.getItem("fineRecords")) || [];

  const confirmed = confirm(`Pay ₹${fineRecords[index].fineAmount} for "${fineRecords[index].bookName}"?`);
  if (confirmed) {
    fineRecords[index].paid = true;
    localStorage.setItem("fineRecords", JSON.stringify(fineRecords));
    alert("✅ Payment successful!");
    displayFines();
  }
}

window.onload = displayFines;

