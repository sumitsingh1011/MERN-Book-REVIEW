// // src/routes/passwordReset.js
// const express = require('express');
// const crypto = require('crypto');
// const nodemailer = require('nodemailer');
// const User = require('../models/User');
// const router = express.Router();

// // Configure nodemailer
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   }
// });

// // Request password reset
// router.post('/forgot-password', async (req, res) => {
//   try {
//     const { email } = req.body;
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Generate reset token
//     const resetToken = crypto.randomBytes(32).toString('hex');
//     user.resetPasswordToken = resetToken;
//     user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//     await user.save();

//     // Send reset email
//     const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: user.email,
//       subject: 'Password Reset Request',
//       html: `
//         <h1>Password Reset Request</h1>
//         <p>Click the link below to reset your password:</p>
//         <a href="${resetUrl}">Reset Password</a>
//         <p>This link will expire in 1 hour.</p>
//       `
//     };

//     await transporter.sendMail(mailOptions);
//     res.json({ message: 'Password reset email sent' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// // Reset password with token
// router.post('/reset-password/:token', async (req, res) => {
//   try {
//     const { password } = req.body;
//     const user = await User.findOne({
//       resetPasswordToken: req.params.token,
//       resetPasswordExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired reset token' });
//     }

//     // Update password
//     user.password = password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpires = undefined;
//     await user.save();

//     res.json({ message: 'Password reset successful' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// module.exports = router;