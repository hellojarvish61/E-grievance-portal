// // Import required packages
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./config/db');

// // Load environment variables from .env file
// dotenv.config();

// // Connect to MongoDB
// connectDB();

// // Initialize Express app
// const app = express();

// // Middleware - functions that run before our routes
// app.use(cors()); // Allows frontend to connect
// app.use(express.json()); // Allows us to read JSON data from requests

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const complaintRoutes = require('./routes/complaintRoutes');
// const userRoutes = require('./routes/userRoutes'); // NEW LINE

// // Use routes
// app.use('/api/auth', authRoutes);
// app.use('/api/complaints', complaintRoutes);
// app.use('/api/users', userRoutes); // NEW LINE
// // app.use("/api/setup", require("./routes/createAdmin")); //http://localhost:5000/api/setup/create-default-admin


// // Test route to check if server is running
// app.get('/', (req, res) => {
//   res.send('E-Grievance API is running...');
// });

// // Define port from .env file or use 5000 as default
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log("Server running"));


// // Start server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });






// Import required packages
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

/* ===============================
   CORS CONFIG (VERY IMPORTANT)
================================ */
app.use(cors({
  origin: "https://e-grievance-portal-iota.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

// Handle preflight requests
app.options("*", cors());

// Body parser
app.use(express.json());

/* ===============================
   ROUTES
================================ */
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/users", userRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("E-Grievance API is running...");
});

/* ===============================
   START SERVER (ONLY ONCE)
================================ */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
