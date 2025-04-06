const books = [
  { title: 'JavaScript: The Good Parts', author: 'Douglas Crockford' },
  { title: 'Clean Code', author: 'Robert C. Martin' },
  { title: 'Python Crash Course', author: 'Eric Matthes' },
  { title: 'The Pragmatic Programmer', author: 'Andy Hunt & Dave Thomas' },
];

const bookList = document.getElementById('bookList');

books.forEach((book, index) => {
  const li = document.createElement('li');
  li.className = 'book-item';

  li.innerHTML = `
    <div>
      <strong>${book.title}</strong><br />
      <small><em>${book.author}</em></small>
    </div>
    <div>
      <input type="date" id="date-${index}">
      <button id="btn-${index}" onclick="markTaken(${index})">Mark as Taken</button>
    </div>
  `;

  bookList.appendChild(li);
});

function markTaken(index) {
  const dateInput = document.getElementById(`date-${index}`);
  const button = document.getElementById(`btn-${index}`);

  if (!dateInput.value) {
    alert("Please select a date.");
    return;
  }

  const takenDate = new Date(dateInput.value);
  const dueDate = new Date(takenDate);
  dueDate.setDate(dueDate.getDate() + 7);

  const fineRecords = JSON.parse(localStorage.getItem("fineRecords")) || [];

  fineRecords.push({
    bookName: books[index].title,
    takenDate: takenDate.toDateString(),
    dueDate: dueDate.toDateString(),
    returnedDate: "Not yet returned",
    fineAmount: 0,
    paid: false
  });

  localStorage.setItem("fineRecords", JSON.stringify(fineRecords));

  alert(`📘 Book taken on ${takenDate.toDateString()}.\n📅 Return by: ${dueDate.toDateString()}`);

  button.textContent = "Taken";
  button.disabled = true;
  button.classList.add("taken");

  setTimeout(() => {
    alert(`⏰ Reminder: Return "${books[index].title}" today!`);
  }, 5000); // Fast testing reminder
}

// Dark/Light mode toggle
const toggleBtn = document.getElementById('modeToggle');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  toggleBtn.textContent = document.body.classList.contains('dark-mode') ? '☀️ Light Mode' : '🌙 Dark Mode';
});

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
  // Show confirmation dialog
  if (confirm('Are you sure you want to logout?')) {
    // Redirect to login page
    window.location.href = 'login.html';
  }
});

