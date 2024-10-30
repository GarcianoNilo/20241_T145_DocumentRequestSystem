const express = require('express');
const connectDB = require('./config/db');
require('dotenv').config();

connectDB();
// Import Routes
const document = require('./routes/document');
// const login = require('./routes/login');
const user = require('./routes/users');
// const admin = require('./routes/admin');
// const history = require('./routes/history');

const app = express();

// Import Middleware
//const { ensureAuthenticated, ensureAdmin, ensureUser } = require('./middleware/authMiddleware');

// Middleware
app.use(express.json());

// Use Routes with middleware
app.use('/documents', document);
// app.use('/login', login);
app.use('/users', user);
//app.use('/user', ensureAuthenticated, ensureUser, user);  // Only accessible to authenticated users with 'user' role
// app.use('/admin', ensureAuthenticated, ensureAdmin, admin);  // Only accessible to authenticated users with 'admin' role
// app.use('/history', history);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
