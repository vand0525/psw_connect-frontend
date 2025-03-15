const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the Frontend directory
app.use(express.static(path.join(__dirname)));

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Route for sign-in page
app.get('/sign-in', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'sign-in.html'));
});

// Client routes
app.get('/client/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'client', 'dashboard.html'));
});

app.get('/client/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'client', 'profile.html'));
});

app.get('/client/create-task', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'client', 'create-task.html'));
});

// PSW routes
app.get('/psw/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'psw', 'dashboard.html'));
});

app.get('/psw/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'psw', 'profile.html'));
});

app.get('/psw/browse-tasks', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'psw', 'browse-tasks.html'));
});

// Handle 404s
app.use((req, res) => {
  res.status(404).send('Page not found');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
