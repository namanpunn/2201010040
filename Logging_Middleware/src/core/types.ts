export interface LogEntry {
  stack: string;
  level: string;
  package: string;
  message: string;
}

export interface LogResponse {
  logID: string;
  message: string;
}

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
export type LogStack = 'backend' | 'frontend';

export interface LoggerConfig {
  apiUrl: string;
  timeout?: number;
  retries?: number;
  enableConsoleLogging?: boolean;
}