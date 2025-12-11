import { Request, Response, NextFunction } from 'express';
import { errorHandler, AppError } from '../error-handler.middleware';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {};
    mockResponse = {
      status: statusMock,
      json: jsonMock,
    };
    mockNext = jest.fn();
  });

  it('should handle errors with statusCode', () => {
    const error: AppError = new Error('Test error');
    error.statusCode = 400;

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Test error',
      },
    });
  });

  it('should handle errors with status', () => {
    const error: AppError = new Error('Test error');
    error.status = 404;

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(404);
  });

  it('should default to 500 for errors without status', () => {
    const error = new Error('Test error');

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(statusMock).toHaveBeenCalledWith(500);
  });

  it('should include stack trace in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const error = new Error('Test error');
    error.statusCode = 400;

    errorHandler(error, mockRequest as Request, mockResponse as Response, mockNext);

    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({
          stack: expect.any(String),
        }),
      })
    );

    process.env.NODE_ENV = originalEnv;
  });
});

