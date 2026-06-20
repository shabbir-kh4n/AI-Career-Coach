/**
 * Structured logging utility
 */

import { CONFIG } from "./config";

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const LEVEL_NAME = {
  0: "DEBUG",
  1: "INFO",
  2: "WARN",
  3: "ERROR",
};

const COLOR = {
  DEBUG: "\x1b[36m", // Cyan
  INFO: "\x1b[32m", // Green
  WARN: "\x1b[33m", // Yellow
  ERROR: "\x1b[31m", // Red
  RESET: "\x1b[0m",
};

class Logger {
  constructor(name) {
    this.name = name;
    this.currentLevel = LOG_LEVELS[CONFIG.LOGGING.LEVEL.toUpperCase()] || LOG_LEVELS.INFO;
  }

  _format(level, message, data) {
    const timestamp = new Date().toISOString();
    const levelName = LEVEL_NAME[level];

    const logEntry = {
      timestamp,
      level: levelName,
      logger: this.name,
      message,
      ...(data && Object.keys(data).length > 0 ? { data } : {}),
    };

    if (CONFIG.LOGGING.FORMAT === "json") {
      return JSON.stringify(logEntry);
    }

    // Text format with colors
    const color = COLOR[levelName] || "";
    return `${color}[${timestamp}] [${levelName}] ${this.name}: ${message}${
      data ? " " + JSON.stringify(data) : ""
    }${COLOR.RESET}`;
  }

  debug(message, data) {
    if (this.currentLevel <= LOG_LEVELS.DEBUG) {
      console.log(this._format(LOG_LEVELS.DEBUG, message, data));
    }
  }

  info(message, data) {
    if (this.currentLevel <= LOG_LEVELS.INFO) {
      console.log(this._format(LOG_LEVELS.INFO, message, data));
    }
  }

  warn(message, data) {
    if (this.currentLevel <= LOG_LEVELS.WARN) {
      console.warn(this._format(LOG_LEVELS.WARN, message, data));
    }
  }

  error(message, error, data) {
    if (this.currentLevel <= LOG_LEVELS.ERROR) {
      const errorData = {
        ...data,
        errorMessage: error?.message,
        errorStack: error?.stack,
        errorName: error?.name,
      };
      console.error(this._format(LOG_LEVELS.ERROR, message, errorData));
    }
  }

  // Helper methods
  logServerAction(actionName, userId, status = "start") {
    this.info(`Server Action: ${actionName}`, { userId, status });
  }

  logAIRequest(model, promptLength, userId) {
    this.debug(`AI Request`, { model, promptLength, userId });
  }

  logAIResponse(model, responseLength, duration) {
    this.debug(`AI Response`, { model, responseLength, durationMs: duration });
  }

  logDatabaseQuery(query, duration, rowsAffected) {
    this.debug(`Database Query`, { query, durationMs: duration, rowsAffected });
  }

  logUserAction(userId, action, details) {
    this.info(`User Action: ${action}`, { userId, ...details });
  }
}

let loggerInstances = {};

export function getLogger(name = "app") {
  if (!loggerInstances[name]) {
    loggerInstances[name] = new Logger(name);
  }
  return loggerInstances[name];
}

export default getLogger;
