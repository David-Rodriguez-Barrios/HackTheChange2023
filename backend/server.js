// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const geocodeRoutes = require('./routes/geocode');
const userRoutes = require('./routes/users');
const listings = require("./routes/listings")

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/geocode', geocodeRoutes);
app.use('/api/users', userRoutes);
app.use("/api/listings",listings);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
