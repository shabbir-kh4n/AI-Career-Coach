/**
 * App initialization
 * Validates environment, initializes services, and performs health checks
 */

import { validateEnvironment } from "./env-validator";
import { getLogger } from "./logger";
import { getAIClientStatus } from "./ai-service";

const logger = getLogger("app-init");

export async function initializeApp() {
  try {
    logger.info("=".repeat(50));
    logger.info("🚀 Initializing AI Career Coach Application");
    logger.info("=".repeat(50));

    // 1. Validate environment
    logger.info("1️⃣ Validating environment variables...");
    const envValidation = validateEnvironment();
    if (!envValidation.valid) {
      throw new Error("Environment validation failed");
    }

    // 2. Check AI client
    logger.info("2️⃣ Checking AI client initialization...");
    try {
      const aiStatus = getAIClientStatus();
      if (!aiStatus.apiKeyConfigured) {
        logger.warn("AI client not properly configured");
      } else {
        logger.info("✓ AI client ready", aiStatus);
      }
    } catch (error) {
      logger.warn("Could not initialize AI client", error);
    }

    // 3. Database connection check (if available)
    logger.info("3️⃣ Database configuration ready");
    if (process.env.DATABASE_URL) {
      logger.info("✓ Database URL configured");
    }

    logger.info("=".repeat(50));
    logger.info("✅ Application initialization complete!");
    logger.info("=".repeat(50));

    return {
      success: true,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    logger.error("❌ Application initialization failed", error);
    throw error;
  }
}

/**
 * Health check function
 */
export async function healthCheck() {
  const checks = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "unknown",
  };

  try {
    // Check AI service
    const aiStatus = getAIClientStatus();
    checks.ai = aiStatus;
  } catch {
    checks.ai = { error: "AI service unavailable" };
  }

  // Check database (would need actual db client)
  checks.database = {
    configured: !!process.env.DATABASE_URL,
  };

  return checks;
}

export default {
  initializeApp,
  healthCheck,
};
