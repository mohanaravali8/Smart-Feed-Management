const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 5000;   // Only ONE PORT declaration

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Connect SQLite Database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.log(err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// Create Tables
db.serialize(() => {

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT,
            password TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS feed_data (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fish_type TEXT,
            quantity INTEGER,
            feed_amount REAL
        )
    `);

    db.run(`
        INSERT OR IGNORE INTO users (id, username, password)
        VALUES (1, 'admin', 'admin123')
    `);

});

// Login API
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [username, password],
        (err, row) => {
            if (err) {
                res.json({ success: false, message: err.message });
            } else if (row) {
                res.json({ success: true, message: 'Login successful' });
            } else {
                res.json({ success: false, message: 'Invalid username or password' });
            }
        }
    );
});

// Registration API
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password],
        function (err) {
            if (err) {
                res.json({ success: false, message: err.message });
            } else {
                res.json({ success: true, message: 'Registration successful' });
            }
        }
    );
});

// Save Feed Data API
app.post('/feed', (req, res) => {
    const { fish_type, quantity, feed_amount } = req.body;

    db.run(
        'INSERT INTO feed_data (fish_type, quantity, feed_amount) VALUES (?, ?, ?)',
        [fish_type, quantity, feed_amount],
        function (err) {
            if (err) {
                res.json({ success: false, message: err.message });
            } else {
                res.json({ success: true, message: 'Feed data saved successfully' });
            }
        }
    );
});

// Get Feed Data API
app.get('/feed-data', (req, res) => {
    db.all('SELECT * FROM feed_data', [], (err, rows) => {
        if (err) {
            res.json({ success: false, message: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});