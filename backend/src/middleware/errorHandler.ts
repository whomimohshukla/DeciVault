import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';

type ErrorWithStatus = Error & {
  statusCode?: number;
  isOperational?: boolean;
};

export function createError(
  message: string,
  statusCode: number
): ErrorWithStatus {
  const err = new Error(message) as ErrorWithStatus;
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
}

export const errorHandler = (
  err: ErrorWithStatus,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  void next;
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error({
    message,
    statusCode,
    stack: err.stack,
  });

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
