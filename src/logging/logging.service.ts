import { Injectable } from '@nestjs/common';
import {
  createWriteStream,
  WriteStream,
  mkdirSync,
  existsSync,
  statSync,
  renameSync,
} from 'fs';
import { join } from 'path';

type LogLevel = 'error' | 'warn' | 'log' | 'debug' | 'verbose';

@Injectable()
export class LoggingService {
  private commonStream: WriteStream;
  private errorStream: WriteStream;
  private readonly logLevelValue: number;
  private readonly maxLogSize: number;
  private readonly logPath: string;

  private readonly LOG_LEVELS: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    log: 2,
    debug: 3,
    verbose: 4,
  };

  constructor() {
    this.maxLogSize =
      parseInt(process.env.MAX_LOG_FILE_SIZE || '10', 10) * 1024 * 1024;
    this.logLevelValue = parseInt(process.env.LOG_LEVEL || '2', 10);
    this.logPath = join(process.cwd(), 'logs');

    if (!existsSync(this.logPath)) {
      mkdirSync(this.logPath, { recursive: true });
    }

    this.initializeStreams();
  }

  private initializeStreams() {
    const commonLogPath = join(this.logPath, 'app.log');
    const errorLogPath = join(this.logPath, 'error.log');

    this.commonStream = createWriteStream(commonLogPath, { flags: 'a' });
    this.errorStream = createWriteStream(errorLogPath, { flags: 'a' });
  }

  private shouldLog(level: LogLevel): boolean {
    return this.LOG_LEVELS[level] <= this.logLevelValue;
  }

  private rotateLogFile(filePath: string) {
    try {
      const stats = statSync(filePath);
      if (stats.size >= this.maxLogSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const newPath = `${filePath}.${timestamp}`;
        renameSync(filePath, newPath);
        return true;
      }
    } catch (error) {
      console.error('Error rotating log file:', error);
    }
    return false;
  }

  private writeLog(level: LogLevel, message: string, context?: any) {
    if (!this.shouldLog(level)) return;

    const timestamp = new Date().toISOString();
    const logEntry =
      JSON.stringify({
        timestamp,
        level,
        message,
        context,
      }) + '\n';

    if (this.rotateLogFile(join(this.logPath, 'app.log'))) {
      this.commonStream.end();
      this.commonStream = createWriteStream(join(this.logPath, 'app.log'), {
        flags: 'a',
      });
    }

    if (
      level === 'error' &&
      this.rotateLogFile(join(this.logPath, 'error.log'))
    ) {
      this.errorStream.end();
      this.errorStream = createWriteStream(join(this.logPath, 'error.log'), {
        flags: 'a',
      });
    }

    this.commonStream.write(logEntry);

    if (level === 'error') {
      this.errorStream.write(logEntry);
    }
  }

  error(message: string, trace?: string, context?: any) {
    this.writeLog('error', message, { trace, ...context });
  }

  warn(message: string, context?: any) {
    this.writeLog('warn', message, context);
  }

  log(message: string, context?: any) {
    this.writeLog('log', message, context);
  }

  debug(message: string, context?: any) {
    this.writeLog('debug', message, context);
  }

  verbose(message: string, context?: any) {
    this.writeLog('verbose', message, context);
  }

  onApplicationShutdown() {
    this.commonStream?.end();
    this.errorStream?.end();
  }
}
