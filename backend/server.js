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
    const activityLogId = uid.getUniqueID().toString();
    res.json({ activity_log_id: activityLogId });
});

// Send OTP
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const mailOptions = {
        from: `"Doxion" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Confirm OTP',
        text: `Your OTP is ${otp}. It expires in 2 minutes.`,
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

// Utility function to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Updated POST /api/activitylogs endpoint
app.post('/api/activitylogs', async (req, res) => {
    const { email, recipientEmail, note, lockerNumber, date_received } = req.body;

    // Validation
    if (!email) return res.status(400).json({ error: 'Sender email is required' });
    if (!recipientEmail) return res.status(400).json({ error: 'Recipient email is required' });
    if (!note) return res.status(400).json({ error: 'Note is required' });
    if (!lockerNumber) return res.status(400).json({ error: 'Locker number is required' });

    const id = uid.getUniqueID().toString();
    const otp = generateOTP();

    try {
        // Verify locker exists
        const [lockerRows] = await pool.execute('SELECT number FROM lockers WHERE number = ?', [lockerNumber]);
        if (lockerRows.length === 0) {
            return res.status(404).json({ error: 'Locker number does not exist' });
        }

        // Verify recipient exists (no need to fetch name)
        const [recipientRows] = await pool.execute('SELECT email FROM recipients WHERE email = ?', [recipientEmail]);
        if (recipientRows.length === 0) {
            return res.status(404).json({ error: 'Recipient email does not exist' });
        }

        // Insert submission data including OTP
        const [result] = await pool.execute(
            'INSERT INTO activitylogs (id, email, recipientEmail, note, lockerNumber, otp, date_received) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [id, email, recipientEmail, note, lockerNumber, otp, date_received || null]
        );

        if (result.affectedRows === 1) {
            // Format date and time (e.g., "March 13, 2025 at 10:00 AM")
            const formattedDateTime = new Date().toLocaleString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            });

            // Recipient's email
            const recipientMailOptions = {
                from: `"Doxion" <${process.env.EMAIL_USER}>`,
                to: recipientEmail,
                subject: `New Doxion Submission`,
                text: `Dear Recipient,\n\n` +
                    `A new document has been submitted to you via Doxion's Locker. Please use the following OTP or your registered PIN to retrieve it securely. Please read below the following submission details:\n\n` +
                    `${formattedDateTime}\n` +
                    `Locker Number: ${lockerNumber}\n` +
                    `OTP: ${otp}\n` +
                    `From: ${email}\n\n` +
                    `Document:\n${note}\n\n` +
                    `This is an automated message. Please do not reply directly to this email.`,
            };

            // Sender's email
            const senderMailOptions = {
                from: `"Doxion" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: 'Document Successfully Submitted',
                text: `Dear Sender,\n\n` +
                    `Your document was successfully submitted. You will be notified once the recipient retrieves it. Please read below the following submission details:\n\n` +
                    `${formattedDateTime}\n` +
                    `Locker Number: ${lockerNumber}\n` +
                    `To: ${recipientEmail}\n\n` +
                    `Note:\n${note}\n\n` +
                    `This is an automated message. Please do not reply directly to this email.`,
            };

            // Send both emails concurrently
            await Promise.all([
                transporter.sendMail(recipientMailOptions),
                transporter.sendMail(senderMailOptions),
            ]).catch((emailError) => {
                console.error('Error sending emails:', emailError);
                // Log the error but don’t fail the response, as submission is already saved
            });

            console.log(`Activity log ${id} saved and emails sent successfully for ${email}`);
            res.status(201).json({
                id,
                email,
                recipientEmail,
                note,
                lockerNumber,
                date_received: date_received || null,
                created_at: new Date().toISOString(),
            });
        } else {
            throw new Error('Failed to insert activity log');
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Activity log ID conflict' });
        }
        handleDbError(res, error);
    }
});

// GET /api/activitylogs - Fetch all activity logs
app.get('/api/activitylogs', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, email, recipientEmail, note, lockerNumber, created_at, date_received FROM activitylogs'
        );
        res.json(rows);
    } catch (error) {
        handleDbError(res, error);
    }
});

// PUT /api/activitylogs/:id/receive - Update receive status
app.put('/api/activitylogs/:id/receive', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await pool.execute(
            'UPDATE activitylogs SET date_received = NOW() WHERE id = ? AND date_received IS NULL',
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Activity log not found or already received' });
        }
        const [updatedRows] = await pool.execute(
            'SELECT id, email, recipientEmail, note, lockerNumber, created_at, date_received FROM activitylogs WHERE id = ?',
            [id]
        );
        res.json(updatedRows[0]);
    } catch (error) {
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