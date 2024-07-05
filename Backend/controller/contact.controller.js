import { validationResult } from 'express-validator';
import Contact from '../model/contact.model.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv'
dotenv.config();

export const submitContactForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, subject, message } = req.body;

  try {
    const newContact = new Contact({ name, email, subject, message });
    await newContact.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: subject,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ error: 'Failed to send email', details: error });
      }
      res.status(200).json({ message: 'Email sent successfully', info });
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit contact form', details: error });
  }

  
};
