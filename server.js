const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Let cors handle OPTIONS automatically
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact Form
app.post("/contact", async (req, res) => {
  const { name, email, message } = req.body;
  console.log("Received contact:", { name, email, message });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_USER,
    subject: `New Contact Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Contact form submitted successfully!" });
  } catch (err) {
    console.error("Email error:", err);
    res.status(500).json({ error: "Failed to send contact message." });
  }
});

// Hire Me Form
app.post("/hire", async (req, res) => {
  const { name, company, title, project } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER,
    subject: `Hire Request from ${name}`,
    text: `Name: ${name}\nCompany: ${company}\nJob Title: ${title}\nProject Description: ${project}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ message: "Hire request sent successfully!" });
  } catch (err) {
    console.error("Hire email error:", err);
    res.status(500).json({ error: "Failed to send hire request." });
  }
});
const port = process.env.PORT || 3000; // Use dynamic port if available, otherwise fallback to 3000
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

