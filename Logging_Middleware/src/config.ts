import { LoggerConfig } from './core/types';

export const DEFAULT_CONFIG: LoggerConfig = {
  apiUrl: 'http://20.244.56.144/evaluation-service/logs',
  timeout: 5000,
  retries: 3,
  enableConsoleLogging: true
};

export const VALID_STACKS = ['backend', 'frontend'] as const;
export const VALID_LEVELS = ['debug', 'info', 'warn', 'error', 'fatal'] as const;

export const BACKEND_PACKAGES = [
  'cache',
  'controller',
  'cron_job',
  'db',
  'domain',
  'handler',
  'repository',
  'route',
  'service'
] as const;

export const FRONTEND_PACKAGES = [
  'api',
  'component',
  'hook',
  'page',
  'state',
  'style'
] as const;

export const SHARED_PACKAGES = [
  'auth',
  'config',
  'middleware',
  'utils'
] as const;