// const express = require('express');
// const cors = require('cors');

// const app = express();
// const port = 3000;
// const HOSTNAME = '127.0.0.1';

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// let projectData = {};

// app.use(express.static('website'));

// app.get('/all', (req, res) => {
//   res.json(projectData);
// });

// app.post('/add', (req, res) => {
//   const { temperature, date, userResponse } = req.body;
//   projectData = { temperature, date, userResponse };
//   res.json(projectData);
// });

// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('Something went wrong!');
// });
// app.listen(port, HOSTNAME, () => {
//   console.log(`Server running at http://${HOSTNAME}:${port}/`);
// });
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000; // Allow dynamic port assignment
const HOSTNAME = process.env.HOSTNAME || '127.0.0.1';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let projectData = {};

// Serve static files from the "website" directory
app.use(express.static('website'));

// GET route to retrieve projectData
app.get('/all', (req, res) => {
  try {
    res.status(200).json(projectData);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Failed to retrieve data.');
  }
});

// POST route to update projectData
app.post('/add', (req, res) => {
  try {
    const { date, city, temp, description, feelings } = req.body;
    if (!date || !city || !temp || !description || !feelings) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    projectData = { date, city, temp, description, feelings };
    res.status(201).json(projectData);
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Failed to save data.');
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(PORT, HOSTNAME, () => {
  console.log(`Server running at http://${HOSTNAME}:${PORT}/`);
});
