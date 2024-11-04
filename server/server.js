// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const axios = require('axios');
const connectDB = require('./config/db');
const documentRoutes = require('./routes/documentRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Connect to MongoDB
connectDB();

app.use(cors({ origin: 'http://localhost:3001', credentials: true }));
app.use(express.json());

// Google login route
// Google login route
app.post('/login/google', async (req, res) => {
    const { token, recaptcha } = req.body;
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        console.log("Google User Info:", payload);

        const recaptchaResponse = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: recaptcha,
            },
        });

        if (!recaptchaResponse.data.success) {
            return res.status(403).json({ message: 'reCAPTCHA verification failed' });
        }

        // Create and sign the JWT token
        const jwtToken = jwt.sign(
            { email: payload.email, role: 'admin' },
            process.env.SECRET,
            { expiresIn: '1h' }
        );

        // Send the response with user info and token
        res.json({
            message: 'Login successful',
            user: {
                name: payload.name,
                email: payload.email,
                picture: payload.picture,
                role: 'admin',
            },
            token: jwtToken,
        });
    } catch (error) {
        console.error("Error verifying Google token:", error);
        res.status(401).json({ message: 'Invalid token' });
    }
});


// Use document and user routes
app.use('/document', documentRoutes);
app.use('/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
