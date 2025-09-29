const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files from dist directory (Vite builds to 'dist')
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React Router - serve index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, '0.0.0.0', () => {
    // PERBAIKAN: Menggunakan template literal (backtick `) untuk variabel
    console.log(`ETH Analyzer Frontend running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});