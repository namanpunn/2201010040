import { VALID_STACKS, VALID_LEVELS, BACKEND_PACKAGES, FRONTEND_PACKAGES, SHARED_PACKAGES } from '../config';
import { LogStack, LogLevel } from '../core/types';

export function validateStack(stack: string): boolean {
  return VALID_STACKS.includes(stack.toLowerCase() as LogStack);
}

export function validateLevel(level: string): boolean {
  return VALID_LEVELS.includes(level.toLowerCase() as LogLevel);
}


export function validatePackage(packageName: string, stack: string): boolean {
  const normalizedPackage = packageName.toLowerCase();
  const normalizedStack = stack.toLowerCase();

  if (SHARED_PACKAGES.includes(normalizedPackage as any)) {
    return true;
  }

  // Check stack-specific packages
  if (normalizedStack === 'backend') {
    return BACKEND_PACKAGES.includes(normalizedPackage as any);
  }

  if (normalizedStack === 'frontend') {
    return FRONTEND_PACKAGES.includes(normalizedPackage as any);
  }

  return false;
}


export function validateLogParameters(
  stack: string,
  level: string,
  packageName: string,
  message: string
): { isValid: boolean; error?: string } {
  if (!stack || !level || !packageName || !message) {
    return {
      isValid: false,
      error: 'All parameters (stack, level, package, message) are required'
    };
  }

  if (!validateStack(stack)) {
    return {
      isValid: false,
      error: `Invalid stack "${stack}". Must be one of: ${VALID_STACKS.join(', ')}`
    };
  }

  if (!validateLevel(level)) {
    return {
      isValid: false,
      error: `Invalid level "${level}". Must be one of: ${VALID_LEVELS.join(', ')}`
    };
  }

  if (!validatePackage(packageName, stack)) {
    const allowedPackages = stack.toLowerCase() === 'backend' 
      ? [...BACKEND_PACKAGES, ...SHARED_PACKAGES]
      : [...FRONTEND_PACKAGES, ...SHARED_PACKAGES];
    
    return {
      isValid: false,
      error: `Invalid package "${packageName}" for stack "${stack}". Allowed packages: ${allowedPackages.join(', ')}`
    };
  }

  return { isValid: true };
}