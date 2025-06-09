// Simple system log utility for demo purposes
import { getLocalStorageItem, setLocalStorageItem } from "./localStorage";

const LOGS_KEY = "healthMatchDirectSystemLogs";

export interface SystemLog {
  timestamp: string;
  message: string;
  user?: { id: string; name: string; email: string; role: string };
}

export function addLog(message: string, user?: { id: string; name: string; email: string; role: string }) {
  const logs: SystemLog[] = getLocalStorageItem<SystemLog[]>(LOGS_KEY, []);
  logs.unshift({ timestamp: new Date().toISOString(), message, user });
  setLocalStorageItem<SystemLog[]>(LOGS_KEY, logs);
}

export function getLogs(): SystemLog[] {
  return getLocalStorageItem<SystemLog[]>(LOGS_KEY, []);
}

export function clearLogs() {
  setLocalStorageItem<SystemLog[]>(LOGS_KEY, []);
} 