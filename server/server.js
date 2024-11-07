// Imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const app = express();
const PORT = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');
const axios = require('axios');
const connectDB = require('./config/db');


// Routes
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');

// Models
const User = require('./models/User');


// Connect to MongoDB
connectDB();

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());

// Google Login
app.post('/login/google', async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the Google token and get the user's payload
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Check if user already exists in the database
        let user = await User.findOne({ email: payload.email });

        if (!user) {
            // If the user doesn't exist, register the new user
            user = new User({
                name: payload.name,
                email: payload.email,
                picture: payload.picture, // Optional: You can store the user's profile picture
                role: 'user',  // Default role, you can modify as needed (e.g., based on email domain)
            });

            // Save the new user to the database
            await user.save();
            console.log("New user registered:", user);
        }

        // Generate a JWT token with a 1-hour expiration time
        const sessionToken = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Send the response with user details and JWT token
        res.json({
            message: 'Login successful',
            user: { name: user.name, email: user.email, role: user.role, picture: user.picture },
            token: sessionToken
        });
    } catch (error) {
        console.error("Error verifying Google token:", error);
        res.status(401).json({ message: 'Invalid token' });
    }
});

// Logout route to clear the session
app.post('/logout', (req, res) => {
    req.logout(() => {
        res.status(200).json({ message: 'Logged out successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
