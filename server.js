const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const cors = require('cors'); // Import CORS
const authRoutes = require('./routes/authRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const searchRoutes = require('./routes/searchRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const path = require('path'); // Import path module for handling file paths


require('dotenv').config();

const app = express();
const PORT = process.env.PORT ||4000;

// Middleware
app.use(express.json());
// Middleware to serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Enable CORS for all routes
// const front='http://localhost:3000'
app.use(
  cors({
    origin: '*' , // Allow frontend origin (adjust if needed)
    credentials: true, // Allow credentials (cookies) to be sent
  })
);
app.options('*', cors());
// Cookie session configuration
app.use(
  cookieSession({
    name: 'session',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    keys: [process.env.COOKIE_KEY || 'fallback_default_key'], // Default key fallback
  })
);

// MongoDB Connection
const mongoURI = process.env.mongoURI|| 'mongodb+srv://MedWeb:Medweb1234@cluster0.owz4x.mongodb.net/MedWeb'; // Local MongoDB URI

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// API Routes
app.use('/auth', authRoutes);
app.use('/pharmacies', pharmacyRoutes);
app.use('/search', searchRoutes);
app.use('/medicines', medicineRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
