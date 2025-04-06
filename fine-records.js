// Get references to DOM elements
const totalBooksEl = document.getElementById('totalBooks');
const overdueBooksEl = document.getElementById('overdueBooks');
const totalFineEl = document.getElementById('totalFine');
const fineTableBody = document.getElementById('fineTableBody');
const clearFinesBtn = document.getElementById('clearFines');

// Function to update statistics
function updateStats() {
  const fineRecords = JSON.parse(localStorage.getItem('fineRecords')) || [];
  
  // Calculate total books
  const totalBooks = fineRecords.length;
  totalBooksEl.textContent = totalBooks;

  // Calculate overdue books
  const overdueBooks = fineRecords.filter(record => {
    const dueDate = new Date(record.dueDate);
    const today = new Date();
    return dueDate < today && !record.paid;
  }).length;
  overdueBooksEl.textContent = overdueBooks;

  // Calculate total fine
  const totalFine = fineRecords.reduce((sum, record) => {
    if (!record.paid) {
      const dueDate = new Date(record.dueDate);
      const today = new Date();
      const daysLate = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));
      return sum + (daysLate * 10); // ₹10 per day
    }
    return sum;
  }, 0);
  totalFineEl.textContent = `₹${totalFine}`;
}

// Function to display fine records in the table
function displayFineRecords() {
  const fineRecords = JSON.parse(localStorage.getItem('fineRecords')) || [];
  fineTableBody.innerHTML = '';

  fineRecords.forEach((record, index) => {
    const dueDate = new Date(record.dueDate);
    const today = new Date();
    const daysLate = Math.max(0, Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)));
    const fineAmount = daysLate * 10; // ₹10 per day

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${record.bookName}</td>
      <td>${new Date(record.takenDate).toLocaleDateString()}</td>
      <td>${daysLate}</td>
      <td>₹${fineAmount}</td>
      <td>
        ${!record.paid ? `
          <button class="pay-btn" onclick="payFine(${index})">
            <i class="fas fa-money-bill-wave"></i> Pay
          </button>
        ` : `
          <span class="paid-badge">
            <i class="fas fa-check-circle"></i> Paid
          </span>
        `}
      </td>
    `;
    fineTableBody.appendChild(row);
  });
}

// Function to handle fine payment
function payFine(index) {
  const fineRecords = JSON.parse(localStorage.getItem('fineRecords')) || [];
  const record = fineRecords[index];
  
  if (confirm(`Are you sure you want to pay ₹${record.fineAmount} for "${record.bookName}"?`)) {
    fineRecords[index].paid = true;
    localStorage.setItem('fineRecords', JSON.stringify(fineRecords));
    displayFineRecords();
    updateStats();
    alert('Payment successful!');
  }
}

// Function to clear all fine records
function clearFineHistory() {
  if (confirm('Are you sure you want to clear all fine history? This action cannot be undone.')) {
    localStorage.removeItem('fineRecords');
    displayFineRecords();
    updateStats();
    alert('Fine history cleared successfully!');
  }
}

// Event Listeners
clearFinesBtn.addEventListener('click', clearFineHistory);

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  displayFineRecords();
  updateStats();
});

