import express from 'express';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import cors from 'cors';
import { Snowflake } from 'nodejs-snowflake';
import mysql from 'mysql2/promise';
import fetch from 'node-fetch';
import os from 'os';

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
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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

// Utility function to generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// API Endpoints

// Generate flake IDs
app.post('/api/generate-flake-ids', (req, res) => {
    const activityLogId = uid.getUniqueID().toString();
    res.json({ activity_log_id: activityLogId });
});

// Updated /api/espdetected to always insert new rows
app.post('/api/espdetected', async (req, res) => {
    const { deviceName, ipAddress, locks, leds } = req.body;
    
    if (!deviceName || !ipAddress) {
        console.error('Missing required fields:', { deviceName, ipAddress });
        return res.status(400).json({ error: 'Device name and IP address are required' });
    }

    console.log(`Received request: deviceName=${deviceName}, ipAddress=${ipAddress}, locks=${locks}, leds=${leds}`);

    try {
        const id = uid.getUniqueID().toString();
        const [result] = await pool.execute(
            'INSERT INTO espdetected_logs (id, device_name, ip_address, locks, leds, detected_at) VALUES (?, ?, ?, ?, ?, NOW())',
            [id, deviceName, ipAddress, locks || null, leds || null]
        );

        if (result.affectedRows === 1) {
            console.log(`Inserted ${deviceName} (lock ${locks}): IP=${ipAddress}, Time=${new Date().toISOString()}`);
            res.status(201).json({ 
                id, 
                deviceName, 
                ipAddress, 
                locks, 
                leds, 
                detectedAt: new Date().toISOString(), 
                message: 'ESP device logged successfully' 
            });
        } else {
            console.error(`Insert failed for ${deviceName} (lock ${locks}): No rows affected`);
            throw new Error('Failed to insert new ESP record');
        }
    } catch (error) {
        console.error(`Error processing ${deviceName} (lock ${locks}):`, error);
        handleDbError(res, error);
    }
});

// Get all ESP detected logs
app.get('/api/espdetected', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, device_name, ip_address, locks, leds, detected_at FROM espdetected_logs ORDER BY detected_at DESC');
        console.log('Fetched ESP devices:', rows);
        res.json(rows);
    } catch (error) {
        handleDbError(res, error);
    }
});

const BLINK_COUNT = 5;
const BLINK_DELAY = 500;

app.post('/api/trigger-esp', async (req, res) => {
  const { ip_address, lock, led, ledState = 'toggle', skipLock = false } = req.body;

  // Validate input
  if (!ip_address || !led || (!skipLock && !lock)) {
    return res.status(400).json({ error: 'ip_address, led, and lock (unless skipLock is true) are required' });
  }
  if (!['on', 'off', 'toggle'].includes(ledState)) {
    return res.status(400).json({ error: 'ledState must be "on", "off", or "toggle"' });
  }

  // Helper function to introduce delay
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    // Trigger the locker (unless skipLock is true)
    if (!skipLock) {
      const lockUrl = `http://${ip_address}/${lock}`;
      console.log(`Triggering locker at ${lockUrl}`);
      const lockResponse = await fetch(lockUrl, { method: 'GET' });
      if (!lockResponse.ok) {
        throw new Error(`Failed to trigger locker at ${lockUrl}, status: ${lockResponse.status}`);
      }
      console.log(`Locker triggered successfully at ${lockUrl}`);
    }

    // Blink LED 5 times (on-off pairs)
    for (let i = 0; i < BLINK_COUNT; i++) {
      const ledOnUrl = `http://${ip_address}/${led}/on`;
      const ledOffUrl = `http://${ip_address}/${led}/off`;

      // Turn LED on
      console.log(`Turning LED on at ${ledOnUrl}`);
      const ledOnResponse = await fetch(ledOnUrl, { method: 'GET' });
      if (!ledOnResponse.ok) {
        throw new Error(`Failed to turn LED on at ${ledOnUrl}, status: ${ledOnResponse.status}`);
      }
      await delay(BLINK_DELAY);

      // Turn LED off
      console.log(`Turning LED off at ${ledOffUrl}`);
      const ledOffResponse = await fetch(ledOffUrl, { method: 'GET' });
      if (!ledOffResponse.ok) {
        throw new Error(`Failed to turn LED off at ${ledOffUrl}, status: ${ledOffResponse.status}`);
      }
      await delay(BLINK_DELAY);
    }

    // Set final LED state
    let finalLedUrl;
    if (ledState === 'on') {
      finalLedUrl = `http://${ip_address}/${led}/on`;
    } else if (ledState === 'off') {
      finalLedUrl = `http://${ip_address}/${led}/off`;
    } else {
      // For 'toggle', assume we toggle from the last state (off after blinks)
      finalLedUrl = `http://${ip_address}/${led}/on`; // Toggle to on
    }

    console.log(`Setting final LED state at ${finalLedUrl}`);
    const finalLedResponse = await fetch(finalLedUrl, { method: 'GET' });
    if (!finalLedResponse.ok) {
      throw new Error(`Failed to set final LED state at ${finalLedUrl}, status: ${finalLedResponse.status}`);
    }

    res.status(200).json({ message: `Locker ${skipLock ? 'skipped and ' : ''}LED triggered successfully with ${BLINK_COUNT} blinks` });
  } catch (error) {
    console.error('Error triggering ESP:', error);
    res.status(500).json({ error: 'Failed to trigger ESP', details: error.message });
  }
});

// Send OTP
app.post('/api/send-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const otp = generateOTP();
    const mailOptions = {
        from: `"Doxion" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify OTP',
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
    const { number, device_name, ip_address, locks, leds } = req.body;
    if (!number) {
        return res.status(400).json({ error: 'Locker number is required' });
    }

    const id = uid.getUniqueID().toString();
    try {
        const [result] = await pool.execute(
            'INSERT INTO lockers (id, number, device_name, ip_address, locks, leds, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
            [id, number, device_name || null, ip_address || null, locks || null, leds || null]
        );
        res.status(201).json({ id, number, device_name, ip_address, locks, leds, created_at: new Date().toISOString() });
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
        const [rows] = await pool.execute(
            'SELECT id, number, device_name, ip_address, locks, leds, created_at FROM lockers ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        handleDbError(res, error);
    }
});

// Update Locker
app.put('/api/lockers/:id', async (req, res) => {
    const { id } = req.params;
    const { number, device_name, ip_address, locks, leds } = req.body;
    if (!number) {
        return res.status(400).json({ error: 'Locker number is required' });
    }

    try {
        const [result] = await pool.execute(
            'UPDATE lockers SET number = ?, device_name = ?, ip_address = ?, locks = ?, leds = ? WHERE id = ?',
            [number, device_name || null, ip_address || null, locks || null, leds || null, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Locker not found' });
        }
        res.json({ id, number, device_name, ip_address, locks, leds });
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
        const [rows] = await pool.execute(
            'SELECT id, email, name, title, image, created_at FROM recipients ORDER BY created_at DESC'
        );
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

// POST /api/activitylogs
app.post('/api/activitylogs', async (req, res) => {
    const { email, recipientEmail, note, lockerNumber, documentType, date_received } = req.body;
  
    if (!email) return res.status(400).json({ error: 'Sender email is required' });
    if (!recipientEmail) return res.status(400).json({ error: 'Recipient email is required' });
    if (!note) return res.status(400).json({ error: 'Note is required' });
    if (!lockerNumber) return res.status(400).json({ error: 'Locker number is required' });
    if (!documentType) return res.status(400).json({ error: 'Document type is required' });
  
    const id = uid.getUniqueID().toString();
    const otp = generateOTP();
  
    try {
      // Verify locker exists
      const [lockerRows] = await pool.execute('SELECT number FROM lockers WHERE number = ?', [lockerNumber]);
      if (lockerRows.length === 0) {
        return res.status(404).json({ error: 'Locker number does not exist' });
      }
  
      // Check if locker is occupied (has unclaimed activity logs)
      const [existingLogs] = await pool.execute(
        'SELECT recipientEmail FROM activitylogs WHERE lockerNumber = ? AND date_received IS NULL LIMIT 1',
        [lockerNumber]
      );
  
      let skipTrigger = false;
      if (existingLogs.length > 0) {
        // Locker is occupied
        if (existingLogs[0].recipientEmail !== recipientEmail) {
          // Different recipient trying to use occupied locker
          return res.status(409).json({ error: `Locker ${lockerNumber} is occupied by another recipient` });
        }
        // Same recipient, allow submission without triggering locker/LED
        skipTrigger = true;
      }
  
      // Insert new activity log
      const [result] = await pool.execute(
        'INSERT INTO activitylogs (id, email, recipientEmail, note, lockerNumber, documentType, otp, date_received) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [id, email, recipientEmail, note, lockerNumber, documentType, otp, date_received || null]
      );
  
      if (result.affectedRows === 1) {
        const formattedDateTime = new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
  
        const recipientMailOptions = {
          from: `"Doxion" <${process.env.EMAIL_USER}>`,
          to: recipientEmail,
          subject: `New Doxion Submission`,
          text: `Dear Recipient,\n\n` +
                `A new document of type "${documentType}" has been submitted to you via Doxion's Locker. Please use the following OTP to retrieve it securely:\n\n` +
                `${formattedDateTime}\n` +
                `Locker Number: ${lockerNumber}\n` +
                `OTP: ${otp}\n` +
                `From: ${email}\n\n` +
                `Document:\n${note}\n\n` +
                `This is an automated message. Please do not reply directly to this email.`,
        };
  
        const senderMailOptions = {
          from: `"Doxion" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Document Successfully Submitted',
          text: `Dear Sender,\n\n` +
                `Your document of type "${documentType}" was successfully submitted. You will be notified once the recipient retrieves it:\n\n` +
                `${formattedDateTime}\n` +
                `Locker Number: ${lockerNumber}\n` +
                `To: ${recipientEmail}\n` +
                `OTP: ${otp}\n\n` +
                `Note:\n${note}\n\n` +
                `This is an automated message. Please do not reply directly to this email.`,
        };
  
        await Promise.all([
          transporter.sendMail(recipientMailOptions),
          transporter.sendMail(senderMailOptions),
        ]).catch((emailError) => {
          console.error('Error sending emails:', emailError);
        });
  
        console.log(`Activity log ${id} saved and emails sent successfully for ${email}`);
        res.status(201).json({
          id,
          email,
          recipientEmail,
          note,
          lockerNumber,
          documentType,
          date_received: date_received || null,
          created_at: new Date().toISOString(),
          skipTrigger, // Indicate whether to skip locker/LED trigger
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

// GET /api/activitylogs
app.get('/api/activitylogs', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, email, recipientEmail, note, lockerNumber, documentType, created_at, date_received FROM activitylogs'
        );
        res.json(rows);
    } catch (error) {
        handleDbError(res, error);
    }
});

// PUT /api/activitylogs/:id/receive
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
            'SELECT id, email, recipientEmail, note, lockerNumber, documentType, created_at, date_received FROM activitylogs WHERE id = ?',
            [id]
        );
        res.json(updatedRows[0]);
    } catch (error) {
        handleDbError(res, error);
    }
});

// POST /api/receive
app.post('/api/receive', async (req, res) => {
    const { lockerNumber, otp } = req.body;

    if (!lockerNumber) return res.status(400).json({ error: 'Locker number is required' });
    if (!otp || !/^\d{6}$/.test(otp)) return res.status(400).json({ error: 'Valid 6-digit OTP is required' });

    try {
        const [matchingRows] = await pool.execute(
            'SELECT id FROM activitylogs WHERE lockerNumber = ? AND otp = ? AND date_received IS NULL LIMIT 1',
            [lockerNumber, otp]
        );

        if (matchingRows.length === 0) {
            return res.status(401).json({ error: 'Invalid locker number or OTP.' });
        }

        const [updateResult] = await pool.execute(
            'UPDATE activitylogs SET date_received = NOW() WHERE lockerNumber = ? AND date_received IS NULL',
            [lockerNumber]
        );

        if (updateResult.affectedRows === 0) {
            throw new Error('No unclaimed documents to update');
        }

        const [updatedRows] = await pool.execute(
            'SELECT id, email, recipientEmail, note, lockerNumber FROM activitylogs WHERE lockerNumber = ? AND date_received IS NOT NULL AND DATE(date_received) = DATE(NOW())',
            [lockerNumber]
        );

        const formattedDateTime = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });

        const emailPromises = updatedRows.map((log) => {
            const senderMailOptions = {
                from: `"Doxion" <${process.env.EMAIL_USER}>`,
                to: log.email,
                subject: 'Document Retrieved',
                text: `Dear Sender,\n\n` +
                      `Your document submitted to ${log.recipientEmail} has been successfully retrieved:\n\n` +
                      `${formattedDateTime}\n` +
                      `Locker Number: ${log.lockerNumber}\n\n` +
                      `Note:\n${log.note}\n\n` +
                      `This is an automated message. Please do not reply directly to this email.`,
            };
            return transporter.sendMail(senderMailOptions).catch((emailError) => {
                console.error(`Error sending retrieval notification to ${log.email}:`, emailError);
            });
        });

        await Promise.all(emailPromises);

        console.log(`All unclaimed documents from locker ${lockerNumber} retrieved with OTP ${otp}, updated ${updateResult.affectedRows} entries`);
        res.status(200).json({
            lockerNumber,
            updatedCount: updateResult.affectedRows,
            message: `All unclaimed documents (${updateResult.affectedRows}) in locker ${lockerNumber} unlocked successfully`,
        });
    } catch (error) {
        handleDbError(res, error);
    }
});

// Request to set new admin
app.post('/api/admin/request-set', async (req, res) => {
    const { email, pin } = req.body;
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Valid email is required' });
    }
    if (!pin || !/^\d{6}$/.test(pin)) {
        return res.status(400).json({ error: 'PIN must be a 6-digit number' });
    }

    try {
        const [existing] = await pool.execute('SELECT * FROM users LIMIT 1');
        if (existing.length === 0) {
            const id = uid.getUniqueID().toString();
            await pool.execute(
                'INSERT INTO users (id, email, pin, created_at) VALUES (?, ?, ?, NOW())',
                [id, email, pin]
            );
            return res.json({ success: true });
        } else {
            const currentEmail = existing[0].email;
            const otp = generateOTP();
            const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes
            await pool.execute(
                'UPDATE users SET pending_email = ?, pending_pin = ?, otp = ?, otp_expires = ? WHERE id = ?',
                [email, pin, otp, otpExpires, existing[0].id]
            );

            const mailOptions = {
                from: `"Doxion" <${process.env.EMAIL_USER}>`,
                to: currentEmail,
                subject: 'Verify Admin Change',
                text: `A request to change the admin email and PIN has been made. Please use the following OTP to confirm: ${otp}. This OTP will expire in 2 minutes.`,
            };
            await transporter.sendMail(mailOptions);

            return res.json({ otpRequired: true });
        }
    } catch (error) {
        handleDbError(res, error);
    }
});

// Verify OTP and set new admin
app.post('/api/admin/verify-set', async (req, res) => {
    const { otp } = req.body;
    if (!otp || !/^\d{6}$/.test(otp)) {
        return res.status(400).json({ error: 'Valid 6-digit OTP is required' });
    }

    try {
        const [existing] = await pool.execute(
            'SELECT * FROM users WHERE otp = ? AND otp_expires > NOW() LIMIT 1',
            [otp]
        );
        if (existing.length === 0) {
            return res.status(401).json({ error: 'Invalid or expired OTP' });
        }

        const user = existing[0];
        await pool.execute(
            'UPDATE users SET email = ?, pin = ?, pending_email = NULL, pending_pin = NULL, otp = NULL, otp_expires = NULL, updated_at = NOW() WHERE id = ?',
            [user.pending_email, user.pending_pin, user.id]
        );

        res.json({ success: true });
    } catch (error) {
        handleDbError(res, error);
    }
});

// Resend OTP for admin change
app.post('/api/admin/resend-otp', async (req, res) => {
    try {
        const [existing] = await pool.execute('SELECT * FROM users WHERE pending_email IS NOT NULL LIMIT 1');
        if (existing.length === 0) {
            return res.status(400).json({ error: 'No pending admin change request' });
        }

        const currentEmail = existing[0].email;
        const otp = generateOTP();
        const otpExpires = new Date(Date.now() + 2 * 60 * 1000);
        await pool.execute(
            'UPDATE users SET otp = ?, otp_expires = ? WHERE id = ?',
            [otp, otpExpires, existing[0].id]
        );

        const mailOptions = {
            from: `"Doxion" <${process.env.EMAIL_USER}>`,
            to: currentEmail,
            subject: 'Verify Admin Change',
            text: `A new OTP for admin change verification: ${otp}. This OTP will expire in 2 minutes.`,
        };
        await transporter.sendMail(mailOptions);

        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        handleDbError(res, error);
    }
});

// Verify admin PIN
app.post('/api/admin/verify-pin', async (req, res) => {
    const { pin } = req.body;
    if (!pin || !/^\d{6}$/.test(pin)) {
        return res.status(400).json({ error: 'Valid 6-digit PIN is required' });
    }

    try {
        const [existing] = await pool.execute('SELECT * FROM users LIMIT 1');
        if (existing.length === 0) {
            return res.status(404).json({ error: 'No admin set', noAdmin: true });
        }

        const [user] = await pool.execute(
            'SELECT * FROM users WHERE pin = ? LIMIT 1',
            [pin]
        );
        if (user.length === 0) {
            return res.status(401).json({ error: 'Invalid PIN' });
        }

        res.json({ success: true });
    } catch (error) {
        handleDbError(res, error);
    }
});

app.get('/api/get-ip', (req, res) => {
    try {
        const interfaces = os.networkInterfaces();
        let ipAddress = '127.0.0.1'; // Default to localhost
        for (const iface of Object.values(interfaces)) {
        for (const details of iface) {
            if (details.family === 'IPv4' && !details.internal) {
            ipAddress = details.address;
            break;
            }
        }
        }
        res.json({ ip_address: ipAddress });
    } catch (error) {
        console.error('Error fetching IP address:', error);
        res.status(500).json({ error: 'Failed to fetch IP address', details: error.message });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.send('Backend server is running');
});

const HOST = '0.0.0.0';
// Start server
app.listen(PORT, HOST, () => {
    console.log(`✅ Server running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});