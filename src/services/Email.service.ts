import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import loadConfig from '../config/configLoader';
loadConfig();

class EmailService {
  private transporter!: Transporter;
  private static instance: EmailService | null = null;

  private constructor() {
    // Empty private constructor to enforce singleton
  }

  public static async getInstance(): Promise<EmailService> {
    if (!EmailService.instance) {
      const service = new EmailService();
      await service.initialize(); // Await initialization
      EmailService.instance = service;
    }
    return EmailService.instance;
  }

  // Initialize the transporter asynchronously
  private async initialize(): Promise<void> {
    this.transporter = await this.createEmailTransporter();
  }

  private async createEmailTransporter(): Promise<Transporter> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    try {
      await transporter.verify();
    } catch (error) {
      console.error('Error setting up email transporter:', error);
      throw new Error('Failed to set up email transporter');
    }
    return transporter;
  }

  public async sendEmail(options: SendMailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(options);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default EmailService;
