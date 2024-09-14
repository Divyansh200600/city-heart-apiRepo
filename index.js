const express = require('express');
const app = express();
const port = 5000;
const axios = require('axios');
const crypto = require('crypto');

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

// New route to generate a payment URL
app.post('/api/generate-payment-url', async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        // Prepare the payload
        const payload = {
            amount: amount * 100, // convert to cents
            // Include other necessary parameters here
        };

        const payloadString = JSON.stringify(payload);
        const payloadBase64 = Buffer.from(payloadString).toString('base64');
        const salt_key = 'Ya70515c2-0e9e-4014-8459-87959a299dbd'; // Replace with your actual salt key
        const keyIndex = 1;
        const checksumString = payloadBase64 + '/pg/v1/pay' + salt_key;
        const checksum = crypto.createHash('sha256').update(checksumString).digest('hex') + '###' + keyIndex;

        // Make request to PulseZest API
        const response = await axios.post('https://pulsezest.com/client-pay', {
            request: payloadBase64
        }, {
            headers: {
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            }
        });

        if (response.data && response.data.redirectUrl) {
            res.json({
                redirectUrl: response.data.redirectUrl
            });
        } else {
            res.status(500).json({ message: 'Invalid response from payment gateway' });
        }
    } catch (error) {
        console.error('Error generating payment URL:', error); // Log the error for debugging
        res.status(500).json({ message: 'Payment request failed', error: error.message });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
