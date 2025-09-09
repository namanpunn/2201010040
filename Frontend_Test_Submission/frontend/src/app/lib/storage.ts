export interface URLData {
  id: string;
  originalUrl: string;
  shortCode: string;
  createdAt: string;
  expiryDate: string;
  validityMinutes: number;
  clickCount: number;
  clicks: ClickData[];
}

export interface ClickData {
  timestamp: string;
  source: string;
  location: string;
}

const STORAGE_KEY = 'url_shortener_urls';

export const saveURLs = (urls: URLData[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
  }
};

export const loadURLs = (): URLData[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const generateShortCode = (): string => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isExpired = (expiryDate: string): boolean => {
  return new Date() > new Date(expiryDate);
};