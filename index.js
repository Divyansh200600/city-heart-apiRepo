const express = require('express');
const app = express();
const port = 5000;

// Middleware to parse JSON bodies
app.use(express.json());

let data = [];
let recentData = null; // Variable to store the most recent data

app.get('/api/get-amount', (req, res) => {
    res.json(data);
});



// Route to add new data
app.post('/api/get-amount', (req, res) => {
    const newItem = req.body;

    // Ensure that each item has an 'id' and 'name'
    if (newItem.amount) {
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
