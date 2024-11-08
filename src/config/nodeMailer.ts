import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createEmailTransporter = (): Transporter => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  transporter.verify(error => {
    if (error) {
      console.error('Error setting up email transporter:', error);
    } else {
      console.log('Email transporter is ready to send messages');
    }
  });

  return transporter;
};

export default createEmailTransporter;
