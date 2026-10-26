import { Request, Response, NextFunction } from 'express';
import { logger } from '../config/logger.js';

export function createError(message: string, statusCode: number) {
  const err = new Error(message) as Error & {
    statusCode: number;
    isOperational: boolean;
  };
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
}

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
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
