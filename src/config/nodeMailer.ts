import nodemailer, { Transporter } from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createEmailTransporter = (): Transporter => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
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
