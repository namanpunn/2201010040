import { LogEntry, LogResponse, LoggerConfig } from './types';
import { validateLogParameters } from '../utils/validation';
import { DEFAULT_CONFIG } from '../config';

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async log(
    stack: string,
    level: string,
    packageName: string,
    message: string
  ): Promise<LogResponse | null> {
    const validation = validateLogParameters(stack, level, packageName, message);
    if (!validation.isValid) {
      if (this.config.enableConsoleLogging) {
        console.error(`Log validation error: ${validation.error}`);
      }
      return null;
    }

    const logEntry: LogEntry = {
      stack: stack.toLowerCase(),
      level: level.toLowerCase(),
      package: packageName.toLowerCase(),
      message: message
    };

  
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt < (this.config.retries || 3); attempt++) {
      try {
        const response = await this.sendLogToServer(logEntry);
        
        if (this.config.enableConsoleLogging) {
          console.log(`Log sent successfully: ${response.logID}`);
        }
        
        return response;
        
      } catch (error) {
        lastError = error as Error;
        
        if (this.config.enableConsoleLogging) {
          console.warn(`Log attempt ${attempt + 1} failed:`, error);
        }
        

        if (attempt < (this.config.retries || 3) - 1) {
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }


    if (this.config.enableConsoleLogging) {
      console.error('All log attempts failed:', lastError);
    }
    
    return null;
  }

  private async sendLogToServer(logEntry: LogEntry): Promise<LogResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: LogResponse = await response.json();
      return result;

    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateConfig(newConfig: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): LoggerConfig {
    return { ...this.config };
  }
}

const defaultLogger = new Logger();

export async function Log(
  stack: string,
  level: string,
  packageName: string,
  message: string
): Promise<LogResponse | null> {
  return defaultLogger.log(stack, level, packageName, message);
}

export const LogDebug = (stack: string, packageName: string, message: string) =>
  Log(stack, 'debug', packageName, message);

export const LogInfo = (stack: string, packageName: string, message: string) =>
  Log(stack, 'info', packageName, message);

export const LogWarn = (stack: string, packageName: string, message: string) =>
  Log(stack, 'warn', packageName, message);

export const LogError = (stack: string, packageName: string, message: string) =>
  Log(stack, 'error', packageName, message);

export const LogFatal = (stack: string, packageName: string, message: string) =>
  Log(stack, 'fatal', packageName, message);

export function createLogger(config: Partial<LoggerConfig> = {}): Logger {
  return new Logger(config);
}

export function updateLoggerConfig(config: Partial<LoggerConfig>): void {
  defaultLogger.updateConfig(config);
}

export { Logger };