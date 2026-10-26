import { Worker } from 'bullmq';
import { env } from '../config/env.js';
import { sendEmail } from '../services/mailer.js';
import { EmailJobData } from '../queues/email.queue.js';

export const emailWorker = new Worker<EmailJobData>(
  'email',
  async (job) => {
    const { to, subject, html, text } = job.data;
    await sendEmail(to, subject, html, text);
  },
  {
    connection: {
      host: env.REDIS_HOST,
      port: env.REDIS_PORT,
    },
  }
);

emailWorker.on('failed', (job, err) => {
  console.error('Email job failed:', job?.id, err.message);
});
