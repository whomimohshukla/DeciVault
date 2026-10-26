import { Queue } from 'bullmq';
import { env } from '../config/env.js';

export const emailQueue = new Queue('email', {
  connection: {
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
  },
});

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}
