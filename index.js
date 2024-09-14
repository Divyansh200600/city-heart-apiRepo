const express = require('express');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

let data = [];
let recentData = null; // Variable to store the most recent data

app.get('/data', (req, res) => {
    res.json(data);
});

app.get('/data/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const item = data.find(d => d.id === id);

    if (item) {
        recentData = item; // Update recentData with the fetched item
        res.json(item);
    } else {
        res.status(404).json({ message: 'Data not found' });
    }
});

// Route to add new data
app.post('/data', (req, res) => {
    const newItem = req.body;

    // Ensure that each item has an 'id' and 'name'
    if (newItem.id && newItem.name) {
        data.push(newItem);
        recentData = newItem; // Update recentData with the newly added item
        res.status(201).json(newItem);
    } else {
        res.status(400).json({ message: 'Invalid data' });
    }
});

// Root route to show the most recent data
app.get('/', (req, res) => {
    if (recentData) {
        res.json({
            message: 'Welcome to the City Heart API!',
            recentData: recentData
        });
    } else {
        res.send('Welcome to the City Heart API! No recent data available.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
