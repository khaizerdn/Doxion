import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { Snowflake } from 'nodejs-snowflake';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Ensure this matches your frontend URL
    methods: ['GET', 'POST'],
    credentials: true,
}));

// Snowflake ID generator
const uid = new Snowflake();

// Email transporter setup with verification
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Use an App Password if 2FA is enabled
    },
});

// Verify transporter on startup
transporter.verify((error, success) => {
    if (error) {
        console.error('Email transporter verification failed:', error);
    } else {
        console.log('Email transporter is ready to send messages');
    }
});

// Endpoint to generate flake IDs
app.post('/api/generate-flake-ids', (req, res) => {
    const submissionId = uid.getUniqueID().toString();
    res.json({ submission_id: submissionId });
});

// Endpoint to generate and send OTP
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        console.error('No email provided in request body:', req.body);
        return res.status(400).json({ error: 'Email is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const mailOptions = {
        from: `"Your App" <${process.env.EMAIL_USER}>`, // Sender name and email
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('OTP sent successfully:', info.messageId, 'to:', email);
        res.json({ message: 'OTP sent successfully', otp });
    } catch (error) {
        console.error('Error sending OTP to', email, ':', error.message);
        res.status(500).json({ error: 'Failed to send OTP', details: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Backend server is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});