export {
  Log,
  LogDebug,
  LogInfo,
  LogWarn,
  LogError,
  LogFatal,
  Logger,
  createLogger,
  updateLoggerConfig
} from './core/logger';

export type {
  LogEntry,
  LogResponse,
  LogLevel,
  LogStack,
  LoggerConfig
} from './core/types';

export {
  DEFAULT_CONFIG,
  VALID_STACKS,
  VALID_LEVELS,
  BACKEND_PACKAGES,
  FRONTEND_PACKAGES,
  SHARED_PACKAGES
} from './config';

export {
  validateStack,
  validateLevel,
  validatePackage,
  validateLogParameters
} from './utils/validation';