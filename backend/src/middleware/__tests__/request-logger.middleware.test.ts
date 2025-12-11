import { Request, Response, NextFunction } from 'express';
import { requestLogger } from '../request-logger.middleware';

describe('Request Logger Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    mockRequest = {
      method: 'GET',
      url: '/test',
      ip: '127.0.0.1',
      socket: {
        remoteAddress: '127.0.0.1',
      } as any,
    };

    mockResponse = {
      statusCode: 200,
      on: jest.fn((event: string, callback: () => void) => {
        if (event === 'finish') {
          setTimeout(callback, 0);
        }
      }) as any,
    };

    mockNext = jest.fn();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should call next function', () => {
    requestLogger(mockRequest as Request, mockResponse as Response, mockNext);

    expect(mockNext).toHaveBeenCalled();
  });

  it('should log successful requests', (done) => {
    requestLogger(mockRequest as Request, mockResponse as Response, mockNext);

    setTimeout(() => {
      expect(consoleLogSpy).toHaveBeenCalled();
      done();
    }, 10);
  });

  it('should log error requests with status >= 400', (done) => {
    mockResponse.statusCode = 404;

    requestLogger(mockRequest as Request, mockResponse as Response, mockNext);

    setTimeout(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      done();
    }, 10);
  });
});

