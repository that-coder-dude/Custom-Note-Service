const apiUrl = 'http://localhost:5000/auth';
const notesApiUrl = 'http://localhost:5000/notes';

// Handling Registration
document.getElementById('registerFormHandler').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('newUsername').value;
  const password = document.getElementById('newPassword').value;
  const registerError = document.getElementById('registerError'); // Error message div

  try {
    const response = await fetch(`${apiUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      alert('Registration successful');
      document.getElementById('registerFormHandler').reset(); // Reset form
      showNotesPage();
    } else {
      registerError.innerHTML = `Registration failed: ${data.error || 'Unknown error'}`;
    }
  } catch (error) {
    console.error('Error in registration:', error);
    registerError.innerHTML = 'Something went wrong!';
  }
});

// Handle Login
document.getElementById('loginFormHandler').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginError = document.getElementById('loginError'); // Error message div

  try {
    const response = await fetch(`${apiUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.token);
      alert('Login successful');
      document.getElementById('loginFormHandler').reset(); // Reset form
      showNotesPage();
    } else {
      loginError.innerHTML = `Login failed: ${data.error || 'Invalid credentials'}`;
    }
  } catch (error) {
    console.error('Error in login:', error);
    loginError.innerHTML = 'Something went wrong!';
  }
});

// Showing Notes Page
function showNotesPage() {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('notesList').style.display = 'block';

  fetchNotes();
}

// Fetching Notes
async function fetchNotes() {
  const token = localStorage.getItem('token');
  const notesList = document.getElementById('notes');
  notesList.innerHTML = ''; // Clearing notes before fetching new ones

  try {
    const response = await fetch(notesApiUrl, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }

    const notes = await response.json();
    notes.forEach(note => {
      const noteDiv = document.createElement('div');
      noteDiv.classList.add('note');
      noteDiv.innerHTML = `<h3>${note.title}</h3><p>${note.content}</p>`;
      notesList.appendChild(noteDiv);
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    notesList.innerHTML = '<p>Failed to load notes. Please try again later.</p>';
  }
}

// Creating Note
document.getElementById('createNoteForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const token = localStorage.getItem('token');

  try {
    const response = await fetch(notesApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ title, content }),
    });

    if (response.ok) {
      fetchNotes(); // Refreshing notes list
    } else {
      alert('Failed to create note');
    }
  } catch (error) {
    console.error('Error creating note:', error);
    alert('Something went wrong while creating the note');
  }
});

// Toggle between Register/Login
document.getElementById('showLogin').addEventListener('click', () => {
  document.getElementById('registerForm').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
});

document.getElementById('showRegister').addEventListener('click', () => {
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  document.getElementById('notesList').style.display = 'none';
  document.getElementById('loginForm').style.display = 'block';
});
