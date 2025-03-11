import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { Snowflake } from 'nodejs-snowflake';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// Snowflake ID generator
const uid = new Snowflake();

// MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'your_database',
    connectionLimit: 10,
});

// Email transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error, success) => {
    if (error) console.error('Email transporter verification failed:', error);
    else console.log('Email transporter is ready');
});

// Utility function to handle DB errors
const handleDbError = (res, error) => {
    console.error('Database error:', error.message);
    return res.status(500).json({ error: 'Database error', details: error.message });
};

// API Endpoints

// Generate flake IDs
app.post('/api/generate-flake-ids', (req, res) => {
    const submissionId = uid.getUniqueID().toString();
    res.json({ submission_id: submissionId });
});

// Send OTP
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const mailOptions = {
        from: `"Your App" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('OTP sent:', info.messageId, 'to:', email);
        res.json({ message: 'OTP sent successfully', otp });
    } catch (error) {
        console.error('Error sending OTP to', email, ':', error.message);
        res.status(500).json({ error: 'Failed to send OTP', details: error.message });
    }
});

// Add Locker
app.post('/api/lockers', async (req, res) => {
    const { number, location } = req.body;
    if (!number || !location) {
        return res.status(400).json({ error: 'Locker number and location are required' });
    }

    const id = uid.getUniqueID().toString();
    try {
        const [result] = await pool.execute(
            'INSERT INTO lockers (id, number, location) VALUES (?, ?, ?)',
            [id, number, location]
        );
        res.status(201).json({ id, number, location });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Locker number already exists' });
        }
        handleDbError(res, error);
    }
});

// Get All Lockers
app.get('/api/lockers', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, number, location FROM lockers');
        res.json(rows);
    } catch (error) {
        handleDbError(res, error);
    }
});

// Update Locker
app.put('/api/lockers/:id', async (req, res) => {
    const { id } = req.params;
    const { number, location } = req.body;
    if (!number || !location) {
        return res.status(400).json({ error: 'Locker number and location are required' });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE lockers SET number = ?, location = ? WHERE id = ?',
            [number, location, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Locker not found' });
        }
        res.json({ id, number, location });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Locker number already exists' });
        }
        handleDbError(res, error);
    }
});

// Delete Locker
app.delete('/api/lockers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute('DELETE FROM lockers WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Locker not found' });
        }
        res.status(204).send();
    } catch (error) {
        handleDbError(res, error);
    }
});

// Add Recipient
app.post('/api/recipients', async (req, res) => {
    const { email, name, title, image } = req.body;
    if (!email || !name || !title) {
        return res.status(400).json({ error: 'Email, name, and title are required' });
    }

    const id = uid.getUniqueID().toString();
    try {
        const [result] = await pool.execute(
            'INSERT INTO recipients (id, email, name, title, image) VALUES (?, ?, ?, ?, ?)',
            [id, email, name, title, image || null]
        );
        res.status(201).json({ id, email, name, title, image });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        handleDbError(res, error);
    }
});

// Get All Recipients
app.get('/api/recipients', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, email, name, title, image FROM recipients');
        res.json(rows);
    } catch (error) {
        handleDbError(res, error);
    }
});

// Update Recipient
app.put('/api/recipients/:id', async (req, res) => {
    const { id } = req.params;
    const { email, name, title, image } = req.body;
    if (!email || !name || !title) {
        return res.status(400).json({ error: 'Email, name, and title are required' });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE recipients SET email = ?, name = ?, title = ?, image = ? WHERE id = ?',
            [email, name, title, image || null, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Recipient not found' });
        }
        res.json({ id, email, name, title, image });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Email already exists' });
        }
        handleDbError(res, error);
    }
});

// Delete Recipient
app.delete('/api/recipients/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute('DELETE FROM recipients WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Recipient not found' });
        }
        res.status(204).send();
    } catch (error) {
        handleDbError(res, error);
    }
});

// POST /api/submissions - Save submission data (without firstName and lastName)
app.post('/api/submissions', async (req, res) => {
    const { email, recipientEmail, note, lockerNumber, otp } = req.body;

    // Validate required fields with specific error messages
    if (!email) return res.status(400).json({ error: 'Sender email is required' });
    if (!recipientEmail) return res.status(400).json({ error: 'Recipient email is required' });
    if (!note) return res.status(400).json({ error: 'Note is required' });
    if (!lockerNumber) return res.status(400).json({ error: 'Locker number is required' });
    if (!otp) return res.status(400).json({ error: 'OTP is required' });

    // Generate unique ID using Snowflake
    const id = uid.getUniqueID().toString();

    try {
        // Verify locker exists
        const [lockerRows] = await pool.execute('SELECT number FROM lockers WHERE number = ?', [lockerNumber]);
        if (lockerRows.length === 0) {
            return res.status(404).json({ error: 'Locker number does not exist' });
        }

        // Verify recipient email exists
        const [recipientRows] = await pool.execute('SELECT email FROM recipients WHERE email = ?', [recipientEmail]);
        if (recipientRows.length === 0) {
            return res.status(404).json({ error: 'Recipient email does not exist' });
        }

        // Insert submission into database
        const [result] = await pool.execute(
            'INSERT INTO submissions (id, email, recipientEmail, note, lockerNumber, otp) VALUES (?, ?, ?, ?, ?, ?)',
            [id, email, recipientEmail, note, lockerNumber, otp]
        );

        if (result.affectedRows === 1) {
            console.log(`Submission ${id} saved successfully for ${email}`);
            res.status(201).json({
                id,
                email,
                recipientEmail,
                note,
                lockerNumber,
                otp,
                created_at: new Date().toISOString(),
            });
        } else {
            throw new Error('Failed to insert submission');
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Submission ID conflict' });
        }
        handleDbError(res, error);
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