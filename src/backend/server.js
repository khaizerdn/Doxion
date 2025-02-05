const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "doxion",
});

// Helper function to perform queries
const dbQuery = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) {
        console.error("Database query error:", err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // or any email service you prefer
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Route for form submission
app.post("/submit-form", async (req, res) => {
  const { firstName, lastName, email, recipientEmail, note, lockerNumber } = req.body;

  if (!firstName || !lastName || !email || !recipientEmail || !lockerNumber) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Generate OTP for the locker
    const otp = generateOTP();

    // Save information and OTP to the database
    const query = `
      INSERT INTO submissions (first_name, last_name, email, recipient_email, note, locker_number, otp)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [firstName, lastName, email, recipientEmail, note, lockerNumber, otp];
    await dbQuery(query, values);

    // Send an email to the recipient
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: "You've received a message and locker details",
      text: `
        Hello,

        You have received a message from ${firstName} ${lastName}.

        Email: ${email}
        Note: ${note}
        Locker Number: ${lockerNumber}
        OTP: ${otp}

        Best regards,
        Your Team
      `,
    };

    await transporter.sendMail(mailOptions);

    // Respond with success and OTP (if required)
    res.status(200).json({ success: true, message: "Form submitted successfully and email sent.", otp });
  } catch (error) {
    console.error("Error submitting form or sending email:", error);
    res.status(500).json({ error: "Error submitting form. Please try again." });
  }
});

app.post('/validate-otp', async (req, res) => {
  const { lockerNumber, otp } = req.body;

  if (!lockerNumber || !otp) {
    return res.status(400).json({ success: false, error: 'Locker number and OTP are required.' });
  }

  try {
    // Validate OTP and locker number
    const query = 'SELECT * FROM submissions WHERE locker_number = ? AND otp = ?';
    const results = await dbQuery(query, [lockerNumber, otp]);

    if (results.length > 0) {
      // Update the date_received for rows with the same locker_number and NULL date_received
      const currentDate = new Date();
      const updateQuery = `
        UPDATE submissions 
        SET date_received = ? 
        WHERE locker_number = ? AND date_received IS NULL
      `;
      await dbQuery(updateQuery, [currentDate, lockerNumber]);

      // Retrieve rows with the same locker_number and non-NULL date_received
      const fetchUpdatedRowsQuery = `
        SELECT * 
        FROM submissions 
        WHERE locker_number = ? AND date_received IS NOT NULL
      `;
      const updatedRows = await dbQuery(fetchUpdatedRowsQuery, [lockerNumber]);

      // Insert these rows into the 'successreceive' table
      if (updatedRows.length > 0) {
        const insertQuery = `
          INSERT INTO successreceive 
          (first_name, last_name, email, recipient_email, note, locker_number, otp, date_received, created_at) 
          VALUES ?
        `;
        const values = updatedRows.map(row => [
          row.first_name,
          row.last_name,
          row.email,
          row.recipient_email,
          row.note,
          row.locker_number,
          row.otp,
          row.date_received,
          row.created_at,
        ]);

        await dbQuery(insertQuery, [values]);
      }

      // Delete rows from the submissions table
      const deleteQuery = `
        DELETE FROM submissions 
        WHERE locker_number = ? AND date_received IS NOT NULL
      `;
      await dbQuery(deleteQuery, [lockerNumber]);

      res.status(200).json({ success: true, message: 'OTP validated successfully. Data moved to successreceive and deleted from submissions.' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid locker number or OTP.' });
    }
  } catch (error) {
    console.error('Error during OTP validation:', error);
    res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
  }
});

// Route to generate and send OTP
app.post('/send-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ success: false, error: 'Email and OTP are required.' });
  }

  try {
    // Send OTP to the email address
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for verification',
      text: `Your OTP is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);

    // Respond with success
    res.status(200).json({ success: true, message: 'OTP sent to your email.' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, error: 'An error occurred. Please try again.' });
  }
});





// Start server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
