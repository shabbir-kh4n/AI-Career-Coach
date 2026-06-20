/**
 * Centralized AI Service Layer
 * Handles all interactions with Google Generative AI
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import { CONFIG } from "./config";
import { getLogger } from "./logger";
import { AIError } from "./errors";

const logger = getLogger("ai-service");

let genAI = null;
let model = null;

/**
 * Initialize the AI client (singleton pattern)
 */
function initializeAI() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY environment variable is not set");
    }

    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: CONFIG.AI.MODEL_NAME });

    logger.info("✓ AI client initialized", { model: CONFIG.AI.MODEL_NAME });
  }
  return { genAI, model };
}

/**
 * Generate content using the AI model
 */
export async function generateAIContent(prompt, options = {}) {
  try {
    const { model } = initializeAI();

    const startTime = Date.now();
    logger.logAIRequest(CONFIG.AI.MODEL_NAME, prompt.length, options.userId);

    const generationConfig = {
      temperature: options.temperature || CONFIG.AI.TEMPERATURE,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: options.maxTokens || CONFIG.AI.MAX_TOKENS,
      responseMimeType: options.mimeType || "text/plain",
    };

    const result = await Promise.race([
      model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig,
      }),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("AI request timeout")),
          CONFIG.AI.TIMEOUT
        )
      ),
    ]);

    const content = result.response.text().trim();
    const duration = Date.now() - startTime;

    logger.logAIResponse(CONFIG.AI.MODEL_NAME, content.length, duration);

    return {
      success: true,
      content,
      duration,
      model: CONFIG.AI.MODEL_NAME,
    };
  } catch (error) {
    logger.error("AI content generation failed", error, { userId: options.userId });

    if (error.message.includes("timeout")) {
      throw new AIError("AI request timed out. Please try again.", error);
    }

    if (error.message.includes("API key")) {
      throw new AIError("Invalid API key configuration", error);
    }

    if (error.message.includes("quota")) {
      throw new AIError("API quota exceeded. Please try again later.", error);
    }

    throw new AIError("Failed to generate AI content", error);
  }
}

/**
 * Generate JSON content using the AI model
 */
export async function generateAIJSON(prompt, options = {}) {
  try {
    const result = await generateAIContent(prompt, {
      ...options,
      mimeType: "application/json",
    });

    // Extract JSON from the response (sometimes the model wraps it)
    let jsonContent = result.content;

    // Try to find JSON in markdown code blocks
    const jsonMatch = jsonContent.match(/```(?:json)?\n?([\s\S]*?)\n?```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    }

    const parsed = JSON.parse(jsonContent);

    return {
      success: true,
      data: parsed,
      duration: result.duration,
      model: result.model,
    };
  } catch (error) {
    if (error instanceof AIError) {
      throw error;
    }

    logger.error("AI JSON generation failed", error, { userId: options.userId });
    throw new AIError("Failed to generate valid JSON from AI", error);
  }
}

/**
 * Generate cover letter
 */
export async function generateCoverLetter(data, userId) {
  try {
    const prompt = fillPromptTemplate(CONFIG.PROMPTS.COVER_LETTER.TEMPLATE, {
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      industry: data.industry,
      experience: data.experience,
      skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills,
      bio: data.bio,
      jobDescription: data.jobDescription,
    });

    const result = await generateAIContent(prompt, { userId });

    logger.logUserAction(userId, "generate_cover_letter", {
      companyName: data.companyName,
      jobTitle: data.jobTitle,
    });

    return result;
  } catch (error) {
    logger.error("Cover letter generation failed", error, { userId });
    throw error;
  }
}

/**
 * Generate resume content
 */
export async function generateResumeContent(data, userId) {
  try {
    const prompt = fillPromptTemplate(CONFIG.PROMPTS.RESUME.TEMPLATE, {
      role: data.role,
      company: data.company,
      duration: data.duration,
      description: data.description,
    });

    const result = await generateAIJSON(prompt, { userId });

    logger.logUserAction(userId, "generate_resume_content", {
      company: data.company,
      role: data.role,
    });

    return result;
  } catch (error) {
    logger.error("Resume content generation failed", error, { userId });
    throw error;
  }
}

/**
 * Generate interview question
 */
export async function generateInterviewQuestion(data, userId) {
  try {
    const prompt = fillPromptTemplate(CONFIG.PROMPTS.INTERVIEW.TEMPLATE, {
      topic: data.topic,
      difficulty: data.difficulty,
      context: data.context || "General technical knowledge",
    });

    const result = await generateAIJSON(prompt, { userId });

    logger.logUserAction(userId, "generate_interview_question", {
      topic: data.topic,
      difficulty: data.difficulty,
    });

    return result;
  } catch (error) {
    logger.error("Interview question generation failed", error, { userId });
    throw error;
  }
}

/**
 * Generate dashboard insights
 */
export async function generateDashboardInsights(data, userId) {
  try {
    const prompt = fillPromptTemplate(CONFIG.PROMPTS.DASHBOARD.TEMPLATE, {
      industry: data.industry,
      years: data.experience,
      skills: Array.isArray(data.skills) ? data.skills.join(", ") : data.skills,
      assessments: JSON.stringify(data.recentAssessments || []),
    });

    const result = await generateAIJSON(prompt, { userId });

    logger.logUserAction(userId, "generate_dashboard_insights", {
      industry: data.industry,
    });

    return result;
  } catch (error) {
    logger.error("Dashboard insights generation failed", error, { userId });
    throw error;
  }
}

/**
 * Helper function to fill prompt templates
 */
function fillPromptTemplate(template, variables) {
  let filledTemplate = template;

  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{${key}}`, "g");
    filledTemplate = filledTemplate.replace(placeholder, String(value));
  }

  return filledTemplate;
}

/**
 * Get AI client status
 */
export function getAIClientStatus() {
  const isInitialized = genAI !== null;

  return {
    initialized: isInitialized,
    model: CONFIG.AI.MODEL_NAME,
    apiKeyConfigured: !!process.env.GEMINI_API_KEY,
  };
}

export default {
  generateAIContent,
  generateAIJSON,
  generateCoverLetter,
  generateResumeContent,
  generateInterviewQuestion,
  generateDashboardInsights,
  getAIClientStatus,
};
