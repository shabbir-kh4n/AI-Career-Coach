/**
 * Environment variable validator
 * Validates all required environment variables on startup
 */

import { getLogger } from "./logger";

const logger = getLogger("env-validator");

const REQUIRED_ENV_VARS = {
  // Database
  DATABASE_URL: {
    required: true,
    description: "PostgreSQL database URL",
  },

  // AI/Gemini
  GEMINI_API_KEY: {
    required: true,
    description: "Google Generative AI API key",
  },

  // Clerk Authentication
  CLERK_PUBLISHABLE_KEY: {
    required: true,
    description: "Clerk public API key",
  },
  CLERK_SECRET_KEY: {
    required: true,
    description: "Clerk secret API key",
  },

  // Optional but recommended
  LOG_LEVEL: {
    required: false,
    description: "Logging level (debug, info, warn, error)",
    default: "info",
  },

  NODE_ENV: {
    required: false,
    description: "Environment (development, production, test)",
    default: "development",
  },
};

export function validateEnvironment() {
  logger.info("Starting environment validation");

  const missing = [];
  const invalid = [];
  const warnings = [];

  for (const [key, config] of Object.entries(REQUIRED_ENV_VARS)) {
    const value = process.env[key];

    // Check if required and missing
    if (config.required && !value) {
      missing.push(`${key} - ${config.description}`);
      continue;
    }

    // Provide defaults for optional vars
    if (!value && config.default) {
      process.env[key] = config.default;
      logger.info(`Set default for ${key}`, { value: config.default });
    }

    // Validate format if provided
    if (value) {
      validateEnvFormat(key, value, invalid);
    }
  }

  // Database URL checks
  if (process.env.DATABASE_URL) {
    if (!process.env.DATABASE_URL.startsWith("postgresql://")) {
      warnings.push("DATABASE_URL should use postgresql:// protocol");
    }
  }

  // API Key checks
  if (process.env.GEMINI_API_KEY) {
    if (process.env.GEMINI_API_KEY.length < 20) {
      warnings.push("GEMINI_API_KEY seems too short, verify it's correct");
    }
  }

  // Report results
  if (missing.length > 0) {
    logger.error("Missing required environment variables", new Error("Validation failed"), {
      count: missing.length,
      variables: missing,
    });
    throw new Error(
      `Missing required environment variables:\n${missing.map((m) => `  - ${m}`).join("\n")}`
    );
  }

  if (invalid.length > 0) {
    logger.warn("Invalid environment variable formats", { variables: invalid });
  }

  if (warnings.length > 0) {
    logger.warn("Environment warnings", { warnings });
  }

  logger.info("✓ Environment validation passed", {
    environment: process.env.NODE_ENV,
    hasDatabase: !!process.env.DATABASE_URL,
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
  });

  return {
    valid: true,
    warnings,
  };
}

function validateEnvFormat(key, value, invalid) {
  const checks = {
    DATABASE_URL: (v) => v.includes("://") && (v.includes("localhost") || v.includes(".") || v.includes(":")),
    GEMINI_API_KEY: (v) => v.length > 10 && /^[a-zA-Z0-9_-]+$/.test(v),
    CLERK_PUBLISHABLE_KEY: (v) => v.startsWith("pk_"),
    CLERK_SECRET_KEY: (v) => v.startsWith("sk_"),
  };

  if (checks[key] && !checks[key](value)) {
    invalid.push(`${key} has invalid format`);
  }
}

// Auto-validate on import if in production
if (process.env.NODE_ENV === "production") {
  validateEnvironment();
}

export default validateEnvironment;
