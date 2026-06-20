/**
 * Custom error classes for better error handling and logging
 */

export class AppError extends Error {
  constructor(message, statusCode = 500, context = {}) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.context = context;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message, details = {}) {
    super(message, 400, details);
    this.name = "ValidationError";
  }
}

export class AuthError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, { type: "auth_error" });
    this.name = "AuthError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, { type: "not_found" });
    this.name = "NotFoundError";
  }
}

export class AIError extends AppError {
  constructor(message, originalError = null) {
    super(message, 500, { 
      type: "ai_error",
      originalMessage: originalError?.message 
    });
    this.name = "AIError";
    this.originalError = originalError;
  }
}

export class DatabaseError extends AppError {
  constructor(message, originalError = null) {
    super(message, 500, { 
      type: "database_error",
      originalMessage: originalError?.message 
    });
    this.name = "DatabaseError";
    this.originalError = originalError;
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Too many requests", retryAfter = 60) {
    super(message, 429, { retryAfter });
    this.name = "RateLimitError";
    this.retryAfter = retryAfter;
  }
}

export function isAppError(error) {
  return error instanceof AppError;
}

export function handleError(error, context = {}) {
  if (isAppError(error)) {
    return {
      success: false,
      error: error.toJSON(),
      ...context,
    };
  }

  // Unknown error
  const appError = new AppError(
    error?.message || "An unexpected error occurred",
    500,
    { originalError: error?.toString() }
  );

  return {
    success: false,
    error: appError.toJSON(),
    ...context,
  };
}
