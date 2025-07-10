const express = require('express');
const path = require('path');
const cors = require('cors');

// Firebase Admin SDK (optional - for server-side operations)
// const admin = require('firebase-admin');
// const serviceAccount = require('./serviceAccount.json');

// Initialize Firebase Admin (uncomment when serviceAccount.json is configured)
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: 'your-project-id.appspot.com'
// });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Serve static files from public directory
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/form', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

// API endpoint to get Thomas's information
app.get('/api/thomas', (req, res) => {
    try {
        const thomasData = require('./coolshi.json');
        res.json(thomasData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load Thomas data' });
    }
});

// Optional: API endpoint to get responses (requires Firebase Admin)
// app.get('/api/responses', async (req, res) => {
//     try {
//         const db = admin.firestore();
//         const snapshot = await db.collection('responses').orderBy('timestamp', 'desc').get();
//         const responses = [];
//         snapshot.forEach(doc => {
//             responses.push({ id: doc.id, ...doc.data() });
//         });
//         res.json(responses);
//     } catch (error) {
//         console.error('Error fetching responses:', error);
//         res.status(500).json({ error: 'Failed to fetch responses' });
//     }
// });

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Form available at http://localhost:${PORT}/form`);
    console.log(`💖 Thank You Thomas page at http://localhost:${PORT}`);
});

module.exports = app;