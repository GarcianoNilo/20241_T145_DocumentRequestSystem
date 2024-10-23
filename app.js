const express = require('express');
const app = express();
const PORT = 3000;

// Import Routes
const document = require('./routes/document');
const login = require('./routes/login');
const user = require('./routes/user');
const admin = require('./routes/admin');
const history = require('./routes/history');

// Import Middleware
const { ensureAuthenticated, ensureAdmin, ensureUser } = require('./middleware/authMiddleware');

// Middleware
app.use(express.json());

// Use Routes with middleware
app.use('/documents', document);
app.use('/login', login);
app.use('/user', ensureAuthenticated, ensureUser, user);  // Only accessible to authenticated users with 'user' role
app.use('/admin', ensureAuthenticated, ensureAdmin, admin);  // Only accessible to authenticated users with 'admin' role
app.use('/history', history);

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});
