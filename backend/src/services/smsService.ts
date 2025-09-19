import twilio from 'twilio';
import { logger } from '../utils/logger';

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendSMS = async (to: string, message: string): Promise<void> => {
  try {
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to
    });

    logger.info(`SMS sent successfully to ${to}`);

  } catch (error) {
    logger.error('SMS sending error:', error);
    throw error;
  }
};