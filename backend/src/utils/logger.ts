type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

class Logger {
  private formatMessage(level: LogLevel, message: string, metadata?: Record<string, any>): string {
    const entry: LogEntry = {
      level,
      message,
      metadata,
      timestamp: new Date().toISOString(),
    };

    return JSON.stringify(entry);
  }

  info(message: string, metadata?: Record<string, any>): void {
    console.log(this.formatMessage('info', message, metadata));
  }

  warn(message: string, metadata?: Record<string, any>): void {
    console.warn(this.formatMessage('warn', message, metadata));
  }

  error(message: string, metadata?: Record<string, any>): void {
    console.error(this.formatMessage('error', message, metadata));
  }

  debug(message: string, metadata?: Record<string, any>): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, metadata));
    }
  }
}

export const logger = new Logger();

