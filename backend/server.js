require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

/* =======================
   MIDDLEWARE
======================= */
app.use(cors({
  origin: 'http://localhost:3000', // React frontend
  credentials: true
}));
app.use(express.json());

/* =======================
   HEALTH CHECK
======================= */
app.get('/', (req, res) => {
  res.status(200).send('Backend is running successfully 🚀');
});

/* =======================
   START SERVER
======================= */
const startServer = async () => {
  try {
    await connectDB();

    // Routes
    app.use('/api/auth', require('./routes/authRoutes'));
    app.use('/api/appointments', require('./routes/appointmentRoutes'));

    // Dev-only seed route
    if (process.env.NODE_ENV !== 'production') {
      app.use('/api/seed', require('./routes/seedRoutes'));
    }

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('❌ Server failed to start:', error.message);
    process.exit(1);
  }
};

startServer();
