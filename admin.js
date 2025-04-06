const ADMIN_PASSWORD = "admin123";

// DOM Elements
const modeToggle = document.getElementById('modeToggle');
const logoutBtn = document.getElementById('logoutBtn');
const addBookForm = document.getElementById('addBookForm');
const addUserForm = document.getElementById('addUserForm');
const bookForm = document.getElementById('bookForm');
const userForm = document.getElementById('userForm');

// Statistics Elements
const totalUsersEl = document.getElementById('totalUsers');
const totalBooksEl = document.getElementById('totalBooks');
const overdueBooksEl = document.getElementById('overdueBooks');

function checkAccess() {
  document.getElementById("adminPanel").style.display = "none";
  document.getElementById("loginPrompt").style.display = "block";
}

function verifyPassword() {
  const input = document.getElementById("adminPass").value;
  if (input === ADMIN_PASSWORD) {
    document.getElementById("loginPrompt").style.display = "none";
    document.getElementById("adminPanel").style.display = "block";
    loadBooks();
    loadStats();
  } else {
    alert("Incorrect password!");
  }
}

function loadBooks() {
  const bookList = JSON.parse(localStorage.getItem("books")) || [];
  const container = document.getElementById("bookList");
  container.innerHTML = "";

  bookList.forEach((book, index) => {
    const div = document.createElement("div");
    div.className = "book-item";
    div.innerHTML = `<strong>${book.name}</strong> by ${book.author} 
      <button onclick="deleteBook(${index})">🗑️ Delete</button>`;
    container.appendChild(div);
  });
}

function addBook() {
  const name = document.getElementById("bookName").value.trim();
  const author = document.getElementById("authorName").value.trim();
  if (!name || !author) return alert("Please enter book name and author.");

  const books = JSON.parse(localStorage.getItem("books")) || [];
  books.push({ name, author });
  localStorage.setItem("books", JSON.stringify(books));

  document.getElementById("bookName").value = "";
  document.getElementById("authorName").value = "";
  loadBooks();
  loadStats();
}

function deleteBook(index) {
  const books = JSON.parse(localStorage.getItem("books"));
  books.splice(index, 1);
  localStorage.setItem("books", JSON.stringify(books));
  loadBooks();
  loadStats();
}

function resetBooks() {
  if (confirm("Are you sure you want to delete all books?")) {
    localStorage.removeItem("books");
    loadBooks();
    loadStats();
  }
}

function resetFines() {
  if (confirm("Are you sure you want to reset all fine records?")) {
    localStorage.removeItem("fineRecords");
    loadStats();
  }
}

function loadStats() {
  const books = JSON.parse(localStorage.getItem("books")) || [];
  const fines = JSON.parse(localStorage.getItem("fineRecords")) || [];
  let totalFine = 0;
  fines.forEach(f => totalFine += f.fineAmount);
  document.getElementById("totalBooks").innerText = books.length;
  document.getElementById("totalFines").innerText = totalFine;
}

function exportData() {
  const books = localStorage.getItem("books");
  const fines = localStorage.getItem("fineRecords");
  const data = {
    books: JSON.parse(books) || [],
    fineRecords: JSON.parse(fines) || []
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "library-data.json";
  link.click();
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const result = JSON.parse(e.target.result);
    if (result.books) localStorage.setItem("books", JSON.stringify(result.books));
    if (result.fineRecords) localStorage.setItem("fineRecords", JSON.stringify(result.fineRecords));
    alert("Data imported successfully!");
    loadBooks();
    loadStats();
  };
  reader.readAsText(file);
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  updateStats();
  setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
  // Dark mode toggle
  modeToggle.addEventListener('click', toggleDarkMode);
  
  // Logout button
  logoutBtn.addEventListener('click', handleLogout);
  
  // Form submissions
  bookForm.addEventListener('submit', handleAddBook);
  userForm.addEventListener('submit', handleAddUser);
}

// Update statistics
function updateStats() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const books = JSON.parse(localStorage.getItem('books')) || [];
  const fineRecords = JSON.parse(localStorage.getItem('fineRecords')) || [];

  // Update total users
  totalUsersEl.textContent = users.length;

  // Update total books
  totalBooksEl.textContent = books.length;

  // Update overdue books
  const overdueBooks = fineRecords.filter(record => {
    const dueDate = new Date(record.dueDate);
    const today = new Date();
    return dueDate < today && !record.paid;
  }).length;
  overdueBooksEl.textContent = overdueBooks;
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  modeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  localStorage.setItem('darkMode', isDarkMode);
}

// Handle logout
function handleLogout() {
  if (confirm('Are you sure you want to logout?')) {
    localStorage.removeItem('adminLoggedIn');
    window.location.href = 'login.html';
  }
}

// Show add book form
function showAddBookForm() {
  addBookForm.style.display = 'block';
}

// Hide add book form
function hideAddBookForm() {
  addBookForm.style.display = 'none';
  bookForm.reset();
}

// Show add user form
function showAddUserForm() {
  addUserForm.style.display = 'block';
}

// Hide add user form
function hideAddUserForm() {
  addUserForm.style.display = 'none';
  userForm.reset();
}

// Handle add book
function handleAddBook(e) {
  e.preventDefault();
  
  const bookName = document.getElementById('bookName').value;
  const author = document.getElementById('author').value;
  const quantity = parseInt(document.getElementById('quantity').value);

  const books = JSON.parse(localStorage.getItem('books')) || [];
  
  // Check if book already exists
  const existingBook = books.find(book => 
    book.name.toLowerCase() === bookName.toLowerCase() && 
    book.author.toLowerCase() === author.toLowerCase()
  );

  if (existingBook) {
    existingBook.quantity += quantity;
    alert('Book quantity updated successfully!');
  } else {
    books.push({
      id: Date.now(),
      name: bookName,
      author: author,
      quantity: quantity,
      available: quantity
    });
    alert('New book added successfully!');
  }

  localStorage.setItem('books', JSON.stringify(books));
  hideAddBookForm();
  updateStats();
}

// Handle add user
function handleAddUser(e) {
  e.preventDefault();
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const rollNumber = document.getElementById('rollNumber').value;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Check if user already exists
  if (users.some(user => user.rollNumber === rollNumber)) {
    alert('User with this roll number already exists!');
    return;
  }

  users.push({
    username: username,
    password: password,
    rollNumber: rollNumber,
    books: []
  });

  localStorage.setItem('users', JSON.stringify(users));
  hideAddUserForm();
  updateStats();
  alert('New user added successfully!');
}

// Show book list
function showBookList() {
  const books = JSON.parse(localStorage.getItem('books')) || [];
  
  if (books.length === 0) {
    alert('No books available in the library.');
    return;
  }

  // Create a modal for book list
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2><i class="fas fa-list"></i> Book List</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Book Name</th>
              <th>Author</th>
              <th>Quantity</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${books.map(book => `
              <tr>
                <td>${book.name}</td>
                <td>${book.author}</td>
                <td>${book.quantity}</td>
                <td>${book.available}</td>
                <td>
                  <button class="danger-btn" onclick="deleteBook(${book.id})">
                    <i class="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'block';
}

// Show user list
function showUserList() {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  if (users.length === 0) {
    alert('No users registered in the system.');
    return;
  }

  // Create a modal for user list
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
      <h2><i class="fas fa-users"></i> User List</h2>
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Roll Number</th>
              <th>Books Borrowed</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${users.map(user => `
              <tr>
                <td>${user.username}</td>
                <td>${user.rollNumber}</td>
                <td>${user.books.length}</td>
                <td>
                  <button class="danger-btn" onclick="deleteUser('${user.rollNumber}')">
                    <i class="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  modal.style.display = 'block';
}

// Delete book
function deleteBook(bookId) {
  if (!confirm('Are you sure you want to delete this book?')) return;

  const books = JSON.parse(localStorage.getItem('books')) || [];
  const updatedBooks = books.filter(book => book.id !== bookId);
  
  localStorage.setItem('books', JSON.stringify(updatedBooks));
  updateStats();
  showBookList(); // Refresh the book list
  alert('Book deleted successfully!');
}

// Delete user
function deleteUser(rollNumber) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  const users = JSON.parse(localStorage.getItem('users')) || [];
  const updatedUsers = users.filter(user => user.rollNumber !== rollNumber);
  
  localStorage.setItem('users', JSON.stringify(updatedUsers));
  updateStats();
  showUserList(); // Refresh the user list
  alert('User deleted successfully!');
}

window.onload = () => {
  // Load access check
  checkAccess();

  // Add sample books if none exist
  const books = JSON.parse(localStorage.getItem("books"));
  if (!books || books.length === 0) {
    const sampleBooks = [
      { name: "The Alchemist", author: "Paulo Coelho" },
      { name: "Sapiens", author: "Yuval Noah Harari" },
      { name: "Clean Code", author: "Robert C. Martin" }
    ];
    localStorage.setItem("books", JSON.stringify(sampleBooks));
  }

  // Add sample fine records
  const fines = JSON.parse(localStorage.getItem("fineRecords"));
  if (!fines || fines.length === 0) {
    const demoFines = [
      {
        bookName: "Sapiens",
        takenDate: "2025-03-15",
        dueDate: "2025-03-25",
        returnedDate: "2025-03-30",
        fineAmount: 50
      },
      {
        bookName: "Clean Code",
        takenDate: "2025-03-10",
        dueDate: "2025-03-20",
        returnedDate: "2025-03-29",
        fineAmount: 90
      }
    ];
    localStorage.setItem("fineRecords", JSON.stringify(demoFines));
  }
};
