import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: false,
  auth:
    env.MAIL_USER && env.MAIL_PASS
      ? {
          user: env.MAIL_USER,
          pass: env.MAIL_PASS,
        }
      : undefined,
});

export async function sendEmail(to: string, subject: string, html: string, text?: string) {
  await transporter.sendMail({
    from: env.MAIL_FROM,
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]*>/g, ''),
  });
}
