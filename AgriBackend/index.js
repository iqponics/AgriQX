require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const initializeSocket = require("./src/sockets");
const passport = require("passport");
require("./src/config/passport");

const app = express();
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Define allowed origins – driven by environment variables.
// Set CLIENT_URL (and optionally CLIENT_URL_2) in your Render dashboard.
const allowedOrigins = ["http://localhost:5173"];

if (process.env.CLIENT_URL) allowedOrigins.push(process.env.CLIENT_URL);
if (process.env.CLIENT_URL_2) allowedOrigins.push(process.env.CLIENT_URL_2);

// Initialize Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST"]
  }
});

// Initialize socket handlers
initializeSocket(io);

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
}));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));
app.use(helmet());
app.use(cookieParser());
app.use(passport.initialize());

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log("MongoDB connection error:", err));

// Root Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to AstroBackend API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      posts: '/api/posts',
      conversation: '/api/conversation',
      message: '/api/message',
      call: '/api/call',
      upload: '/api/upload',
      files: '/api/files'
    }
  });
});

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    socket: {
      connected: io.engine.clientsCount
    }
  });
});

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/posts', require('./src/routes/posts'));
app.use('/api/conversation', require('./src/routes/conversation'));
app.use('/api/message', require('./src/routes/message'));
app.use('/api/call', require('./src/routes/call'));
app.use('/api/upload', require('./src/routes/upload'));
app.use('/api/files', require('./src/routes/files'));
app.use('/api/admin', require('./src/routes/admin'));
app.use('/api/astrologerForm', require('./src/routes/astrologerForm'));
app.use('/api/payment', require('./src/routes/payment'));
app.use('/api/products', require('./src/routes/productRoutes'));

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Socket.IO enabled on port ${PORT}`);
});
