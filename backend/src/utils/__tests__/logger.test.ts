import { logger } from '../logger';

describe('Logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    consoleDebugSpy.mockRestore();
  });

  it('should log info messages', () => {
    logger.info('Test message', { key: 'value' });

    expect(consoleLogSpy).toHaveBeenCalled();
    const logCall = consoleLogSpy.mock.calls[0][0];
    const logEntry = JSON.parse(logCall);

    expect(logEntry.level).toBe('info');
    expect(logEntry.message).toBe('Test message');
    expect(logEntry.metadata).toEqual({ key: 'value' });
    expect(logEntry.timestamp).toBeDefined();
  });

  it('should log warn messages', () => {
    logger.warn('Warning message', { key: 'value' });

    expect(consoleWarnSpy).toHaveBeenCalled();
    const logCall = consoleWarnSpy.mock.calls[0][0];
    const logEntry = JSON.parse(logCall);

    expect(logEntry.level).toBe('warn');
    expect(logEntry.message).toBe('Warning message');
  });

  it('should log error messages', () => {
    logger.error('Error message', { key: 'value' });

    expect(consoleErrorSpy).toHaveBeenCalled();
    const logCall = consoleErrorSpy.mock.calls[0][0];
    const logEntry = JSON.parse(logCall);

    expect(logEntry.level).toBe('error');
    expect(logEntry.message).toBe('Error message');
  });

  it('should log debug messages in development', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    logger.debug('Debug message', { key: 'value' });

    expect(consoleDebugSpy).toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });

  it('should not log debug messages in production', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    logger.debug('Debug message', { key: 'value' });

    expect(consoleDebugSpy).not.toHaveBeenCalled();

    process.env.NODE_ENV = originalEnv;
  });
});

