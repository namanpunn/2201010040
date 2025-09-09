const LOG_API_URL = 'http://20.244.56.144/evaluation-service/logs';

interface LogEntry {
  stack: string;
  level: string;
  package: string;
  message: string;
}

async function sendLog(entry: LogEntry): Promise<void> {
  try {
    await fetch(LOG_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        stack: entry.stack.toLowerCase(),
        level: entry.level.toLowerCase(),
        package: entry.package.toLowerCase(),
        message: entry.message
      }),
    });
  } catch (error) {
    console.error('Failed to send log:', error);
  }
}

export const LogInfo = (packageName: string, message: string) => {
  console.log(`[INFO] ${packageName}: ${message}`);
  sendLog({
    stack: 'frontend',
    level: 'info',
    package: packageName,
    message
  });
};

export const LogError = (packageName: string, message: string) => {
  console.error(`[ERROR] ${packageName}: ${message}`);
  sendLog({
    stack: 'frontend',
    level: 'error',
    package: packageName,
    message
  });
};

export const LogWarn = (packageName: string, message: string) => {
  console.warn(`[WARN] ${packageName}: ${message}`);
  sendLog({
    stack: 'frontend',
    level: 'warn',
    package: packageName,
    message
  });
};