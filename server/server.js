const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

// MySQL connection (credentials are loaded from .env file)
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('❌ Could not connect to database:', err.message);
  } else {
    console.log('✅ Connected to MySQL (demo mode)');
  }
});

// Utility function for queries
const runQuery = (sql, params, res) => {
  db.query(sql, params, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
};

/* ======================
   FACILITY TABLE CRUD
   ====================== */
app.get('/facilities', (req, res) => runQuery('SELECT * FROM FACILITY', [], res));
app.post('/facilities', (req, res) => runQuery('INSERT INTO FACILITY SET ?', req.body, res));
app.put('/facilities/:id', (req, res) => runQuery('UPDATE FACILITY SET ? WHERE FACILITY_ID = ?', [req.body, req.params.id], res));
app.delete('/facilities/:id', (req, res) => runQuery('DELETE FROM FACILITY WHERE FACILITY_ID = ?', [req.params.id], res));

/* ======================
   BOOKING TABLE CRUD
   ====================== */
app.get('/bookings', (req, res) => runQuery('SELECT * FROM BOOKING', [], res));
app.post('/bookings', (req, res) => runQuery('INSERT INTO BOOKING SET ?', req.body, res));
app.put('/bookings/:id', (req, res) => runQuery('UPDATE BOOKING SET ? WHERE BOOKING_ID = ?', [req.body, req.params.id], res));
app.delete('/bookings/:id', (req, res) => runQuery('DELETE FROM BOOKING WHERE BOOKING_ID = ?', [req.params.id], res));

/* ======================
   INDOOR_SPORT TABLE CRUD
   ====================== */
app.get('/indoor-sports', (req, res) => runQuery('SELECT * FROM INDOOR_SPORT', [], res));
app.post('/indoor-sports', (req, res) => runQuery('INSERT INTO INDOOR_SPORT SET ?', req.body, res));
app.put('/indoor-sports/:id', (req, res) => runQuery('UPDATE INDOOR_SPORT SET ? WHERE INDOOR_SPORT_ID = ?', [req.body, req.params.id], res));
app.delete('/indoor-sports/:id', (req, res) => runQuery('DELETE FROM INDOOR_SPORT WHERE INDOOR_SPORT_ID = ?', [req.params.id], res));

/* ======================
   OUTDOOR_SPORT TABLE CRUD
   ====================== */
app.get('/outdoor-sports', (req, res) => runQuery('SELECT * FROM OUTDOOR_SPORT', [], res));
app.post('/outdoor-sports', (req, res) => runQuery('INSERT INTO OUTDOOR_SPORT SET ?', req.body, res));
app.put('/outdoor-sports/:id', (req, res) => runQuery('UPDATE OUTDOOR_SPORT SET ? WHERE OUTDOOR_SPORT_ID = ?', [req.body, req.params.id], res));
app.delete('/outdoor-sports/:id', (req, res) => runQuery('DELETE FROM OUTDOOR_SPORT WHERE OUTDOOR_SPORT_ID = ?', [req.params.id], res));

/* ======================
   OWNER TABLE CRUD
   ====================== */
app.get('/owners', (req, res) => runQuery('SELECT * FROM OWNER', [], res));
app.post('/owners', (req, res) => runQuery('INSERT INTO OWNER SET ?', req.body, res));
app.put('/owners/:id', (req, res) => runQuery('UPDATE OWNER SET ? WHERE OWNER_ID = ?', [req.body, req.params.id], res));
app.delete('/owners/:id', (req, res) => runQuery('DELETE FROM OWNER WHERE OWNER_ID = ?', [req.params.id], res));

/* ======================
   REVIEW TABLE CRUD
   ====================== */
app.get('/reviews', (req, res) => runQuery('SELECT * FROM REVIEW', [], res));
app.post('/reviews', (req, res) => runQuery('INSERT INTO REVIEW SET ?', req.body, res));
app.put('/reviews/:id', (req, res) => runQuery('UPDATE REVIEW SET ? WHERE REVIEW_ID = ?', [req.body, req.params.id], res));
app.delete('/reviews/:id', (req, res) => runQuery('DELETE FROM REVIEW WHERE REVIEW_ID = ?', [req.params.id], res));

/* ======================
   USER TABLE CRUD
   ====================== */
app.get('/users', (req, res) => runQuery('SELECT * FROM USER', [], res));
app.post('/users', (req, res) => runQuery('INSERT INTO USER SET ?', req.body, res));
app.put('/users/:id', (req, res) => runQuery('UPDATE USER SET ? WHERE USER_ID = ?', [req.body, req.params.id], res));
app.delete('/users/:id', (req, res) => runQuery('DELETE FROM USER WHERE USER_ID = ?', [req.params.id], res));

/* ======================
   HISTORY TABLE CRUD
   ====================== */
app.get('/history', (req, res) => runQuery('SELECT * FROM HISTORY', [], res));
app.post('/history', (req, res) => runQuery('INSERT INTO HISTORY SET ?', req.body, res));
app.put('/history/:id', (req, res) => runQuery('UPDATE HISTORY SET ? WHERE HISTORY_ID = ?', [req.body, req.params.id], res));
app.delete('/history/:id', (req, res) => runQuery('DELETE FROM HISTORY WHERE HISTORY_ID = ?', [req.params.id], res));

/* ======================
   START SERVER
   ====================== */
app.listen(3000, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
