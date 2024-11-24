import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false, // For STARTTLS
  auth: {
    user: process.env.EMAIL, // Your Office 365 email
    pass: process.env.PASS, // App password generated for SMTP
  },
});
const sendEmail = async () => {
  const mailOptions = {
    from: process.env.EMAIL, // Sender email address
    to: "nasoooor29@gmail.com", // Recipient email address
    subject: "Hello from Office 365!", // Email subject
    text: "This is a test email sent using Office 365 SMTP.", // Email body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("email sent To:", mailOptions.to);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

// Call the sendEmail function
sendEmail();

