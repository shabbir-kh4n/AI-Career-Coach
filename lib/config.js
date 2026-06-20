/**
 * Centralized configuration and constants
 */

export const CONFIG = {
  APP: {
    NAME: "AI Career Coach",
    VERSION: "0.1.0",
    DESCRIPTION: "Helps users create resumes, cover letters, and practice interviews with AI",
  },

  AI: {
    PROVIDER: "google",
    MODEL_NAME: "gemini-2.5-flash",
    TEMPERATURE: 0.7,
    MAX_TOKENS: 2048,
    TIMEOUT: 30000, // 30 seconds
  },

  PROMPTS: {
    COVER_LETTER: {
      SYSTEM: "You are a professional cover letter writer. Write compelling, tailored cover letters that highlight candidate achievements.",
      TEMPLATE: `
Write a professional cover letter for a {jobTitle} position at {companyName}.

About the candidate:
- Industry: {industry}
- Years of Experience: {experience}
- Skills: {skills}
- Professional Background: {bio}

Job Description:
{jobDescription}

Requirements:
1. Use a professional, enthusiastic tone
2. Highlight relevant skills and experience
3. Show understanding of the company's needs
4. Keep it concise (max 400 words)
5. Use proper business letter formatting in markdown
6. Include specific examples of achievements
7. Relate candidate's background to job requirements

Format the letter in markdown.
      `,
    },

    RESUME: {
      SYSTEM: "You are an expert resume writer. Create impactful resume content that showcases achievements and skills.",
      TEMPLATE: `
Create a professional resume entry for the following details:

Role: {role}
Company: {company}
Duration: {duration}
Description: {description}

Requirements:
1. Write 3-4 bullet points (action-oriented)
2. Use strong action verbs
3. Quantify achievements when possible
4. Highlight impact and results
5. Keep it concise and relevant

Return as a JSON object with "bullets" array.
      `,
    },

    INTERVIEW: {
      SYSTEM: "You are a technical interview expert. Create comprehensive technical questions with multiple choice answers.",
      TEMPLATE: `
Create a technical interview question for the {topic} topic.

Difficulty: {difficulty}
Context: {context}

Requirements:
1. Create a practical technical question
2. Provide 4 multiple choice options (A, B, C, D)
3. Mark the correct answer
4. Explain why the correct answer is right
5. Add a learning tip

Return as a JSON object with: question, options (array), correctAnswer, explanation, tip
      `,
    },

    DASHBOARD: {
      SYSTEM: "You are a career insights analyst. Provide actionable insights based on user data.",
      TEMPLATE: `
Analyze this user's career profile and provide insights:

Industry: {industry}
Experience: {years}
Skills: {skills}
Recent Assessments: {assessments}

Provide:
1. Key strengths
2. Areas for growth
3. Recommended next steps
4. Industry trends

Return as a JSON object.
      `,
    },
  },

  DATABASE: {
    TIMEOUT: 10000, // 10 seconds
    RETRIES: 3,
  },

  VALIDATION: {
    MIN_NAME_LENGTH: 2,
    MAX_NAME_LENGTH: 100,
    MIN_BIO_LENGTH: 10,
    MAX_BIO_LENGTH: 5000,
    MIN_SKILLS: 1,
    MAX_SKILLS: 50,
  },

  FEATURES: {
    ENABLE_COVER_LETTER: true,
    ENABLE_RESUME: true,
    ENABLE_INTERVIEW: true,
    ENABLE_DASHBOARD: true,
  },

  LOGGING: {
    LEVEL: process.env.LOG_LEVEL || "info", // debug, info, warn, error
    FORMAT: "json", // json or text
  },

  API: {
    TIMEOUT: 30000,
    RETRIES: 3,
    RATE_LIMIT: 100, // requests per minute
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMIT: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized access",
  USER_NOT_FOUND: "User not found",
  INVALID_INPUT: "Invalid input provided",
  AI_ERROR: "AI service error",
  DATABASE_ERROR: "Database error occurred",
  RATE_LIMITED: "Too many requests. Please try again later.",
  NOT_FOUND: "Resource not found",
  INTERNAL_ERROR: "An unexpected error occurred",
};

export default CONFIG;
