import nodemailer from 'nodemailer';
import { logger } from '../utils/logger';

interface EmailOptions {
  to: string;
  subject: string;
  template: string;
  data: any;
}

// Create transporter
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email templates
const templates = {
  'email-verification': (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">TravelEase</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333;">Welcome to TravelEase, ${data.firstName}!</h2>
        <p style="color: #666; line-height: 1.6;">
          Thank you for joining TravelEase. To complete your registration, please verify your email address by clicking the button below:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.verificationLink}" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email Address
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          If you didn't create an account with TravelEase, please ignore this email.
        </p>
      </div>
      <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
        <p>© 2024 TravelEase. All rights reserved.</p>
      </div>
    </div>
  `,
  
  'password-reset': (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">TravelEase</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p style="color: #666; line-height: 1.6;">
          Hi ${data.firstName}, we received a request to reset your password. Click the button below to create a new password:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${data.resetLink}" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
        </div>
        <p style="color: #666; font-size: 14px;">
          This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
        </p>
      </div>
      <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
        <p>© 2024 TravelEase. All rights reserved.</p>
      </div>
    </div>
  `,

  'reward-notification': (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">🎉 TravelEase Rewards</h1>
      </div>
      <div style="padding: 30px; background: #f9f9f9;">
        <h2 style="color: #333;">Congratulations, ${data.firstName}!</h2>
        <p style="color: #666; line-height: 1.6;">
          You've earned <strong>${data.points} reward points</strong> for ${data.reason}!
        </p>
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <h3 style="color: #667eea; margin: 0;">Your Current Balance</h3>
          <p style="font-size: 24px; font-weight: bold; color: #333; margin: 10px 0;">${data.totalPoints} Points</p>
        </div>
        <p style="color: #666; line-height: 1.6;">
          Use your points to redeem exciting rewards like mobile recharges, shopping vouchers, and more!
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/rewards" 
             style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Rewards
          </a>
        </div>
      </div>
      <div style="background: #333; color: white; padding: 20px; text-align: center; font-size: 14px;">
        <p>© 2024 TravelEase. All rights reserved.</p>
      </div>
    </div>
  `
};

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    const { to, subject, template, data } = options;

    const htmlContent = templates[template as keyof typeof templates]?.(data) || 
                       `<p>Email content not available for template: ${template}</p>`;

    const mailOptions = {
      from: `"TravelEase" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: htmlContent
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to ${to}`);

  } catch (error) {
    logger.error('Email sending error:', error);
    throw error;
  }
};