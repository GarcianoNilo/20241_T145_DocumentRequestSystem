const express = require('express');
const connectDB = require('./config/db');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors'); // Import cors

// Import Routes
const document = require('./routes/document');
const user = require('./routes/users');
const admin = require('./routes/admin');
const loginRoutes = require('./routes/login');

// Import Middleware
const { ensureAuthenticated, ensureAdmin } = require('./middleware/authMiddleware');

const app = express();
connectDB();
require('dotenv').config();

// CORS configuration to allow frontend access
const corsOptions = {
    origin: 'http://localhost:3000', // Frontend URL (adjust if different)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Allow necessary HTTP methods
    credentials: true // Allow cookies and session sharing across domains
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(session({ secret: 'SECRET', resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// Use Routes
app.use('/login', loginRoutes);
app.use('/users', user);
app.use('/documents', document);
app.use('/admin', ensureAuthenticated, ensureAdmin, admin); // Admin route with authentication and admin middleware

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
