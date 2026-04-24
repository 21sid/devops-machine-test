require('dotenv').config();
const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// FIX: connectionLimit increased from 2 to 10.
// With 5+ pods, each pod creates its own pool. A limit of 2 caused
// connection exhaustion under concurrent load, resulting in 500 errors.
// 10 connections per pod provides sufficient headroom for concurrent requests.
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10, // fixed: was 2, increased to 10 for multi-pod deployment
  waitForConnections: true,
  queueLimit: 0
});

const promisePool = pool.promise();
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:4001';

async function verifyToken(req) {
  const token = req.headers.authorization;
  if (!token) throw new Error('No token');
  const response = await axios.get(`${AUTH_SERVICE_URL}/auth/verify`, {
    headers: { authorization: token }
  });
  return response.data.user;
}

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'order-service', version: '1.0.0' });
});

app.post('/orders', async (req, res) => {
  try {
    const user = await verifyToken(req);
    const { item, quantity, price } = req.body;
    const [result] = await promisePool.query(
      'INSERT INTO orders (user_id, item, quantity, price, status) VALUES (?, ?, ?, ?, ?)',
      [user.userId, item, quantity, price, 'pending']
    );
    res.status(201).json({ orderId: result.insertId, status: 'pending' });
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.get('/orders', async (req, res) => {
  try {
    const user = await verifyToken(req);
    const [rows] = await promisePool.query(
      'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      [user.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.get('/orders/:id', async (req, res) => {
  try {
    const user = await verifyToken(req);
    const [rows] = await promisePool.query(
      'SELECT * FROM orders WHERE id = ? AND user_id = ?',
      [req.params.id, user.userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => console.log(`order-service running on port ${PORT}`));
