import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import pkg from 'pg';
const { Pool } = pkg;

// --- PostgreSQL connection ---
const pool = new Pool({
  user: 'postgres', // change as needed
  host: 'localhost',
  database: 'rideeasy', // change as needed
  password: 'yourpassword', // change as needed
  port: 5432,
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// --- Notification API ---
app.get('/notifications/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM notifications WHERE user_id = $1 OR user_type = $2 ORDER BY timestamp DESC',
      [userId, userId === 'admin' ? 'admin' : 'user']
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/notifications', async (req, res) => {
  const { user_id, user_type, type, message, status } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO notifications (user_id, user_type, type, message, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, user_type, type, message, status || 'info']
    );
    const notification = result.rows[0];
    io.emit('notification', notification); // Real-time push
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/notifications/mark-read', async (req, res) => {
  const { notification_id } = req.body;
  try {
    await pool.query('UPDATE notifications SET is_read = TRUE WHERE id = $1', [notification_id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- Socket.IO connection ---
io.on('connection', (socket) => {
  console.log('A client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Notification server running on port ${PORT}`);
}); 